// Components
export {
  NarrativeLog,
  DialoguePanel,
  ChoicePanel,
  ActionPanel,
  StatsPanel,
  RelationshipView,
  TurnIndicator,
  MapView,
  SceneRenderer,
} from './components/index.js';

export type {
  NarrativeEntry,
  NarrativeLogProps,
  DialoguePanelProps,
  ChoicePanelProps,
  ActionPanelProps,
  StatsPanelProps,
  RelationshipViewProps,
  TurnIndicatorProps,
  MapViewProps,
  SceneRendererProps,
} from './components/index.js';

// Hooks
export { useEngine } from './hooks/useEngine.js';
export type { EngineConnection, UseEngineOptions, UseEngineReturn } from './hooks/useEngine.js';

export {
  useEntitiesByType,
  useEntitiesByTag,
  useEntity,
  useRelationsForEntity,
  useRelationBetween,
  useEntitiesAtLocation,
} from './hooks/useWorldState.js';

export { useDialogue } from './hooks/useDialogue.js';
export type { UseDialogueReturn } from './hooks/useDialogue.js';

// Store
export { createGameStore } from './stores/game-store.js';
export type { GameState, GameActions, GameStore, AvailableAction, AvailableResponse, SendMessageFn } from './stores/game-store.js';
