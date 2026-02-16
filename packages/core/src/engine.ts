/**
 * Engine - the main game engine orchestrator.
 * Wires together all subsystems and provides the top-level API
 * for running a game.
 */

import type {
  WorldSchema,
  WorldState,
  Action,
  ActionResult,
  GameEvent,
  EngineServices,
} from '@event-horizon/types';

import { SchemaRegistry } from './schema/registry.js';
import { SchemaValidator } from './schema/validator.js';
import { WorldStateManager } from './state/world-state.js';
import { Serializer } from './state/serializer.js';
import { EntityManager } from './entity/entity-manager.js';
import { RelationGraph } from './relation/relation-graph.js';
import { EventBus } from './event/event-bus.js';
import { EventEvaluator } from './event/event-evaluator.js';
import { EffectExecutor } from './event/effect-executor.js';
import { ActionValidator } from './action/action-validator.js';
import { ActionResolver } from './action/action-resolver.js';
import { TurnManager } from './turn/turn-manager.js';
import { PhaseRunner } from './turn/phase-runner.js';
import { SceneManager } from './narrative/scene-manager.js';
import { ArcManager } from './narrative/arc-manager.js';
import { NPCController } from './npc/npc-controller.js';
import type { ActionHandler } from './action/action-resolver.js';
import type { PhaseResult } from './turn/phase-runner.js';

/** Configuration for creating an Engine instance */
export interface EngineConfig {
  readonly schema: WorldSchema;
  readonly services?: EngineServices;
}

/** Result of processing a turn or phase */
export interface TurnResult {
  readonly state: WorldState;
  readonly phaseResults: readonly PhaseResult[];
  readonly turnComplete: boolean;
}

export class Engine {
  // Core subsystems
  readonly registry: SchemaRegistry;
  readonly validator: SchemaValidator;
  readonly worldStateManager: WorldStateManager;
  readonly serializer: Serializer;
  readonly entityManager: EntityManager;
  readonly relationGraph: RelationGraph;
  readonly eventBus: EventBus;
  readonly eventEvaluator: EventEvaluator;
  readonly effectExecutor: EffectExecutor;
  readonly actionValidator: ActionValidator;
  readonly actionResolver: ActionResolver;
  readonly turnManager: TurnManager;
  readonly phaseRunner: PhaseRunner;
  readonly sceneManager: SceneManager;
  readonly arcManager: ArcManager;
  readonly npcController: NPCController;

  private state: WorldState | null = null;

  constructor(config: EngineConfig) {
    // Initialize core subsystems
    this.registry = new SchemaRegistry();
    this.validator = new SchemaValidator(this.registry);
    this.worldStateManager = new WorldStateManager();
    this.serializer = new Serializer();
    this.eventBus = new EventBus();
    this.eventEvaluator = new EventEvaluator();
    this.entityManager = new EntityManager(this.registry);
    this.relationGraph = new RelationGraph(this.registry);
    this.effectExecutor = new EffectExecutor(this.entityManager, this.relationGraph);
    this.actionValidator = new ActionValidator(this.registry);
    this.actionResolver = new ActionResolver(
      this.registry,
      this.actionValidator,
      this.eventBus,
    );
    this.turnManager = new TurnManager(this.registry, this.eventBus);
    this.phaseRunner = new PhaseRunner(
      this.actionResolver,
      this.eventEvaluator,
      this.effectExecutor,
      this.entityManager,
      this.relationGraph,
      this.eventBus,
    );
    this.sceneManager = new SceneManager(this.effectExecutor);
    this.arcManager = new ArcManager(
      this.eventEvaluator,
      this.effectExecutor,
      this.eventBus,
    );
    this.npcController = new NPCController(
      this.registry,
      this.eventEvaluator,
      this.actionValidator,
    );

    // Register schema
    const errors = this.registry.register(config.schema);
    if (errors.length > 0) {
      throw new Error(
        `Schema validation failed:\n${errors.map((e) => `  ${e.path}: ${e.message}`).join('\n')}`,
      );
    }

    // Wire up optional services
    if (config.services?.decisionAdvisor) {
      this.npcController.setDecisionAdvisor(config.services.decisionAdvisor);
    }
  }

