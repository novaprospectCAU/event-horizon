/**
 * ChoicePanel - displays event choices for the player.
 */

import React from 'react';
import type { EventChoice } from '@event-horizon/types';

export interface ChoicePanelProps {
  eventName: string;
  eventDescription?: string;
  narrative?: string;
  choices: readonly EventChoice[];
  onSelectChoice: (choiceId: string) => void;
  className?: string;
}

export const ChoicePanel: React.FC<ChoicePanelProps> = ({
  eventName,
  eventDescription,
  narrative,
  choices,
  onSelectChoice,
  className,
}) => {
  return (
    <div className={`choice-panel ${className ?? ''}`} style={{ border: '1px solid #c59a00', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{eventName}</h3>
      {eventDescription && (
        <p style={{ margin: '0 0 8px 0', color: '#aaa' }}>{eventDescription}</p>
      )}
      {narrative && (
        <p style={{ margin: '0 0 16px 0', fontStyle: 'italic' }}>{narrative}</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onSelectChoice(choice.id)}
            style={{
              padding: '12px 16px',
              border: '1px solid #c59a00',
              borderRadius: '4px',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{choice.text}</div>
            {choice.description && (
              <div style={{ fontSize: '0.85em', color: '#aaa', marginTop: '4px' }}>
                {choice.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
