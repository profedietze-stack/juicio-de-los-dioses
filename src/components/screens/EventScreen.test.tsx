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
