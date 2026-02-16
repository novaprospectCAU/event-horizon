/**
 * StatsPanel - displays an entity's stats.
 */

import React from 'react';
import type { Entity } from '@event-horizon/types';

export interface StatsPanelProps {
  entity: Entity;
  statDefs?: readonly { id: string; name: string; min: number; max: number; category?: string }[];
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ entity, statDefs, className }) => {
  const stats = Object.entries(entity.stats);

  if (stats.length === 0) return null;

  return (
    <div className={`stats-panel ${className ?? ''}`} style={{ padding: '12px' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>{entity.name} - 능력치</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {stats.map(([statId, value]) => {
          const def = statDefs?.find((d) => d.id === statId);
          const label = def?.name ?? statId;
          const min = def?.min ?? 0;
          const max = def?.max ?? 100;
          const pct = ((value - min) / (max - min)) * 100;

          return (
            <div key={statId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', marginBottom: '2px' }}>
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div
                style={{
                  height: '6px',
                  background: '#333',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, pct))}%`,
                    height: '100%',
                    background: pct > 60 ? '#22C55E' : pct > 30 ? '#EAB308' : '#EF4444',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
