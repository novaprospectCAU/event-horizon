/**
 * SceneManager - manages scenes, including starting, advancing dialogue,
 * and ending scenes within the world state.
 */

import type {
  WorldState,
  Scene,
  DialogueNode,
  DialogueTree,
} from '@event-horizon/types';
import type { EffectExecutor } from '../event/effect-executor.js';

/** Current scene state tracked during gameplay */
export interface ActiveScene {
  readonly sceneId: string;
  readonly currentNodeId: string | null;
  readonly started: boolean;
  readonly ended: boolean;
}

export class SceneManager {
  private activeScene: ActiveScene | null = null;

  constructor(private readonly effectExecutor: EffectExecutor) {}

  /**
   * Start a scene by ID. Applies onStartEffects and sets the active scene.
   */
  startScene(state: WorldState, sceneId: string): WorldState {
    const scene = state.scenes.find((s) => s.id === sceneId);
    if (!scene) {
      throw new Error(`Scene '${sceneId}' not found`);
    }

    let currentState = state;

    // Apply onStart effects
    if (scene.onStartEffects && scene.onStartEffects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        scene.onStartEffects,
        `scene:${sceneId}:start`,
      );
      currentState = result.state;
    }

    // Set active scene state
    this.activeScene = {
      sceneId,
      currentNodeId: scene.dialogue?.startNodeId ?? null,
      started: true,
      ended: false,
    };

    return currentState;
  }

  /**
   * Get the current dialogue node in the active scene.
   */
  getCurrentDialogueNode(state: WorldState): DialogueNode | null {
    if (!this.activeScene || !this.activeScene.currentNodeId) {
      return null;
    }

    const scene = state.scenes.find((s) => s.id === this.activeScene!.sceneId);
    if (!scene?.dialogue) return null;

    return (
      scene.dialogue.nodes.find(
        (n) => n.id === this.activeScene!.currentNodeId,
      ) ?? null
    );
  }

  /**
   * Select a dialogue response and advance to the next node.
   * Applies effects from the selected response.
   */
  selectResponse(
    state: WorldState,
    responseId: string,
  ): WorldState {
    if (!this.activeScene || !this.activeScene.currentNodeId) {
      throw new Error('No active scene or dialogue');
    }

    const scene = state.scenes.find((s) => s.id === this.activeScene!.sceneId);
    if (!scene?.dialogue) {
      throw new Error('Active scene has no dialogue tree');
    }

    const currentNode = scene.dialogue.nodes.find(
      (n) => n.id === this.activeScene!.currentNodeId,
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
        `dialogue:${responseId}`,
      );
      currentState = result.state;
    }

    // Advance to next node
    const nextNode = scene.dialogue.nodes.find(
      (n) => n.id === response.nextNodeId,
    );

    if (nextNode) {
      // Apply next node effects
      if (nextNode.effects && nextNode.effects.length > 0) {
        const result = this.effectExecutor.execute(
          currentState,
          nextNode.effects,
          `dialogue:${nextNode.id}`,
        );
        currentState = result.state;
      }

      this.activeScene = {
        ...this.activeScene,
        currentNodeId: nextNode.isEnd ? null : nextNode.id,
        ended: nextNode.isEnd ?? false,
      };

      if (nextNode.isEnd) {
        currentState = this.endScene(currentState);
      }
    } else {
      // Next node not found, end the scene
      this.activeScene = {
        ...this.activeScene,
        currentNodeId: null,
        ended: true,
      };
      currentState = this.endScene(currentState);
    }

    return currentState;
  }

  /**
   * End the active scene. Applies onEndEffects.
   */
  endScene(state: WorldState): WorldState {
    if (!this.activeScene) return state;

    const scene = state.scenes.find((s) => s.id === this.activeScene!.sceneId);
    let currentState = state;

    if (scene?.onEndEffects && scene.onEndEffects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        scene.onEndEffects,
        `scene:${scene.id}:end`,
      );
      currentState = result.state;
    }

    this.activeScene = null;
    return currentState;
  }

  /** Get the active scene state */
  getActiveScene(): ActiveScene | null {
    return this.activeScene;
  }

  /** Check if there is an active scene */
  hasActiveScene(): boolean {
    return this.activeScene !== null && !this.activeScene.ended;
  }

  /**
   * Register a new scene in the world state.
   */
  addScene(state: WorldState, scene: Scene): WorldState {
    return {
      ...state,
      scenes: [...state.scenes, scene],
    };
  }

  /**
   * Remove a scene from the world state.
   */
  removeScene(state: WorldState, sceneId: string): WorldState {
    return {
      ...state,
      scenes: state.scenes.filter((s) => s.id !== sceneId),
    };
  }
}
