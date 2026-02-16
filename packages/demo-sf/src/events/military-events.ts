/**
 * 스타크래프트 데모 이벤트 - 군사 및 분쟁 이벤트.
 * 선택지는 마 사라 민병대 대장(플레이어)의 시점에서 개인/소부대 단위 행동으로 구성.
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
      text: '민병대를 이끌고 방어선 합류',
      description: '직접 분대를 이끌고 전선에 합류하여 저그를 저지한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-zerg', amount: -15 },
        { type: 'modify-stat', entityId: 'system-antiga', statId: 'defense-level', amount: 20 },
      ],
      resultText: '치열한 교전 끝에 저그의 첫 번째 파도를 막아냈다. 민병대원들의 사기가 높다. 하지만 더 많은 물결이 밀려오고 있다.',
    },
    {
      id: 'incursion-observe',
      text: '주민 대피 호위',
      description: '전투보다 주민들의 안전을 우선시하여 대피를 호위한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '주민들을 안전지대로 대피시켰다. 전초기지는 포기했지만 사람들은 살렸다.',
    },
    {
      id: 'incursion-diplomacy',
      text: '정찰대를 이끌고 적정 파악',
      description: '소규모 정찰대로 저그의 이동 경로와 규모를 파악한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '정찰 결과 저그의 이동 경로와 규모를 상세히 파악했다. 이 정보가 상부에 전달되어 프로토스와의 공조에도 도움이 되었다.',
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
      text: '보안관에게 보고하고 민병대 출동',
      description: '레이너 보안관에게 즉시 보고하고 민병대를 이끌고 출동한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-marsara', statId: 'defense-level', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '민병대의 신속한 대응으로 해적들을 격퇴했다. 보급로가 다시 안전해졌다.',
    },
    {
      id: 'pirate-negotiate',
      text: '직접 호송대 호위',
      description: '민병대를 이끌고 다음 호송대를 직접 호위한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '호송대를 무사히 호위했다. 해적들은 무장 호위를 보고 물러났지만, 다음에 또 노릴 것이다.',
    },
    {
      id: 'pirate-ignore',
      text: '해적과 접선 시도',
      description: '은밀히 해적 두목과 접선하여 정보를 얻는다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: '해적 두목과 접선에 성공했다. 위험한 줄타기지만 변경 지역의 정보망을 확보했다.',
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
      text: '반란에 동조하여 레이너 편에 선다',
      description: '자치령의 횡포에 맞서 레이너의 대의에 동참한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: -5 },
      ],
      resultText: '레이너 편에 섰다. 동료 민병대원들의 사기가 올랐지만, 자치령의 눈 밖에 나게 되었다.',
    },
    {
      id: 'mutiny-crush',
      text: '동료를 설득하여 상황 진정',
      description: '양쪽 모두와 대화하여 폭력 없이 상황을 수습한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -30 },
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 10 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '동료들을 설득하여 최악의 충돌은 피했다. 하지만 불만의 씨앗은 여전히 남아 있다.',
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
      text: '징집에 응해 전선 배치',
      description: '민병대와 함께 정규군 징집에 응하여 전선에 배치된다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 40 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -30 },
      ],
      resultText: '민병대가 정규군에 편입되었다. 전쟁준비태세 1호. 고향을 떠나 전선으로 향한다.',
    },
    {
      id: 'arms-disarm',
      text: '민병대 장비 업그레이드 요청',
      description: '전면전에 대비하여 민병대의 장비 개선을 상부에 건의한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '상부가 민병대 장비 업그레이드를 승인했다. 더 나은 장비로 고향을 지킬 수 있게 되었다.',
    },
    {
      id: 'arms-tech',
      text: '전쟁 반대 목소리',
      description: '무모한 군비 경쟁에 반대하는 목소리를 낸다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -20 },
      ],
      resultText: '전쟁 반대 목소리는 소수에 그쳤지만, 일부 동조자를 얻었다. 대신 방어 기술 연구에 자원이 투입되었다.',
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
      text: '자원봉사 구출대 합류',
      description: '차 행성으로 향하는 자원봉사 구출대에 합류한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -25 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-zerg', amount: -20 },
      ],
      resultText: '차 행성 깊숙이 침투했으나 이미 때는 늦었다. 번데기는 비어 있었고, 칼날 여왕이 어둠 속에서 미소짓고 있었다. 간신히 살아 돌아왔다.',
    },
    {
      id: 'kerrigan-mourn',
      text: '우리 영토 방어에 집중',
      description: '케리건의 운명은 슬프지만, 지금은 우리 영토를 지키는 것이 우선이다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
      ],
      resultText: '주먹을 움켜쥐며 방어 진지를 강화했다. 케리건을 위해 할 수 있는 건 없지만, 남은 사람들은 지킬 수 있다.',
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
      text: '프로토스 전사의 부활 소식에 경외',
      description: '죽음을 극복한 프로토스 전사의 이야기에 경의를 표한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: 20 },
      ],
      resultText: '"죽음조차 나를 막지 못했다!" 드라군 형태의 피닉스가 전장에 복귀했다는 소식이 전해진다. 프로토스의 불굴의 의지에 경외감을 느낀다.',
    },
    {
      id: 'fenix-retreat',
      text: '전선 합류 자원',
      description: '프로토스와의 공동 전선에 자원하여 합류한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: 5 },
      ],
      resultText: '프로토스 전선 인근에 민병대를 배치하여 측면을 지원했다. 종족이 다르지만 함께 싸우는 전우의식이 싹트고 있다.',
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
      text: '레이너를 따라 프로토스 지원',
      description: '레이너 특공대를 따라 프로토스 지원에 나선다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: -30 },
        { type: 'modify-stat', entityId: 'system-aiur', statId: 'defense-level', amount: 25 },
      ],
      resultText: '레이너를 따라 아이어에 도착했다. 프로토스 전사들과 어깨를 나란히 하고 저그에 맞선다. 종족을 초월한 전우애가 피어난다.',
    },
    {
      id: 'aiur-evacuate',
      text: '동료들과 테란 영토 수비',
      description: '프로토스 전쟁에 개입하지 않고 테란 영토를 지킨다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: -10 },
        { type: 'modify-stat', entityId: 'system-shakuras', statId: 'population', amount: 2000 },
      ],
      resultText: '동료들과 함께 테란 변경 식민지 방어를 강화했다. 아이어의 불길이 하늘을 물들이는 것이 멀리서도 보인다.',
    },
    {
      id: 'aiur-alliance',
      text: '대피선 확보에 나섬',
      description: '테란과 프로토스 민간인을 위한 대피선을 확보한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-protoss', targetId: 'faction-terran', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: 15 },
      ],
      resultText: '대피선을 확보하여 프로토스 피난민과 테란 민간인 수송을 도왔다. 이 행동이 양 종족 간의 신뢰를 쌓는 데 기여했다.',
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
      text: '구출 작전에 분대 이끌고 참전',
      description: '민병대 분대를 이끌고 듀크 구출 작전에 참전한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '저그 한가운데에서 듀크를 구출하는 데 성공했다. "연합은 날 버렸어. 멩스크, 당신 밑에서 일하겠소." 듀크가 코랄의 후예에 합류했다.',
    },
    {
      id: 'duke-conditions',
      text: '듀크의 통신 장비에서 정보 추출',
      description: '구출 과정에서 노라드 II의 통신 장비로부터 기밀 정보를 확보한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
      ],
      resultText: '노라드 II의 잔해에서 연합의 극비 군사 기지 위치 데이터를 추출했다. 귀중한 정보가 코랄의 후예에 전달되었다.',
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
      text: '독자적으로 구출대 조직 시도',
      description: '멩스크의 명령을 어기고 독자적으로 케리건 구출대를 조직한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -20 },
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'loyalty', amount: -15 },
      ],
      resultText: '몇몇 뜻을 같이하는 동료들과 구출을 시도했지만, 너무 많은 저그가 몰려들어 접근조차 불가능했다. 분한 마음으로 후퇴할 수밖에 없었다.',
    },
    {
      id: 'gettysburg-obey',
      text: '명령에 따라 철수, 주먹을 움켜쥠',
      description: '분하지만 명령에 따라 철수한다.',
      effects: [
        { type: 'modify-stat', entityId: 'char-raynor', statId: 'loyalty', amount: -25 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -5 },
      ],
      resultText: '주먹을 움켜쥐며 철수 명령에 따랐다. 통신 채널에서 들려오는 레이너의 절규가 귓전에 맴돈다. "케리건! 케리건!!"',
    },
  ],
  maxOccurrences: 1,
  priority: 92,
  tags: ['military', 'terran', 'kerrigan', 'betrayal', 'major'],
};

export const militaryEvents: GameEvent[] = [borderIncursion, pirateRaid, fleetMutiny, armsRace, kerriganInfested, fenixFalls, overmindLandsAiur, dukeDefection, newGettysburg];
