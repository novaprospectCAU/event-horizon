import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  useEngine,
  useEntitiesByType,
  useRelationsForEntity,
  MapView,
  TurnIndicator,
  NarrativeLog,
  ActionPanel,
  ChoicePanel,
  StatsPanel,
  RelationshipView,
  SceneRenderer,
} from '@event-horizon/web-runtime';
import type { EngineConnection } from '@event-horizon/web-runtime';
import type { Action } from '@event-horizon/types';
import { sfSchema } from '@event-horizon/demo-sf';
import { GameController } from './game-controller.js';
import './styles.css';

export const App: React.FC = () => {
  const controllerRef = useRef<GameController | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [dismissedError, setDismissedError] = useState(false);
  const [dismissedEventId, setDismissedEventId] = useState<string | null>(null);

  const createConnection = useCallback((): EngineConnection => {
    const controller = new GameController();
    controllerRef.current = controller;
    const adapter = controller.getClientAdapter();
    return {
      send: (msg) => adapter.send(msg),
      onMessage: (handler) => {
        adapter.onMessage(handler);
      },
      dispose: () => controller.dispose(),
    };
  }, []);

  // Memoize options object so useEngine's useEffect doesn't re-run on every render
  const engineOptions = useMemo(() => ({ createConnection }), [createConnection]);

  const { state, selectChoice, selectDialogueResponse, endTurn } = useEngine(engineOptions);

  const systems = useEntitiesByType(state, 'system');
  const selectedEntity = selectedEntityId
    ? state.entities[selectedEntityId]
    : null;
  const selectedRelations = useRelationsForEntity(
    state,
    selectedEntityId ?? '',
  );

  const statDefs = sfSchema.stats;
  const relationTypeDefs = sfSchema.relationTypes;

  const handleSelectSystem = useCallback(
    (systemId: string) => {
      setSelectedEntityId((prev) => (prev === systemId ? null : systemId));
    },
    [],
  );

  const handleSelectEntity = useCallback(
    (entityId: string) => {
      setSelectedEntityId((prev) => (prev === entityId ? null : entityId));
    },
    [],
  );

  const handleSubmitAction = useCallback(
    (typeId: string, targetId?: string) => {
      const adapter = controllerRef.current?.getClientAdapter();
      if (!adapter) return;

      const action: Action = {
        id: `action-${Date.now()}`,
        typeId,
        performerId: '',
        targetId,
        turn: state.currentTurn,
        phase: state.currentPhase?.phaseId ?? 'player-action',
      };

      adapter.send({ type: 'submit-action', action });
    },
    [state.currentTurn, state.currentPhase],
  );

  const handleSelectChoice = useCallback(
    (choiceId: string) => {
      if (state.currentEvent) {
        selectChoice(state.currentEvent.id, choiceId);
        setDismissedEventId(state.currentEvent.id);
      }
    },
    [state.currentEvent, selectChoice],
  );

  const showEvent =
    state.currentEvent &&
    state.eventChoices.length > 0 &&
    state.currentEvent.id !== dismissedEventId;

  const showError = state.lastError && !dismissedError;

  // Reset dismissed states when new errors/events arrive
  if (state.lastError && dismissedError) {
    // New error arrived after dismissal
  }
  if (state.currentEvent && state.currentEvent.id !== dismissedEventId && dismissedEventId !== null) {
    // New event arrived, clear dismissed
  }

  const factions = useEntitiesByType(state, 'faction');
  const characters = useEntitiesByType(state, 'character');

  return (
    <div className="app">
      <header className="app-header">
        <h1>코프룰루 전쟁</h1>
        <TurnIndicator
          turn={state.currentTurn}
          phase={state.currentPhase}
          turnLabel="은하 주기"
          onEndTurn={endTurn}
          awaitingInput={state.awaitingInput}
        />
      </header>

      <div className="app-layout">
        <aside className="panel-left">
          <div className="map-container">
            <h2>성계 지도</h2>
            <MapView
              systems={systems}
              selectedSystemId={selectedEntityId}
              onSelectSystem={handleSelectSystem}
              width={420}
              height={300}
            />
          </div>

          <div className="entity-list">
            <h3>세력</h3>
            {factions.map((f) => (
              <button
                key={f.id}
                className={`entity-btn ${selectedEntityId === f.id ? 'selected' : ''}`}
                onClick={() => handleSelectEntity(f.id)}
              >
                {f.name}
              </button>
            ))}
            <h3>캐릭터</h3>
            {characters.map((c) => (
              <button
                key={c.id}
                className={`entity-btn ${selectedEntityId === c.id ? 'selected' : ''}`}
                onClick={() => handleSelectEntity(c.id)}
              >
                {c.name}
                <span className="entity-role">
                  {(c.components['character-info']?.values?.['role'] as string) ?? ''}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <main className="panel-center">
          {state.currentScene && (
            <SceneRenderer
              scene={state.currentScene}
              entities={state.entities}
              currentDialogueNode={state.currentDialogueNode}
              availableResponses={state.availableResponses}
              onSelectResponse={selectDialogueResponse}
            />
          )}

          {showEvent && (
            <ChoicePanel
              eventName={state.currentEvent!.name}
              eventDescription={state.currentEvent!.description}
              choices={state.eventChoices}
              onSelectChoice={handleSelectChoice}
            />
          )}

          <NarrativeLog entries={state.narrativeLog} />
        </main>

        <aside className="panel-right">
          {selectedEntity && (
            <>
              <StatsPanel
                entity={selectedEntity}
                statDefs={statDefs}
              />
              <RelationshipView
                entity={selectedEntity}
                relations={selectedRelations}
                entities={state.entities}
                relationTypeDefs={relationTypeDefs}
              />
            </>
          )}

          <ActionPanel
            actions={state.availableActions}
            entities={state.entities}
            onSubmitAction={handleSubmitAction}
          />
        </aside>
      </div>

      {showError && (
        <div className="error-toast" onClick={() => setDismissedError(true)}>
          {state.lastError!.message}
        </div>
      )}

      {state.gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>게임 종료</h2>
            <p>{state.gameOverReason}</p>
            {state.gameOverSummary && <p>{state.gameOverSummary}</p>}
            <button onClick={() => window.location.reload()}>다시 플레이</button>
          </div>
        </div>
      )}
    </div>
  );
};
