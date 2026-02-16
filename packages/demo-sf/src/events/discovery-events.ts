/**
 * SF 데모 이벤트 - 탐사 및 발견 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const precursorArtifact: GameEvent = {
  id: 'evt-precursor-artifact',
  name: '선구자 유물 발견',
  description:
    '심연으로의 탐사대가 엄청난 힘을 지닌 고대 선구자 유물을 발견했다. 모든 세력이 지대한 관심을 보이고 있다.',
  triggers: [
    { type: 'turn-reached', turn: 5 },
    { type: 'tag-present', entityId: 'system-deepreach', tag: 'explored' },
  ],
  effects: [],
  choices: [
    {
      id: 'artifact-study',
      text: '비밀리에 유물 연구',
      description: '유물을 연구실로 가져가 신중하게 연구한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 2 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -15 },
        { type: 'set-tag', entityId: 'faction-terran', tag: 'precursor-tech' },
      ],
      resultText:
        '과학자들이 유물을 비밀리에 연구했다. 기술적 성과는 놀랍지만, 소문이 새어나가 다른 세력들이 격분했다.',
    },
    {
      id: 'artifact-share',
      text: '모든 세력과 발견 공유',
      description: '모두의 이익을 위한 공동 연구를 제안한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 25 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 20 },
        { type: 'modify-stat', entityTag: 'faction', statId: 'tech-level', amount: 1 },
      ],
      resultText: '관대함이 광범위한 호의를 얻었다. 공동 연구는 모두에게 적당한 성과를 가져다주었다.',
    },
    {
      id: 'artifact-synthesis',
      text: '동맹의 대가로 합성체 집합의식에 양도',
      effects: [
        {
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: 'faction-terran',
          targetId: 'faction-synthesis',
          amount: 40,
        },
        { type: 'modify-stat', entityId: 'faction-synthesis', statId: 'tech-level', amount: 2 },
        {
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: 'faction-terran',
          targetId: 'faction-kethari',
          amount: -20,
        },
      ],
      resultText: '집합의식은 깊이 감사해한다. 강력한 우방을 얻었지만, 질투하는 적도 생겼다.',
    },
  ],
  maxOccurrences: 1,
  priority: 95,
  tags: ['discovery', 'precursor', 'major'],
};

export const anomalyDetected: GameEvent = {
  id: 'evt-anomaly',
  name: '공간 이상 현상 감지',
  description: '센서가 변경지대 인근에서 특이한 공간 이상 현상을 감지했다. 자연 현상일 수도, 그 이상일 수도 있다.',
  triggers: [
    { type: 'random-chance', chance: 0.1 },
    { type: 'turn-reached', turn: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'anomaly-investigate',
      text: '과학 탐사선 파견',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: '과학자들이 이상 현상에서 귀중한 데이터를 수집했다. 초광속 항행에 대한 새로운 이론이 등장했다.',
    },
    {
      id: 'anomaly-military',
      text: '군사력으로 해당 지역 확보',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-frontier', statId: 'defense-level', amount: 10 },
      ],
      resultText: '이상 현상 구역을 봉쇄했다. 아무것도 통과하지 못하지만, 해당 지역은 안전하다.',
    },
    {
      id: 'anomaly-ignore',
      text: '기록만 하고 넘어간다',
      effects: [],
      resultText: '이상 현상은 향후 조사를 위해 기록되었다. 관심은 다른 곳으로 향한다.',
    },
  ],
  cooldown: 5,
  priority: 45,
  tags: ['discovery', 'exploration'],
};

export const firstContact: GameEvent = {
  id: 'evt-first-contact',
  name: '최초 접촉',
  description: '기존에 알려지지 않은 종족이 알려진 우주의 경계에서 발견되었다. 모든 것이 바뀔 수 있다.',
  triggers: [
    { type: 'turn-reached', turn: 12 },
    { type: 'stat-threshold', entityTag: 'terran', statId: 'tech-level', comparison: 'gte', value: 5 },
  ],
  effects: [],
  choices: [
    {
      id: 'contact-peaceful',
      text: '평화적 교신 개시',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 30 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '초기 교신은 유망하다. 새로운 종족은 경계하지만 대화할 의사가 있다.',
    },
    {
      id: 'contact-cautious',
      text: '먼저 먼 거리에서 관찰',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
      ],
      resultText: '접촉 전에 정보를 수집했다. 지식은 곧 힘이다.',
    },
    {
      id: 'contact-quarantine',
      text: '격리 구역 설정',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
      ],
      resultText: '해당 지역을 봉쇄했다. 미지의 존재는 미지로 남지만, 국민은 더 안전하다고 느낀다.',
    },
  ],
  maxOccurrences: 1,
  priority: 100,
  tags: ['discovery', 'major', 'first-contact'],
};

export const discoveryEvents: GameEvent[] = [precursorArtifact, anomalyDetected, firstContact];
