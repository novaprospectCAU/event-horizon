/**
 * NPCController - makes decisions for NPC entities using behavior rules,
 * personality, and optional AI advisor integration.
 */

import type {
  WorldState,
  Action,
  NPCBehaviorProfile,
  BehaviorRule,
  NPCMemory,
  MemoryEntry,
  DecisionAdvisorPort,
  Relation,
} from '@event-horizon/types';
import type { SchemaRegistry } from '../schema/registry.js';
import type { EventEvaluator } from '../event/event-evaluator.js';
import type { ActionValidator } from '../action/action-validator.js';
import { nextRandom, weightedPick, generateId } from '../rng.js';

export class NPCController {
  private decisionAdvisor: DecisionAdvisorPort | null = null;

  constructor(
    private readonly registry: SchemaRegistry,
    private readonly eventEvaluator: EventEvaluator,
    private readonly actionValidator: ActionValidator,
  ) {}

  /** Set the AI decision advisor for NPC decision making */
  setDecisionAdvisor(advisor: DecisionAdvisorPort): void {
    this.decisionAdvisor = advisor;
  }

  /**
   * Generate actions for all NPC entities in the current phase.
   * Uses behavior rules with weighted selection, falling back to AI if configured.
   */
  async generateNPCActions(state: WorldState): Promise<{
    actions: readonly Action[];
    state: WorldState;
  }> {
    const npcActions: Action[] = [];
    let currentState = state;

    for (const profile of state.npcProfiles) {
      const entity = state.entities[profile.entityId];
      if (!entity) continue;

      const { action, state: updatedState } = await this.decideAction(
        currentState,
        profile,
      );
      currentState = updatedState;

      if (action) {
        npcActions.push(action);
      }
    }

    return { actions: npcActions, state: currentState };
  }

  /**
   * Decide a single action for an NPC using behavior rules or AI.
   */
  private async decideAction(
    state: WorldState,
    profile: NPCBehaviorProfile,
  ): Promise<{ action: Action | null; state: WorldState }> {
    // Try AI decision first if configured
    if (profile.useAI && this.decisionAdvisor) {
      const aiAction = await this.tryAIDecision(state, profile);
      if (aiAction) return { action: aiAction.action, state: aiAction.state };
    }

    // Fall back to rule-based decision
    return this.ruleBasedDecision(state, profile);
  }

  /**
   * Rule-based NPC decision: evaluate conditions on each behavior rule
   * and use weighted random selection among applicable rules.
   */
  private ruleBasedDecision(
    state: WorldState,
    profile: NPCBehaviorProfile,
  ): { action: Action | null; state: WorldState } {
    let currentState = state;
    const applicableRules: BehaviorRule[] = [];

    // Evaluate which rules are applicable
    for (const rule of profile.behaviorRules) {
      if (rule.conditions.length === 0) {
        applicableRules.push(rule);
        continue;
      }

      const { result, state: evalState } =
        this.eventEvaluator.evaluateTriggers(rule.conditions, currentState);
      currentState = evalState;

      if (result) {
        applicableRules.push(rule);
      }
    }

    if (applicableRules.length === 0) {
      return { action: null, state: currentState };
    }

    // Weighted random selection among applicable rules
    const weights = applicableRules.map((r) => r.weight);
    const [selectedRule, newRng] = weightedPick(
      currentState.rng,
      applicableRules,
      weights,
    );
    currentState = { ...currentState, rng: newRng };

    // Resolve target
    const targetId = this.resolveTarget(
      currentState,
      profile.entityId,
      selectedRule,
    );

    // Generate action ID
    const [actionId, rngAfterGenId] = generateId(currentState.rng, 'act_');
    currentState = { ...currentState, rng: rngAfterGenId };

    const action: Action = {
      id: actionId,
      typeId: selectedRule.actionTypeId,
      performerId: profile.entityId,
      targetId,
      params: selectedRule.params,
      turn: state.turn.currentTurn,
      phase: state.turn.currentPhase.phaseId,
    };

    // Validate action before returning
    const validation = this.actionValidator.validate(currentState, action);
    if (!validation.valid) {
      return { action: null, state: currentState };
    }

    return { action, state: currentState };
  }

