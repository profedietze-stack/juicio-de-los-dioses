import { describe, it, expect } from 'vitest';
import { eventPool } from './index';

// Las citas son contenido que el alumno lee y puede repetir en clase: cada una
// tiene que tener un autor real, no repetirse y no estar escrita en voseo
// (son traducciones, no palabras del autor).
const partir = (q: string) => {
  const i = q.lastIndexOf(' —');
  return { texto: i < 0 ? q : q.slice(0, i), fuente: i < 0 ? '' : q.slice(i + 2) };
};

describe('citas de los dilemas', () => {
  it('todas traen una fuente al final, después de una raya', () => {
    const sin = eventPool.filter(d => partir(d.quote).fuente.trim().length < 3).map(d => d.id);
    expect(sin).toEqual([]);
  });

  it('ninguna «fuente» es en realidad un proverbio o una descripción', () => {
    const falsas = eventPool
      .filter(d => /proverbio|problema del tranv|respuesta m[aá]s com[uú]n|rechazo moderno|an[oó]nimo/i.test(partir(d.quote).fuente))
      .map(d => d.id);
    expect(falsas).toEqual([]);
  });

  it('no se repite ninguna cita (ni con otro autor)', () => {
    const norm = (t: string) => t.toLowerCase().replace(/[^a-záéíóúñ ]/g, '').replace(/\s+/g, ' ').trim();
    const vistos = new Map<string, number>();
    const repetidas: number[] = [];
    for (const d of eventPool) {
      const k = norm(partir(d.quote).texto);
      if (vistos.has(k)) repetidas.push(d.id);
      vistos.set(k, d.id);
    }
    expect(repetidas).toEqual([]);
  });

  it('ninguna está en voseo', () => {
    const voseo = eventPool
      .filter(d => /\b(sab[eé]s|pod[eé]s|quer[eé]s|ten[eé]s|sos|vos|dec[ií]s|hac[eé]s)\b/i.test(partir(d.quote).texto))
      .map(d => d.id);
    expect(voseo).toEqual([]);
  });
});
