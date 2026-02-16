/**
 * OpenAIProvider - AIProvider implementation for OpenAI API.
 * Uses raw fetch, no SDK dependency.
 */

import type { AIProviderConfig, AIRequest, AIResponse } from '@event-horizon/types';
import type { AIProvider } from './provider-interface.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponseBody {
  id: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const apiKey = this.config.apiKey;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: this.buildSystemPrompt(request) },
      { role: 'user', content: request.prompt },
    ];

    const body = {
      model: this.config.model || 'gpt-4o',
      max_tokens: request.maxTokens ?? this.config.maxTokens ?? 1024,
      temperature: request.temperature ?? this.config.temperature ?? 0.7,
      messages,
    };

    const response = await fetch(this.config.baseUrl ?? OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as OpenAIResponseBody;

    const content = data.choices[0]?.message?.content ?? '';

    return {
      type: request.type,
      content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
          }
        : undefined,
      metadata: { provider: 'openai', model: data.model },
    };
  }

  async isAvailable(): Promise<boolean> {
    return typeof this.config.apiKey === 'string' && this.config.apiKey.length > 0;
  }

  private buildSystemPrompt(request: AIRequest): string {
    const parts: string[] = [
      'You are an AI assistant embedded in a narrative game engine.',
      `Request type: ${request.type}`,
    ];

    const ctx = request.context;
    if (ctx.worldContext) {
      parts.push(`World: ${ctx.worldContext}`);
    }
    parts.push(`Current turn: ${ctx.turn}`);
    if (ctx.situation) {
      parts.push(`Situation: ${ctx.situation}`);
    }
    if (ctx.recentHistory.length > 0) {
      parts.push(`Recent history:\n${ctx.recentHistory.join('\n')}`);
    }
    if (ctx.activeArcs && ctx.activeArcs.length > 0) {
      parts.push(`Active story arcs: ${ctx.activeArcs.join(', ')}`);
    }

    return parts.join('\n\n');
  }
}
