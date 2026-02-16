import { Engine, ActionRegistry } from '@event-horizon/core';
import {
  EngineAdapter,
  ClientAdapter,
  createDirectConnection,
  createStateUpdate,
  createPhaseChange,
  createAvailableActions,
  createActionResult,
  createEventFired,
  createNarrative,
  createError,
} from '@event-horizon/protocol';
import { sfSchema, sfWorldState } from '@event-horizon/demo-sf';
import type { Action, UIMessage } from '@event-horizon/types';

const PLAYER_FACTION = 'faction-terran';

export class GameController {
  private readonly engine: Engine;
  private readonly engineAdapter: EngineAdapter;
  private readonly clientAdapter: ClientAdapter;
  private readonly connection: ReturnType<typeof createDirectConnection>;
  private readonly actionRegistry: ActionRegistry;
  private pendingEventChoices: Map<string, { eventId: string }> = new Map();
  private disposed = false;

  constructor() {
    this.engine = new Engine({ schema: sfSchema });
    this.engine.setState(structuredClone(sfWorldState));

    this.actionRegistry = new ActionRegistry(this.engine.registry);

    this.engineAdapter = new EngineAdapter();
    this.clientAdapter = new ClientAdapter();
    this.connection = createDirectConnection(this.engineAdapter, this.clientAdapter);

    this.engineAdapter.onUIMessage((msg) => this.handleUIMessage(msg));

    // Send initial state on next microtask so the client has time to subscribe
    queueMicrotask(() => {
      if (!this.disposed) {
        this.sendInitialState();
      }
    });
  }

  getClientAdapter(): ClientAdapter {
    return this.clientAdapter;
  }

  dispose(): void {
    this.disposed = true;
    this.connection.dispose();
    this.engineAdapter.dispose();
    this.clientAdapter.dispose();
    this.engine.dispose();
  }

  private sendInitialState(): void {
    const state = this.engine.getState();
    this.engineAdapter.emit(
      createStateUpdate(state.entities, state.relations, state.turn.currentTurn),
    );
    this.engineAdapter.emit(createPhaseChange(state.turn.currentPhase));
    this.sendAvailableActions();
    this.engineAdapter.emit(
      createNarrative(
        '코프룰루 전쟁에 오신 것을 환영합니다. 당신은 마 사라 민병대 대장입니다. 변경 식민지의 운명이 당신의 손에 달려 있습니다.',
        'system',
      ),
    );
  }

  private sendAvailableActions(): void {
    const state = this.engine.getState();
    const allActions = this.computePlayerActions(state);
    this.engineAdapter.emit(createAvailableActions(PLAYER_FACTION, allActions));
  }

  private computePlayerActions(
    state: ReturnType<typeof this.engine.getState>,
  ): { typeId: string; name: string; targets: readonly string[]; enabled: boolean; disabledReason?: string }[] {
    const results: {
      typeId: string;
      name: string;
      targets: readonly string[];
      enabled: boolean;
      disabledReason?: string;
    }[] = [];

    // If playerEntityId is set, only show that character's actions
    // Otherwise, show actions for all entities in the player faction
    const playerEntities = state.playerEntityId
      ? [state.entities[state.playerEntityId]].filter(Boolean)
      : Object.values(state.entities).filter((e) => {
          if (e.id === PLAYER_FACTION) return true;
          const charInfo = e.components['character-info'];
          if (charInfo && charInfo.values['factionId'] === PLAYER_FACTION) return true;
          const fleetInfo = e.components['fleet'];
          if (fleetInfo && fleetInfo.values['factionId'] === PLAYER_FACTION) return true;
          return false;
        });

    for (const entity of playerEntities) {
      const available = this.actionRegistry.getAvailableActions(state, entity.id);
      for (const action of available) {
        results.push({
          typeId: `${entity.id}::${action.typeId}`,
          name: `${entity.name}: ${action.name}`,
          targets: action.targets,
          enabled: action.enabled,
          disabledReason: action.disabledReason,
        });
      }
    }

    return results;
  }

