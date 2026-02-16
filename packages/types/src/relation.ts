/**
 * Relation System - tracks relationships between entities.
 * Supports directed/undirected, weighted relations with history.
 */

/** A relationship between two entities */
export interface Relation {
  readonly id: string;
  readonly typeId: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly weight: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly createdTurn: number;
  readonly modifiedTurn: number;
}

/** Records a change to a relation */
export interface RelationDelta {
  readonly relationId: string;
  readonly turn: number;
  readonly phase: string;
  readonly oldWeight: number;
  readonly newWeight: number;
  readonly source: string;
}

/** Query parameters for finding relations */
export interface RelationQuery {
  readonly entityId?: string;
  readonly typeId?: string;
  readonly sourceId?: string;
  readonly targetId?: string;
  readonly minWeight?: number;
  readonly maxWeight?: number;
}