  /**
   * Resolve the target entity for an NPC action based on the rule's target strategy.
   */
  private resolveTarget(
    state: WorldState,
    npcId: string,
    rule: BehaviorRule,
  ): string | undefined {
    switch (rule.targetStrategy) {
      case 'specific':
        return rule.specificTargetId;

      case 'highest-relation': {
        const relations = state.relations.filter(
          (r) => r.sourceId === npcId,
        );
        if (relations.length === 0) return undefined;
        const best = relations.reduce((a, b) =>
          a.weight > b.weight ? a : b,
        );
        return best.targetId;
      }

      case 'lowest-relation': {
        const relations = state.relations.filter(
          (r) => r.sourceId === npcId,
        );
        if (relations.length === 0) return undefined;
        const worst = relations.reduce((a, b) =>
          a.weight < b.weight ? a : b,
        );
        return worst.targetId;
      }

      case 'nearest': {
        const npc = state.entities[npcId];
        if (!npc?.locationId) return undefined;
        const nearby = Object.values(state.entities).filter(
          (e) => e.id !== npcId && e.locationId === npc.locationId,
        );
        return nearby[0]?.id;
      }

      case 'random': {
        const candidates = Object.values(state.entities).filter(
          (e) => e.id !== npcId,
        );
        if (candidates.length === 0) return undefined;
        const [roll] = nextRandom(state.rng);
        const index = Math.floor(roll * candidates.length);
        return candidates[index]?.id;
      }

      case 'custom':
        return undefined;

      default:
        return undefined;
    }
  }

  /**
   * Try to use the AI decision advisor for an NPC action.
   */
  private async tryAIDecision(
    state: WorldState,
    profile: NPCBehaviorProfile,
  ): Promise<{ action: Action; state: WorldState } | null> {
    if (!this.decisionAdvisor) return null;

    const entity = state.entities[profile.entityId];
    if (!entity) return null;

    // Build AI context
    const availableActions = this.actionValidator.getAvailableActions(
      state,
      profile.entityId,
    );
    const actionTypeIds = availableActions
      .filter((a) => a.enabled)
      .map((a) => a.typeId);

    if (actionTypeIds.length === 0) return null;

    try {
      const decision = await this.decisionAdvisor.decideAction(
        profile.entityId,
        actionTypeIds,
        {
          situation: profile.aiPersonalityPrompt ?? '',
          entities: Object.values(state.entities),
          relations: state.relations,
          recentHistory: [],
          turn: state.turn.currentTurn,
        },
      );

      const [actionId, newRng] = generateId(state.rng, 'act_');
      const action: Action = {
        id: actionId,
        typeId: decision.actionTypeId,
        performerId: profile.entityId,
        targetId: decision.targetId,
        params: decision.params,
        turn: state.turn.currentTurn,
        phase: state.turn.currentPhase.phaseId,
      };

      const updatedState = { ...state, rng: newRng };
      const validation = this.actionValidator.validate(updatedState, action);
      if (!validation.valid) return null;

      return { action, state: updatedState };
    } catch {
      // AI failure, fall back to rules
      return null;
    }
  }

  /**
   * Update NPC memory, applying decay and adding new entries.
   */
  updateMemory(
    state: WorldState,
    entityId: string,
    newEntry?: Omit<MemoryEntry, 'id' | 'strength'>,
  ): WorldState {
    const memoryIndex = state.npcMemories.findIndex(
      (m) => m.entityId === entityId,
    );

    let memory: NPCMemory;
    if (memoryIndex === -1) {
      memory = { entityId, memories: [] };
    } else {
      memory = state.npcMemories[memoryIndex];
    }

    // Apply decay to existing memories
    let decayedMemories = memory.memories.map((m) => ({
      ...m,
      strength: Math.max(0, m.strength - m.decayRate),
    }));

    // Remove fully decayed memories
    decayedMemories = decayedMemories.filter((m) => m.strength > 0);

    // Add new entry if provided
    if (newEntry) {
      const [id, newRng] = generateId(state.rng, 'mem_');
      const entry: MemoryEntry = {
        ...newEntry,
        id,
        strength: 1.0,
      };
      decayedMemories = [...decayedMemories, entry];
      state = { ...state, rng: newRng };
    }

    const updatedMemory: NPCMemory = {
      entityId,
      memories: decayedMemories,
    };

    const newMemories =
      memoryIndex === -1
        ? [...state.npcMemories, updatedMemory]
        : state.npcMemories.map((m, i) =>
            i === memoryIndex ? updatedMemory : m,
          );

    return { ...state, npcMemories: newMemories };
  }

  /**
   * Decay all NPC memories at the end of a turn.
   */
  decayAllMemories(state: WorldState): WorldState {
    let currentState = state;
    for (const memory of state.npcMemories) {
      currentState = this.updateMemory(currentState, memory.entityId);
    }
    return currentState;
  }
}
