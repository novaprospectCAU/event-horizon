/**
 * Message utilities - type guards, factory functions, and serialization helpers
 * for the protocol message types.
 */

import type {
  EngineMessage,
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
  UIMessage,
  SubmitActionMessage,
  SelectChoiceMessage,
  SelectDialogueResponseMessage,
  FreeTextInputMessage,
  EndTurnMessage,
  SaveGameMessage,
  LoadGameMessage,
  StartGameMessage,
  Entity,
  Relation,
  TurnPhase,
  Action,
  ActionResult,
  Scene,
  DialogueNode,
  GameEvent,
  EventChoice,
} from '@event-horizon/types';

// ─── Engine Message Type Guards ───

/** Check if a message is a StateUpdateMessage */
export function isStateUpdate(msg: EngineMessage): msg is StateUpdateMessage {
  return msg.type === 'state-update';
}

/** Check if a message is a PhaseChangeMessage */
export function isPhaseChange(msg: EngineMessage): msg is PhaseChangeMessage {
  return msg.type === 'phase-change';
}

/** Check if a message is an AvailableActionsMessage */
export function isAvailableActions(msg: EngineMessage): msg is AvailableActionsMessage {
  return msg.type === 'available-actions';
}

/** Check if a message is an ActionResultMessage */
export function isActionResult(msg: EngineMessage): msg is ActionResultMessage {
  return msg.type === 'action-result';
}

/** Check if a message is a SceneStartMessage */
export function isSceneStart(msg: EngineMessage): msg is SceneStartMessage {
  return msg.type === 'scene-start';
}

/** Check if a message is a DialogueNodeMessage */
export function isDialogueNode(msg: EngineMessage): msg is DialogueNodeMessage {
  return msg.type === 'dialogue-node';
}

/** Check if a message is an EventFiredMessage */
export function isEventFired(msg: EngineMessage): msg is EventFiredMessage {
  return msg.type === 'event-fired';
}

/** Check if a message is a NarrativeMessage */
export function isNarrative(msg: EngineMessage): msg is NarrativeMessage {
  return msg.type === 'narrative';
}

/** Check if a message is a GameOverMessage */
export function isGameOver(msg: EngineMessage): msg is GameOverMessage {
  return msg.type === 'game-over';
}

/** Check if a message is an ErrorMessage */
export function isError(msg: EngineMessage): msg is ErrorMessage {
  return msg.type === 'error';
}

// ─── UI Message Type Guards ───

/** Check if a message is a SubmitActionMessage */
export function isSubmitAction(msg: UIMessage): msg is SubmitActionMessage {
  return msg.type === 'submit-action';
}

/** Check if a message is a SelectChoiceMessage */
export function isSelectChoice(msg: UIMessage): msg is SelectChoiceMessage {
  return msg.type === 'select-choice';
}

/** Check if a message is a SelectDialogueResponseMessage */
export function isSelectDialogueResponse(msg: UIMessage): msg is SelectDialogueResponseMessage {
  return msg.type === 'select-dialogue-response';
}

/** Check if a message is a FreeTextInputMessage */
export function isFreeTextInput(msg: UIMessage): msg is FreeTextInputMessage {
  return msg.type === 'free-text-input';
}

/** Check if a message is an EndTurnMessage */
export function isEndTurn(msg: UIMessage): msg is EndTurnMessage {
  return msg.type === 'end-turn';
}

/** Check if a message is a SaveGameMessage */
export function isSaveGame(msg: UIMessage): msg is SaveGameMessage {
  return msg.type === 'save-game';
}

/** Check if a message is a LoadGameMessage */
export function isLoadGame(msg: UIMessage): msg is LoadGameMessage {
  return msg.type === 'load-game';
}

/** Check if a message is a StartGameMessage */
export function isStartGame(msg: UIMessage): msg is StartGameMessage {
  return msg.type === 'start-game';
}

// ─── Engine Message Factory Functions ───

/** Create a StateUpdateMessage */
export function createStateUpdate(
  entities: Record<string, Entity>,
  relations: readonly Relation[],
  turn: number,
): StateUpdateMessage {
  return { type: 'state-update', entities, relations, turn };
}

/** Create a PhaseChangeMessage */
export function createPhaseChange(phase: TurnPhase): PhaseChangeMessage {
  return { type: 'phase-change', phase };
}

/** Create an AvailableActionsMessage */
export function createAvailableActions(
  entityId: string,
  actions: AvailableActionsMessage['actions'],
): AvailableActionsMessage {
  return { type: 'available-actions', entityId, actions };
}

