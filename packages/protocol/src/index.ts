/**
 * @event-horizon/protocol
 *
 * JSON message-based protocol layer between the engine core and UI clients.
 * Provides adapters, type guards, factory functions, and serialization helpers.
 */

// Message utilities
export {
  // Engine message type guards
  isStateUpdate,
  isPhaseChange,
  isAvailableActions,
  isActionResult,
  isSceneStart,
  isDialogueNode,
  isEventFired,
  isNarrative,
  isGameOver,
  isError,
  // UI message type guards
  isSubmitAction,
  isSelectChoice,
  isSelectDialogueResponse,
  isFreeTextInput,
  isEndTurn,
  isSaveGame,
  isLoadGame,
  isStartGame,
  // Engine message factories
  createStateUpdate,
  createPhaseChange,
  createAvailableActions,
  createActionResult,
  createSceneStart,
  createDialogueNode,
  createEventFired,
  createNarrative,
  createGameOver,
  createError,
  // UI message factories
  createSubmitAction,
  createSelectChoice,
  createSelectDialogueResponse,
  createFreeTextInput,
  createEndTurn,
  createSaveGame,
  createLoadGame,
  createStartGame,
  // Serialization
  serializeMessage,
  deserializeEngineMessage,
  deserializeUIMessage,
} from './messages.js';

// Adapters
export { EngineAdapter } from './engine-adapter.js';
export type { EngineMessageHandler as EngineAdapterMessageHandler, UIMessageProcessor } from './engine-adapter.js';

export { ClientAdapter } from './client-adapter.js';
export type { EngineMessageHandler as ClientAdapterMessageHandler, UIMessageHandler } from './client-adapter.js';

// ─── Direct Connection Helper ───

import { EngineAdapter } from './engine-adapter.js';
import { ClientAdapter } from './client-adapter.js';

/** Disposable connection handle returned by createDirectConnection */
export interface DirectConnection {
  /** Disconnect the adapters and clean up listeners */
  dispose(): void;
}

/**
 * Wire an EngineAdapter and ClientAdapter together for in-memory communication.
 *
 * EngineMessages emitted by the engine adapter are forwarded to the client adapter.
 * UIMessages sent by the client adapter are forwarded to the engine adapter.
 *
 * Returns a handle that can be disposed to disconnect both sides.
 */
export function createDirectConnection(
  engine: EngineAdapter,
  client: ClientAdapter,
): DirectConnection {
  // Forward engine messages to client
  const unsubEngine = engine.onMessage((msg) => {
    client.receive(msg);
  });

  // Forward client UI messages to engine
  const unsubClient = client.onSend((msg) => {
    engine.send(msg);
  });

  return {
    dispose() {
      unsubEngine();
      unsubClient();
    },
  };
}
