/**
 * 스타크래프트 데모 캐릭터 - 코프룰루 구역의 주요 인물들.
 */

import type { Entity, NPCBehaviorProfile } from '@event-horizon/types';

// ─── 테란 캐릭터 ───

export const raynor: Entity = {
  id: 'char-raynor',
  typeId: 'character',
  name: '짐 레이너',
  tags: ['character', 'military', 'terran', 'marshal'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '마 사라 식민지 보안관',
        factionId: 'faction-terran',
        backstory:
          '마 사라 식민지의 보안관. 연합의 부패와 무능에 환멸을 느끼고 있던 중, 저그 출현 이후 멩스크의 코랄의 후예와 접촉하게 된다. 정의감이 강하고 동료를 소중히 여기며, 평범한 사람들을 지키려는 의지가 확고하다.',
        portrait: 'raynor',
      },
    },
  },
  stats: { loyalty: 40, competence: 80, ambition: 55, 'psionic-power': 0 },
  locationId: 'system-marsara',
};

export const mengsk: Entity = {
  id: 'char-mengsk',
  typeId: 'character',
  name: '아크튜러스 멩스크',
  tags: ['character', 'leader', 'terran', 'sons-of-korhal'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '코랄의 후예 지도자',
        factionId: 'faction-terran',
        backstory:
          '코르할 4세 출신 광산 재벌의 아들. 테란 연합이 코르할을 핵폭격하여 가족이 전멸한 이후, 복수심으로 반연합 저항 조직 "코랄의 후예"를 결성했다. 카리스마 넘치는 연설가이자 냉혹한 전략가로, 목적을 위해서라면 어떤 희생도 감수한다.',
        portrait: 'mengsk',
      },
    },
  },
  stats: { loyalty: 95, competence: 85, ambition: 99, 'psionic-power': 0 },
  locationId: 'system-korhal',
};

export const duke: Entity = {
  id: 'char-duke',
  typeId: 'character',
  name: '에드먼드 듀크 장군',
  tags: ['character', 'military', 'terran', 'confederacy'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '테란 연합 알파 전대 사령관',
        factionId: 'faction-terran',
        backstory:
          '테란 연합 최정예 알파 전대의 지휘관. 안티가 프라임에서 저그에게 기함 노라드 II가 격추된 후, 코랄의 후예에 구출되어 전향하게 된다. 오만하고 보수적이지만 유능한 군사 지휘관.',
        portrait: 'duke',
      },
    },
  },
  stats: { loyalty: 75, competence: 70, ambition: 60, 'psionic-power': 0 },
  locationId: 'system-tarsonis',
};

export const kerrigan: Entity = {
  id: 'char-kerrigan',
  typeId: 'character',
  name: '사라 케리건',
  tags: ['character', 'psionic', 'terran', 'ghost'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간 (감염 전)',
        role: '유령 요원 (사이오닉 등급 10)',
        factionId: 'faction-terran',
        backstory:
          '8세에 사이오닉 능력이 폭주하여 어머니가 사망했다. 테란 연합 유령 프로그램에서 기억 소거와 세뇌를 거쳐 최강의 유령 요원이 되었다. 사이오닉 등급 Class 10(역대 최고). 멩스크가 신경 억제장치를 해제하여 코랄의 후예에 합류한 상태.',
        portrait: 'kerrigan',
      },
    },
  },
  stats: { loyalty: 70, competence: 95, ambition: 60, 'psionic-power': 95 },
  locationId: 'system-korhal',
};

export const player: Entity = {
  id: 'char-player',
  typeId: 'character',
  name: '마 사라 민병대 대장',
  tags: ['character', 'military', 'terran', 'militia', 'player'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '인간',
        role: '마 사라 민병대 대장',
        factionId: 'faction-terran',
        backstory:
          '보안관 레이너의 오른팔로, 마 사라 변경 식민지의 치안을 담당하는 민병대 대장. 정규군 출신이 아닌 식민지 태생의 군인으로, 주민들의 안전을 최우선으로 여긴다.',
        portrait: 'militia-captain',
      },
    },
  },
  stats: { loyalty: 60, competence: 65, ambition: 50, 'psionic-power': 0 },
  locationId: 'system-marsara',
};

