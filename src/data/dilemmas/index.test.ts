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

  it('every dilemma has a title, quote, description, and options with a philosophy', () => {
    for (const d of eventPool) {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.quote.length).toBeGreaterThan(0);
      expect(d.description.length).toBeGreaterThan(0);
      expect(d.options.length).toBeGreaterThanOrEqual(4);
      for (const opt of d.options) {
        expect(opt.text.length).toBeGreaterThan(0);
        // El campo `impact` (puntaje viejo, sin uso desde el Tribunal) ya no viaja en los datos.
        expect('impact' in opt).toBe(false);
        expect(opt.philosophy.length).toBeGreaterThan(0);
      }
    }
  });

  it('the finale (id 60) has 10 options', () => {
    const finaleDilemma = eventPool.find(d => d.id === 60)!;
    expect(finaleDilemma.options).toHaveLength(10);
  });

  it('ningun dilema (salvo el final) repite corriente entre sus opciones', () => {
    // Si dos opciones son de la misma corriente, elegir entre ellas no dice nada
    // del alumno y falta una corriente en ese dilema.
    const repetidos = eventPool
      .filter(d => d.id !== 60)
      .filter(d => new Set(d.options.map(o => o.philosophy)).size !== d.options.length)
      .map(d => d.id);
    expect(repetidos).toEqual([]);
  });
});
