/**
 * 스타크래프트 데모 이벤트 - 군사 및 분쟁 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const borderIncursion: GameEvent = {
  id: 'evt-border-incursion',
  name: '저그 침공 물결',
  description:
    '저그 군단이 변경 성계에 대규모 침공을 개시했다. 수천의 저글링과 히드라리스크가 방어선을 밀어붙이고 있다.',
  triggers: [
    {
      type: 'stat-threshold',
      entityId: 'faction-zerg',
      statId: 'military-power',
      comparison: 'gte',
      value: 150,
    },
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      sourceId: 'faction-terran',
      targetId: 'faction-zerg',
      comparison: 'lt',
      value: 0,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-antiga', statId: 'defense-level', amount: -10 },
  ],
  choices: [
    {
      id: 'incursion-confront',
      text: '전면 방어전 개시',
      description: '모든 가용 병력을 투입하여 저그를 저지한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-zerg', amount: -15 },
        { type: 'modify-stat', entityId: 'system-antiga', statId: 'defense-level', amount: 20 },
      ],
      resultText: '치열한 교전 끝에 저그의 첫 번째 파도를 막아냈다. 하지만 더 많은 물결이 밀려오고 있다.',
    },
    {
      id: 'incursion-observe',
      text: '전략적 후퇴',
      description: '방어가 불가능한 전초기지를 포기하고 주요 거점을 사수한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '변경 전초기지를 포기하고 방어선을 재편했다. 버려진 기지는 순식간에 저그 점막으로 뒤덮였다.',
    },
    {
      id: 'incursion-diplomacy',
      text: '프로토스에 공동 방어 요청',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '프로토스가 제한적 지원을 보내왔다. 공동의 적 앞에서 미약하나마 협력의 싹이 트였다.',
    },
  ],
  cooldown: 4,
  maxOccurrences: 5,
  priority: 85,
  tags: ['military', 'zerg', 'invasion'],
};

export const pirateRaid: GameEvent = {
  id: 'evt-pirate-raid',
  name: '해적 보급선 습격',
  description: '켈모리안 조합 소속 해적들이 마 사라 인근 보급 호송대를 공격했다.',
  triggers: [
    { type: 'random-chance', chance: 0.15 },
    { type: 'turn-reached', turn: 2 },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-marsara', statId: 'resources', amount: -30 },
  ],
  choices: [
    {
      id: 'pirate-hunt',
      text: '레이스 편대로 해적 소탕',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-marsara', statId: 'defense-level', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '레이스 전투기들이 해적선을 궤멸시켰다. 보급로가 다시 안전해졌다.',
    },
    {
      id: 'pirate-negotiate',
      text: '해적을 용병으로 고용',
      description: '자금을 주고 우리 편으로 만든다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '해적들이 크레딧에 매수되었다. 이제 우리 눈과 귀가 되어줄 것이다... 더 높은 값을 부르기 전까지는.',
    },
    {
      id: 'pirate-ignore',
      text: '무시하고 다른 보급로 확보',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: '해적 활동이 점점 대담해지고 있다. 변경 식민지들의 불만이 커진다.',
    },
  ],
  cooldown: 3,
  priority: 40,
  tags: ['military', 'pirate', 'supply'],
};

export const fleetMutiny: GameEvent = {
  id: 'evt-fleet-mutiny',
  name: '반란군 봉기',
  description: '자치령의 압제에 반발한 식민지 민병대가 레이너 특공대에 합류를 선언했다.',
  triggers: [
    {
      type: 'stat-threshold',
      entityTag: 'fleet',
      statId: 'fleet-morale',
      comparison: 'lt',
      value: 30,
    },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -20 },
  ],
  choices: [
    {
      id: 'mutiny-negotiate',
      text: '반란군과 대화',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: -5 },
      ],
      resultText: '일부 민병대의 요구를 수용했다. 사기가 회복되었지만 자치령의 권위가 흔들린다.',
    },
    {
      id: 'mutiny-crush',
      text: '무력 진압',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -30 },
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 10 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '반란이 무력으로 진압되었다. 공포로 질서를 되찾았지만, 레이너 특공대에 더 많은 이들이 합류할 것이다.',
    },
  ],
  cooldown: 6,
  maxOccurrences: 2,
  priority: 75,
  tags: ['military', 'internal', 'rebellion'],
};

export const armsRace: GameEvent = {
  id: 'evt-arms-race',
  name: '군비 경쟁 격화',
  description: '세 종족 모두 전례 없는 규모로 병력을 증강하고 있다. 전면전이 임박했다.',
  triggers: [
    { type: 'turn-reached', turn: 9 },
    { type: 'stat-threshold', entityId: 'faction-zerg', statId: 'military-power', comparison: 'gte', value: 200 },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
  ],
  choices: [
    {
      id: 'arms-join',
      text: '전쟁 경제 체제 돌입',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 40 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -30 },
      ],
      resultText: '모든 자원을 군수 생산에 투입했다. 전쟁준비태세 1호.',
    },
    {
      id: 'arms-disarm',
      text: '다종족 평화 회담 제안',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '저그는 무시했고 프로토스는 회의적이다. 하지만 제안 자체가 상징적 의미를 가진다.',
    },
    {
      id: 'arms-tech',
      text: '전투순양함 야마토 포 업그레이드에 집중',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -20 },
      ],
      resultText: '야마토 포의 위력이 30% 향상되었다. 양보다 질로 승부한다.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 1,
  priority: 90,
  tags: ['military', 'global'],
};

export const kerriganInfested: GameEvent = {
  id: 'evt-kerrigan-infested',
  name: '칼날 여왕의 탄생',
  description:
    '타소니스에서 저그에게 버려진 케리건이 초월체에 의해 감염되었다. 번데기 안에서 새로운 존재로 변이하고 있다.',
  triggers: [
    { type: 'tag-present', entityId: 'system-tarsonis', tag: 'fallen' },
    { type: 'turn-reached', turn: 12 },
  ],
  effects: [
    { type: 'set-tag', entityId: 'char-kerrigan', tag: 'infested' },
    { type: 'modify-stat', entityId: 'faction-zerg', statId: 'military-power', amount: 40 },
  ],
  choices: [
    {
      id: 'kerrigan-rescue',
      text: '케리건 구출 작전 시도',
      description: '차 행성에 특수부대를 투입하여 케리건을 구출한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -25 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-zerg', amount: -20 },
      ],
      resultText: '차 행성 깊숙이 침투했으나 이미 때는 늦었다. 번데기는 비어 있었고, 칼날 여왕이 어둠 속에서 미소짓고 있었다.',
    },
    {
      id: 'kerrigan-mourn',
      text: '케리건의 죽음을 애도하고 방어에 집중',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
      ],
      resultText: '레이너가 주먹을 움켜쥔다. "넌 아직 살아있다, 사라... 반드시 돌아오게 할 거야." 복수의 불꽃이 타오른다.',
    },
  ],
  maxOccurrences: 1,
  priority: 95,
  tags: ['military', 'zerg', 'kerrigan', 'major'],
};

export const fenixFalls: GameEvent = {
  id: 'evt-fenix-falls',
  name: '피닉스의 전사와 귀환',
  description:
    '안티오크 전투에서 저그의 기습을 받은 피닉스가 치명상을 입는다. 그러나 드라군에 이식되어 전장에 복귀한다.',
  triggers: [
    { type: 'turn-reached', turn: 13 },
    { type: 'stat-threshold', entityId: 'faction-zerg', statId: 'military-power', comparison: 'gte', value: 180 },
  ],
  effects: [
    { type: 'set-tag', entityId: 'char-fenix', tag: 'dragoon' },
    { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: -15 },
  ],
  choices: [
    {
      id: 'fenix-honor',
      text: '피닉스의 드라군 복귀를 축하',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: 20 },
      ],
      resultText: '"죽음조차 나를 막지 못했다!" 드라군 형태의 피닉스가 전장에 복귀하자 프로토스 전사들의 사기가 치솟는다.',
    },
    {
      id: 'fenix-retreat',
      text: '전선을 축소하고 피닉스를 후방에 배치',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: 5 },
      ],
      resultText: '피닉스는 분해하지만, 회복기간이 필요하다는 의회의 결정에 따른다.',
    },
  ],
  maxOccurrences: 1,
  priority: 80,
  tags: ['military', 'protoss', 'fenix'],
};

export const overmindLandsAiur: GameEvent = {
  id: 'evt-overmind-lands-aiur',
  name: '초월체의 아이어 착륙',
  description:
    '초월체가 수십억의 저그 군단과 함께 아이어에 착륙한다. 프로토스의 고향이 불타기 시작한다.',
  triggers: [
    { type: 'tag-present', entityId: 'system-aiur', tag: 'location-exposed' },
    { type: 'turn-reached', turn: 17 },
  ],
  effects: [
    { type: 'set-tag', entityId: 'system-aiur', tag: 'under-siege' },
    { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: -25 },
    { type: 'modify-stat', entityId: 'system-aiur', statId: 'defense-level', amount: -40 },
  ],
  choices: [
    {
      id: 'aiur-defend',
      text: '아이어 총력 방어',
      description: '모든 프로토스 병력을 아이어 방어에 투입한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: -30 },
        { type: 'modify-stat', entityId: 'system-aiur', statId: 'defense-level', amount: 25 },
      ],
      resultText: '프로토스 전사들이 결사적으로 저항하지만, 저그의 물량 앞에 전선이 서서히 밀리고 있다.',
    },
    {
      id: 'aiur-evacuate',
      text: '샤쿠라스로 대피 준비',
      description: '아이어를 포기하고 민간인을 샤쿠라스로 대피시킨다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: -10 },
        { type: 'modify-stat', entityId: 'system-shakuras', statId: 'population', amount: 2000 },
      ],
      resultText: '차원 관문을 통해 대피가 시작된다. 아이어의 하늘 아래 마지막 순간들이 흘러간다.',
    },
    {
      id: 'aiur-alliance',
      text: '테란에 공동 방어 요청',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-protoss', targetId: 'faction-terran', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: 15 },
      ],
      resultText: '레이너 특공대가 지원군을 보냈다. 종족을 초월한 동맹이 저그에 맞선다.',
    },
  ],
  maxOccurrences: 1,
  priority: 100,
  tags: ['military', 'zerg', 'protoss', 'major', 'invasion'],
};

export const dukeDefection: GameEvent = {
  id: 'evt-duke-defection',
  name: '듀크 장군 포섭',
  description:
    '안티가 프라임에서 듀크 장군의 기함 노라드 II가 저그에 의해 격추되었다. 코랄의 후예가 듀크를 구출하면 연합에서 전향시킬 수 있다.',
  triggers: [
    { type: 'turn-reached', turn: 6 },
    { type: 'tag-present', entityId: 'system-antiga', tag: 'psi-emitter-used' },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 20 },
  ],
  choices: [
    {
      id: 'duke-rescue',
      text: '듀크를 구출하고 합류를 제안',
      description: '노라드 II의 잔해에서 듀크를 구출하여 코랄의 후예에 합류시킨다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '듀크가 코랄의 후예에 합류했다. "연합은 날 버렸어. 멩스크, 당신 밑에서 일하겠소." 알파 전대의 화력이 더해졌다.',
    },
    {
      id: 'duke-conditions',
      text: '구출 조건으로 정보 제공을 요구',
      description: '연합의 기밀 정보를 대가로 구출을 제안한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
      ],
      resultText: '듀크가 연합의 극비 군사 기지 위치를 넘겼다. "이 정도면 됐겠지? 이제 날 꺼내줘."',
    },
  ],
  maxOccurrences: 1,
  priority: 85,
  tags: ['military', 'terran', 'duke', 'defection'],
};

export const newGettysburg: GameEvent = {
  id: 'evt-new-gettysburg',
  name: '뉴 게티스버그 전투',
  description:
    '케리건이 뉴 게티스버그에서 저그의 공세를 방어하는 임무를 수행 중이다. 멩스크가 전군 철수를 명령하고, 케리건은 저그에게 둘러싸인다.',
  triggers: [
    { type: 'tag-present', entityId: 'system-tarsonis', tag: 'fallen' },
    { type: 'turn-reached', turn: 10 },
  ],
  effects: [
    { type: 'set-tag', entityId: 'char-kerrigan', tag: 'abandoned' },
    { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
  ],
  choices: [
    {
      id: 'gettysburg-rescue',
      text: '케리건 구출 시도',
      description: '멩스크의 명령을 어기고 케리건을 구출하러 간다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -20 },
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'loyalty', amount: -15 },
      ],
      resultText: '구출 시도는 실패했다. 너무 많은 저그가 몰려들어 접근조차 불가능했다. 레이너의 분노가 하늘을 찌른다.',
    },
    {
      id: 'gettysburg-obey',
      text: '철수 명령에 순응',
      description: '멩스크의 명령에 따라 전군 철수한다.',
      effects: [
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'loyalty', amount: -25 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -5 },
      ],
      resultText: '"케리건! 케리건!!" 레이너의 절규가 통신 채널에 울려 퍼진다. 함대는 이미 워프 점프를 시작했다.',
    },
  ],
  maxOccurrences: 1,
  priority: 92,
  tags: ['military', 'terran', 'kerrigan', 'betrayal', 'major'],
};

export const militaryEvents: GameEvent[] = [borderIncursion, pirateRaid, fleetMutiny, armsRace, kerriganInfested, fenixFalls, overmindLandsAiur, dukeDefection, newGettysburg];
