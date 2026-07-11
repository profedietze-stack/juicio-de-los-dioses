import { describe, it, expect } from 'vitest';
import { ateneoComments } from './ateneoComments';
import { philosophers } from './philosophers';
import { eventPool } from './dilemmas';

const PHILOSOPHER_IDS = philosophers.map(p => p.id).sort();

describe('ateneoComments', () => {
  it('covers exactly the 72 Phase 1-4 dilemma ids', () => {
    const covered = Object.keys(ateneoComments).map(Number).sort((a, b) => a - b);
    expect(covered).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
    ]);
  });

  it('every covered dilemma id exists in the real dilemma pool', () => {
    const poolIds = new Set(eventPool.map(d => d.id));
    for (const id of Object.keys(ateneoComments).map(Number)) {
      expect(poolIds.has(id)).toBe(true);
    }
  });

  it('every covered dilemma has all 10 philosopher ids with non-empty text', () => {
    for (const [dilemmaId, comments] of Object.entries(ateneoComments)) {
      const keys = Object.keys(comments).sort();
      expect(keys, `dilemma ${dilemmaId}`).toEqual(PHILOSOPHER_IDS);
      for (const text of Object.values(comments)) {
        expect(text.length, `dilemma ${dilemmaId}`).toBeGreaterThan(30);
      }
    }
  });
});
