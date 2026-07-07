import { describe, it, expect } from 'vitest';
import { buildShareCardDataUrl } from './shareCard';

describe('buildShareCardDataUrl', () => {
  it('returns a PNG data URL', () => {
    const url = buildShareCardDataUrl({
      icon: '⚖',
      title: 'El Equilibrio Cósmico',
      score: 62,
      top: [
        ['utilitarismo', 40],
        ['deontologia', 30],
        ['virtuosismo', 20],
      ],
    });
    expect(url.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('does not throw when there are fewer than 3 philosophies', () => {
    expect(() => buildShareCardDataUrl({
      icon: '💀',
      title: 'El Fin',
      score: 0,
      top: [['nihilismo', 100]],
    })).not.toThrow();
  });

  it('does not throw with an empty top list', () => {
    expect(() => buildShareCardDataUrl({ icon: '⚖', title: 'X', score: 50, top: [] })).not.toThrow();
  });
});
