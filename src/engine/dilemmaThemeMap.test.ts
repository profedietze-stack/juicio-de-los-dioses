import { describe, it, expect } from 'vitest';
import { DILEMMA_THEME_MAP } from './dilemmaThemeMap';
import { eventPool } from '../data/dilemmas';
import { EV_THEMES } from '../data/eventThemes';

describe('DILEMMA_THEME_MAP', () => {
  it('has an entry for every dilemma id in the current pool', () => {
    for (const d of eventPool) {
      expect(DILEMMA_THEME_MAP[d.id], `missing theme mapping for id ${d.id}`).toBeDefined();
    }
  });

  it('every mapped index points to a valid EV_THEMES entry', () => {
    for (const idx of Object.values(DILEMMA_THEME_MAP)) {
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(EV_THEMES.length);
    }
  });

  it('has no stale ids left over from a previous pool shape', () => {
    const poolIds = new Set(eventPool.map(d => d.id));
    for (const idStr of Object.keys(DILEMMA_THEME_MAP)) {
      expect(poolIds.has(Number(idStr)), `stale mapping for id ${idStr}`).toBe(true);
    }
  });
});
