/**
 * 스타크래프트 데모 이벤트 - 탐사 및 발견 이벤트.
 * 선택지는 마 사라 민병대 대장(플레이어)의 시점에서 개인/소부대 단위 행동으로 구성.
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
      text: '유물 발굴 현장 호위',
      description: '민병대를 이끌고 유물 발굴 현장의 경비를 맡는다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 2 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: -15 },
        { type: 'set-tag', entityId: 'faction-terran', tag: 'xelnaga-tech' },
      ],
      resultText:
        '발굴 현장을 성공적으로 호위하여 과학자들이 젤나가 기술 일부를 해독했다. 하지만 프로토스가 "신성한 유산을 모독했다"며 격분했다.',
    },
    {
      id: 'artifact-share',
      text: '프로토스 학자에게 연락',
      description: '알고 있는 프로토스 연락책을 통해 공동 연구를 제안한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 25 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 20 },
        { type: 'modify-stat', entityTag: 'faction', statId: 'tech-level', amount: 1 },
      ],
      resultText: '프로토스와의 접선에 성공했다. 태사다르가 공동 연구에 동의하여 새로운 발견이 이어진다.',
    },
    {
      id: 'artifact-synthesis',
      text: '상부에 보고하고 대기',
      description: '유물 발견 사실을 상부에 보고하고 지시를 기다린다.',
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
      resultText: '상부가 유물을 전략적으로 활용하기로 결정했다. 저그를 유인하여 섬멸하는 작전이 실행되었다.',
    },
  ],
  maxOccurrences: 1,
  priority: 95,
  tags: ['discovery', 'xelnaga', 'major'],
};

export const anomalyDetected: GameEvent = {
  id: 'evt-anomaly',
  name: '사이오닉 이상 현상 감지',
  description: '과학선이 안티가 프라임 인근에서 강력한 사이오닉 에너지 방출을 감지했다. 저그의 새로운 진화일 수도 있고, 케리건의 잠재된 사이오닉 능력이 공명하는 것일 수도 있다.',
  triggers: [
    { type: 'random-chance', chance: 0.1 },
    { type: 'turn-reached', turn: 3 },
  ],
  effects: [],
  choices: [
    {
      id: 'anomaly-investigate',
      text: '직접 정찰 나섬',
      description: '소규모 정찰대를 이끌고 이상 현상 발원지를 직접 조사한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -10 },
      ],
      resultText: '위험을 무릅쓰고 직접 정찰한 결과, 저그의 새로운 변이체에 대한 귀중한 데이터를 수집했다.',
    },
    {
      id: 'anomaly-military',
      text: '주민 대피 지시',
      description: '이상 현상 인근 주민들을 안전지대로 대피시킨다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-antiga', statId: 'defense-level', amount: 10 },
      ],
      resultText: '주민 대피를 신속히 완료했다. 이후 해당 구역에 방어 진지가 구축되었다.',
    },
    {
      id: 'anomaly-ignore',
      text: '기록만 하고 상부 보고',
      description: '이상 현상을 기록하고 상부에 보고한 뒤 일상 임무로 복귀한다.',
      effects: [],
      resultText: '이상 현상은 보고서에 기록되었다. 상부에서 후속 조치를 결정할 것이다.',
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
    { type: 'turn-reached', turn: 15 },
    { type: 'stat-threshold', entityTag: 'terran', statId: 'tech-level', comparison: 'gte', value: 5 },
  ],
  effects: [],
  choices: [
    {
      id: 'contact-peaceful',
      text: '탐사대에 자원하여 동행',
      description: '구조물 조사 탐사대에 자원하여 호위 및 동행한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 30 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '탐사대에 동행하여 프로토스와 함께 구조물의 비밀 일부를 밝혀냈다. 위험했지만 값진 경험이었다.',
    },
    {
      id: 'contact-cautious',
      text: '은밀히 관찰하고 보고',
      description: '구조물 주변을 은밀히 관찰하고 상세 보고서를 작성한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
      ],
      resultText: '은밀히 관찰한 결과 구조물의 활성 패턴을 기록했다. 정보가 상부에 전달되었다.',
    },
    {
      id: 'contact-quarantine',
      text: '위험 경고 발령',
      description: '구조물이 위험할 수 있음을 경고하고 접근 금지를 요청한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 5 },
      ],
      resultText: '경고가 받아들여져 접근 금지 구역이 설정되었다. 안전하지만 그 잠재력도 함께 봉인되었다.',
    },
  ],
  maxOccurrences: 1,
  priority: 100,
  tags: ['discovery', 'major', 'xelnaga'],
};

export const zeratulCerebrateKill: GameEvent = {
  id: 'evt-zeratul-cerebrate-kill',
  name: '정신체 자스 암살',
  description:
    '제라툴이 공허의 에너지로 정신체 자스를 영구적으로 처치한다. 그러나 초월체와의 정신 접촉으로 아이어의 위치가 노출된다.',
  triggers: [
    { type: 'turn-reached', turn: 14 },
    { type: 'tag-present', entityId: 'char-kerrigan', tag: 'infested' },
  ],
  effects: [
    { type: 'set-tag', entityId: 'system-aiur', tag: 'location-exposed' },
    { type: 'modify-stat', entityId: 'faction-zerg', statId: 'military-power', amount: -20 },
  ],
  choices: [
    {
      id: 'cerebrate-warn',
      text: '레이너에게 급히 상황 보고',
      description: '아이어의 위치가 노출된 사실을 레이너에게 급히 보고한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'military-power', amount: 20 },
        { type: 'modify-stat', entityId: 'system-aiur', statId: 'defense-level', amount: 15 },
      ],
      resultText: '레이너가 즉시 프로토스에 경고를 전달했다. 태사다르가 방어 태세를 갖추기 시작했지만, 시간은 많지 않다.',
    },
    {
      id: 'cerebrate-hide',
      text: '독자적으로 정보 수집',
      description: '상황을 더 파악하기 위해 독자적으로 정보를 수집한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: 5 },
      ],
      resultText: '독자적으로 정보를 모은 결과, 저그 군단의 이동 방향이 아이어임을 확인했다. 이 정보가 추후 대비에 도움이 될 것이다.',
    },
  ],
  maxOccurrences: 1,
  priority: 98,
  tags: ['discovery', 'protoss', 'zerg', 'major', 'cerebrate'],
};

export const darkTemplarDiscovery: GameEvent = {
  id: 'evt-dark-templar-discovery',
  name: '암흑 기사의 발견',
  description:
    '태사다르가 샤쿠라스에서 암흑 기사 제라툴과 접촉한다. 공허의 에너지가 저그를 영구적으로 처치할 수 있다는 사실을 알게 된다.',
  triggers: [
    { type: 'turn-reached', turn: 8 },
    { type: 'tag-present', entityId: 'faction-protoss', tag: 'templar-schism' },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'faction-protoss', statId: 'tech-level', amount: 1 },
  ],
  choices: [
    {
      id: 'dark-templar-ally',
      text: '태사다르의 임무에 동행 자원',
      description: '태사다르의 위험한 임무에 자원하여 동행한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'tech-level', amount: 2 },
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: -10 },
      ],
      resultText: '태사다르와 함께 샤쿠라스에 동행했다. 칼라이와 암흑 기사의 만남을 직접 목격하며, 새로운 가능성을 엿보았다.',
    },
    {
      id: 'dark-templar-report',
      text: '상부에 보고',
      description: '태사다르의 움직임을 상부에 보고한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-protoss', statId: 'stability', amount: 5 },
      ],
      resultText: '상부에 보고했지만 큰 관심을 얻지 못했다. 프로토스 내부 문제로 치부되었다.',
    },
  ],
  maxOccurrences: 1,
  priority: 85,
  tags: ['discovery', 'protoss', 'dark-templar'],
};

export const psiEmitterFound: GameEvent = {
  id: 'evt-psi-emitter-found',
  name: '사이오닉 방출기 발견',
  description:
    '연합의 극비 연구시설에서 사이오닉 방출기 프로토타입을 발견했다. 이 장치는 저그를 특정 위치로 유인할 수 있는 위험한 무기다.',
  triggers: [
    { type: 'turn-reached', turn: 5 },
  ],
  effects: [
    { type: 'set-tag', entityId: 'faction-terran', tag: 'psi-emitter-acquired' },
  ],
  choices: [
    {
      id: 'emitter-use-now',
      text: '방출기 운반 임무 자원',
      description: '위험한 방출기 운반 임무에 자원한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 20 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: -10 },
      ],
      resultText: '방출기를 목표 지점까지 무사히 운반했다. 가동되자 저그가 연합군 기지로 몰려든다. 케리건이 불안한 눈빛으로 멩스크를 바라본다.',
    },
    {
      id: 'emitter-research',
      text: '위험성을 상관에게 경고',
      description: '방출기의 위험성을 레이너에게 보고하고 신중한 사용을 건의한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
      ],
      resultText: '레이너가 경고를 경청했다. 방출기에 대한 추가 연구가 진행되어 더 정밀한 통제가 가능해졌다.',
    },
    {
      id: 'emitter-destroy',
      text: '파괴 제안',
      description: '너무 위험한 무기이므로 파괴를 건의한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'stability', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '파괴 제안은 받아들여지지 않았지만, 안전 프로토콜이 강화되었다. 케리건이 고마운 눈빛을 보냈다.',
    },
  ],
  maxOccurrences: 1,
  priority: 88,
  tags: ['discovery', 'terran', 'psi-emitter', 'major'],
};

export const discoveryEvents: GameEvent[] = [precursorArtifact, anomalyDetected, firstContact, zeratulCerebrateKill, darkTemplarDiscovery, psiEmitterFound];
