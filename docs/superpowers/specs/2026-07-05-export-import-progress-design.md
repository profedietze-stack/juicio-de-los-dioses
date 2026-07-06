# Exportar/Importar Progreso — Diseño

## Contexto

Segundo sub-proyecto de la lista de 6 mejoras pedidas por el usuario (#8, #7,
#3, #4, #5, #1). Se apoya en #8 (versionado de esquema), ya implementado:
cada clave de `localStorage` guarda `{version, data}`, lo que permite
validar un archivo importado con las mismas reglas que ya protegen contra
datos corruptos.

Hoy el progreso (historial, logros, informes guardados, partida en curso,
dilemas vistos) vive únicamente en el `localStorage` del navegador. Si el
jugador cambia de navegador o de dispositivo, lo pierde todo.

## Alcance acordado

- Exportar incluye las 5 claves completas: `gameInProgress`, `gameHistory`,
  `dilemaSeen`, `achievements`, `savedSnapshots`.
- Importar **reemplaza todo** el progreso actual (no fusiona).
- Ubicación de la UI: `AchievementsScreen` (Galería de Logros), junto a los
  botones existentes de "Volver al Menú" / "Borrar progreso".

## Diseño

### Refactor previo en `persistence.ts`

Extraer la validación de `readVersioned` en una función reutilizable que
opere sobre un valor ya parseado (no solo sobre lo que hay en
`localStorage`), para poder reusarla al validar el archivo importado:

```ts
function parseVersioned<T>(parsed: unknown, expectedVersion: number, isValid: (v: unknown) => v is T): T | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const wrapper = parsed as Record<string, unknown>;
  if (wrapper.version !== expectedVersion) return null;
  return isValid(wrapper.data) ? wrapper.data : null;
}

function readVersioned<T>(key: string, expectedVersion: number, isValid: (v: unknown) => v is T): T | null {
  let parsed: unknown;
  try { parsed = JSON.parse(localStorage.getItem(key) || 'null'); }
  catch { return null; }
  return parseVersioned(parsed, expectedVersion, isValid);
}
```

`readVersioned` sigue siendo la función que usan todos los getters
existentes (sin cambios en su comportamiento); `parseVersioned` es la pieza
nueva y reutilizable.

### `exportProgress()`

```ts
export interface ExportedProgress {
  exportedAt: string;
  keys: Partial<Record<'gameInProgress' | 'gameHistory' | 'dilemaSeen' | 'achievements' | 'savedSnapshots', unknown>>;
}

const EXPORT_KEYS = ['gameInProgress', 'gameHistory', 'dilemaSeen', 'achievements', 'savedSnapshots'] as const;

export function exportProgress(): ExportedProgress {
  const keys: ExportedProgress['keys'] = {};
  for (const k of EXPORT_KEYS) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try { keys[k] = JSON.parse(raw); } catch { /* unreadable entry, skip it */ }
  }
  return { exportedAt: new Date().toISOString(), keys };
}
```

Exporta los wrappers `{version, data}` tal cual están guardados — no hace
falta re-envolverlos.

### `importProgress(payload: unknown): boolean`

Valida **todo** antes de tocar `localStorage`. Solo si al menos una clave es
válida, borra el progreso actual (`clearProgress()`) y escribe las claves
válidas. Si el archivo entero es basura o no tiene ninguna clave válida,
`localStorage` queda intacto y la función devuelve `false`.

```ts
export function importProgress(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  if (!p.keys || typeof p.keys !== 'object') return false;
  const keys = p.keys as Record<string, unknown>;

  const toWrite: Record<string, unknown> = {};

  if (parseVersioned(keys.gameInProgress, SAVE_VERSION, isValidAutosaveData) !== null) {
    toWrite.gameInProgress = keys.gameInProgress;
  }

  const history = parseVersioned(keys.gameHistory, HISTORY_VERSION, isUnknownArray);
  if (history) {
    const clean = history.filter(isValidHistoryRecord);
    if (clean.length) toWrite.gameHistory = { version: HISTORY_VERSION, data: clean };
  }

  const seen = parseVersioned(keys.dilemaSeen, SEEN_VERSION, isPlainRecord);
  if (seen) {
    const clean: Record<number, number> = {};
    for (const [k, val] of Object.entries(seen)) if (typeof val === 'number') clean[Number(k)] = val;
    if (Object.keys(clean).length) toWrite.dilemaSeen = { version: SEEN_VERSION, data: clean };
  }

  const ach = parseVersioned(keys.achievements, ACHIEVEMENTS_VERSION, isUnknownArray);
  if (ach) {
    const validIds = new Set(achievements.map(a => a.id));
    const clean = ach.filter((id): id is string => typeof id === 'string' && validIds.has(id));
    if (clean.length) toWrite.achievements = { version: ACHIEVEMENTS_VERSION, data: clean };
  }

  const snaps = parseVersioned(keys.savedSnapshots, SNAPSHOTS_VERSION, isUnknownArray);
  if (snaps) {
    const clean = snaps.filter(isValidSnapshot);
    if (clean.length) toWrite.savedSnapshots = { version: SNAPSHOTS_VERSION, data: clean };
  }

  if (!Object.keys(toWrite).length) return false;

  clearProgress();
  for (const [key, val] of Object.entries(toWrite)) lsSet(key, val);
  return true;
}
```

### UI en `AchievementsScreen.tsx`

Dos botones nuevos junto al grupo existente de "Volver al Menú" / "Borrar
progreso":

- **"Exportar Progreso"** — llama `exportProgress()`, arma un `Blob` con
  `JSON.stringify(data, null, 2)`, crea un link temporal con
  `download="juicio-de-los-dioses-progreso-YYYY-MM-DD.json"` y lo clickea
  programáticamente. No requiere confirmación (no es destructivo).
- **"Importar Progreso"** — botón visible que dispara el click de un
  `<input type="file" accept="application/json" hidden>`. Al elegir un
  archivo: `FileReader` lo lee como texto, se hace `JSON.parse` (con
  try/catch), y si parsea bien se muestra un `ConfirmDialog` ("¿Reemplazar
  todo tu progreso actual por el del archivo importado?") antes de llamar a
  `importProgress()`. Si `JSON.parse` falla o `importProgress()` devuelve
  `false`, se muestra un mensaje de error inline (texto simple, sin
  `alert()` del navegador) y no se toca nada. Si tiene éxito, se refresca la
  pantalla (mismo patrón `forceRefresh` que ya usa el botón de borrar
  progreso).

## Testing

- `persistence.test.ts`: roundtrip completo `exportProgress` →
  `importProgress` reproduce el mismo estado; un archivo con JSON válido
  pero sin `keys` no borra nada y devuelve `false`; un archivo con una clave
  corrupta y otra válida importa solo la válida; versión de clave
  incorrecta en el archivo se descarta igual que en las lecturas normales.
- `AchievementsScreen.test.tsx` (nuevo): click en "Exportar Progreso" no
  tira error (verificar que se llama `URL.createObjectURL`); flujo de
  "Importar Progreso" con un archivo simulado válido reemplaza el estado;
  con un archivo simulado inválido muestra el mensaje de error y no borra
  nada.

## Fuera de alcance

- Fusionar (merge) datos en vez de reemplazar.
- Sincronización automática/en la nube — esto es exportar/importar manual
  vía archivo, nada de backend.
- Exportar/importar parcial (elegir qué claves incluir) — siempre son las 5.
