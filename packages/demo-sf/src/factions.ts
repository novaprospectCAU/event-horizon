/**
 * 스타크래프트 데모 세력 - 코프룰루 구역의 세 종족.
 */

import type { Entity } from '@event-horizon/types';

/** 테란 자치령 - 인간, 군사 독재, 기술과 화력 중심 */
export const terranDominion: Entity = {
  id: 'faction-terran',
  typeId: 'faction',
  name: '테란 자치령',
  tags: ['faction', 'major-power', 'terran'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '인류 생존주의',
        government: '군사 독재 제국',
        homeSystemId: 'system-korhal',
        color: '#3B82F6',
      },
    },
  },
  stats: {
    'military-power': 150,
    'economic-power': 140,
    'tech-level': 4,
    influence: 55,
    stability: 60,
  },
};

/** 프로토스 - 고대 종족, 사이오닉 기술, 명예와 전통 중시 */
export const protoss: Entity = {
  id: 'faction-protoss',
  typeId: 'faction',
  name: '프로토스',
  tags: ['faction', 'major-power', 'protoss'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '칼라의 길',
        government: '의회 신정정치',
        homeSystemId: 'system-aiur',
        color: '#EAB308',
      },
    },
  },
  stats: {
    'military-power': 180,
    'economic-power': 100,
    'tech-level': 7,
    influence: 70,
    stability: 65,
  },
};

/** 저그 군단 - 생물학적 집합체, 동화와 진화, 초월체의 의지 */
export const zergSwarm: Entity = {
  id: 'faction-zerg',
  typeId: 'faction',
  name: '저그 군단',
  tags: ['faction', 'major-power', 'zerg'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '완벽한 진화',
        government: '집합 의식 (초월체)',
        homeSystemId: 'system-char',
        color: '#9333EA',
      },
    },
  },
  stats: {
    'military-power': 220,
    'economic-power': 80,
    'tech-level': 5,
    influence: 30,
    stability: 95,
  },
};

export const factions: Entity[] = [terranDominion, protoss, zergSwarm];
