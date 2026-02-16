/**
 * AI System types - provider configuration, context, and request/response.
 * The core engine never imports this directly; it uses port interfaces instead.
 */

import type { Entity } from './entity.js';
import type { Relation } from './relation.js';

/** Supported AI provider types */
export type AIProviderType = 'claude' | 'openai' | 'ollama' | 'custom';

/** Configuration for an AI provider */
export interface AIProviderConfig {
  readonly type: AIProviderType;
  readonly model: string;
  readonly apiKey?: string;
  readonly baseUrl?: string;
  readonly maxTokens?: number;
  readonly temperature?: number;
  readonly options?: Readonly<Record<string, unknown>>;
}

/** Context provided to AI for generating responses */
export interface AIContext {
  /** Current game situation summary */
  readonly situation: string;
  /** Relevant entities */
  readonly entities: readonly Entity[];
  /** Relevant relations */
  readonly relations: readonly Relation[];
  /** Recent event history summaries */
  readonly recentHistory: readonly string[];
  /** Current turn number */
  readonly turn: number;
  /** Active story arcs and their states */
  readonly activeArcs?: readonly string[];
  /** World/scenario flavor text */
  readonly worldContext?: string;
  /** Additional key-value context */
  readonly extra?: Readonly<Record<string, unknown>>;
}

/** Types of AI requests */
export type AIRequestType =
  | 'dialogue-generation'
  | 'npc-decision'
  | 'narrative-generation'
  | 'event-narrative'
  | 'action-narrative'
  | 'scene-narrative'
  | 'free-text-response'
  | 'dynamic-event';

/** A request to the AI system */
export interface AIRequest {
  readonly type: AIRequestType;
  readonly context: AIContext;
  readonly prompt: string;
  /** Structured parameters specific to the request type */
  readonly params?: Readonly<Record<string, unknown>>;
  /** Token budget for this request */
  readonly maxTokens?: number;
  /** Temperature override */
  readonly temperature?: number;
}

/** A response from the AI system */
export interface AIResponse {
  readonly type: AIRequestType;
  readonly content: string;
  /** Structured data extracted from AI response */
  readonly structured?: Readonly<Record<string, unknown>>;
  /** Token usage */
  readonly usage?: {
    readonly promptTokens: number;
    readonly completionTokens: number;
  };
  /** Provider metadata */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

// ─── Port Interfaces (used by core engine via dependency injection) ───

/** Port for generating dialogue text */
export interface DialogueGeneratorPort {
  generateDialogue(
    speakerId: string,
    context: AIContext,
    prompt?: string,
  ): Promise<string>;
}

/** Port for NPC decision making */
export interface DecisionAdvisorPort {
  decideAction(
    npcId: string,
    availableActions: readonly string[],
    context: AIContext,
  ): Promise<{ actionTypeId: string; targetId?: string; params?: Record<string, unknown> }>;
}

/** Port for generating narrative text */
export interface NarrativeGeneratorPort {
  generateNarrative(
    type: 'event' | 'action' | 'scene' | 'arc',
    context: AIContext,
    prompt?: string,
  ): Promise<string>;
}

/** Port for save/load storage */
export interface SaveStoragePort {
  save(id: string, data: string): Promise<void>;
  load(id: string): Promise<string | null>;
  list(): Promise<readonly string[]>;
  remove(id: string): Promise<void>;
}

/** All injectable services for the engine */
export interface EngineServices {
  dialogueGenerator?: DialogueGeneratorPort;
  decisionAdvisor?: DecisionAdvisorPort;
  narrativeGenerator?: NarrativeGeneratorPort;
  saveStorage?: SaveStoragePort;
}
