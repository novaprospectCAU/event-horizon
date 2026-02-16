/**
 * EffectExecutor - executes Effect objects against the world state.
 * Supports all effect types: modify-stat, modify-relation, add/remove-component,
 * spawn/destroy-entity, trigger-event, start/advance-arc, set/remove-tag,
 * move-entity, and custom.
 */

import type {
  WorldState,
  Effect,
  EntityDelta,
  RelationDelta,
  ComponentData,
} from '@event-horizon/types';
import type { EntityManager } from '../entity/entity-manager.js';
import type { RelationGraph } from '../relation/relation-graph.js';

/** Summary of all changes made by executing effects */
export interface EffectExecutionResult {
  readonly state: WorldState;
  readonly entityDeltas: readonly EntityDelta[];
  readonly relationDeltas: readonly RelationDelta[];
  readonly spawnedEntityIds: readonly string[];
  readonly destroyedEntityIds: readonly string[];
  readonly triggeredEventIds: readonly string[];
  readonly startedArcIds: readonly string[];
  readonly advancedArcIds: readonly string[];
}

export class EffectExecutor {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly relationGraph: RelationGraph,
  ) {}

  /**
   * Execute a list of effects against the current world state.
   * Returns the new state and a summary of all changes.
   */
  execute(
    state: WorldState,
    effects: readonly Effect[],
    source: string,
  ): EffectExecutionResult {
    let currentState = state;
    const entityDeltas: EntityDelta[] = [];
    const relationDeltas: RelationDelta[] = [];
    const spawnedEntityIds: string[] = [];
    const destroyedEntityIds: string[] = [];
    const triggeredEventIds: string[] = [];
    const startedArcIds: string[] = [];
    const advancedArcIds: string[] = [];

    for (const effect of effects) {
      const result = this.executeOne(currentState, effect, source);
      currentState = result.state;
      entityDeltas.push(...result.entityDeltas);
      relationDeltas.push(...result.relationDeltas);
      spawnedEntityIds.push(...result.spawnedEntityIds);
      destroyedEntityIds.push(...result.destroyedEntityIds);
      triggeredEventIds.push(...result.triggeredEventIds);
      startedArcIds.push(...result.startedArcIds);
      advancedArcIds.push(...result.advancedArcIds);
    }

    return {
      state: currentState,
      entityDeltas,
      relationDeltas,
      spawnedEntityIds,
      destroyedEntityIds,
      triggeredEventIds,
      startedArcIds,
      advancedArcIds,
    };
  }

  private executeOne(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    switch (effect.type) {
      case 'modify-stat':
        return this.modifyStat(state, effect, source);
      case 'modify-relation':
        return this.modifyRelation(state, effect, source);
      case 'add-component':
        return this.addComponent(state, effect, source);
      case 'remove-component':
        return this.removeComponent(state, effect, source);
      case 'spawn-entity':
        return this.spawnEntity(state, effect, source);
      case 'destroy-entity':
        return this.destroyEntity(state, effect, source);
      case 'trigger-event':
        return this.triggerEvent(state, effect);
      case 'start-arc':
        return this.startArc(state, effect);
      case 'advance-arc':
        return this.advanceArc(state, effect);
      case 'set-tag':
        return this.setTag(state, effect, source);
      case 'remove-tag':
        return this.removeTagEffect(state, effect, source);
      case 'move-entity':
        return this.moveEntityEffect(state, effect, source);
      case 'custom':
        // Custom effects are no-ops at the engine level
        return this.emptyResult(state);
      default:
        return this.emptyResult(state);
    }
  }

  private modifyStat(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const deltas: EntityDelta[] = [];

    for (const entityId of entityIds) {
      if (!effect.statId) continue;
      const result = this.entityManager.modifyStat(
        currentState,
        entityId,
        effect.statId,
        effect.amount ?? 0,
        source,
        effect.absoluteValue,
      );
      currentState = result.state;
      deltas.push(result.delta);
    }

    return { ...this.emptyResult(currentState), entityDeltas: deltas };
  }

  private modifyRelation(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    if (!effect.relationTypeId || !effect.sourceId || !effect.targetId) {
      return this.emptyResult(state);
    }

    const result = this.relationGraph.modifyOrCreateRelation(
      state,
      effect.relationTypeId,
      effect.sourceId,
      effect.targetId,
      effect.amount ?? 0,
      source,
      effect.absoluteValue,
    );

    return {
      ...this.emptyResult(result.state),
      relationDeltas: [result.delta],
    };
  }

  private addComponent(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const deltas: EntityDelta[] = [];

    for (const entityId of entityIds) {
      if (!effect.componentDefId) continue;
      const compData: ComponentData = {
        defId: effect.componentDefId,
        values: effect.componentValues ?? {},
      };
      const result = this.entityManager.addComponent(
        currentState,
        entityId,
        compData,
        source,
      );
      currentState = result.state;
      deltas.push(result.delta);
    }

    return { ...this.emptyResult(currentState), entityDeltas: deltas };
  }

  private removeComponent(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const deltas: EntityDelta[] = [];

    for (const entityId of entityIds) {
      if (!effect.componentDefId) continue;
      const result = this.entityManager.removeComponent(
        currentState,
        entityId,
        effect.componentDefId,
        source,
      );
      currentState = result.state;
      deltas.push(result.delta);
    }

    return { ...this.emptyResult(currentState), entityDeltas: deltas };
  }

  private spawnEntity(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    if (!effect.entityTypeId) return this.emptyResult(state);

    const result = this.entityManager.createEntity(
      state,
      effect.entityTypeId,
      effect.entityName ?? 'Unnamed',
      { locationId: effect.spawnLocationId },
    );

    return {
      ...this.emptyResult(result.state),
      spawnedEntityIds: [result.entityId],
    };
  }

  private destroyEntity(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const destroyed: string[] = [];

    for (const entityId of entityIds) {
      currentState = this.entityManager.destroyEntity(currentState, entityId);
      destroyed.push(entityId);
    }

    return {
      ...this.emptyResult(currentState),
      destroyedEntityIds: destroyed,
    };
  }

  private triggerEvent(
    state: WorldState,
    effect: Effect,
  ): EffectExecutionResult {
    if (!effect.eventId) return this.emptyResult(state);

    return {
      ...this.emptyResult(state),
      triggeredEventIds: [effect.eventId],
    };
  }

  private startArc(
    state: WorldState,
    effect: Effect,
  ): EffectExecutionResult {
    if (!effect.arcId) return this.emptyResult(state);

    // Check if arc already active
    const already = state.arcStates.find(
      (a) => a.arcId === effect.arcId && !a.completed && !a.failed,
    );
    if (already) return this.emptyResult(state);

    const newArcState = {
      arcId: effect.arcId,
      currentStageIndex: 0,
      startedTurn: state.turn.currentTurn,
      completed: false,
      failed: false,
    };

    return {
      ...this.emptyResult({
        ...state,
        arcStates: [...state.arcStates, newArcState],
      }),
      startedArcIds: [effect.arcId],
    };
  }

  private advanceArc(
    state: WorldState,
    effect: Effect,
  ): EffectExecutionResult {
    if (!effect.arcId) return this.emptyResult(state);

    const arcStateIndex = state.arcStates.findIndex(
      (a) => a.arcId === effect.arcId && !a.completed && !a.failed,
    );
    if (arcStateIndex === -1) return this.emptyResult(state);

    const arcState = state.arcStates[arcStateIndex];
    const arc = state.storyArcs.find((a) => a.id === effect.arcId);
    if (!arc) return this.emptyResult(state);

    const nextIndex = arcState.currentStageIndex + 1;
    const isComplete = nextIndex >= arc.stages.length;

    const updatedArcState = {
      ...arcState,
      currentStageIndex: isComplete ? arcState.currentStageIndex : nextIndex,
      completed: isComplete,
    };

    const newArcStates = [...state.arcStates];
    newArcStates[arcStateIndex] = updatedArcState;

    return {
      ...this.emptyResult({ ...state, arcStates: newArcStates }),
      advancedArcIds: [effect.arcId],
    };
  }

  private setTag(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    if (!effect.tag) return this.emptyResult(state);

    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const deltas: EntityDelta[] = [];

    for (const entityId of entityIds) {
      const result = this.entityManager.addTag(
        currentState,
        entityId,
        effect.tag,
        source,
      );
      currentState = result.state;
      deltas.push(result.delta);
    }

    return { ...this.emptyResult(currentState), entityDeltas: deltas };
  }

  private removeTagEffect(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    if (!effect.tag) return this.emptyResult(state);

    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const deltas: EntityDelta[] = [];

    for (const entityId of entityIds) {
      const result = this.entityManager.removeTag(
        currentState,
        entityId,
        effect.tag,
        source,
      );
      currentState = result.state;
      deltas.push(result.delta);
    }

    return { ...this.emptyResult(currentState), entityDeltas: deltas };
  }

  private moveEntityEffect(
    state: WorldState,
    effect: Effect,
    source: string,
  ): EffectExecutionResult {
    const entityIds = this.resolveEntityIds(state, effect);
    let currentState = state;
    const deltas: EntityDelta[] = [];

    for (const entityId of entityIds) {
      const result = this.entityManager.moveEntity(
        currentState,
        entityId,
        effect.locationId,
        source,
      );
      currentState = result.state;
      deltas.push(result.delta);
    }

    return { ...this.emptyResult(currentState), entityDeltas: deltas };
  }

  /**
   * Resolve target entity IDs from an effect's entityId or entityTag.
   */
  private resolveEntityIds(
    state: WorldState,
    effect: Effect,
  ): readonly string[] {
    if (effect.entityId) {
      return state.entities[effect.entityId] ? [effect.entityId] : [];
    }
    if (effect.entityTag) {
      return Object.values(state.entities)
        .filter((e) => e.tags.includes(effect.entityTag!))
        .map((e) => e.id);
    }
    return [];
  }

  private emptyResult(state: WorldState): EffectExecutionResult {
    return {
      state,
      entityDeltas: [],
      relationDeltas: [],
      spawnedEntityIds: [],
      destroyedEntityIds: [],
      triggeredEventIds: [],
      startedArcIds: [],
      advancedArcIds: [],
    };
  }
}
