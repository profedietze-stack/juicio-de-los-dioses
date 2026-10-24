import { describe, it, expect } from 'vitest';
import { ateneoComments } from './ateneoComments';
import { philosophers } from './philosophers';
import { eventPool } from './dilemmas';

const PHILOSOPHER_IDS = philosophers.map(p => p.id).sort();

describe('ateneoComments', () => {
  it('covers the entire dilemma pool (ids 1-85)', () => {
    const covered = Object.keys(ateneoComments).map(Number).sort((a, b) => a - b);
    const expected = Array.from({ length: 85 }, (_, i) => i + 1);
    expect(covered).toEqual(expected);
  });

  it('every covered dilemma id exists in the real dilemma pool', () => {
    const poolIds = new Set(eventPool.map(d => d.id));
    for (const id of Object.keys(ateneoComments).map(Number)) {
      expect(poolIds.has(id)).toBe(true);
    }
  });

  it('every covered dilemma has all 10 philosopher ids with non-empty text', () => {
    for (const [dilemmaId, comments] of Object.entries(ateneoComments)) {
      const keys = Object.keys(comments).sort();
      expect(keys, `dilemma ${dilemmaId}`).toEqual(PHILOSOPHER_IDS);
      for (const text of Object.values(comments)) {
        expect(text.length, `dilemma ${dilemmaId}`).toBeGreaterThan(30);
      }
    }
  });
});

// Calidad del texto: el Ateneo se lee entre varios pensadores, y se lee en el momento de decidir.
const palabras = (t: string) => t.trim().split(/\s+/).length;
const abreIgual = (t: string) => t.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase();
const entradas = Object.entries(ateneoComments).flatMap(([id, d]) =>
  Object.entries(d).map(([p, t]) => ({ id: Number(id), p, t })),
);
const ids = Object.keys(ateneoComments).map(Number);

// El nombre exacto de la corriente delata la etiqueta que el modo «Filosofía oculta» esconde.
const ETIQUETAS = /\b(utilitarismo|deontolog[ií]a|nihilismo|estoicismo|virtuosismo|budismo|contractualismo|existencialismo|feminismo|pragmatismo)\b/i;
const TUTEO = /\b(puedes|tienes|sabes|quieres|eliges|decides|haces|piensas|debes)\b/i;

describe('ateneoComments: calidad del texto', () => {
  it('cada dilema invita a pensar: al menos dos comentarios terminan en pregunta', () => {
    for (const id of ids) {
      const preguntas = entradas.filter(e => e.id === id && /\?\s*$/.test(e.t)).length;
      expect(preguntas, `dilema ${id}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('en un mismo dilema, dos pensadores no empiezan con las mismas dos palabras', () => {
    for (const id of ids) {
      const aperturas = entradas.filter(e => e.id === id).map(e => abreIgual(e.t));
      const repetidas = aperturas.filter((a, i) => aperturas.indexOf(a) !== i);
      expect(repetidas, `dilema ${id}`).toEqual([]);
    }
  });

  it('ningun comentario nombra la corriente por su etiqueta', () => {
    expect(entradas.filter(e => ETIQUETAS.test(e.t)).map(e => e.id + ':' + e.p)).toEqual([]);
  });

  it('nadie tutea: el juego habla en voseo o en forma impersonal', () => {
    expect(entradas.filter(e => TUTEO.test(e.t)).map(e => `${e.id}:${e.p}`)).toEqual([]);
  });

  it('el largo se mantiene legible: entre 15 y 55 palabras', () => {
    const fuera = entradas.filter(e => palabras(e.t) < 15 || palabras(e.t) > 55).map(e => `${e.id}:${e.p} (${palabras(e.t)})`);
    expect(fuera).toEqual([]);
  });
});
