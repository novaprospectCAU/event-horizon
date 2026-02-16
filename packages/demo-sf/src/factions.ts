/**
 * SF Demo Factions - three competing powers in the galaxy.
 */

import type { Entity } from '@event-horizon/types';

/** Terran Confederation - democratic, balanced, diplomatic */
export const terranConfederation: Entity = {
  id: 'faction-terran',
  typeId: 'faction',
  name: 'Terran Confederation',
  tags: ['faction', 'major-power', 'human'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: 'Democratic Federalism',
        government: 'Federal Republic',
        homeSystemId: 'system-sol',
        color: '#3B82F6',
      },
    },
  },
  stats: {
    'military-power': 120,
    'economic-power': 150,
    'tech-level': 4,
    influence: 60,
    stability: 75,
  },
};

/** Kethari Dominion - authoritarian, military-focused, expansionist */
export const kethariDominion: Entity = {
  id: 'faction-kethari',
  typeId: 'faction',
  name: 'Kethari Dominion',
  tags: ['faction', 'major-power', 'alien'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: 'Imperial Supremacy',
        government: 'Military Empire',
        homeSystemId: 'system-kethar',
        color: '#EF4444',
      },
    },
  },
  stats: {
    'military-power': 200,
    'economic-power': 80,
    'tech-level': 3,
    influence: 40,
    stability: 65,
  },
};

/** Synthesis Collective - technocratic, research-focused, mysterious */
export const synthesisCollective: Entity = {
  id: 'faction-synthesis',
  typeId: 'faction',
  name: 'Synthesis Collective',
  tags: ['faction', 'major-power', 'post-biological'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: 'Technological Transcendence',
        government: 'Networked Technocracy',
        homeSystemId: 'system-nexus',
        color: '#8B5CF6',
      },
    },
  },
  stats: {
    'military-power': 80,
    'economic-power': 120,
    'tech-level': 6,
    influence: 70,
    stability: 85,
  },
};

export const factions: Entity[] = [terranConfederation, kethariDominion, synthesisCollective];
