/**
 * 스타크래프트 데모 세력 - 코프룰루 구역의 세 종족.
 */

import type { Entity } from '@event-horizon/types';

/** 테란 자치령 - 연합 붕괴 후 멩스크가 세운 군사 독재 정권. 게임 초기에는 테란 연합이 코프룰루 구역의 테란을 통치하고 있었으나, 코랄의 후예의 반란으로 붕괴. */
export const terranDominion: Entity = {
  id: 'faction-terran',
  typeId: 'faction',
  name: '테란 자치령',
  tags: ['faction', 'major-power', 'terran', 'confederacy-era'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '인류 우월주의와 군사적 질서',
        government: '군사 독재 (전신: 테란 연합 과두정)',
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

/** 프로토스 - 고대 종족, 사이오닉 기술, 명예와 전통 중시. 칼라이(칼라를 따르는 자)와 네라짐(암흑 기사) 분파로 분열되어 있다. */
export const protoss: Entity = {
  id: 'faction-protoss',
  typeId: 'faction',
  name: '프로토스',
  tags: ['faction', 'major-power', 'protoss', 'khalai'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '칼라의 길',
        government: '재판관 계급 중심 의회 (칼라이 계급 구조: 재판관·기사·장인)',
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

/** 저그 군단 - 생물학적 집합체, 동화와 진화, 초월체의 의지. 초월체 아래 정신체들이 각 군단을 지휘하는 위계적 집합 의식 구조. */
export const zergSwarm: Entity = {
  id: 'faction-zerg',
  typeId: 'faction',
  name: '저그 군단',
  tags: ['faction', 'major-power', 'zerg'],
  components: {
    'faction-info': {
      defId: 'faction-info',
      values: {
        ideology: '완벽한 유전적 순수성 (Purity of Essence)',
        government: '초월체-정신체 위계 집합 의식',
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
