import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
});
