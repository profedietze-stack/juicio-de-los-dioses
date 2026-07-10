import { describe, it, expect } from 'vitest';
import { philosophers } from './philosophers';
import { ALL_PHILO_KEYS } from '../engine/results';

describe('philosophers', () => {
  it('has exactly 10 entries', () => {
    expect(philosophers.length).toBe(10);
  });

  it('has unique ids', () => {
    const ids = philosophers.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every PhilosophyKey exactly once', () => {
    const covered = philosophers.map(p => p.philosophy).sort();
    expect(covered).toEqual([...ALL_PHILO_KEYS].sort());
  });

  it('every entry has non-empty name, years, civilization, bio and portrait', () => {
    for (const p of philosophers) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.years.length).toBeGreaterThan(0);
      expect(p.civilization.length).toBeGreaterThan(0);
      expect(p.bio.length).toBeGreaterThan(20);
      expect(p.portrait).toMatch(/^\/philosophers\/.+\.jpg$/);
    }
  });
});
