import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveHistory, getHistory, getSeenMap, saveSeenMap, hasSavedGame, autosave,
  clearSavedGame, clearProgress, getUnlockedAchievements, saveUnlockedAchievements,
  saveSnapshot, loadSavedResults,
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
  function snapshot(overrides: Partial<ResultSnapshot> = {}): ResultSnapshot {
    return {
      id: 'snap_1', date: '01 ene 2026', score: 50, time: 100, ending: 'X', endingIcon: '⚖',
      dominant: 'utilitarismo', domLabel: 'Utilitarismo', sec: 'deontologia', secLabel: 'Deontología',
      thr: 'nihilismo', thrLabel: 'Nihilismo', pcts: {}, ranked: [], diversity: 1,
      narrative: 'n', decisions: 40,
      ...overrides,
    };
  }

  it('saveSnapshot prepends and caps at 5', () => {
    for (let i = 0; i < 8; i++) saveSnapshot(snapshot({ id: `snap_${i}` }));
    const snaps = loadSavedResults();
    expect(snaps).toHaveLength(5);
    expect(snaps[0].id).toBe('snap_7');
  });
});
