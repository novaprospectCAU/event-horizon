/**
 * PromptTemplateEngine - template system for AI prompts.
 * Supports variable substitution and conditional sections.
 */

/** A registered prompt template */
export interface PromptTemplate {
  readonly id: string;
  readonly template: string;
  readonly description?: string;
}

/**
 * Simple template engine for AI prompt generation.
 *
 * Supports:
 * - Variable substitution: {{variableName}}
 * - Conditional sections: {{#if condition}}...{{/if}}
 */
export class PromptTemplateEngine {
  private readonly templates = new Map<string, PromptTemplate>();

  constructor() {
    this.registerBuiltinTemplates();
  }

  /** Register a custom template */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  /** Get a template by id */
  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  /** List all registered template ids */
  listTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  /**
   * Render a template with the given variables.
   * If templateId is provided, uses the registered template.
   * Otherwise, renders the rawTemplate string directly.
   */
  render(
    options: { templateId: string; variables?: Record<string, unknown> } | { rawTemplate: string; variables?: Record<string, unknown> },
  ): string {
    let template: string;
    if ('templateId' in options) {
      const registered = this.templates.get(options.templateId);
      if (!registered) {
        throw new Error(`Template not found: ${options.templateId}`);
      }
      template = registered.template;
    } else {
      template = options.rawTemplate;
    }

    const vars = options.variables ?? {};
    return this.processTemplate(template, vars);
  }

  private processTemplate(template: string, variables: Record<string, unknown>): string {
    // Process conditionals first: {{#if varName}}...{{/if}}
    let result = template.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, conditionKey: string, body: string) => {
        const value = variables[conditionKey];
        if (this.isTruthy(value)) {
          return body;
        }
        return '';
      },
    );

    // Process variable substitution: {{varName}}
    result = result.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = variables[key];
      if (value === undefined || value === null) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    });

    // Clean up blank lines left by removed conditionals
    result = result.replace(/\n{3,}/g, '\n\n');

    return result.trim();
  }

  private isTruthy(value: unknown): boolean {
    if (value === undefined || value === null || value === false || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  private registerBuiltinTemplates(): void {
    this.registerTemplate({
      id: 'dialogue-generation',
      description: 'Generate NPC dialogue',
      template: `Generate dialogue for the character "{{speakerName}}" in a game.

{{#if personality}}Character personality: {{personality}}{{/if}}
{{#if situation}}Current situation: {{situation}}{{/if}}
{{#if recentHistory}}Recent events:
{{recentHistory}}{{/if}}
{{#if playerInput}}The player said: "{{playerInput}}"{{/if}}

Write a short, in-character response. Stay true to the personality and current situation.
Do not include any meta-commentary or stage directions. Only output dialogue text.`,
    });

    this.registerTemplate({
      id: 'npc-decision',
      description: 'Decide next action for an NPC',
      template: `You are deciding the next action for NPC "{{npcName}}" in a game.

{{#if personality}}Personality: {{personality}}{{/if}}
{{#if goals}}Current goals: {{goals}}{{/if}}
{{#if situation}}Situation: {{situation}}{{/if}}
{{#if recentHistory}}Recent events:
{{recentHistory}}{{/if}}

Available actions:
{{availableActions}}

Choose the best action. Respond in JSON format:
{"actionTypeId": "<action_id>", "targetId": "<target_id_or_null>", "reasoning": "<brief_explanation>"}

Only output the JSON object.`,
    });

    this.registerTemplate({
      id: 'narrative-generation',
      description: 'Generate narrative text for events, actions, scenes, or arcs',
      template: `Generate narrative text for a {{narrativeType}} in a game.

{{#if situation}}Situation: {{situation}}{{/if}}
{{#if description}}Description: {{description}}{{/if}}
{{#if entities}}Key characters/entities: {{entities}}{{/if}}
{{#if recentHistory}}Recent events:
{{recentHistory}}{{/if}}
{{#if worldContext}}World context: {{worldContext}}{{/if}}

Write vivid, immersive narrative text (2-4 sentences). Use present tense.
Do not include any meta-commentary. Only output narrative text.`,
    });

    this.registerTemplate({
      id: 'free-text-response',
      description: 'Handle free-text player input',
      template: `The player has typed the following input in the game:
"{{playerInput}}"

{{#if situation}}Current situation: {{situation}}{{/if}}
{{#if worldContext}}World context: {{worldContext}}{{/if}}

Interpret the player's intent and generate an appropriate in-world response.
Stay consistent with the game world. Be concise.`,
    });
  }
}
