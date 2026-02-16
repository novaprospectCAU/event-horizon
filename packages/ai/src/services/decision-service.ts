/**
 * DecisionService - implements DecisionAdvisorPort.
 * Uses AI to decide NPC actions with deterministic fallback.
 */

import type { AIContext, AIRequest, DecisionAdvisorPort } from '@event-horizon/types';
import type { AIProvider } from '../provider/provider-interface.js';
import type { ContextBuilder } from '../context/context-builder.js';
import type { PromptTemplateEngine } from '../prompt/template-engine.js';

/** Configuration for the DecisionService */
export interface DecisionServiceConfig {
  provider: AIProvider;
  contextBuilder: ContextBuilder;
  templateEngine: PromptTemplateEngine;
}

interface DecisionJSON {
  actionTypeId: string;
  targetId?: string;
  reasoning?: string;
}

export class DecisionService implements DecisionAdvisorPort {
  private readonly provider: AIProvider;
  private readonly contextBuilder: ContextBuilder;
  private readonly templateEngine: PromptTemplateEngine;

  constructor(config: DecisionServiceConfig) {
    this.provider = config.provider;
    this.contextBuilder = config.contextBuilder;
    this.templateEngine = config.templateEngine;
  }

  async decideAction(
    npcId: string,
    availableActions: readonly string[],
    context: AIContext,
  ): Promise<{ actionTypeId: string; targetId?: string; params?: Record<string, unknown> }> {
    try {
      const available = await this.provider.isAvailable();
      if (!available) {
        return this.fallback(availableActions);
      }

      const npcEntity = context.entities.find((e) => e.id === npcId);
      const npcName = npcEntity?.name ?? npcId;

      const renderedPrompt = this.templateEngine.render({
        templateId: 'npc-decision',
        variables: {
          npcName,
          personality: npcEntity?.metadata?.['aiPersonalityPrompt'] as string | undefined,
          goals: npcEntity?.metadata?.['goals'] as string | undefined,
          situation: context.situation,
          recentHistory: context.recentHistory.join('\n'),
          availableActions: availableActions.map((a, i) => `${i + 1}. ${a}`).join('\n'),
        },
      });

      const request: AIRequest = {
        type: 'npc-decision',
        context,
        prompt: renderedPrompt,
        temperature: 0.4,
      };

      const response = await this.provider.generate(request);
      const decision = this.parseDecision(response.content, availableActions);
      return decision;
    } catch {
      return this.fallback(availableActions);
    }
  }

  private parseDecision(
    content: string,
    availableActions: readonly string[],
  ): { actionTypeId: string; targetId?: string; params?: Record<string, unknown> } {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as DecisionJSON;
        if (parsed.actionTypeId && availableActions.includes(parsed.actionTypeId)) {
          return {
            actionTypeId: parsed.actionTypeId,
            targetId: parsed.targetId ?? undefined,
          };
        }
      } catch {
        // Fall through to fallback
      }
    }

    return this.fallback(availableActions);
  }

  private fallback(
    availableActions: readonly string[],
  ): { actionTypeId: string; targetId?: string; params?: Record<string, unknown> } {
    const actionTypeId = availableActions[0] ?? 'wait';
    return { actionTypeId };
  }
}
