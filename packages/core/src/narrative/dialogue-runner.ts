/**
 * DialogueRunner - navigates dialogue trees node by node,
 * filtering responses by conditions and applying node effects.
 */

import type {
  WorldState,
  DialogueTree,
  DialogueNode,
  DialogueResponse,
} from '@event-horizon/types';
import type { EventEvaluator } from '../event/event-evaluator.js';
import type { EffectExecutor } from '../event/effect-executor.js';
import type { EngineServices } from '@event-horizon/types';

/** State of an active dialogue */
export interface DialogueState {
  readonly treeId: string;
  readonly currentNodeId: string;
  readonly isComplete: boolean;
}

export class DialogueRunner {
  private dialogueState: DialogueState | null = null;
  private activeTree: DialogueTree | null = null;

  constructor(
    private readonly eventEvaluator: EventEvaluator,
    private readonly effectExecutor: EffectExecutor,
    private readonly services?: EngineServices,
  ) {}

  /**
   * Start a dialogue tree at its starting node.
   * Applies the start node's effects and returns the node with available responses.
   */
  startDialogue(
    state: WorldState,
    tree: DialogueTree,
  ): {
    state: WorldState;
    node: DialogueNode;
    availableResponses: readonly { id: string; text: string }[];
  } {
    this.activeTree = tree;
    const startNode = tree.nodes.find((n) => n.id === tree.startNodeId);

    if (!startNode) {
      throw new Error(
        `Start node '${tree.startNodeId}' not found in dialogue tree '${tree.id}'`,
      );
    }

    this.dialogueState = {
      treeId: tree.id,
      currentNodeId: startNode.id,
      isComplete: startNode.isEnd ?? false,
    };

    // Apply node effects
    let currentState = state;
    if (startNode.effects && startNode.effects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        startNode.effects,
        `dialogue:${tree.id}:node:${startNode.id}`,
      );
      currentState = result.state;
    }

    // Filter available responses
    const availableResponses = this.filterResponses(startNode, currentState);

    return { state: currentState, node: startNode, availableResponses };
  }

  /**
   * Select a response in the current dialogue, advancing to the next node.
   */
  selectResponse(
    state: WorldState,
    responseId: string,
  ): {
    state: WorldState;
    node: DialogueNode;
    availableResponses: readonly { id: string; text: string }[];
  } {
    if (!this.dialogueState || !this.activeTree) {
      throw new Error('No active dialogue');
    }

    const currentNode = this.activeTree.nodes.find(
      (n) => n.id === this.dialogueState!.currentNodeId,
    );
    if (!currentNode?.responses) {
      throw new Error('Current node has no responses');
    }

    const response = currentNode.responses.find((r) => r.id === responseId);
    if (!response) {
      throw new Error(`Response '${responseId}' not found`);
    }

    let currentState = state;

    // Apply response effects
    if (response.effects && response.effects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        response.effects,
        `dialogue:${this.activeTree.id}:response:${response.id}`,
      );
      currentState = result.state;
    }

    // Navigate to next node
    const nextNode = this.activeTree.nodes.find(
      (n) => n.id === response.nextNodeId,
    );
    if (!nextNode) {
      throw new Error(`Next node '${response.nextNodeId}' not found`);
    }

    this.dialogueState = {
      treeId: this.activeTree.id,
      currentNodeId: nextNode.id,
      isComplete: nextNode.isEnd ?? false,
    };

    // Apply next node effects
    if (nextNode.effects && nextNode.effects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        nextNode.effects,
        `dialogue:${this.activeTree.id}:node:${nextNode.id}`,
      );
      currentState = result.state;
    }

    const availableResponses = this.filterResponses(nextNode, currentState);

    return { state: currentState, node: nextNode, availableResponses };
  }

  /**
   * Get the text for a dialogue node, using AI generation if configured.
   */
  async getNodeText(
    state: WorldState,
    node: DialogueNode,
  ): Promise<string> {
    if (node.aiGenerate && this.services?.dialogueGenerator) {
      try {
        const speaker = state.entities[node.speakerId];
        const text = await this.services.dialogueGenerator.generateDialogue(
          node.speakerId,
          {
            situation: node.aiPrompt ?? '',
            entities: speaker ? [speaker] : [],
            relations: [],
            recentHistory: [],
            turn: state.turn.currentTurn,
          },
          node.aiPrompt,
        );
        return text;
      } catch {
        // Fall back to static text
        return node.text;
      }
    }
    return node.text;
  }

  /**
   * Filter available responses based on their conditions.
   */
  private filterResponses(
    node: DialogueNode,
    state: WorldState,
  ): readonly { id: string; text: string }[] {
    if (!node.responses) return [];

    const available: { id: string; text: string }[] = [];

    for (const response of node.responses) {
      if (response.conditions && response.conditions.length > 0) {
        const { result } = this.eventEvaluator.evaluateTriggers(
          response.conditions,
          state,
        );
        if (!result) continue;
      }
      available.push({ id: response.id, text: response.text });
    }

    return available;
  }

  /** Get the current dialogue state */
  getDialogueState(): DialogueState | null {
    return this.dialogueState;
  }

  /** Check if a dialogue is currently active */
  isDialogueActive(): boolean {
    return this.dialogueState !== null && !this.dialogueState.isComplete;
  }

  /** End the current dialogue */
  endDialogue(): void {
    this.dialogueState = null;
    this.activeTree = null;
  }
}