  private async handleUIMessage(msg: UIMessage): Promise<void> {
    try {
      switch (msg.type) {
        case 'submit-action':
          this.handleSubmitAction(msg.action);
          break;
        case 'end-turn':
          await this.handleEndTurn();
          break;
        case 'select-choice':
          this.handleSelectChoice(msg.eventId, msg.choiceId);
          break;
        default:
          break;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.engineAdapter.emit(createError('engine-error', message));
    }
  }

  private handleSubmitAction(action: Action): void {
    // Parse composite typeId: "entityId::actionTypeId"
    const parts = action.typeId.split('::');
    let performerId = action.performerId;
    let actionTypeId = action.typeId;

    if (parts.length === 2) {
      performerId = parts[0];
      actionTypeId = parts[1];
    }

    const state = this.engine.getState();
    const resolvedAction: Action = {
      ...action,
      typeId: actionTypeId,
      performerId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
    };

    const result = this.engine.submitActions([resolvedAction]);

    for (const actionResult of result.actionResults) {
      this.engineAdapter.emit(createActionResult(actionResult));
    }

    const newState = this.engine.getState();
    this.engineAdapter.emit(
      createStateUpdate(newState.entities, newState.relations, newState.turn.currentTurn),
    );
    this.sendAvailableActions();
  }

  private async handleEndTurn(): Promise<void> {
    // Phase 0: player-action → advance past it
    let result = await this.engine.advancePhase();
    this.engineAdapter.emit(createPhaseChange(result.state.turn.currentPhase));

    // Phase 1: npc-action
    result = await this.engine.advancePhase();
    this.engineAdapter.emit(createPhaseChange(result.state.turn.currentPhase));
    for (const ar of result.actionResults) {
      if (ar.narrative) {
        this.engineAdapter.emit(createNarrative(ar.narrative, 'npc'));
      }
    }

    // Phase 2: event-resolution
    result = await this.engine.advancePhase();
    this.engineAdapter.emit(createPhaseChange(result.state.turn.currentPhase));
    for (const event of result.firedEvents) {
      if (event.choices && event.choices.length > 0) {
        this.pendingEventChoices.set(event.id, { eventId: event.id });
        this.engineAdapter.emit(
          createEventFired(event, event.choices, event.description),
        );
      } else {
        this.engineAdapter.emit(
          createEventFired(event, undefined, event.description),
        );
      }
    }

    // Phase 3: world-update → turn becomes complete
    result = await this.engine.advancePhase();

    // Advance to next turn
    this.engine.advanceTurn();
    const newState = this.engine.getState();

    this.engineAdapter.emit(
      createStateUpdate(newState.entities, newState.relations, newState.turn.currentTurn),
    );
    this.engineAdapter.emit(createPhaseChange(newState.turn.currentPhase));
    this.sendAvailableActions();
    this.engineAdapter.emit(
      createNarrative(
        `은하 주기 ${newState.turn.currentTurn} 시작.`,
        'system',
      ),
    );
  }

  private handleSelectChoice(eventId: string, choiceId: string): void {
    const state = this.engine.getState();
    const event = state.events.find((e) => e.id === eventId);
    if (!event?.choices) return;

    const choice = event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply choice effects
    if (choice.effects.length > 0) {
      const effectResult = this.engine.effectExecutor.execute(
        state,
        choice.effects,
        `choice:${eventId}:${choiceId}`,
      );
      this.engine.setState(effectResult.state);
    }

    if (choice.resultText) {
      this.engineAdapter.emit(createNarrative(choice.resultText, 'event'));
    }

    this.pendingEventChoices.delete(eventId);

    const newState = this.engine.getState();
    this.engineAdapter.emit(
      createStateUpdate(newState.entities, newState.relations, newState.turn.currentTurn),
    );
  }
}
