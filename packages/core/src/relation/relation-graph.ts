/**
 * RelationGraph - manages entity relations with bidirectional indexing
 * for fast lookup. All operations are immutable.
 */

import type {
  WorldState,
  Relation,
  RelationDelta,
  RelationQuery,
  RelationTypeDef,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';
import { generateId } from '../rng.js';

/** Bidirectional index for fast relation lookups */
interface RelationIndex {
  /** source entity ID -> relation IDs */
  readonly bySource: ReadonlyMap<string, ReadonlySet<string>>;
  /** target entity ID -> relation IDs */
  readonly byTarget: ReadonlyMap<string, ReadonlySet<string>>;
  /** relation type ID -> relation IDs */
  readonly byType: ReadonlyMap<string, ReadonlySet<string>>;
  /** relation ID -> relation */
  readonly byId: ReadonlyMap<string, Relation>;
}

export class RelationGraph {
  private index: RelationIndex = {
    bySource: new Map(),
    byTarget: new Map(),
    byType: new Map(),
    byId: new Map(),
  };

  constructor(private readonly registry: SchemaRegistry) {}

  /** Rebuild the index from a list of relations */
  buildIndex(relations: readonly Relation[]): void {
    const bySource = new Map<string, Set<string>>();
    const byTarget = new Map<string, Set<string>>();
    const byType = new Map<string, Set<string>>();
    const byId = new Map<string, Relation>();

    for (const rel of relations) {
      byId.set(rel.id, rel);

      if (!bySource.has(rel.sourceId)) bySource.set(rel.sourceId, new Set());
      bySource.get(rel.sourceId)!.add(rel.id);

      if (!byTarget.has(rel.targetId)) byTarget.set(rel.targetId, new Set());
      byTarget.get(rel.targetId)!.add(rel.id);

      if (!byType.has(rel.typeId)) byType.set(rel.typeId, new Set());
      byType.get(rel.typeId)!.add(rel.id);
    }

    this.index = { bySource, byTarget, byType, byId };
  }

  /**
   * Add a new relation between two entities.
   */
  addRelation(
    state: WorldState,
    typeId: string,
    sourceId: string,
    targetId: string,
    weight?: number,
  ): { state: WorldState; relation: Relation; delta: RelationDelta } {
    const relType = this.registry.getRelationTypeDef(typeId);
    if (!relType) {
      throw new Error(`Unknown relation type '${typeId}'`);
    }

    const [relationId, newRng] = generateId(state.rng, 'rel_');
    const actualWeight = weight ?? relType.defaultWeight;
    const clampedWeight = Math.max(
      relType.minWeight,
      Math.min(relType.maxWeight, actualWeight),
    );

    const relation: Relation = {
      id: relationId,
      typeId,
      sourceId,
      targetId,
      weight: clampedWeight,
      createdTurn: state.turn.currentTurn,
      modifiedTurn: state.turn.currentTurn,
    };

    const delta: RelationDelta = {
      relationId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      oldWeight: 0,
      newWeight: clampedWeight,
      source: 'relation-add',
    };

    const newRelations = [...state.relations, relation];
    this.buildIndex(newRelations);

    return {
      state: {
        ...state,
        relations: newRelations,
        relationDeltas: [...state.relationDeltas, delta],
        rng: newRng,
      },
      relation,
      delta,
    };
  }

  /**
   * Modify the weight of an existing relation.
   */
  modifyRelation(
    state: WorldState,
    relationId: string,
    weightDelta: number,
    source: string,
    absoluteValue?: number,
  ): { state: WorldState; delta: RelationDelta } {
    const existingIndex = state.relations.findIndex((r) => r.id === relationId);
    if (existingIndex === -1) {
      throw new Error(`Relation '${relationId}' not found`);
    }

    const existing = state.relations[existingIndex];
    const relType = this.registry.getRelationTypeDef(existing.typeId);

    let newWeight: number;
    if (absoluteValue !== undefined) {
      newWeight = absoluteValue;
    } else {
      newWeight = existing.weight + weightDelta;
    }

    // Clamp to range
    if (relType) {
      newWeight = Math.max(relType.minWeight, Math.min(relType.maxWeight, newWeight));
    }

    const updatedRelation: Relation = {
      ...existing,
      weight: newWeight,
      modifiedTurn: state.turn.currentTurn,
    };

    const delta: RelationDelta = {
      relationId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      oldWeight: existing.weight,
      newWeight,
      source,
    };

    const newRelations = [...state.relations];
    newRelations[existingIndex] = updatedRelation;
    this.buildIndex(newRelations);

    return {
      state: {
        ...state,
        relations: newRelations,
        relationDeltas: [...state.relationDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Remove a relation by ID.
   */
  removeRelation(
    state: WorldState,
    relationId: string,
    source: string,
  ): { state: WorldState; delta: RelationDelta } {
    const existing = state.relations.find((r) => r.id === relationId);
    if (!existing) {
      throw new Error(`Relation '${relationId}' not found`);
    }

    const delta: RelationDelta = {
      relationId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      oldWeight: existing.weight,
      newWeight: 0,
      source,
    };

    const newRelations = state.relations.filter((r) => r.id !== relationId);
    this.buildIndex(newRelations);

    return {
      state: {
        ...state,
        relations: newRelations,
        relationDeltas: [...state.relationDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Query relations by entity, type, and weight range.
   */
  query(state: WorldState, query: RelationQuery): readonly Relation[] {
    // Rebuild index if needed
    this.buildIndex(state.relations);

    let candidateIds: Set<string> | null = null;

    // Filter by source
    if (query.sourceId) {
      const sourceSet = (this.index.bySource as Map<string, Set<string>>).get(query.sourceId);
      candidateIds = sourceSet ? new Set(sourceSet) : new Set();
    }

    // Filter by target
    if (query.targetId) {
      const targetSet = (this.index.byTarget as Map<string, Set<string>>).get(query.targetId);
      if (candidateIds) {
        const intersection = new Set<string>();
        for (const id of candidateIds) {
          if (targetSet?.has(id)) intersection.add(id);
        }
        candidateIds = intersection;
      } else {
        candidateIds = targetSet ? new Set(targetSet) : new Set();
      }
    }

    // Filter by type
    if (query.typeId) {
      const typeSet = (this.index.byType as Map<string, Set<string>>).get(query.typeId);
      if (candidateIds) {
        const intersection = new Set<string>();
        for (const id of candidateIds) {
          if (typeSet?.has(id)) intersection.add(id);
        }
        candidateIds = intersection;
      } else {
        candidateIds = typeSet ? new Set(typeSet) : new Set();
      }
    }

    // Filter by entityId (matches either source or target)
    if (query.entityId) {
      const sourceSet = (this.index.bySource as Map<string, Set<string>>).get(query.entityId) ?? new Set();
      const targetSet = (this.index.byTarget as Map<string, Set<string>>).get(query.entityId) ?? new Set();
      const combined = new Set([...sourceSet, ...targetSet]);
      if (candidateIds) {
        const intersection = new Set<string>();
        for (const id of candidateIds) {
          if (combined.has(id)) intersection.add(id);
        }
        candidateIds = intersection;
      } else {
        candidateIds = combined;
      }
    }

    // If no filters, use all
    const byIdMap = this.index.byId as Map<string, Relation>;
    let results: Relation[];
    if (candidateIds) {
      results = [];
      for (const id of candidateIds) {
        const rel = byIdMap.get(id);
        if (rel) results.push(rel);
      }
    } else {
      results = [...state.relations];
    }

    // Filter by weight range
    if (query.minWeight !== undefined) {
      results = results.filter((r) => r.weight >= query.minWeight!);
    }
    if (query.maxWeight !== undefined) {
      results = results.filter((r) => r.weight <= query.maxWeight!);
    }

    return results;
  }

  /**
   * Get all relations where the given entity is the source.
   */
  getOutgoing(state: WorldState, entityId: string): readonly Relation[] {
    return this.query(state, { sourceId: entityId });
  }

  /**
   * Get all relations where the given entity is the target.
   */
  getIncoming(state: WorldState, entityId: string): readonly Relation[] {
    return this.query(state, { targetId: entityId });
  }

  /**
   * Find a specific relation between two entities of a given type.
   */
  findRelation(
    state: WorldState,
    typeId: string,
    sourceId: string,
    targetId: string,
  ): Relation | undefined {
    const results = this.query(state, { typeId, sourceId, targetId });
    return results[0];
  }

  /**
   * Modify a relation between two entities, finding it by type + source + target.
   * If not found, creates a new one.
   */
  modifyOrCreateRelation(
    state: WorldState,
    typeId: string,
    sourceId: string,
    targetId: string,
    weightDelta: number,
    source: string,
    absoluteValue?: number,
  ): { state: WorldState; delta: RelationDelta } {
    const existing = this.findRelation(state, typeId, sourceId, targetId);
    if (existing) {
      return this.modifyRelation(state, existing.id, weightDelta, source, absoluteValue);
    }
    // Create new relation
    const result = this.addRelation(
      state,
      typeId,
      sourceId,
      targetId,
      absoluteValue ?? weightDelta,
    );
    return { state: result.state, delta: result.delta };
  }

  /**
   * Apply decay to all relations at the end of a turn.
   */
  applyRelationDecay(state: WorldState): WorldState {
    let currentState = state;
    const schema = this.registry.getSchema();

    for (const relType of schema.relationTypes) {
      if (!relType.decayPerTurn || relType.decayPerTurn === 0) continue;

      for (const relation of currentState.relations) {
        if (relation.typeId !== relType.id) continue;

        // Decay toward default weight
        const diff = relType.defaultWeight - relation.weight;
        if (Math.abs(diff) < 0.001) continue;

        const decayAmount =
          Math.sign(diff) *
          Math.min(Math.abs(relType.decayPerTurn), Math.abs(diff));

        const result = this.modifyRelation(
          currentState,
          relation.id,
          decayAmount,
          'relation-decay',
        );
        currentState = result.state;
      }
    }

    return currentState;
  }
}
