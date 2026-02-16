/**
 * 스타크래프트 데모 스토리 아크 - SC1 오리지널 3에피소드 기반 메인 스토리라인.
 */

import type { StoryArc, Scene, DialogueTree } from '@event-horizon/types';

// ═══════════════════════════════════════════════════════════════
// 메인 아크: 아이어 침공 (에피소드 1~3 통합, 8 스테이지)
// ═══════════════════════════════════════════════════════════════

export const aiurInvasionArc: StoryArc = {
  id: 'arc-aiur-invasion',
  name: '아이어 침공',
  description:
    '마 사라의 저그 출현에서 시작해, 코랄의 후예의 반란, 타소니스 함락, 케리건의 감염, 그리고 아이어에서의 최후의 전투까지. 코프룰루 구역의 운명을 결정짓는 대서사시.',
  stages: [
    {
      id: 'stage-first-contact',
      name: '첫 접촉',
      description: '마 사라에서 저그가 출현한다. 프로토스 함대가 감염된 식민지를 궤도 폭격으로 정화한다.',
      advanceConditions: [{ type: 'turn-reached', turn: 2 }],
      sceneId: 'scene-first-contact',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-marsara', tag: 'zerg-detected' },
      ],
    },
    {
      id: 'stage-sons-of-korhal',
      name: '코랄의 후예',
      description: '레이너가 멩스크의 반란군 "코랄의 후예"에 합류한다. 테란 연합에 맞서는 혁명이 시작된다.',
      advanceConditions: [{ type: 'turn-reached', turn: 4 }],
      sceneId: 'scene-sons-of-korhal',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'ambition', amount: 10 },
      ],
    },
    {
      id: 'stage-antiga-liberation',
      name: '안티가 프라임 해방',
      description: '사이오닉 방출기를 처음 사용하여 안티가 프라임의 연합 수비대에 저그를 유인한다.',
      advanceConditions: [
        { type: 'tag-present', entityId: 'system-antiga', tag: 'liberated' },
      ],
      sceneId: 'scene-antiga-liberation',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-antiga', tag: 'psi-emitter-used' },
      ],
    },
    {
      id: 'stage-tarsonis-fall',
      name: '타소니스 함락',
      description: '멩스크가 사이오닉 방출기로 저그를 타소니스로 유인한다. 연합의 수도가 몰락하고 케리건이 버려진다.',
      advanceConditions: [
        { type: 'tag-present', entityId: 'system-tarsonis', tag: 'fallen' },
      ],
      failConditions: [{ type: 'turn-reached', turn: 12 }],
      sceneId: 'scene-tarsonis-betrayal',
      onEnterEffects: [
        { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
      ],
    },
    {
      id: 'stage-queen-of-blades',
      name: '칼날 여왕 탄생',
      description: '케리건이 저그에 감염되어 칼날 여왕으로 변이한다. 코프룰루 구역의 판도가 바뀐다.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-kerrigan-infested' },
      ],
      sceneId: 'scene-queen-of-blades',
    },
    {
      id: 'stage-cerebrate-hunt',
      name: '정신체 사냥',
      description: '제라툴이 정신체 자스를 암살한다. 그러나 그 과정에서 초월체에게 아이어의 위치가 노출된다.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-zeratul-cerebrate-kill' },
      ],
      sceneId: 'scene-cerebrate-hunt',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-aiur', tag: 'location-exposed' },
      ],
    },
    {
      id: 'stage-aiur-falls',
      name: '아이어 함락',
      description: '초월체가 저그 군단을 이끌고 아이어에 착륙한다. 프로토스의 고향이 불타기 시작한다.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-overmind-lands-aiur' },
      ],
      sceneId: 'scene-aiur-falls',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'system-aiur', tag: 'under-siege' },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: -30 },
      ],
    },
    {
      id: 'stage-tassadar-sacrifice',
      name: '태사다르의 희생',
      description: '태사다르가 간트리서를 초월체에 충돌시켜 파괴한다. 칼라의 빛과 공허의 에너지가 하나로 합쳐지는 최후의 순간.',
      advanceConditions: [{ type: 'turn-reached', turn: 22 }],
      sceneId: 'scene-tassadar-sacrifice',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'char-tassadar', tag: 'sacrificed' },
      ],
    },
  ],
  tags: ['main', 'invasion'],
  priority: 100,
};

