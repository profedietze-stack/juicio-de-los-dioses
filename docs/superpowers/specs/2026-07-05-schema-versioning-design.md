# Versionado de esquema en localStorage — Diseño

## Contexto

Es el primer sub-proyecto de una lista de 6 mejoras pedidas por el usuario
(#8, #7, #3, #4, #5, #1 de un informe de "10 mejoras"). Se decidió hacerlo
primero porque #7 (exportar/importar progreso) se apoya en que el formato ya
esté versionado.

Hoy `src/engine/persistence.ts` (endurecido en la sesión de "robustez")
guarda valores crudos en cada clave de `localStorage` (`gameInProgress`,
`gameHistory`, `dilemaSeen`, `achievements`, `savedSnapshots`) y valida su
forma con guards (`isValidAutosaveData`, etc.) que descartan silenciosamente
cualquier dato que no calce. Eso resuelve datos corruptos, pero no distingue
"corrupto" de "válido pero de una versión de esquema anterior" — si algún día
cambia la forma de `HistoryRecord` (por ejemplo), los guards actuales lo
tratarían igual que basura y lo tirarían, sin posibilidad de migrarlo.

## Alcance acordado

- Cada clave pasa a guardar `{ version: number, data: T }` en vez del valor
  crudo (wrapping por clave, no una versión global única).
- Cada clave tiene su propia constante de versión, independiente de las
  demás.
- Si `wrapper.version` no coincide con la versión esperada de esa clave, se
  trata como dato corrupto: se descarta (mismo camino que ya existe para
  datos con forma inválida).
- **No se escribe ninguna función de migración real todavía.** No existe
  ningún cambio de formato pendiente de migrar — el juego solo tiene una
  versión publicada. El día que haya un cambio de forma real, se agrega el
  caso de migración concreto en ese momento.
- Efecto colateral aceptado: cualquier dato guardado antes de este cambio (sin
  el wrapper `{version, data}`) se descarta la primera vez que corra este
  código, igual que un dato corrupto.

## Diseño

### Helpers genéricos en `persistence.ts`

```ts
function readVersioned<T>(key: string, expectedVersion: number, isValid: (v: unknown) => v is T): T | null {
  let parsed: unknown;
  try { parsed = JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
  if (!parsed || typeof parsed !== 'object') return null;
  const wrapper = parsed as Record<string, unknown>;
  if (wrapper.version !== expectedVersion) return null;
  return isValid(wrapper.data) ? wrapper.data : null;
}

function writeVersioned(key: string, version: number, data: unknown) {
  lsSet(key, { version, data });
}
```

`readVersioned` reutiliza el patrón de "descartar si no calza" ya presente en
los guards existentes; simplemente agrega el chequeo de versión antes del
chequeo de forma.

### Constantes de versión (una por clave, todas en 1 hoy)

```ts
const SAVE_VERSION = 1;       // gameInProgress
const HISTORY_VERSION = 1;    // gameHistory (versiona el array completo)
const SEEN_VERSION = 1;       // dilemaSeen
const ACHIEVEMENTS_VERSION = 1; // achievements
const SNAPSHOTS_VERSION = 1;  // savedSnapshots
```

### Cambios por función

- `loadSavedGame()` — usa `readVersioned('gameInProgress', SAVE_VERSION, isValidAutosaveData)` en vez de `JSON.parse` directo. `autosave()` usa `writeVersioned('gameInProgress', SAVE_VERSION, data)`.
- `getHistory()` — usa `readVersioned('gameHistory', HISTORY_VERSION, (v): v is unknown[] => Array.isArray(v))`, y sobre ese array aplica el mismo filtro `isValidHistoryRecord` que ya existe (self-healing igual que antes, ahora dentro del wrapper). `saveHistory()` usa `writeVersioned`.
- `getSeenMap()` — misma idea: `readVersioned` para el objeto crudo, luego el mismo filtro de entradas numéricas que ya existe. `saveSeenMap()` usa `writeVersioned`.
- `getUnlockedAchievements()` — `readVersioned` + el mismo filtro contra ids reales de logros que ya existe. `saveUnlockedAchievements()` usa `writeVersioned`.
- `loadSavedResults()` / `saveSnapshot()` — mismo patrón con `isValidSnapshot`.

En todos los casos, si `readVersioned` devuelve `null` (por versión
incorrecta o forma inválida), el comportamiento es exactamente el mismo que
hoy cuando el dato es corrupto: se cae al valor por defecto y, donde ya
existía auto-reparación (reescribir la clave limpia), se sigue reescribiendo
— ahora ya envuelta con `{version, data}`.

## Testing

Extender `persistence.test.ts`:
- Cada getter existente sigue pasando con datos escritos por el propio
  `autosave`/`saveHistory`/etc. (que ahora escriben el wrapper).
- Nuevos casos: escribir directamente en `localStorage` un valor con
  `version` distinta a la esperada (ej. `{version: 0, data: {...válido...}}`)
  y confirmar que el getter correspondiente lo trata como ausente/corrupto
  (devuelve `null`/`[]`/`{}` y no crashea).
- Un caso que confirme que datos sin wrapper en absoluto (el formato viejo,
  pre-versionado) también se tratan como ausentes.

## Fuera de alcance

- Cualquier función `migrate()` real entre versiones.
- Una versión global única para todo el juego (se descartó a favor de
  versión por clave).
- Cambiar la forma de cualquier `HistoryRecord`/`ResultSnapshot`/etc. — este
  proyecto solo agrega el mecanismo de versionado, no cambia ningún dato.
