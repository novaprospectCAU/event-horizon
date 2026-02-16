/**
 * Action System - player and NPC actions.
 */

import type { Effect } from './event.js';

/** A concrete action to be resolved */
export interface Action {
  readonly id: string;
  readonly typeId: string;
  readonly performerId: string;
  readonly targetId?: string;
  readonly params?: Readonly<Record<string, unknown>>;
  readonly turn: number;
  readonly phase: string;
}

/** Result of resolving an action */
export interface ActionResult {
  readonly actionId: string;
  readonly success: boolean;
  readonly effects: readonly Effect[];
  /** Narrative description of what happened */
  readonly narrative?: string;
  /** Additional data for UI display */
  readonly resultData?: Readonly<Record<string, unknown>>;
}

/** A player's submitted turn containing their chosen actions */
export interface PlayerTurnSubmission {
  readonly playerId: string;
  readonly turn: number;
  readonly actions: readonly Action[];
}
