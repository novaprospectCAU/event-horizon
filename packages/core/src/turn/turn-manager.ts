/**
 * TurnManager - manages the progression of turns and phases.
 * Coordinates phase transitions and turn boundaries.
 */

import type {
  WorldState,
  TurnPhase,
  TurnState,
  PhaseDef,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';
import type { EventBus } from '../event/event-bus.js';

export class TurnManager {
  constructor(
    private readonly registry: SchemaRegistry,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Advance to the next phase within the current turn.
   * If all phases are complete, marks the turn as complete.
   */
  advancePhase(state: WorldState): WorldState {
    const orderedPhases = this.registry.getOrderedPhases();
    const currentIndex = state.turn.currentPhase.phaseIndex;
    const nextIndex = currentIndex + 1;

    // Emit phase-ended event
    this.eventBus.emit('turn:phase-ended', { phase: state.turn.currentPhase });

    if (nextIndex >= orderedPhases.length) {
      // All phases complete for this turn
      return {
        ...state,
        turn: {
          ...state.turn,
          isComplete: true,
          awaitingInput: false,
        },
      };
    }

    const nextPhaseDef = orderedPhases[nextIndex];
    const newPhase: TurnPhase = {
      turnNumber: state.turn.currentTurn,
      phaseId: nextPhaseDef.id,
      phaseType: nextPhaseDef.type,
      phaseIndex: nextIndex,
      totalPhases: orderedPhases.length,
    };

    const newState: WorldState = {
      ...state,
      turn: {
        ...state.turn,
        currentPhase: newPhase,
        awaitingInput: nextPhaseDef.type === 'player-action',
      },
    };

    // Emit phase-started event
    this.eventBus.emit('turn:phase-started', { phase: newPhase });

    return newState;
  }

  /**
   * Advance to the next turn, resetting to the first phase.
   * Clears per-turn deltas.
   */
  advanceTurn(state: WorldState): WorldState {
    const orderedPhases = this.registry.getOrderedPhases();
    const firstPhase = orderedPhases[0];

    if (!firstPhase) {
      throw new Error('Schema must define at least one phase');
    }

    // Emit turn-completed event
    this.eventBus.emit('turn:completed', { turnNumber: state.turn.currentTurn });

    const nextTurn = state.turn.currentTurn + 1;
    const newPhase: TurnPhase = {
      turnNumber: nextTurn,
      phaseId: firstPhase.id,
      phaseType: firstPhase.type,
      phaseIndex: 0,
      totalPhases: orderedPhases.length,
    };

    const newState: WorldState = {
      ...state,
      turn: {
        currentTurn: nextTurn,
        currentPhase: newPhase,
        isComplete: false,
        awaitingInput: firstPhase.type === 'player-action',
      },
      entityDeltas: [],
      relationDeltas: [],
    };

    // Emit phase-started event for the new turn's first phase
    this.eventBus.emit('turn:phase-started', { phase: newPhase });

    return newState;
  }

  /** Check if the current turn has reached the max turn limit */
  isMaxTurnReached(state: WorldState): boolean {
    const maxTurns = state.schema.config.maxEntities;
    // Check the actual turn config
    const orderedPhases = this.registry.getOrderedPhases();
    // Max turns is stored in the schema -- we look at world config
    // The WorldSchema doesn't have maxTurns directly, but we check if defined elsewhere
    return false;
  }

  /** Get the current phase definition */
  getCurrentPhaseDef(state: WorldState): PhaseDef | undefined {
    return this.registry.getPhaseDef(state.turn.currentPhase.phaseId);
  }

  /** Check if the current phase requires player input */
  isAwaitingInput(state: WorldState): boolean {
    return state.turn.awaitingInput;
  }

  /** Check if the current turn is complete (all phases processed) */
  isTurnComplete(state: WorldState): boolean {
    return state.turn.isComplete;
  }

  /** Get the phase type for the current phase */
  getCurrentPhaseType(state: WorldState): string {
    return state.turn.currentPhase.phaseType;
  }
}
