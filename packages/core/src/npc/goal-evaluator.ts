/**
 * GoalEvaluator - checks goal completion/failure conditions,
 * updates goal statuses, and prioritizes goals for NPC decision making.
 */

import type {
  WorldState,
  Goal,
  GoalStatus,
  NPCBehaviorProfile,
} from '@event-horizon/types';
import type { EventEvaluator } from '../event/event-evaluator.js';

/** Result of evaluating goals for a single NPC */
export interface GoalEvaluationResult {
  readonly updatedGoals: readonly Goal[];
  readonly completedGoalIds: readonly string[];
  readonly failedGoalIds: readonly string[];
}

export class GoalEvaluator {
  constructor(private readonly eventEvaluator: EventEvaluator) {}

  /**
   * Evaluate all goals for an NPC profile, checking completion and failure.
   * Returns updated goals with status changes.
   */
  evaluateGoals(
    state: WorldState,
    profile: NPCBehaviorProfile,
  ): GoalEvaluationResult {
    const updatedGoals: Goal[] = [];
    const completedGoalIds: string[] = [];
    const failedGoalIds: string[] = [];

    for (const goal of profile.goals) {
      if (goal.status !== 'active') {
        updatedGoals.push(goal);
        continue;
      }

      // Check failure conditions first (they take precedence)
      if (goal.failureConditions && goal.failureConditions.length > 0) {
        const { result: failed } = this.eventEvaluator.evaluateTriggers(
          goal.failureConditions,
          state,
        );
        if (failed) {
          updatedGoals.push({ ...goal, status: 'failed' as GoalStatus });
          failedGoalIds.push(goal.id);
          continue;
        }
      }

      // Check completion conditions
      const { result: completed } = this.eventEvaluator.evaluateTriggers(
        goal.completionConditions,
        state,
      );
      if (completed) {
        updatedGoals.push({ ...goal, status: 'completed' as GoalStatus });
        completedGoalIds.push(goal.id);
        continue;
      }

      // Goal is still active
      updatedGoals.push(goal);
    }

    return { updatedGoals, completedGoalIds, failedGoalIds };
  }

  /**
   * Evaluate goals for all NPC profiles and update them in the world state.
   */
  evaluateAllGoals(state: WorldState): WorldState {
    const updatedProfiles: NPCBehaviorProfile[] = [];

    for (const profile of state.npcProfiles) {
      const result = this.evaluateGoals(state, profile);
      updatedProfiles.push({
        ...profile,
        goals: result.updatedGoals,
      });
    }

    return { ...state, npcProfiles: updatedProfiles };
  }

  /**
   * Get active goals for an NPC, sorted by priority (highest first).
   */
  getActiveGoals(profile: NPCBehaviorProfile): readonly Goal[] {
    return profile.goals
      .filter((g) => g.status === 'active')
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get the highest-priority active goal for an NPC.
   */
  getTopGoal(profile: NPCBehaviorProfile): Goal | undefined {
    const active = this.getActiveGoals(profile);
    return active[0];
  }
}
