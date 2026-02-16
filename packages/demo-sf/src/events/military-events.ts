/**
 * SF Demo Events - military and conflict events.
 */

import type { GameEvent } from '@event-horizon/types';

export const borderIncursion: GameEvent = {
  id: 'evt-border-incursion',
  name: 'Border Incursion',
  description:
    'A Kethari patrol fleet has crossed into contested space. Is this a probe, a mistake, or the start of an invasion?',
  triggers: [
    {
      type: 'stat-threshold',
      entityId: 'faction-kethari',
      statId: 'military-power',
      comparison: 'gte',
      value: 150,
    },
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      sourceId: 'faction-terran',
      targetId: 'faction-kethari',
      comparison: 'lt',
      value: 0,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-frontier', statId: 'defense-level', amount: -10 },
  ],
  choices: [
    {
      id: 'incursion-confront',
      text: 'Confront the intruders',
      description: 'Send a fleet to intercept and challenge the Kethari patrol.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-kethari', amount: -15 },
        { type: 'modify-stat', entityId: 'system-frontier', statId: 'defense-level', amount: 20 },
      ],
      resultText: 'Your fleet intercepts the Kethari patrol. After a tense standoff, they withdraw, but relations have deteriorated.',
    },
    {
      id: 'incursion-observe',
      text: 'Monitor silently',
      description: 'Track the incursion without engaging.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: 'You observe the Kethari patrol from a distance. They survey the area and leave. Your inaction is noted.',
    },
    {
      id: 'incursion-diplomacy',
      text: 'Demand an explanation through diplomatic channels',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-kethari', amount: 5 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: 'The Kethari dismiss it as a "navigational error." Nobody believes them, but the gesture buys time.',
    },
  ],
  cooldown: 4,
  maxOccurrences: 5,
  priority: 85,
  tags: ['military', 'kethari', 'border'],
};

export const pirateRaid: GameEvent = {
  id: 'evt-pirate-raid',
  name: 'Pirate Raid on Trade Route',
  description: 'Pirates have attacked a major trade convoy near Haven Station.',
  triggers: [
    { type: 'random-chance', chance: 0.15 },
    { type: 'turn-reached', turn: 2 },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-haven', statId: 'resources', amount: -30 },
  ],
  choices: [
    {
      id: 'pirate-hunt',
      text: 'Send a patrol fleet to hunt the pirates',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-haven', statId: 'defense-level', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: 'Your fleet hunts down the pirates. Haven Station is grateful for the protection.',
    },
    {
      id: 'pirate-negotiate',
      text: 'Hire the pirates as privateers',
      description: 'Turn the pirates into allies... of a sort.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: 'The pirates accept your coin. They\'ll work for you now, but everyone knows they\'ll turn on you if the price is right.',
    },
    {
      id: 'pirate-ignore',
      text: 'Not our problem',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: 'Haven Station takes note of your indifference. Trust in the Confederation wanes.',
    },
  ],
  cooldown: 3,
  priority: 40,
  tags: ['military', 'pirate', 'trade'],
};

export const fleetMutiny: GameEvent = {
  id: 'evt-fleet-mutiny',
  name: 'Fleet Mutiny',
  description: 'Low morale and poor conditions have sparked a mutiny in one of your fleets.',
  triggers: [
    {
      type: 'stat-threshold',
      entityTag: 'fleet',
      statId: 'fleet-morale',
      comparison: 'lt',
      value: 30,
    },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -20 },
  ],
  choices: [
    {
      id: 'mutiny-negotiate',
      text: 'Negotiate with the mutineers',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: -5 },
      ],
      resultText: 'You address the fleet\'s grievances. Morale improves, but some see this as weakness.',
    },
    {
      id: 'mutiny-crush',
      text: 'Crush the mutiny by force',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -30 },
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 10 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: 'The mutiny is put down with force. Order is restored, but at a terrible cost.',
    },
  ],
  cooldown: 6,
  maxOccurrences: 2,
  priority: 75,
  tags: ['military', 'internal', 'morale'],
};

export const armsRace: GameEvent = {
  id: 'evt-arms-race',
  name: 'Galactic Arms Race',
  description: 'Intelligence reports indicate all factions are rapidly building up their military forces.',
  triggers: [
    { type: 'turn-reached', turn: 8 },
    { type: 'stat-threshold', entityId: 'faction-kethari', statId: 'military-power', comparison: 'gte', value: 200 },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
  ],
  choices: [
    {
      id: 'arms-join',
      text: 'Accelerate our own military buildup',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 40 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -30 },
      ],
      resultText: 'You pour resources into the military. Your fleets grow, but your economy strains.',
    },
    {
      id: 'arms-disarm',
      text: 'Propose galactic disarmament talks',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: 'Your proposal is met with skepticism, but some appreciate the gesture.',
    },
    {
      id: 'arms-tech',
      text: 'Focus on qualitative superiority through research',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -20 },
      ],
      resultText: 'Your scientists achieve a breakthrough. Quality over quantity.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 1,
  priority: 90,
  tags: ['military', 'global'],
};

export const militaryEvents: GameEvent[] = [borderIncursion, pirateRaid, fleetMutiny, armsRace];
