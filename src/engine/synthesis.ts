import type { PhilosophyKey, PhilosophyInfo } from '../types';
import { PHILO_DATA } from '../data/philosophies';

export function buildSynthesis(ranked: PhilosophyKey[], pcts: Partial<Record<PhilosophyKey, number>>): string {
  const [dom, sec, thr] = ranked;
  const domPct = pcts[dom] || 0, secPct = pcts[sec] || 0, thrPct = pcts[thr] || 0;
  const spread = domPct - secPct;
  const totalActive = ranked.filter(k => (pcts[k] || 0) > 0).length;
  const domData: Partial<PhilosophyInfo> = PHILO_DATA[dom] || {};
  const secData: Partial<PhilosophyInfo> = PHILO_DATA[sec] || {};

  if (domPct < 22) {
    return `Tu pensamiento filosófico es de una <span class='philo-dominant'>excepcional pluralidad</span>. No hay ninguna corriente que domine claramente: has distribuido tus decisiones de forma casi equitativa entre ${totalActive} escuelas distintas. Esto revela una mente que se niega al dogmatismo, capaz de ver el valor de múltiples marcos éticos según el contexto. El desafío de este perfil es la coherencia: cuando los valores se distribuyen uniformemente, puede ser difícil sostener una posición clara ante dilemas que exigen decisión sin ambigüedad.`;
  }
  if (spread <= 8) {
    return `Tu perfil muestra una tensión productiva entre el <span class='philo-dominant'>${domData.label || dom}</span> (${domPct}%) y el <span class='philo-dominant'>${secData.label || sec}</span> (${secPct}%). Estas dos corrientes compiten casi en igualdad dentro de tu forma de juzgar. Para ${domData.founders ? domData.founders.split('·')[0].trim() : 'los pensadores de esta corriente'}, ${domData.short || ''}. Para ${secData.founders ? secData.founders.split('·')[0].trim() : 'los de la segunda corriente'}, ${secData.short || ''}. La coexistencia de estos marcos en tu pensamiento no es contradicción: puede ser la señal de una ética madura que reconoce que distintas situaciones exigen distintos principios.`;
  }
  let text = `Tu pensamiento muestra una orientación predominante hacia el <span class='philo-dominant'>${domData.label || dom}</span> (${domPct}%), con influencia secundaria del <span class='philo-dominant'>${secData.label || sec}</span> (${secPct}%)`;
  if (thrPct >= 8) text += ` y una presencia relevante del <span class='philo-dominant'>${(PHILO_DATA[thr] || {}).label || thr}</span> (${thrPct}%)`;
  text += `. ${domData.long || ''} `;
  if (secPct >= 12) text += `La influencia del ${secData.label || sec} —"${secData.short || ''}"— matiza este perfil: en situaciones donde el cálculo de consecuencias chocaba con principios, tu pensamiento mostró ambivalencia, lo que revela un juicio moral más complejo de lo que cualquier etiqueta única podría capturar. `;
  text += domData.tension || '';
  return text;
}
