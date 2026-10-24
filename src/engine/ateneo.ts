import { philosophers, type Philosopher } from '../data/philosophers';
import { ateneoComments } from '../data/ateneoComments';

// Cada dilema avisa de un pensador en particular («Kant tiene un comentario...»).
// Rota por la posicion del dilema en la partida, asi que a lo largo del juego todos
// los elegidos tienen su turno y el aviso no repite siempre al mismo.
export function filosofoDestacado(seleccion: string[], dilemaId: number, posicion: number): Philosopher | null {
  const comentarios = ateneoComments[dilemaId];
  if (!comentarios) return null;
  const candidatos = philosophers.filter(p => seleccion.includes(p.id) && comentarios[p.id]);
  if (candidatos.length === 0) return null;
  return candidatos[posicion % candidatos.length];
}

// «Buda (Siddhartha Gautama)» -> «Buda»; «Immanuel Kant» -> «Kant».
export function nombreCorto(nombre: string): string {
  const sinParentesis = nombre.replace(/\s*\(.*\)\s*/, '').trim();
  const partes = sinParentesis.split(/\s+/);
  return partes[partes.length - 1];
}
