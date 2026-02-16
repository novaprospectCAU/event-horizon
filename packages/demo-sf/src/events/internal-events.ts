/**
 * SF Demo Events - internal faction events.
 */

import type { GameEvent } from '@event-horizon/types';

export const civilUnrest: GameEvent = {
  id: 'evt-civil-unrest',
  name: 'Civil Unrest',
  description: 'Dissatisfaction among the populace threatens internal stability.',
  triggers: [
    {
      type: 'stat-threshold',
      entityId: 'faction-terran',
      statId: 'stability',
      comparison: 'lt',
      value: 40,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
  ],
  choices: [
    {
      id: 'unrest-reform',
      text: 'Enact social reforms',
      description: 'Address the root causes of unrest.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: 'Reforms are costly but effective. The people feel heard.',
    },
    {
      id: 'unrest-crackdown',
      text: 'Security crackdown',
      description: 'Restore order through force.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -15 },
      ],
      resultText: 'Order is restored, but your reputation suffers. The unrest merely goes underground.',
    },
    {
      id: 'unrest-distract',
      text: 'Rally patriotism against an external threat',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: 'Patriotic fervor rises. The people unite against a common enemy—real or imagined.',
    },
  ],
  cooldown: 4,
  priority: 70,
  tags: ['internal', 'stability'],
};

export const techBreakthrough: GameEvent = {
  id: 'evt-tech-breakthrough',
  name: 'Technological Breakthrough',
  description: 'Your research teams are on the verge of a major breakthrough.',
  triggers: [
    { type: 'random-chance', chance: 0.12 },
    { type: 'stat-threshold', entityId: 'faction-terran', statId: 'tech-level', comparison: 'gte', value: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'tech-military',
      text: 'Apply to military technology',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 25 },
      ],
      resultText: 'The breakthrough yields devastating new weapons technology.',
    },
    {
      id: 'tech-economic',
      text: 'Apply to economic development',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: 'New industrial processes boost production across the Confederation.',
    },
    {
      id: 'tech-pure',
      text: 'Pursue pure research',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: 'Pure science advances. Your researchers are the envy of the galaxy.',
    },
  ],
  cooldown: 5,
  priority: 55,
  tags: ['internal', 'technology'],
};

export const betrayal: GameEvent = {
  id: 'evt-betrayal',
  name: 'Betrayal from Within',
  description:
    'Intelligence has uncovered a high-ranking official secretly working for another faction.',
  triggers: [
    { type: 'turn-reached', turn: 7 },
    {
      type: 'stat-threshold',
      entityId: 'faction-terran',
      statId: 'stability',
      comparison: 'lt',
      value: 60,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
  ],
  choices: [
    {
      id: 'betray-arrest',
      text: 'Arrest the traitor publicly',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: 'The traitor is publicly exposed and arrested. Your people rally around justice.',
    },
    {
      id: 'betray-turn',
      text: 'Turn them into a double agent',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 15 },
      ],
      resultText:
        'You let the traitor continue, now feeding false information. A dangerous game, but potentially very rewarding.',
    },
    {
      id: 'betray-purge',
      text: 'Launch a broad security purge',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'competence', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: 'The purge catches the traitor and many innocents. Paranoia spreads through the ranks.',
    },
  ],
  maxOccurrences: 1,
  priority: 80,
  tags: ['internal', 'espionage', 'betrayal'],
};

export const internalEvents: GameEvent[] = [civilUnrest, techBreakthrough, betrayal];
