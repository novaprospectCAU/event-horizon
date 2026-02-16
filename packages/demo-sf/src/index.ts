/**
 * @event-horizon/demo-sf - 스타크래프트 데모 시나리오
 *
 * SC1 오리지널 3에피소드 기반 콘텐츠:
 * - 3 종족 (테란 자치령, 프로토스, 저그 군단)
 * - 10 주요 캐릭터 + 10 NPC 행동 프로필
 * - 8 성계
 * - 20+ 이벤트 (외교, 군사, 탐사, 내부)
 * - 3 스토리 아크 (아이어 침공 8단계, 자치령 횡포 4단계, 빛과 어둠의 화합 5단계)
 * - 18 장면 + 5 대사 트리
 */

export { sfSchema } from './schema.js';
export { factions, terranDominion, protoss, zergSwarm } from './factions.js';
export {
  characters,
  npcProfiles,
  raynor,
  mengsk,
  duke,
  kerrigan,
  tassadar,
  zeratul,
  fenix,
  aldaris,
  overmind,
  artanis,
} from './characters.js';
export { locations } from './locations.js';
export { allEvents, diplomaticEvents, militaryEvents, discoveryEvents, internalEvents } from './events/index.js';
export { storyArcs, scenes, aiurInvasionArc, dominionTyrannyArc, templarUnityArc } from './story-arcs/index.js';

import { sfSchema } from './schema.js';
import { factions } from './factions.js';
import { characters, npcProfiles } from './characters.js';
import { locations } from './locations.js';
import { allEvents } from './events/index.js';
import { storyArcs, scenes } from './story-arcs/index.js';
import type { WorldState, Entity, Relation, TurnState } from '@event-horizon/types';

/** Initial relations between factions - SC1 실제 관계 반영 */
const initialRelations: Relation[] = [
  // 외교 관계 (SC1 기준)
  { id: 'rel-1', typeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-protoss', weight: -30, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-2', typeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-zerg', weight: -60, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-3', typeId: 'diplomatic', sourceId: 'faction-protoss', targetId: 'faction-zerg', weight: -80, createdTurn: 0, modifiedTurn: 0 },
  // 교역 관계
  { id: 'rel-4', typeId: 'trade', sourceId: 'faction-terran', targetId: 'faction-protoss', weight: 5, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-5', typeId: 'trade', sourceId: 'faction-terran', targetId: 'faction-zerg', weight: 0, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-6', typeId: 'trade', sourceId: 'faction-protoss', targetId: 'faction-zerg', weight: 0, createdTurn: 0, modifiedTurn: 0 },
  // 캐릭터 충성도
  { id: 'rel-7', typeId: 'loyalty-to', sourceId: 'char-raynor', targetId: 'faction-terran', weight: 55, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-8', typeId: 'loyalty-to', sourceId: 'char-mengsk', targetId: 'faction-terran', weight: 95, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-9', typeId: 'loyalty-to', sourceId: 'char-duke', targetId: 'faction-terran', weight: 75, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-10', typeId: 'loyalty-to', sourceId: 'char-kerrigan', targetId: 'faction-terran', weight: 50, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-11', typeId: 'loyalty-to', sourceId: 'char-tassadar', targetId: 'faction-protoss', weight: 80, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-12', typeId: 'loyalty-to', sourceId: 'char-zeratul', targetId: 'faction-protoss', weight: 60, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-13', typeId: 'loyalty-to', sourceId: 'char-fenix', targetId: 'faction-protoss', weight: 90, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-14', typeId: 'loyalty-to', sourceId: 'char-aldaris', targetId: 'faction-protoss', weight: 95, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-15', typeId: 'loyalty-to', sourceId: 'char-overmind', targetId: 'faction-zerg', weight: 100, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-16', typeId: 'loyalty-to', sourceId: 'char-artanis', targetId: 'faction-protoss', weight: 85, createdTurn: 0, modifiedTurn: 0 },
  // 개인 관계 (SC1 실제 관계)
  { id: 'rel-17', typeId: 'personal', sourceId: 'char-raynor', targetId: 'char-kerrigan', weight: 70, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-18', typeId: 'personal', sourceId: 'char-kerrigan', targetId: 'char-raynor', weight: 60, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-19', typeId: 'personal', sourceId: 'char-raynor', targetId: 'char-mengsk', weight: 45, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-20', typeId: 'personal', sourceId: 'char-tassadar', targetId: 'char-zeratul', weight: 60, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-21', typeId: 'personal', sourceId: 'char-zeratul', targetId: 'char-tassadar', weight: 55, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-22', typeId: 'personal', sourceId: 'char-tassadar', targetId: 'char-aldaris', weight: -30, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-23', typeId: 'personal', sourceId: 'char-aldaris', targetId: 'char-tassadar', weight: -40, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-24', typeId: 'personal', sourceId: 'char-fenix', targetId: 'char-tassadar', weight: 70, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-25', typeId: 'personal', sourceId: 'char-overmind', targetId: 'char-kerrigan', weight: 80, createdTurn: 0, modifiedTurn: 0 },
  // 추가 개인 관계
  { id: 'rel-26', typeId: 'personal', sourceId: 'char-raynor', targetId: 'char-fenix', weight: 0, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-27', typeId: 'personal', sourceId: 'char-duke', targetId: 'char-raynor', weight: -20, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-28', typeId: 'personal', sourceId: 'char-raynor', targetId: 'char-duke', weight: -15, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-29', typeId: 'personal', sourceId: 'char-mengsk', targetId: 'char-kerrigan', weight: 30, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-30', typeId: 'personal', sourceId: 'char-artanis', targetId: 'char-tassadar', weight: 75, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-31', typeId: 'personal', sourceId: 'char-aldaris', targetId: 'char-zeratul', weight: -70, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-32', typeId: 'personal', sourceId: 'char-fenix', targetId: 'char-aldaris', weight: 20, createdTurn: 0, modifiedTurn: 0 },
];

/** Build the entity map from all entity arrays */
function buildEntityMap(entities: Entity[]): Record<string, Entity> {
  const map: Record<string, Entity> = {};
  for (const entity of entities) {
    map[entity.id] = entity;
  }
  return map;
}

const initialTurnState: TurnState = {
  currentTurn: 0,
  currentPhase: {
    turnNumber: 0,
    phaseId: 'player-action',
    phaseType: 'player-action',
    phaseIndex: 0,
    totalPhases: 4,
  },
  isComplete: false,
  awaitingInput: true,
};

/** Complete initial world state for the SC1 demo */
export const sfWorldState: WorldState = {
  schema: sfSchema,
  turn: initialTurnState,
  entities: buildEntityMap([...factions, ...characters, ...locations]),
  relations: initialRelations,
  events: allEvents,
  storyArcs,
  arcStates: [
    { arcId: 'arc-aiur-invasion', currentStageIndex: 0, startedTurn: 0, completed: false, failed: false },
  ],
  scenes,
  npcProfiles,
  npcMemories: [],
  eventHistory: [],
  entityDeltas: [],
  relationDeltas: [],
  rng: { seed: 42, callCount: 0 },
};
