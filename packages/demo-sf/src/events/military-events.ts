/**
 * 스타크래프트 데모 이벤트 - 군사 및 분쟁 이벤트.
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
      text: '전면 방어전 개시',
      description: '모든 가용 병력을 투입하여 저그를 저지한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -10 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-zerg', amount: -15 },
        { type: 'modify-stat', entityId: 'system-antiga', statId: 'defense-level', amount: 20 },
      ],
      resultText: '치열한 교전 끝에 저그의 첫 번째 파도를 막아냈다. 하지만 더 많은 물결이 밀려오고 있다.',
    },
    {
      id: 'incursion-observe',
      text: '전략적 후퇴',
      description: '방어가 불가능한 전초기지를 포기하고 주요 거점을 사수한다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '변경 전초기지를 포기하고 방어선을 재편했다. 버려진 기지는 순식간에 저그 점막으로 뒤덮였다.',
    },
    {
      id: 'incursion-diplomacy',
      text: '프로토스에 공동 방어 요청',
      effects: [
        { type: 'modify-relation', relationTypeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', amount: 10 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 5 },
      ],
      resultText: '프로토스가 제한적 지원을 보내왔다. 공동의 적 앞에서 미약하나마 협력의 싹이 트였다.',
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
      text: '레이스 편대로 해적 소탕',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: -5 },
        { type: 'modify-stat', entityId: 'system-marsara', statId: 'defense-level', amount: 15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 10 },
      ],
      resultText: '레이스 전투기들이 해적선을 궤멸시켰다. 보급로가 다시 안전해졌다.',
    },
    {
      id: 'pirate-negotiate',
      text: '해적을 용병으로 고용',
      description: '자금을 주고 우리 편으로 만든다.',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -15 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -5 },
      ],
      resultText: '해적들이 크레딧에 매수되었다. 이제 우리 눈과 귀가 되어줄 것이다... 더 높은 값을 부르기 전까지는.',
    },
    {
      id: 'pirate-ignore',
      text: '무시하고 다른 보급로 확보',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: -10 },
      ],
      resultText: '해적 활동이 점점 대담해지고 있다. 변경 식민지들의 불만이 커진다.',
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
      text: '반란군과 대화',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 25 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: -5 },
      ],
      resultText: '일부 민병대의 요구를 수용했다. 사기가 회복되었지만 자치령의 권위가 흔들린다.',
    },
    {
      id: 'mutiny-crush',
      text: '무력 진압',
      effects: [
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-strength', amount: -30 },
        { type: 'modify-stat', entityTag: 'fleet', statId: 'fleet-morale', amount: 10 },
        { type: 'modify-stat', entityTag: 'terran', statId: 'stability', amount: 5 },
      ],
      resultText: '반란이 무력으로 진압되었다. 공포로 질서를 되찾았지만, 레이너 특공대에 더 많은 이들이 합류할 것이다.',
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
    { type: 'turn-reached', turn: 8 },
    { type: 'stat-threshold', entityId: 'faction-zerg', statId: 'military-power', comparison: 'gte', value: 200 },
  ],
  effects: [
    { type: 'modify-stat', entityTag: 'faction', statId: 'stability', amount: -5 },
  ],
  choices: [
    {
      id: 'arms-join',
      text: '전쟁 경제 체제 돌입',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'military-power', amount: 40 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -30 },
      ],
      resultText: '모든 자원을 군수 생산에 투입했다. 전쟁준비태세 1호.',
    },
    {
      id: 'arms-disarm',
      text: '다종족 평화 회담 제안',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'influence', amount: 20 },
        { type: 'modify-relation', relationTypeId: 'diplomatic', amount: 10 },
      ],
      resultText: '저그는 무시했고 프로토스는 회의적이다. 하지만 제안 자체가 상징적 의미를 가진다.',
    },
    {
      id: 'arms-tech',
      text: '전투순양함 야마토 포 업그레이드에 집중',
      effects: [
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'tech-level', amount: 1 },
        { type: 'modify-stat', entityId: 'faction-terran', statId: 'economic-power', amount: -20 },
      ],
      resultText: '야마토 포의 위력이 30% 향상되었다. 양보다 질로 승부한다.',
    },
  ],
  cooldown: 10,
  maxOccurrences: 1,
  priority: 90,
  tags: ['military', 'global'],
};

export const militaryEvents: GameEvent[] = [borderIncursion, pirateRaid, fleetMutiny, armsRace];
