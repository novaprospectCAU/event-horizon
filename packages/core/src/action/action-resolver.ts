/**
 * ActionResolver - resolves validated actions, producing ActionResults
 * and applying effects to the world state.
 */

import type {
  Action,
  ActionResult,
  Effect,
  WorldState,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';
import type { ActionValidator } from './action-validator.js';
import type { EventBus } from '../event/event-bus.js';
import { generateId } from '../rng.js';

/**
 * Handler function for resolving a specific action type.
 * Receives the action and current state, returns effects and optional narrative.
 */
export type ActionHandler = (
  action: Action,
  state: WorldState,
) => { effects: readonly Effect[]; narrative?: string };

export class ActionResolver {
  private readonly handlers = new Map<string, ActionHandler>();

  constructor(
    private readonly registry: SchemaRegistry,
    private readonly validator: ActionValidator,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Register a handler for a specific action type.
   * Handlers compute the effects of an action given the current state.
   */
  registerHandler(actionTypeId: string, handler: ActionHandler): void {
    this.handlers.set(actionTypeId, handler);
  }

  /**
   * Resolve an action: validate it, compute results, and emit events.
   * Does NOT apply effects to state - that's the effect executor's job.
   */
  resolve(
    state: WorldState,
    action: Action,
  ): { result: ActionResult; rngState: WorldState } {
    // Validate the action
    const validation = this.validator.validate(state, action);
    if (!validation.valid) {
      const [, newRng] = generateId(state.rng, 'res_');
      const result: ActionResult = {
        actionId: action.id,
        success: false,
        effects: [],
        narrative: `Action failed: ${validation.errors.join('; ')}`,
      };
      this.eventBus.emit('action:resolved', { result });
      return { result, rngState: { ...state, rng: newRng } };
    }

    // Find handler
    const handler = this.handlers.get(action.typeId);
    if (!handler) {
      // Default handler: action succeeds with no effects
      const [, newRng] = generateId(state.rng, 'res_');
      const result: ActionResult = {
        actionId: action.id,
        success: true,
        effects: [],
        narrative: `${action.performerId} performed ${action.typeId}`,
      };
      this.eventBus.emit('action:resolved', { result });
      return { result, rngState: { ...state, rng: newRng } };
    }

    // Execute handler to get effects
    const { effects, narrative } = handler(action, state);

    const result: ActionResult = {
      actionId: action.id,
      success: true,
      effects,
      narrative,
    };

    this.eventBus.emit('action:resolved', { result });
    return { result, rngState: state };
  }

  /**
   * Resolve multiple actions in order.
   * Returns all results and the final state (with updated RNG).
   */
  resolveAll(
    state: WorldState,
    actions: readonly Action[],
  ): { results: readonly ActionResult[]; state: WorldState } {
    const results: ActionResult[] = [];
    let currentState = state;

    for (const action of actions) {
      const { result, rngState } = this.resolve(currentState, action);
      results.push(result);
      currentState = rngState;
    }

    return { results, state: currentState };
  }
}
