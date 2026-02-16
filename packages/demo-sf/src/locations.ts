/**
 * 스타크래프트 데모 장소 - 코프룰루 구역의 주요 성계.
 */

import type { Entity } from '@event-horizon/types';

export const systemKorhal: Entity = {
  id: 'system-korhal',
  typeId: 'system',
  name: '코르할',
  tags: ['location', 'system', 'terran-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'G2V',
        planets: 4,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: 0, y: 0 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'military',
        capacity: 500,
        ownerId: 'faction-terran',
      },
    },
  },
  stats: {
    population: 6000,
    resources: 250,
    'defense-level': 85,
  },
};

export const systemAiur: Entity = {
  id: 'system-aiur',
  typeId: 'system',
  name: '아이어',
  tags: ['location', 'system', 'protoss-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'F5V',
        planets: 6,
        controllerId: 'faction-protoss',
        contested: false,
        coordinates: { x: 100, y: 80 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'military',
        capacity: 600,
        ownerId: 'faction-protoss',
      },
    },
  },
  stats: {
    population: 8000,
    resources: 300,
    'defense-level': 90,
  },
};

export const systemChar: Entity = {
  id: 'system-char',
  typeId: 'system',
  name: '차',
  tags: ['location', 'system', 'zerg-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'M2V',
        planets: 2,
        controllerId: 'faction-zerg',
        contested: false,
        coordinates: { x: -80, y: 100 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'military',
        capacity: 400,
        ownerId: 'faction-zerg',
      },
    },
  },
  stats: {
    population: 0,
    resources: 500,
    'defense-level': 95,
  },
};

export const systemMarSara: Entity = {
  id: 'system-marsara',
  typeId: 'system',
  name: '마 사라',
  tags: ['location', 'system', 'terran-space', 'colony', 'frontier'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'G8V',
        planets: 3,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: -30, y: 20 },
      },
    },
  },
  stats: {
    population: 2000,
    resources: 150,
    'defense-level': 25,
  },
};

export const systemTarsonis: Entity = {
  id: 'system-tarsonis',
  typeId: 'system',
  name: '타소니스',
  tags: ['location', 'system', 'terran-space', 'capital'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'G5V',
        planets: 5,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: -20, y: -10 },
      },
    },
  },
  stats: {
    population: 8000,
    resources: 200,
    'defense-level': 80,
  },
};

export const systemAntiga: Entity = {
  id: 'system-antiga',
  typeId: 'system',
  name: '안티가 프라임',
  tags: ['location', 'system', 'terran-space', 'border'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'K5V',
        planets: 4,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: -60, y: 40 },
      },
    },
  },
  stats: {
    population: 1500,
    resources: 180,
    'defense-level': 20,
  },
};

export const systemShakuras: Entity = {
  id: 'system-shakuras',
  typeId: 'system',
  name: '샤쿠라스',
  tags: ['location', 'system', 'protoss-space', 'dark-templar'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'K1V',
        planets: 3,
        controllerId: 'faction-protoss',
        contested: false,
        coordinates: { x: 80, y: 40 },
      },
    },
    station: {
      defId: 'station',
      values: {
        stationType: 'research',
        capacity: 300,
        ownerId: 'faction-protoss',
      },
    },
  },
  stats: {
    population: 3000,
    resources: 200,
    'defense-level': 70,
  },
};

export const systemBraxis: Entity = {
  id: 'system-braxis',
  typeId: 'system',
  name: '브락시스',
  tags: ['location', 'system', 'terran-space', 'ice-world'],
  components: {
    'star-system': {
      defId: 'star-system',
      values: {
        starType: 'A3V',
        planets: 2,
        controllerId: 'faction-terran',
        contested: false,
        coordinates: { x: 40, y: -40 },
      },
    },
  },
  stats: {
    population: 800,
    resources: 350,
    'defense-level': 15,
  },
};

export const locations: Entity[] = [
  systemKorhal,
  systemAiur,
  systemChar,
  systemMarSara,
  systemTarsonis,
  systemAntiga,
  systemShakuras,
  systemBraxis,
];