// ═══════════════════════════════════════════════════════════════
// 서브 아크: 자치령의 횡포 (4 스테이지)
// ═══════════════════════════════════════════════════════════════

export const dominionTyrannyArc: StoryArc = {
  id: 'arc-dominion-tyranny',
  name: '자치령의 횡포',
  description:
    '멩스크의 야망이 낳은 자치령의 독재. 타소니스의 학살, 레이너의 결별, 그리고 새로운 압제의 시작.',
  stages: [
    {
      id: 'stage-mengsk-ambition',
      name: '멩스크의 야망',
      description: '코랄의 후예의 세력이 급격히 확장된다. 멩스크의 진정한 목적이 드러나기 시작한다.',
      advanceConditions: [{ type: 'turn-reached', turn: 5 }],
      sceneId: 'scene-mengsk-ambition',
    },
    {
      id: 'stage-tarsonis-massacre',
      name: '타소니스 학살',
      description: '사이오닉 방출기로 타소니스에 저그를 유인한다. 20억 인구가 희생되는 인류 최악의 참사.',
      advanceConditions: [
        { type: 'tag-present', entityId: 'system-tarsonis', tag: 'fallen' },
      ],
      sceneId: 'scene-tarsonis-massacre',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -15 },
      ],
    },
    {
      id: 'stage-raynor-break',
      name: '레이너의 결별',
      description: '"지옥에나 떨어져!" 레이너가 멩스크와 결별하고 독자 세력을 선언한다.',
      advanceConditions: [{ type: 'turn-reached', turn: 10 }],
      sceneId: 'scene-raynor-break',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'ambition', amount: 15 },
      ],
    },
    {
      id: 'stage-dominion-declared',
      name: '자치령 선포',
      description: '멩스크가 황제를 자처하며 테란 자치령을 선포한다. 새로운 독재의 시대가 열린다.',
      advanceConditions: [{ type: 'turn-reached', turn: 11 }],
      sceneId: 'scene-dominion-declared',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 30 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
      ],
    },
  ],
  tags: ['secondary', 'terran', 'political'],
  priority: 80,
};

// ═══════════════════════════════════════════════════════════════
// 3차 아크: 빛과 어둠의 화합 (5 스테이지)
// ═══════════════════════════════════════════════════════════════

export const templarUnityArc: StoryArc = {
  id: 'arc-templar-unity',
  name: '빛과 어둠의 화합',
  description:
    '칼라이와 암흑 기사, 오랜 분열을 겪은 프로토스 두 분파가 저그에 맞서 하나로 통합되어야 한다. 태사다르의 이단적 선택이 프로토스의 운명을 바꾼다.',
  stages: [
    {
      id: 'stage-tassadar-defiance',
      name: '태사다르의 불복',
      description: '태사다르가 의회의 정화 명령에 맞서 저그 연구를 주장한다. 알다리스는 이를 이단으로 규탄한다.',
      advanceConditions: [{ type: 'turn-reached', turn: 6 }],
      sceneId: 'scene-tassadar-defiance',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'faction-protoss', tag: 'templar-schism' },
      ],
    },
    {
      id: 'stage-zeratul-meeting',
      name: '제라툴과의 만남',
      description: '태사다르가 금기를 깨고 암흑 기사 제라툴과 접촉한다. 두 갈래의 힘을 합치는 첫걸음.',
      advanceConditions: [
        { type: 'event-fired', eventId: 'evt-dark-templar-discovery' },
      ],
      sceneId: 'scene-zeratul-meeting',
    },
    {
      id: 'stage-tassadar-arrest',
      name: '태사다르 체포',
      description: '알다리스가 태사다르를 이단 혐의로 체포한다. 프로토스가 내분으로 갈라진다.',
      advanceConditions: [{ type: 'turn-reached', turn: 18 }],
      sceneId: 'scene-tassadar-trial',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'char-tassadar', tag: 'arrested' },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: -15 },
      ],
    },
    {
      id: 'stage-prison-break',
      name: '탈옥',
      description: '피닉스(드라군), 레이너, 제라툴이 힘을 합쳐 태사다르를 구출한다.',
      advanceConditions: [{ type: 'turn-reached', turn: 19 }],
      sceneId: 'scene-prison-break',
      onEnterEffects: [
        { type: 'set-tag', entityId: 'char-tassadar', tag: 'freed' },
      ],
    },
    {
      id: 'stage-unity',
      name: '화합의 힘',
      description: '칼라의 빛과 공허의 에너지가 결합된다. 프로토스 역사상 전례 없는 힘이 탄생한다.',
      advanceConditions: [
        {
          type: 'stat-threshold',
          entityId: 'faction-protoss',
          statId: 'tech-level',
          comparison: 'gte',
          value: 10,
        },
      ],
      sceneId: 'scene-unity',
      onEnterEffects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: 50 },
      ],
    },
  ],
  tags: ['tertiary', 'protoss', 'unity'],
  priority: 60,
};

