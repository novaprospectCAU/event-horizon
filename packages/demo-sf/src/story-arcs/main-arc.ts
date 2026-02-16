/**
 * SF 데모 스토리 아크 - 메인 스토리라인 진행.
 */

import type { StoryArc, Scene, DialogueTree } from '@event-horizon/types';

// ─── 메인 스토리 아크: 수렴 ───

export const convergenceArc: StoryArc = {
  id: 'arc-convergence',
  name: '수렴',
  description:
    '고대 선구자의 신호가 모든 세력을 심연으로 이끌고 있다. 그곳에서 기다리는 것은 은하를 하나로 만들 수도, 파괴할 수도 있다.',
  stages: [
    {
      id: 'stage-signals',
      name: '기이한 신호',
      description: '미지의 심연 성계에서 설명할 수 없는 신호가 감지되었다.',
      advanceConditions: [{ type: 'turn-reached', turn: 4 }],
      sceneId: 'scene-signals-briefing',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-deepreach', tag: 'signals-detected' },
      ],
    },
    {
      id: 'stage-expedition',
      name: '원정대',
      description: '세력들이 심연에 먼저 도달하여 그곳의 것을 차지하기 위해 경주한다.',
      advanceConditions: [
        { type: 'tag-present', entityId: 'system-deepreach', tag: 'explored' },
      ],
      failConditions: [{ type: 'turn-reached', turn: 15 }],
      sceneId: 'scene-expedition-launch',
      onEnterEffects: [
        { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
      ],
    },
    {
      id: 'stage-discovery',
      name: '대발견',
      description: '선구자 유물이 발견되었다. 그 힘은 은하를 재편할 수 있다.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-precursor-artifact' },
      ],
      sceneId: 'scene-discovery',
    },
    {
      id: 'stage-convergence',
      name: '수렴',
      description: '모든 세력이 심연에 집결한다. 은하의 미래가 여기서 결정된다.',
      advanceConditions: [{ type: 'turn-reached', turn: 20 }],
      sceneId: 'scene-final-convergence',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-deepreach', tag: 'convergence' },
      ],
    },
  ],
  tags: ['main', 'precursor'],
  priority: 100,
};

// ─── 서브 아크: 케타리 내전 ───

export const kethariCivilWarArc: StoryArc = {
  id: 'arc-kethari-war',
  name: '분열된 자치령',
  description:
    '케타리 자치령의 철권 통치에 균열이 나타난다. 트락스와 지라 사이의 권력 투쟁이 자치령을 둘로 갈라놓을 수 있다.',
  stages: [
    {
      id: 'stage-tension',
      name: '고조되는 긴장',
      description: '케타리 자치령 내부의 갈등이 깊어진다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-kethari',
          statId: 'stability',
          comparison: 'lt',
          value: 50,
        },
      ],
      sceneId: 'scene-kethari-tension',
    },
    {
      id: 'stage-conspiracy',
      name: '지라의 음모',
      description: '첩보장 지라가 쿠데타를 위한 동맹을 찾으며 행동에 나선다.',
      advanceConditions: [{ type: 'turn-reached', turn: 10 }],
      sceneId: 'scene-zira-conspiracy',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'char-zira', statId: 'ambition', amount: 15 },
      ],
    },
    {
      id: 'stage-civil-war',
      name: '내전',
      description: '자치령이 분열된다. 트락스와 지라가 지배권을 놓고 싸운다.',
      advanceConditions: [{ type: 'turn-reached', turn: 15 }],
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'faction-kethari', statId: 'military-power', amount: -50 },
        { type: 'modify-stat', entityId: 'faction-kethari', statId: 'stability', amount: -30 },
      ],
    },
  ],
  tags: ['secondary', 'kethari', 'political'],
  priority: 80,
};

// ─── 3차 아크: 합성체 각성 ───

export const synthesisAwakeningArc: StoryArc = {
  id: 'arc-synthesis-awakening',
  name: '각성',
  description:
    '합성체 집합의식이 기술적 초월의 문턱에 있다. 그것이 그들을 신과 같은 존재로 만들 수도, 완전히 파괴할 수도 있다.',
  stages: [
    {
      id: 'stage-research',
      name: '프로젝트 오메가',
      description: '집합의식이 전례 없는 규모의 비밀 연구 프로젝트를 시작한다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-synthesis',
          statId: 'tech-level',
          comparison: 'gte',
          value: 8,
        },
      ],
      onEnterEffects: [
        { type: 'set-tag', entityId: 'faction-synthesis', tag: 'project-omega' },
      ],
    },
    {
      id: 'stage-awakening',
      name: '각성',
      description: '집합의식이 초월하기 시작한다. 은하가 경외와 공포로 지켜본다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-synthesis',
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
  tags: ['tertiary', 'synthesis', 'technology'],
  priority: 60,
};

export const storyArcs: StoryArc[] = [convergenceArc, kethariCivilWarArc, synthesisAwakeningArc];

// ─── 장면 ───

