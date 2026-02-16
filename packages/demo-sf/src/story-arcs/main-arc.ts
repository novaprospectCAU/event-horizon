/**
 * SF Demo Story Arcs - main storyline progression.
 */

import type { StoryArc, Scene, DialogueTree } from '@event-horizon/types';

// ─── Main Story Arc: The Convergence ───

export const convergenceArc: StoryArc = {
  id: 'arc-convergence',
  name: 'The Convergence',
  description:
    'Ancient Precursor signals are drawing all factions toward Deep Reach. What awaits there could unite or destroy the galaxy.',
  stages: [
    {
      id: 'stage-signals',
      name: 'Strange Signals',
      description: 'Unexplained signals are detected from the uncharted Deep Reach system.',
      advanceConditions: [{ type: 'turn-reached', turn: 4 }],
      sceneId: 'scene-signals-briefing',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-deepreach', tag: 'signals-detected' },
      ],
    },
    {
      id: 'stage-expedition',
      name: 'The Expedition',
      description: 'Factions race to be the first to reach Deep Reach and claim whatever lies there.',
      advanceConditions: [
        { type: 'tag-present', entityId: 'system-deepreach', tag: 'explored' },
      ],
      failConditions: [{ type: 'turn-reached', turn: 15 }],
      sceneId: 'scene-expedition-launch',
      onEnterEffects: [
        { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
      ],
    },
    {
      id: 'stage-discovery',
      name: 'The Discovery',
      description: 'The Precursor artifact is found. Its power could reshape the galaxy.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-precursor-artifact' },
      ],
      sceneId: 'scene-discovery',
    },
    {
      id: 'stage-convergence',
      name: 'The Convergence',
      description: 'All factions converge on Deep Reach. The future of the galaxy hangs in the balance.',
      advanceConditions: [{ type: 'turn-reached', turn: 20 }],
      sceneId: 'scene-final-convergence',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-deepreach', tag: 'convergence' },
      ],
    },
  ],
  tags: ['main', 'precursor'],
  priority: 100,
};

// ─── Secondary Arc: Kethari Civil War ───

export const kethariCivilWarArc: StoryArc = {
  id: 'arc-kethari-war',
  name: 'Dominion Divided',
  description:
    "Cracks appear in the Kethari Dominion's iron grip. A power struggle between Thrax and Zira could split the Dominion in two.",
  stages: [
    {
      id: 'stage-tension',
      name: 'Rising Tensions',
      description: 'Internal tensions grow within the Kethari Dominion.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-kethari',
          statId: 'stability',
          comparison: 'lt',
          value: 50,
        },
      ],
      sceneId: 'scene-kethari-tension',
    },
    {
      id: 'stage-conspiracy',
      name: "Zira's Plot",
      description: 'Spymaster Zira makes her move, seeking allies for a coup.',
      advanceConditions: [{ type: 'turn-reached', turn: 10 }],
      sceneId: 'scene-zira-conspiracy',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'char-zira', statId: 'ambition', amount: 15 },
      ],
    },
    {
      id: 'stage-civil-war',
      name: 'Civil War',
      description: 'The Dominion splits. Thrax and Zira fight for control.',
      advanceConditions: [{ type: 'turn-reached', turn: 15 }],
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'faction-kethari', statId: 'military-power', amount: -50 },
        { type: 'modify-stat', entityId: 'faction-kethari', statId: 'stability', amount: -30 },
      ],
    },
  ],
  tags: ['secondary', 'kethari', 'political'],
  priority: 80,
};

// ─── Tertiary Arc: Synthesis Awakening ───

export const synthesisAwakeningArc: StoryArc = {
  id: 'arc-synthesis-awakening',
  name: 'The Awakening',
  description:
    'The Synthesis Collective is on the brink of a technological transcendence that could make them godlike—or destroy them entirely.',
  stages: [
    {
      id: 'stage-research',
      name: 'Project Omega',
      description: 'The Collective begins a secret research project of unprecedented scale.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-synthesis',
          statId: 'tech-level',
          comparison: 'gte',
          value: 8,
        },
      ],
      onEnterEffects: [
        { type: 'set-tag', entityId: 'faction-synthesis', tag: 'project-omega' },
      ],
    },
    {
      id: 'stage-awakening',
      name: 'The Awakening',
      description: 'The Collective begins to transcend. The galaxy watches in awe and terror.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-synthesis',
          statId: 'tech-level',
          comparison: 'gte',
          value: 10,
        },
      ],
      onEnterEffects: [
        { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -10 },
      ],
    },
  ],
  tags: ['tertiary', 'synthesis', 'technology'],
  priority: 60,
};

