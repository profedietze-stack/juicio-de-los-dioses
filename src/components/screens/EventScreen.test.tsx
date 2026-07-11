import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { EventScreen } from './EventScreen';

function Harness() {
  const { state, dispatch } = useGame();
  if (state.screen !== 'event') {
    return <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>start</button>;
  }
  return <EventScreen />;
}

function renderHarness() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
  fireEvent.click(screen.getByText('start'));
}

function ModesHarness({ hiddenPhilosophy = false, strictJudge = false }: { hiddenPhilosophy?: boolean; strictJudge?: boolean }) {
  const { state, dispatch } = useGame();
  if (state.screen !== 'event') {
    return (
      <>
        <button onClick={() => dispatch({ type: 'GO_TO_INTRO', length: 40, hiddenPhilosophy, strictJudge })}>go</button>
        <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>start</button>
      </>
    );
  }
  return <EventScreen />;
}

function renderModesHarness(modes: { hiddenPhilosophy?: boolean; strictJudge?: boolean }) {
  render(
    <GameProvider>
      <ModesHarness {...modes} />
    </GameProvider>,
  );
  fireEvent.click(screen.getByText('go'));
  fireEvent.click(screen.getByText('start'));
}

describe('EventScreen', () => {
  beforeEach(() => localStorage.clear());

  it('renders the first dilemma with an options grid and no feedback panel', () => {
    renderHarness();
    expect(document.getElementById('ev-title')?.textContent).toBeTruthy();
    expect(document.getElementById('opts')).toBeInTheDocument();
    expect(document.getElementById('feedback-panel')).not.toBeInTheDocument();
  });

  it('keeps showing the answered dilemma under the feedback panel until "Continuar" is clicked (regression: title used to jump to the next dilemma immediately)', () => {
    renderHarness();
    const titleBefore = document.getElementById('ev-title')?.textContent;

    const options = document.querySelectorAll('.option-card');
    expect(options.length).toBeGreaterThan(0);
    fireEvent.click(options[0]);

    // Feedback panel appears, but the title underneath must NOT have changed yet.
    expect(document.getElementById('feedback-panel')).toBeInTheDocument();
    expect(document.getElementById('ev-title')?.textContent).toBe(titleBefore);
    expect(document.getElementById('opts')).not.toBeInTheDocument();

    const continueBtn = document.querySelector('.fb-continue') as HTMLButtonElement;
    expect(continueBtn).toBeTruthy();
    fireEvent.click(continueBtn);

    // Only now should the view advance to the next dilemma and the panel disappear.
    expect(document.getElementById('feedback-panel')).not.toBeInTheDocument();
    expect(document.getElementById('opts')).toBeInTheDocument();
  });

  it('shows "Ver el Veredicto Final" as the continue label on the last dilemma', () => {
    renderHarness();
    // Walk through all 40 dilemmas, always picking the first option.
    for (let i = 0; i < 40; i++) {
      fireEvent.click(document.querySelectorAll('.option-card')[0]);
      const continueBtn = document.querySelector('.fb-continue') as HTMLButtonElement;
      if (i === 39) {
        expect(continueBtn.textContent).toContain('Ver el Veredicto Final');
      } else {
        expect(continueBtn.textContent).toContain('Continuar');
      }
      fireEvent.click(continueBtn);
    }
  });

  it('shows the philosophy chip on option cards by default', () => {
    renderHarness();
    expect(document.querySelector('.option-tag')).toBeInTheDocument();
  });
});

describe('EventScreen hiddenPhilosophy mode', () => {
  beforeEach(() => localStorage.clear());

  it('hides the philosophy chip on option cards before choosing', () => {
    renderModesHarness({ hiddenPhilosophy: true });
    expect(document.querySelector('.option-tag')).not.toBeInTheDocument();
  });

  it('still reveals the philosophy in the feedback panel after choosing', () => {
    renderModesHarness({ hiddenPhilosophy: true });
    fireEvent.click(document.querySelectorAll('.option-card')[0]);
    expect(document.getElementById('feedback-panel')).toBeInTheDocument();
    expect(document.querySelector('.fb-header .chip')).toBeInTheDocument();
  });
});

describe('EventScreen strictJudge mode', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a countdown timer', () => {
    renderModesHarness({ strictJudge: true });
    expect(document.querySelector('.strict-timer')).toBeInTheDocument();
  });

  it('auto-picks an option and shows feedback once the countdown reaches zero', () => {
    renderModesHarness({ strictJudge: true });
    act(() => { vi.advanceTimersByTime(21000); });
    expect(document.getElementById('feedback-panel')).toBeInTheDocument();
  });

  it('does not show a countdown timer when strictJudge is off', () => {
    renderModesHarness({ strictJudge: false });
    expect(document.querySelector('.strict-timer')).not.toBeInTheDocument();
  });
});

const ATENEO_COVERED_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 56,
]);

describe('EventScreen Ateneo button', () => {
  function AteneoHarness({ selection }: { selection: string[] }) {
    const { state, dispatch } = useGame();
    if (state.screen !== 'event') {
      return (
        <>
          <button onClick={() => {
            dispatch({ type: 'GO_TO_INTRO', length: 39 });
            dispatch({ type: 'SET_ATENEO_SELECTION', ids: selection });
            dispatch({ type: 'BEGIN_GAME' });
          }}
          >
            go
          </button>
        </>
      );
    }
    return (
      <>
        <div data-testid="current-id">{state.sessionEvents[state.current]?.id}</div>
        <EventScreen />
      </>
    );
  }

  function renderAteneoHarness(selection: string[]) {
    render(
      <GameProvider>
        <AteneoHarness selection={selection} />
      </GameProvider>,
    );
    fireEvent.click(screen.getByText('go'));
  }

  // Advances through dilemmas (always picking the first option) until
  // landing on one covered by Phase 1 content, or throws after exhausting
  // the session — session order is randomized so the covered dilemma's
  // position isn't fixed, but with 18/59 dilemmas covered one is
  // virtually certain to appear within a 39-dilemma session.
  function advanceToCoveredDilemma() {
    for (let i = 0; i < 39; i++) {
      const currentId = Number(screen.getByTestId('current-id').textContent);
      if (ATENEO_COVERED_IDS.has(currentId)) return;
      fireEvent.click(document.querySelectorAll('.option-card')[0]);
      fireEvent.click(document.querySelector('.fb-continue') as HTMLButtonElement);
    }
    throw new Error('No covered dilemma found in this session');
  }

  it('shows the Ateneo button on a covered dilemma when a philosopher is selected', () => {
    renderAteneoHarness(['kant']);
    advanceToCoveredDilemma();
    expect(screen.getByText('🏛 Ateneo')).toBeInTheDocument();
  });

  it('hides the Ateneo button when no philosopher is selected', () => {
    renderAteneoHarness([]);
    advanceToCoveredDilemma();
    expect(screen.queryByText('🏛 Ateneo')).not.toBeInTheDocument();
  });

  it('opens the modal with the selected philosopher\'s comment on click', () => {
    renderAteneoHarness(['kant']);
    advanceToCoveredDilemma();
    fireEvent.click(screen.getByText('🏛 Ateneo'));
    expect(document.getElementById('ateneo-modal')).toBeInTheDocument();
    expect(screen.getByText('Immanuel Kant')).toBeInTheDocument();
  });
});
