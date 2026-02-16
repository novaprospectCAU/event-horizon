/**
 * useEngine hook - connects the UI to the engine via protocol adapters.
 */

import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import type { EngineMessage, UIMessage, Action } from '@event-horizon/types';
import { createGameStore, type GameStore, type GameState } from '../stores/game-store.js';

/** Engine connection interface */
export interface EngineConnection {
  send(msg: UIMessage): void;
  onMessage(handler: (msg: EngineMessage) => void): void;
  dispose(): void;
}

/** Options for the useEngine hook */
export interface UseEngineOptions {
  /** Factory function that creates the connection to the engine */
  createConnection: () => EngineConnection;
}

/** Return type of the useEngine hook */
export interface UseEngineReturn {
  state: GameState;
  submitAction: (action: Action) => void;
  selectChoice: (eventId: string, choiceId: string) => void;
  selectDialogueResponse: (responseId: string) => void;
  sendFreeText: (text: string, context: string) => void;
  endTurn: () => void;
  saveGame: (name: string) => void;
  loadGame: (saveId: string) => void;
  startGame: (schemaId: string, playerEntityId?: string) => void;
}

export function useEngine(options: UseEngineOptions): UseEngineReturn {
  const storeRef = useRef<ReturnType<typeof createGameStore> | null>(null);
  const connectionRef = useRef<EngineConnection | null>(null);

  if (!storeRef.current) {
    storeRef.current = createGameStore();
  }

  const store = storeRef.current;

  useEffect(() => {
    const connection = options.createConnection();
    connectionRef.current = connection;
    store.getState().setConnected(true);

    connection.onMessage((msg) => {
      store.getState().handleEngineMessage(msg);
    });

    return () => {
      connection.dispose();
      connectionRef.current = null;
      store.getState().setConnected(false);
    };
  }, [options, store]);

  const send = useCallback(
    (msg: UIMessage) => {
      connectionRef.current?.send(msg);
    },
    [],
  );

  const state = useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState,
  );

  const submitAction = useCallback(
    (action: Action) => {
      send({ type: 'submit-action', action });
    },
    [send],
  );

  const selectChoice = useCallback(
    (eventId: string, choiceId: string) => {
      send({ type: 'select-choice', eventId, choiceId });
    },
    [send],
  );

  const selectDialogueResponse = useCallback(
    (responseId: string) => {
      send({ type: 'select-dialogue-response', responseId });
    },
    [send],
  );

  const sendFreeText = useCallback(
    (text: string, context: string) => {
      send({ type: 'free-text-input', text, context });
    },
    [send],
  );

  const endTurn = useCallback(
    () => {
      send({ type: 'end-turn' });
    },
    [send],
  );

  const saveGame = useCallback(
    (name: string) => {
      send({ type: 'save-game', name });
    },
    [send],
  );

  const loadGame = useCallback(
    (saveId: string) => {
      send({ type: 'load-game', saveId });
    },
    [send],
  );

  const startGame = useCallback(
    (schemaId: string, playerEntityId?: string) => {
      send({ type: 'start-game', schemaId, playerEntityId });
    },
    [send],
  );

  return {
    state,
    submitAction,
    selectChoice,
    selectDialogueResponse,
    sendFreeText,
    endTurn,
    saveGame,
    loadGame,
    startGame,
  };
}
