import type { Dilemma } from '../../types';
import { EFECTOS_RAW } from './efectosRaw';
import { parseEfectos } from './parser';

const EFECTOS = parseEfectos(EFECTOS_RAW);

// Agrega a cada opcion su `effects`, buscandolo por «idDilema.indice» con el
// indice de la opcion tal como esta escrita en los datos. Se aplica una sola vez,
// al armar el banco, antes de que nadie baraje: despues cada opcion ya lleva sus
// efectos adentro y ningun indice depende de la posicion en pantalla.
export function conEfectos(d: Dilemma): Dilemma {
  return {
    ...d,
    options: d.options.map((o, i) => {
      const effects = EFECTOS.get(`${d.id}.${i}`);
      return effects ? { ...o, effects } : o;
    }),
  };
}

export function cantidadDeEfectos(): number {
  return EFECTOS.size;
}