// ─── 프로토스 캐릭터 ───

export const tassadar: Entity = {
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
  stats: { loyalty: 80, competence: 95, ambition: 40, 'psionic-power': 80 },
  locationId: 'system-aiur',
};

export const zeratul: Entity = {
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
          '약 635세의 네라짐(Nerazim) 족장. 수천 년 전 아이어에서 추방된 암흑 기사 일파의 지도자로, 공허의 에너지를 다룬다. 정신체 자스를 처치하는 과정에서 초월체와 정신 접촉이 이루어져 아이어의 위치를 노출시키는 비극적 실수를 저지른다.',
        portrait: 'zeratul',
      },
    },
  },
  stats: { loyalty: 60, competence: 92, ambition: 30, 'psionic-power': 75 },
  locationId: 'system-shakuras',
};

export const fenix: Entity = {
  id: 'char-fenix',
  typeId: 'character',
  name: '피닉스',
  tags: ['character', 'military', 'protoss', 'zealot'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '법무관 (Praetor)',
        factionId: 'faction-protoss',
        backstory:
          '프로토스 최고의 전사. 안티오크 전투에서 저그에게 치명상을 입었으나 드라군으로 부활했다. 불굴의 의지와 명예를 상징한다.',
        portrait: 'fenix',
      },
    },
  },
  stats: { loyalty: 90, competence: 88, ambition: 25, 'psionic-power': 0 },
  locationId: 'system-aiur',
};

export const aldaris: Entity = {
  id: 'char-aldaris',
  typeId: 'character',
  name: '알다리스',
  tags: ['character', 'leader', 'protoss', 'judicator'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '재판관 (Judicator)',
        factionId: 'faction-protoss',
        backstory:
          '프로토스 의회의 보수파 재판관. 전통과 칼라를 최우선시하며, 태사다르와 암흑 기사의 이단적 동맹을 강하게 반대한다.',
        portrait: 'aldaris',
      },
    },
  },
  stats: { loyalty: 95, competence: 70, ambition: 75, 'psionic-power': 40 },
  locationId: 'system-aiur',
};

// ─── 저그 캐릭터 ───

export const overmind: Entity = {
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
          '젤나가가 순수한 형태(Purity of Essence)를 달성하기 위해 저그를 창조했으나, 초월체가 창조자를 동화·흡수했다. 칼라와 결합하여 완벽해지려는 궁극적 목표를 가지고 있으며, 프로토스의 사이오닉 잠재력을 탐내고 있다.',
        portrait: 'overmind',
      },
    },
  },
  stats: { loyalty: 100, competence: 98, ambition: 100, 'psionic-power': 100 },
  locationId: 'system-char',
};

export const artanis: Entity = {
  id: 'char-artanis',
  typeId: 'character',
  name: '아르타니스',
  tags: ['character', 'military', 'protoss', 'templar'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: '프로토스',
        role: '젊은 집행관',
        factionId: 'faction-protoss',
        backstory:
          '프로토스의 젊은 집행관. EP3의 플레이어 캐릭터(집행관)와는 별도 인물로, EP3 최종 미션에서 함대 지휘관으로 등장한다. 태사다르를 존경하며 그의 가르침을 따르고, 아이어 함락 후 프로토스의 재건을 이끌 차세대 지도자.',
        portrait: 'artanis',
      },
    },
  },
  stats: { loyalty: 85, competence: 80, ambition: 65, 'psionic-power': 55 },
  locationId: 'system-aiur',
};

