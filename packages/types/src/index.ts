// Schema
export type {
  FieldType,
  FieldDef,
  ComponentDef,
  EntityTypeDef,
  StatDef,
  RelationTypeDef,
  ActionTypeDef,
  PhaseType,
  PhaseDef,
  AIMode,
  WorldConfig,
  WorldSchema,
} from './schema.js';

// Entity
export type {
  ComponentData,
  Entity,
  DeltaType,
  EntityDelta,
} from './entity.js';

// Relation
export type {
  Relation,
  RelationDelta,
  RelationQuery,
} from './relation.js';

// Event
export type {
  TriggerType,
  ComparisonOp,
  Trigger,
  EffectType,
  Effect,
  EventChoice,
  GameEvent,
} from './event.js';

// Action
export type {
  Action,
  ActionResult,
  PlayerTurnSubmission,
} from './action.js';

// Turn
export type {
  TurnPhase,
  TurnConfig,
  TurnState,
} from './turn.js';

// Narrative
export type {
  ArcStage,
  StoryArc,
  ArcState,
  Emotion,
  DialogueNode,
  DialogueResponse,
  DialogueTree,
  Scene,
} from './narrative.js';

// NPC
export type {
  PersonalityTrait,
  GoalStatus,
  Goal,
  TargetStrategy,
  BehaviorRule,
  NPCBehaviorProfile,
  MemoryEntry,
  NPCMemory,
} from './npc.js';

// World
export type {
  EventRecord,
  RNGState,
  WorldState,
  SaveState,
} from './world.js';

// Protocol
export type {
  StateUpdateMessage,
  PhaseChangeMessage,
  AvailableActionsMessage,
  ActionResultMessage,
  SceneStartMessage,
  DialogueNodeMessage,
  EventFiredMessage,
  NarrativeMessage,
  GameOverMessage,
  ErrorMessage,
  EngineMessage,
  SubmitActionMessage,
  SelectChoiceMessage,
  SelectDialogueResponseMessage,
  FreeTextInputMessage,
  EndTurnMessage,
  SaveGameMessage,
  LoadGameMessage,
  StartGameMessage,
  UIMessage,
} from './protocol.js';

// AI
export type {
  AIProviderType,
  AIProviderConfig,
  AIContext,
  AIRequestType,
  AIRequest,
  AIResponse,
  DialogueGeneratorPort,
  DecisionAdvisorPort,
  NarrativeGeneratorPort,
  SaveStoragePort,
  EngineServices,
} from './ai.js';