  /**
   * Initialize the game by creating the initial world state.
   */
  initialize(): WorldState {
    const schema = this.registry.getSchema();
    this.state = this.worldStateManager.createInitialState(schema);
    this.relationGraph.buildIndex(this.state.relations);
    return this.state;
  }

  /** Get the current world state */
  getState(): WorldState {
    if (!this.state) {
      throw new Error('Engine not initialized. Call initialize() first.');
    }
    return this.state;
  }

  /** Set the world state (e.g., after loading a save) */
  setState(state: WorldState): void {
    this.state = state;
    this.relationGraph.buildIndex(state.relations);
  }

  /**
   * Submit player actions for the current phase.
   * Resolves actions and advances to the next phase.
   */
  submitActions(actions: readonly Action[]): PhaseResult {
    const state = this.getState();
    const phaseResult = this.phaseRunner.runPlayerActionPhase(state, actions);
    this.state = phaseResult.state;
    return phaseResult;
  }

  /**
   * Advance to the next phase. If the current phase doesn't require
   * player input, it runs automatically.
   */
  async advancePhase(): Promise<PhaseResult> {
    let state = this.getState();
    const phaseType = this.turnManager.getCurrentPhaseType(state);

    let phaseResult: PhaseResult;

    switch (phaseType) {
      case 'npc-action': {
        const { actions: npcActions, state: npcState } =
          await this.npcController.generateNPCActions(state);
        state = npcState;
        phaseResult = this.phaseRunner.runNPCActionPhase(state, npcActions);
        break;
      }

      case 'event-resolution':
        phaseResult = this.phaseRunner.runEventResolutionPhase(state);
        break;

      case 'world-update':
        phaseResult = this.phaseRunner.runWorldUpdatePhase(state);
        break;

      case 'custom':
        phaseResult = this.phaseRunner.runCustomPhase(state);
        break;

      default:
        phaseResult = { state, actionResults: [], firedEvents: [] };
        break;
    }

    // Evaluate arcs after each phase
    let postPhaseState = this.arcManager.evaluateArcs(phaseResult.state);

    // Advance to next phase
    postPhaseState = this.turnManager.advancePhase(postPhaseState);
    this.state = postPhaseState;

    return {
      state: this.state,
      actionResults: phaseResult.actionResults,
      firedEvents: phaseResult.firedEvents,
    };
  }

  /**
   * Run all remaining non-player phases in the current turn.
   * Stops when a player-action phase is reached or the turn completes.
   */
  async runUntilPlayerInput(): Promise<TurnResult> {
    const phaseResults: PhaseResult[] = [];

    while (true) {
      const state = this.getState();

      if (state.turn.isComplete) {
        break;
      }

      if (state.turn.awaitingInput) {
        break;
      }

      const result = await this.advancePhase();
      phaseResults.push(result);
    }

    return {
      state: this.getState(),
      phaseResults,
      turnComplete: this.getState().turn.isComplete,
    };
  }

  /**
   * Advance to the next turn, resetting phases.
   * Also decays NPC memories.
   */
  advanceTurn(): WorldState {
    let state = this.getState();
    state = this.npcController.decayAllMemories(state);
    state = this.turnManager.advanceTurn(state);
    this.state = state;
    return this.state;
  }

  /**
   * Register an action handler for a specific action type.
   */
  registerActionHandler(actionTypeId: string, handler: ActionHandler): void {
    this.actionResolver.registerHandler(actionTypeId, handler);
  }

  /**
   * Save the current game state.
   */
  save(name: string): string {
    const state = this.getState();
    return this.serializer.serialize(state, name);
  }

  /**
   * Load a previously saved game state.
   */
  load(json: string): WorldState {
    const state = this.serializer.deserialize(json);
    this.setState(state);
    return state;
  }

  /**
   * Dispose the engine and clean up all resources.
   */
  dispose(): void {
    this.eventBus.clear();
    this.state = null;
  }
}
