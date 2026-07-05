# Robustez del juego — Diseño

## Contexto

"El Juicio de los Dioses" (Vite + React + TS) ya tiene lógica de juego, persistencia
en `localStorage` y una suite de tests (unit + component + e2e). El pedido del
usuario es hacerlo "más robusto": que no se rompa ante datos corruptos, errores
inesperados de render, o un navegador que no permite persistir datos.

Alcance acordado con el usuario (vía preguntas de brainstorming):
- Manejo de errores/crashes de React → Error Boundary global con pantalla de
  recarga.
- Datos corruptos en `localStorage` → descartar silenciosamente el dato
  inválido, sin avisar al jugador.
- `localStorage` no disponible (modo privado, cuota llena) → sí avisar, con un
  toast discreto.
- Validación de estado del juego → foco en `CONTINUE_GAME` (el único punto
  donde datos externos reconstruyen el estado), no en cada acción del reducer.

## A. Error Boundary global

Nuevo componente de clase `src/components/ErrorBoundary.tsx`:

```tsx
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: unknown) { console.error(error); }
  render() {
    if (this.state.hasError) return <ErrorFallback onReload={() => location.reload()} />;
    return this.props.children;
  }
}
```

`ErrorFallback` reutiliza la estética del juego (fondo oscuro, dorado, Cinzel)
con el mensaje "Algo salió mal en el Juicio" y un botón "Recargar". No hace
falta reconstruir el estado sin recarga: el autoguardado por dilema ya permite
retomar la partida desde el menú tras recargar.

`App.tsx` envuelve `<GameProvider>` (o su contenido inmediato) con
`<ErrorBoundary>`.

## B. Saneamiento de lecturas de `localStorage`

En `src/engine/persistence.ts`, cada función que lee de `localStorage` valida
la forma de los datos antes de devolverlos. Si un registro no es válido, se
descarta esa entrada (no toda la clave, salvo que la clave completa no sea ni
siquiera un array/objeto). Ningún error se propaga al llamador; todo se
resuelve a un valor por defecto seguro (`null`, `[]`, `{}`).

Guards nuevos (funciones puras, testeables por separado):
- `isValidAutosaveData(d: unknown): d is AutosaveData`
- `isValidHistoryRecord(r: unknown): r is HistoryRecord`
- `isValidSnapshot(s: unknown): s is ResultSnapshot`

Aplicados en:
- `loadSavedGame()` — valida el objeto completo; si falla, se comporta como si
  no hubiera partida guardada (y se limpia la clave corrupta).
- `getHistory()` — filtra elementos inválidos del array; si se filtró algo,
  reescribe la clave con el array limpio (auto-reparación).
- `loadSavedResults()` — mismo patrón que `getHistory()`.
- `getSeenMap()` — descarta entradas cuyo valor no sea `number`.
- `getUnlockedAchievements()` — descarta ids que no string, y además filtra
  contra los ids reales de `achievements.ts` (un id de una versión vieja del
  juego no debe quedar "fantasma" en la lista).

Todas estas funciones ya usan `try/catch` para `JSON.parse`; el cambio es
agregar validación de forma *después* del parse exitoso.

## C. Bug real encontrado: desalineamiento en `CONTINUE_GAME`

En `GameContext.tsx`, el reducer actual:

```ts
const idMap = new Map(eventPool.map(e => [e.id, e]));
const sessionEvents = saved.eventIds.map(id => idMap.get(id)).filter((e): e is Dilemma => Boolean(e));
```

Si un id guardado ya no existe en `eventPool` (por ejemplo, tras remover un
dilema en una actualización de contenido), `filter(Boolean)` lo saca de la
lista pero **no reajusta `current` ni `decisions`**, que fueron indexados
contra la lista original. Esto puede hacer que el jugador retome en el dilema
equivocado o que `current` quede fuera de rango al final de la partida.

Fix: si `sessionEvents.length !== saved.eventIds.length` (se perdió al menos
un id), se descarta la partida guardada completa y se cae al flujo normal de
"sin partida guardada" (pantalla `intro`), en vez de intentar una reparación
parcial. Esto es más simple y evita cualquier desalineamiento silencioso.

Además, se valida (usando los mismos guards de B) que `saved.current`,
`saved.balance`, `saved.decisions` y `saved.unlocked` tengan forma correcta
antes de usarlos; si no, incluyen el mismo camino de descarte.

## D. Aviso de almacenamiento no disponible

Nueva función en `persistence.ts`:

```ts
export function isStorageAvailable(): boolean {
  try {
    const k = '__storage_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch { return false; }
}
```

En `GameContext` (`GameProvider`), al montar, se llama una vez y si devuelve
`false` se dispara el mismo mecanismo de toast que ya existe para el
autoguardado (`toastVisible`), pero con un mensaje distinto: "No se podrá
guardar tu progreso en este navegador." Se muestra una sola vez al inicio de
la sesión (no en cada autoguardado fallido, ya que si falla una vez fallará
siempre).

El componente `Toast` ya acepta un prop `text`; se reutiliza sin cambios de
API, solo agregando un segundo texto posible controlado desde `GameContext`.

## Testing

Se agregan tests para cada pieza nueva, siguiendo la infraestructura ya
existente (Vitest + RTL + Playwright):

- `persistence.test.ts` — casos con JSON corrupto, tipos incorrectos, arrays
  con elementos mixtos válidos/inválidos, achievement ids desconocidos.
  Confirma auto-reparación (relectura tras `getHistory()`/`loadSavedResults()`
  devuelve la versión limpia).
- `GameContext` (extender `EventScreen.test.tsx` o nuevo archivo) — seed de un
  save corrupto (id faltante en `eventIds`, `current` fuera de rango) y
  verificación de que `CONTINUE_GAME` cae a `intro` en vez de crashear o
  desalinear.
- `ErrorBoundary.test.tsx` — un hijo que lanza en render; verifica que se
  muestra el fallback con el botón "Recargar" y que no crashea el árbol
  completo.
- Storage-unavailable: test que mockea `localStorage.setItem` para tirar, y
  verifica que aparece el toast con el mensaje correcto al montar
  `GameProvider`.

## Fuera de alcance (explícitamente descartado)

- Guards defensivos en cada acción del reducer (`CHOOSE`, `BEGIN_GAME`, etc.):
  esas acciones solo reciben datos ya validados desde la UI interna, no desde
  fuentes externas.
- Reparación parcial de una partida con ids faltantes: se descarta entera en
  vez de intentar reconstruir un estado parcialmente válido.
