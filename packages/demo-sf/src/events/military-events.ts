/**
 * SF 데모 이벤트 - 군사 및 분쟁 이벤트.
 */

import type { GameEvent } from '@event-horizon/types';

export const borderIncursion: GameEvent = {
  id: 'evt-border-incursion',
  name: '국경 침입',
  description:
    '케타리 순찰 함대가 분쟁 우주 영역으로 진입했다. 정찰인가, 실수인가, 침공의 시작인가?',
  triggers: [
    {
      type: 'stat-threshold',
      entityId: 'faction-kethari',
      statId: 'military-power',
      comparison: 'gte',
      value: 150,
    },
    {
      type: 'relation-threshold',
      relationTypeId: 'diplomatic',
      sourceId: 'faction-terran',
      targetId: 'faction-kethari',
      comparison: 'lt',
      value: 0,
    },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-frontier', statId: 'defense-level', amount: -10 },
  ],
  choices: [
    {
      id: 'incursion-confront',
      text: '침입자에 맞서다',
      description: '함대를 보내 케타리 순찰대를 요격하고 대항한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-kethari', amount: -15 },
        { type: 'modify-stat', entityId: 'system-frontier', statId: 'defense-level', amount: 20 },
      ],
      resultText: '아군 함대가 케타리 순찰대를 요격했다. 긴장된 대치 끝에 그들은 철수했지만, 관계는 악화되었다.',
    },
    {
      id: 'incursion-observe',
      text: '조용히 감시',
      description: '교전 없이 침입을 추적한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '멀리서 케타리 순찰대를 관찰했다. 그들은 지역을 정찰한 후 떠났다. 당신의 무대응이 주목받았다.',
    },
    {
      id: 'incursion-diplomacy',
      text: '외교 채널을 통해 해명 요구',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-kethari', amount: 5 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '케타리 측은 "항법 오류"라고 일축했다. 아무도 믿지 않지만, 이 제스처는 시간을 벌어주었다.',
    },
  ],
  cooldown: 4,
  maxOccurrences: 5,
  priority: 85,
  tags: ['military', 'kethari', 'border'],
};

export const pirateRaid: GameEvent = {
  id: 'evt-pirate-raid',
  name: '교역로 해적 습격',
  description: '해적들이 헤이븐 정거장 인근의 주요 교역 호송대를 공격했다.',
  triggers: [
    { type: 'random-chance', chance: 0.15 },
    { type: 'turn-reached', turn: 2 },
  ],
  effects: [
    { type: 'modify-stat', entityId: 'system-haven', statId: 'resources', amount: -30 },
  ],
  choices: [
    {
      id: 'pirate-hunt',
      text: '순찰 함대를 보내 해적 소탕',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-haven', statId: 'defense-level', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '아군 함대가 해적을 소탕했다. 헤이븐 정거장은 보호에 감사해한다.',
    },
    {
      id: 'pirate-negotiate',
      text: '해적을 사략선으로 고용',
      description: '해적을 동맹으로... 일종의.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '해적들이 보수를 받아들였다. 이제 당신 편이지만, 더 높은 값을 부르면 언제든 배신할 것이다.',
    },
    {
      id: 'pirate-ignore',
      text: '우리 일이 아니다',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: '헤이븐 정거장은 당신의 무관심을 기억한다. 연방에 대한 신뢰가 줄어든다.',
    },
  ],
  cooldown: 3,
  priority: 40,
  tags: ['military', 'pirate', 'trade'],
};

export const fleetMutiny: GameEvent = {
  id: 'evt-fleet-mutiny',
  name: '함대 반란',
  description: '낮은 사기와 열악한 환경이 함대 내 반란을 촉발했다.',
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
      text: '반란군과 협상',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: -5 },
      ],
      resultText: '함대의 불만을 해결했다. 사기가 회복되었지만, 일부는 이를 약함으로 본다.',
    },
    {
      id: 'mutiny-crush',
      text: '무력으로 반란 진압',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -30 },
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 10 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '반란이 무력으로 진압되었다. 질서는 회복되었지만, 끔찍한 대가를 치렀다.',
    },
  ],
  cooldown: 6,
  maxOccurrences: 2,
  priority: 75,
  tags: ['military', 'internal', 'morale'],
};

export const armsRace: GameEvent = {
  id: 'evt-arms-race',
  name: '은하 군비 경쟁',
  description: '정보 보고에 따르면 모든 세력이 급속히 군사력을 증강하고 있다.',
  triggers: [
    { type: 'turn-reached', turn: 8 },
    { type: 'stat-threshold', entityId: 'faction-kethari', statId: 'military-power', comparison: 'gte', value: 200 },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
  ],
  choices: [
    {
      id: 'arms-join',
      text: '우리도 군비 증강 가속',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 40 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -30 },
      ],
      resultText: '군사에 자원을 쏟아부었다. 함대는 성장하지만 경제는 압박받는다.',
    },
    {
      id: 'arms-disarm',
      text: '은하 군축 회담 제안',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '제안은 회의적인 반응을 받았지만, 일부는 이 제스처를 높이 평가한다.',
    },
    {
      id: 'arms-tech',
      text: '연구를 통한 질적 우위 추구',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -20 },
      ],
      resultText: '과학자들이 돌파구를 달성했다. 양보다 질.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 1,
  priority: 90,
  tags: ['military', 'global'],
};

export const militaryEvents: GameEvent[] = [borderIncursion, pirateRaid, fleetMutiny, armsRace];
