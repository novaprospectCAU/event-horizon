/**
 * Entity System - the core data objects in the game world.
 * Entities are generic containers defined by their type, components, and stats.
 */

/** Data for a single component instance attached to an entity */
export interface ComponentData {
  readonly defId: string;
  readonly values: Readonly<Record<string, unknown>>;
}

/** A game entity - the fundamental object in the world */
export interface Entity {
  readonly id: string;
  readonly typeId: string;
  readonly name: string;
  readonly tags: readonly string[];
  readonly components: Readonly<Record<string, ComponentData>>;
  readonly stats: Readonly<Record<string, number>>;
  readonly locationId?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/** Types of changes that can happen to an entity */
export type DeltaType =
  | 'stat-change'
  | 'component-change'
  | 'tag-add'
  | 'tag-remove'
  | 'location-change'
  | 'metadata-change';

/** Records a single change to an entity */
export interface EntityDelta {
  readonly entityId: string;
  readonly turn: number;
  readonly phase: string;
  readonly type: DeltaType;
  readonly field: string;
  /** Previous value */
  readonly oldValue: unknown;
  /** New value */
  readonly newValue: unknown;
  /** What caused this change */
  readonly source: string;
}
