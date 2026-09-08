/**
 * Fisher-Yates.
 *
 * Estaba escrito así en `music.ts` para la cola de temas, y con
 * `[...pool].sort(() => Math.random() - 0.5)` en `poolBuilder.ts` para el orden
 * de los dilemas de la sesión. La segunda forma es un comparador inconsistente
 * —contesta distinto cada vez que se le pregunta por el mismo par— y no reparte
 * parejo: deja los elementos cerca de donde estaban.
 *
 * En la sesión eso importa: el pool viene ordenado por prioridad, así que los
 * dilemas mejor puntuados caían al principio bastante más seguido de lo que
 * corresponde, y el orden dejaba de ser una sorpresa.
 */
export function barajar<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
