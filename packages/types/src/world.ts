/**
 * World State - the complete game state at a point in time.
 */

import type { Entity, EntityDelta } from './entity.js';
import type { Relation, RelationDelta } from './relation.js';
import type { GameEvent } from './event.js';
import type { StoryArc, ArcState, Scene } from './narrative.js';
import type { NPCBehaviorProfile, NPCMemory } from './npc.js';
import type { TurnState } from './turn.js';
import type { WorldSchema } from './schema.js';

/** Event firing history */
export interface EventRecord {
  readonly eventId: string;
  readonly turn: number;
  readonly choiceId?: string;
  readonly occurrenceCount: number;
}

/** Seeded random number generator state */
export interface RNGState {
  readonly seed: number;
  readonly callCount: number;
}

/** The complete state of the game world */
export interface WorldState {
  readonly schema: WorldSchema;
  readonly turn: TurnState;
  readonly entities: Readonly<Record<string, Entity>>;
  readonly relations: readonly Relation[];
  readonly events: readonly GameEvent[];
  readonly storyArcs: readonly StoryArc[];
  readonly arcStates: readonly ArcState[];
  readonly scenes: readonly Scene[];
  readonly npcProfiles: readonly NPCBehaviorProfile[];
  readonly npcMemories: readonly NPCMemory[];
  readonly eventHistory: readonly EventRecord[];
  readonly entityDeltas: readonly EntityDelta[];
  readonly relationDeltas: readonly RelationDelta[];
  readonly playerEntityId?: string;
  readonly rng: RNGState;
}

/** Serializable save state */
export interface SaveState {
  readonly version: string;
  readonly timestamp: string;
  readonly name: string;
  readonly worldState: WorldState;
}
