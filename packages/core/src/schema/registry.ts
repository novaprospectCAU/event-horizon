/**
 * SchemaRegistry - stores and retrieves WorldSchema definitions.
 * Provides validation and fast lookup helpers for all schema components.
 */

import type {
  WorldSchema,
  ComponentDef,
  EntityTypeDef,
  StatDef,
  RelationTypeDef,
  ActionTypeDef,
  PhaseDef,
} from '@event-horizon/types';

/** Errors found during schema validation */
export interface SchemaValidationError {
  readonly path: string;
  readonly message: string;
}

export class SchemaRegistry {
  private schema: WorldSchema | null = null;

  // Lookup indices built on registration
  private componentIndex = new Map<string, ComponentDef>();
  private entityTypeIndex = new Map<string, EntityTypeDef>();
  private statIndex = new Map<string, StatDef>();
  private relationTypeIndex = new Map<string, RelationTypeDef>();
  private actionTypeIndex = new Map<string, ActionTypeDef>();
  private phaseIndex = new Map<string, PhaseDef>();

  /**
   * Register a world schema. Validates references and builds lookup indices.
   * @throws Error if schema has invalid internal references
   */
  register(schema: WorldSchema): readonly SchemaValidationError[] {
    const errors = this.validateSchema(schema);
    if (errors.length > 0) {
      return errors;
    }

    this.schema = schema;
    this.buildIndices(schema);
    return [];
  }

  /** Get the currently registered schema */
  getSchema(): WorldSchema {
    if (!this.schema) {
      throw new Error('No schema registered');
    }
    return this.schema;
  }

  /** Check if a schema is registered */
  hasSchema(): boolean {
    return this.schema !== null;
  }

  /** Look up a ComponentDef by ID */
  getComponentDef(id: string): ComponentDef | undefined {
    return this.componentIndex.get(id);
  }

  /** Look up an EntityTypeDef by ID */
  getEntityTypeDef(id: string): EntityTypeDef | undefined {
    return this.entityTypeIndex.get(id);
  }

  /** Look up a StatDef by ID */
  getStatDef(id: string): StatDef | undefined {
    return this.statIndex.get(id);
  }

  /** Look up a RelationTypeDef by ID */
  getRelationTypeDef(id: string): RelationTypeDef | undefined {
    return this.relationTypeIndex.get(id);
  }

  /** Look up an ActionTypeDef by ID */
  getActionTypeDef(id: string): ActionTypeDef | undefined {
    return this.actionTypeIndex.get(id);
  }

  /** Look up a PhaseDef by ID */
  getPhaseDef(id: string): PhaseDef | undefined {
    return this.phaseIndex.get(id);
  }

  /** Get phases sorted by order */
  getOrderedPhases(): readonly PhaseDef[] {
    if (!this.schema) return [];
    return [...this.schema.phases].sort((a, b) => a.order - b.order);
  }

  /**
   * Validate all internal references within the schema.
   * Checks that entity types reference valid components, stats reference valid
   * entity types, action types reference valid entity types and phases, etc.
   */
  private validateSchema(schema: WorldSchema): readonly SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];
    const componentIds = new Set(schema.components.map((c) => c.id));
    const entityTypeIds = new Set(schema.entityTypes.map((e) => e.id));
    const phaseIds = new Set(schema.phases.map((p) => p.id));

    // Validate entity type component references
    for (const entityType of schema.entityTypes) {
      for (const compId of entityType.requiredComponents) {
        if (!componentIds.has(compId)) {
          errors.push({
            path: `entityTypes.${entityType.id}.requiredComponents`,
            message: `References unknown component '${compId}'`,
          });
        }
      }
      for (const compId of entityType.optionalComponents) {
        if (!componentIds.has(compId)) {
          errors.push({
            path: `entityTypes.${entityType.id}.optionalComponents`,
            message: `References unknown component '${compId}'`,
          });
        }
      }
    }

    // Validate stat applicableTo references
    for (const stat of schema.stats) {
      if (stat.applicableTo) {
        for (const typeId of stat.applicableTo) {
          if (!entityTypeIds.has(typeId)) {
            errors.push({
              path: `stats.${stat.id}.applicableTo`,
              message: `References unknown entity type '${typeId}'`,
            });
          }
        }
      }
    }

    // Validate relation type allowedPairs references
    for (const relType of schema.relationTypes) {
      if (relType.allowedPairs) {
        for (const [sourceType, targetType] of relType.allowedPairs) {
          if (!entityTypeIds.has(sourceType)) {
            errors.push({
              path: `relationTypes.${relType.id}.allowedPairs`,
              message: `References unknown entity type '${sourceType}'`,
            });
          }
          if (!entityTypeIds.has(targetType)) {
            errors.push({
              path: `relationTypes.${relType.id}.allowedPairs`,
              message: `References unknown entity type '${targetType}'`,
            });
          }
        }
      }
    }

    // Validate action type references
    for (const actionType of schema.actionTypes) {
      for (const typeId of actionType.performerTypes) {
        if (!entityTypeIds.has(typeId)) {
          errors.push({
            path: `actionTypes.${actionType.id}.performerTypes`,
            message: `References unknown entity type '${typeId}'`,
          });
        }
      }
      if (actionType.targetTypes) {
        for (const typeId of actionType.targetTypes) {
          if (!entityTypeIds.has(typeId)) {
            errors.push({
              path: `actionTypes.${actionType.id}.targetTypes`,
              message: `References unknown entity type '${typeId}'`,
            });
          }
        }
      }
      for (const phaseId of actionType.allowedPhases) {
        if (!phaseIds.has(phaseId)) {
          errors.push({
            path: `actionTypes.${actionType.id}.allowedPhases`,
            message: `References unknown phase '${phaseId}'`,
          });
        }
      }
    }

    return errors;
  }

  private buildIndices(schema: WorldSchema): void {
    this.componentIndex.clear();
    this.entityTypeIndex.clear();
    this.statIndex.clear();
    this.relationTypeIndex.clear();
    this.actionTypeIndex.clear();
    this.phaseIndex.clear();

    for (const c of schema.components) this.componentIndex.set(c.id, c);
    for (const e of schema.entityTypes) this.entityTypeIndex.set(e.id, e);
    for (const s of schema.stats) this.statIndex.set(s.id, s);
    for (const r of schema.relationTypes) this.relationTypeIndex.set(r.id, r);
    for (const a of schema.actionTypes) this.actionTypeIndex.set(a.id, a);
    for (const p of schema.phases) this.phaseIndex.set(p.id, p);
  }
}
