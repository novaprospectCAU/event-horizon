/**
 * SchemaValidator - validates entities, components, stats, and relations
 * against their schema definitions.
 */

import type {
  Entity,
  ComponentData,
  ComponentDef,
  FieldDef,
  EntityTypeDef,
  StatDef,
  Relation,
  RelationTypeDef,
} from '@event-horizon/types';
import type { SchemaRegistry } from './registry.js';

/** A single validation error */
export interface ValidationError {
  readonly path: string;
  readonly message: string;
}

export class SchemaValidator {
  constructor(private readonly registry: SchemaRegistry) {}

  /**
   * Validate that an entity conforms to its EntityTypeDef.
   * Checks that all required components are present and have valid data.
   */
  validateEntity(entity: Entity): readonly ValidationError[] {
    const errors: ValidationError[] = [];
    const entityType = this.registry.getEntityTypeDef(entity.typeId);

    if (!entityType) {
      errors.push({
        path: `entity.${entity.id}.typeId`,
        message: `Unknown entity type '${entity.typeId}'`,
      });
      return errors;
    }

    // Check required components are present
    for (const compId of entityType.requiredComponents) {
      if (!entity.components[compId]) {
        errors.push({
          path: `entity.${entity.id}.components`,
          message: `Missing required component '${compId}'`,
        });
      }
    }

    // Validate all component data
    for (const [compId, compData] of Object.entries(entity.components)) {
      const allAllowed = [
        ...entityType.requiredComponents,
        ...entityType.optionalComponents,
      ];
      if (!allAllowed.includes(compId)) {
        errors.push({
          path: `entity.${entity.id}.components.${compId}`,
          message: `Component '${compId}' is not allowed on entity type '${entity.typeId}'`,
        });
      }
      errors.push(...this.validateComponentData(entity.id, compData));
    }

    // Validate stats
    for (const [statId, value] of Object.entries(entity.stats)) {
      errors.push(...this.validateStatValue(entity.id, entity.typeId, statId, value));
    }

    // Validate location
    if (entity.locationId !== undefined && !entityType.locatable) {
      errors.push({
        path: `entity.${entity.id}.locationId`,
        message: `Entity type '${entity.typeId}' is not locatable but has locationId`,
      });
    }

    return errors;
  }

  /**
   * Validate component data against its ComponentDef fields.
   */
  validateComponentData(
    entityId: string,
    compData: ComponentData,
  ): readonly ValidationError[] {
    const errors: ValidationError[] = [];
    const compDef = this.registry.getComponentDef(compData.defId);

    if (!compDef) {
      errors.push({
        path: `entity.${entityId}.components.${compData.defId}`,
        message: `Unknown component definition '${compData.defId}'`,
      });
      return errors;
    }

    // Check each field's value against its definition
    for (const fieldDef of compDef.fields) {
      const value = compData.values[fieldDef.name];
      if (value === undefined) {
        // Field missing - ok if it has a default
        if (fieldDef.defaultValue === undefined) {
          errors.push({
            path: `entity.${entityId}.components.${compData.defId}.${fieldDef.name}`,
            message: `Missing required field '${fieldDef.name}'`,
          });
        }
        continue;
      }
      errors.push(
        ...this.validateFieldValue(entityId, compData.defId, fieldDef, value),
      );
    }

    return errors;
  }

  /**
   * Validate a single field value against its FieldDef.
   */
  validateFieldValue(
    entityId: string,
    compDefId: string,
    fieldDef: FieldDef,
    value: unknown,
  ): readonly ValidationError[] {
    const errors: ValidationError[] = [];
    const path = `entity.${entityId}.components.${compDefId}.${fieldDef.name}`;

    // Type check
    switch (fieldDef.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({ path, message: `Expected string, got ${typeof value}` });
        } else if (fieldDef.options && !fieldDef.options.includes(value)) {
          errors.push({
            path,
            message: `Value '${value}' not in allowed options: ${fieldDef.options.join(', ')}`,
          });
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          errors.push({ path, message: `Expected number, got ${typeof value}` });
        } else {
          if (fieldDef.min !== undefined && value < fieldDef.min) {
            errors.push({ path, message: `Value ${value} below minimum ${fieldDef.min}` });
          }
          if (fieldDef.max !== undefined && value > fieldDef.max) {
            errors.push({ path, message: `Value ${value} above maximum ${fieldDef.max}` });
          }
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({ path, message: `Expected boolean, got ${typeof value}` });
        }
        break;
      case 'string[]':
        if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
          errors.push({ path, message: `Expected string array` });
        }
        break;
      case 'number[]':
        if (!Array.isArray(value) || !value.every((v) => typeof v === 'number')) {
          errors.push({ path, message: `Expected number array` });
        }
        break;
      case 'record':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push({ path, message: `Expected record/object` });
        }
        break;
    }

    return errors;
  }

  /**
   * Validate a stat value against its StatDef range and applicability.
   */
  validateStatValue(
    entityId: string,
    entityTypeId: string,
    statId: string,
    value: number,
  ): readonly ValidationError[] {
    const errors: ValidationError[] = [];
    const statDef = this.registry.getStatDef(statId);

    if (!statDef) {
      errors.push({
        path: `entity.${entityId}.stats.${statId}`,
        message: `Unknown stat '${statId}'`,
      });
      return errors;
    }

    // Check applicability
    if (statDef.applicableTo && !statDef.applicableTo.includes(entityTypeId)) {
      errors.push({
        path: `entity.${entityId}.stats.${statId}`,
        message: `Stat '${statId}' not applicable to entity type '${entityTypeId}'`,
      });
    }

    // Check range
    if (value < statDef.min) {
      errors.push({
        path: `entity.${entityId}.stats.${statId}`,
        message: `Value ${value} below minimum ${statDef.min}`,
      });
    }
    if (value > statDef.max) {
      errors.push({
        path: `entity.${entityId}.stats.${statId}`,
        message: `Value ${value} above maximum ${statDef.max}`,
      });
    }

    return errors;
  }

  /**
   * Validate a relation against its RelationTypeDef constraints.
   */
  validateRelation(
    relation: Relation,
    sourceEntity: Entity,
    targetEntity: Entity,
  ): readonly ValidationError[] {
    const errors: ValidationError[] = [];
    const relType = this.registry.getRelationTypeDef(relation.typeId);

    if (!relType) {
      errors.push({
        path: `relation.${relation.id}.typeId`,
        message: `Unknown relation type '${relation.typeId}'`,
      });
      return errors;
    }

    // Check weight range
    if (relation.weight < relType.minWeight) {
      errors.push({
        path: `relation.${relation.id}.weight`,
        message: `Weight ${relation.weight} below minimum ${relType.minWeight}`,
      });
    }
    if (relation.weight > relType.maxWeight) {
      errors.push({
        path: `relation.${relation.id}.weight`,
        message: `Weight ${relation.weight} above maximum ${relType.maxWeight}`,
      });
    }

    // Check allowed pairs
    if (relType.allowedPairs && relType.allowedPairs.length > 0) {
      const pairAllowed = relType.allowedPairs.some(
        ([sourceType, targetType]) =>
          sourceEntity.typeId === sourceType && targetEntity.typeId === targetType,
      );
      if (!pairAllowed) {
        errors.push({
          path: `relation.${relation.id}`,
          message: `Entity type pair [${sourceEntity.typeId}, ${targetEntity.typeId}] not allowed for relation type '${relation.typeId}'`,
        });
      }
    }

    return errors;
  }
}
