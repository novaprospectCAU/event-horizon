/**
 * EventEvaluator - evaluates GameEvent triggers against the current WorldState
 * to determine which events should fire. Respects cooldowns and occurrence limits.
 */

import type {
  WorldState,
  GameEvent,
  Trigger,
  ComparisonOp,
  EventRecord,
} from '@event-horizon/types';
import { nextRandom } from '../rng.js';

export class EventEvaluator {
  /**
   * Evaluate all registered events and return those that should fire,
   * ordered by priority (higher first).
   */
  evaluate(state: WorldState): { events: readonly GameEvent[]; state: WorldState } {
    const firingEvents: GameEvent[] = [];
    let currentState = state;

    for (const event of state.events) {
      // Check cooldown
      if (!this.checkCooldown(event, state)) continue;

      // Check max occurrences
      if (!this.checkMaxOccurrences(event, state)) continue;

      // Evaluate all triggers (AND logic)
      const { result, state: newState } = this.evaluateTriggers(
        event.triggers,
        currentState,
      );
      currentState = newState;

      if (result) {
        firingEvents.push(event);
      }
    }

    // Sort by priority (higher first), default priority is 0
    firingEvents.sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
    );

    return { events: firingEvents, state: currentState };
  }

  /**
   * Check if the event is off cooldown.
   */
  private checkCooldown(event: GameEvent, state: WorldState): boolean {
    if (!event.cooldown) return true;

    const lastFired = this.getLastFiredTurn(event.id, state);
    if (lastFired === null) return true;

    return state.turn.currentTurn - lastFired >= event.cooldown;
  }

  /**
   * Check if the event hasn't exceeded its max occurrences.
   */
  private checkMaxOccurrences(event: GameEvent, state: WorldState): boolean {
    if (event.maxOccurrences === undefined) return true;

    const count = this.getOccurrenceCount(event.id, state);
    return count < event.maxOccurrences;
  }

  /**
   * Get the last turn this event fired.
   */
  private getLastFiredTurn(eventId: string, state: WorldState): number | null {
    const records = state.eventHistory.filter((r) => r.eventId === eventId);
    if (records.length === 0) return null;
    return Math.max(...records.map((r) => r.turn));
  }

  /**
   * Get total occurrence count for this event.
   */
  private getOccurrenceCount(eventId: string, state: WorldState): number {
    const records = state.eventHistory.filter((r) => r.eventId === eventId);
    if (records.length === 0) return 0;
    return Math.max(...records.map((r) => r.occurrenceCount));
  }

  /**
   * Evaluate all triggers (AND logic). All must be true for the overall result.
   */
  evaluateTriggers(
    triggers: readonly Trigger[],
    state: WorldState,
  ): { result: boolean; state: WorldState } {
    let currentState = state;

    for (const trigger of triggers) {
      const { result, state: newState } = this.evaluateTrigger(trigger, currentState);
      currentState = newState;
      if (!result) return { result: false, state: currentState };
    }

    return { result: true, state: currentState };
  }

  /**
   * Evaluate a single trigger against the current world state.
   */
  evaluateTrigger(
    trigger: Trigger,
    state: WorldState,
  ): { result: boolean; state: WorldState } {
    switch (trigger.type) {
      case 'turn-reached':
        return {
          result: trigger.turn !== undefined && state.turn.currentTurn >= trigger.turn,
          state,
        };

      case 'stat-threshold':
        return { result: this.evaluateStatThreshold(trigger, state), state };

      case 'relation-threshold':
        return { result: this.evaluateRelationThreshold(trigger, state), state };

      case 'entity-exists':
        return { result: this.evaluateEntityExists(trigger, state), state };

      case 'tag-present':
        return { result: this.evaluateTagPresent(trigger, state), state };

      case 'event-fired':
        return { result: this.evaluateEventFired(trigger, state), state };

      case 'random-chance': {
        if (trigger.chance === undefined) return { result: false, state };
        const [roll, newRng] = nextRandom(state.rng);
        return {
          result: roll < trigger.chance,
          state: { ...state, rng: newRng },
        };
      }

      case 'custom':
        // Custom triggers always return false without an external handler
        return { result: false, state };

      default:
        return { result: false, state };
    }
  }

  private evaluateStatThreshold(trigger: Trigger, state: WorldState): boolean {
    if (!trigger.statId || !trigger.comparison || trigger.value === undefined) {
      return false;
    }

    // Find matching entities
    const entities = this.resolveEntities(trigger, state);
    if (entities.length === 0) return false;

    // Check if any matching entity satisfies the condition
    return entities.some((entity) => {
      const statValue = entity.stats[trigger.statId!];
      if (statValue === undefined) return false;
      return this.compare(statValue, trigger.comparison!, trigger.value!);
    });
  }

  private evaluateRelationThreshold(trigger: Trigger, state: WorldState): boolean {
    if (!trigger.relationTypeId || !trigger.comparison || trigger.value === undefined) {
      return false;
    }

    // Find matching relations
    const relations = state.relations.filter((r) => {
      if (r.typeId !== trigger.relationTypeId) return false;
      if (trigger.sourceId && r.sourceId !== trigger.sourceId) return false;
      if (trigger.targetId && r.targetId !== trigger.targetId) return false;
      return true;
    });

    if (relations.length === 0) return false;

    return relations.some((r) =>
      this.compare(r.weight, trigger.comparison!, trigger.value!),
    );
  }

  private evaluateEntityExists(trigger: Trigger, state: WorldState): boolean {
    if (trigger.entityId) {
      return state.entities[trigger.entityId] !== undefined;
    }
    if (trigger.entityTypeId) {
      return Object.values(state.entities).some(
        (e) => e.typeId === trigger.entityTypeId,
      );
    }
    if (trigger.entityTag) {
      return Object.values(state.entities).some(
        (e) => e.tags.includes(trigger.entityTag!),
      );
    }
    return false;
  }

  private evaluateTagPresent(trigger: Trigger, state: WorldState): boolean {
    if (!trigger.tag) return false;

    const entities = this.resolveEntities(trigger, state);
    return entities.some((e) => e.tags.includes(trigger.tag!));
  }

  private evaluateEventFired(trigger: Trigger, state: WorldState): boolean {
    if (!trigger.eventId) return false;
    return state.eventHistory.some((r) => r.eventId === trigger.eventId);
  }

  /**
   * Resolve entities matching the trigger's entity targeting fields.
   */
  private resolveEntities(
    trigger: Trigger,
    state: WorldState,
  ): readonly import('@event-horizon/types').Entity[] {
    if (trigger.entityId) {
      const entity = state.entities[trigger.entityId];
      return entity ? [entity] : [];
    }
    if (trigger.entityTag) {
      return Object.values(state.entities).filter((e) =>
        e.tags.includes(trigger.entityTag!),
      );
    }
    if (trigger.entityTypeId) {
      return Object.values(state.entities).filter(
        (e) => e.typeId === trigger.entityTypeId,
      );
    }
    return Object.values(state.entities);
  }

  /**
   * Perform a comparison operation.
   */
  private compare(a: number, op: ComparisonOp, b: number): boolean {
    switch (op) {
      case 'eq':
        return a === b;
      case 'neq':
        return a !== b;
      case 'gt':
        return a > b;
      case 'gte':
        return a >= b;
      case 'lt':
        return a < b;
      case 'lte':
        return a <= b;
      default:
        return false;
    }
  }
}
