/**
 * ActionRegistry - registers action types from the schema and provides
 * queries for available actions per entity, respecting phases and cooldowns.
 */

import type {
  WorldState,
  ActionTypeDef,
  Entity,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';

/** An action available to an entity with availability info */
export interface AvailableAction {
  readonly typeId: string;
  readonly name: string;
  readonly targets: readonly string[];
  readonly enabled: boolean;
  readonly disabledReason?: string;
}

export class ActionRegistry {
  /** Map of actionTypeId -> last-used turn per entity */
  private cooldowns = new Map<string, number>();

  constructor(private readonly registry: SchemaRegistry) {}

  /**
   * Register all action types from the schema.
   * Called during engine initialization.
   */
  registerFromSchema(): void {
    // Action types are already in the schema registry; nothing extra needed.
  }

  /**
   * Record that an entity used an action this turn (for cooldown tracking).
   */
  recordActionUse(entityId: string, actionTypeId: string, turn: number): void {
    this.cooldowns.set(`${entityId}:${actionTypeId}`, turn);
  }

  /**
   * Get the turn an action was last used by an entity.
   */
  getLastUsedTurn(entityId: string, actionTypeId: string): number | undefined {
    return this.cooldowns.get(`${entityId}:${actionTypeId}`);
  }

  /**
   * Get all available actions for an entity in the current state.
   * Checks entity type, phase, and cooldown.
   */
  getAvailableActions(
    state: WorldState,
    entityId: string,
  ): readonly AvailableAction[] {
    const entity = state.entities[entityId];
    if (!entity) return [];

    const schema = this.registry.getSchema();
    const currentPhaseId = state.turn.currentPhase.phaseId;
    const currentTurn = state.turn.currentTurn;
    const results: AvailableAction[] = [];

    for (const actionType of schema.actionTypes) {
      // Check if this entity type can perform this action
      if (!actionType.performerTypes.includes(entity.typeId)) {
        continue;
      }

      // Check phase
      const phaseAllowed = actionType.allowedPhases.includes(currentPhaseId);

      // Check cooldown
      let cooldownReady = true;
      let disabledReason: string | undefined;

      if (actionType.cooldown) {
        const lastUsed = this.getLastUsedTurn(entityId, actionType.id);
        if (lastUsed !== undefined) {
          const turnsSince = currentTurn - lastUsed;
          if (turnsSince < actionType.cooldown) {
            cooldownReady = false;
            disabledReason = `On cooldown (${actionType.cooldown - turnsSince} turns remaining)`;
          }
        }
      }

      if (!phaseAllowed) {
        disabledReason = `Not available during phase '${currentPhaseId}'`;
      }

      // Find valid targets
      const targets = this.findValidTargets(state, entity, actionType);

      results.push({
        typeId: actionType.id,
        name: actionType.name,
        targets,
        enabled: phaseAllowed && cooldownReady,
        disabledReason,
      });
    }

    return results;
  }

  /**
   * Check if a specific action is available for an entity.
   */
  isActionAvailable(
    state: WorldState,
    entityId: string,
    actionTypeId: string,
  ): boolean {
    const available = this.getAvailableActions(state, entityId);
    const action = available.find((a) => a.typeId === actionTypeId);
    return action?.enabled ?? false;
  }

  /**
   * Find valid targets for an action type given the performer.
   */
  private findValidTargets(
    state: WorldState,
    performer: Entity,
    actionType: ActionTypeDef,
  ): readonly string[] {
    if (!actionType.targetTypes || actionType.targetTypes.length === 0) {
      return [];
    }

    return Object.values(state.entities)
      .filter(
        (e) =>
          e.id !== performer.id &&
          actionType.targetTypes!.includes(e.typeId),
      )
      .map((e) => e.id);
  }
}
