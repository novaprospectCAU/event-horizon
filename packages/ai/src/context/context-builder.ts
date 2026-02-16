/**
 * ContextBuilder - constructs AIContext from game state with token budget management.
 * Prioritizes content by relevance and fits within a token budget.
 */

import type { AIContext, Entity, Relation } from '@event-horizon/types';

/** Parameters for building an AIContext */
export interface ContextBuildParams {
  /** Current situation description */
  situation: string;
  /** All entities that could be relevant */
  entities: readonly Entity[];
  /** All relations that could be relevant */
  relations: readonly Relation[];
  /** Recent history entries, most recent first */
  recentHistory: readonly string[];
  /** Current turn number */
  turn: number;
  /** Active story arc names */
  activeArcs?: readonly string[];
  /** World/scenario flavor text */
  worldContext?: string;
  /** Entity IDs directly involved in the current interaction */
  relevantEntityIds?: readonly string[];
  /** Additional key-value context */
  extra?: Readonly<Record<string, unknown>>;
  /** Maximum estimated tokens for the context (default: 2000) */
  tokenBudget?: number;
}

/** Rough token estimate: ~4 chars per token */
const CHARS_PER_TOKEN = 4;

export class ContextBuilder {
  /**
   * Estimate the number of tokens in a string.
   * Uses a simple character-based heuristic.
   */
  estimateTokens(text: string): number {
    return Math.ceil(text.length / CHARS_PER_TOKEN);
  }

  /**
   * Build an AIContext that fits within the token budget.
   * Prioritizes content as follows:
   *  1. Always: situation, directly relevant entities
   *  2. If space: recent history, major relations
   *  3. Summarize: remaining entities to key stats
   *  4. Last to remove: distant past, unrelated entities
   */
  buildContext(params: ContextBuildParams): AIContext {
    const budget = params.tokenBudget ?? 2000;
    let tokensUsed = 0;

    // --- Priority 1: situation (always included) ---
    tokensUsed += this.estimateTokens(params.situation);

    // World context
    let worldContext: string | undefined;
    if (params.worldContext) {
      const worldTokens = this.estimateTokens(params.worldContext);
      if (tokensUsed + worldTokens < budget) {
        worldContext = params.worldContext;
        tokensUsed += worldTokens;
      }
    }

    // --- Priority 1: directly relevant entities ---
    const relevantIds = new Set(params.relevantEntityIds ?? []);
    const includedEntities: Entity[] = [];

    // Relevant entities first
    for (const entity of params.entities) {
      if (relevantIds.has(entity.id)) {
        const entityTokens = this.estimateEntityTokens(entity);
        if (tokensUsed + entityTokens < budget) {
          includedEntities.push(entity);
          tokensUsed += entityTokens;
        }
      }
    }

    // --- Priority 2: relations involving relevant entities ---
    const includedRelations: Relation[] = [];
    for (const relation of params.relations) {
      if (relevantIds.has(relation.sourceId) || relevantIds.has(relation.targetId)) {
        const relTokens = this.estimateRelationTokens(relation);
        if (tokensUsed + relTokens < budget) {
          includedRelations.push(relation);
          tokensUsed += relTokens;
        }
      }
    }

    // --- Priority 2: recent history ---
    const includedHistory: string[] = [];
    for (const entry of params.recentHistory) {
      const entryTokens = this.estimateTokens(entry);
      if (tokensUsed + entryTokens < budget) {
        includedHistory.push(entry);
        tokensUsed += entryTokens;
      } else {
        break;
      }
    }

    // --- Priority 3: remaining entities (summarized) ---
    for (const entity of params.entities) {
      if (relevantIds.has(entity.id)) continue;
      const summary = this.summarizeEntity(entity);
      const summaryTokens = this.estimateTokens(summary);
      if (tokensUsed + summaryTokens < budget) {
        includedEntities.push({
          ...entity,
          components: {},
          metadata: undefined,
        });
        tokensUsed += summaryTokens;
      }
    }

    // --- Priority 3: remaining relations ---
    for (const relation of params.relations) {
      if (relevantIds.has(relation.sourceId) || relevantIds.has(relation.targetId)) continue;
      const relTokens = this.estimateRelationTokens(relation);
      if (tokensUsed + relTokens < budget) {
        includedRelations.push(relation);
        tokensUsed += relTokens;
      }
    }

    return {
      situation: params.situation,
      entities: includedEntities,
      relations: includedRelations,
      recentHistory: includedHistory,
      turn: params.turn,
      activeArcs: params.activeArcs,
      worldContext,
      extra: params.extra,
    };
  }

  private estimateEntityTokens(entity: Entity): number {
    const text = `${entity.name} (${entity.typeId}) stats:${JSON.stringify(entity.stats)} components:${JSON.stringify(entity.components)}`;
    return this.estimateTokens(text);
  }

  private estimateRelationTokens(relation: Relation): number {
    const text = `${relation.sourceId}->${relation.targetId} ${relation.typeId} weight:${relation.weight}`;
    return this.estimateTokens(text);
  }

  private summarizeEntity(entity: Entity): string {
    const statEntries = Object.entries(entity.stats);
    const statsStr = statEntries.map(([k, v]) => `${k}:${v}`).join(',');
    return `${entity.name}(${entity.typeId})[${statsStr}]`;
  }
}
