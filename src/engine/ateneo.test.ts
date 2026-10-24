import { describe, it, expect } from 'vitest';
import { filosofoDestacado, nombreCorto, primeraFrase } from './ateneo';

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

import { opinionesDelAteneo, afinidadDelAteneo, proximoInvitado } from './ateneo';
import type { DilemmaOption, Dilemma, PhilosophyKey } from '../types';

const op = (philosophy: PhilosophyKey): DilemmaOption => ({ text: 'x', impact: 0, philosophy });
const dilemas = (n: number): Dilemma[] => Array.from({ length: n }, (_, i) => ({ id: i + 1, title: `D${i + 1}`, quote: '', description: '', options: [] }));

describe('opinionesDelAteneo', () => {
  it('separa a quien piensa como la opcion elegida de quien piensa distinto', () => {
    const r = opinionesDelAteneo(['kant', 'mill', 'buda'], 1, op('deontologia'));
    expect(r.coinciden.map(p => p.id)).toEqual(['kant']);
    expect(r.difieren.map(p => p.id).sort()).toEqual(['buda', 'mill']);
  });

  it('no incluye a quien no tiene comentario en ese dilema', () => {
    const r = opinionesDelAteneo(['kant'], 999999, op('deontologia'));
    expect(r.coinciden).toHaveLength(0);
    expect(r.difieren).toHaveLength(0);
  });
});

describe('afinidadDelAteneo', () => {
  it('cuenta con quien coincidio el alumno, de mayor a menor', () => {
    const decisiones = [op('utilitarismo'), op('utilitarismo'), op('deontologia')];
    const r = afinidadDelAteneo(dilemas(3), decisiones, ['kant', 'mill', 'buda']);
    expect(r.map(a => [a.filosofo.id, a.coincidencias, a.total])).toEqual([
      ['mill', 2, 3], ['kant', 1, 3], ['buda', 0, 3],
    ]);
  });

  it('un invitado solo cuenta desde que llego al Ateneo', () => {
    const decisiones = [op('utilitarismo'), op('utilitarismo'), op('budismo'), op('budismo')];
    const r = afinidadDelAteneo(dilemas(4), decisiones, ['mill', 'buda'], { buda: 2 });
    const buda = r.find(a => a.filosofo.id === 'buda')!;
    expect(buda.total).toBe(2);
    expect(buda.coincidencias).toBe(2);
  });

  it('sin decisiones no hay afinidades que contar', () => {
    expect(afinidadDelAteneo([], [], ['kant'])[0].total).toBe(0);
  });
});

describe('proximoInvitado', () => {
  const rep = [op('utilitarismo'), op('utilitarismo'), op('utilitarismo'), op('deontologia')];

  it('invita cuando 3 de las ultimas 4 decisiones fueron de la misma corriente', () => {
    const p = proximoInvitado(['mill', 'kant', 'buda'], rep, []);
    expect(p).not.toBeNull();
    expect(['mill', 'kant', 'buda']).not.toContain(p!.id);
    expect(p!.philosophy).not.toBe('utilitarismo');
  });

  it('prefiere la corriente que el alumno menos eligio', () => {
    const p = proximoInvitado(['mill', 'kant', 'buda'], rep, []);
    // deontologia ya aparecio una vez; las demas, ninguna: no debe ser la mas elegida
    expect(p!.philosophy).not.toBe('deontologia');
  });

  it('no invita si las decisiones son variadas', () => {
    const variadas = [op('utilitarismo'), op('deontologia'), op('budismo'), op('estoicismo')];
    expect(proximoInvitado(['mill', 'kant', 'buda'], variadas, [])).toBeNull();
  });

  it('no invita antes de la cuarta decision', () => {
    expect(proximoInvitado(['mill'], [op('utilitarismo'), op('utilitarismo'), op('utilitarismo')], [])).toBeNull();
  });

  it('espera 4 decisiones entre una invitacion y la siguiente, y nunca pasa de 3', () => {
    const seis = [...rep, op('utilitarismo'), op('utilitarismo')];
    expect(proximoInvitado(['mill'], seis, [{ id: 'locke', en: 4 }])).toBeNull();
    const largas = Array.from({ length: 12 }, () => op('utilitarismo'));
    expect(proximoInvitado(['mill'], largas, [{ id: 'a', en: 4 }, { id: 'b', en: 5 }, { id: 'c', en: 6 }])).toBeNull();
    expect(proximoInvitado(['mill'], largas, [{ id: 'locke', en: 4 }])).not.toBeNull();
  });

  it('sin Ateneo elegido no hay nadie a quien sumar invitados', () => {
    expect(proximoInvitado([], rep, [])).toBeNull();
  });

  it('no invita si todos los pensadores ya estan en el Ateneo', () => {
    const todos = ['aristoteles', 'buda', 'seneca', 'kant', 'mill', 'nietzsche', 'korn', 'locke', 'beauvoir', 'arendt'];
    expect(proximoInvitado(todos, rep, [])).toBeNull();
  });
});

describe('primeraFrase', () => {
  it('corta en el primer punto, signo de pregunta o de exclamacion', () => {
    expect(primeraFrase('Uno dos. Tres cuatro.')).toBe('Uno dos.');
    expect(primeraFrase('¿Quién decide? Nadie sabe.')).toBe('¿Quién decide?');
    expect(primeraFrase('¡Basta! Y luego.')).toBe('¡Basta!');
  });
  it('si hay una sola frase la devuelve entera', () => {
    expect(primeraFrase('Una sola frase sin final')).toBe('Una sola frase sin final');
    expect(primeraFrase('Solo esta.')).toBe('Solo esta.');
  });
});
