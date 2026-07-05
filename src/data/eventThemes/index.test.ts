import { describe, it, expect } from 'vitest';
import { EV_THEMES } from './index';

describe('EV_THEMES', () => {
  it('has 30 themes and every theme has a label and a fn', () => {
    expect(EV_THEMES.length).toBe(30);
    for (const t of EV_THEMES) {
      expect(t.label.length).toBeGreaterThan(0);
      expect(typeof t.fn).toBe('function');
    }
  });

  it('every theme fn runs without throwing on a real canvas context', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 250;
    const ctx = canvas.getContext('2d')!;
    for (const t of EV_THEMES) {
      expect(() => t.fn(ctx, 1000, 250)).not.toThrow();
    }
  }, 20000);
});
