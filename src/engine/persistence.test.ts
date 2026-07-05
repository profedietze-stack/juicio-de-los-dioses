import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveHistory, getHistory, getSeenMap, saveSeenMap, hasSavedGame, autosave,
  clearSavedGame, clearProgress, getUnlockedAchievements, saveUnlockedAchievements,
  saveSnapshot, loadSavedResults, loadSavedGame, isStorageAvailable,
} from './persistence';
import type { HistoryRecord, AutosaveData, ResultSnapshot } from '../types';

beforeEach(() => localStorage.clear());

function record(overrides: Partial<HistoryRecord> = {}): HistoryRecord {
  return {
    score: 50, time: 100, ending: 'X', endingKey: 'purgatory', dominant: 'utilitarismo',
    pcts: {}, counts: {}, diversity: 1, date: '01 ene 2026', dateISO: '2026-01-01',
    ...overrides,
  };
}

function autosaveData(overrides: Partial<AutosaveData> = {}): AutosaveData {
  return {
    current: 1, balance: 50, startTime: Date.now(), elapsed: 10,
    decisions: [{ text: 'x', impact: 1, philosophy: 'utilitarismo' }],
    unlocked: [], eventIds: [1, 2, 3],
    ...overrides,
  };
}

function snapshot(overrides: Partial<ResultSnapshot> = {}): ResultSnapshot {
  return {
    id: 'snap_1', date: '01 ene 2026', score: 50, time: 100, ending: 'X', endingIcon: '⚖',
    dominant: 'utilitarismo', domLabel: 'Utilitarismo', sec: 'deontologia', secLabel: 'Deontología',
    thr: 'nihilismo', thrLabel: 'Nihilismo', pcts: {}, ranked: [], diversity: 1,
    narrative: 'n', decisions: 40,
    ...overrides,
  };
}

describe('history', () => {
  it('saveHistory prepends records and caps at 20', () => {
    for (let i = 0; i < 25; i++) saveHistory(record({ score: i }));
    const h = getHistory();
    expect(h).toHaveLength(20);
    expect(h[0].score).toBe(24);
  });
});

describe('seen map', () => {
  it('getSeenMap/saveSeenMap round-trips', () => {
    saveSeenMap({ 1: 3, 2: 1 });
    expect(getSeenMap()).toEqual({ 1: 3, 2: 1 });
  });
});

describe('autosave', () => {
  it('autosave + hasSavedGame + clearSavedGame', () => {
    expect(hasSavedGame()).toBe(false);
    autosave(autosaveData());
    expect(hasSavedGame()).toBe(true);
    clearSavedGame();
    expect(hasSavedGame()).toBe(false);
  });

  it('hasSavedGame is false when current has reached the end', () => {
    autosave(autosaveData({ current: 3, eventIds: [1, 2, 3] }));
    expect(hasSavedGame()).toBe(false);
  });
});

describe('clearProgress', () => {
  it('wipes everything in localStorage', () => {
    autosave(autosaveData());
    saveSeenMap({ 1: 1 });
    saveHistory(record());
    clearProgress();
    expect(hasSavedGame()).toBe(false);
    expect(getSeenMap()).toEqual({});
    expect(getHistory()).toEqual([]);
  });
});

describe('achievements', () => {
  it('accumulates unlocked ids across calls without duplicates', () => {
    saveUnlockedAchievements(['defensor']);
    saveUnlockedAchievements(['defensor', 'rapido']);
    expect(getUnlockedAchievements().sort()).toEqual(['defensor', 'rapido']);
  });
});

describe('snapshots', () => {
  it('saveSnapshot prepends and caps at 5', () => {
    for (let i = 0; i < 8; i++) saveSnapshot(snapshot({ id: `snap_${i}` }));
    const snaps = loadSavedResults();
    expect(snaps).toHaveLength(5);
    expect(snaps[0].id).toBe('snap_7');
  });
});

describe('corrupted data resilience', () => {
  it('loadSavedGame returns null and clears the key when the saved shape is invalid', () => {
    localStorage.setItem('gameInProgress', JSON.stringify({ current: 'not-a-number', eventIds: [1] }));
    expect(loadSavedGame()).toBeNull();
    expect(localStorage.getItem('gameInProgress')).toBeNull();
  });

  it('loadSavedGame returns null for garbage JSON instead of throwing', () => {
    localStorage.setItem('gameInProgress', '{not json');
    expect(() => loadSavedGame()).not.toThrow();
    expect(loadSavedGame()).toBeNull();
  });

  it('getHistory filters out invalid records and self-heals the stored array', () => {
    localStorage.setItem('gameHistory', JSON.stringify([
      record({ score: 10 }),
      { score: 'bad' },
      record({ score: 20 }),
    ]));
    const h = getHistory();
    expect(h).toHaveLength(2);
    expect(h.map(r => r.score)).toEqual([10, 20]);
    expect(getHistory()).toHaveLength(2); // re-reading returns the same clean list
  });

  it('loadSavedResults filters out invalid snapshots and self-heals', () => {
    localStorage.setItem('savedSnapshots', JSON.stringify([
      { id: 'bad' },
      snapshot({ id: 'good' }),
    ]));
    const s = loadSavedResults();
    expect(s).toHaveLength(1);
    expect(s[0].id).toBe('good');
  });

  it('getSeenMap drops non-numeric entries', () => {
    localStorage.setItem('dilemaSeen', JSON.stringify({ 1: 3, 2: 'oops', 3: 5 }));
    expect(getSeenMap()).toEqual({ 1: 3, 3: 5 });
  });

  it('getUnlockedAchievements drops ids that are not real achievements', () => {
    localStorage.setItem('achievements', JSON.stringify(['defensor', 'not-a-real-id', 'rapido']));
    expect(getUnlockedAchievements().sort()).toEqual(['defensor', 'rapido']);
  });
});

describe('isStorageAvailable', () => {
  it('returns true when localStorage works normally', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('returns false when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota exceeded'); });
    expect(isStorageAvailable()).toBe(false);
    spy.mockRestore();
  });
});
