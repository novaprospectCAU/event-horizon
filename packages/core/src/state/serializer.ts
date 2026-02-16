/**
 * Serializer - converts WorldState to/from JSON SaveState format.
 * Handles version compatibility checking.
 */

import type { WorldState, SaveState } from '@event-horizon/types';

/** Current serialization format version */
const SERIALIZER_VERSION = '1.0.0';

export class Serializer {
  /**
   * Serialize a WorldState into a JSON string (SaveState format).
   * @param state The world state to serialize
   * @param name A human-readable name for the save
   */
  serialize(state: WorldState, name: string): string {
    const saveState: SaveState = {
      version: SERIALIZER_VERSION,
      timestamp: new Date().toISOString(),
      name,
      worldState: state,
    };
    return JSON.stringify(saveState);
  }

  /**
   * Deserialize a JSON string back into a WorldState.
   * @throws Error if JSON is invalid or version is incompatible
   */
  deserialize(json: string): WorldState {
    let saveState: SaveState;
    try {
      saveState = JSON.parse(json) as SaveState;
    } catch {
      throw new Error('Invalid save data: malformed JSON');
    }

    if (!saveState.version) {
      throw new Error('Invalid save data: missing version');
    }

    if (!this.isVersionCompatible(saveState.version)) {
      throw new Error(
        `Incompatible save version: ${saveState.version} (current: ${SERIALIZER_VERSION})`,
      );
    }

    if (!saveState.worldState) {
      throw new Error('Invalid save data: missing worldState');
    }

    return saveState.worldState;
  }

  /**
   * Extract save metadata without fully deserializing.
   */
  extractMetadata(json: string): {
    version: string;
    timestamp: string;
    name: string;
  } {
    let data: SaveState;
    try {
      data = JSON.parse(json) as SaveState;
    } catch {
      throw new Error('Invalid save data: malformed JSON');
    }
    return {
      version: data.version,
      timestamp: data.timestamp,
      name: data.name,
    };
  }

  /**
   * Check if a save version is compatible with the current serializer.
   * Compatible if major versions match.
   */
  isVersionCompatible(version: string): boolean {
    const currentMajor = SERIALIZER_VERSION.split('.')[0];
    const saveMajor = version.split('.')[0];
    return currentMajor === saveMajor;
  }

  /** Get the current serializer version */
  getVersion(): string {
    return SERIALIZER_VERSION;
  }
}
