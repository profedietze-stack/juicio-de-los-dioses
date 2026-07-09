import { describe, it, expect, beforeEach } from 'vitest';
import { computeHistoryStats, topPhilosophies } from './historyStats';
import { saveHistory, savePlayCounts } from './persistence';
import { eventPool } from '../data/dilemmas';
import type { HistoryRecord } from '../types';

beforeEach(() => localStorage.clear());

function record(overrides: Partial<HistoryRecord> = {}): HistoryRecord {
  return {
    score: 50, time: 100, ending: 'X', endingKey: 'purgatory', dominant: 'utilitarismo',
    pcts: {}, counts: {}, diversity: 1, date: '01 ene 2026', dateISO: '2026-01-01',
    ...overrides,
  };
}

describe('computeHistoryStats', () => {
  it('returns null when there is no history yet', () => {
    expect(computeHistoryStats()).toBeNull();
  });

  it('aggregates basic KPIs across saved games', () => {
    saveHistory(record({ score: 40 }));
    saveHistory(record({ score: 80 }));
    const stats = computeHistoryStats();
    expect(stats?.totalGames).toBe(2);
    expect(stats?.avgScore).toBe(60);
    expect(stats?.bestScore).toBe(80);
    expect(stats?.worstScore).toBe(40);
  });

  it('reports poolSize as the number of non-finale dilemmas in the current pool', () => {
    saveHistory(record());
    expect(computeHistoryStats()?.poolSize).toBe(eventPool.length - 1);
  });

  it('reports mostPlayed/leastPlayed from play counts, excluding never-played dilemmas', () => {
    saveHistory(record());
    savePlayCounts({ [eventPool[0].id]: 5, [eventPool[1].id]: 1 });
    const stats = computeHistoryStats();
    expect(stats?.mostPlayed[0]).toEqual({ id: eventPool[0].id, title: eventPool[0].title, count: 5 });
    expect(stats?.leastPlayed[0]).toEqual({ id: eventPool[1].id, title: eventPool[1].title, count: 1 });
  });

  it('never counts the finale in mostPlayed/leastPlayed', () => {
    saveHistory(record());
    savePlayCounts({ 60: 40 });
    const stats = computeHistoryStats();
    expect(stats?.mostPlayed.some(d => d.id === 60)).toBe(false);
  });
});

describe('topPhilosophies', () => {
  it('sorts by percentage descending and drops zero entries', () => {
    const top = topPhilosophies({ utilitarismo: 40, deontologia: 0, nihilismo: 60 });
    expect(top).toEqual([['nihilismo', 60], ['utilitarismo', 40]]);
  });

  it('limits to the requested count', () => {
    const top = topPhilosophies({ utilitarismo: 10, deontologia: 20, nihilismo: 30, virtuosismo: 40 }, 2);
    expect(top).toEqual([['virtuosismo', 40], ['nihilismo', 30]]);
  });

  it('returns an empty array when every percentage is zero or missing', () => {
    expect(topPhilosophies({})).toEqual([]);
    expect(topPhilosophies({ utilitarismo: 0 })).toEqual([]);
  });
});
