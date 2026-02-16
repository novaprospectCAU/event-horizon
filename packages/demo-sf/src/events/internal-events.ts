/**
 * SF 데모 이벤트 - 내부 세력 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const civilUnrest: GameEvent = {
  id: 'evt-civil-unrest',
  name: '시민 불안',
  description: '국민의 불만이 내부 안정을 위협하고 있다.',
  triggers: [
    {
      type: 'stat-threshold',
      entityId: 'faction-terran',
      statId: 'stability',
      comparison: 'lt',
      value: 40,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
  ],
  choices: [
    {
      id: 'unrest-reform',
      text: '사회 개혁 시행',
      description: '불만의 근본 원인을 해결한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: '개혁은 비용이 크지만 효과적이다. 국민은 자신들의 목소리가 전달되었다고 느낀다.',
    },
    {
      id: 'unrest-crackdown',
      text: '보안 단속',
      description: '무력으로 질서를 회복한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -15 },
      ],
      resultText: '질서는 회복되었지만, 명성에 타격을 입었다. 불안은 단지 지하로 숨었을 뿐이다.',
    },
    {
      id: 'unrest-distract',
      text: '외부 위협에 맞선 애국심 결집',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '애국적 열기가 고조된다. 국민은 실제든 상상이든 공동의 적에 대항해 단결한다.',
    },
  ],
  cooldown: 4,
  priority: 70,
  tags: ['internal', 'stability'],
};

export const techBreakthrough: GameEvent = {
  id: 'evt-tech-breakthrough',
  name: '기술적 돌파구',
  description: '연구팀이 중대한 돌파구를 목전에 두고 있다.',
  triggers: [
    { type: 'random-chance', chance: 0.12 },
    { type: 'stat-threshold', entityId: 'faction-terran', statId: 'tech-level', comparison: 'gte', value: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'tech-military',
      text: '군사 기술에 적용',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 25 },
      ],
      resultText: '돌파구가 강력한 신무기 기술로 이어졌다.',
    },
    {
      id: 'tech-economic',
      text: '경제 발전에 적용',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: '새로운 산업 공정이 연방 전역의 생산력을 향상시켰다.',
    },
    {
      id: 'tech-pure',
      text: '순수 연구 추구',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '순수 과학이 진보했다. 당신의 연구자들은 은하의 부러움을 산다.',
    },
  ],
  cooldown: 5,
  priority: 55,
  tags: ['internal', 'technology'],
};

export const betrayal: GameEvent = {
  id: 'evt-betrayal',
  name: '내부의 배신',
  description:
    '정보부가 고위 관리가 비밀리에 다른 세력을 위해 일하고 있음을 밝혀냈다.',
  triggers: [
    { type: 'turn-reached', turn: 7 },
    {
      type: 'stat-threshold',
      entityId: 'faction-terran',
      statId: 'stability',
      comparison: 'lt',
      value: 60,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
  ],
  choices: [
    {
      id: 'betray-arrest',
      text: '배신자를 공개 체포',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '배신자가 공개적으로 적발되어 체포되었다. 국민은 정의에 결집한다.',
    },
    {
      id: 'betray-turn',
      text: '이중 간첩으로 전환',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 15 },
      ],
      resultText:
        '배신자가 이제 거짓 정보를 흘리도록 두었다. 위험한 게임이지만, 잠재적으로 큰 보상이 있다.',
    },
    {
      id: 'betray-purge',
      text: '전면적 보안 숙청 실시',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'competence', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: '숙청이 배신자와 많은 무고한 이들을 함께 잡아들였다. 편집증이 조직 전체로 퍼진다.',
    },
  ],
  maxOccurrences: 1,
  priority: 80,
  tags: ['internal', 'espionage', 'betrayal'],
};

export const internalEvents: GameEvent[] = [civilUnrest, techBreakthrough, betrayal];
