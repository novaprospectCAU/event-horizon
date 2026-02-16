/**
 * MapView - simple 2D star map visualization.
 */

import React from 'react';
import type { Entity } from '@event-horizon/types';

export interface MapViewProps {
  systems: readonly Entity[];
  selectedSystemId?: string | null;
  onSelectSystem?: (systemId: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  systems,
  selectedSystemId,
  onSelectSystem,
  width = 600,
  height = 400,
  className,
}) => {
  // Extract coordinates and normalize to viewport
  const coords = systems.map((sys) => {
    const starSystem = sys.components['star-system'];
    const rawCoords = starSystem?.values?.['coordinates'] as
      | { x: number; y: number }
      | undefined;
    return {
      entity: sys,
      x: rawCoords?.x ?? 0,
      y: rawCoords?.y ?? 0,
    };
  });

  const minX = Math.min(...coords.map((c) => c.x));
  const maxX = Math.max(...coords.map((c) => c.x));
  const minY = Math.min(...coords.map((c) => c.y));
  const maxY = Math.max(...coords.map((c) => c.y));

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const padding = 40;

  function toScreenX(x: number): number {
    return padding + ((x - minX) / rangeX) * (width - padding * 2);
  }

  function toScreenY(y: number): number {
    return padding + ((y - minY) / rangeY) * (height - padding * 2);
  }

  function getSystemColor(entity: Entity): string {
    const controllerId = entity.components['star-system']?.values?.['controllerId'] as string;
    if (!controllerId) return '#888';
    if (controllerId.includes('terran')) return '#3B82F6';
    if (controllerId.includes('kethari')) return '#EF4444';
    if (controllerId.includes('synthesis')) return '#8B5CF6';
    return '#888';
  }

  return (
    <svg
      className={`map-view ${className ?? ''}`}
      width={width}
      height={height}
      style={{ background: '#0a0a1a', borderRadius: '8px' }}
    >
      {coords.map(({ entity, x, y }) => {
        const sx = toScreenX(x);
        const sy = toScreenY(y);
        const color = getSystemColor(entity);
        const isSelected = entity.id === selectedSystemId;
        const contested = entity.components['star-system']?.values?.['contested'] as boolean;

        return (
          <g
            key={entity.id}
            onClick={() => onSelectSystem?.(entity.id)}
            style={{ cursor: 'pointer' }}
          >
            {isSelected && (
              <circle cx={sx} cy={sy} r={16} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
            )}
            {contested && (
              <circle cx={sx} cy={sy} r={12} fill="none" stroke="#EAB308" strokeWidth={1} strokeDasharray="3,3" />
            )}
            <circle cx={sx} cy={sy} r={6} fill={color} />
            <text
              x={sx}
              y={sy + 18}
              textAnchor="middle"
              fill="#ccc"
              fontSize={10}
            >
              {entity.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
