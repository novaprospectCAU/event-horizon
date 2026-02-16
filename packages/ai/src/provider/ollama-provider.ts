/**
 * OllamaProvider - AIProvider implementation for local Ollama server.
 * Uses raw fetch, no SDK dependency.
 */

import type { AIProviderConfig, AIRequest, AIResponse } from '@event-horizon/types';
import type { AIProvider } from './provider-interface.js';

interface OllamaResponseBody {
  model: string;
  response: string;
  done: boolean;
  total_duration?: number;
  eval_count?: number;
  prompt_eval_count?: number;
}

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

export class OllamaProvider implements AIProvider {
  readonly name = 'ollama';
  private readonly config: AIProviderConfig;
  private readonly baseUrl: string;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl ?? DEFAULT_OLLAMA_URL;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(request);
    const fullPrompt = `${systemPrompt}\n\n${request.prompt}`;

    const body = {
      model: this.config.model || 'llama3',
      prompt: fullPrompt,
      stream: false,
      options: {
        temperature: request.temperature ?? this.config.temperature ?? 0.7,
        num_predict: request.maxTokens ?? this.config.maxTokens ?? 1024,
      },
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown error');
      throw new Error(`Ollama API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as OllamaResponseBody;

    return {
      type: request.type,
      content: data.response,
      usage:
        data.prompt_eval_count != null && data.eval_count != null
          ? {
              promptTokens: data.prompt_eval_count,
              completionTokens: data.eval_count,
            }
          : undefined,
      metadata: { provider: 'ollama', model: data.model },
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
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
