import { describe, it, expect } from 'vitest';
import { ateneoComments } from './ateneoComments';
import { philosophers } from './philosophers';
import { eventPool } from './dilemmas';

const PHILOSOPHER_IDS = philosophers.map(p => p.id).sort();

describe('ateneoComments', () => {
  it('covers exactly the 18 Phase 1 dilemma ids', () => {
    const covered = Object.keys(ateneoComments).map(Number).sort((a, b) => a - b);
    expect(covered).toEqual([1, 2, 3, 4, 5, 7, 9, 10, 14, 17, 18, 19, 20, 22, 25, 28, 29, 30]);
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
