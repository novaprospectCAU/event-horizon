/**
 * Schema System - defines the structure of a game world.
 * The engine knows nothing about specific game concepts (diplomacy, fleets, etc.).
 * All game-specific meaning comes from schemas.
 */

/** Supported field types for component definitions */
export type FieldType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]' | 'record';

/** A single field within a component definition */
export interface FieldDef {
  readonly name: string;
  readonly type: FieldType;
  readonly defaultValue?: unknown;
  readonly description?: string;
  /** Validation constraints */
  readonly min?: number;
  readonly max?: number;
  readonly options?: readonly string[];
}

/** Defines a reusable data structure that can be attached to entities */
export interface ComponentDef {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly fields: readonly FieldDef[];
  readonly tags?: readonly string[];
}

/** Defines a category of entity with required/optional components */
export interface EntityTypeDef {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly requiredComponents: readonly string[];
  readonly optionalComponents: readonly string[];
  readonly defaultTags?: readonly string[];
  /** Whether this entity type can have a location */
  readonly locatable?: boolean;
}

/** Defines a trackable numeric stat */
export interface StatDef {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly category?: string;
  readonly min: number;
  readonly max: number;
  readonly defaultValue: number;
  /** Natural change per turn (positive or negative) */
  readonly decayPerTurn?: number;
  /** Which entity types can have this stat */
  readonly applicableTo?: readonly string[];
}

/** Defines a type of relationship between entities */
export interface RelationTypeDef {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** Whether the relation is directional (A→B ≠ B→A) */
  readonly directed: boolean;
  readonly minWeight: number;
  readonly maxWeight: number;
  readonly defaultWeight: number;
  /** Natural decay per turn toward default */
  readonly decayPerTurn?: number;
  /** Which entity type pairs can have this relation [sourceType, targetType] */
  readonly allowedPairs?: readonly [string, string][];
}

/** Defines a type of action entities can perform */
export interface ActionTypeDef {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** Entity types that can perform this action */
  readonly performerTypes: readonly string[];
  /** Entity types that can be targeted (empty = no target needed) */
  readonly targetTypes?: readonly string[];
  /** Turn phases during which this action is available */
  readonly allowedPhases: readonly string[];
  /** Parameter definitions for this action */
  readonly params?: readonly FieldDef[];
  /** Cooldown in turns after use */
  readonly cooldown?: number;
}

/** Phase type within a turn */
export type PhaseType = 'player-action' | 'npc-action' | 'event-resolution' | 'world-update' | 'custom';

/** Defines a phase within a turn */
export interface PhaseDef {
  readonly id: string;
  readonly name: string;
  readonly type: PhaseType;
  readonly order: number;
  readonly description?: string;
}

/** AI operation mode */
export type AIMode = 'full' | 'assist' | 'off';

/** World-level configuration */
export interface WorldConfig {
  readonly aiMode: AIMode;
  readonly timeUnit: string;
  readonly turnLabel?: string;
  readonly activeModules: readonly string[];
  readonly maxEntities?: number;
  readonly rngSeed?: number;
}

/** Top-level schema that fully defines a game world structure */
export interface WorldSchema {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly components: readonly ComponentDef[];
  readonly entityTypes: readonly EntityTypeDef[];
  readonly stats: readonly StatDef[];
  readonly relationTypes: readonly RelationTypeDef[];
  readonly actionTypes: readonly ActionTypeDef[];
  readonly phases: readonly PhaseDef[];
  readonly config: WorldConfig;
}
