/**
 * 스타크래프트 데모 스토리 아크 - 메인 스토리라인 진행.
 */

import type { StoryArc, Scene, DialogueTree } from '@event-horizon/types';

// ─── 메인 아크: 아이어 침공 ───

export const convergenceArc: StoryArc = {
  id: 'arc-aiur-invasion',
  name: '아이어 침공',
  description:
    '초월체가 저그 군단을 이끌고 프로토스의 고향 행성 아이어를 향해 진군한다. 코프룰루 구역의 운명이 결정될 전쟁이 시작된다.',
  stages: [
    {
      id: 'stage-signals',
      name: '저그의 움직임',
      description: '저그 군단의 이상한 이동 패턴이 감지되었다. 대규모 침공의 전조다.',
      advanceConditions: [{ type: 'turn-reached', turn: 4 }],
      sceneId: 'scene-signals-briefing',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-char', tag: 'mobilizing' },
      ],
    },
    {
      id: 'stage-expedition',
      name: '타소니스의 비극',
      description: '멩스크가 사이오닉 방출기로 저그를 타소니스로 유인한다. 케리건이 버려진다.',
      advanceConditions: [
        { type: 'tag-present', entityId: 'system-tarsonis', tag: 'fallen' },
      ],
      failConditions: [{ type: 'turn-reached', turn: 15 }],
      sceneId: 'scene-tarsonis-fall',
      onEnterEffects: [
        { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
      ],
    },
    {
      id: 'stage-discovery',
      name: '칼날 여왕의 탄생',
      description: '케리건이 저그에 감염되어 칼날 여왕으로 변이한다.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-precursor-artifact' },
      ],
      sceneId: 'scene-queen-of-blades',
    },
    {
      id: 'stage-convergence',
      name: '아이어 최후의 전투',
      description: '저그 군단이 아이어에 상륙한다. 태사다르의 최후의 결단이 필요하다.',
      advanceConditions: [{ type: 'turn-reached', turn: 20 }],
      sceneId: 'scene-final-battle',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-aiur', tag: 'under-siege' },
      ],
    },
  ],
  tags: ['main', 'invasion'],
  priority: 100,
};

// ─── 서브 아크: 자치령의 횡포 ───

export const kethariCivilWarArc: StoryArc = {
  id: 'arc-dominion-tyranny',
  name: '자치령의 횡포',
  description:
    '멩스크의 독재가 심화된다. 레이너는 동료들을 모아 자치령에 맞서기로 결심한다.',
  stages: [
    {
      id: 'stage-tension',
      name: '커지는 불만',
      description: '자치령의 압제에 대한 반발이 커지고 있다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-terran',
          statId: 'stability',
          comparison: 'lt',
          value: 50,
        },
      ],
      sceneId: 'scene-dominion-oppression',
    },
    {
      id: 'stage-conspiracy',
      name: '레이너의 결심',
      description: '레이너가 공개적으로 멩스크에 반기를 든다.',
      advanceConditions: [{ type: 'turn-reached', turn: 10 }],
      sceneId: 'scene-raynor-rebellion',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'ambition', amount: 15 },
      ],
    },
    {
      id: 'stage-civil-war',
      name: '레이너 특공대 출범',
      description: '레이너 특공대가 정식으로 자치령에 선전포고한다.',
      advanceConditions: [{ type: 'turn-reached', turn: 15 }],
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -30 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -20 },
      ],
    },
  ],
  tags: ['secondary', 'terran', 'political'],
  priority: 80,
};

// ─── 3차 아크: 빛과 어둠의 화합 ───

export const synthesisAwakeningArc: StoryArc = {
  id: 'arc-templar-unity',
  name: '빛과 어둠의 화합',
  description:
    '칼라이와 암흑 기사, 오랜 분열을 겪은 프로토스 두 분파가 저그에 맞서 하나로 통합되어야 한다.',
  stages: [
    {
      id: 'stage-research',
      name: '태사다르의 선택',
      description: '태사다르가 암흑 기사의 기술을 배우기로 결심한다. 의회는 이를 이단으로 규정한다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-protoss',
          statId: 'tech-level',
          comparison: 'gte',
          value: 8,
        },
      ],
      onEnterEffects: [
        { type: 'set-tag', entityId: 'faction-protoss', tag: 'templar-schism' },
      ],
    },
    {
      id: 'stage-awakening',
      name: '화합의 불꽃',
      description: '칼라의 빛과 공허의 에너지가 하나로 합쳐진다. 프로토스 역사상 전례 없는 힘이 탄생한다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-protoss',
          statId: 'tech-level',
          comparison: 'gte',
          value: 10,
        },
      ],
      onEnterEffects: [
        { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -10 },
      ],
    },
  ],
  tags: ['tertiary', 'protoss', 'unity'],
  priority: 60,
};

export const storyArcs: StoryArc[] = [convergenceArc, kethariCivilWarArc, synthesisAwakeningArc];

// ─── 장면 ───

