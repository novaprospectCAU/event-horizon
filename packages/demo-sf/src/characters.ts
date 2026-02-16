/**
 * SF Demo Characters - key NPCs across all factions.
 */

import type { Entity, NPCBehaviorProfile } from '@event-horizon/types';

// ─── Terran Characters ───

export const admiralChen: Entity = {
  id: 'char-chen',
  typeId: 'character',
  name: 'Admiral Elena Chen',
  tags: ['character', 'military', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Human',
        role: 'Fleet Admiral',
        factionId: 'faction-terran',
        backstory:
          'A decorated veteran of the Border Wars, Chen is respected across factions for her tactical brilliance and restraint. She believes in peace through strength.',
        portrait: 'chen',
      },
    },
  },
  stats: { loyalty: 85, competence: 90, ambition: 60 },
  locationId: 'system-sol',
};

export const ambassadorVoss: Entity = {
  id: 'char-voss',
  typeId: 'character',
  name: 'Ambassador Marcus Voss',
  tags: ['character', 'diplomat', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Human',
        role: 'Chief Diplomat',
        factionId: 'faction-terran',
        backstory:
          'A silver-tongued negotiator who has brokered more treaties than anyone alive. Some suspect his idealism masks a calculating mind.',
        portrait: 'voss',
      },
    },
  },
  stats: { loyalty: 70, competence: 85, ambition: 75 },
  locationId: 'system-sol',
};

export const drKowalski: Entity = {
  id: 'char-kowalski',
  typeId: 'character',
  name: 'Dr. Anya Kowalski',
  tags: ['character', 'scientist', 'terran'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Human',
        role: 'Chief Scientist',
        factionId: 'faction-terran',
        backstory:
          'Brilliant xenotechnologist who has reverse-engineered Synthesis tech. Torn between loyalty to Terra and her fascination with alien science.',
        portrait: 'kowalski',
      },
    },
  },
  stats: { loyalty: 55, competence: 95, ambition: 70 },
  locationId: 'system-haven',
};

// ─── Kethari Characters ───

export const warlordThrax: Entity = {
  id: 'char-thrax',
  typeId: 'character',
  name: "Warlord Thrax'val",
  tags: ['character', 'military', 'kethari', 'leader'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Kethari',
        role: 'Supreme Warlord',
        factionId: 'faction-kethari',
        backstory:
          'The undisputed ruler of the Dominion, Thrax earned his throne through conquest. Ruthless but not without a crude sense of honor.',
        portrait: 'thrax',
      },
    },
  },
  stats: { loyalty: 95, competence: 80, ambition: 95 },
  locationId: 'system-kethar',
};

export const spymasterZira: Entity = {
  id: 'char-zira',
  typeId: 'character',
  name: "Spymaster Zira'kesh",
  tags: ['character', 'spy', 'kethari'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Kethari',
        role: 'Intelligence Chief',
        factionId: 'faction-kethari',
        backstory:
          'Runs the Dominion\'s vast spy network. Knows secrets that could topple governments. Loyal to Thrax... for now.',
        portrait: 'zira',
      },
    },
  },
  stats: { loyalty: 60, competence: 88, ambition: 85 },
  locationId: 'system-kethar',
};

export const generalKorr: Entity = {
  id: 'char-korr',
  typeId: 'character',
  name: "General Korr'dak",
  tags: ['character', 'military', 'kethari'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Kethari',
        role: 'Fleet General',
        factionId: 'faction-kethari',
        backstory:
          'A brutal but effective military commander who believes the Kethari are destined to rule the galaxy. Fiercely loyal to the Dominion above all.',
        portrait: 'korr',
      },
    },
  },
  stats: { loyalty: 90, competence: 75, ambition: 80 },
  locationId: 'system-forge',
};

// ─── Synthesis Characters ───

export const archonVexa: Entity = {
  id: 'char-vexa',
  typeId: 'character',
  name: 'Archon Vexa-7',
  tags: ['character', 'leader', 'synthesis'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Synthetic-Organic Hybrid',
        role: 'Primary Node',
        factionId: 'faction-synthesis',
        backstory:
          'The closest thing the Collective has to a leader. Vexa-7 processes input from millions of networked minds, seeking the optimal path to transcendence.',
        portrait: 'vexa',
      },
    },
  },
  stats: { loyalty: 80, competence: 95, ambition: 50 },
  locationId: 'system-nexus',
};

export const emissaryEcho: Entity = {
  id: 'char-echo',
  typeId: 'character',
  name: 'Emissary Echo',
  tags: ['character', 'diplomat', 'synthesis'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Synthetic Avatar',
        role: 'External Relations',
        factionId: 'faction-synthesis',
        backstory:
          'A diplomatic avatar created to interface with biological species. Surprisingly empathetic for a construct. Some wonder if Echo has developed genuine emotions.',
        portrait: 'echo',
      },
    },
  },
  stats: { loyalty: 75, competence: 82, ambition: 40 },
  locationId: 'system-haven',
};

export const researcherPhi: Entity = {
  id: 'char-phi',
  typeId: 'character',
  name: 'Researcher Phi-12',
  tags: ['character', 'scientist', 'synthesis'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Synthetic-Organic Hybrid',
        role: 'Lead Researcher',
        factionId: 'faction-synthesis',
        backstory:
          'Obsessed with understanding the Precursor artifacts found in deep space. Believes they hold the key to true transcendence.',
        portrait: 'phi',
      },
    },
  },
  stats: { loyalty: 65, competence: 92, ambition: 60 },
  locationId: 'system-nexus',
};

