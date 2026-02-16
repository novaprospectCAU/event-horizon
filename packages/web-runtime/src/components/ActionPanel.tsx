/**
 * ActionPanel - displays available actions for the player.
 */

import React, { useState } from 'react';
import type { AvailableAction } from '../stores/game-store.js';

export interface ActionPanelProps {
  actions: readonly AvailableAction[];
  entities: Record<string, { id: string; name: string }>;
  onSubmitAction: (typeId: string, targetId?: string) => void;
  className?: string;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  actions,
  entities,
  onSubmitAction,
  className,
}) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const action = actions.find((a) => a.typeId === selectedAction);
  const hasTargets = action?.targets && action.targets.length > 0;

  return (
    <div className={`action-panel ${className ?? ''}`} style={{ padding: '16px' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>Available Actions</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {actions.map((act) => (
          <button
            key={act.typeId}
            disabled={!act.enabled}
            onClick={() => setSelectedAction(act.typeId)}
            style={{
              padding: '8px 16px',
              border: selectedAction === act.typeId ? '2px solid #3B82F6' : '1px solid #555',
              borderRadius: '4px',
              background: act.enabled ? 'transparent' : '#333',
              color: act.enabled ? 'inherit' : '#666',
              cursor: act.enabled ? 'pointer' : 'not-allowed',
            }}
            title={act.disabledReason}
          >
            {act.name}
          </button>
        ))}
      </div>

      {selectedAction && hasTargets && (
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Select Target</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {action!.targets!.map((targetId) => {
              const target = entities[targetId];
              return (
                <button
                  key={targetId}
                  onClick={() => {
                    onSubmitAction(selectedAction, targetId);
                    setSelectedAction(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    background: 'transparent',
                    color: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  {target?.name ?? targetId}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedAction && !hasTargets && (
        <button
          onClick={() => {
            onSubmitAction(selectedAction);
            setSelectedAction(null);
          }}
          style={{
            padding: '8px 24px',
            border: '1px solid #3B82F6',
            borderRadius: '4px',
            background: '#3B82F6',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Execute
        </button>
      )}
    </div>
  );
};
