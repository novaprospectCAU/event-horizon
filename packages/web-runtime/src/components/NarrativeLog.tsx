/**
 * NarrativeLog - displays the running narrative of the game.
 */

import React, { useRef, useEffect } from 'react';

export interface NarrativeEntry {
  readonly text: string;
  readonly source: string;
  readonly turn: number;
}

export interface NarrativeLogProps {
  entries: readonly NarrativeEntry[];
  className?: string;
}

const sourceLabels: Record<string, string> = {
  action: 'Action',
  event: 'Event',
  scene: 'Scene',
  system: 'System',
  npc: 'NPC',
  ai: 'AI',
};

export const NarrativeLog: React.FC<NarrativeLogProps> = ({ entries, className }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className={`narrative-log ${className ?? ''}`} style={{ overflowY: 'auto', maxHeight: '400px' }}>
      {entries.map((entry, i) => (
        <div key={i} className="narrative-entry" style={{ marginBottom: '8px', padding: '8px', borderLeft: '3px solid #555' }}>
          <div style={{ fontSize: '0.75em', color: '#888', marginBottom: '2px' }}>
            Turn {entry.turn} &middot; {sourceLabels[entry.source] ?? entry.source}
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{entry.text}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
