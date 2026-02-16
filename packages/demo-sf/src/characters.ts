/**
 * 스타크래프트 데모 캐릭터 - 코프룰루 구역의 주요 인물들.
 */

import type { Entity, NPCBehaviorProfile } from '@event-horizon/types';

// ─── 테란 캐릭터 ───

export const admiralChen: Entity = {
  id: 'char-raynor',
  typeId: 'character',
  name: '짐 레이너',
  tags: ['character', 'military', 'terran', 'rebel'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '레이너 특공대 사령관',
        factionId: 'faction-terran',
        backstory:
          '마 사라 출신의 전직 보안관. 멩스크의 배신 이후 반란군을 이끌며 자치령에 맞서고 있다. 정의감이 강하고 동료를 소중히 여긴다.',
        portrait: 'raynor',
      },
    },
  },
  stats: { loyalty: 40, competence: 80, ambition: 55 },
  locationId: 'system-marsara',
};

export const ambassadorVoss: Entity = {
  id: 'char-mengsk',
  typeId: 'character',
  name: '아크튜러스 멩스크',
  tags: ['character', 'leader', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '테란 자치령 황제',
        factionId: 'faction-terran',
        backstory:
          '자유의 아들 반란군을 이끌어 연합을 무너뜨리고 자치령을 세운 야심가. 타소니스에서 케리건을 저그에게 버린 냉혹한 결단으로 악명이 높다.',
        portrait: 'mengsk',
      },
    },
  },
  stats: { loyalty: 95, competence: 85, ambition: 99 },
  locationId: 'system-korhal',
};

export const drKowalski: Entity = {
  id: 'char-duke',
  typeId: 'character',
  name: '에드먼드 듀크 장군',
  tags: ['character', 'military', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '자치령 군 총사령관',
        factionId: 'faction-terran',
        backstory:
          '구 연합의 장군 출신으로 멩스크에게 전향했다. 오만하고 보수적이지만 유능한 군사 지휘관. 알파 전대를 이끈다.',
        portrait: 'duke',
      },
    },
  },
  stats: { loyalty: 75, competence: 70, ambition: 60 },
  locationId: 'system-korhal',
};

export const warlordThrax: Entity = {
  id: 'char-kerrigan',
  typeId: 'character',
  name: '사라 케리건',
  tags: ['character', 'psionic', 'terran', 'ghost'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간 (감염 전)',
        role: '유령 요원',
        factionId: 'faction-terran',
        backstory:
          '연합의 유령 프로그램에서 훈련받은 최강의 사이오닉 요원. 멩스크를 따라 자유의 아들에 합류했으나, 타소니스 전투에서 저그에게 버려지는 운명을 맞이한다.',
        portrait: 'kerrigan',
      },
    },
  },
  stats: { loyalty: 70, competence: 95, ambition: 60 },
  locationId: 'system-tarsonis',
};

// ─── 프로토스 캐릭터 ───

export const spymasterZira: Entity = {
  id: 'char-tassadar',
  typeId: 'character',
  name: '태사다르',
  tags: ['character', 'military', 'protoss', 'templar'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '고위 기사',
        factionId: 'faction-protoss',
        backstory:
          '프로토스의 가장 뛰어난 고위 기사. 저그에 감염된 행성을 정화하라는 의회의 명령에 의문을 품고, 암흑 기사 제라툴과 금기의 동맹을 맺는다.',
        portrait: 'tassadar',
      },
    },
  },
  stats: { loyalty: 80, competence: 95, ambition: 40 },
  locationId: 'system-aiur',
};

export const generalKorr: Entity = {
  id: 'char-zeratul',
  typeId: 'character',
  name: '제라툴',
  tags: ['character', 'stealth', 'protoss', 'dark-templar'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '암흑 기사 족장',
        factionId: 'faction-protoss',
        backstory:
          '수백 년간 추방당한 암흑 기사단의 족장. 공허의 에너지를 다루며, 저그 대뇌충을 처치해 초월체에게 아이어의 위치를 알려주는 비극적 실수를 저지른다.',
        portrait: 'zeratul',
      },
    },
  },
  stats: { loyalty: 60, competence: 92, ambition: 30 },
  locationId: 'system-shakuras',
};

export const archonVexa: Entity = {
  id: 'char-fenix',
  typeId: 'character',
  name: '피닉스',
  tags: ['character', 'military', 'protoss', 'zealot'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '기사단장',
        factionId: 'faction-protoss',
        backstory:
          '프로토스 최고의 전사. 안티오크 전투에서 저그에게 치명상을 입었으나 용기병으로 부활했다. 불굴의 의지와 명예를 상징한다.',
        portrait: 'fenix',
      },
    },
  },
  stats: { loyalty: 90, competence: 88, ambition: 25 },
  locationId: 'system-aiur',
};

export const emissaryEcho: Entity = {
  id: 'char-aldaris',
  typeId: 'character',
  name: '알다리스',
  tags: ['character', 'leader', 'protoss', 'judicator'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '심판관',
        factionId: 'faction-protoss',
        backstory:
          '프로토스 의회의 보수파 심판관. 전통과 칼라를 최우선시하며, 태사다르와 암흑 기사의 이단적 동맹을 강하게 반대한다.',
        portrait: 'aldaris',
      },
    },
  },
  stats: { loyalty: 95, competence: 70, ambition: 75 },
  locationId: 'system-aiur',
};

