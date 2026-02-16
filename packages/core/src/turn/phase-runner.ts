/**
 * PhaseRunner - runs individual phases within a turn.
 * Coordinates the systems that need to execute during each phase type.
 */

import type {
  WorldState,
  Action,
  ActionResult,
  EventRecord,
  GameEvent,
} from '@event-horizon/types';
import type { ActionResolver } from '../action/action-resolver.js';
import type { EventEvaluator } from '../event/event-evaluator.js';
import type { EffectExecutor } from '../event/effect-executor.js';
import type { EntityManager } from '../entity/entity-manager.js';
import type { RelationGraph } from '../relation/relation-graph.js';
import type { EventBus } from '../event/event-bus.js';

/** Result of running a phase */
export interface PhaseResult {
  readonly state: WorldState;
  readonly actionResults: readonly ActionResult[];
  readonly firedEvents: readonly GameEvent[];
}

export class PhaseRunner {
  constructor(
    private readonly actionResolver: ActionResolver,
    private readonly eventEvaluator: EventEvaluator,
    private readonly effectExecutor: EffectExecutor,
    private readonly entityManager: EntityManager,
    private readonly relationGraph: RelationGraph,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Run a player-action phase with submitted actions.
   * Resolves actions and applies their effects.
   */
  runPlayerActionPhase(
    state: WorldState,
    actions: readonly Action[],
  ): PhaseResult {
    let currentState = state;
    const allActionResults: ActionResult[] = [];

    // Resolve each action and apply its effects
    for (const action of actions) {
      const { result, rngState } = this.actionResolver.resolve(currentState, action);
      currentState = rngState;
      allActionResults.push(result);

      // Apply effects from successful actions
      if (result.success && result.effects.length > 0) {
        const effectResult = this.effectExecutor.execute(
          currentState,
          result.effects,
          `action:${action.typeId}`,
        );
        currentState = effectResult.state;
      }
    }

    return {
      state: currentState,
      actionResults: allActionResults,
      firedEvents: [],
    };
  }

  /**
   * Run an NPC action phase.
   * NPC actions are provided externally (by the NPC controller).
   */
  runNPCActionPhase(
    state: WorldState,
    npcActions: readonly Action[],
  ): PhaseResult {
    // NPC actions are resolved the same way as player actions
    return this.runPlayerActionPhase(state, npcActions);
  }

  /**
   * Run an event resolution phase.
   * Evaluates all events and fires those whose triggers are satisfied.
   */
  runEventResolutionPhase(state: WorldState): PhaseResult {
    let currentState = state;
    const firedEvents: GameEvent[] = [];

    // Evaluate which events should fire
    const { events, state: evalState } = this.eventEvaluator.evaluate(currentState);
    currentState = evalState;

    // Process each firing event
    for (const event of events) {
      // Apply default effects (non-choice events)
      if (!event.choices || event.choices.length === 0) {
        const effectResult = this.effectExecutor.execute(
          currentState,
          event.effects,
          `event:${event.id}`,
        );
        currentState = effectResult.state;
      }

      // Record the event firing
      const existingRecord = currentState.eventHistory.find(
        (r) => r.eventId === event.id,
      );
      const newRecord: EventRecord = {
        eventId: event.id,
        turn: currentState.turn.currentTurn,
        occurrenceCount: existingRecord
          ? existingRecord.occurrenceCount + 1
          : 1,
      };

      // Update event history
      const newHistory = existingRecord
        ? currentState.eventHistory.map((r) =>
            r.eventId === event.id ? newRecord : r,
          )
        : [...currentState.eventHistory, newRecord];

      currentState = { ...currentState, eventHistory: newHistory };
      firedEvents.push(event);

      // Emit event-fired
      this.eventBus.emit('event:fired', { event });
    }

    return {
      state: currentState,
      actionResults: [],
      firedEvents,
    };
  }

  /**
   * Run a world-update phase.
   * Applies stat decay, relation decay, and other end-of-cycle updates.
   */
  runWorldUpdatePhase(state: WorldState): PhaseResult {
    let currentState = state;

    // Apply stat decay
    currentState = this.entityManager.applyStatDecay(currentState);

    // Apply relation decay
    currentState = this.relationGraph.applyRelationDecay(currentState);

    return {
      state: currentState,
      actionResults: [],
      firedEvents: [],
    };
  }

  /**
   * Run a custom phase. Custom phases are no-ops at the engine level
   * but emit events that external handlers can use.
   */
  runCustomPhase(state: WorldState): PhaseResult {
    return {
      state,
      actionResults: [],
      firedEvents: [],
    };
  }
}
