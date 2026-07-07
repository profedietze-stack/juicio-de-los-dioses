# Diseño: Música ambiental, mute, modos de dificultad, logros nuevos, compartir resultado

Fecha: 2026-07-07

## Contexto

Sexto lote de mejoras sobre `juicio-de-los-dioses`, seleccionado de un informe de
10 ideas. Cubre 5 features independientes que comparten el motor de audio y el
flujo menú→intro→partida ya existente (`GameContext.tsx`, `poolBuilder.ts`,
`MenuScreen.tsx`).

## 1. Preferencias de audio (mute)

- Nuevo `src/engine/audioPrefs.ts`: `isMuted(): boolean`, `setMuted(v: boolean): void`,
  persistido en localStorage bajo una key propia (versionado como el resto de
  `persistence.ts`, reutilizando `readVersioned`/`writeVersioned`).
- `engine/audio.ts` (`snd()`) consulta `isMuted()` antes de reproducir cualquier SFX.
- `src/components/ui/MuteToggle.tsx`: botón flotante fijo (esquina inferior
  derecha), ícono 🔊/🔇, togglea `audioPrefs`. Montado una vez en `App.tsx`
  junto a `TooltipBox`/`AutosaveToast`, visible en todas las pantallas.

## 2. Música ambiental generativa

- Nuevo `src/engine/music.ts`: pad ambiental con 2-3 `OscillatorNode` en un
  acorde suave (ej. C-E-G-B a volumen bajo °0.03-0.05 por voz), con un
  `GainNode` maestro + un LFO lento (`OscillatorNode` de baja frecuencia
  modulando el filtro/gain) para textura "chill". Reutiliza el mismo
  `AudioContext` singleton de `audio.ts` (exportarlo o crear uno compartido en
  un módulo `audioContext.ts` para evitar dos contextos).
- API: `startMusic()`, `stopMusic()`. Ambas funciones no-op si `isMuted()`.
- `startMusic()` se llama al entrar a `event` (dentro del `useEffect` de
  `GameContext` que ya vigila `state.screen`), `stopMusic()` al salir a
  `menu`/`result`.
- El toggle de `MuteToggle` también debe detener la música en curso si el
  jugador mutea a mitad de partida, y reanudarla si desmutea estando en
  pantalla `event`.

## 3. Logros temáticos para block4

Tres nuevos ids en `src/data/achievements.ts`:

- `guardian-digital`: eligió la opción de mayor autonomía/criterio propio
  (no la de "dejarlo así"/aceptación pasiva) en AMBOS dilemas de IA (ids 81 y
  82) — específicamente evitar `impact >= 2` con filosofía `utilitarismo` en
  esos dos.
- `voz-del-rio`: en el dilema 84, eligió la opción `philosophy: 'feminismo'`
  (ir con las comunidades afectadas) — la opción que prioriza a los más
  vulnerables.
- `mano-que-toca`: en el dilema 85, eligió la opción `philosophy: 'feminismo'`
  (reorganizar turnos para garantizar contacto humano).

Implementación: `checkAchievements` en `engine/achievements.ts` recibe además
`eventIds: number[]` (mismo largo y orden que `decisions`, id del dilema
correspondiente a cada decisión — `state.sessionEvents.map(e => e.id)` ya
alineado por índice). Se construye un mapa `id -> DilemmaOption` elegida y se
evalúan las 3 condiciones nuevas.

## 4. Modo Filosofía Oculta

- `GameState.hiddenPhilosophy: boolean` (default `false`), viaja igual que
  `pendingLength` desde `MenuScreen` vía `GO_TO_INTRO` (nuevo campo en el
  action payload) hasta `BEGIN_GAME`.
- En `EventScreen`, si `state.hiddenPhilosophy`, no se renderiza
  `option-tag` (el chip de filosofía) en las tarjetas de opción antes de
  elegir. El `FeedbackPanel` posterior a elegir NO cambia — sigue revelando
  filosofía + impacto como siempre (la mecánica pedagógica de revelar
  después de decidir ya cumple el propósito del modo).