// ─── 저그 캐릭터 ───

export const researcherPhi: Entity = {
  id: 'char-overmind',
  typeId: 'character',
  name: '초월체',
  tags: ['character', 'leader', 'zerg'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '저그',
        role: '저그 군단 최고 의식',
        factionId: 'faction-zerg',
        backstory:
          '젤나가가 만든 저그 군단의 통합 의식체. 완벽한 생명체를 만들기 위해 끊임없이 진화를 추구하며, 프로토스의 사이오닉 잠재력을 탐내고 있다.',
        portrait: 'overmind',
      },
    },
  },
  stats: { loyalty: 100, competence: 98, ambition: 100 },
  locationId: 'system-char',
};

export const captainRex: Entity = {
  id: 'char-duran',
  typeId: 'character',
  name: '사미르 듀란',
  tags: ['character', 'independent', 'mysterious'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '불명',
        role: '용병 / 정체불명의 공작원',
        factionId: '',
        backstory:
          '정체를 알 수 없는 인물. 테란 용병으로 활동하지만 진정한 목적은 수수께끼에 싸여 있다. 모든 세력의 그림자 속에서 암약한다.',
        portrait: 'duran',
      },
    },
  },
  stats: { loyalty: 10, competence: 90, ambition: 95 },
  locationId: 'system-braxis',
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
    entityId: 'char-raynor',
    personality: [
      { traitId: 'righteous', name: '정의로움', intensity: 0.9 },
      { traitId: 'loyal', name: '의리', intensity: 0.8 },
      { traitId: 'reckless', name: '무모함', intensity: 0.5 },
    ],
    goals: [
      {
        id: 'goal-raynor-1',
        name: '멩스크 정권 타도',
        priority: 90,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['faction-terran'],
      },
      {
        id: 'goal-raynor-2',
        name: '케리건 구출',
        priority: 80,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'raynor-defend',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityTag: 'zerg', comparison: 'gt', value: 150 }],
        actionTypeId: 'rally',
        targetStrategy: 'specific',
        specificTargetId: 'faction-terran',
        weight: 80,
      },
      {
        id: 'raynor-negotiate',
        conditions: [{ type: 'relation-threshold', relationTypeId: 'diplomatic', comparison: 'lt', value: -20 }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'ceasefire' },
        weight: 60,
      },
    ],
    aiPersonalityPrompt:
      '당신은 짐 레이너입니다. 정의감이 강하고 동료를 소중히 여기는 반란군 지도자입니다. 멩스크의 독재에 맞서 싸우면서도 인류의 생존을 최우선으로 합니다.',
    useAI: true,
  },
  {
    entityId: 'char-overmind',
    personality: [
      { traitId: 'calculating', name: '계산적', intensity: 0.95 },
      { traitId: 'relentless', name: '집요함', intensity: 0.9 },
      { traitId: 'patient', name: '인내심', intensity: 0.85 },
    ],
    goals: [
      {
        id: 'goal-overmind-1',
        name: '프로토스 동화',
        priority: 100,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-overmind-2',
        name: '완벽한 진화 달성',
        priority: 95,
        status: 'active',
        completionConditions: [{ type: 'stat-threshold', statId: 'tech-level', entityId: 'faction-zerg', comparison: 'gte', value: 10 }],
      },
    ],
    behaviorRules: [
      {
        id: 'overmind-attack',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityId: 'faction-zerg', comparison: 'gt', value: 150 }],
        actionTypeId: 'attack',
        targetStrategy: 'lowest-relation',
        weight: 90,
      },
      {
        id: 'overmind-build',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityId: 'faction-zerg', comparison: 'lt', value: 100 }],
        actionTypeId: 'build-fleet',
        targetStrategy: 'specific',
        specificTargetId: 'system-char',
        params: { size: 80, fleetType: 'strike' },
        weight: 70,
      },
    ],
    aiPersonalityPrompt:
      '당신은 초월체입니다. 저그 군단의 통합 의식으로서 완벽한 진화를 추구합니다. 냉철하고 거대한 관점에서 말하며, 모든 생명을 군단에 동화시키려 합니다.',
    useAI: true,
  },
  {
    entityId: 'char-tassadar',
    personality: [
      { traitId: 'noble', name: '고결함', intensity: 0.9 },
      { traitId: 'brave', name: '용감함', intensity: 0.85 },
      { traitId: 'questioning', name: '탐구적', intensity: 0.8 },
    ],
    goals: [
      {
        id: 'goal-tassadar-1',
        name: '저그 군단 저지',
        priority: 95,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-tassadar-2',
        name: '아이어 수호',
        priority: 100,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'tassadar-research',
        conditions: [],
        actionTypeId: 'research',
        targetStrategy: 'specific',
        specificTargetId: 'faction-protoss',
        params: { investment: 60 },
        weight: 70,
      },
      {
        id: 'tassadar-diplomacy',
        conditions: [{ type: 'relation-threshold', relationTypeId: 'diplomatic', comparison: 'lt', value: 0 }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'alliance' },
        weight: 60,
      },
    ],
    aiPersonalityPrompt:
      '당신은 태사다르입니다. 프로토스의 가장 고결한 기사로서 칼라의 가르침을 따르되, 진정한 정의를 위해 전통에 도전할 용기를 가지고 있습니다.',
    useAI: true,
  },
];
