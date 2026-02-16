/**
 * useDialogue hook - manages dialogue UI state.
 */

import { useCallback } from 'react';
import type { GameState } from '../stores/game-store.js';
import type { AvailableResponse } from '../stores/game-store.js';

export interface UseDialogueReturn {
  /** Whether a dialogue is currently active */
  isActive: boolean;
  /** Current dialogue node */
  speakerId: string | null;
  text: string | null;
  emotion: string | null;
  /** Available responses for the player */
  responses: readonly AvailableResponse[];
  /** Select a dialogue response */
  selectResponse: (responseId: string) => void;
}

export function useDialogue(
  state: GameState,
  onSelectResponse: (responseId: string) => void,
): UseDialogueReturn {
  const node = state.currentDialogueNode;

  const selectResponse = useCallback(
    (responseId: string) => {
      onSelectResponse(responseId);
    },
    [onSelectResponse],
  );

  return {
    isActive: node !== null,
    speakerId: node?.speakerId ?? null,
    text: node?.text ?? null,
    emotion: node?.emotion ?? null,
    responses: state.availableResponses,
    selectResponse,
  };
}
