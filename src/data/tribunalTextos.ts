import type { PanKey, ViceKey } from '../types';

// Palabras de todos los dias: el alumno tiene que entender cada platillo sin
// haber leido filosofia. Cada uno lleva una definicion y un ejemplo concreto.
export interface PanInfo { nombre: string; definicion: string; ejemplo: string }

export const PANES: Record<PanKey, PanInfo> = {
  Fel: { nombre: 'Felicidad', definicion: 'Que la mayoría viva mejor y sufra menos.', ejemplo: 'curar a mucha gente aunque cueste dinero' },
  Jus: { nombre: 'Justicia', definicion: 'Que cada uno reciba lo que le corresponde.', ejemplo: 'castigar al culpable aunque eso no mejore las cosas' },
  Lib: { nombre: 'Libertad', definicion: 'Que cada persona decida por sí misma.', ejemplo: 'dejar que alguien elija aunque se equivoque' },
  Bien: { nombre: 'Bien común', definicion: 'Lo que le conviene a todos juntos.', ejemplo: 'pagar impuestos para tener hospitales públicos' },
  Cor: { nombre: 'Corazón', definicion: 'Decidir con compasión, poniéndose en el lugar del otro.', ejemplo: 'perdonar una deuda a quien no puede pagarla' },
  Raz: { nombre: 'Razón', definicion: 'Decidir con lógica y datos, aunque no sea lo más amable.', ejemplo: 'elegir según la evidencia aunque duela' },
};

export interface ViceInfo { nombre: string; corto: string; definicion: string; ejemplo: string }

export const VICIOS: Record<ViceKey, ViceInfo> = {
  Sob: { nombre: 'Soberbia', corto: 'creerse con derecho a todo', definicion: 'Creerse con derecho a decidir por los demás, sin darles voz.', ejemplo: 'imponer tu plan «por su propio bien»' },
  Corr: { nombre: 'Corrupción', corto: 'usar el poder en beneficio propio', definicion: 'Usar el poder o el engaño para conseguir un fin.', ejemplo: 'ocultar un dato para quedar bien' },
  Cru: { nombre: 'Crueldad', corto: 'hacer daño a propósito', definicion: 'Hacerle daño a alguien a propósito.', ejemplo: 'castigar a un inocente para dar el ejemplo' },
  Ind: { nombre: 'Indiferencia', corto: 'mirar para otro lado', definicion: 'Mirar para otro lado cuando alguien sufre.', ejemplo: 'no ayudar porque «no es asunto mío»' },
};

// El final habla de la humanidad que dibujaron las decisiones, no de quien jugo.
export const MARCA_DEL_VICIO: Record<ViceKey, string> = {
  Sob: 'La humanidad que dibujaron estas decisiones quedó marcada sobre todo por la Soberbia: decidió por los demás como si el destino fuera suyo.',
  Corr: 'La humanidad que dibujaron estas decisiones quedó marcada sobre todo por la Corrupción: se acostumbró a que el fin justificara los medios.',
  Cru: 'La humanidad que dibujaron estas decisiones quedó marcada sobre todo por la Crueldad: el daño deliberado se volvió un recurso más.',
  Ind: 'La humanidad que dibujaron estas decisiones quedó marcada sobre todo por la Indiferencia: aprendió a mirar para otro lado.',
};

export const SIN_VICIO = 'Los dioses no encontraron en estas decisiones ninguna sombra que reprochar.';

// Tono segun el platillo que mas pesa en la balanza mas desequilibrada.
export const TONO_DE_LA_BALANZA: Record<PanKey, string> = {
  Fel: 'Su balanza más inclinada fue la Felicidad sobre la Justicia: una humanidad que prefirió que la mayoría viviera bien aunque a algunos no se les diera lo que les correspondía.',
  Jus: 'Su balanza más inclinada fue la Justicia sobre la Felicidad: una humanidad que prefirió dar a cada uno lo suyo aunque eso costara bienestar.',
  Lib: 'Su balanza más inclinada fue la Libertad sobre el Bien común: una humanidad que dejó decidir a cada uno aunque eso complicara la vida de todos.',
  Bien: 'Su balanza más inclinada fue el Bien común sobre la Libertad: una humanidad que puso lo colectivo primero aunque cada persona cediera algo propio.',
  Cor: 'Su balanza más inclinada fue el Corazón sobre la Razón: una humanidad que se dejó guiar por la compasión, incluso cuando los datos decían otra cosa.',
  Raz: 'Su balanza más inclinada fue la Razón sobre el Corazón: una humanidad que decidió con la cabeza fría, incluso cuando dolía.',
};

export const BALANZAS_PAREJAS = 'Sus balanzas quedaron parejas: una humanidad que no se dejó ganar por un solo valor.';
