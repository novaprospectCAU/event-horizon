/**
 * Narrative System - story arcs, scenes, and dialogue trees.
 */

import type { Trigger, Effect } from './event.js';

/** Stage within a story arc */
export interface ArcStage {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  /** Conditions to advance to the next stage */
  readonly advanceConditions: readonly Trigger[];
  /** Conditions that cause the arc to fail */
  readonly failConditions?: readonly Trigger[];
  /** Effects applied when entering this stage */
  readonly onEnterEffects?: readonly Effect[];
  /** Scene to play when entering this stage */
  readonly sceneId?: string;
}

/** A multi-stage story progression */
export interface StoryArc {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly stages: readonly ArcStage[];
  /** Tags for categorization */
  readonly tags?: readonly string[];
  /** Priority for display ordering */
  readonly priority?: number;
}

/** State tracking for an active story arc */
export interface ArcState {
  readonly arcId: string;
  readonly currentStageIndex: number;
  readonly startedTurn: number;
  readonly completed: boolean;
  readonly failed: boolean;
}

/** Emotion/mood for dialogue */
export type Emotion = 'neutral' | 'happy' | 'angry' | 'sad' | 'fearful' | 'surprised' | 'disgusted' | 'contemptuous';

/** A single node in a dialogue tree */
export interface DialogueNode {
  readonly id: string;
  readonly speakerId: string;
  readonly text: string;
  readonly emotion?: Emotion;
  /** Player response options leading to other nodes */
  readonly responses?: readonly DialogueResponse[];
  /** Effects applied when this node is reached */
  readonly effects?: readonly Effect[];
  /** If true, AI generates the text dynamically */
  readonly aiGenerate?: boolean;
  /** AI generation prompt hint */
  readonly aiPrompt?: string;
  /** If true, this is a terminal node */
  readonly isEnd?: boolean;
}

/** A player response option in a dialogue */
export interface DialogueResponse {
  readonly id: string;
  readonly text: string;
  /** Node to go to when selected */
  readonly nextNodeId: string;
  /** Conditions for this response to be available */
  readonly conditions?: readonly Trigger[];
  /** Effects applied when selected */
  readonly effects?: readonly Effect[];
}

/** A dialogue tree with named nodes */
export interface DialogueTree {
  readonly id: string;
  readonly name?: string;
  readonly startNodeId: string;
  readonly nodes: readonly DialogueNode[];
}

/** A scene combining location, participants, dialogue, and narration */
export interface Scene {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly locationId?: string;
  readonly participantIds: readonly string[];
  readonly dialogue?: DialogueTree;
  /** Narrative text displayed at scene start */
  readonly narrativeText?: string;
  /** AI generates opening narration */
  readonly aiNarrative?: boolean;
  /** Effects applied when scene starts */
  readonly onStartEffects?: readonly Effect[];
  /** Effects applied when scene ends */
  readonly onEndEffects?: readonly Effect[];
}
