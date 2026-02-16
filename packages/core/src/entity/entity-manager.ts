/**
 * EntityManager - CRUD operations for entities within a WorldState.
 * All operations are immutable: they return a new WorldState.
 * All changes are tracked as EntityDelta records.
 */

import type {
  WorldState,
  Entity,
  ComponentData,
  EntityDelta,
  DeltaType,
  EntityTypeDef,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';
import { generateId } from '../rng.js';

export class EntityManager {
  constructor(private readonly registry: SchemaRegistry) {}

  /**
   * Create a new entity and add it to the world state.
   * Initializes default stats and components from the entity type definition.
   */
  createEntity(
    state: WorldState,
    typeId: string,
    name: string,
    overrides?: {
      id?: string;
      components?: Readonly<Record<string, ComponentData>>;
      stats?: Readonly<Record<string, number>>;
      tags?: readonly string[];
      locationId?: string;
    },
  ): { state: WorldState; entityId: string } {
    const entityType = this.registry.getEntityTypeDef(typeId);
    if (!entityType) {
      throw new Error(`Unknown entity type '${typeId}'`);
    }

    // Generate ID
    let entityId: string;
    let rng = state.rng;
    if (overrides?.id) {
      entityId = overrides.id;
    } else {
      const [id, newRng] = generateId(rng, 'ent_');
      entityId = id;
      rng = newRng;
    }

    // Build default components
    const components: Record<string, ComponentData> = {};
    for (const compId of entityType.requiredComponents) {
      const compDef = this.registry.getComponentDef(compId);
      if (compDef) {
        const defaultValues: Record<string, unknown> = {};
        for (const field of compDef.fields) {
          if (field.defaultValue !== undefined) {
            defaultValues[field.name] = field.defaultValue;
          }
        }
        components[compId] = { defId: compId, values: defaultValues };
      }
    }
    // Apply component overrides
    if (overrides?.components) {
      for (const [compId, compData] of Object.entries(overrides.components)) {
        components[compId] = compData;
      }
    }

    // Build default stats
    const stats: Record<string, number> = {};
    const schema = this.registry.getSchema();
    for (const statDef of schema.stats) {
      if (
        !statDef.applicableTo ||
        statDef.applicableTo.includes(typeId)
      ) {
        stats[statDef.id] = statDef.defaultValue;
      }
    }
    // Apply stat overrides
    if (overrides?.stats) {
      for (const [statId, value] of Object.entries(overrides.stats)) {
        stats[statId] = value;
      }
    }

    // Build tags
    const tags: string[] = [...(entityType.defaultTags ?? [])];
    if (overrides?.tags) {
      for (const tag of overrides.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
    }

    const entity: Entity = {
      id: entityId,
      typeId,
      name,
      tags,
      components,
      stats,
      locationId: overrides?.locationId,
    };

    const newEntities = { ...state.entities, [entityId]: entity };

    return {
      state: { ...state, entities: newEntities, rng },
      entityId,
    };
  }

  /** Destroy an entity, removing it from the world state. */
  destroyEntity(state: WorldState, entityId: string): WorldState {
    const entity = state.entities[entityId];
    if (!entity) {
      throw new Error(`Entity '${entityId}' not found`);
    }

    const newEntities = { ...state.entities };
    delete newEntities[entityId];

    // Also remove any relations involving this entity
    const newRelations = state.relations.filter(
      (r) => r.sourceId !== entityId && r.targetId !== entityId,
    );

    return { ...state, entities: newEntities, relations: newRelations };
  }

  /** Get an entity by ID */
  getEntity(state: WorldState, entityId: string): Entity | undefined {
    return state.entities[entityId];
  }

  /** Get all entities of a given type */
  getEntitiesByType(state: WorldState, typeId: string): readonly Entity[] {
    return Object.values(state.entities).filter((e) => e.typeId === typeId);
  }

  /** Get all entities with a given tag */
  getEntitiesByTag(state: WorldState, tag: string): readonly Entity[] {
    return Object.values(state.entities).filter((e) => e.tags.includes(tag));
  }

  /**
   * Add a component to an entity.
   * Returns new state and the delta record.
   */
  addComponent(
    state: WorldState,
    entityId: string,
    componentData: ComponentData,
    source: string,
  ): { state: WorldState; delta: EntityDelta } {
    const entity = state.entities[entityId];
    if (!entity) throw new Error(`Entity '${entityId}' not found`);

    const newComponents = {
      ...entity.components,
      [componentData.defId]: componentData,
    };
    const newEntity: Entity = { ...entity, components: newComponents };
    const newEntities = { ...state.entities, [entityId]: newEntity };

    const delta: EntityDelta = {
      entityId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      type: 'component-change',
      field: componentData.defId,
      oldValue: undefined,
      newValue: componentData,
      source,
    };

    return {
      state: {
        ...state,
        entities: newEntities,
        entityDeltas: [...state.entityDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Remove a component from an entity.
   */
  removeComponent(
    state: WorldState,
    entityId: string,
    componentDefId: string,
    source: string,
  ): { state: WorldState; delta: EntityDelta } {
    const entity = state.entities[entityId];
    if (!entity) throw new Error(`Entity '${entityId}' not found`);

    const oldComponent = entity.components[componentDefId];
    const newComponents = { ...entity.components };
    delete newComponents[componentDefId];
    const newEntity: Entity = { ...entity, components: newComponents };
    const newEntities = { ...state.entities, [entityId]: newEntity };

    const delta: EntityDelta = {
      entityId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      type: 'component-change',
      field: componentDefId,
      oldValue: oldComponent,
      newValue: undefined,
      source,
    };

    return {
      state: {
        ...state,
        entities: newEntities,
        entityDeltas: [...state.entityDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Modify a stat on an entity by a delta amount.
   * Clamps to the stat's defined range.
   */
  modifyStat(
    state: WorldState,
    entityId: string,
    statId: string,
    amount: number,
    source: string,
    absoluteValue?: number,
  ): { state: WorldState; delta: EntityDelta } {
    const entity = state.entities[entityId];
    if (!entity) throw new Error(`Entity '${entityId}' not found`);

    const statDef = this.registry.getStatDef(statId);
    const oldValue = entity.stats[statId] ?? 0;

    let newValue: number;
    if (absoluteValue !== undefined) {
      newValue = absoluteValue;
    } else {
      newValue = oldValue + amount;
    }

    // Clamp to range if stat def exists
    if (statDef) {
      newValue = Math.max(statDef.min, Math.min(statDef.max, newValue));
    }

    const newStats = { ...entity.stats, [statId]: newValue };
    const newEntity: Entity = { ...entity, stats: newStats };
    const newEntities = { ...state.entities, [entityId]: newEntity };

    const delta: EntityDelta = {
      entityId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      type: 'stat-change',
      field: statId,
      oldValue,
      newValue,
      source,
    };

    return {
      state: {
        ...state,
        entities: newEntities,
        entityDeltas: [...state.entityDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Add a tag to an entity.
   */
  addTag(
    state: WorldState,
    entityId: string,
    tag: string,
    source: string,
  ): { state: WorldState; delta: EntityDelta } {
    const entity = state.entities[entityId];
    if (!entity) throw new Error(`Entity '${entityId}' not found`);

    if (entity.tags.includes(tag)) {
      // Tag already present, no-op delta
      const delta: EntityDelta = {
        entityId,
        turn: state.turn.currentTurn,
        phase: state.turn.currentPhase.phaseId,
        type: 'tag-add',
        field: tag,
        oldValue: true,
        newValue: true,
        source,
      };
      return { state, delta };
    }

    const newTags = [...entity.tags, tag];
    const newEntity: Entity = { ...entity, tags: newTags };
    const newEntities = { ...state.entities, [entityId]: newEntity };

    const delta: EntityDelta = {
      entityId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      type: 'tag-add',
      field: tag,
      oldValue: false,
      newValue: true,
      source,
    };

    return {
      state: {
        ...state,
        entities: newEntities,
        entityDeltas: [...state.entityDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Remove a tag from an entity.
   */
  removeTag(
    state: WorldState,
    entityId: string,
    tag: string,
    source: string,
  ): { state: WorldState; delta: EntityDelta } {
    const entity = state.entities[entityId];
    if (!entity) throw new Error(`Entity '${entityId}' not found`);

    if (!entity.tags.includes(tag)) {
      const delta: EntityDelta = {
        entityId,
        turn: state.turn.currentTurn,
        phase: state.turn.currentPhase.phaseId,
        type: 'tag-remove',
        field: tag,
        oldValue: false,
        newValue: false,
        source,
      };
      return { state, delta };
    }

    const newTags = entity.tags.filter((t) => t !== tag);
    const newEntity: Entity = { ...entity, tags: newTags };
    const newEntities = { ...state.entities, [entityId]: newEntity };

    const delta: EntityDelta = {
      entityId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      type: 'tag-remove',
      field: tag,
      oldValue: true,
      newValue: false,
      source,
    };

    return {
      state: {
        ...state,
        entities: newEntities,
        entityDeltas: [...state.entityDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Move an entity to a new location.
   */
  moveEntity(
    state: WorldState,
    entityId: string,
    locationId: string | undefined,
    source: string,
  ): { state: WorldState; delta: EntityDelta } {
    const entity = state.entities[entityId];
    if (!entity) throw new Error(`Entity '${entityId}' not found`);

    const oldLocation = entity.locationId;
    const newEntity: Entity = { ...entity, locationId };
    const newEntities = { ...state.entities, [entityId]: newEntity };

    const delta: EntityDelta = {
      entityId,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
      type: 'location-change',
      field: 'locationId',
      oldValue: oldLocation,
      newValue: locationId,
      source,
    };

    return {
      state: {
        ...state,
        entities: newEntities,
        entityDeltas: [...state.entityDeltas, delta],
      },
      delta,
    };
  }

  /**
   * Apply stat decay for all entities at the end of a turn.
   */
  applyStatDecay(state: WorldState): WorldState {
    let currentState = state;
    const schema = this.registry.getSchema();

    for (const statDef of schema.stats) {
      if (!statDef.decayPerTurn || statDef.decayPerTurn === 0) continue;

      for (const entity of Object.values(currentState.entities)) {
        if (entity.stats[statDef.id] === undefined) continue;
        if (
          statDef.applicableTo &&
          !statDef.applicableTo.includes(entity.typeId)
        ) {
          continue;
        }

        const result = this.modifyStat(
          currentState,
          entity.id,
          statDef.id,
          statDef.decayPerTurn,
          'stat-decay',
        );
        currentState = result.state;
      }
    }

    return currentState;
  }
}