export const storyArcs: StoryArc[] = [aiurInvasionArc, dominionTyrannyArc, templarUnityArc];

// ═══════════════════════════════════════════════════════════════
// 대사 트리
// ═══════════════════════════════════════════════════════════════

// ─── 1. 저그 이동 브리핑 ───
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

// ─── 2. 타소니스 배신 대사 트리 ───
export const tarsonisBetrayalDialogue: DialogueTree = {
  id: 'dialogue-tarsonis-betrayal',
  name: '타소니스 배신',
  startNodeId: 'node-betrayal-1',
  nodes: [
    {
      id: 'node-betrayal-1',
      speakerId: 'char-mengsk',
      text: '사이오닉 방출기 가동 확인. 저그 군단이 타소니스로 접근 중. 모든 것이 계획대로다.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-b1a', text: '케리건 부대는 어떻게 됩니까?', nextNodeId: 'node-betrayal-2' },
        { id: 'resp-b1b', text: '민간인 대피는요?', nextNodeId: 'node-betrayal-2b' },
      ],
    },
    {
      id: 'node-betrayal-2',
      speakerId: 'char-mengsk',
      text: '...돌아갈 준비해.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-b2a', text: '저렇게 놔 두고 떠날 겁니까?!', nextNodeId: 'node-betrayal-3' },
      ],
    },
    {
      id: 'node-betrayal-2b',
      speakerId: 'char-mengsk',
      text: '연합의 수도에서 무슨 일이 벌어지든 그건 연합의 책임이다. 우리에겐 더 중요한 목표가 있어.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-b2b', text: '20억 인구를 그냥 내버려 둘 수는 없습니다!', nextNodeId: 'node-betrayal-3' },
      ],
    },
    {
      id: 'node-betrayal-3',
      speakerId: 'char-raynor',
      text: '케리건이 아직 거기 있다고! 우리가 보낸 거잖아! 당장 구출대를 보내야 합니다!',
      emotion: 'angry',
      responses: [
        { id: 'resp-b3a', text: '멩스크, 이건 잘못된 겁니다.', nextNodeId: 'node-betrayal-4' },
        { id: 'resp-b3b', text: '한 명을 위해 전군을 위험에 빠뜨릴 순 없다.', nextNodeId: 'node-betrayal-4b' },
      ],
    },
    {
      id: 'node-betrayal-4',
      speakerId: 'char-mengsk',
      text: '전쟁에는 희생이 따르는 법이다, 레이너. 그녀의 희생이 인류의 자유를 보장할 것이다.',
      emotion: 'neutral',
      isEnd: true,
    },
    {
      id: 'node-betrayal-4b',
      speakerId: 'char-raynor',
      text: '...당신이 어떤 인간인지 이제야 알겠군.',
      emotion: 'angry',
      isEnd: true,
    },
  ],
};

