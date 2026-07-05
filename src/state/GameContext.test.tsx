import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';
import { autosave, hasSavedGame } from '../engine/persistence';
import { eventPool } from '../data/dilemmas';

function Harness() {
  const { state, dispatch } = useGame();
  return (
    <>
      <button onClick={() => dispatch({ type: 'CONTINUE_GAME' })}>continue</button>
      <div data-testid="screen">{state.screen}</div>
    </>
  );
}

function renderHarness() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
}

describe('CONTINUE_GAME resilience', () => {
  beforeEach(() => localStorage.clear());

  it('falls back to Intro when a saved dilema id no longer exists in the pool', () => {
    autosave({
      current: 1,
      balance: 50,
      startTime: Date.now(),
      elapsed: 10,
      decisions: [{ text: 'x', impact: 1, philosophy: 'utilitarismo' }],
      unlocked: [],
      eventIds: [eventPool[0].id, 999999, eventPool[1].id],
    });

    renderHarness();
    fireEvent.click(screen.getByText('continue'));

    expect(screen.getByTestId('screen').textContent).toBe('intro');
    expect(hasSavedGame()).toBe(false);
  });

  it('falls back to Intro when the saved "current" index is out of range', () => {
    autosave({
      current: 5,
      balance: 50,
      startTime: Date.now(),
      elapsed: 10,
      decisions: [{ text: 'x', impact: 1, philosophy: 'utilitarismo' }],
      unlocked: [],
      eventIds: [eventPool[0].id, eventPool[1].id, eventPool[2].id],
    });

    renderHarness();
    fireEvent.click(screen.getByText('continue'));

    expect(screen.getByTestId('screen').textContent).toBe('intro');
    expect(hasSavedGame()).toBe(false);
  });

  it('resumes normally when the saved game is valid', () => {
    autosave({
      current: 1,
      balance: 60,
      startTime: Date.now(),
      elapsed: 10,
      decisions: [{ text: 'x', impact: 1, philosophy: 'utilitarismo' }],
      unlocked: [],
      eventIds: [eventPool[0].id, eventPool[1].id, eventPool[2].id],
    });

    renderHarness();
    fireEvent.click(screen.getByText('continue'));

    expect(screen.getByTestId('screen').textContent).toBe('event');
  });
});

describe('storage-unavailable warning', () => {
  beforeEach(() => localStorage.clear());

  it('shows a toast once on mount when localStorage is unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });

    function ToastReader() {
      const { toast } = useGame();
      return <div data-testid="toast">{toast.visible ? toast.text : ''}</div>;
    }
    render(<GameProvider><ToastReader /></GameProvider>);

    expect(screen.getByTestId('toast').textContent).toBe('No se podrá guardar tu progreso en este navegador.');
    spy.mockRestore();
  });

  it('does not show the warning when localStorage works normally', () => {
    function ToastReader() {
      const { toast } = useGame();
      return <div data-testid="toast">{toast.visible ? toast.text : ''}</div>;
    }
    render(<GameProvider><ToastReader /></GameProvider>);
    expect(screen.getByTestId('toast').textContent).toBe('');
  });
});
