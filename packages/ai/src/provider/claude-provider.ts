/**
 * ClaudeProvider - AIProvider implementation for Anthropic Claude API.
 * Uses raw fetch, no SDK dependency.
 */

import type { AIProviderConfig, AIRequest, AIResponse } from '@event-horizon/types';
import type { AIProvider } from './provider-interface.js';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponseBody {
  id: string;
  content: Array<{ type: string; text?: string }>;
  model: string;
  usage?: { input_tokens: number; output_tokens: number };
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude';
  private readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const apiKey = this.config.apiKey;
    if (!apiKey) {
      throw new Error('Claude API key is not configured');
    }

    const messages: ClaudeMessage[] = [
      { role: 'user', content: request.prompt },
    ];

    const body = {
      model: this.config.model || 'claude-sonnet-4-20250514',
      max_tokens: request.maxTokens ?? this.config.maxTokens ?? 1024,
      temperature: request.temperature ?? this.config.temperature ?? 0.7,
      messages,
      system: this.buildSystemPrompt(request),
    };

    const response = await fetch(this.config.baseUrl ?? CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      throw new Error(`Claude API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as ClaudeResponseBody;

    const textContent = data.content
      .filter((block) => block.type === 'text' && block.text)
      .map((block) => block.text)
      .join('');

    return {
      type: request.type,
      content: textContent,
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
          }
        : undefined,
      metadata: { provider: 'claude', model: data.model },
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
