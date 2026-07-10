import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { MenuScreen } from './MenuScreen';
import { IntroScreen } from './IntroScreen';
import { AteneoSelectScreen } from './AteneoSelectScreen';

function Harness() {
  const { state } = useGame();
  return (
    <>
      {state.screen === 'menu' && <MenuScreen />}
      {state.screen === 'intro' && <IntroScreen />}
      {state.screen === 'ateneo' && <AteneoSelectScreen />}
      <div data-testid="screen">{state.screen}</div>
      <div data-testid="selection">{state.ateneoSelection.join(',')}</div>
    </>
  );
}

function renderAtAteneo() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
  fireEvent.click(screen.getByText('Nueva Partida'));
  fireEvent.click(screen.getByText('Comenzar el Juicio'));
}

describe('AteneoSelectScreen', () => {
  beforeEach(() => localStorage.clear());

  it('shows all 10 philosopher cards', () => {
    renderAtAteneo();
    expect(document.querySelectorAll('.ateneo-card').length).toBe(10);
  });

  it('toggles selection on tap and reflects it in game state', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    expect(screen.getByText('Comenzar el Juicio').closest('button')).toBeTruthy();
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('kant');
  });

  it('caps selection at 4 — a 5th tap on an unselected card does nothing', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('John Stuart Mill'));
    fireEvent.click(screen.getByText('Friedrich Nietzsche'));
    fireEvent.click(screen.getByText('Séneca'));
    fireEvent.click(screen.getByText('Aristóteles'));
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill,nietzsche,seneca');
  });

  it('tapping a selected card again deselects it', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('"Omitir" starts the game with no selection', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('Omitir'));
    expect(screen.getByTestId('screen').textContent).toBe('event');
    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('"Comenzar el Juicio" starts the game', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('screen').textContent).toBe('event');
  });
});
