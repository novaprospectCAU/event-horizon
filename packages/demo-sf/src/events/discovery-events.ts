/**
 * 스타크래프트 데모 이벤트 - 탐사 및 발견 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const precursorArtifact: GameEvent = {
  id: 'evt-precursor-artifact',
  name: '젤나가 유물 발견',
  description:
    '브락시스 탐사대가 고대 젤나가 문명의 유물을 발견했다. 프로토스와 저그 모두 이 유물에 지대한 관심을 보이고 있다.',
  triggers: [
    { type: 'turn-reached', turn: 5 },
    { type: 'tag-present', entityId: 'system-braxis', tag: 'explored' },
  ],
  effects: [],
  choices: [
    {
      id: 'artifact-study',
      text: '비밀리에 유물 연구',
      description: '테란 과학자들이 젤나가 기술을 역설계한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 2 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -15 },
        { type: 'set-tag', entityId: 'faction-terran', tag: 'xelnaga-tech' },
      ],
      resultText:
        '젤나가 기술의 일부를 해독했다. 놀라운 성과지만, 프로토스가 "신성한 유산을 모독했다"며 격분했다.',
    },
    {
      id: 'artifact-share',
      text: '프로토스와 공동 연구 제안',
      description: '종족을 초월한 학술 협력을 제안한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 25 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 20 },
        { type: 'modify-stat', entityTag: 'faction', statId: 'tech-level', amount: 1 },
      ],
      resultText: '태사다르가 공동 연구에 동의했다. 칼라이 학자들과 테란 과학자들의 합작으로 새로운 발견이 이어진다.',
    },
    {
      id: 'artifact-synthesis',
      text: '유물을 미끼로 저그를 유인',
      effects: [
        {
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: 'faction-terran',
          targetId: 'faction-zerg',
          amount: -20,
        },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 15 },
        {
          type: 'modify-relation',
          relationTypeId: 'diplomatic',
          sourceId: 'faction-terran',
          targetId: 'faction-protoss',
          amount: 10,
        },
      ],
      resultText: '저그 분파를 유물의 에너지로 유인해 섬멸했다. 프로토스는 이 전술적 기지를 인정했다.',
    },
  ],
  maxOccurrences: 1,
  priority: 95,
  tags: ['discovery', 'xelnaga', 'major'],
};

export const anomalyDetected: GameEvent = {
  id: 'evt-anomaly',
  name: '사이오닉 이상 현상 감지',
  description: '과학선이 안티가 프라임 인근에서 강력한 사이오닉 에너지 방출을 감지했다. 저그의 새로운 진화일 수도 있다.',
  triggers: [
    { type: 'random-chance', chance: 0.1 },
    { type: 'turn-reached', turn: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'anomaly-investigate',
      text: '과학선 파견 조사',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: '저그의 새로운 변이체에 대한 귀중한 데이터를 수집했다. 대응 무기 개발이 가능해졌다.',
    },
    {
      id: 'anomaly-military',
      text: '공성 전차 부대로 해당 지역 봉쇄',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-antiga', statId: 'defense-level', amount: 10 },
      ],
      resultText: '공성 전차 진지가 해당 구역을 완전히 봉쇄했다. 아무것도 통과하지 못한다.',
    },
    {
      id: 'anomaly-ignore',
      text: '기록만 하고 넘어간다',
      effects: [],
      resultText: '이상 현상은 보고서에 기록되었다. 더 급한 문제가 산적해 있다.',
    },
  ],
  cooldown: 5,
  priority: 45,
  tags: ['discovery', 'psionic'],
};

export const firstContact: GameEvent = {
  id: 'evt-first-contact',
  name: '미지의 젤나가 구조물 활성화',
  description: '샤쿠라스 근처에서 고대 젤나가 구조물이 갑자기 활성화되었다. 세 종족 모두의 운명을 바꿀 수 있는 사건이다.',
  triggers: [
    { type: 'turn-reached', turn: 12 },
    { type: 'stat-threshold', entityTag: 'terran', statId: 'tech-level', comparison: 'gte', value: 5 },
  ],
  effects: [],
  choices: [
    {
      id: 'contact-peaceful',
      text: '프로토스와 협력하여 조사',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 30 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '제라툴의 지식과 테란의 기술이 합쳐져 구조물의 비밀 일부가 밝혀졌다.',
    },
    {
      id: 'contact-cautious',
      text: '은밀히 관찰',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
      ],
      resultText: '클로킹 유령 요원들이 구조물을 감시한다. 서서히 그 비밀이 드러나고 있다.',
    },
    {
      id: 'contact-quarantine',
      text: '구조물 주변을 핵 지뢰로 봉쇄',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
      ],
      resultText: '아무도 접근할 수 없게 만들었다. 안전하지만 그 잠재력도 함께 봉인되었다.',
    },
  ],
  maxOccurrences: 1,
  priority: 100,
  tags: ['discovery', 'major', 'xelnaga'],
};

export const discoveryEvents: GameEvent[] = [precursorArtifact, anomalyDetected, firstContact];
