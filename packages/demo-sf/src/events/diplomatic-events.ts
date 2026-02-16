/**
 * 스타크래프트 데모 이벤트 - 외교 및 정치 이벤트.
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
      text: '태사다르에게 외교 채널 개설 요청',
      description: '프로토스 온건파와 협상을 시도한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 15 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: 10 },
      ],
      resultText: '태사다르가 의회를 설득하여 정화 작전을 일시 중단시켰다. 긴장은 완화되었지만 알다리스는 불만이다.',
    },
    {
      id: 'crisis-threaten',
      text: '방어 함대 전진 배치',
      description: '궤도 폭격에 맞서 군사적 대응을 준비한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'military-power', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '프로토스는 테란의 결의를 확인했다. 정화 작전은 보류되었으나 관계는 더 악화되었다.',
    },
    {
      id: 'crisis-ignore',
      text: '식민지 주민 대피에 집중',
      description: '충돌을 피하고 인명 구출에 집중한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '주민 대피는 성공했지만, 프로토스의 정화 작전을 막지 못했다. 식민지는 잿더미가 되었다.',
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
      text: '협정 수락',
      description: '자원 공유에 합의하고 보급 라인을 확보한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'trade', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: '미네랄과 베스핀 가스가 안정적으로 흘러든다. 전쟁 물자 생산이 크게 늘어났다.',
    },
    {
      id: 'trade-counter',
      text: '더 유리한 조건으로 역제안',
      description: '우리 쪽에 유리한 비율을 요구한다.',
      conditions: [
        { type: 'stat-threshold', entityTag: 'terran', statId: 'influence', comparison: 'gte', value: 40 },
      ],
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 50 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: -5 },
      ],
      resultText: '강한 입장으로 유리한 조건을 이끌어냈다. 다른 참여자들은 불만스러워한다.',
    },
    {
      id: 'trade-reject',
      text: '제안 거절',
      description: '독자적 자원 확보를 유지한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '자급자족을 선택했다. 보급은 부족하지만 누구에게도 약점을 보이지 않았다.',
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
      text: '동맹 수락',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 30 },
        { type: 'set-tag', entityTag: 'terran', tag: 'allied' },
      ],
      resultText: '종족을 초월한 동맹이 결성되었다. 저그에 맞서 함께 싸운다.',
    },
    {
      id: 'alliance-decline',
      text: '정중히 거절',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '독자 노선을 유지한다. 동맹 제안을 한 세력은 실망했다.',
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
    '프로토스 함대가 저그에 감염된 테란 식민지를 궤도에서 폭격하여 정화한다. 무고한 테란 시민들이 희생된다.',
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
      text: '프로토스에 강력 항의',
      description: '외교 채널을 통해 무차별 정화를 규탄한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '프로토스는 "하등 종족의 이해를 구하지 않는다"고 일축했다. 분노가 끓어오른다.',
    },
    {
      id: 'purify-understand',
      text: '프로토스의 의도를 이해하려 시도',
      description: '태사다르에게 접촉하여 정화의 이유를 묻는다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -5 },
      ],
      resultText: '태사다르가 답한다. "우리도 원치 않았소. 하지만 저그의 확산을 막으려면... 다른 방법이 없었소." 쓰라린 현실.',
    },
    {
      id: 'purify-retaliate',
      text: '군사적 보복',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: -25 },
      ],
      resultText: '테란 함대가 프로토스 정화 함대에 포격했다. 양 종족 간의 긴장이 극에 달한다.',
    },
  ],
  maxOccurrences: 1,
  priority: 88,
  tags: ['diplomatic', 'protoss', 'purification', 'major'],
};

export const diplomaticEvents: GameEvent[] = [diplomaticCrisis, tradeAgreement, allianceProposal, protossPurification];
