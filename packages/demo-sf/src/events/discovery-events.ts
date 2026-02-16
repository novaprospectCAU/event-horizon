/**
 * SF Demo Events - exploration and discovery events.
 */

import type { GameEvent } from '@event-horizon/types';

export const precursorArtifact: GameEvent = {
  id: 'evt-precursor-artifact',
  name: 'Precursor Artifact Discovered',
  description:
    'An expedition to Deep Reach has uncovered an ancient Precursor artifact of immense power. All factions are keenly interested.',
  triggers: [
    { type: 'turn-reached', turn: 5 },
    { type: 'tag-present', entityId: 'system-deepreach', tag: 'explored' },
  ],
  effects: [],
  choices: [
    {
      id: 'artifact-study',
      text: 'Study the artifact in secret',
      description: 'Take the artifact back to your labs for careful study.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 2 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -15 },
        { type: 'set-tag', entityId: 'faction-terran', tag: 'precursor-tech' },
      ],
      resultText:
        'Your scientists study the artifact in secret. The technological breakthrough is remarkable, but word leaks out and others are furious.',
    },
    {
      id: 'artifact-share',
      text: 'Share the discovery with all factions',
      description: 'Propose joint research for the benefit of all.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 25 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 20 },
        { type: 'modify-stat', entityTag: 'faction', statId: 'tech-level', amount: 1 },
      ],
      resultText: 'Your generosity earns widespread goodwill. Joint research yields modest results for everyone.',
    },
    {
      id: 'artifact-synthesis',
      text: 'Offer it to the Synthesis Collective in exchange for an alliance',
      effects: [
        {
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: 'faction-terran',
          targetId: 'faction-synthesis',
          amount: 40,
        },
        { type: 'modify-stat', entityId: 'faction-synthesis', statId: 'tech-level', amount: 2 },
        {
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: 'faction-terran',
          targetId: 'faction-kethari',
          amount: -20,
        },
      ],
      resultText: 'The Collective is deeply grateful. You\'ve made a powerful friend—and a jealous enemy.',
    },
  ],
  maxOccurrences: 1,
  priority: 95,
  tags: ['discovery', 'precursor', 'major'],
};

export const anomalyDetected: GameEvent = {
  id: 'evt-anomaly',
  name: 'Spatial Anomaly Detected',
  description: 'Sensors have detected an unusual spatial anomaly near the frontier. It could be a natural phenomenon or something more.',
  triggers: [
    { type: 'random-chance', chance: 0.1 },
    { type: 'turn-reached', turn: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'anomaly-investigate',
      text: 'Send a science vessel to investigate',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: 'Your scientists gather valuable data from the anomaly. New theories about FTL travel emerge.',
    },
    {
      id: 'anomaly-military',
      text: 'Secure the area with military forces',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-frontier', statId: 'defense-level', amount: 10 },
      ],
      resultText: 'You lock down the anomaly zone. Nothing comes through, but the area is secure.',
    },
    {
      id: 'anomaly-ignore',
      text: 'Log it and move on',
      effects: [],
      resultText: 'The anomaly is catalogued for future investigation. Your attention turns elsewhere.',
    },
  ],
  cooldown: 5,
  priority: 45,
  tags: ['discovery', 'exploration'],
};

export const firstContact: GameEvent = {
  id: 'evt-first-contact',
  name: 'First Contact',
  description: 'A previously unknown species has been detected on the edge of known space. This could change everything.',
  triggers: [
    { type: 'turn-reached', turn: 12 },
    { type: 'stat-threshold', entityTag: 'terran', statId: 'tech-level', comparison: 'gte', value: 5 },
  ],
  effects: [],
  choices: [
    {
      id: 'contact-peaceful',
      text: 'Open peaceful communication',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 30 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: 'Initial communications are promising. The newcomers seem wary but willing to talk.',
    },
    {
      id: 'contact-cautious',
      text: 'Observe from a distance first',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
      ],
      resultText: 'You gather intelligence before making contact. Knowledge is power.',
    },
    {
      id: 'contact-quarantine',
      text: 'Establish a quarantine zone',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
      ],
      resultText: 'You seal off the area. The unknown remains unknown, but your people feel safer.',
    },
  ],
  maxOccurrences: 1,
  priority: 100,
  tags: ['discovery', 'major', 'first-contact'],
};

export const discoveryEvents: GameEvent[] = [precursorArtifact, anomalyDetected, firstContact];
