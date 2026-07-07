import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MuteToggle } from './MuteToggle';
import { isMuted } from '../../engine/audioPrefs';
import { GameProvider } from '../../state/GameContext';

beforeEach(() => localStorage.clear());

function renderToggle() {
  return render(<GameProvider><MuteToggle /></GameProvider>);
}

describe('MuteToggle', () => {
  it('renders unmuted icon by default', () => {
    renderToggle();
    expect(screen.getByRole('button', { name: /silenciar/i })).toBeTruthy();
  });

  it('toggles mute state and icon on click', () => {
    renderToggle();
    const btn = screen.getByRole('button', { name: /silenciar/i });
    fireEvent.click(btn);
    expect(isMuted()).toBe(true);
    expect(screen.getByRole('button', { name: /activar sonido/i })).toBeTruthy();
  });

  it('toggling twice restores unmuted state', () => {
    renderToggle();
    const btn = screen.getByRole('button', { name: /silenciar/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole('button', { name: /activar sonido/i }));
    expect(isMuted()).toBe(false);
  });
});
