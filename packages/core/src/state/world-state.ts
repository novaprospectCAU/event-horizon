/**
 * WorldStateManager - creates and manages immutable WorldState objects.
 * All state updates return new state objects; nothing is mutated in place.
 */

import type {
  WorldSchema,
  WorldState,
  TurnState,
  TurnPhase,
  Entity,
  Relation,
  EntityDelta,
  RelationDelta,
  GameEvent,
  StoryArc,
  ArcState,
  Scene,
  NPCBehaviorProfile,
  NPCMemory,
  EventRecord,
  RNGState,
} from '@event-horizon/types';
import { createRNGState } from '../rng.js';

export class WorldStateManager {
  /**
   * Create the initial WorldState from a schema definition.
   * Initializes all collections as empty and sets turn 1 / first phase.
   */
  createInitialState(schema: WorldSchema): WorldState {
    const orderedPhases = [...schema.phases].sort((a, b) => a.order - b.order);
    const firstPhase = orderedPhases[0];

    if (!firstPhase) {
      throw new Error('Schema must define at least one phase');
    }

    const initialPhase: TurnPhase = {
      turnNumber: 1,
      phaseId: firstPhase.id,
      phaseType: firstPhase.type,
      phaseIndex: 0,
      totalPhases: orderedPhases.length,
    };

    const turnState: TurnState = {
      currentTurn: 1,
      currentPhase: initialPhase,
      isComplete: false,
      awaitingInput: firstPhase.type === 'player-action',
    };

    const seed = schema.config.rngSeed ?? Date.now();

    return {
      schema,
      turn: turnState,
      entities: {},
      relations: [],
      events: [],
      storyArcs: [],
      arcStates: [],
      scenes: [],
      npcProfiles: [],
      npcMemories: [],
      eventHistory: [],
      entityDeltas: [],
      relationDeltas: [],
      rng: createRNGState(seed),
    };
  }

  /** Update entities in the world state (immutable) */
  updateEntities(
    state: WorldState,
    entities: Readonly<Record<string, Entity>>,
  ): WorldState {
    return { ...state, entities };
  }

  /** Update relations in the world state (immutable) */
  updateRelations(state: WorldState, relations: readonly Relation[]): WorldState {
    return { ...state, relations };
  }

  /** Update the turn state */
  updateTurn(state: WorldState, turn: TurnState): WorldState {
    return { ...state, turn };
  }

  /** Update the RNG state */
  updateRNG(state: WorldState, rng: RNGState): WorldState {
    return { ...state, rng };
  }

  /** Append entity deltas */
  appendEntityDeltas(
    state: WorldState,
    deltas: readonly EntityDelta[],
  ): WorldState {
    return {
      ...state,
      entityDeltas: [...state.entityDeltas, ...deltas],
    };
  }

  /** Append relation deltas */
  appendRelationDeltas(
    state: WorldState,
    deltas: readonly RelationDelta[],
  ): WorldState {
    return {
      ...state,
      relationDeltas: [...state.relationDeltas, ...deltas],
    };
  }

  /** Update events list */
  updateEvents(state: WorldState, events: readonly GameEvent[]): WorldState {
    return { ...state, events };
  }

  /** Update event history */
  updateEventHistory(
    state: WorldState,
    eventHistory: readonly EventRecord[],
  ): WorldState {
    return { ...state, eventHistory };
  }

  /** Update story arcs */
  updateStoryArcs(state: WorldState, storyArcs: readonly StoryArc[]): WorldState {
    return { ...state, storyArcs };
  }

  /** Update arc states */
  updateArcStates(state: WorldState, arcStates: readonly ArcState[]): WorldState {
    return { ...state, arcStates };
  }

  /** Update scenes */
  updateScenes(state: WorldState, scenes: readonly Scene[]): WorldState {
    return { ...state, scenes };
  }

  /** Update NPC profiles */
  updateNPCProfiles(
    state: WorldState,
    npcProfiles: readonly NPCBehaviorProfile[],
  ): WorldState {
    return { ...state, npcProfiles };
  }

  /** Update NPC memories */
  updateNPCMemories(
    state: WorldState,
    npcMemories: readonly NPCMemory[],
  ): WorldState {
    return { ...state, npcMemories };
  }

  /**
   * Create a snapshot of the current state for save/restore.
   * Since state is immutable, the state object itself is the snapshot.
   */
  snapshot(state: WorldState): WorldState {
    return state;
  }

  /**
   * Restore from a previously taken snapshot.
   * Returns the snapshot state with deltas cleared (fresh tracking from restore point).
   */
  restore(snapshot: WorldState): WorldState {
    return {
      ...snapshot,
      entityDeltas: [],
      relationDeltas: [],
    };
  }

  /** Advance to the next phase within the current turn */
  advancePhase(state: WorldState): WorldState {
    const orderedPhases = [...state.schema.phases].sort(
      (a, b) => a.order - b.order,
    );
    const currentIndex = state.turn.currentPhase.phaseIndex;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= orderedPhases.length) {
      // All phases complete for this turn
      return {
        ...state,
        turn: {
          ...state.turn,
          isComplete: true,
          awaitingInput: false,
        },
      };
    }

    const nextPhase = orderedPhases[nextIndex];
    const newPhase: TurnPhase = {
      turnNumber: state.turn.currentTurn,
      phaseId: nextPhase.id,
      phaseType: nextPhase.type,
      phaseIndex: nextIndex,
      totalPhases: orderedPhases.length,
    };

    return {
      ...state,
      turn: {
        ...state.turn,
        currentPhase: newPhase,
        awaitingInput: nextPhase.type === 'player-action',
      },
    };
  }

  /** Advance to the next turn, resetting phase to first */
  advanceTurn(state: WorldState): WorldState {
    const orderedPhases = [...state.schema.phases].sort(
      (a, b) => a.order - b.order,
    );
    const firstPhase = orderedPhases[0];

    if (!firstPhase) {
      throw new Error('Schema must define at least one phase');
    }

    const nextTurn = state.turn.currentTurn + 1;
    const newPhase: TurnPhase = {
      turnNumber: nextTurn,
      phaseId: firstPhase.id,
      phaseType: firstPhase.type,
      phaseIndex: 0,
      totalPhases: orderedPhases.length,
    };

    return {
      ...state,
      turn: {
        currentTurn: nextTurn,
        currentPhase: newPhase,
        isComplete: false,
        awaitingInput: firstPhase.type === 'player-action',
      },
      entityDeltas: [],
      relationDeltas: [],
    };
  }
}
