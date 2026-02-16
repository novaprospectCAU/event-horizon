/**
 * 스타크래프트 데모 이벤트 - 외교 및 정치 이벤트.
 * 선택지는 마 사라 민병대 대장(플레이어)의 시점에서 개인/소부대 단위 행동으로 구성.
 */

import type { GameEvent } from '@event-horizon/types';

export const diplomaticCrisis: GameEvent = {
  id: 'evt-diplomatic-crisis',
  name: '프로토스-테란 갈등',
  description:
    '프로토스가 저그 감염 행성을 정화하기 위해 테란 식민지까지 궤도 폭격하겠다고 선언했다. 테란과의 긴장이 극에 달한다.',
  triggers: [
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      comparison: 'lt',
      value: -50,
    },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -10 },
  ],
  choices: [
    {
      id: 'crisis-negotiate',
      text: '태사다르에게 비밀 접선 시도',
      description: '프로토스 온건파인 태사다르에게 은밀히 접선을 시도한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 15 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: 10 },
      ],
      resultText: '위험을 무릅쓰고 태사다르와 접선에 성공했다. 그가 의회를 설득하여 정화 작전을 일시 중단시켰다.',
    },
    {
      id: 'crisis-threaten',
      text: '방어 진지 구축 지휘',
      description: '프로토스의 궤도 폭격에 대비하여 방어 진지를 구축한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'military-power', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '민병대를 이끌고 방어 진지를 구축했다. 프로토스는 테란의 결의를 확인했지만 관계는 더 악화되었다.',
    },
    {
      id: 'crisis-ignore',
      text: '주민 대피 작전 수행',
      description: '충돌을 피하고 식민지 주민 대피에 집중한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '주민 대피를 성공적으로 수행했다. 식민지는 잿더미가 되었지만, 사람들은 살렸다.',
    },
  ],
  cooldown: 5,
  maxOccurrences: 3,
  priority: 80,
  tags: ['diplomatic', 'crisis'],
};

export const tradeAgreement: GameEvent = {
  id: 'evt-trade-agreement',
  name: '자원 공유 협정 기회',
  description:
    '변경 행성의 광산 조합이 세력을 초월한 자원 공유 협정을 제안했다.',
  triggers: [
    { type: 'turn-reached', turn: 3 },
    {
      type: 'relation-threshold',
      relationTypeId: 'trade',
      comparison: 'gte',
      value: 20,
    },
  ],
  effects: [],
  choices: [
    {
      id: 'trade-accept',
      text: '보급 호송 임무에 자원',
      description: '자원 공유 협정의 보급 호송 임무에 민병대를 투입한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'trade', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: '보급 호송을 성공적으로 완수했다. 미네랄과 베스핀 가스가 안정적으로 흘러든다.',
    },
    {
      id: 'trade-counter',
      text: '더 나은 조건 탐색에 나섬',
      description: '다른 광산 조합들과도 접촉하여 더 나은 조건을 찾아본다.',
      conditions: [
        { type: 'stat-threshold', entityTag: 'terran', statId: 'influence', comparison: 'gte', value: 40 },
      ],
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 50 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: -5 },
      ],
      resultText: '여러 조합과 접촉한 결과 더 유리한 조건을 확보했다. 발품을 판 보람이 있다.',
    },
    {
      id: 'trade-reject',
      text: '독자 보급로 개척 시도',
      description: '기존 협정에 의존하지 않고 독자적인 보급 경로를 개척한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '독자 보급로를 개척하는 데 성공했다. 보급은 부족하지만 누구에게도 빚지지 않았다.',
    },
  ],
  cooldown: 8,
  priority: 50,
  tags: ['trade', 'economy'],
};

export const allianceProposal: GameEvent = {
  id: 'evt-alliance-proposal',
  name: '대저그 동맹 제안',
  description: '저그의 위협이 커지자, 한 세력이 공동 대응을 위한 정식 동맹을 제안한다.',
  triggers: [
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      comparison: 'gte',
      value: 40,
    },
    {
      type: 'stat-threshold',
      entityTag: 'zerg',
      statId: 'military-power',
      comparison: 'gte',
      value: 180,
    },
  ],
  effects: [],
  choices: [
    {
      id: 'alliance-accept',
      text: '동맹 협상에 호위로 참석',
      description: '동맹 협상에 호위 임무로 참석하여 협상을 지원한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 30 },
        { type: 'set-tag', entityTag: 'terran', tag: 'allied' },
      ],
      resultText: '동맹 협상에 호위로 참석했다. 종족을 초월한 동맹이 결성되는 역사적 순간을 목격했다.',
    },
    {
      id: 'alliance-decline',
      text: '독자 노선 주장',
      description: '동맹보다 독자적인 방어가 더 현실적이라고 주장한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '독자 노선을 주장했다. 동맹 없이도 우리 영토는 우리가 지킬 수 있다고 믿는다.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 2,
  priority: 70,
  tags: ['diplomatic', 'alliance'],
};

export const protossPurification: GameEvent = {
  id: 'evt-protoss-purification',
  name: '프로토스의 정화',
  description:
    '프로토스 함대가 저그에 감염된 마 사라 식민지를 궤도에서 폭격하여 정화한다. 무고한 테란 시민들이 희생된다.',
  triggers: [
    { type: 'turn-reached', turn: 3 },
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      sourceId: 'faction-protoss',
      targetId: 'faction-terran',
      comparison: 'lt',
      value: 0,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-marsara', statId: 'population', amount: -500 },
    { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: -20 },
  ],
  choices: [
    {
      id: 'purify-protest',
      text: '주민 구출에 돌입',
      description: '폭격이 시작되기 전에 최대한 많은 주민을 구출한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '불길 속에서 수십 명의 주민을 구출했다. 온몸이 그을렸지만, 살린 생명들의 눈빛이 모든 것을 보상했다.',
    },
    {
      id: 'purify-understand',
      text: '프로토스 사절 접촉 시도',
      description: '프로토스 함대에 접촉하여 정화의 이유를 묻고 대안을 제시한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -5 },
      ],
      resultText: '태사다르가 답한다. "우리도 원치 않았소. 하지만 저그의 확산을 막으려면..." 쓰라린 현실이지만, 대화의 물꼬가 트였다.',
    },
    {
      id: 'purify-retaliate',
      text: '잔해에서 생존자 수색',
      description: '폭격 이후 잔해 속에서 생존자를 수색한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: -25 },
      ],
      resultText: '잿더미 속에서 몇몇 생존자를 찾아냈다. 프로토스의 정화가 얼마나 잔인한지 온 코프룰루 구역에 알려졌다.',
    },
  ],
  maxOccurrences: 1,
  priority: 88,
  tags: ['diplomatic', 'protoss', 'purification', 'major'],
};

export const diplomaticEvents: GameEvent[] = [diplomaticCrisis, tradeAgreement, allianceProposal, protossPurification];
