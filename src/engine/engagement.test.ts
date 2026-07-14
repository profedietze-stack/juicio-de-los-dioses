import { describe, it, expect } from 'vitest';
import { computeEngagement, ATENEO_MIN_SELECTION, ATENEO_MAX_SELECTION } from './engagement';
import type { Dilemma, DilemmaOption } from '../types';

function opt(philosophy: DilemmaOption['philosophy'], text = 'x'): DilemmaOption {
  return { text, impact: 0, philosophy };
}

function events(n: number): Dilemma[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1, title: `Dilema ${i + 1}`, quote: '', description: '', options: [],
  }));
}

describe('computeEngagement', () => {
  it('scores impulsive answers (<4s) at 0 time-score', () => {
    const decisions = [opt('utilitarismo')];
    const r = computeEngagement(events(1), decisions, [1000], [0], 3, 1);
    expect(r.timeScore).toBe(0);
  });

  it('scores answers at/above the reflective ceiling at 100 time-score', () => {
    const decisions = [opt('utilitarismo')];
    const r = computeEngagement(events(1), decisions, [120000], [0], 3, 1);
    expect(r.timeScore).toBe(100);
  });

  it('selectionScore is 0 at the minimum and 100 at the maximum selection count', () => {
    const decisions = [opt('utilitarismo')];
    const atMin = computeEngagement(events(1), decisions, [30000], [0], ATENEO_MIN_SELECTION, 1);
    const atMax = computeEngagement(events(1), decisions, [30000], [0], ATENEO_MAX_SELECTION, 1);
    expect(atMin.selectionScore).toBe(0);
    expect(atMax.selectionScore).toBe(100);
  });

  it('ateneoScore reaches 100 at an average of 2 consults per dilemma, and is capped beyond that', () => {
    const decisions = [opt('utilitarismo'), opt('deontologia')];
    const full = computeEngagement(events(2), decisions, [30000, 30000], [2, 2], 4, 2);
    const excess = computeEngagement(events(2), decisions, [30000, 30000], [5, 5], 4, 2);
    expect(full.ateneoScore).toBe(100);
    expect(excess.ateneoScore).toBe(100);
  });

  it('ateneoScore is 0 when the Ateneo was never actually consulted, even though selection is mandatory', () => {
    const decisions = [opt('utilitarismo'), opt('deontologia')];
    const r = computeEngagement(events(2), decisions, [30000, 30000], [0, 0], 4, 2);
    expect(r.ateneoScore).toBe(0);
  });

  it('diversityScore scales diversity/10 to a 0..100 range', () => {
    const decisions = [opt('utilitarismo')];
    const r = computeEngagement(events(1), decisions, [30000], [0], 3, 5);
    expect(r.diversityScore).toBe(50);
  });

  it('index is the average of all 4 component scores, and label follows thresholds', () => {
    const decisions = [opt('utilitarismo')];
    const r = computeEngagement(events(1), decisions, [120000], [2], ATENEO_MAX_SELECTION, 10);
    // timeScore=100, selectionScore=100, ateneoScore=100, diversityScore=100 -> index=100
    expect(r.index).toBe(100);
    expect(r.label).toBe('Alto');
  });

  it('never lets a correctness-adjacent signal leak in: identical time/ateneo/diversity always yields the same index regardless of which philosophy or option text was chosen', () => {
    const a = computeEngagement(events(1), [opt('utilitarismo', 'A')], [30000], [0], 3, 3);
    const b = computeEngagement(events(1), [opt('nihilismo', 'B')], [30000], [0], 3, 3);
    expect(a.index).toBe(b.index);
  });

  it('topDeliberated returns at most 3 entries, ranked by time with an Ateneo consult bonus', () => {
    const decisions = [opt('utilitarismo', 'A'), opt('deontologia', 'B'), opt('nihilismo', 'C'), opt('estoicismo', 'D')];
    const r = computeEngagement(events(4), decisions, [5000, 60000, 10000, 10000], [0, 0, 1, 0], 3, 4);
    expect(r.topDeliberated).toHaveLength(3);
    expect(r.topDeliberated[0].optionText).toBe('B'); // 60s, no ateneo bonus needed
    expect(r.topDeliberated.some(e => e.optionText === 'C')).toBe(true); // 10s + ateneo bonus outranks D
  });

  it('handles an empty session without throwing', () => {
    expect(() => computeEngagement([], [], [], [], 0, 0)).not.toThrow();
  });
});