export const characters: Entity[] = [
  raynor,
  mengsk,
  duke,
  kerrigan,
  player,
  tassadar,
  zeratul,
  fenix,
  aldaris,
  overmind,
  artanis,
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
        name: '연합의 부패에 맞서 싸움',
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
      '당신은 짐 레이너입니다. 마 사라의 보안관으로, 정의감이 강하고 동료를 소중히 여깁니다. 연합의 부패에 환멸을 느끼며 평범한 사람들을 지키기 위해 싸웁니다.',
    useAI: true,
  },
  {
    entityId: 'char-mengsk',
    personality: [
      { traitId: 'ambitious', name: '야심', intensity: 0.95 },
      { traitId: 'charismatic', name: '카리스마', intensity: 0.85 },
      { traitId: 'ruthless', name: '냉혹함', intensity: 0.9 },
    ],
    goals: [
      {
        id: 'goal-mengsk-1',
        name: '연합 붕괴 및 새 질서 수립',
        priority: 100,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-mengsk-2',
        name: '코르할 학살에 대한 복수',
        priority: 85,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['faction-terran'],
      },
    ],
    behaviorRules: [
      {
        id: 'mengsk-consolidate',
        conditions: [{ type: 'stat-threshold', statId: 'stability', entityId: 'faction-terran', comparison: 'lt', value: 50 }],
        actionTypeId: 'suppress',
        targetStrategy: 'specific',
        specificTargetId: 'faction-terran',
        weight: 90,
      },
    ],
    aiPersonalityPrompt:
      '당신은 아크튜러스 멩스크입니다. 코랄의 후예의 지도자로, 연합에 대한 복수심과 카리스마로 반란을 이끌고 있습니다. 목적을 위해서라면 어떤 희생도 감수하는 냉혹한 전략가입니다.',
    useAI: true,
  },
  {
    entityId: 'char-kerrigan',
    personality: [
      { traitId: 'determined', name: '결의', intensity: 0.9 },
      { traitId: 'psionic', name: '사이오닉', intensity: 0.95 },
      { traitId: 'conflicted', name: '갈등', intensity: 0.7 },
    ],
    goals: [
      {
        id: 'goal-kerrigan-1',
        name: '임무 완수',
        priority: 85,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-kerrigan-2',
        name: '동료 보호',
        priority: 90,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-kerrigan-3',
        name: '과거의 기억을 되찾고 자유를 얻음',
        priority: 70,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'kerrigan-support',
        conditions: [],
        actionTypeId: 'support',
        targetStrategy: 'highest-relation',
        weight: 75,
      },
    ],
    aiPersonalityPrompt:
      '당신은 사라 케리건입니다. 연합의 유령 프로그램에서 훈련받은 최강의 사이오닉 요원입니다. 강인하지만 내면에 고독과 불신을 품고 있습니다.',
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
        name: '칼라와 결합하여 젤나가의 순환을 완성',
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
  {
    entityId: 'char-zeratul',
    personality: [
      { traitId: 'wise', name: '지혜', intensity: 0.9 },
      { traitId: 'secretive', name: '은밀함', intensity: 0.85 },
      { traitId: 'tormented', name: '고뇌', intensity: 0.75 },
    ],
    goals: [
      {
        id: 'goal-zeratul-1',
        name: '저그의 비밀 파헤치기',
        priority: 90,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-zeratul-2',
        name: '암흑 기사단의 복권',
        priority: 75,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-zeratul-3',
        name: '초월체와 정신체의 본질 이해',
        priority: 80,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'zeratul-stealth',
        conditions: [],
        actionTypeId: 'infiltrate',
        targetStrategy: 'lowest-relation',
        weight: 80,
      },
    ],
    aiPersonalityPrompt:
      '당신은 제라툴입니다. 수백 년을 살아온 암흑 기사의 족장으로서 공허의 에너지를 다루며, 과거의 비극적 실수에 대한 무거운 죄책감을 안고 있습니다.',
    useAI: true,
  },
  {
    entityId: 'char-fenix',
    personality: [
      { traitId: 'honorable', name: '명예', intensity: 0.95 },
      { traitId: 'fearless', name: '두려움 없음', intensity: 0.9 },
      { traitId: 'steadfast', name: '불굴', intensity: 0.85 },
    ],
    goals: [
      {
        id: 'goal-fenix-1',
        name: '아이어 방어',
        priority: 95,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'fenix-defend',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityTag: 'zerg', comparison: 'gt', value: 100 }],
        actionTypeId: 'defend',
        targetStrategy: 'specific',
        specificTargetId: 'system-aiur',
        weight: 90,
      },
    ],
    aiPersonalityPrompt:
      '당신은 피닉스입니다. 프로토스 최고의 전사로서 전사한 뒤 드라군으로 부활했습니다. 불굴의 의지로 명예를 위해 싸우며, 죽음조차 당신을 멈추지 못했습니다.',
    useAI: true,
  },
  {
    entityId: 'char-aldaris',
    personality: [
      { traitId: 'traditionalist', name: '전통주의', intensity: 0.95 },
      { traitId: 'authoritarian', name: '권위주의', intensity: 0.85 },
      { traitId: 'suspicious', name: '의심', intensity: 0.8 },
    ],
    goals: [
      {
        id: 'goal-aldaris-1',
        name: '칼라의 수호',
        priority: 100,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-aldaris-2',
        name: '이단 척결',
        priority: 85,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['char-tassadar'],
      },
    ],
    behaviorRules: [
      {
        id: 'aldaris-oppose',
        conditions: [{ type: 'tag-present', entityId: 'faction-protoss', tag: 'templar-schism' }],
        actionTypeId: 'oppose',
        targetStrategy: 'specific',
        specificTargetId: 'char-tassadar',
        weight: 85,
      },
    ],
    aiPersonalityPrompt:
      '당신은 알다리스입니다. 프로토스 의회의 보수파 심판관으로서 칼라의 전통을 목숨 걸고 수호합니다. 암흑 기사와의 어떤 타협도 용납하지 않습니다.',
    useAI: true,
  },
  {
    entityId: 'char-duke',
    personality: [
      { traitId: 'arrogant', name: '오만함', intensity: 0.8 },
      { traitId: 'obedient', name: '복종적', intensity: 0.7 },
      { traitId: 'competent', name: '유능함', intensity: 0.75 },
    ],
    goals: [
      {
        id: 'goal-duke-1',
        name: '연합의 질서 유지',
        priority: 85,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['faction-terran'],
      },
    ],
    behaviorRules: [
      {
        id: 'duke-follow-orders',
        conditions: [],
        actionTypeId: 'attack',
        targetStrategy: 'lowest-relation',
        weight: 70,
      },
    ],
    aiPersonalityPrompt:
      '당신은 에드먼드 듀크 장군입니다. 테란 연합 알파 전대의 사령관으로서 자부심이 강합니다. 오만하지만 유능한 군인으로, 강한 자의 편에 서는 현실주의자입니다.',
    useAI: true,
  },
  {
    entityId: 'char-artanis',
    personality: [
      { traitId: 'idealistic', name: '이상주의', intensity: 0.85 },
      { traitId: 'dutiful', name: '의무감', intensity: 0.9 },
      { traitId: 'hopeful', name: '희망', intensity: 0.8 },
    ],
    goals: [
      {
        id: 'goal-artanis-1',
        name: '프로토스 통합',
        priority: 90,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-artanis-2',
        name: '태사다르의 유지 계승',
        priority: 85,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['char-tassadar'],
      },
    ],
    behaviorRules: [
      {
        id: 'artanis-unite',
        conditions: [{ type: 'tag-present', entityId: 'faction-protoss', tag: 'templar-schism' }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'unity' },
        weight: 85,
      },
    ],
    aiPersonalityPrompt:
      '당신은 아르타니스입니다. 젊지만 뛰어난 프로토스 집행관으로서, 태사다르의 정신을 이어받아 프로토스의 화합과 재건을 이끌어 나갑니다.',
    useAI: true,
  },
];
