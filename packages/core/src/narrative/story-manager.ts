/**
 * StoryManager - tracks active story arcs and their progression.
 * Checks advance/fail conditions each turn and applies stage effects.
 */

import type {
  WorldState,
  StoryArc,
  ArcState,
  ArcStage,
} from '@event-horizon/types';
import type { EventEvaluator } from '../event/event-evaluator.js';
import type { EffectExecutor } from '../event/effect-executor.js';
import type { EventBus } from '../event/event-bus.js';

export class StoryManager {
  constructor(
    private readonly eventEvaluator: EventEvaluator,
    private readonly effectExecutor: EffectExecutor,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Start a new story arc by ID.
   * Creates an ArcState and applies the first stage's enter effects.
   */
  startArc(
    state: WorldState,
    arcId: string,
  ): WorldState {
    const arc = state.storyArcs.find((a) => a.id === arcId);
    if (!arc) {
      throw new Error(`Unknown story arc '${arcId}'`);
    }

    // Check if already active
    const existing = state.arcStates.find(
      (s) => s.arcId === arcId && !s.completed && !s.failed,
    );
    if (existing) return state;

    const newArcState: ArcState = {
      arcId,
      currentStageIndex: 0,
      startedTurn: state.turn.currentTurn,
      completed: false,
      failed: false,
    };

    let newState: WorldState = {
      ...state,
      arcStates: [...state.arcStates, newArcState],
    };

    // Apply first stage enter effects
    const firstStage = arc.stages[0];
    if (firstStage?.onEnterEffects && firstStage.onEnterEffects.length > 0) {
      const result = this.effectExecutor.execute(
        newState,
        firstStage.onEnterEffects,
        `arc:${arcId}:stage:${firstStage.id}:enter`,
      );
      newState = result.state;
    }

    return newState;
  }

  /**
   * Check all active arcs for advance/fail conditions.
   * Advances or fails arcs as appropriate.
   */
  updateArcs(state: WorldState): WorldState {
    let currentState = state;

    for (let i = 0; i < currentState.arcStates.length; i++) {
      const arcState = currentState.arcStates[i];
      if (arcState.completed || arcState.failed) continue;

      const arc = currentState.storyArcs.find((a) => a.id === arcState.arcId);
      if (!arc) continue;

      const currentStage = arc.stages[arcState.currentStageIndex];
      if (!currentStage) continue;

      // Check fail conditions first
      if (currentStage.failConditions && currentStage.failConditions.length > 0) {
        const { result: failed } = this.eventEvaluator.evaluateTriggers(
          currentStage.failConditions,
          currentState,
        );
        if (failed) {
          currentState = this.failArc(currentState, i);
          continue;
        }
      }

      // Check advance conditions
      if (currentStage.advanceConditions.length > 0) {
        const { result: advance } = this.eventEvaluator.evaluateTriggers(
          currentStage.advanceConditions,
          currentState,
        );
        if (advance) {
          currentState = this.advanceArc(currentState, arc, i);
        }
      }
    }

    return currentState;
  }

  /**
   * Advance an arc to the next stage.
   */
  private advanceArc(
    state: WorldState,
    arc: StoryArc,
    arcStateIndex: number,
  ): WorldState {
    const arcState = state.arcStates[arcStateIndex];
    const nextIndex = arcState.currentStageIndex + 1;
    const isComplete = nextIndex >= arc.stages.length;

    const updatedArcState: ArcState = {
      ...arcState,
      currentStageIndex: isComplete ? arcState.currentStageIndex : nextIndex,
      completed: isComplete,
    };

    const newArcStates = [...state.arcStates];
    newArcStates[arcStateIndex] = updatedArcState;
    let newState: WorldState = { ...state, arcStates: newArcStates };

    // Emit arc advanced event
    this.eventBus.emit('arc:advanced', {
      arcState: updatedArcState,
      stageIndex: isComplete ? arcState.currentStageIndex : nextIndex,
    });

    // Apply next stage enter effects
    if (!isComplete) {
      const nextStage = arc.stages[nextIndex];
      if (nextStage?.onEnterEffects && nextStage.onEnterEffects.length > 0) {
        const result = this.effectExecutor.execute(
          newState,
          nextStage.onEnterEffects,
          `arc:${arc.id}:stage:${nextStage.id}:enter`,
        );
        newState = result.state;
      }
    }

    return newState;
  }

  /**
   * Mark an arc as failed.
   */
  private failArc(state: WorldState, arcStateIndex: number): WorldState {
    const arcState = state.arcStates[arcStateIndex];
    const updatedArcState: ArcState = {
      ...arcState,
      failed: true,
    };

    const newArcStates = [...state.arcStates];
    newArcStates[arcStateIndex] = updatedArcState;

    return { ...state, arcStates: newArcStates };
  }

  /**
   * Get all currently active arc states.
   */
  getActiveArcs(state: WorldState): readonly ArcState[] {
    return state.arcStates.filter((s) => !s.completed && !s.failed);
  }

  /**
   * Get the current stage definition for an active arc.
   */
  getCurrentStage(
    state: WorldState,
    arcId: string,
  ): ArcStage | undefined {
    const arcState = state.arcStates.find(
      (s) => s.arcId === arcId && !s.completed && !s.failed,
    );
    if (!arcState) return undefined;

    const arc = state.storyArcs.find((a) => a.id === arcId);
    if (!arc) return undefined;

    return arc.stages[arcState.currentStageIndex];
  }
}
