/**
 * SceneRunner - manages scene lifecycle including start effects,
 * narrative delivery, and end effects.
 */

import type {
  WorldState,
  Scene,
} from '@event-horizon/types';
import type { EffectExecutor } from '../event/effect-executor.js';
import type { EventBus } from '../event/event-bus.js';
import type { EngineServices } from '@event-horizon/types';

/** Active scene tracking */
export interface ActiveScene {
  readonly sceneId: string;
  readonly scene: Scene;
  readonly narrative: string | undefined;
  readonly startedTurn: number;
}

export class SceneRunner {
  private activeScene: ActiveScene | null = null;

  constructor(
    private readonly effectExecutor: EffectExecutor,
    private readonly eventBus: EventBus,
    private readonly services?: EngineServices,
  ) {}

  /**
   * Start a scene. Applies onStartEffects and generates narrative.
   * Returns the updated state and narrative text.
   */
  async startScene(
    state: WorldState,
    sceneId: string,
  ): Promise<{ state: WorldState; narrative: string | undefined }> {
    const scene = state.scenes.find((s) => s.id === sceneId);
    if (!scene) {
      throw new Error(`Scene '${sceneId}' not found`);
    }

    let currentState = state;
    let narrative = scene.narrativeText;

    // Apply onStart effects
    if (scene.onStartEffects && scene.onStartEffects.length > 0) {
      const result = this.effectExecutor.execute(
        currentState,
        scene.onStartEffects,
        `scene:${sceneId}:start`,
      );
      currentState = result.state;
    }

    // Generate AI narrative if configured
    if (scene.aiNarrative && this.services?.narrativeGenerator) {
      try {
        narrative = await this.services.narrativeGenerator.generateNarrative(
          'scene',
          {
            situation: scene.description ?? scene.name,
            entities: scene.participantIds
              .map((id) => currentState.entities[id])
              .filter((e): e is NonNullable<typeof e> => e !== undefined),
            relations: [],
            recentHistory: [],
            turn: currentState.turn.currentTurn,
          },
          scene.description,
        );
      } catch {
        // Fallback to static narrative if AI fails
        narrative = scene.narrativeText ?? scene.description ?? scene.name;
      }
    }

    this.activeScene = {
      sceneId,
      scene,
      narrative,
      startedTurn: currentState.turn.currentTurn,
    };

    return { state: currentState, narrative };
  }

  /**
   * End the current active scene. Applies onEndEffects.
   */
  endScene(state: WorldState): WorldState {
    if (!this.activeScene) return state;

    const scene = this.activeScene.scene;
    let currentState = state;

    // Apply onEnd effects
    if (scene.onEndEffects && scene.onEndEffects.length > 0) {
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

  /** Get the currently active scene, if any */
  getActiveScene(): ActiveScene | null {
    return this.activeScene;
  }

  /** Check if a scene is currently active */
  isSceneActive(): boolean {
    return this.activeScene !== null;
  }
}
