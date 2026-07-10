import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { MenuScreen } from './MenuScreen';
import { IntroScreen } from './IntroScreen';

function Harness() {
  const { state } = useGame();
  return (
    <>
      {state.screen === 'menu' && <MenuScreen />}
      {state.screen === 'intro' && <IntroScreen />}
      <div data-testid="hidden-philosophy">{String(state.hiddenPhilosophy)}</div>
      <div data-testid="strict-judge">{String(state.strictJudge)}</div>
    </>
  );
}

function renderAtIntro() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
  fireEvent.click(screen.getByText('Nueva Partida'));
}

describe('IntroScreen difficulty modes', () => {
  beforeEach(() => localStorage.clear());

  it('difficulty toggles default to off', () => {
    renderAtIntro();
    expect(screen.getByLabelText('Filosofía Oculta', { exact: false })).not.toBeChecked();
    expect(screen.getByLabelText('Juez Estricto', { exact: false })).not.toBeChecked();
    expect(screen.getByTestId('hidden-philosophy').textContent).toBe('false');
    expect(screen.getByTestId('strict-judge').textContent).toBe('false');
  });

  it('checking a toggle updates game state immediately', () => {
    renderAtIntro();
    fireEvent.click(screen.getByLabelText('Filosofía Oculta', { exact: false }));
    fireEvent.click(screen.getByLabelText('Juez Estricto', { exact: false }));

    expect(screen.getByTestId('hidden-philosophy').textContent).toBe('true');
    expect(screen.getByTestId('strict-judge').textContent).toBe('true');
  });

  it('shows explanatory text for each mode', () => {
    renderAtIntro();
    expect(screen.getByText(/sin la etiqueta de color como guía/)).toBeInTheDocument();
    expect(screen.getByText(/límite de 20 segundos/)).toBeInTheDocument();
  });
});
