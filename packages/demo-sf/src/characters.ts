/**
 * SF 데모 캐릭터 - 모든 세력의 주요 NPC들.
 */

import type { Entity, NPCBehaviorProfile } from '@event-horizon/types';

// ─── 테란 캐릭터 ───

export const admiralChen: Entity = {
  id: 'char-chen',
  typeId: 'character',
  name: '첸 제독',
  tags: ['character', 'military', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '함대 제독',
        factionId: 'faction-terran',
        backstory:
          '변경 전쟁의 훈장받은 참전 용사로, 뛰어난 전술적 능력과 자제력으로 세력을 초월한 존경을 받고 있다. 힘을 통한 평화를 신봉한다.',
        portrait: 'chen',
      },
    },
  },
  stats: { loyalty: 85, competence: 90, ambition: 60 },
  locationId: 'system-sol',
};

export const ambassadorVoss: Entity = {
  id: 'char-voss',
  typeId: 'character',
  name: '보스 대사',
  tags: ['character', 'diplomat', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '수석 외교관',
        factionId: 'faction-terran',
        backstory:
          '누구보다 많은 조약을 체결한 유능한 협상가. 일부는 그의 이상주의가 냉철한 계산을 감추고 있다고 의심한다.',
        portrait: 'voss',
      },
    },
  },
  stats: { loyalty: 70, competence: 85, ambition: 75 },
  locationId: 'system-sol',
};

export const drKowalski: Entity = {
  id: 'char-kowalski',
  typeId: 'character',
  name: '코왈스키 박사',
  tags: ['character', 'scientist', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '수석 과학자',
        factionId: 'faction-terran',
        backstory:
          '합성체 기술을 역설계한 천재 외계기술학자. 테라에 대한 충성과 외계 과학에 대한 매혹 사이에서 갈등한다.',
        portrait: 'kowalski',
      },
    },
  },
  stats: { loyalty: 55, competence: 95, ambition: 70 },
  locationId: 'system-haven',
};

// ─── 케타리 캐릭터 ───

export const warlordThrax: Entity = {
  id: 'char-thrax',
  typeId: 'character',
  name: "군주 트락스'발",
  tags: ['character', 'military', 'kethari', 'leader'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '케타리',
        role: '최고 군주',
        factionId: 'faction-kethari',
        backstory:
          '정복을 통해 왕좌를 쟁취한 자치령의 절대 지배자. 무자비하지만 투박한 명예심을 지니고 있다.',
        portrait: 'thrax',
      },
    },
  },
  stats: { loyalty: 95, competence: 80, ambition: 95 },
  locationId: 'system-kethar',
};

export const spymasterZira: Entity = {
  id: 'char-zira',
  typeId: 'character',
  name: "첩보장 지라'케시",
  tags: ['character', 'spy', 'kethari'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '케타리',
        role: '정보국장',
        factionId: 'faction-kethari',
        backstory:
          '자치령의 방대한 첩보망을 운영한다. 정부를 무너뜨릴 수 있는 비밀을 알고 있다. 트락스에게 충성... 지금은.',
        portrait: 'zira',
      },
    },
  },
  stats: { loyalty: 60, competence: 88, ambition: 85 },
  locationId: 'system-kethar',
};

export const generalKorr: Entity = {
  id: 'char-korr',
  typeId: 'character',
  name: "코르'닥 장군",
  tags: ['character', 'military', 'kethari'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '케타리',
        role: '함대 장군',
        factionId: 'faction-kethari',
        backstory:
          '잔인하지만 유능한 군사 지휘관. 케타리가 은하를 지배할 운명이라 믿으며, 무엇보다 자치령에 맹렬히 충성한다.',
        portrait: 'korr',
      },
    },
  },
  stats: { loyalty: 90, competence: 75, ambition: 80 },
  locationId: 'system-forge',
};

// ─── 합성체 캐릭터 ───

export const archonVexa: Entity = {
  id: 'char-vexa',
  typeId: 'character',
  name: '집정관 벡사-7',
  tags: ['character', 'leader', 'synthesis'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '합성-유기체 하이브리드',
        role: '주요 노드',
        factionId: 'faction-synthesis',
        backstory:
          '집합의식에서 지도자에 가장 가까운 존재. 벡사-7은 수백만 네트워크 정신의 입력을 처리하며 초월을 향한 최적의 길을 모색한다.',
        portrait: 'vexa',
      },
    },
  },
  stats: { loyalty: 80, competence: 95, ambition: 50 },
  locationId: 'system-nexus',
};

export const emissaryEcho: Entity = {
  id: 'char-echo',
  typeId: 'character',
  name: '사절 에코',
  tags: ['character', 'diplomat', 'synthesis'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '합성 아바타',
        role: '대외 관계',
        factionId: 'faction-synthesis',
        backstory:
          '생물학적 종족과 소통하기 위해 만들어진 외교 아바타. 인공 존재치고는 놀라울 정도로 공감 능력이 뛰어나다. 에코가 진정한 감정을 발전시킨 것인지 궁금해하는 이들도 있다.',
        portrait: 'echo',
      },
    },
  },
  stats: { loyalty: 75, competence: 82, ambition: 40 },
  locationId: 'system-haven',
};

