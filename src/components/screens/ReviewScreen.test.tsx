import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { EventScreen } from './EventScreen';
import { ReviewScreen } from './ReviewScreen';

function Harness() {
  const { state, dispatch } = useGame();
  if (state.screen === 'menu') return <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>start</button>;
  if (state.screen === 'event') return <EventScreen />;
  if (state.screen === 'review') return <ReviewScreen />;
  return (
    <>
      <button onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'review' })}>go-review</button>
      <div data-testid="screen">{state.screen}</div>
    </>
  );
}

function playThroughToReview() {
  render(<GameProvider><Harness /></GameProvider>);
  fireEvent.click(screen.getByText('start'));
  for (let i = 0; i < 40; i++) {
    fireEvent.click(document.querySelectorAll('.option-card')[0]);
    fireEvent.click(document.querySelector('.fb-continue') as HTMLButtonElement);
  }
  fireEvent.click(screen.getByText('go-review'));
}

describe('ReviewScreen', () => {
  beforeEach(() => localStorage.clear());

  it('lists every dilemma from the session with the chosen option', () => {
    playThroughToReview();
    const cards = document.querySelectorAll('.review-card');
    expect(cards.length).toBe(40);
  });

  it('shows the philosophy chip and chosen text for the first dilemma', () => {
    playThroughToReview();
    const first = document.querySelectorAll('.review-card')[0];
    expect(first.querySelector('.chip')).toBeInTheDocument();
    expect(first.textContent).toBeTruthy();
  });

  it('"Volver al Veredicto" navigates back to the result screen', () => {
    playThroughToReview();
    fireEvent.click(screen.getByText('Volver al Veredicto'));
    expect(screen.getByTestId('screen').textContent).toBe('result');
  });
});
