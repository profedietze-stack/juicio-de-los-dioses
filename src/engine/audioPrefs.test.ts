import { describe, it, expect, beforeEach } from 'vitest';
import { isMuted, setMuted } from './audioPrefs';

beforeEach(() => localStorage.clear());

describe('audioPrefs', () => {
  it('defaults to not muted', () => {
    expect(isMuted()).toBe(false);
  });

  it('persists muted state across reads', () => {
    setMuted(true);
    expect(isMuted()).toBe(true);
  });

  it('persists unmuted state after being muted', () => {
    setMuted(true);
    setMuted(false);
    expect(isMuted()).toBe(false);
  });

  it('ignores corrupted stored values and falls back to not muted', () => {
    localStorage.setItem('audioMuted', 'not-json');
    expect(isMuted()).toBe(false);
  });
});
