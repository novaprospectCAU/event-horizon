/**
 * ClientAdapter - adapter for UI clients to communicate with the engine.
 *
 * Mirror of EngineAdapter on the client side. Receives EngineMessages
 * from the engine and sends UIMessages back.
 */

import type { EngineMessage, UIMessage } from '@event-horizon/types';

/** Handler callback for incoming engine messages */
export type EngineMessageHandler = (msg: EngineMessage) => void;

/** Handler callback for outgoing UI messages */
export type UIMessageHandler = (msg: UIMessage) => void;

/**
 * Adapter that sits on the client/UI side of the protocol bridge.
 *
 * The UI registers handlers to receive EngineMessages and sends
 * UIMessages to the connected engine.
 */
export class ClientAdapter {
  private readonly handlers: Set<EngineMessageHandler> = new Set();
  private readonly sendHandlers: Set<UIMessageHandler> = new Set();
  private readonly messageQueue: EngineMessage[] = [];
  private disposed = false;
  private flushing = false;

  /**
   * Register a handler for incoming EngineMessages.
   * Returns an unsubscribe function.
   */
  onMessage(handler: EngineMessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * Register a handler that receives outgoing UIMessages.
   * Used internally by the connection layer to forward messages.
   * Returns an unsubscribe function.
   */
  onSend(handler: UIMessageHandler): () => void {
    this.sendHandlers.add(handler);
    return () => {
      this.sendHandlers.delete(handler);
    };
  }

  /**
   * Send a UIMessage to the engine.
   * Dispatches to registered send handlers which forward to the engine.
   */
  send(msg: UIMessage): void {
    if (this.disposed) return;
    for (const handler of this.sendHandlers) {
      handler(msg);
    }
  }

  /**
   * Receive an EngineMessage from the engine side.
   * Messages are queued and flushed in order to prevent re-entrant dispatch.
   */
  receive(msg: EngineMessage): void {
    if (this.disposed) return;
    this.messageQueue.push(msg);
    this.flush();
  }

  /** Clean up all handlers and clear the message queue */
  dispose(): void {
    this.disposed = true;
    this.handlers.clear();
    this.sendHandlers.clear();
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
