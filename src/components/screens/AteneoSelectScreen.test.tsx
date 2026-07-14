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

function selectByName(...names: string[]) {
  names.forEach(name => fireEvent.click(screen.getByText(name)));
}

describe('AteneoSelectScreen', () => {
  beforeEach(() => localStorage.clear());

  it('shows all 10 philosopher cards', () => {
    renderAtAteneo();
    expect(document.querySelectorAll('.ateneo-card').length).toBe(10);
  });

  it('is mandatory: "Comenzar el Juicio" is disabled below the minimum of 3', () => {
    renderAtAteneo();
    selectByName('Immanuel Kant', 'John Stuart Mill');
    const btn = screen.getByRole('button', { name: /elegí al menos 3 pensadores/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    // Still on the Ateneo screen — the disabled button must not have started the game.
    expect(screen.getByTestId('screen').textContent).toBe('ateneo');
  });

  it('enables "Comenzar el Juicio" once the minimum of 3 is reached, and reflects the selection in game state', () => {
    renderAtAteneo();
    selectByName('Immanuel Kant', 'John Stuart Mill', 'Friedrich Nietzsche');
    const btn = screen.getByRole('button', { name: 'Comenzar el Juicio' });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(screen.getByTestId('screen').textContent).toBe('event');
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill,nietzsche');
  });

  it('caps selection at 6 — a 7th tap on an unselected card does nothing', () => {
    renderAtAteneo();
    selectByName(
      'Immanuel Kant', 'John Stuart Mill', 'Friedrich Nietzsche',
      'Séneca', 'Aristóteles', 'John Locke', 'Simone de Beauvoir',
    );
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill,nietzsche,seneca,aristoteles,locke');
  });

  it('tapping a selected card again deselects it, dropping back below the minimum re-disables the button', () => {
    renderAtAteneo();
    selectByName('Immanuel Kant', 'John Stuart Mill', 'Friedrich Nietzsche');
    fireEvent.click(screen.getByText('Immanuel Kant'));
    expect(screen.getByRole('button', { name: /elegí al menos 3 pensadores/i })).toBeDisabled();
  });

  it('has no "Omitir" (skip) option — the Ateneo is mandatory', () => {
    renderAtAteneo();
    expect(screen.queryByText('Omitir')).toBeNull();
  });
});
