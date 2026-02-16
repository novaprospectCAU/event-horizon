/**
 * Game Store - Zustand store for managing game state in the UI.
 */

import { createStore } from 'zustand/vanilla';
import type {
  Entity,
  Relation,
  TurnPhase,
  EngineMessage,
  UIMessage,
  ActionResult,
  Scene,
  DialogueNode,
  GameEvent,
  EventChoice,
} from '@event-horizon/types';

/** An available action shown to the player */
export interface AvailableAction {
  readonly typeId: string;
  readonly name: string;
  readonly targets?: readonly string[];
  readonly enabled: boolean;
  readonly disabledReason?: string;
}

/** A dialogue response the player can choose */
export interface AvailableResponse {
  readonly id: string;
  readonly text: string;
}

/** Game UI state */
export interface GameState {
  // Connection status
  connected: boolean;

  // World state
  entities: Record<string, Entity>;
  relations: readonly Relation[];
  currentTurn: number;
  currentPhase: TurnPhase | null;

  // Player interaction
  availableActions: AvailableAction[];
  selectedEntityId: string | null;
  awaitingInput: boolean;

  // Narrative
  narrativeLog: readonly { text: string; source: string; turn: number }[];
  currentScene: Scene | null;
  currentDialogueNode: DialogueNode | null;
  availableResponses: AvailableResponse[];

  // Events
  currentEvent: GameEvent | null;
  eventChoices: readonly EventChoice[];

  // Results
  lastActionResult: ActionResult | null;

  // Game status
  gameOver: boolean;
  gameOverReason: string | null;
  gameOverSummary: string | null;

  // Error handling
  lastError: { code: string; message: string } | null;
}

/** Actions that can be dispatched to the store */
export interface GameActions {
  // Process messages from the engine
  handleEngineMessage(msg: EngineMessage): void;

  // UI interactions
  setSelectedEntity(entityId: string | null): void;
  clearError(): void;
  clearEvent(): void;
  setConnected(connected: boolean): void;
  addNarrative(text: string, source: string): void;
}

export type GameStore = GameState & GameActions;

/** Callback for sending messages to the engine */
export type SendMessageFn = (msg: UIMessage) => void;

/** Create a game store instance */
export function createGameStore(sendMessage?: SendMessageFn) {
  return createStore<GameStore>((set, get) => ({
    // Initial state
    connected: false,
    entities: {},
    relations: [],
    currentTurn: 0,
    currentPhase: null,
    availableActions: [],
    selectedEntityId: null,
    awaitingInput: false,
    narrativeLog: [],
    currentScene: null,
    currentDialogueNode: null,
    availableResponses: [],
    currentEvent: null,
    eventChoices: [],
    lastActionResult: null,
    gameOver: false,
    gameOverReason: null,
    gameOverSummary: null,
    lastError: null,

    handleEngineMessage(msg: EngineMessage) {
      switch (msg.type) {
        case 'state-update':
          set({
            entities: msg.entities as Record<string, Entity>,
            relations: msg.relations,
            currentTurn: msg.turn,
          });
          break;

        case 'phase-change':
          set({
            currentPhase: msg.phase,
            awaitingInput: msg.phase.phaseType === 'player-action',
          });
          break;

        case 'available-actions':
          set({
            availableActions: msg.actions as AvailableAction[],
            awaitingInput: true,
          });
          break;

        case 'action-result':
          set({ lastActionResult: msg.result });
          if (msg.result.narrative) {
            get().addNarrative(msg.result.narrative, 'action');
          }
          break;

        case 'scene-start':
          set({ currentScene: msg.scene });
          if (msg.narrative) {
            get().addNarrative(msg.narrative, 'scene');
          }
          break;

        case 'dialogue-node':
          set({
            currentDialogueNode: msg.node,
            availableResponses: msg.availableResponses as AvailableResponse[],
            awaitingInput: true,
          });
          break;

        case 'event-fired':
          set({
            currentEvent: msg.event,
            eventChoices: msg.choices ?? [],
            awaitingInput: (msg.choices ?? []).length > 0,
          });
          if (msg.narrative) {
            get().addNarrative(msg.narrative, 'event');
          }
          break;

        case 'narrative':
          get().addNarrative(msg.text, msg.source);
          break;

        case 'game-over':
          set({
            gameOver: true,
            gameOverReason: msg.reason,
            gameOverSummary: msg.summary,
          });
          break;

        case 'error':
          set({ lastError: { code: msg.code, message: msg.message } });
          break;
      }
    },

    setSelectedEntity(entityId: string | null) {
      set({ selectedEntityId: entityId });
    },

    clearError() {
      set({ lastError: null });
    },

    clearEvent() {
      set({ currentEvent: null, eventChoices: [] });
    },

    setConnected(connected: boolean) {
      set({ connected });
    },

    addNarrative(text: string, source: string) {
      set((state) => ({
        narrativeLog: [
          ...state.narrativeLog,
          { text, source, turn: state.currentTurn },
        ],
      }));
    },
  }));
}
