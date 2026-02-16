/**
 * Event System - triggers, effects, and game events.
 * Events fire when conditions are met and produce effects on the world.
 */

/** Types of conditions that can trigger an event */
export type TriggerType =
  | 'turn-reached'
  | 'stat-threshold'
  | 'relation-threshold'
  | 'entity-exists'
  | 'tag-present'
  | 'event-fired'
  | 'random-chance'
  | 'custom';

/** Comparison operators for threshold triggers */
export type ComparisonOp = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';

/** A condition that can trigger an event */
export interface Trigger {
  readonly type: TriggerType;
  /** For turn-reached */
  readonly turn?: number;
  /** For stat-threshold */
  readonly entityId?: string;
  readonly entityTag?: string;
  readonly statId?: string;
  readonly comparison?: ComparisonOp;
  readonly value?: number;
  /** For relation-threshold */
  readonly relationTypeId?: string;
  readonly sourceId?: string;
  readonly targetId?: string;
  /** For entity-exists / tag-present */
  readonly entityTypeId?: string;
  readonly tag?: string;
  /** For event-fired */
  readonly eventId?: string;
  /** For random-chance (0-1) */
  readonly chance?: number;
  /** For custom triggers */
  readonly customType?: string;
  readonly params?: Readonly<Record<string, unknown>>;
}

/** Types of effects that events can produce */
export type EffectType =
  | 'modify-stat'
  | 'modify-relation'
  | 'add-component'
  | 'remove-component'
  | 'spawn-entity'
  | 'destroy-entity'
  | 'trigger-event'
  | 'start-arc'
  | 'advance-arc'
  | 'set-tag'
  | 'remove-tag'
  | 'move-entity'
  | 'custom';

/** An effect that modifies the game world */
export interface Effect {
  readonly type: EffectType;
  /** Target entity (or entity tag/query for batch) */
  readonly entityId?: string;
  readonly entityTag?: string;
  /** For modify-stat */
  readonly statId?: string;
  /** Amount to add (positive or negative) */
  readonly amount?: number;
  /** Set to absolute value instead of delta */
  readonly absoluteValue?: number;
  /** For modify-relation */
  readonly relationTypeId?: string;
  readonly sourceId?: string;
  readonly targetId?: string;
  /** For add/remove-component */
  readonly componentDefId?: string;
  readonly componentValues?: Readonly<Record<string, unknown>>;
  /** For spawn-entity */
  readonly entityTypeId?: string;
  readonly entityName?: string;
  readonly spawnLocationId?: string;
  /** For trigger-event */
  readonly eventId?: string;
  /** For start-arc / advance-arc */
  readonly arcId?: string;
  /** For set-tag / remove-tag */
  readonly tag?: string;
  /** For move-entity */
  readonly locationId?: string;
  /** For custom effects */
  readonly customType?: string;
  readonly params?: Readonly<Record<string, unknown>>;
}

/** A choice the player can make during an event */
export interface EventChoice {
  readonly id: string;
  readonly text: string;
  readonly description?: string;
  /** Conditions that must be true for this choice to be available */
  readonly conditions?: readonly Trigger[];
  /** Effects applied when this choice is selected */
  readonly effects: readonly Effect[];
  /** Narrative text shown after choosing */
  readonly resultText?: string;
}

/** A game event with triggers, effects, and optional choices */
export interface GameEvent {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** All triggers must be satisfied (AND logic) */
  readonly triggers: readonly Trigger[];
  /** Effects applied automatically (if no choices) or on default */
  readonly effects: readonly Effect[];
  /** Player choices (if present, pauses for player input) */
  readonly choices?: readonly EventChoice[];
  /** Cooldown in turns before this event can fire again */
  readonly cooldown?: number;
  /** Maximum number of times this event can fire */
  readonly maxOccurrences?: number;
  /** Priority for ordering when multiple events fire */
  readonly priority?: number;
  /** Tags for categorization */
  readonly tags?: readonly string[];
}
