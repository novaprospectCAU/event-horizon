/**
 * useWorldState hook - convenience selectors for world state data.
 */

import { useMemo } from 'react';
import type { Entity, Relation } from '@event-horizon/types';
import type { GameState } from '../stores/game-store.js';

/** Get all entities of a given type */
export function useEntitiesByType(state: GameState, typeId: string): Entity[] {
  return useMemo(
    () => Object.values(state.entities).filter((e) => e.typeId === typeId),
    [state.entities, typeId],
  );
}

/** Get all entities with a specific tag */
export function useEntitiesByTag(state: GameState, tag: string): Entity[] {
  return useMemo(
    () => Object.values(state.entities).filter((e) => e.tags.includes(tag)),
    [state.entities, tag],
  );
}

/** Get entity by ID */
export function useEntity(state: GameState, entityId: string): Entity | undefined {
  return state.entities[entityId];
}

/** Get relations involving a specific entity */
export function useRelationsForEntity(state: GameState, entityId: string): Relation[] {
  return useMemo(
    () =>
      state.relations.filter(
        (r) => r.sourceId === entityId || r.targetId === entityId,
      ),
    [state.relations, entityId],
  );
}

/** Get relations between two specific entities */
export function useRelationBetween(
  state: GameState,
  entityA: string,
  entityB: string,
  typeId?: string,
): Relation[] {
  return useMemo(
    () =>
      state.relations.filter(
        (r) =>
          ((r.sourceId === entityA && r.targetId === entityB) ||
            (r.sourceId === entityB && r.targetId === entityA)) &&
          (!typeId || r.typeId === typeId),
      ),
    [state.relations, entityA, entityB, typeId],
  );
}

/** Get entities at a specific location */
export function useEntitiesAtLocation(state: GameState, locationId: string): Entity[] {
  return useMemo(
    () => Object.values(state.entities).filter((e) => e.locationId === locationId),
    [state.entities, locationId],
  );
}
