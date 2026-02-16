/**
 * SceneRenderer - renders the current scene with its narrative and dialogue.
 */

import React from 'react';
import type { Entity, Scene, DialogueNode } from '@event-horizon/types';
import { DialoguePanel } from './DialoguePanel.js';

export interface SceneRendererProps {
  scene: Scene;
  entities: Record<string, Entity>;
  currentDialogueNode?: DialogueNode | null;
  availableResponses?: readonly { id: string; text: string }[];
  narrative?: string;
  onSelectResponse: (responseId: string) => void;
  className?: string;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  entities,
  currentDialogueNode,
  availableResponses = [],
  narrative,
  onSelectResponse,
  className,
}) => {
  const location = scene.locationId ? entities[scene.locationId] : undefined;
  const participants = scene.participantIds.map((id) => entities[id]).filter(Boolean);

  return (
    <div
      className={`scene-renderer ${className ?? ''}`}
      style={{
        border: '1px solid #444',
        borderRadius: '8px',
        padding: '16px',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>{scene.name}</h3>
        {location && (
          <div style={{ fontSize: '0.85em', color: '#888', marginTop: '4px' }}>
            Location: {location.name}
          </div>
        )}
        {participants.length > 0 && (
          <div style={{ fontSize: '0.85em', color: '#888', marginTop: '2px' }}>
            Present: {participants.map((p) => p.name).join(', ')}
          </div>
        )}
      </div>

      {(narrative ?? scene.narrativeText) && (
        <div
          style={{
            marginBottom: '16px',
            fontStyle: 'italic',
            lineHeight: 1.6,
            padding: '8px',
            borderLeft: '3px solid #555',
          }}
        >
          {narrative ?? scene.narrativeText}
        </div>
      )}

      {currentDialogueNode && (
        <DialoguePanel
          speakerId={currentDialogueNode.speakerId}
          speakerEntity={entities[currentDialogueNode.speakerId]}
          text={currentDialogueNode.text}
          emotion={currentDialogueNode.emotion ?? null}
          responses={availableResponses}
          onSelectResponse={onSelectResponse}
        />
      )}
    </div>
  );
};
