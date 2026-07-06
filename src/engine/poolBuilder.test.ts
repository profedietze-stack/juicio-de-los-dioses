import { describe, it, expect, beforeEach } from 'vitest';
import { buildWeightedPool, buildNewSession, recordSeenDilemas } from './poolBuilder';
import { getSeenMap } from './persistence';
import { eventPool } from '../data/dilemmas';

beforeEach(() => localStorage.clear());

describe('buildWeightedPool', () => {
  it('excludes the given id from the drawn pool', () => {
    const pool = buildWeightedPool(60);
    expect(pool.some(d => d.id === 60)).toBe(false);
    expect(pool).toHaveLength(79);
  });

  it('returns the full pool when no id is excluded', () => {
    expect(buildWeightedPool()).toHaveLength(80);
  });
});

describe('buildNewSession', () => {
  it('builds 40 events: 39 regular + the finale last', () => {
    const session = buildNewSession();
    expect(session).toHaveLength(40);
    expect(session[39].id).toBe(60);
    expect(session.slice(0, 39).every(d => d.id !== 60)).toBe(true);
  });

  it('only draws from valid eventPool ids', () => {
    const validIds = new Set(eventPool.map(d => d.id));
    const session = buildNewSession();
    for (const d of session) expect(validIds.has(d.id)).toBe(true);
  });
});

describe('recordSeenDilemas', () => {
  it('increments seen counts for each played dilemma except the finale', () => {
    const session = buildNewSession();
    recordSeenDilemas(session);
    const map = getSeenMap();
    for (const d of session.slice(0, 39)) expect(map[d.id]).toBeDefined();
    expect(map[60]).toBeUndefined();
  });
});
