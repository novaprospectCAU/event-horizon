/**
 * 스타크래프트 데모 이벤트 - 내부 세력 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const civilUnrest: GameEvent = {
  id: 'evt-civil-unrest',
  name: '식민지 반란',
  description: '자치령의 강압적 통치에 변경 식민지 주민들이 봉기했다. 레이너 특공대의 선전이 불씨를 지폈다.',
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
      text: '식민지 자치권 부분 인정',
      description: '주민들의 요구를 일부 수용한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: '자치권 일부 인정으로 봉기가 가라앉았다. 멩스크는 불만이지만 현실을 인정했다.',
    },
    {
      id: 'unrest-crackdown',
      text: '해병대를 투입하여 진압',
      description: '무력으로 질서를 회복한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -15 },
      ],
      resultText: '무력 진압은 성공했지만, 레이너 특공대에 더 많은 지원자가 모여들고 있다.',
    },
    {
      id: 'unrest-distract',
      text: '저그 위협을 부각하여 국민 결속',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -10 },
      ],
      resultText: '저그 침공 영상을 전 채널에 방송했다. 외부의 공포가 내부의 분열을 잠재웠다.',
    },
  ],
  cooldown: 4,
  priority: 70,
  tags: ['internal', 'stability'],
};

export const techBreakthrough: GameEvent = {
  id: 'evt-tech-breakthrough',
  name: '기술 돌파구',
  description: '연구진이 중대한 기술적 돌파구를 목전에 두고 있다.',
  triggers: [
    { type: 'random-chance', chance: 0.12 },
    { type: 'stat-threshold', entityId: 'faction-terran', statId: 'tech-level', comparison: 'gte', value: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'tech-military',
      text: '공성 전차 사거리 업그레이드',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 25 },
      ],
      resultText: '공성 전차의 포격 사거리가 크게 향상되었다. 방어전에서 결정적 우위를 점한다.',
    },
    {
      id: 'tech-economic',
      text: 'SCV 채굴 효율 개선',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: 30 },
      ],
      resultText: '개선된 채굴 알고리즘으로 미네랄 수확량이 급증했다.',
    },
    {
      id: 'tech-pure',
      text: '사이오닉 연구 추진',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '유령 프로그램의 사이오닉 증폭 연구가 진전되었다. 새로운 가능성이 열린다.',
    },
  ],
  cooldown: 5,
  priority: 55,
  tags: ['internal', 'technology'],
};

export const betrayal: GameEvent = {
  id: 'evt-betrayal',
  name: '내부의 배신자',
  description:
    '정보부가 고위 장교가 비밀리에 적과 내통하고 있음을 포착했다.',
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
      text: '배신자를 공개 처형',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '배신자가 UNN 생중계로 처형되었다. 멩스크가 직접 경고의 메시지를 전했다.',
    },
    {
      id: 'betray-turn',
      text: '이중 간첩으로 활용',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 15 },
      ],
      resultText:
        '배신자를 역이용하여 적에게 거짓 정보를 흘린다. 위험하지만 정보전에서 큰 이점을 얻었다.',
    },
    {
      id: 'betray-purge',
      text: '전면 보안 숙청',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'competence', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: '대규모 숙청으로 배신자와 수많은 무고한 이들이 체포되었다. 공포 정치의 그림자가 드리운다.',
    },
  ],
  maxOccurrences: 1,
  priority: 80,
  tags: ['internal', 'espionage', 'betrayal'],
};

export const internalEvents: GameEvent[] = [civilUnrest, techBreakthrough, betrayal];
