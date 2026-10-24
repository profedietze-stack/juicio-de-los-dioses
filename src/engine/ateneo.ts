import { philosophers, type Philosopher } from '../data/philosophers';
import { ateneoComments } from '../data/ateneoComments';
import type { Dilemma, DilemmaOption, PhilosophyKey } from '../types';

const conComentario = (seleccion: string[], dilemaId: number): Philosopher[] => {
  const comentarios = ateneoComments[dilemaId];
  if (!comentarios) return [];
  return philosophers.filter(p => seleccion.includes(p.id) && comentarios[p.id]);
};

// Cada dilema avisa de un pensador en particular («Kant tiene un comentario...»).
// Rota por la posicion del dilema en la partida, asi que a lo largo del juego todos
// los elegidos tienen su turno y el aviso no repite siempre al mismo. Si hay un
// invitado recien llegado, el aviso es suyo.
export function filosofoDestacado(seleccion: string[], dilemaId: number, posicion: number, preferido?: string): Philosopher | null {
  const candidatos = conComentario(seleccion, dilemaId);
  if (candidatos.length === 0) return null;
  return candidatos.find(p => p.id === preferido) ?? candidatos[posicion % candidatos.length];
}

// «Buda (Siddhartha Gautama)» -> «Buda»; «Immanuel Kant» -> «Kant».
export function nombreCorto(nombre: string): string {
  const sinParentesis = nombre.replace(/\s*\(.*\)\s*/, '').trim();
  const partes = sinParentesis.split(/\s+/);
  return partes[partes.length - 1];
}

// Primera frase de un comentario: con un Ateneo grande se muestra esa y el resto se abre a pedido.
export function primeraFrase(texto: string): string {
  const m = texto.match(/^.*?[.?!](?=\s|$)/s);
  return m ? m[0] : texto;
}

// Cada pensador representa una corriente: «coincide» con quien eligio una opcion de la suya.
export function opinionesDelAteneo(seleccion: string[], dilemaId: number, opcion: DilemmaOption) {
  const todos = conComentario(seleccion, dilemaId);
  return {
    coinciden: todos.filter(p => p.philosophy === opcion.philosophy),
    difieren: todos.filter(p => p.philosophy !== opcion.philosophy),
  };
}

export interface AfinidadAteneo { filosofo: Philosopher; coincidencias: number; total: number }

// Con quien coincidio el alumno a lo largo de la partida. `desde` dice a partir de que
// decision cuenta cada invitado (el resto cuenta desde la primera).
export function afinidadDelAteneo(
  events: Dilemma[], decisions: DilemmaOption[], seleccion: string[], desde: Record<string, number> = {},
): AfinidadAteneo[] {
  return philosophers
    .filter(p => seleccion.includes(p.id))
    .map(p => {
      const propias = decisions.filter((_, i) => i >= (desde[p.id] ?? 0) && ateneoComments[events[i]?.id]?.[p.id]);
      return { filosofo: p, coincidencias: propias.filter(d => d.philosophy === p.philosophy).length, total: propias.length };
    })
    .sort((a, b) => b.coincidencias - a.coincidencias);
}

export const MAX_INVITADOS = 3;
const ESPERA_ENTRE_INVITACIONES = 4;
const VENTANA = 4;
const REPETICIONES = 3;

export interface Invitacion { id: string; en: number } // en = cuantas decisiones llevaba al llegar

// Cuando el alumno viene eligiendo siempre lo mismo, el Ateneo suma a alguien de una
// corriente que casi no eligio. No obliga a nada: solo trae otra voz.
export function proximoInvitado(seleccion: string[], decisions: DilemmaOption[], invitaciones: Invitacion[]): Philosopher | null {
  const n = decisions.length;
  if (seleccion.length === 0 || n < VENTANA || invitaciones.length >= MAX_INVITADOS) return null;
  if (invitaciones.some(i => n - i.en < ESPERA_ENTRE_INVITACIONES)) return null;

  const ultimas = decisions.slice(-VENTANA).map(d => d.philosophy);
  const veces = new Map<PhilosophyKey, number>();
  ultimas.forEach(k => veces.set(k, (veces.get(k) ?? 0) + 1));
  const repetida = [...veces.entries()].find(([, c]) => c >= REPETICIONES)?.[0];
  if (!repetida) return null;

  const elegidas = new Map<PhilosophyKey, number>();
  decisions.forEach(d => elegidas.set(d.philosophy, (elegidas.get(d.philosophy) ?? 0) + 1));
  const candidatos = philosophers.filter(p => !seleccion.includes(p.id) && p.philosophy !== repetida);
  if (candidatos.length === 0) return null;
  return [...candidatos].sort((a, b) => (elegidas.get(a.philosophy) ?? 0) - (elegidas.get(b.philosophy) ?? 0))[0];
}
