import { Engine, ActionRegistry, type ActionHandler } from '@event-horizon/core';
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
import type { Action, UIMessage, Effect, WorldState } from '@event-horizon/types';

const PLAYER_FACTION = 'faction-terran';

export class GameController {
  private readonly engine: Engine;
  private readonly engineAdapter: EngineAdapter;
  private readonly clientAdapter: ClientAdapter;
  private readonly connection: ReturnType<typeof createDirectConnection>;
  private readonly actionRegistry: ActionRegistry;
  private pendingEventChoices: Map<string, { eventId: string }> = new Map();
  private hasActedThisTurn = false;
  private disposed = false;

  constructor() {
    this.engine = new Engine({ schema: sfSchema });
    this.engine.setState(structuredClone(sfWorldState));

    this.actionRegistry = new ActionRegistry(this.engine.registry);
    this.registerActionHandlers();

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

  private registerActionHandlers(): void {
    // 접촉 시도: 처음 만나는 인물에게 접촉
    this.engine.registerActionHandler('contact', (action, state) => {
      const performer = state.entities[action.performerId];
      const target = action.targetId ? state.entities[action.targetId] : undefined;
      if (!performer || !target) {
        return { effects: [], narrative: '접촉 대상을 찾을 수 없습니다.' };
      }

      const performerFaction = performer.components['character-info']?.values['factionId'] as string | undefined;
      const targetFaction = target.components['character-info']?.values['factionId'] as string | undefined;

      // 거절 판정: 다른 세력이고 외교 관계 < -50이면 거절
      if (performerFaction && targetFaction && performerFaction !== targetFaction) {
        const dipRel = state.relations.find(
          (r) =>
            r.typeId === 'diplomatic' &&
            ((r.sourceId === performerFaction && r.targetId === targetFaction) ||
              (r.sourceId === targetFaction && r.targetId === performerFaction)),
        );
        if (dipRel && dipRel.weight < -50) {
          return {
            effects: [],
            narrative: `${target.name}이(가) 접촉을 거부했습니다. 세력 간 적대 관계로 인해 대화가 불가능합니다.`,
          };
        }
      }

      // 성공: personal 관계 생성
      return {
        effects: [
          {
            type: 'modify-relation' as const,
            relationTypeId: 'personal',
            sourceId: action.performerId,
            targetId: action.targetId!,
            amount: 5,
          },
        ],
        narrative: `${performer.name}이(가) ${target.name}과(와) 첫 접촉에 성공했습니다.`,
      };
    });

    // 협상: 대상 캐릭터와 개인 관계 개선 + 소속 세력 간 외교 관계 개선
    this.engine.registerActionHandler('negotiate', (action, state) => {
      const performer = state.entities[action.performerId];
      const target = action.targetId ? state.entities[action.targetId] : undefined;
      if (!performer || !target) {
        return { effects: [], narrative: '협상 대상을 찾을 수 없습니다.' };
      }

      const performerFaction = performer.components['character-info']?.values['factionId'] as string | undefined;
      const targetFaction = target.components['character-info']?.values['factionId'] as string | undefined;

      // 거절 체크 1: target→player personal 관계 < -20
      const personalRel = state.relations.find(
        (r) =>
          r.typeId === 'personal' &&
          r.sourceId === action.targetId &&
          r.targetId === action.performerId,
      );
      if (personalRel && personalRel.weight < -20) {
        return {
          effects: [],
          narrative: `${target.name}이(가) 적대적 태도로 협상을 거부했습니다.`,
        };
      }

      // 거절 체크 2: 세력 간 외교 관계 < -60
      if (performerFaction && targetFaction && performerFaction !== targetFaction) {
        const dipRel = state.relations.find(
          (r) =>
            r.typeId === 'diplomatic' &&
            ((r.sourceId === performerFaction && r.targetId === targetFaction) ||
              (r.sourceId === targetFaction && r.targetId === performerFaction)),
        );
        if (dipRel && dipRel.weight < -60) {
          return {
            effects: [],
            narrative: `세력 간 적대 관계로 인해 ${target.name}과(와)의 협상이 불가능합니다.`,
          };
        }
      }

      const effects: Effect[] = [
        {
          type: 'modify-relation',
          relationTypeId: 'personal',
          sourceId: action.performerId,
          targetId: action.targetId!,
          amount: 10,
        },
      ];

      if (performerFaction && targetFaction && performerFaction !== targetFaction) {
        effects.push({
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: performerFaction,
          targetId: targetFaction,
          amount: 5,
        });
      }

      return {
        effects,
        narrative: `${performer.name}이(가) ${target.name}과(와) 협상을 진행했습니다. 관계가 개선되었습니다.`,
      };
    });

    // 첩보: 대상 세력 정보 수집, 자신의 영향력 증가
    this.engine.registerActionHandler('espionage', (action, state) => {
      const performer = state.entities[action.performerId];
      const target = action.targetId ? state.entities[action.targetId] : undefined;
      if (!performer || !target) {
        return { effects: [], narrative: '첩보 대상을 찾을 수 없습니다.' };
      }

      const performerFaction = performer.components['character-info']?.values['factionId'] as string | undefined;

      const effects: Effect[] = [
        { type: 'modify-stat', entityId: target.id, statId: 'stability', amount: -5 },
      ];

      if (performerFaction) {
        effects.push(
          { type: 'modify-stat', entityId: performerFaction, statId: 'influence', amount: 5 },
        );
      }

      return {
        effects,
        narrative: `${performer.name}이(가) ${target.name}에 대한 첩보 활동을 수행했습니다. 유용한 정보를 확보했습니다.`,
      };
    });

    // 결집: 대상 세력의 안정도 증가, 대상 함대의 전투력 증가
    this.engine.registerActionHandler('rally', (action, state) => {
      const performer = state.entities[action.performerId];
      const target = action.targetId ? state.entities[action.targetId] : undefined;
      if (!performer || !target) {
        return { effects: [], narrative: '결집 대상을 찾을 수 없습니다.' };
      }

      const isFaction = target.typeId === 'faction';
      const effects: Effect[] = isFaction
        ? [{ type: 'modify-stat', entityId: target.id, statId: 'stability', amount: 10 }]
        : [{ type: 'modify-stat', entityId: target.id, statId: 'military-power', amount: 10 }];

      const targetDesc = isFaction ? '결속력' : '사기';
      return {
        effects,
        narrative: `${performer.name}이(가) ${target.name}의 ${targetDesc}을(를) 높였습니다.`,
      };
    });
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
    if (this.hasActedThisTurn) {
      this.engineAdapter.emit(createAvailableActions(PLAYER_FACTION, []));
      return;
    }
    const state = this.engine.getState();
    const allActions = this.computePlayerActions(state);
    this.engineAdapter.emit(createAvailableActions(PLAYER_FACTION, allActions));
  }

  /** playerEntityId → personal 관계가 있는 캐릭터 ID 집합 (만난 적 있는 인물) */
  private getMetCharacterIds(state: WorldState): Set<string> {
    const playerEntityId = state.playerEntityId;
    if (!playerEntityId) return new Set();
    const met = new Set<string>();
    for (const rel of state.relations) {
      if (rel.typeId === 'personal' && rel.sourceId === playerEntityId) {
        met.add(rel.targetId);
      }
    }
    return met;
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

    const metIds = this.getMetCharacterIds(state);

    for (const entity of playerEntities) {
      const available = this.actionRegistry.getAvailableActions(state, entity.id);
      for (const action of available) {
        let targets = action.targets;
        let enabled = action.enabled;
        let disabledReason = action.disabledReason;

        if (action.typeId === 'negotiate') {
          targets = targets.filter((id) => metIds.has(id));
          if (targets.length === 0 && enabled) {
            enabled = false;
            disabledReason = '접촉한 인물이 없습니다';
          }
        } else if (action.typeId === 'contact') {
          targets = targets.filter((id) => !metIds.has(id));
          if (targets.length === 0 && enabled) {
            enabled = false;
            disabledReason = '모든 인물과 이미 접촉했습니다';
          }
        }

        results.push({
          typeId: `${entity.id}::${action.typeId}`,
          name: `${entity.name}: ${action.name}`,
          targets,
          enabled,
          disabledReason,
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

    const succeeded = result.actionResults.some((r) => r.success);
    for (const actionResult of result.actionResults) {
      this.engineAdapter.emit(createActionResult(actionResult));
    }

    const newState = this.engine.getState();
    this.engineAdapter.emit(
      createStateUpdate(newState.entities, newState.relations, newState.turn.currentTurn),
    );

    if (succeeded) {
      // 행동 성공 시 이번 턴 행동 완료 — 턴 종료만 가능
      this.hasActedThisTurn = true;
      this.engineAdapter.emit(createAvailableActions(PLAYER_FACTION, []));
    } else {
      // 실패 시 다시 시도 가능
      this.sendAvailableActions();
    }
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
    this.hasActedThisTurn = false;
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
