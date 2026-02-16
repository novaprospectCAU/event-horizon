/**
 * @event-horizon/demo-sf - SF Space Opera Demo Scenario
 *
 * A complete demo scenario featuring:
 * - 3 factions (Terran Confederation, Kethari Dominion, Synthesis Collective)
 * - 10 unique characters with behavior profiles
 * - 8 star systems
 * - 15+ scripted events (diplomatic, military, discovery, internal)
 * - 3 story arcs with multiple stages
 * - 6 scenes with dialogue trees
 * - 3-5 possible endings determined by player choices
 */

export { sfSchema } from './schema.js';
export { factions, terranConfederation, kethariDominion, synthesisCollective } from './factions.js';
export {
  characters,
  npcProfiles,
  admiralChen,
  ambassadorVoss,
  drKowalski,
  warlordThrax,
  spymasterZira,
  generalKorr,
  archonVexa,
  emissaryEcho,
  researcherPhi,
  captainRex,
} from './characters.js';
export { locations } from './locations.js';
export { allEvents, diplomaticEvents, militaryEvents, discoveryEvents, internalEvents } from './events/index.js';
export { storyArcs, scenes, convergenceArc, kethariCivilWarArc, synthesisAwakeningArc } from './story-arcs/index.js';

import { sfSchema } from './schema.js';
import { factions } from './factions.js';
import { characters, npcProfiles } from './characters.js';
import { locations } from './locations.js';
import { allEvents } from './events/index.js';
import { storyArcs, scenes } from './story-arcs/index.js';
import type { WorldState, Entity, Relation, TurnState } from '@event-horizon/types';

/** Initial relations between factions */
const initialRelations: Relation[] = [
  // Diplomatic relations
  { id: 'rel-1', typeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-kethari', weight: -20, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-2', typeId: 'diplomatic', sourceId: 'faction-terran', targetId: 'faction-synthesis', weight: 15, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-3', typeId: 'diplomatic', sourceId: 'faction-kethari', targetId: 'faction-synthesis', weight: -30, createdTurn: 0, modifiedTurn: 0 },
  // Trade relations
  { id: 'rel-4', typeId: 'trade', sourceId: 'faction-terran', targetId: 'faction-synthesis', weight: 25, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-5', typeId: 'trade', sourceId: 'faction-terran', targetId: 'faction-kethari', weight: 5, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-6', typeId: 'trade', sourceId: 'faction-kethari', targetId: 'faction-synthesis', weight: 0, createdTurn: 0, modifiedTurn: 0 },
  // Character loyalties
  { id: 'rel-7', typeId: 'loyalty-to', sourceId: 'char-chen', targetId: 'faction-terran', weight: 85, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-8', typeId: 'loyalty-to', sourceId: 'char-voss', targetId: 'faction-terran', weight: 70, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-9', typeId: 'loyalty-to', sourceId: 'char-kowalski', targetId: 'faction-terran', weight: 55, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-10', typeId: 'loyalty-to', sourceId: 'char-thrax', targetId: 'faction-kethari', weight: 95, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-11', typeId: 'loyalty-to', sourceId: 'char-zira', targetId: 'faction-kethari', weight: 60, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-12', typeId: 'loyalty-to', sourceId: 'char-korr', targetId: 'faction-kethari', weight: 90, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-13', typeId: 'loyalty-to', sourceId: 'char-vexa', targetId: 'faction-synthesis', weight: 80, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-14', typeId: 'loyalty-to', sourceId: 'char-echo', targetId: 'faction-synthesis', weight: 75, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-15', typeId: 'loyalty-to', sourceId: 'char-phi', targetId: 'faction-synthesis', weight: 65, createdTurn: 0, modifiedTurn: 0 },
  // Personal relations
  { id: 'rel-16', typeId: 'personal', sourceId: 'char-chen', targetId: 'char-voss', weight: 30, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-17', typeId: 'personal', sourceId: 'char-thrax', targetId: 'char-zira', weight: -15, createdTurn: 0, modifiedTurn: 0 },
  { id: 'rel-18', typeId: 'personal', sourceId: 'char-kowalski', targetId: 'char-phi', weight: 20, createdTurn: 0, modifiedTurn: 0 },
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

/** Complete initial world state for the SF demo */
export const sfWorldState: WorldState = {
  schema: sfSchema,
  turn: initialTurnState,
  entities: buildEntityMap([...factions, ...characters, ...locations]),
  relations: initialRelations,
  events: allEvents,
  storyArcs,
  arcStates: [
    { arcId: 'arc-convergence', currentStageIndex: 0, startedTurn: 0, completed: false, failed: false },
  ],
  scenes,
  npcProfiles,
  npcMemories: [],
  eventHistory: [],
  entityDeltas: [],
  relationDeltas: [],
  rng: { seed: 42, callCount: 0 },
};
