/**
 * EngineAdapter - wraps the engine core and translates protocol messages.
 *
 * Receives UIMessages from the client side, processes them, and emits
 * EngineMessages back. Manages message queuing and ordering.
 */

import type { EngineMessage, UIMessage } from '@event-horizon/types';

/** Handler callback for engine messages */
export type EngineMessageHandler = (msg: EngineMessage) => void;

/** Handler callback for incoming UI messages */
export type UIMessageProcessor = (msg: UIMessage) => void;

/**
 * Adapter that sits on the engine side of the protocol bridge.
 *
 * The engine registers handlers to receive UIMessages and emits
 * EngineMessages to connected clients.
 */
export class EngineAdapter {
  private readonly handlers: Set<EngineMessageHandler> = new Set();
  private readonly uiHandlers: Set<UIMessageProcessor> = new Set();
  private readonly messageQueue: EngineMessage[] = [];
  private disposed = false;
  private flushing = false;

  /**
   * Register a handler for outgoing EngineMessages.
   * Returns an unsubscribe function.
   */
  onMessage(handler: EngineMessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * Register a handler for incoming UIMessages.
   * These handlers process messages from the client.
   * Returns an unsubscribe function.
   */
  onUIMessage(handler: UIMessageProcessor): () => void {
    this.uiHandlers.add(handler);
    return () => {
      this.uiHandlers.delete(handler);
    };
  }

  /**
   * Emit an EngineMessage to all registered handlers.
   * Messages are queued and flushed in order to prevent re-entrant dispatch.
   */
  emit(msg: EngineMessage): void {
    if (this.disposed) return;
    this.messageQueue.push(msg);
    this.flush();
  }

  /**
   * Receive a UIMessage from the client side.
   * Dispatches to registered UI message processors.
   */
  send(msg: UIMessage): void {
    if (this.disposed) return;
    for (const handler of this.uiHandlers) {
      handler(msg);
    }
  }

  /** Clean up all handlers and clear the message queue */
  dispose(): void {
    this.disposed = true;
    this.handlers.clear();
    this.uiHandlers.clear();
    this.messageQueue.length = 0;
  }

  /** Whether this adapter has been disposed */
  get isDisposed(): boolean {
    return this.disposed;
  }

  /** Flush queued messages to all handlers in order */
  private flush(): void {
    if (this.flushing) return;
    this.flushing = true;
    try {
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift()!;
        for (const handler of this.handlers) {
          handler(msg);
        }
      }
    } finally {
      this.flushing = false;
    }
  }
}
