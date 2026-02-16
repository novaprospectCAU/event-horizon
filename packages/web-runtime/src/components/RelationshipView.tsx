/**
 * RelationshipView - displays relationships for an entity.
 */

import React from 'react';
import type { Entity, Relation } from '@event-horizon/types';

export interface RelationshipViewProps {
  entity: Entity;
  relations: readonly Relation[];
  entities: Record<string, Entity>;
  relationTypeDefs?: readonly { id: string; name: string; minWeight: number; maxWeight: number }[];
  className?: string;
}

function getRelationColor(weight: number, min: number, max: number): string {
  const mid = (min + max) / 2;
  if (weight > mid + (max - mid) * 0.3) return '#22C55E';
  if (weight < mid - (mid - min) * 0.3) return '#EF4444';
  return '#EAB308';
}

export const RelationshipView: React.FC<RelationshipViewProps> = ({
  entity,
  relations,
  entities,
  relationTypeDefs,
  className,
}) => {
  if (relations.length === 0) return null;

  return (
    <div className={`relationship-view ${className ?? ''}`} style={{ padding: '12px' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>{entity.name} - 관계</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {relations.map((rel) => {
          const otherId = rel.sourceId === entity.id ? rel.targetId : rel.sourceId;
          const other = entities[otherId];
          const typeDef = relationTypeDefs?.find((d) => d.id === rel.typeId);
          const typeName = typeDef?.name ?? rel.typeId;
          const min = typeDef?.minWeight ?? -100;
          const max = typeDef?.maxWeight ?? 100;
          const color = getRelationColor(rel.weight, min, max);

          return (
            <div
              key={rel.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 8px',
                borderLeft: `3px solid ${color}`,
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                  {other?.name ?? otherId}
                </div>
                <div style={{ fontSize: '0.75em', color: '#888' }}>{typeName}</div>
              </div>
              <div style={{ color, fontWeight: 'bold' }}>{rel.weight}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
