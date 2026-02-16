/**
 * @event-horizon/core
 *
 * The core game engine for Event Horizon.
 * Provides all game systems: entity management, relations, events,
 * actions, turns, narrative, NPC behavior, and the main engine orchestrator.
 */

// Engine
export { Engine } from './engine.js';
export type { EngineConfig, TurnResult } from './engine.js';

// RNG
export {
  nextRandom,
  createRNGState,
  nextRandomInt,
  weightedPick,
  generateId,
} from './rng.js';

// Schema
export { SchemaRegistry } from './schema/registry.js';
export type { SchemaValidationError } from './schema/registry.js';
export { SchemaValidator } from './schema/validator.js';
export type { ValidationError } from './schema/validator.js';

// State
export { WorldStateManager } from './state/world-state.js';
export { Serializer } from './state/serializer.js';

// Entity
export { EntityManager } from './entity/entity-manager.js';

// Relation
export { RelationGraph } from './relation/relation-graph.js';

// Event
export { EventBus } from './event/event-bus.js';
export type {
  EngineEventMap,
  EngineEventType,
  Unsubscribe,
} from './event/event-bus.js';
export { EventEvaluator } from './event/event-evaluator.js';
export { EffectExecutor } from './event/effect-executor.js';
export type { EffectExecutionResult } from './event/effect-executor.js';

// Action
export { ActionValidator } from './action/action-validator.js';
export type { ActionValidationResult } from './action/action-validator.js';
export { ActionResolver } from './action/action-resolver.js';
export type { ActionHandler } from './action/action-resolver.js';
export { ActionRegistry } from './action/action-registry.js';
export type { AvailableAction } from './action/action-registry.js';

// Turn
export { TurnManager } from './turn/turn-manager.js';
export { PhaseRunner } from './turn/phase-runner.js';
export type { PhaseResult } from './turn/phase-runner.js';

// Narrative
export { SceneManager } from './narrative/scene-manager.js';
export type { ActiveScene } from './narrative/scene-manager.js';
export { ArcManager } from './narrative/arc-manager.js';
export { StoryManager } from './narrative/story-manager.js';
export { SceneRunner } from './narrative/scene-runner.js';
export type { ActiveScene as SceneRunnerActiveScene } from './narrative/scene-runner.js';
export { DialogueRunner } from './narrative/dialogue-runner.js';
export type { DialogueState } from './narrative/dialogue-runner.js';

// NPC
export { NPCController } from './npc/npc-controller.js';
export { BehaviorEngine } from './npc/behavior-engine.js';
export { GoalEvaluator } from './npc/goal-evaluator.js';
export type { GoalEvaluationResult } from './npc/goal-evaluator.js';
