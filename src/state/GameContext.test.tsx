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

describe('GO_TO_INTRO / short session length', () => {
  beforeEach(() => localStorage.clear());

  function LengthHarness() {
    const { state, dispatch } = useGame();
    return (
      <>
        <button onClick={() => dispatch({ type: 'GO_TO_INTRO', length: 14 })}>go-short</button>
        <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>begin</button>
        <div data-testid="screen">{state.screen}</div>
        <div data-testid="pending-length">{state.pendingLength}</div>
        <div data-testid="session-length">{state.sessionEvents.length}</div>
      </>
    );
  }

  it('GO_TO_INTRO stores the chosen length and navigates to Intro', () => {
    render(<GameProvider><LengthHarness /></GameProvider>);
    fireEvent.click(screen.getByText('go-short'));
    expect(screen.getByTestId('screen').textContent).toBe('intro');
    expect(screen.getByTestId('pending-length').textContent).toBe('14');
  });

  it('BEGIN_GAME after GO_TO_INTRO builds a session matching the chosen length', () => {
    render(<GameProvider><LengthHarness /></GameProvider>);
    fireEvent.click(screen.getByText('go-short'));
    fireEvent.click(screen.getByText('begin'));
    expect(screen.getByTestId('session-length').textContent).toBe('15');
  });

  it('BEGIN_GAME without going through GO_TO_INTRO uses the full 40-dilemma length', () => {
    render(<GameProvider><LengthHarness /></GameProvider>);
    fireEvent.click(screen.getByText('begin'));
    expect(screen.getByTestId('session-length').textContent).toBe('40');
  });
});

describe('GO_TO_INTRO / difficulty modes', () => {
  beforeEach(() => localStorage.clear());

  function ModesHarness() {
    const { state, dispatch } = useGame();
    return (
      <>
        <button onClick={() => dispatch({ type: 'GO_TO_INTRO', length: 40, hiddenPhilosophy: true, strictJudge: true })}>go-both</button>
        <button onClick={() => dispatch({ type: 'GO_TO_INTRO', length: 40 })}>go-none</button>
        <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>begin</button>
        <div data-testid="hidden">{String(state.hiddenPhilosophy)}</div>
        <div data-testid="strict">{String(state.strictJudge)}</div>
      </>
    );
  }

  it('GO_TO_INTRO stores both modes when requested', () => {
    render(<GameProvider><ModesHarness /></GameProvider>);
    fireEvent.click(screen.getByText('go-both'));
    expect(screen.getByTestId('hidden').textContent).toBe('true');
    expect(screen.getByTestId('strict').textContent).toBe('true');
  });

  it('GO_TO_INTRO defaults both modes to false when omitted', () => {
    render(<GameProvider><ModesHarness /></GameProvider>);
    fireEvent.click(screen.getByText('go-none'));
    expect(screen.getByTestId('hidden').textContent).toBe('false');
    expect(screen.getByTestId('strict').textContent).toBe('false');
  });

  it('BEGIN_GAME carries the chosen modes into the event screen', () => {
    render(<GameProvider><ModesHarness /></GameProvider>);
    fireEvent.click(screen.getByText('go-both'));
    fireEvent.click(screen.getByText('begin'));
    expect(screen.getByTestId('hidden').textContent).toBe('true');
    expect(screen.getByTestId('strict').textContent).toBe('true');
  });
});

describe('CHOOSE_TIMEOUT', () => {
  beforeEach(() => localStorage.clear());

  function TimeoutHarness() {
    const { state, dispatch } = useGame();
    return (
      <>
        <button onClick={() => dispatch({ type: 'CHOOSE_TIMEOUT', option: { text: 'x', impact: 2, philosophy: 'utilitarismo' } })}>timeout</button>
        <div data-testid="balance">{state.balance}</div>
      </>
    );
  }

  it('applies the option impact minus a 5-point penalty', () => {
    render(<GameProvider><TimeoutHarness /></GameProvider>);
    fireEvent.click(screen.getByText('timeout'));
    // starts at 50, +2 impact, -5 penalty = 47
    expect(screen.getByTestId('balance').textContent).toBe('47');
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
