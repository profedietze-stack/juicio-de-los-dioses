import { describe, it, expect } from 'vitest';
import { eventPool } from './index';

describe('eventPool', () => {
  it('has 85 dilemmas total (84 regular + 1 finale)', () => {
    expect(eventPool).toHaveLength(85);
  });

  it('has unique ids from 1 to 85', () => {
    const ids = eventPool.map(d => d.id).sort((a, b) => a - b);
    expect(new Set(ids).size).toBe(85);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(85);
  });

  it('every dilemma has a title, quote, description, and options with philosophy+impact', () => {
    for (const d of eventPool) {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.quote.length).toBeGreaterThan(0);
      expect(d.description.length).toBeGreaterThan(0);
      expect(d.options.length).toBeGreaterThanOrEqual(4);
      for (const opt of d.options) {
        expect(opt.text.length).toBeGreaterThan(0);
        expect(typeof opt.impact).toBe('number');
        expect(opt.philosophy.length).toBeGreaterThan(0);
      }
    }
  });

  it('the finale (id 60) has 10 options', () => {
    const finaleDilemma = eventPool.find(d => d.id === 60)!;
    expect(finaleDilemma.options).toHaveLength(10);
  });
});