export const signalsBriefingDialogue: DialogueTree = {
  id: 'dialogue-zerg-movement',
  name: '저그 이동 브리핑',
  startNodeId: 'node-1',
  nodes: [
    {
      id: 'node-1',
      speakerId: 'char-raynor',
      text: '사령관, 정찰대의 보고에 따르면 차 행성의 저그 군단이 대규모로 이동하고 있습니다. 뭔가 크게 준비하고 있는 것 같습니다.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-1a', text: '목표는 어디인가?', nextNodeId: 'node-2a' },
        { id: 'resp-1b', text: '우리 방어 상태는?', nextNodeId: 'node-2b' },
      ],
    },
    {
      id: 'node-2a',
      speakerId: 'char-kerrigan',
      text: '사이오닉 감지로는... 프로토스 본성, 아이어 방향입니다. 초월체가 직접 움직이고 있어요. 이건 단순한 습격이 아닙니다.',
      emotion: 'surprised',
      responses: [
        { id: 'resp-2a', text: '프로토스에 경고해야 한다.', nextNodeId: 'node-3' },
        { id: 'resp-2b', text: '우리 영토 방어에 집중하자.', nextNodeId: 'node-3' },
      ],
    },
    {
      id: 'node-2b',
      speakerId: 'char-duke',
      text: '코르할 방어선은 견고합니다. 하지만 변경 식민지들은... 솔직히 자체 방어는 불가능합니다. 멩스크 황제께서 어떤 결정을 내리시든 따르겠습니다.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-3a', text: '변경 식민지를 포기할 수는 없다.', nextNodeId: 'node-3' },
        { id: 'resp-3b', text: '코르할 방어가 최우선이다.', nextNodeId: 'node-3' },
      ],
    },
    {
      id: 'node-3',
      speakerId: 'char-raynor',
      text: '어떤 결정을 내리든, 이건 우리만의 문제가 아닙니다. 저그가 아이어를 공격하면, 다음 차례는 우리입니다. 프로토스가 무너지면 코프룰루 구역 전체가 위험합니다.',
      emotion: 'neutral',
      isEnd: true,
    },
  ],
};

export const scenes: Scene[] = [
  {
    id: 'scene-signals-briefing',
    name: '저그의 움직임',
    description: '저그 군단의 대규모 이동이 감지되었다.',
    locationId: 'system-korhal',
    participantIds: ['char-raynor', 'char-kerrigan', 'char-duke'],
    dialogue: signalsBriefingDialogue,
    narrativeText:
      '코르할 사령부의 전술 화면에 차 행성에서 출발한 저그 군단의 이동 경로가 붉은 선으로 표시된다. 규모는 전례 없는 수준이다.',
    aiNarrative: true,
  },
  {
    id: 'scene-tarsonis-fall',
    name: '타소니스의 몰락',
    description: '멩스크의 계략으로 타소니스가 저그에게 함락된다.',
    locationId: 'system-tarsonis',
    participantIds: ['char-mengsk', 'char-kerrigan'],
    narrativeText:
      '사이오닉 방출기가 활성화되자, 수억의 저그가 타소니스로 쏟아져 들어온다. 하늘이 뮤탈리스크로 뒤덮이고, 연합의 수도는 지옥으로 변한다.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'system-tarsonis', tag: 'fallen' },
    ],
  },
  {
    id: 'scene-queen-of-blades',
    name: '칼날 여왕의 탄생',
    description: '케리건이 저그에 감염되어 새로운 존재로 변이한다.',
    locationId: 'system-char',
    participantIds: ['char-kerrigan', 'char-overmind'],
    narrativeText:
      '차 행성의 번데기 안에서 사라 케리건이 다시 태어난다. 인간성은 사라지고, 칼날 여왕이 눈을 뜬다. 초월체의 가장 완벽한 창조물.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'char-kerrigan', tag: 'infested' },
    ],
  },
  {
    id: 'scene-final-battle',
    name: '아이어 최후의 전투',
    description: '태사다르가 초월체에 맞서 최후의 희생을 결심한다.',
    locationId: 'system-aiur',
    participantIds: ['char-tassadar', 'char-zeratul', 'char-fenix', 'char-raynor', 'char-overmind'],
    narrativeText:
      '아이어의 하늘이 저그의 포자로 뒤덮였다. 태사다르는 간트리서의 함교에 홀로 서서 초월체를 내려다본다. 칼라의 빛과 공허의 에너지가 그의 손에서 하나로 합쳐진다.',
    aiNarrative: true,
  },
  {
    id: 'scene-dominion-oppression',
    name: '자치령의 철권',
    description: '멩스크의 독재가 심화된다.',
    locationId: 'system-korhal',
    participantIds: ['char-mengsk', 'char-duke'],
    narrativeText:
      '코르할 궁전에서 멩스크가 새로운 포고령에 서명한다. 반체제 인사 감시 강화, 언론 통제, 식민지 자치권 박탈. 듀크 장군이 충실히 명령을 수행한다.',
    aiNarrative: true,
  },
  {
    id: 'scene-raynor-rebellion',
    name: '레이너의 선언',
    description: '레이너가 멩스크에 공개적으로 반기를 든다.',
    locationId: 'system-marsara',
    participantIds: ['char-raynor', 'char-mengsk'],
    narrativeText:
      '"난 널 끌어내리겠다, 멩스크." 레이너의 선언이 모든 주파수로 방송된다. 히페리온이 마 사라 궤도를 이탈하며 자치령 깃발을 내린다.',
    aiNarrative: true,
  },
];
