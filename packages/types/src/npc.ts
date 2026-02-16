/**
 * NPC Behavior System - personality, goals, and decision-making.
 */

import type { Trigger } from './event.js';

/** A personality trait with intensity */
export interface PersonalityTrait {
  readonly traitId: string;
  readonly name: string;
  readonly intensity: number; // -1.0 to 1.0
  readonly description?: string;
}

/** NPC goal states */
export type GoalStatus = 'active' | 'completed' | 'failed' | 'abandoned';

/** A goal an NPC is pursuing */
export interface Goal {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly priority: number; // 0-100
  readonly status: GoalStatus;
  /** Conditions that complete the goal */
  readonly completionConditions: readonly Trigger[];
  /** Conditions that fail the goal */
  readonly failureConditions?: readonly Trigger[];
  /** Related entity IDs */
  readonly relatedEntities?: readonly string[];
}

/** Strategy for selecting targets */
export type TargetStrategy =
  | 'highest-relation'
  | 'lowest-relation'
  | 'nearest'
  | 'random'
  | 'specific'
  | 'custom';

/** A rule governing NPC behavior */
export interface BehaviorRule {
  readonly id: string;
  readonly name?: string;
  /** Conditions that must be true for this rule to apply */
  readonly conditions: readonly Trigger[];
  /** Action type to perform */
  readonly actionTypeId: string;
  /** How to select the target */
  readonly targetStrategy: TargetStrategy;
  /** Specific target if strategy is 'specific' */
  readonly specificTargetId?: string;
  /** Action parameters */
  readonly params?: Readonly<Record<string, unknown>>;
  /** Weight for selection among competing rules (higher = more likely) */
  readonly weight: number;
}

/** Complete behavior profile for an NPC */
export interface NPCBehaviorProfile {
  readonly entityId: string;
  readonly personality: readonly PersonalityTrait[];
  readonly goals: readonly Goal[];
  readonly behaviorRules: readonly BehaviorRule[];
  /** AI personality prompt for LLM-based decisions */
  readonly aiPersonalityPrompt?: string;
  /** Whether to use AI for decision making */
  readonly useAI?: boolean;
}

/** A memory entry for NPC recall */
export interface MemoryEntry {
  readonly id: string;
  readonly turn: number;
  readonly summary: string;
  readonly emotion?: string;
  readonly relatedEntityIds: readonly string[];
  /** How quickly this memory fades (0-1, higher = faster) */
  readonly decayRate: number;
  /** Current strength (0-1, decreases over time) */
  readonly strength: number;
  /** Importance rating for context prioritization */
  readonly importance: number;
}

/** NPC memory state */
export interface NPCMemory {
  readonly entityId: string;
  readonly memories: readonly MemoryEntry[];
}
