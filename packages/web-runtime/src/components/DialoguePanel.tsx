/**
 * DialoguePanel - displays dialogue with NPC and response options.
 */

import React from 'react';
import type { Entity } from '@event-horizon/types';

export interface DialoguePanelProps {
  speakerId: string | null;
  speakerEntity?: Entity;
  text: string | null;
  emotion: string | null;
  responses: readonly { id: string; text: string }[];
  onSelectResponse: (responseId: string) => void;
  className?: string;
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({
  speakerId,
  speakerEntity,
  text,
  emotion,
  responses,
  onSelectResponse,
  className,
}) => {
  if (!text) return null;

  const speakerName = speakerEntity?.name ?? speakerId ?? 'Unknown';

  return (
    <div className={`dialogue-panel ${className ?? ''}`} style={{ border: '1px solid #444', borderRadius: '8px', padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        <strong>{speakerName}</strong>
        {emotion && emotion !== 'neutral' && (
          <span style={{ marginLeft: '8px', color: '#888', fontSize: '0.85em' }}>
            ({emotion})
          </span>
        )}
      </div>
      <div style={{ marginBottom: '16px', fontStyle: 'italic', lineHeight: 1.6 }}>
        &ldquo;{text}&rdquo;
      </div>
      {responses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {responses.map((resp) => (
            <button
              key={resp.id}
              onClick={() => onSelectResponse(resp.id)}
              style={{
                padding: '8px 16px',
                border: '1px solid #666',
                borderRadius: '4px',
                background: 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {resp.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