## 5. Modo Juez Estricto

- `GameState.strictJudge: boolean` (default `false`), mismo mecanismo de
  transporte que `hiddenPhilosophy`.
- Cuando activo, `EventScreen` muestra una cuenta regresiva de 20s por
  dilema (nuevo estado local `timeLeft` en el componente, con `setInterval`
  de 1s, reseteado cada vez que `state.current` cambia y no hay `feedback`
  aún).
- Al llegar a 0: se dispara automáticamente `CHOOSE` con una opción elegida
  al azar entre las del dilema actual, y además se resta una penalización
  fija de 5 puntos al balance (separado del `impact` de la opción elegida al
  azar). Nueva action `CHOOSE_TIMEOUT` en el reducer que aplica
  `impact + (-5)` en un solo paso, reutilizando el resto de la lógica de
  `CHOOSE`.
- El countdown se pausa/no aplica en la pantalla de `feedback` (ya elegida la
  opción) ni en la pantalla `result`/`intro`/`menu`.

## 6. Panel de modos en MenuScreen

- Dos toggles (checkbox o `Button` tipo pill activable) "Filosofía Oculta" y
  "Juez Estricto", ubicados debajo de los botones de Nueva Partida/Partida
  Corta. Estado local en `MenuScreen` (`hiddenPhilosophy`, `strictJudge`),
  se pasan junto con `length` al dispatch de `GO_TO_INTRO`.
- Se pueden combinar libremente entre sí y con cualquier duración de
  partida (corta o completa).
- `IntroScreen` puede mostrar opcionalmente qué modos están activos (texto
  chico), pero no es un requisito estricto — se agrega solo si es trivial.

## 7. Compartir resultado como imagen

- Nuevo `src/engine/shareCard.ts`: función `buildShareCardBlob(data): Promise<Blob>`
  que dibuja en un `<canvas>` (creado en memoria, no visible) una tarjeta
  compacta: fondo con el color del veredicto, ícono grande, título del
  veredicto, puntaje, y las top-3 filosofías con sus porcentajes (usa
  `topPhilosophies` ya existente en `historyStats.ts`), más el nombre "El
  Juicio de los Dioses" al pie. Devuelve el blob vía `canvas.toBlob()`.
- En `ResultScreen.tsx`: botón "Compartir Resultado" que genera el blob y
  dispara una descarga (`URL.createObjectURL` + `<a download>`), nombre de
  archivo `juicio-resultado-<fecha>.png`.

## Testing

- `audioPrefs.test.ts`: persistencia de mute.
- `music.test.ts` / `audio.test.ts`: verificar que `snd`/música no llaman a
  `AudioContext` cuando `isMuted()` es true (mock de `AudioContext`).
- `achievements.test.ts`: extender con casos para los 3 logros nuevos
  (positivos y negativos), pasando `eventIds`.
- `GameContext.test.tsx`: `GO_TO_INTRO` con `hiddenPhilosophy`/`strictJudge`,
  nueva action `CHOOSE_TIMEOUT` aplica impacto - 5 al balance.
- `EventScreen.test.tsx`: no renderiza `option-tag` cuando `hiddenPhilosophy`
  es true; cuenta regresiva visible y dispara elección automática cuando
  `strictJudge` es true (usar fake timers).
- `MenuScreen.test.tsx`: toggles cambian estado y se propagan en el dispatch.
- `shareCard.test.ts`: genera un blob de tipo `image/png` con las dimensiones
  esperadas (jsdom + mock de canvas context, patrón similar a
  `canvasRenderer.test.ts` si existe).

## Fuera de alcance

- No se agregan archivos de audio externos (música 100% generativa vía
  WebAudio).
- No hay integración con APIs de compartir nativas (`navigator.share`) —
  solo descarga de PNG local.
- No se persiste el estado de mute por dispositivo/usuario más allá de
  localStorage del navegador actual.
