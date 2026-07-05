import { describe, it, expect } from 'vitest';
import { GLOSSARY } from './glossary';

describe('GLOSSARY', () => {
  it('has at least one term and no empty definitions', () => {
    const keys = Object.keys(GLOSSARY);
    expect(keys.length).toBeGreaterThan(0);
    for (const k of keys) {
      expect(GLOSSARY[k].length).toBeGreaterThan(0);
    }
  });
});