/** Create an ActionResultMessage */
export function createActionResult(result: ActionResult): ActionResultMessage {
  return { type: 'action-result', result };
}

/** Create a SceneStartMessage */
export function createSceneStart(scene: Scene, narrative?: string): SceneStartMessage {
  return narrative !== undefined
    ? { type: 'scene-start', scene, narrative }
    : { type: 'scene-start', scene };
}

/** Create a DialogueNodeMessage */
export function createDialogueNode(
  node: DialogueNode,
  availableResponses: DialogueNodeMessage['availableResponses'],
): DialogueNodeMessage {
  return { type: 'dialogue-node', node, availableResponses };
}

/** Create an EventFiredMessage */
export function createEventFired(
  event: GameEvent,
  choices?: readonly EventChoice[],
  narrative?: string,
): EventFiredMessage {
  const msg: EventFiredMessage = { type: 'event-fired', event };
  if (choices !== undefined) {
    return narrative !== undefined
      ? { type: 'event-fired', event, choices, narrative }
      : { type: 'event-fired', event, choices };
  }
  if (narrative !== undefined) {
    return { type: 'event-fired', event, narrative };
  }
  return msg;
}

/** Create a NarrativeMessage */
export function createNarrative(text: string, source: string): NarrativeMessage {
  return { type: 'narrative', text, source };
}

/** Create a GameOverMessage */
export function createGameOver(reason: string, summary: string): GameOverMessage {
  return { type: 'game-over', reason, summary };
}

/** Create an ErrorMessage */
export function createError(code: string, message: string): ErrorMessage {
  return { type: 'error', code, message };
}

// ─── UI Message Factory Functions ───

/** Create a SubmitActionMessage */
export function createSubmitAction(action: Action): SubmitActionMessage {
  return { type: 'submit-action', action };
}

/** Create a SelectChoiceMessage */
export function createSelectChoice(eventId: string, choiceId: string): SelectChoiceMessage {
  return { type: 'select-choice', eventId, choiceId };
}

/** Create a SelectDialogueResponseMessage */
export function createSelectDialogueResponse(responseId: string): SelectDialogueResponseMessage {
  return { type: 'select-dialogue-response', responseId };
}

/** Create a FreeTextInputMessage */
export function createFreeTextInput(text: string, context: string): FreeTextInputMessage {
  return { type: 'free-text-input', text, context };
}

/** Create an EndTurnMessage */
export function createEndTurn(): EndTurnMessage {
  return { type: 'end-turn' };
}

/** Create a SaveGameMessage */
export function createSaveGame(name: string): SaveGameMessage {
  return { type: 'save-game', name };
}

/** Create a LoadGameMessage */
export function createLoadGame(saveId: string): LoadGameMessage {
  return { type: 'load-game', saveId };
}

/** Create a StartGameMessage */
export function createStartGame(schemaId: string, playerEntityId?: string): StartGameMessage {
  return playerEntityId !== undefined
    ? { type: 'start-game', schemaId, playerEntityId }
    : { type: 'start-game', schemaId };
}

// ─── Serialization Helpers ───

/** Serialize a protocol message to a JSON string */
export function serializeMessage(msg: EngineMessage | UIMessage): string {
  return JSON.stringify(msg);
}

/** Deserialize a JSON string into an EngineMessage */
export function deserializeEngineMessage(json: string): EngineMessage {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed) || typeof parsed['type'] !== 'string') {
    throw new Error('Invalid engine message: missing or non-string type field');
  }
  const validTypes = [
    'state-update', 'phase-change', 'available-actions', 'action-result',
    'scene-start', 'dialogue-node', 'event-fired', 'narrative',
    'game-over', 'error',
  ];
  if (!validTypes.includes(parsed['type'])) {
    throw new Error(`Invalid engine message type: ${parsed['type']}`);
  }
  return parsed as unknown as EngineMessage;
}

/** Deserialize a JSON string into a UIMessage */
export function deserializeUIMessage(json: string): UIMessage {
  const parsed: unknown = JSON.parse(json);
  if (!isRecord(parsed) || typeof parsed['type'] !== 'string') {
    throw new Error('Invalid UI message: missing or non-string type field');
  }
  const validTypes = [
    'submit-action', 'select-choice', 'select-dialogue-response',
    'free-text-input', 'end-turn', 'save-game', 'load-game', 'start-game',
  ];
  if (!validTypes.includes(parsed['type'])) {
    throw new Error(`Invalid UI message type: ${parsed['type']}`);
  }
  return parsed as unknown as UIMessage;
}

/** Type guard to check if a value is a non-null object with string keys */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