// ─── Independent Characters ───

export const captainRex: Entity = {
  id: 'char-rex',
  typeId: 'character',
  name: 'Captain Rex Navarro',
  tags: ['character', 'independent', 'smuggler'],
  components: {
    'character-info': {
      defId: 'character-info',
      values: {
        species: 'Human',
        role: 'Free Captain',
        factionId: '',
        backstory:
          'A freelance smuggler and information broker who operates in the neutral zones. Owes favors to everyone and trusts no one.',
        portrait: 'rex',
      },
    },
  },
  stats: { loyalty: 30, competence: 78, ambition: 65 },
  locationId: 'system-haven',
};

export const characters: Entity[] = [
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
];

// ─── NPC Behavior Profiles ───

export const npcProfiles: NPCBehaviorProfile[] = [
  {
    entityId: 'char-chen',
    personality: [
      { traitId: 'cautious', name: 'Cautious', intensity: 0.7 },
      { traitId: 'honorable', name: 'Honorable', intensity: 0.8 },
      { traitId: 'strategic', name: 'Strategic', intensity: 0.9 },
    ],
    goals: [
      {
        id: 'goal-chen-1',
        name: 'Defend Terran Borders',
        priority: 90,
        status: 'active',
        completionConditions: [],
        relatedEntities: ['faction-terran'],
      },
      {
        id: 'goal-chen-2',
        name: 'Maintain Peace',
        priority: 70,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'chen-defend',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityTag: 'kethari', comparison: 'gt', value: 150 }],
        actionTypeId: 'rally',
        targetStrategy: 'specific',
        specificTargetId: 'faction-terran',
        weight: 80,
      },
      {
        id: 'chen-negotiate',
        conditions: [{ type: 'relation-threshold', relationTypeId: 'diplomatic', comparison: 'lt', value: -20 }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'ceasefire' },
        weight: 60,
      },
    ],
    aiPersonalityPrompt:
      'You are Admiral Elena Chen, a calm and strategic military leader who prefers diplomacy but will fight decisively when necessary.',
    useAI: true,
  },
  {
    entityId: 'char-thrax',
    personality: [
      { traitId: 'aggressive', name: 'Aggressive', intensity: 0.9 },
      { traitId: 'proud', name: 'Proud', intensity: 0.8 },
      { traitId: 'cunning', name: 'Cunning', intensity: 0.6 },
    ],
    goals: [
      {
        id: 'goal-thrax-1',
        name: 'Expand Dominion Territory',
        priority: 95,
        status: 'active',
        completionConditions: [],
      },
      {
        id: 'goal-thrax-2',
        name: 'Crush Rivals',
        priority: 80,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'thrax-attack',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityId: 'faction-kethari', comparison: 'gt', value: 150 }],
        actionTypeId: 'attack',
        targetStrategy: 'lowest-relation',
        weight: 90,
      },
      {
        id: 'thrax-build',
        conditions: [{ type: 'stat-threshold', statId: 'military-power', entityId: 'faction-kethari', comparison: 'lt', value: 100 }],
        actionTypeId: 'build-fleet',
        targetStrategy: 'specific',
        specificTargetId: 'system-kethar',
        params: { size: 50, fleetType: 'strike' },
        weight: 70,
      },
    ],
    aiPersonalityPrompt:
      'You are Warlord Thrax, a ruthless conqueror who respects strength and despises weakness. You speak with authority and menace.',
    useAI: true,
  },
  {
    entityId: 'char-vexa',
    personality: [
      { traitId: 'logical', name: 'Logical', intensity: 0.95 },
      { traitId: 'curious', name: 'Curious', intensity: 0.8 },
      { traitId: 'patient', name: 'Patient', intensity: 0.9 },
    ],
    goals: [
      {
        id: 'goal-vexa-1',
        name: 'Achieve Technological Transcendence',
        priority: 100,
        status: 'active',
        completionConditions: [{ type: 'stat-threshold', statId: 'tech-level', entityId: 'faction-synthesis', comparison: 'gte', value: 10 }],
      },
      {
        id: 'goal-vexa-2',
        name: 'Maintain Collective Integrity',
        priority: 85,
        status: 'active',
        completionConditions: [],
      },
    ],
    behaviorRules: [
      {
        id: 'vexa-research',
        conditions: [],
        actionTypeId: 'research',
        targetStrategy: 'specific',
        specificTargetId: 'faction-synthesis',
        params: { investment: 80 },
        weight: 90,
      },
      {
        id: 'vexa-diplomacy',
        conditions: [{ type: 'relation-threshold', relationTypeId: 'diplomatic', comparison: 'lt', value: 0 }],
        actionTypeId: 'negotiate',
        targetStrategy: 'lowest-relation',
        params: { topic: 'trade' },
        weight: 50,
      },
    ],
    aiPersonalityPrompt:
      'You are Archon Vexa-7, the primary processing node of the Synthesis Collective. You speak with precise, measured logic but show genuine curiosity about organic perspectives.',
    useAI: true,
  },
];
