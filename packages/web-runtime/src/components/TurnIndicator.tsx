/**
 * TurnIndicator - shows the current turn and phase.
 */

import React from 'react';
import type { TurnPhase } from '@event-horizon/types';

export interface TurnIndicatorProps {
  turn: number;
  phase: TurnPhase | null;
  turnLabel?: string;
  onEndTurn?: () => void;
  awaitingInput: boolean;
  className?: string;
}

const phaseLabels: Record<string, string> = {
  'player-action': '내 차례',
  'npc-action': 'NPC 차례',
  'event-resolution': '이벤트',
  'world-update': '세계 갱신',
};

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  turn,
  phase,
  turnLabel = '턴',
  onEndTurn,
  awaitingInput,
  className,
}) => {
  return (
    <div
      className={`turn-indicator ${className ?? ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px 16px',
        borderBottom: '1px solid #333',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
        {turnLabel} {turn}
      </div>
      {phase && (
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '12px',
            background: phase.phaseType === 'player-action' ? '#3B82F6' : '#555',
            fontSize: '0.85em',
          }}
        >
          {phaseLabels[phase.phaseType] ?? phase.phaseId}
          <span style={{ marginLeft: '6px', opacity: 0.7 }}>
            ({phase.phaseIndex + 1}/{phase.totalPhases})
          </span>
        </div>
      )}
      {awaitingInput && phase?.phaseType === 'player-action' && onEndTurn && (
        <button
          onClick={onEndTurn}
          style={{
            marginLeft: 'auto',
            padding: '6px 20px',
            border: '1px solid #22C55E',
            borderRadius: '4px',
            background: 'transparent',
            color: '#22C55E',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          턴 종료
        </button>
      )}
    </div>
  );
};