export const signalsBriefingDialogue: DialogueTree = {
  id: 'dialogue-signals',
  name: '신호 브리핑',
  startNodeId: 'node-1',
  nodes: [
    {
      id: 'node-1',
      speakerId: 'char-chen',
      text: '사령관, 심우주 센서가 심연 성계에서 이상 신호를 감지했습니다. 데이터베이스의 어떤 패턴과도 일치하지 않습니다.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-1a', text: '선구자 기술일 수 있나?', nextNodeId: 'node-2a' },
        { id: 'resp-1b', text: '군사적 평가는?', nextNodeId: 'node-2b' },
      ],
    },
    {
      id: 'node-2a',
      speakerId: 'char-kowalski',
      text: '제가 정확히 그렇게 생각합니다. 신호 고조파가 선구자 통신 배열의 이론적 모델과 일치합니다. 제가 맞다면, 이것은 세기의 발견이 될 수 있습니다.',
      emotion: 'surprised',
      responses: [
        { id: 'resp-2a', text: '즉시 원정대를 준비하라.', nextNodeId: 'node-3' },
        { id: 'resp-2b', text: '이건 신중해야 한다.', nextNodeId: 'node-3' },
      ],
    },
    {
      id: 'node-2b',
      speakerId: 'char-chen',
      text: '심연은 비점령 공간이지만, 합성체 영역과 접해 있습니다. 가치 있는 것이 있다면 벡사-7이 이미 알고 있을 겁니다. 빠르게, 그러나 신중하게 움직여야 합니다.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-3a', text: '그럼 시간을 낭비하지 말자. 원정대를 준비하라.', nextNodeId: 'node-3' },
        { id: 'resp-3b', text: '케타리는 어떤가?', nextNodeId: 'node-3' },
      ],
    },
    {
      id: 'node-3',
      speakerId: 'char-voss',
      text: '무엇을 결정하든, 외교적 파장을 고려해야 합니다. 모든 세력이 그곳의 것을 원할 겁니다. 이것이 우리를 하나로 만들 수도... 전쟁을 일으킬 수도 있습니다.',
      emotion: 'neutral',
      isEnd: true,
    },
  ],
};

export const scenes: Scene[] = [
  {
    id: 'scene-signals-briefing',
    name: '신호',
    description: '심연에서 온 신비한 신호가 주의를 요구한다.',
    locationId: 'system-sol',
    participantIds: ['char-chen', 'char-voss', 'char-kowalski'],
    dialogue: signalsBriefingDialogue,
    narrativeText:
      '태양계 정거장의 브리핑실이 침묵에 잠긴다. 홀로그래픽 디스플레이가 깜빡이며 미지의 심연 성계에서 오는 맥동하는 신호를 보여준다.',
    aiNarrative: true,
  },
  {
    id: 'scene-expedition-launch',
    name: '원정대 출발',
    description: '심연으로의 원정이 시작된다.',
    locationId: 'system-sol',
    participantIds: ['char-chen', 'char-kowalski'],
    narrativeText:
      '원정 함대가 초광속 드라이브를 가동한다. 심연으로의 여정은 분쟁 우주를 관통해야 한다.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'system-deepreach', tag: 'expedition-en-route' },
    ],
  },
  {
    id: 'scene-discovery',
    name: '대발견',
    description: '선구자 유물이 발견되다.',
    locationId: 'system-deepreach',
    participantIds: ['char-kowalski'],
    narrativeText:
      '심연의 심장부, 고대 잔해 사이에 떠 있는 유물이 알려진 물리학을 거스르는 에너지로 맥동한다.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'system-deepreach', tag: 'explored' },
    ],
  },
  {
    id: 'scene-final-convergence',
    name: '수렴',
    description: '모든 세력이 심연에서 최후의 결전을 위해 만난다.',
    locationId: 'system-deepreach',
    participantIds: ['char-chen', 'char-voss', 'char-thrax', 'char-vexa', 'char-echo'],
    narrativeText:
      '세 함대가 심연 위의 허공에 떠 있다. 유물의 빛이 강렬해진다, 마치 이 집결을 감지한 듯. 은하의 미래가 여기서 결정된다.',
    aiNarrative: true,
  },
  {
    id: 'scene-kethari-tension',
    name: '자치령의 균열',
    description: '케타리 내부 분쟁의 징후.',
    locationId: 'system-kethar',
    participantIds: ['char-thrax', 'char-zira'],
    narrativeText:
      '케타르 프라임의 작전 회의실에서, 첩보장 지라가 계산적인 눈빛으로 군주 트락스를 지켜본다.',
    aiNarrative: true,
  },
  {
    id: 'scene-zira-conspiracy',
    name: '지라의 도박',
    description: '지라가 플레이어에게 위험한 제안을 가지고 접근한다.',
    locationId: 'system-haven',
    participantIds: ['char-zira', 'char-rex'],
    narrativeText:
      '헤이븐 정거장. 비밀이 화폐이고 모든 것에 값이 매겨지는 곳. 지라가 이곳을 선택한 데는 이유가 있다.',
    aiNarrative: true,
  },
];
