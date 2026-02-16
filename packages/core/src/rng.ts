/**
 * Seeded pseudo-random number generator using mulberry32.
 * All random operations in the engine use this for deterministic replay.
 */

import type { RNGState } from '@event-horizon/types';

/**
 * Advance the RNG state and produce a random float in [0, 1).
 * Returns [value, newState] tuple for immutable usage.
 */
export function nextRandom(state: RNGState): [number, RNGState] {
  const nextState: RNGState = {
    seed: state.seed,
    callCount: state.callCount + 1,
  };

  // mulberry32 - derive value from seed + callCount
  let t = (state.seed + state.callCount * 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

  return [value, nextState];
}

/**
 * Create an initial RNG state from a seed.
 */
export function createRNGState(seed: number): RNGState {
  return { seed, callCount: 0 };
}

/**
 * Get a random integer in [min, max] (inclusive).
 */
export function nextRandomInt(
  state: RNGState,
  min: number,
  max: number,
): [number, RNGState] {
  const [value, newState] = nextRandom(state);
  const result = Math.floor(value * (max - min + 1)) + min;
  return [result, newState];
}

/**
 * Pick a random element from an array using weighted probabilities.
 * Weights do not need to sum to 1.
 */
export function weightedPick<T>(
  state: RNGState,
  items: readonly T[],
  weights: readonly number[],
): [T, RNGState] {
  if (items.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const [roll, newState] = nextRandom(state);
  const target = roll * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (target < cumulative) {
      return [items[i], newState];
    }
  }
  return [items[items.length - 1], newState];
}

/**
 * Generate a unique ID string using the RNG state.
 */
export function generateId(state: RNGState, prefix: string = ''): [string, RNGState] {
  const [val1, s1] = nextRandom(state);
  const [val2, s2] = nextRandom(s1);
  const id = `${prefix}${Math.floor(val1 * 0xffffffff).toString(16).padStart(8, '0')}${Math.floor(val2 * 0xffffffff).toString(16).padStart(8, '0')}`;
  return [id, s2];
}
