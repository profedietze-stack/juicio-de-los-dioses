import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { EventScreen } from './EventScreen';
import { ResultScreen } from './ResultScreen';
import { ReviewScreen } from './ReviewScreen';

function Harness() {
  const { state, dispatch } = useGame();
  if (state.screen === 'menu') {
    return <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>start</button>;
  }
  if (state.screen === 'event') return <EventScreen />;
  if (state.screen === 'result') return <ResultScreen />;
  if (state.screen === 'review') return <ReviewScreen />;
  return null;
}

function playThroughToResult() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
  fireEvent.click(screen.getByText('start'));
  for (let i = 0; i < 40; i++) {
    fireEvent.click(document.querySelectorAll('.option-card')[0]);
    fireEvent.click(document.querySelector('.fb-continue') as HTMLButtonElement);
  }
}

describe('ResultScreen', () => {
  beforeEach(() => localStorage.clear());

  it('renders the verdict screen with score, time, dilemma count and philosophical distribution after finishing all 40 dilemmas', () => {
    playThroughToResult();

    expect(document.getElementById('screen-result')).toBeInTheDocument();
    expect(document.getElementById('r-title')?.textContent).toBeTruthy();
    expect(document.getElementById('r-score')?.textContent).toBeTruthy();
    expect(document.getElementById('r-total')?.textContent).toBe('40');
    expect(document.querySelectorAll('.philo-bar-row').length).toBeGreaterThan(0);
    expect(document.getElementById('philo-text')?.textContent).toBeTruthy();
  });

  it('toggles the "Guardar Informe" button label when clicked', () => {
    playThroughToResult();
    const saveBtn = screen.getByText('Guardar Informe');
    fireEvent.click(saveBtn);
    expect(screen.getByText('Informe guardado ✓')).toBeInTheDocument();
  });

  it('starts a fresh game from "Nuevo Juicio"', () => {
    playThroughToResult();
    fireEvent.click(screen.getByText('Nuevo Juicio'));
    expect(document.getElementById('screen-event')).toBeInTheDocument();
    expect(document.getElementById('ev-title')?.textContent).toBeTruthy();
  });

  it('"Modo Repaso" navigates to the review screen', () => {
    playThroughToResult();
    fireEvent.click(screen.getByText('Modo Repaso'));
    expect(document.getElementById('screen-review')).toBeInTheDocument();
  });

  it('clicking "Compartir Resultado" triggers a PNG download without throwing', () => {
    playThroughToResult();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByText('Compartir Resultado'));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });
});
