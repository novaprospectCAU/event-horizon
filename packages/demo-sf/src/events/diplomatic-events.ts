/**
 * SF 데모 이벤트 - 외교 및 정치 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const diplomaticCrisis: GameEvent = {
  id: 'evt-diplomatic-crisis',
  name: '외교 위기',
  description:
    '두 주요 세력 간의 긴장이 극에 달했다. 외교적 사건이 전면전으로 비화될 위기에 처해 있다.',
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
      text: '외교 사절 파견',
      description: '협상을 통해 긴장 완화를 시도한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 15 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: 10 },
      ],
      resultText: '사절이 긴장을 완화하는 데 성공했다. 적어도 당분간은.',
    },
    {
      id: 'crisis-threaten',
      text: '무력 시위',
      description: '군사력을 전개하여 힘을 과시한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'military-power', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '무력 시위는 명확한 메시지를 전달했지만, 관계의 균열은 더 깊어졌다.',
    },
    {
      id: 'crisis-ignore',
      text: '자연스럽게 지나가길 기다린다',
      description: '내부 문제에 집중하고 긴장이 자연히 가라앉기를 바란다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '직접적인 대립을 피하기로 했다. 이것이 현명한 선택이었을지는 시간이 말해줄 것이다.',
    },
  ],
  cooldown: 5,
  maxOccurrences: 3,
  priority: 80,
  tags: ['diplomatic', 'crisis'],
};

export const tradeAgreement: GameEvent = {
  id: 'evt-trade-agreement',
  name: '교역 협정 기회',
  description:
    '중립 무역 길드가 여러 세력에 이로운 교역 협정을 제안했다.',
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
      description: '교역 협정에 서명하고 경제 협력을 강화한다.',
      effects: [
        { type: 'modify-relation', relationTypeId: 'trade', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: '교역 협정이 체결되었다. 자금이 흐르고 번영이 찾아온다.',
    },
    {
      id: 'trade-counter',
      text: '더 나은 조건으로 역제안',
      description: '더 유리한 조건을 밀어붙이지만, 협상 결렬 위험이 있다.',
      conditions: [
        { type: 'stat-threshold', entityTag: 'terran', statId: 'influence', comparison: 'gte', value: 40 },
      ],
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'economic-power', amount: 50 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'influence', amount: -5 },
      ],
      resultText: '협상단이 탁월한 조건을 확보했다. 상대방은 불만이지만.',
    },
    {
      id: 'trade-reject',
      text: '제안 거절',
      description: '경제적 독립을 유지한다.',
      effects: [
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '교역 협정을 거절하고 자급자족을 선택했다.',
    },
  ],
  cooldown: 8,
  priority: 50,
  tags: ['trade', 'economy'],
};

export const allianceProposal: GameEvent = {
  id: 'evt-alliance-proposal',
  name: '동맹 제안',
  description: '한 세력이 공동의 위협에 대한 정식 동맹을 제안한다.',
  triggers: [
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      comparison: 'gte',
      value: 40,
    },
    {
      type: 'stat-threshold',
      entityTag: 'kethari',
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
      resultText: '새로운 동맹이 결성되었다. 함께라면 더 강하다.',
    },
    {
      id: 'alliance-decline',
      text: '정중히 거절',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '독립을 유지하는 대가로 잠재적 동맹의 호의를 잃었다.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 2,
  priority: 70,
  tags: ['diplomatic', 'alliance'],
};

export const diplomaticEvents: GameEvent[] = [diplomaticCrisis, tradeAgreement, allianceProposal];
