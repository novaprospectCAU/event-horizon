/**
 * NarrativeService - implements NarrativeGeneratorPort.
 * Generates narrative text for events, actions, scenes, and arcs using AI.
 */

import type { AIContext, AIRequest, NarrativeGeneratorPort } from '@event-horizon/types';
import type { AIProvider } from '../provider/provider-interface.js';
import type { ContextBuilder } from '../context/context-builder.js';
import type { PromptTemplateEngine } from '../prompt/template-engine.js';

/** Configuration for the NarrativeService */
export interface NarrativeServiceConfig {
  provider: AIProvider;
  contextBuilder: ContextBuilder;
  templateEngine: PromptTemplateEngine;
}

/** Maps narrative types to AIRequestType */
const NARRATIVE_REQUEST_TYPE_MAP = {
  event: 'event-narrative',
  action: 'action-narrative',
  scene: 'scene-narrative',
  arc: 'narrative-generation',
} as const;

export class NarrativeService implements NarrativeGeneratorPort {
  private readonly provider: AIProvider;
  private readonly contextBuilder: ContextBuilder;
  private readonly templateEngine: PromptTemplateEngine;

  constructor(config: NarrativeServiceConfig) {
    this.provider = config.provider;
    this.contextBuilder = config.contextBuilder;
    this.templateEngine = config.templateEngine;
  }

  async generateNarrative(
    type: 'event' | 'action' | 'scene' | 'arc',
    context: AIContext,
    prompt?: string,
  ): Promise<string> {
    try {
      const available = await this.provider.isAvailable();
      if (!available) {
        return this.fallback(type, context, prompt);
      }

      const entityNames = context.entities.map((e) => e.name).join(', ');

      const renderedPrompt = this.templateEngine.render({
        templateId: 'narrative-generation',
        variables: {
          narrativeType: type,
          situation: context.situation,
          description: prompt,
          entities: entityNames || undefined,
          recentHistory: context.recentHistory.length > 0
            ? context.recentHistory.join('\n')
            : undefined,
          worldContext: context.worldContext,
        },
      });

      const requestType = NARRATIVE_REQUEST_TYPE_MAP[type];

      const request: AIRequest = {
        type: requestType,
        context,
        prompt: renderedPrompt,
      };

      const response = await this.provider.generate(request);
      return response.content;
    } catch {
      return this.fallback(type, context, prompt);
    }
  }

  private fallback(
    type: 'event' | 'action' | 'scene' | 'arc',
    context: AIContext,
    prompt?: string,
  ): string {
    if (prompt) return prompt;
    if (context.situation) return context.situation;
    return `A ${type} unfolds.`;
  }
}
