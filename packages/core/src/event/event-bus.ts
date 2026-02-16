/**
 * EventBus - pub/sub event system for internal engine events.
 * Provides typed event subscription, emission, and cleanup.
 */

import type {
  Entity,
  EntityDelta,
  Relation,
  RelationDelta,
  ActionResult,
  GameEvent,
  TurnPhase,
  ArcState,
} from '@event-horizon/types';

/** All engine event types and their payloads */
export interface EngineEventMap {
  'entity:created': { entity: Entity };
  'entity:destroyed': { entityId: string; entity: Entity };
  'stat:changed': { entityId: string; statId: string; oldValue: number; newValue: number; delta: EntityDelta };
  'relation:changed': { relation: Relation; delta: RelationDelta };
  'action:resolved': { result: ActionResult };
  'event:fired': { event: GameEvent; choiceId?: string };
  'arc:advanced': { arcState: ArcState; stageIndex: number };
  'turn:phase-started': { phase: TurnPhase };
  'turn:phase-ended': { phase: TurnPhase };
  'turn:completed': { turnNumber: number };
}

/** Valid event type strings */
export type EngineEventType = keyof EngineEventMap;

/** Event handler callback */
type EventHandler<T> = (payload: T) => void;

/** Unsubscribe function returned by subscribe */
export type Unsubscribe = () => void;

export class EventBus {
  private handlers = new Map<string, Set<EventHandler<unknown>>>();

  /**
   * Subscribe to an engine event.
   * @returns An unsubscribe function that removes this handler.
   */
  subscribe<K extends EngineEventType>(
    eventType: K,
    handler: EventHandler<EngineEventMap[K]>,
  ): Unsubscribe {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    const handlerSet = this.handlers.get(eventType)!;
    handlerSet.add(handler as EventHandler<unknown>);

    return () => {
      handlerSet.delete(handler as EventHandler<unknown>);
      if (handlerSet.size === 0) {
        this.handlers.delete(eventType);
      }
    };
  }

  /**
   * Emit an event to all subscribers.
   */
  emit<K extends EngineEventType>(
    eventType: K,
    payload: EngineEventMap[K],
  ): void {
    const handlerSet = this.handlers.get(eventType);
    if (!handlerSet) return;

    for (const handler of handlerSet) {
      handler(payload);
    }
  }

  /**
   * Remove all handlers for a specific event type.
   */
  removeAll(eventType: EngineEventType): void {
    this.handlers.delete(eventType);
  }

  /**
   * Remove all handlers for all event types.
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Get the number of subscribers for a given event type.
   */
  listenerCount(eventType: EngineEventType): number {
    return this.handlers.get(eventType)?.size ?? 0;
  }
}
