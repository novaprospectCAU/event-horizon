/**
 * DialogueService - implements DialogueGeneratorPort.
 * Generates NPC dialogue using AI with deterministic fallback.
 */

import type { AIContext, AIRequest, DialogueGeneratorPort } from '@event-horizon/types';
import type { AIProvider } from '../provider/provider-interface.js';
import type { ContextBuilder } from '../context/context-builder.js';
import type { PromptTemplateEngine } from '../prompt/template-engine.js';

/** Configuration for the DialogueService */
export interface DialogueServiceConfig {
  provider: AIProvider;
  contextBuilder: ContextBuilder;
  templateEngine: PromptTemplateEngine;
}

export class DialogueService implements DialogueGeneratorPort {
  private readonly provider: AIProvider;
  private readonly contextBuilder: ContextBuilder;
  private readonly templateEngine: PromptTemplateEngine;

  constructor(config: DialogueServiceConfig) {
    this.provider = config.provider;
    this.contextBuilder = config.contextBuilder;
    this.templateEngine = config.templateEngine;
  }

  async generateDialogue(
    speakerId: string,
    context: AIContext,
    prompt?: string,
  ): Promise<string> {
    try {
      const available = await this.provider.isAvailable();
      if (!available) {
        return this.fallback(speakerId, context);
      }

      const speakerEntity = context.entities.find((e) => e.id === speakerId);
      const speakerName = speakerEntity?.name ?? speakerId;

      const renderedPrompt = this.templateEngine.render({
        templateId: 'dialogue-generation',
        variables: {
          speakerName,
          personality: speakerEntity?.metadata?.['aiPersonalityPrompt'] as string | undefined,
          situation: context.situation,
          recentHistory: context.recentHistory.join('\n'),
          playerInput: prompt,
        },
      });

      const request: AIRequest = {
        type: 'dialogue-generation',
        context,
        prompt: renderedPrompt,
      };

      const response = await this.provider.generate(request);
      return response.content;
    } catch {
      return this.fallback(speakerId, context);
    }
  }

  private fallback(speakerId: string, context: AIContext): string {
    const speaker = context.entities.find((e) => e.id === speakerId);
    const name = speaker?.name ?? 'Someone';
    return `${name} regards you thoughtfully but says nothing of note.`;
  }
}
