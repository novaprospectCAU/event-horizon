/**
 * BehaviorEngine - evaluates behavior rules for NPCs and selects actions.
 * Uses deterministic fallback when AI is not available.
 */

import type {
  WorldState,
  Action,
  BehaviorRule,
  NPCBehaviorProfile,
  Entity,
  TargetStrategy,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';
import type { RelationGraph } from '../relation/relation-graph.js';
import type { EventEvaluator } from '../event/event-evaluator.js';
import { nextRandom, weightedPick, generateId } from '../rng.js';

export class BehaviorEngine {
  constructor(
    private readonly registry: SchemaRegistry,
    private readonly relationGraph: RelationGraph,
    private readonly eventEvaluator: EventEvaluator,
  ) {}

  /**
   * Evaluate behavior rules for an NPC and select an action.
   * Uses deterministic weighted selection from matching rules.
   */
  selectAction(
    state: WorldState,
    profile: NPCBehaviorProfile,
  ): { action: Action | null; state: WorldState } {
    const entity = state.entities[profile.entityId];
    if (!entity) return { action: null, state };

    // Evaluate which rules match current conditions
    const matchingRules = this.evaluateRules(profile.behaviorRules, state);
    if (matchingRules.length === 0) return { action: null, state };

    // Weighted random selection among matching rules
    const weights = matchingRules.map((r) => r.weight);
    const [selectedRule, rng1] = weightedPick(state.rng, matchingRules, weights);
    let currentState = { ...state, rng: rng1 };

    // Select target based on the rule's strategy
    const { targetId, state: stateAfterTarget } = this.selectTarget(
      currentState,
      entity,
      selectedRule,
    );
    currentState = stateAfterTarget;

    // Generate action
    const [actionId, rng2] = generateId(currentState.rng, 'act_');
    currentState = { ...currentState, rng: rng2 };

    const action: Action = {
      id: actionId,
      typeId: selectedRule.actionTypeId,
      performerId: profile.entityId,
      targetId,
      params: selectedRule.params,
      turn: currentState.turn.currentTurn,
      phase: currentState.turn.currentPhase.phaseId,
    };

    return { action, state: currentState };
  }

  /**
   * Evaluate all behavior rules and return those whose conditions match.
   */
  private evaluateRules(
    rules: readonly BehaviorRule[],
    state: WorldState,
  ): readonly BehaviorRule[] {
    const matching: BehaviorRule[] = [];

    for (const rule of rules) {
      const { result } = this.eventEvaluator.evaluateTriggers(
        rule.conditions,
        state,
      );
      if (result) {
        // Also check that the action type exists
        const actionType = this.registry.getActionTypeDef(rule.actionTypeId);
        if (actionType) {
          matching.push(rule);
        }
      }
    }

    return matching;
  }

  /**
   * Select a target entity based on the rule's target strategy.
   */
  private selectTarget(
    state: WorldState,
    performer: Entity,
    rule: BehaviorRule,
  ): { targetId: string | undefined; state: WorldState } {
    const actionType = this.registry.getActionTypeDef(rule.actionTypeId);
    if (!actionType?.targetTypes || actionType.targetTypes.length === 0) {
      return { targetId: undefined, state };
    }

    // Get potential targets
    const potentialTargets = Object.values(state.entities).filter(
      (e) =>
        e.id !== performer.id &&
        actionType.targetTypes!.includes(e.typeId),
    );

    if (potentialTargets.length === 0) {
      return { targetId: undefined, state };
    }

    return this.applyTargetStrategy(
      state,
      performer,
      potentialTargets,
      rule.targetStrategy,
      rule.specificTargetId,
    );
  }

  /**
   * Apply a target selection strategy to choose from candidates.
   */
  private applyTargetStrategy(
    state: WorldState,
    performer: Entity,
    candidates: readonly Entity[],
    strategy: TargetStrategy,
    specificTargetId?: string,
  ): { targetId: string | undefined; state: WorldState } {
    switch (strategy) {
      case 'specific': {
        if (specificTargetId && candidates.some((c) => c.id === specificTargetId)) {
          return { targetId: specificTargetId, state };
        }
        return { targetId: candidates[0]?.id, state };
      }

      case 'highest-relation': {
        let bestTarget = candidates[0];
        let bestWeight = -Infinity;

        for (const candidate of candidates) {
          const relations = this.relationGraph.query(state, {
            sourceId: performer.id,
            targetId: candidate.id,
          });
          const totalWeight = relations.reduce((sum, r) => sum + r.weight, 0);
          if (totalWeight > bestWeight) {
            bestWeight = totalWeight;
            bestTarget = candidate;
          }
        }

        return { targetId: bestTarget?.id, state };
      }

      case 'lowest-relation': {
        let bestTarget = candidates[0];
        let bestWeight = Infinity;

        for (const candidate of candidates) {
          const relations = this.relationGraph.query(state, {
            sourceId: performer.id,
            targetId: candidate.id,
          });
          const totalWeight = relations.reduce((sum, r) => sum + r.weight, 0);
          if (totalWeight < bestWeight) {
            bestWeight = totalWeight;
            bestTarget = candidate;
          }
        }

        return { targetId: bestTarget?.id, state };
      }

      case 'nearest': {
        // If entities have locations, find nearest. Otherwise fallback to first.
        if (performer.locationId) {
          const sameLocation = candidates.filter(
            (c) => c.locationId === performer.locationId,
          );
          if (sameLocation.length > 0) {
            return { targetId: sameLocation[0].id, state };
          }
        }
        return { targetId: candidates[0]?.id, state };
      }

      case 'random': {
        const weights = candidates.map(() => 1);
        const [selected, newRng] = weightedPick(state.rng, candidates, weights);
        return { targetId: selected.id, state: { ...state, rng: newRng } };
      }

      case 'custom':
      default:
        return { targetId: candidates[0]?.id, state };
    }
  }

  /**
   * Generate actions for all NPCs in the current state.
   */
  selectAllNPCActions(
    state: WorldState,
  ): { actions: readonly Action[]; state: WorldState } {
    const actions: Action[] = [];
    let currentState = state;

    for (const profile of state.npcProfiles) {
      const { action, state: newState } = this.selectAction(
        currentState,
        profile,
      );
      currentState = newState;
      if (action) {
        actions.push(action);
      }
    }

    return { actions, state: currentState };
  }
}
