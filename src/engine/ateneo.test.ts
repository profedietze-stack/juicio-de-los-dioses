import { describe, it, expect } from 'vitest';
import { filosofoDestacado, nombreCorto } from './ateneo';

const SEIS = ['kant', 'mill', 'nietzsche', 'buda', 'seneca', 'locke'];

describe('filosofoDestacado', () => {
  it('devuelve alguien de los elegidos que tenga comentario en ese dilema', () => {
    const p = filosofoDestacado(SEIS, 1, 0);
    expect(p && SEIS).toContain(p!.id);
  });

  it('es estable para el mismo dilema y la misma posicion', () => {
    expect(filosofoDestacado(SEIS, 4, 7)?.id).toBe(filosofoDestacado(SEIS, 4, 7)?.id);
  });

  it('rota: en una partida le toca el turno a todos los elegidos', () => {
    const vistos = new Set(SEIS.map((_, i) => filosofoDestacado(SEIS, 1, i)!.id));
    expect(vistos.size).toBe(SEIS.length);
  });

  it('sin elegidos, o en un dilema sin comentarios, no hay a quien destacar', () => {
    expect(filosofoDestacado([], 1, 0)).toBeNull();
    expect(filosofoDestacado(SEIS, 999999, 0)).toBeNull();
  });
});

describe('nombreCorto', () => {
  it('saca el parentesis y deja el nombre con que se lo conoce', () => {
    expect(nombreCorto('Buda (Siddhartha Gautama)')).toBe('Buda');
    expect(nombreCorto('Immanuel Kant')).toBe('Kant');
    expect(nombreCorto('Friedrich Nietzsche')).toBe('Nietzsche');
    expect(nombreCorto('John Stuart Mill')).toBe('Mill');
    expect(nombreCorto('Simone de Beauvoir')).toBe('Beauvoir');
    expect(nombreCorto('Séneca')).toBe('Séneca');
  });
});
