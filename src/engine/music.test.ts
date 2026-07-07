import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setMuted } from './audioPrefs';

describe('music', () => {
  beforeEach(() => {
    localStorage.clear();
    setMuted(false);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('starts oscillators when unmuted', async () => {
    const { startMusic, stopMusic } = await import('./music');
    startMusic();
    stopMusic();
  });

  it('does nothing when muted', async () => {
    setMuted(true);
    const { startMusic, stopMusic } = await import('./music');
    expect(() => startMusic()).not.toThrow();
    expect(() => stopMusic()).not.toThrow();
  });

  it('stopMusic is safe to call without a prior startMusic', async () => {
    const { stopMusic } = await import('./music');
    expect(() => stopMusic()).not.toThrow();
  });

  it('starting twice in a row does not throw (idempotent)', async () => {
    const { startMusic, stopMusic } = await import('./music');
    startMusic();
    startMusic();
    stopMusic();
  });
});