// ─── 3. 레이너-멩스크 결별 대사 트리 ───
export const raynorBreakDialogue: DialogueTree = {
  id: 'dialogue-raynor-break',
  name: '레이너의 결별',
  startNodeId: 'node-break-1',
  nodes: [
    {
      id: 'node-break-1',
      speakerId: 'char-raynor',
      text: '멩스크... 넌 연합과 똑같아. 아니, 더 나쁘지. 넌 "자유"를 팔면서 저 짓을 한 거니까.',
      emotion: 'angry',
      responses: [
        { id: 'resp-brk1a', text: '무엇을 할 셈이지?', nextNodeId: 'node-break-2' },
      ],
    },
    {
      id: 'node-break-2',
      speakerId: 'char-mengsk',
      text: '조심해라, 레이너. 적을 만들 생각이라면...',
      emotion: 'neutral',
      responses: [
        { id: 'resp-brk2a', text: '레이너의 편에 선다.', nextNodeId: 'node-break-3a' },
        { id: 'resp-brk2b', text: '멩스크의 편에 선다.', nextNodeId: 'node-break-3b' },
      ],
    },
    {
      id: 'node-break-3a',
      speakerId: 'char-raynor',
      text: '지옥에나 떨어져, 멩스크. 난 널 끌어내리겠다.',
      emotion: 'angry',
      isEnd: true,
    },
    {
      id: 'node-break-3b',
      speakerId: 'char-mengsk',
      text: '현명한 선택이다. 레이너는 이상에 눈이 멀었어. 현실에서 승리하는 건 우리 같은 사람이지.',
      emotion: 'neutral',
      isEnd: true,
    },
  ],
};

// ─── 4. 태사다르 재판 대사 트리 ───
export const tassadarTrialDialogue: DialogueTree = {
  id: 'dialogue-tassadar-trial',
  name: '태사다르 재판',
  startNodeId: 'node-trial-1',
  nodes: [
    {
      id: 'node-trial-1',
      speakerId: 'char-aldaris',
      text: '태사다르, 그대는 의회의 명령을 거역하고, 추방당한 암흑 기사와 내통한 죄로 기소되었다. 변론할 것이 있는가?',
      emotion: 'neutral',
      responses: [
        { id: 'resp-trial1a', text: '태사다르의 변론을 들어보자.', nextNodeId: 'node-trial-2a' },
        { id: 'resp-trial1b', text: '알다리스의 입장을 지지한다.', nextNodeId: 'node-trial-2b' },
      ],
    },
    {
      id: 'node-trial-2a',
      speakerId: 'char-tassadar',
      text: '동포여, 나는 아이어를 배신한 것이 아니라 수호하려 한 것이오. 칼라만으로는 저그를 막을 수 없소. 공허의 에너지... 그것이 우리의 유일한 희망이오.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-trial2a', text: '태사다르가 옳다.', nextNodeId: 'node-trial-3' },
        { id: 'resp-trial2b', text: '전통을 지켜야 한다.', nextNodeId: 'node-trial-3b' },
      ],
    },
    {
      id: 'node-trial-2b',
      speakerId: 'char-aldaris',
      text: '보시오. 이단자의 교만함을. 수천 년의 전통을 개인의 판단으로 뒤엎겠다는 것이오? 이것이야말로 아이어의 진정한 위협이오!',
      emotion: 'angry',
      responses: [
        { id: 'resp-trial2c', text: '둘 다 일리가 있다.', nextNodeId: 'node-trial-3' },
      ],
    },
    {
      id: 'node-trial-3',
      speakerId: 'char-tassadar',
      text: '저그가 아이어의 문 앞에 와 있는데, 우리끼리 싸우고 있을 때가 아니오. 진정한 적은 밖에 있소.',
      emotion: 'neutral',
      isEnd: true,
    },
    {
      id: 'node-trial-3b',
      speakerId: 'char-aldaris',
      text: '구금하라. 이 재판은 끝났다.',
      emotion: 'angry',
      isEnd: true,
    },
  ],
};

