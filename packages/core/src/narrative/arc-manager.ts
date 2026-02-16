/**
 * ArcManager - manages story arcs and their progression through stages.
 * Evaluates advance/fail conditions and applies stage effects.
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

export class ArcManager {
  constructor(
    private readonly eventEvaluator: EventEvaluator,
    private readonly effectExecutor: EffectExecutor,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Start a story arc by creating an ArcState entry.
   * Applies the first stage's onEnterEffects.
   */
  startArc(state: WorldState, arcId: string): WorldState {
    const arc = state.storyArcs.find((a) => a.id === arcId);
    if (!arc) {
      throw new Error(`Story arc '${arcId}' not found`);
    }

    // Check if already active
    const existing = state.arcStates.find(
      (a) => a.arcId === arcId && !a.completed && !a.failed,
    );
    if (existing) return state;

    const arcState: ArcState = {
      arcId,
      currentStageIndex: 0,
      startedTurn: state.turn.currentTurn,
      completed: false,
      failed: false,
    };

    let currentState: WorldState = {
      ...state,
      arcStates: [...state.arcStates, arcState],
    };

    // Apply first stage onEnterEffects
    const firstStage = arc.stages[0];
    if (firstStage?.onEnterEffects && firstStage.onEnterEffects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        firstStage.onEnterEffects,
        `arc:${arcId}:stage:${firstStage.id}:enter`,
      );
      currentState = result.state;
    }

    this.eventBus.emit('arc:advanced', {
      arcState,
      stageIndex: 0,
    });

    return currentState;
  }

  /**
   * Evaluate all active arcs and advance or fail them as conditions dictate.
   */
  evaluateArcs(state: WorldState): WorldState {
    let currentState = state;

    for (const arcState of state.arcStates) {
      if (arcState.completed || arcState.failed) continue;

      const arc = state.storyArcs.find((a) => a.id === arcState.arcId);
      if (!arc) continue;

      const currentStage = arc.stages[arcState.currentStageIndex];
      if (!currentStage) continue;

      // Check fail conditions first
      if (currentStage.failConditions && currentStage.failConditions.length > 0) {
        const { result: failed, state: evalState } =
          this.eventEvaluator.evaluateTriggers(
            currentStage.failConditions,
            currentState,
          );
        currentState = evalState;

        if (failed) {
          currentState = this.failArc(currentState, arcState.arcId);
          continue;
        }
      }

      // Check advance conditions
      if (currentStage.advanceConditions.length > 0) {
        const { result: canAdvance, state: evalState } =
          this.eventEvaluator.evaluateTriggers(
            currentStage.advanceConditions,
            currentState,
          );
        currentState = evalState;

        if (canAdvance) {
          currentState = this.advanceArc(currentState, arcState.arcId, arc);
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
    arcId: string,
    arc: StoryArc,
  ): WorldState {
    const arcStateIndex = state.arcStates.findIndex(
      (a) => a.arcId === arcId && !a.completed && !a.failed,
    );
    if (arcStateIndex === -1) return state;

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

    let currentState: WorldState = { ...state, arcStates: newArcStates };

    // Apply onEnterEffects for the new stage
    if (!isComplete) {
      const nextStage = arc.stages[nextIndex];
      if (nextStage?.onEnterEffects && nextStage.onEnterEffects.length > 0) {
        const result = this.effectExecutor.execute(
          currentState,
          nextStage.onEnterEffects,
          `arc:${arcId}:stage:${nextStage.id}:enter`,
        );
        currentState = result.state;
      }
    }

    this.eventBus.emit('arc:advanced', {
      arcState: updatedArcState,
      stageIndex: updatedArcState.currentStageIndex,
    });

    return currentState;
  }

  /**
   * Fail an arc, marking it as failed.
   */
  private failArc(state: WorldState, arcId: string): WorldState {
    const arcStateIndex = state.arcStates.findIndex(
      (a) => a.arcId === arcId && !a.completed && !a.failed,
    );
    if (arcStateIndex === -1) return state;

    const updatedArcState: ArcState = {
      ...state.arcStates[arcStateIndex],
      failed: true,
    };

    const newArcStates = [...state.arcStates];
    newArcStates[arcStateIndex] = updatedArcState;

    return { ...state, arcStates: newArcStates };
  }

  /** Get the active arc state for a given arc ID */
  getActiveArcState(
    state: WorldState,
    arcId: string,
  ): ArcState | undefined {
    return state.arcStates.find(
      (a) => a.arcId === arcId && !a.completed && !a.failed,
    );
  }

  /** Get all active arc states */
  getActiveArcs(state: WorldState): readonly ArcState[] {
    return state.arcStates.filter((a) => !a.completed && !a.failed);
  }

  /** Get the current stage of an active arc */
  getCurrentStage(
    state: WorldState,
    arcId: string,
  ): ArcStage | undefined {
    const arcState = this.getActiveArcState(state, arcId);
    if (!arcState) return undefined;

    const arc = state.storyArcs.find((a) => a.id === arcId);
    if (!arc) return undefined;

    return arc.stages[arcState.currentStageIndex];
  }

  /** Register a new story arc in the world state */
  addArc(state: WorldState, arc: StoryArc): WorldState {
    return {
      ...state,
      storyArcs: [...state.storyArcs, arc],
    };
  }
}
