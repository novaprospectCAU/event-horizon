/**
 * Turn System - manages the progression of game turns and phases.
 */

import type { PhaseType } from './schema.js';

/** Current phase state within a turn */
export interface TurnPhase {
  readonly turnNumber: number;
  readonly phaseId: string;
  readonly phaseType: PhaseType;
  readonly phaseIndex: number;
  readonly totalPhases: number;
}

/** Configuration for how turns operate */
export interface TurnConfig {
  /** Phase definitions (from schema) */
  readonly phases: readonly string[];
  /** Maximum turns before game ends (0 = unlimited) */
  readonly maxTurns: number;
  /** Auto-advance through non-player phases */
  readonly autoAdvance: boolean;
}

/** Overall turn state */
export interface TurnState {
  readonly currentTurn: number;
  readonly currentPhase: TurnPhase;
  readonly isComplete: boolean;
  readonly awaitingInput: boolean;
}
