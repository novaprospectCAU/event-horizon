/**
 * Protocol - JSON message-based communication between engine and UI.
 * This is the bridge that makes the engine UI-agnostic.
 */

import type { Action, ActionResult } from './action.js';
import type { Entity } from './entity.js';
import type { Relation } from './relation.js';
import type { TurnPhase } from './turn.js';
import type { Scene, DialogueNode } from './narrative.js';
import type { GameEvent, EventChoice } from './event.js';

// ─── Engine → UI Messages ───

export interface StateUpdateMessage {
  readonly type: 'state-update';
  readonly entities: Readonly<Record<string, Entity>>;
  readonly relations: readonly Relation[];
  readonly turn: number;
}

export interface PhaseChangeMessage {
  readonly type: 'phase-change';
  readonly phase: TurnPhase;
}

export interface AvailableActionsMessage {
  readonly type: 'available-actions';
  readonly entityId: string;
  readonly actions: readonly {
    readonly typeId: string;
    readonly name: string;
    readonly targets?: readonly string[];
    readonly enabled: boolean;
    readonly disabledReason?: string;
  }[];
}

export interface ActionResultMessage {
  readonly type: 'action-result';
  readonly result: ActionResult;
}

export interface SceneStartMessage {
  readonly type: 'scene-start';
  readonly scene: Scene;
  readonly narrative?: string;
}

export interface DialogueNodeMessage {
  readonly type: 'dialogue-node';
  readonly node: DialogueNode;
  readonly availableResponses: readonly {
    readonly id: string;
    readonly text: string;
  }[];
}

export interface EventFiredMessage {
  readonly type: 'event-fired';
  readonly event: GameEvent;
  readonly choices?: readonly EventChoice[];
  readonly narrative?: string;
}

export interface NarrativeMessage {
  readonly type: 'narrative';
  readonly text: string;
  readonly source: string;
}

export interface GameOverMessage {
  readonly type: 'game-over';
  readonly reason: string;
  readonly summary: string;
}

export interface ErrorMessage {
  readonly type: 'error';
  readonly code: string;
  readonly message: string;
}

export type EngineMessage =
  | StateUpdateMessage
  | PhaseChangeMessage
  | AvailableActionsMessage
  | ActionResultMessage
  | SceneStartMessage
  | DialogueNodeMessage
  | EventFiredMessage
  | NarrativeMessage
  | GameOverMessage
  | ErrorMessage;

// ─── UI → Engine Messages ───

export interface SubmitActionMessage {
  readonly type: 'submit-action';
  readonly action: Action;
}

export interface SelectChoiceMessage {
  readonly type: 'select-choice';
  readonly eventId: string;
  readonly choiceId: string;
}

export interface SelectDialogueResponseMessage {
  readonly type: 'select-dialogue-response';
  readonly responseId: string;
}

export interface FreeTextInputMessage {
  readonly type: 'free-text-input';
  readonly text: string;
  readonly context: string;
}

export interface EndTurnMessage {
  readonly type: 'end-turn';
}

export interface SaveGameMessage {
  readonly type: 'save-game';
  readonly name: string;
}

export interface LoadGameMessage {
  readonly type: 'load-game';
  readonly saveId: string;
}

export interface StartGameMessage {
  readonly type: 'start-game';
  readonly schemaId: string;
  readonly playerEntityId?: string;
}

export type UIMessage =
  | SubmitActionMessage
  | SelectChoiceMessage
  | SelectDialogueResponseMessage
  | FreeTextInputMessage
  | EndTurnMessage
  | SaveGameMessage
  | LoadGameMessage
  | StartGameMessage;