// ─── 5. 태사다르 최후 대사 트리 ───
export const tassadarSacrificeDialogue: DialogueTree = {
  id: 'dialogue-tassadar-sacrifice',
  name: '태사다르의 최후',
  startNodeId: 'node-sac-1',
  nodes: [
    {
      id: 'node-sac-1',
      speakerId: 'char-tassadar',
      text: '동포여, 이것이 유일한 길이오. 칼라의 빛과 공허의 에너지를 하나로 합쳐 초월체를 소멸시키겠소.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-sac1a', text: '다른 방법을 찾아보자.', nextNodeId: 'node-sac-2a' },
        { id: 'resp-sac1b', text: '태사다르, 엔 타로 아둔.', nextNodeId: 'node-sac-2b' },
      ],
    },
    {
      id: 'node-sac-2a',
      speakerId: 'char-zeratul',
      text: '늙은 친구여... 다른 방법이 있다면 나도 원하네. 하지만 그의 결심은 이미 굳었소.',
      emotion: 'neutral',
      responses: [
        { id: 'resp-sac2a', text: '길을 열어주자.', nextNodeId: 'node-sac-3' },
      ],
    },
    {
      id: 'node-sac-2b',
      speakerId: 'char-fenix',
      text: '태사다르! 당신의 이름은 영원히 기억될 것이오. 아이어의 전사들이여, 마지막 돌격이다!',
      emotion: 'neutral',
      responses: [
        { id: 'resp-sac2b', text: '전군 돌격!', nextNodeId: 'node-sac-3' },
      ],
    },
    {
      id: 'node-sac-3',
      speakerId: 'char-tassadar',
      text: '어둠 속의 전사들이여... 나는 칼라의 빛이며, 공허의 계승자다. 이제... 내가 미래를 만들겠다!',
      emotion: 'neutral',
      isEnd: true,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// 장면 (13개 + 기존 6개 확장)
// ═══════════════════════════════════════════════════════════════

export const scenes: Scene[] = [
  // ─── 아이어 침공 아크 장면 ───
  {
    id: 'scene-first-contact',
    name: '첫 접촉',
    description: '마 사라에서 저그가 처음 출현하고, 프로토스가 정화를 시작한다.',
    locationId: 'system-marsara',
    participantIds: ['char-raynor', 'char-mengsk'],
    dialogue: signalsBriefingDialogue,
    narrativeText:
      '마 사라의 하늘에서 불길한 그림자가 내려온다. 변경 식민지의 통신이 하나둘 끊기기 시작하고, 이윽고 프로토스 함대가 궤도에 나타나 행성 표면을 불태운다. 저그를 처리하기 위해... 인간까지 함께.',
    aiNarrative: true,
  },
  {
    id: 'scene-sons-of-korhal',
    name: '코랄의 후예',
    description: '레이너가 멩스크의 반란군에 합류한다.',
    locationId: 'system-antiga',
    participantIds: ['char-raynor', 'char-mengsk', 'char-kerrigan'],
    narrativeText:
      '"연합은 썩었소, 레이너 보안관. 우리가 새로운 질서를 만들 것이오." 멩스크의 카리스마 넘치는 연설에 레이너는 고개를 끄덕인다. 케리건이 옆에서 조용히 지켜본다.',
    aiNarrative: true,
  },
  {
    id: 'scene-antiga-liberation',
    name: '안티가 프라임 해방',
    description: '사이오닉 방출기의 첫 사용.',
    locationId: 'system-antiga',
    participantIds: ['char-raynor', 'char-kerrigan', 'char-mengsk'],
    narrativeText:
      '사이오닉 방출기가 활성화되자, 연합군 기지 주변에 저그가 몰려든다. 방출기의 위력에 케리건은 불안한 표정을 짓지만, 멩스크는 만족스러운 미소를 감추지 않는다.',
    aiNarrative: true,
    onStartEffects: [
      { type: 'set-tag', entityId: 'system-antiga', tag: 'liberated' },
    ],
  },
  {
    id: 'scene-tarsonis-betrayal',
    name: '타소니스 배신',
    description: '멩스크의 계략으로 타소니스가 저그에게 함락되고 케리건이 버려진다.',
    locationId: 'system-tarsonis',
    participantIds: ['char-mengsk', 'char-kerrigan', 'char-raynor'],
    dialogue: tarsonisBetrayalDialogue,
    narrativeText:
      '사이오닉 방출기가 활성화되자, 수억의 저그가 타소니스로 쏟아져 들어온다. 하늘이 뮤탈리스크로 뒤덮이고, 연합의 수도는 지옥으로 변한다. 그리고 멩스크의 입에서 냉혹한 명령이 떨어진다. "돌아갈 준비해."',
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
    id: 'scene-cerebrate-hunt',
    name: '정신체 사냥',
    description: '제라툴이 정신체 자스를 암살하지만, 초월체에 아이어의 위치가 노출된다.',
    locationId: 'system-char',
    participantIds: ['char-zeratul', 'char-tassadar', 'char-overmind'],
    narrativeText:
      '제라툴의 공허의 칼날이 정신체 자스를 관통한다. 영원히 죽일 수 있는 유일한 방법. 그러나 그 순간, 초월체의 정신과 접촉이 이루어진다. "아이어... 찾았다." 제라툴은 자신이 무슨 짓을 했는지 깨닫고 절규한다.',
    aiNarrative: true,
  },
  {
    id: 'scene-aiur-falls',
    name: '아이어 함락',
    description: '초월체가 아이어에 착륙한다.',
    locationId: 'system-aiur',
    participantIds: ['char-tassadar', 'char-fenix', 'char-aldaris', 'char-artanis', 'char-overmind'],
    narrativeText:
      '아이어의 하늘이 검게 물든다. 수십억의 저그가 행성 표면에 쏟아지고, 초월체의 거대한 형체가 아이어의 대지에 뿌리를 내린다. 수천 년의 역사를 가진 프로토스의 고향이 불타기 시작한다.',
    aiNarrative: true,
  },
  {
    id: 'scene-tassadar-sacrifice',
    name: '태사다르의 희생',
    description: '태사다르가 간트리서를 초월체에 충돌시켜 파괴한다.',
    locationId: 'system-aiur',
    participantIds: ['char-tassadar', 'char-zeratul', 'char-fenix', 'char-raynor', 'char-overmind'],
    dialogue: tassadarSacrificeDialogue,
    narrativeText:
      '아이어의 하늘이 저그의 포자로 뒤덮였다. 태사다르는 간트리서의 함교에 홀로 서서 초월체를 내려다본다. 칼라의 빛과 공허의 에너지가 그의 손에서 하나로 합쳐진다. "나는 태사다르, 칼라의 구원자이자 공허의 계승자다!" 간트리서가 초월체를 향해 돌진한다.',
    aiNarrative: true,
  },

  // ─── 자치령 횡포 아크 장면 ───
  {
    id: 'scene-mengsk-ambition',
    name: '멩스크의 야망',
    description: '코랄의 후예의 세력이 급팽창한다.',
    locationId: 'system-korhal',
    participantIds: ['char-mengsk', 'char-duke'],
    narrativeText:
      '코르할의 전략 회의실. 멩스크가 거대한 홀로그램 성계 지도 앞에 서 있다. "연합은 죽어가고 있소, 듀크 장군. 우리가 그 자리를 차지할 때가 왔소." 듀크가 경례한다.',
    aiNarrative: true,
  },
  {
    id: 'scene-tarsonis-massacre',
    name: '타소니스 대학살',
    description: '사이오닉 방출기로 타소니스 20억 인구가 희생된다.',
    locationId: 'system-tarsonis',
    participantIds: ['char-mengsk', 'char-raynor'],
    narrativeText:
      '타소니스 궤도에서 바라본 행성 표면은 저그의 점막으로 뒤덮여 가고 있다. 도시들이 하나둘 불꽃 속에 사라진다. 20억의 비명이 우주의 적막 속에 흡수된다. 멩스크의 얼굴에는 어떤 감정도 없다.',
    aiNarrative: true,
  },
  {
    id: 'scene-raynor-break',
    name: '레이너의 결별',
    description: '레이너가 멩스크와 결별한다.',
    locationId: 'system-korhal',
    participantIds: ['char-raynor', 'char-mengsk'],
    dialogue: raynorBreakDialogue,
    narrativeText:
      '"난 널 끌어내리겠다, 멩스크." 레이너의 선언이 모든 주파수로 방송된다. 히페리온이 코르할 궤도를 이탈하며 자치령 깃발을 내린다. "지옥에나 떨어져!"',
    aiNarrative: true,
  },
  {
    id: 'scene-dominion-declared',
    name: '자치령 선포',
    description: '멩스크가 테란 자치령의 황제를 선포한다.',
    locationId: 'system-korhal',
    participantIds: ['char-mengsk', 'char-duke'],
    narrativeText:
      '코르할 궁전의 대관식장. UNN 카메라가 실시간으로 중계하는 가운데, 멩스크가 황제의 관을 쓴다. "오늘부터 테란 자치령이 코프룰루 구역의 질서를 책임진다." 군중의 환호 속에 새로운 독재의 시대가 열린다.',
    aiNarrative: true,
  },

  // ─── 빛과 어둠의 화합 아크 장면 ───
  {
    id: 'scene-tassadar-defiance',
    name: '태사다르의 불복',
    description: '태사다르가 의회의 정화 명령에 이의를 제기한다.',
    locationId: 'system-aiur',
    participantIds: ['char-tassadar', 'char-aldaris'],
    narrativeText:
      '프로토스 의회당. 알다리스가 새로운 정화 명령을 선포하자, 태사다르가 일어선다. "저 행성에는 아직 살아있는 테란이 있소! 무고한 이들을 학살하는 것은 칼라의 길이 아니오!" 의회가 술렁인다.',
    aiNarrative: true,
  },
  {
    id: 'scene-zeratul-meeting',
    name: '제라툴과의 만남',
    description: '태사다르가 금기를 깨고 암흑 기사 제라툴과 접촉한다.',
    locationId: 'system-shakuras',
    participantIds: ['char-tassadar', 'char-zeratul'],
    narrativeText:
      '샤쿠라스의 어둠 속에서 두 프로토스가 마주한다. 수천 년간 금지된 만남. "어둠 속의 형제여, 나는 태사다르. 당신의 지혜가 필요하오." 제라툴의 눈에서 오랫동안 잊혔던 빛이 깜박인다.',
    aiNarrative: true,
  },
  {
    id: 'scene-tassadar-trial',
    name: '태사다르 재판',
    description: '알다리스가 태사다르를 이단 혐의로 재판한다.',
    locationId: 'system-aiur',
    participantIds: ['char-tassadar', 'char-aldaris', 'char-artanis'],
    dialogue: tassadarTrialDialogue,
    narrativeText:
      '프로토스 의회의 재판정. 태사다르가 에너지 속박에 묶여 중앙에 서 있다. 알다리스가 죄상을 낭독하고, 의원들이 엄숙한 표정으로 지켜본다. 아르타니스는 주먹을 움켜쥔다.',
    aiNarrative: true,
  },
  {
    id: 'scene-prison-break',
    name: '탈옥',
    description: '피닉스, 레이너, 제라툴이 태사다르를 구출한다.',
    locationId: 'system-aiur',
    participantIds: ['char-fenix', 'char-raynor', 'char-zeratul', 'char-tassadar'],
    narrativeText:
      '피닉스의 드라군이 감옥 벽을 부수고, 레이너의 해병대가 경비를 제압하고, 제라툴이 에너지 속박을 공허의 힘으로 끊어낸다. "가자, 태사다르. 아이어에는 당신이 필요하오." 프로토스와 테란의 연합 탈옥 작전이 성공한다.',
    aiNarrative: true,
  },
  {
    id: 'scene-unity',
    name: '화합의 힘',
    description: '칼라와 공허의 에너지가 하나로 합쳐진다.',
    locationId: 'system-aiur',
    participantIds: ['char-tassadar', 'char-zeratul', 'char-artanis'],
    narrativeText:
      '태사다르와 제라툴이 마주 서서 손을 내민다. 칼라의 황금빛 에너지와 공허의 자색 에너지가 서로를 향해 흐른다. 두 힘이 하나로 합쳐지는 순간, 아이어의 하늘이 눈부시게 빛난다. 프로토스의 새로운 시대가 열린다.',
    aiNarrative: true,
  },
];