export const storyArcs: StoryArc[] = [convergenceArc, kethariCivilWarArc, synthesisAwakeningArc];

// ─── Scenes ───

export const signalsBriefingDialogue: DialogueTree = {
  id: 'dialogue-signals',
  name: 'Signals Briefing',
  startNodeId: 'node-1',
  nodes: [
    {
      id: 'node-1',
      speakerId: 'char-chen',
      text: 'Commander, our deep-space sensors have detected unusual signals from the Deep Reach system. The pattern doesn\'t match anything in our databases.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-1a', text: 'Could it be Precursor technology?', nextNodeId: 'node-2a' },
        { id: 'resp-1b', text: 'What\'s the military assessment?', nextNodeId: 'node-2b' },
      ],
    },
    {
      id: 'node-2a',
      speakerId: 'char-kowalski',
      text: 'That\'s exactly what I think. The signal harmonics match theoretical models of Precursor communication arrays. If I\'m right, this could be the discovery of the century.',
      emotion: 'surprised',
      responses: [
        { id: 'resp-2a', text: 'Prepare an expedition immediately.', nextNodeId: 'node-3' },
        { id: 'resp-2b', text: 'We should be cautious about this.', nextNodeId: 'node-3' },
      ],
    },
    {
      id: 'node-2b',
      speakerId: 'char-chen',
      text: 'Deep Reach is unclaimed space, but it borders Synthesis territory. If there\'s something valuable there, you can bet Vexa-7 already knows about it. We need to move quickly but carefully.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-3a', text: 'Then let\'s not waste time. Prepare an expedition.', nextNodeId: 'node-3' },
        { id: 'resp-3b', text: 'What about the Kethari?', nextNodeId: 'node-3' },
      ],
    },
    {
      id: 'node-3',
      speakerId: 'char-voss',
      text: 'Whatever we decide, we should consider the diplomatic implications. Every faction will want a piece of whatever\'s out there. This could unite us... or start a war.',
      emotion: 'neutral',
      isEnd: true,
    },
  ],
};

export const scenes: Scene[] = [
  {
    id: 'scene-signals-briefing',
    name: 'The Signal',
    description: 'A mysterious signal from Deep Reach demands attention.',
    locationId: 'system-sol',
    participantIds: ['char-chen', 'char-voss', 'char-kowalski'],
    dialogue: signalsBriefingDialogue,
    narrativeText:
      'The briefing room aboard Sol Station falls silent as the holographic display flickers to life, showing a pulsing signal from the uncharted Deep Reach system.',
    aiNarrative: true,
  },
  {
    id: 'scene-expedition-launch',
    name: 'The Expedition Launches',
    description: 'The expedition to Deep Reach begins.',
    locationId: 'system-sol',
    participantIds: ['char-chen', 'char-kowalski'],
    narrativeText:
      'The expedition fleet powers up its FTL drives. The journey to Deep Reach will take the fleet through contested space.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'system-deepreach', tag: 'expedition-en-route' },
    ],
  },
  {
    id: 'scene-discovery',
    name: 'The Discovery',
    description: 'The Precursor artifact is found.',
    locationId: 'system-deepreach',
    participantIds: ['char-kowalski'],
    narrativeText:
      'Deep in the heart of Deep Reach, floating among ancient debris, the artifact pulses with energy that defies known physics.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'system-deepreach', tag: 'explored' },
    ],
  },
  {
    id: 'scene-final-convergence',
    name: 'The Convergence',
    description: 'All factions meet at Deep Reach for a final reckoning.',
    locationId: 'system-deepreach',
    participantIds: ['char-chen', 'char-voss', 'char-thrax', 'char-vexa', 'char-echo'],
    narrativeText:
      'Three fleets hang in the void above Deep Reach. The artifact\'s glow intensifies, as if aware of the gathering. The future of the galaxy will be decided here.',
    aiNarrative: true,
  },
  {
    id: 'scene-kethari-tension',
    name: 'Cracks in the Dominion',
    description: 'Signs of internal strife within the Kethari.',
    locationId: 'system-kethar',
    participantIds: ['char-thrax', 'char-zira'],
    narrativeText:
      'In the war chambers of Kethar Prime, Spymaster Zira watches Warlord Thrax with calculating eyes.',
    aiNarrative: true,
  },
  {
    id: 'scene-zira-conspiracy',
    name: "Zira's Gambit",
    description: 'Zira approaches the player with a dangerous proposal.',
    locationId: 'system-haven',
    participantIds: ['char-zira', 'char-rex'],
    narrativeText:
      'Haven Station. The kind of place where secrets are currency and everyone has a price. Zira chose it for a reason.',
    aiNarrative: true,
  },
];
