/**
 * ActionValidator - validates actions against schema definitions
 * before they are resolved.
 */

import type {
  Action,
  WorldState,
  ActionTypeDef,
  Entity,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';

/** Validation result for an action */
export interface ActionValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export class ActionValidator {
  constructor(private readonly registry: SchemaRegistry) {}

  /**
   * Validate an action against the schema and current world state.
   * Checks performer type, target type, phase, and action type existence.
   */
  validate(state: WorldState, action: Action): ActionValidationResult {
    const errors: string[] = [];

    // Check action type exists
    const actionType = this.registry.getActionTypeDef(action.typeId);
    if (!actionType) {
      return { valid: false, errors: [`Unknown action type '${action.typeId}'`] };
    }

    // Check performer exists
    const performer = state.entities[action.performerId];
    if (!performer) {
      errors.push(`Performer entity '${action.performerId}' not found`);
      return { valid: false, errors };
    }

    // Check performer type is allowed
    if (!actionType.performerTypes.includes(performer.typeId)) {
      errors.push(
        `Entity type '${performer.typeId}' cannot perform action '${action.typeId}'. ` +
        `Allowed types: ${actionType.performerTypes.join(', ')}`,
      );
    }

    // Check target exists and is valid type (if action requires a target)
    if (action.targetId) {
      const target = state.entities[action.targetId];
      if (!target) {
        errors.push(`Target entity '${action.targetId}' not found`);
      } else if (actionType.targetTypes && actionType.targetTypes.length > 0) {
        if (!actionType.targetTypes.includes(target.typeId)) {
          errors.push(
            `Entity type '${target.typeId}' cannot be targeted by action '${action.typeId}'. ` +
            `Allowed target types: ${actionType.targetTypes.join(', ')}`,
          );
        }
      }
    } else if (actionType.targetTypes && actionType.targetTypes.length > 0) {
      errors.push(`Action '${action.typeId}' requires a target`);
    }

    // Check phase is allowed
    if (!actionType.allowedPhases.includes(action.phase)) {
      errors.push(
        `Action '${action.typeId}' not allowed in phase '${action.phase}'. ` +
        `Allowed phases: ${actionType.allowedPhases.join(', ')}`,
      );
    }

    // Check turn matches current turn
    if (action.turn !== state.turn.currentTurn) {
      errors.push(
        `Action turn ${action.turn} does not match current turn ${state.turn.currentTurn}`,
      );
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Get available actions for an entity in the current game state.
   * Returns all action types the entity can perform, with enabled/disabled status.
   */
  getAvailableActions(
    state: WorldState,
    entityId: string,
  ): readonly {
    typeId: string;
    name: string;
    targets?: readonly string[];
    enabled: boolean;
    disabledReason?: string;
  }[] {
    const entity = state.entities[entityId];
    if (!entity) return [];

    const schema = this.registry.getSchema();
    const currentPhase = state.turn.currentPhase.phaseId;
    const results: {
      typeId: string;
      name: string;
      targets?: readonly string[];
      enabled: boolean;
      disabledReason?: string;
    }[] = [];

    for (const actionType of schema.actionTypes) {
      // Check performer type
      if (!actionType.performerTypes.includes(entity.typeId)) {
        continue;
      }

      // Check phase
      if (!actionType.allowedPhases.includes(currentPhase)) {
        continue;
      }

      // Find valid targets
      let targets: string[] | undefined;
      let enabled = true;
      let disabledReason: string | undefined;

      if (actionType.targetTypes && actionType.targetTypes.length > 0) {
        targets = Object.values(state.entities)
          .filter(
            (e) =>
              e.id !== entityId &&
              actionType.targetTypes!.includes(e.typeId),
          )
          .map((e) => e.id);

        if (targets.length === 0) {
          enabled = false;
          disabledReason = 'No valid targets available';
        }
      }

      results.push({
        typeId: actionType.id,
        name: actionType.name,
        targets,
        enabled,
        disabledReason,
      });
    }

    return results;
  }
}
