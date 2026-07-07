import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { MenuScreen } from './MenuScreen';
import { autosave } from '../../engine/persistence';

function Harness() {
  const { state } = useGame();
  return (
    <>
      <MenuScreen />
      <div data-testid="current-screen">{state.screen}</div>
      <div data-testid="pending-length">{state.pendingLength}</div>
      <div data-testid="hidden-philosophy">{String(state.hiddenPhilosophy)}</div>
      <div data-testid="strict-judge">{String(state.strictJudge)}</div>
    </>
  );
}

function renderMenu() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
}

function seedSavedGame() {
  autosave({
    current: 2,
    balance: 55,
    startTime: Date.now(),
    elapsed: 30,
    decisions: [{ philosophy: 'utilitarismo', text: 'x', impact: 1 }],
    unlocked: [],
    eventIds: [1, 2, 3, 4, 5],
  });
}

describe('MenuScreen', () => {
  beforeEach(() => localStorage.clear());

  it('goes straight to Intro on "Nueva Partida" when there is no saved game', () => {
    renderMenu();
    fireEvent.click(screen.getByText('Nueva Partida'));
    expect(screen.getByTestId('current-screen').textContent).toBe('intro');
  });

  it('shows a confirm dialog on "Nueva Partida" when a game is in progress, and cancelling resumes it', () => {
    seedSavedGame();
    renderMenu();
    expect(screen.getByText('Continuar Partida')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Nueva Partida'));
    expect(screen.getByText('Partida en curso')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Continuar la actual'));
    expect(screen.getByTestId('current-screen').textContent).toBe('event');
  });

  it('confirming "Nueva Partida" over a saved game clears it and starts Intro', () => {
    seedSavedGame();
    renderMenu();
    fireEvent.click(screen.getByText('Nueva Partida'));
    fireEvent.click(screen.getByText('✦ Nueva Partida'));
    expect(screen.getByTestId('current-screen').textContent).toBe('intro');
  });

  it('"Partida Corta" goes to Intro with the short session length', () => {
    renderMenu();
    fireEvent.click(screen.getByText('Partida Corta (15 dilemas)'));
    expect(screen.getByTestId('current-screen').textContent).toBe('intro');
    expect(screen.getByTestId('pending-length').textContent).toBe('14');
  });

  it('"Partida Corta" over a saved game asks for confirmation and preserves the short length choice', () => {
    seedSavedGame();
    renderMenu();
    fireEvent.click(screen.getByText('Partida Corta (15 dilemas)'));
    expect(screen.getByText('Partida en curso')).toBeInTheDocument();
    fireEvent.click(screen.getByText('✦ Nueva Partida'));
    expect(screen.getByTestId('current-screen').textContent).toBe('intro');
    expect(screen.getByTestId('pending-length').textContent).toBe('14');
  });

  it('difficulty toggles default to off and are passed to GO_TO_INTRO when checked', () => {
    renderMenu();
    expect(screen.getByLabelText('Filosofía Oculta')).not.toBeChecked();
    expect(screen.getByLabelText('Juez Estricto')).not.toBeChecked();

    fireEvent.click(screen.getByLabelText('Filosofía Oculta'));
    fireEvent.click(screen.getByLabelText('Juez Estricto'));
    fireEvent.click(screen.getByText('Nueva Partida'));

    expect(screen.getByTestId('hidden-philosophy').textContent).toBe('true');
    expect(screen.getByTestId('strict-judge').textContent).toBe('true');
  });

  it('difficulty toggles combine with Partida Corta', () => {
    renderMenu();
    fireEvent.click(screen.getByLabelText('Juez Estricto'));
    fireEvent.click(screen.getByText('Partida Corta (15 dilemas)'));
    expect(screen.getByTestId('pending-length').textContent).toBe('14');
    expect(screen.getByTestId('strict-judge').textContent).toBe('true');
  });
});
