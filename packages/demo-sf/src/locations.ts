/**
 * SF 데모 장소 - 성계와 주요 지역.
 */

import type { Entity } from '@event-horizon/types';

export const systemSol: Entity = {
  id: 'system-sol',
  typeId: 'system',
  name: '태양계',
  tags: ['location', 'system', 'terran-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'G2V',
        planets: 8,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: 0, y: 0 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'diplomatic',
        capacity: 500,
        ownerId: 'faction-terran',
      },
    },
  },
  stats: {
    population: 8000,
    resources: 200,
    'defense-level': 80,
  },
};

export const systemKethar: Entity = {
  id: 'system-kethar',
  typeId: 'system',
  name: '케타르 프라임',
  tags: ['location', 'system', 'kethari-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'K1V',
        planets: 5,
        controllerId: 'faction-kethari',
        contested: false,
        coordinates: { x: -120, y: 80 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'military',
        capacity: 400,
        ownerId: 'faction-kethari',
      },
    },
  },
  stats: {
    population: 5000,
    resources: 300,
    'defense-level': 90,
  },
};

export const systemNexus: Entity = {
  id: 'system-nexus',
  typeId: 'system',
  name: '넥서스 프라임',
  tags: ['location', 'system', 'synthesis-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'F5V',
        planets: 3,
        controllerId: 'faction-synthesis',
        contested: false,
        coordinates: { x: 100, y: 100 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'research',
        capacity: 300,
        ownerId: 'faction-synthesis',
      },
    },
  },
  stats: {
    population: 2000,
    resources: 150,
    'defense-level': 70,
  },
};

export const systemHaven: Entity = {
  id: 'system-haven',
  typeId: 'system',
  name: '헤이븐 정거장',
  tags: ['location', 'system', 'neutral', 'trade-hub'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'G8V',
        planets: 4,
        controllerId: '',
        contested: false,
        coordinates: { x: -20, y: 60 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'trade',
        capacity: 600,
        ownerId: '',
      },
    },
  },
  stats: {
    population: 3000,
    resources: 400,
    'defense-level': 30,
  },
};

export const systemForge: Entity = {
  id: 'system-forge',
  typeId: 'system',
  name: '대장간',
  tags: ['location', 'system', 'kethari-space', 'military'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'M2V',
        planets: 2,
        controllerId: 'faction-kethari',
        contested: false,
        coordinates: { x: -80, y: 40 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'military',
        capacity: 350,
        ownerId: 'faction-kethari',
      },
    },
  },
  stats: {
    population: 1500,
    resources: 500,
    'defense-level': 75,
  },
};

export const systemFrontier: Entity = {
  id: 'system-frontier',
  typeId: 'system',
  name: '변경지대',
  tags: ['location', 'system', 'contested', 'border'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'K5V',
        planets: 6,
        controllerId: '',
        contested: true,
        coordinates: { x: -60, y: 20 },
      },
    },
  },
  stats: {
    population: 500,
    resources: 250,
    'defense-level': 15,
  },
};

export const systemDeepReach: Entity = {
  id: 'system-deepreach',
  typeId: 'system',
  name: '심연',
  tags: ['location', 'system', 'unexplored', 'precursor'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'A3V',
        planets: 7,
        controllerId: '',
        contested: false,
        coordinates: { x: 60, y: -40 },
      },
    },
  },
  stats: {
    population: 0,
    resources: 800,
    'defense-level': 0,
  },
};

export const systemAurora: Entity = {
  id: 'system-aurora',
  typeId: 'system',
  name: '오로라',
  tags: ['location', 'system', 'terran-space'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'G5V',
        planets: 5,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: 40, y: -20 },
      },
    },
  },
  stats: {
    population: 4000,
    resources: 180,
    'defense-level': 45,
  },
};

export const locations: Entity[] = [
  systemSol,
  systemKethar,
  systemNexus,
  systemHaven,
  systemForge,
  systemFrontier,
  systemDeepReach,
  systemAurora,
];
