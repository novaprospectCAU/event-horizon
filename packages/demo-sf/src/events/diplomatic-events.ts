/**
 * SF Demo Events - diplomatic and political events.
 */

import type { GameEvent } from '@event-horizon/types';

export const diplomaticCrisis: GameEvent = {
  id: 'evt-diplomatic-crisis',
  name: 'Diplomatic Crisis',
  description:
    'Tensions between two major factions reach a breaking point. A diplomatic incident threatens to escalate into open conflict.',
  triggers: [
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      comparison: 'lt',
      value: -50,
    },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -10 },
  ],
  choices: [
    {
      id: 'crisis-negotiate',
      text: 'Send a diplomatic envoy',
      description: 'Attempt to de-escalate through negotiation.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 15 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: 10 },
      ],
      resultText: 'The envoy manages to ease tensions, at least temporarily.',
    },
    {
      id: 'crisis-threaten',
      text: 'Show of force',
      description: 'Deploy military assets to demonstrate strength.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'military-power', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: 'Your show of force sends a clear message, but deepens the rift.',
    },
    {
      id: 'crisis-ignore',
      text: 'Let it blow over',
      description: 'Focus on internal affairs and hope tensions ease naturally.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: 'You choose to avoid direct confrontation. Time will tell if this was wise.',
    },
  ],
  cooldown: 5,
  maxOccurrences: 3,
  priority: 80,
  tags: ['diplomatic', 'crisis'],
};

export const tradeAgreement: GameEvent = {
  id: 'evt-trade-agreement',
  name: 'Trade Agreement Opportunity',
  description:
    'A neutral trade guild proposes a lucrative trade agreement that could benefit multiple factions.',
  triggers: [
    { type: 'turn-reached', turn: 3 },
    {
      type: 'relation-threshold',
      relationTypeId: 'trade',
      comparison: 'gte',
      value: 20,
    },
  ],
  effects: [],
  choices: [
    {
      id: 'trade-accept',
      text: 'Accept the agreement',
      description: 'Sign the trade deal and boost economic cooperation.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'trade', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: 'The trade agreement is signed. Credits flow and prosperity grows.',
    },
    {
      id: 'trade-counter',
      text: 'Counter-propose better terms',
      description: 'Push for more favorable terms, risking the deal.',
      conditions: [
        { type: 'stat-threshold', entityTag: 'terran', statId: 'influence', comparison: 'gte', value: 40 },
      ],
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 50 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: -5 },
      ],
      resultText: 'Your negotiators secure excellent terms. The other parties are less pleased.',
    },
    {
      id: 'trade-reject',
      text: 'Decline the offer',
      description: 'Maintain economic independence.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: 'You decline the trade agreement, choosing self-reliance.',
    },
  ],
  cooldown: 8,
  priority: 50,
  tags: ['trade', 'economy'],
};

export const allianceProposal: GameEvent = {
  id: 'evt-alliance-proposal',
  name: 'Alliance Proposal',
  description: 'A faction offers a formal alliance against a common threat.',
  triggers: [
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      comparison: 'gte',
      value: 40,
    },
    {
      type: 'stat-threshold',
      entityTag: 'kethari',
      statId: 'military-power',
      comparison: 'gte',
      value: 180,
    },
  ],
  effects: [],
  choices: [
    {
      id: 'alliance-accept',
      text: 'Accept the alliance',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 30 },
        { type: 'set-tag', entityTag: 'terran', tag: 'allied' },
      ],
      resultText: 'A new alliance is forged. Together, you stand stronger.',
    },
    {
      id: 'alliance-decline',
      text: 'Politely decline',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: 'You maintain independence at the cost of a potential ally\'s goodwill.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 2,
  priority: 70,
  tags: ['diplomatic', 'alliance'],
};

export const diplomaticEvents: GameEvent[] = [diplomaticCrisis, tradeAgreement, allianceProposal];
