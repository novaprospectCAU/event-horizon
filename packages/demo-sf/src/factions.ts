/**
 * SF 데모 세력 - 은하계의 세 경쟁 세력.
 */

import type { Entity } from '@event-horizon/types';

/** 테란 연방 - 민주적, 균형잡힌, 외교적 */
export const terranConfederation: Entity = {
  id: 'faction-terran',
  typeId: 'faction',
  name: '테란 연방',
  tags: ['faction', 'major-power', 'human'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '민주 연방주의',
        government: '연방 공화국',
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

/** 케타리 자치령 - 권위주의적, 군사 중심, 팽창주의 */
export const kethariDominion: Entity = {
  id: 'faction-kethari',
  typeId: 'faction',
  name: '케타리 자치령',
  tags: ['faction', 'major-power', 'alien'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '제국 지상주의',
        government: '군사 제국',
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

/** 합성체 집합의식 - 기술관료적, 연구 중심, 신비로운 */
export const synthesisCollective: Entity = {
  id: 'faction-synthesis',
  typeId: 'faction',
  name: '합성체 집합의식',
  tags: ['faction', 'major-power', 'post-biological'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '기술적 초월',
        government: '네트워크 기술관료제',
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