export const researcherPhi: Entity = {
  id: 'char-phi',
  typeId: 'character',
  name: '연구원 파이-12',
  tags: ['character', 'scientist', 'synthesis'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '합성-유기체 하이브리드',
        role: '수석 연구원',
        factionId: 'faction-synthesis',
        backstory:
          '심우주에서 발견된 선구자 유물을 이해하는 데 집착한다. 그것이 진정한 초월의 열쇠를 쥐고 있다고 믿는다.',
        portrait: 'phi',
      },
    },
  },
  stats: { loyalty: 65, competence: 92, ambition: 60 },
  locationId: 'system-nexus',
};

// ─── 독립 캐릭터 ───

export const captainRex: Entity = {
  id: 'char-rex',
  typeId: 'character',
  name: '렉스 나바로 선장',
  tags: ['character', 'independent', 'smuggler'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '자유 선장',
        factionId: '',
        backstory:
          '중립 지대에서 활동하는 프리랜서 밀수업자이자 정보 중개인. 모두에게 빚이 있고, 아무도 믿지 않는다.',
        portrait: 'rex',
      },
    },
  },
  stats: { loyalty: 30, competence: 78, ambition: 65 },
  locationId: 'system-haven',
};

export const characters: Entity[] = [
  admiralChen,
  ambassadorVoss,
  drKowalski,
  warlordThrax,
  spymasterZira,
  generalKorr,
  archonVexa,
  emissaryEcho,
  researcherPhi,
  captainRex,
];

// ─── NPC 행동 프로필 ───

export const npcProfiles: NPCBehaviorProfile[] = [
  {
    entityId: 'char-chen',
    personality: [
      { traitId: 'cautious', name: '신중함', intensity: 0.7 },
      { traitId: 'honorable', name: '명예로움', intensity: 0.8 },
      { traitId: 'strategic', name: '전략적', intensity: 0.9 },
    ],
    goals: [
      {
        id: 'goal-chen-1',
        name: '테란 국경 방어',
        priority: 90,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['faction-terran'],
      },
      {
        id: 'goal-chen-2',
        name: '평화 유지',
        priority: 70,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'chen-defend',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityTag: 'kethari', comparison: 'gt', value: 150 }],
        actionTypeId: 'rally',
        targetStrategy: 'specific',
        specificTargetId: 'faction-terran',
        weight: 80,
      },
      {
        id: 'chen-negotiate',
        conditions: [{ type: 'relation-threshold', relationTypeId: 'diplomatic', comparison: 'lt', value: -20 }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'ceasefire' },
        weight: 60,
      },
    ],
    aiPersonalityPrompt:
      '당신은 첸 제독입니다. 외교를 선호하지만 필요하면 단호하게 싸우는 차분하고 전략적인 군사 지도자입니다.',
    useAI: true,
  },
  {
    entityId: 'char-thrax',
    personality: [
      { traitId: 'aggressive', name: '공격적', intensity: 0.9 },
      { traitId: 'proud', name: '자부심', intensity: 0.8 },
      { traitId: 'cunning', name: '교활함', intensity: 0.6 },
    ],
    goals: [
      {
        id: 'goal-thrax-1',
        name: '자치령 영토 확장',
        priority: 95,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-thrax-2',
        name: '적대 세력 분쇄',
        priority: 80,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'thrax-attack',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityId: 'faction-kethari', comparison: 'gt', value: 150 }],
        actionTypeId: 'attack',
        targetStrategy: 'lowest-relation',
        weight: 90,
      },
      {
        id: 'thrax-build',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityId: 'faction-kethari', comparison: 'lt', value: 100 }],
        actionTypeId: 'build-fleet',
        targetStrategy: 'specific',
        specificTargetId: 'system-kethar',
        params: { size: 50, fleetType: 'strike' },
        weight: 70,
      },
    ],
    aiPersonalityPrompt:
      '당신은 군주 트락스입니다. 강함을 존중하고 약함을 경멸하는 무자비한 정복자입니다. 권위와 위압감을 가지고 말합니다.',
    useAI: true,
  },
  {
    entityId: 'char-vexa',
    personality: [
      { traitId: 'logical', name: '논리적', intensity: 0.95 },
      { traitId: 'curious', name: '호기심', intensity: 0.8 },
      { traitId: 'patient', name: '인내심', intensity: 0.9 },
    ],
    goals: [
      {
        id: 'goal-vexa-1',
        name: '기술적 초월 달성',
        priority: 100,
        status: 'active',
        completionConditions: [{ type: 'stat-threshold', statId: 'tech-level', entityId: 'faction-synthesis', comparison: 'gte', value: 10 }],
      },
      {
        id: 'goal-vexa-2',
        name: '집합의식 통합 유지',
        priority: 85,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'vexa-research',
        conditions: [],
        actionTypeId: 'research',
        targetStrategy: 'specific',
        specificTargetId: 'faction-synthesis',
        params: { investment: 80 },
        weight: 90,
      },
      {
        id: 'vexa-diplomacy',
        conditions: [{ type: 'relation-threshold', relationTypeId: 'diplomatic', comparison: 'lt', value: 0 }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'trade' },
        weight: 50,
      },
    ],
    aiPersonalityPrompt:
      '당신은 집정관 벡사-7, 합성체 집합의식의 주요 처리 노드입니다. 정밀하고 절제된 논리로 말하지만 유기체의 관점에 대해 진정한 호기심을 보입니다.',
    useAI: true,
  },
];
