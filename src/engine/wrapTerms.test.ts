import { describe, it, expect } from 'vitest';
import { wrapTerms } from './wrapTerms';
import { GLOSSARY } from '../data/glossary';

describe('wrapTerms', () => {
  it('wraps a known glossary term with a tooltip span', () => {
    const term = 'karma';
    expect(GLOSSARY[term]).toBeDefined();
    const result = wrapTerms(`Esto habla de ${term} en la tradición.`);
    expect(result).toContain('class="tip"');
    expect(result).toContain(`data-term="${term}"`);
  });

  it('does not wrap the same term twice in one call', () => {
    const result = wrapTerms('karma y otra vez karma en el mismo texto.');
    expect(result.match(/class="tip"/g)?.length ?? 0).toBe(1);
  });

  it('passes existing HTML tags through untouched', () => {
    const result = wrapTerms('<strong>karma</strong> es central.');
    expect(result.startsWith('<strong>')).toBe(true);
  });
});
