import { describe, it, expect } from 'vitest';
import { PHILO_DATA } from './philosophies';

describe('PHILO_DATA', () => {
  it('has exactly 10 philosophy entries', () => {
    expect(Object.keys(PHILO_DATA)).toHaveLength(10);
  });

  it('every entry has non-empty label, founders, short, long, tension', () => {
    for (const key of Object.keys(PHILO_DATA)) {
      const p = PHILO_DATA[key as keyof typeof PHILO_DATA];
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.founders.length).toBeGreaterThan(0);
      expect(p.short.length).toBeGreaterThan(0);
      expect(p.long.length).toBeGreaterThan(0);
      expect(p.tension.length).toBeGreaterThan(0);
    }
  });
});
