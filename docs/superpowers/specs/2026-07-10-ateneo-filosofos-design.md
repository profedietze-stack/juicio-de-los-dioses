# Ateneo de Filósofos — diseño

## Motivación

El juego presenta 10 corrientes filosóficas (`philosophies.ts`) pero nunca las
personifica: el jugador ve argumentos abstractos, no la voz de un pensador
concreto. El Ateneo de Filósofos deja al jugador elegir hasta 4 filósofos
como "asesores" al inicio de la partida; durante los dilemas que tengan
contenido escrito, puede abrir un panel con la interpretación de cada
filósofo elegido sobre ese dilema específico — no una recomendación directa
("elegí la opción B"), sino su lectura del problema desde su propio sistema.

## Alcance

Feature nueva, aditiva, no rompe flujos existentes. Se implementa en fases:
esta spec cubre el sistema completo (pantallas, datos, integración) más el
contenido escrito para 15-20 dilemas (Fase 1). El resto de los dilemas queda
sin comentarios hasta fases futuras — el sistema ya soporta cobertura
parcial sin cambios de código.

## Los 10 filósofos

Uno por cada `PhilosophyKey` existente, elegidos por diversidad de escuela,
época, nacionalidad y género (2 mujeres mínimo):

| id | Nombre | Escuela (`PhilosophyKey`) | Años | Civilización |
|---|---|---|---|---|
| `aristoteles` | Aristóteles | virtuosismo | 384–322 a.C. | Grecia antigua |
| `buda` | Buda (Siddhartha Gautama) | budismo | s. VI a.C. | India/Nepal antiguos |
| `seneca` | Séneca | estoicismo | 4 a.C.–65 d.C. | Roma (Hispania) |
| `kant` | Immanuel Kant | deontologia | 1724–1804 | Prusia (Alemania) |
| `mill` | John Stuart Mill | utilitarismo | 1806–1873 | Inglaterra |
| `nietzsche` | Friedrich Nietzsche | nihilismo | 1844–1900 | Alemania |
| `korn` | Alejandro Korn | pragmatismo | 1860–1936 | Argentina |
| `locke` | John Locke | contractualismo | 1632–1704 | Inglaterra |
| `beauvoir` | Simone de Beauvoir | existencialismo | 1908–1986 | Francia |
| `arendt` | Hannah Arendt | feminismo | 1906–1975 | Alemania / EE. UU. |

`korn` se eligió sobre John Dewey por presencia real en currícula argentina
de Filosofía secundaria. `arendt` reemplaza a Carol Gilligan en la categoría
`feminismo` — su filosofía es más política (banalidad del mal, acción y
pluralidad) que ética del cuidado estricta, pero es la segunda voz femenina
del panel y su enfoque sobre juicio moral colectivo calza con el tono del
juego.

## Modelo de datos

### `src/data/philosophers.ts` (nuevo)

```ts
export interface Philosopher {
  id: string;
  name: string;
  philosophy: PhilosophyKey;
  years: string;
  civilization: string;
  bio: string;       // 1-2 frases, pantalla de selección
  portrait: string;  // '/philosophers/kant.jpg'
}

export const philosophers: Philosopher[] = [ /* los 10 de la tabla */ ];
```

### `src/data/ateneoComments.ts` (nuevo)

```ts
// dilemaId -> { philosopherId: texto }
export const ateneoComments: Record<number, Record<string, string>> = {
  3: {
    aristoteles: '...',
    buda: '...',
    // ... los 10, para cada dilema cubierto en Fase 1
  },
  // ...
};
```

Un dilema "cubierto" tiene comentario de los **10** filósofos, no solo de
los 4 cuya escuela aparece como opción visible — el comentario es la lectura
del filósofo sobre el dilema en general, independiente de qué botones estén
presentes. Esto evita huecos: cualquier combinación de hasta 4 filósofos
elegidos siempre tiene algo que mostrar en un dilema cubierto.

## Estado del juego

`types.ts`: `Screen` suma `'ateneo'`. `GameState` suma
`ateneoSelection: string[]` (ids de filósofos, máx 4).

`GameContext.tsx`:
- Acción `SET_ATENEO_SELECTION { ids: string[] }` — reemplaza el array
  completo (la pantalla de selección maneja el tope de 4 client-side antes
  de dispatchear), cap defensivo a 4 en el reducer también.
- `GO_TO_INTRO`/`BEGIN_GAME`: `ateneoSelection` se resetea a `[]` en cada
  `GO_TO_INTRO` (igual que `hiddenPhilosophy`/`strictJudge` hoy, pero sin
  persistir entre partidas — no hay parámetro para precargarlo) y se
  preserva de `intro`→`ateneo`→`BEGIN_GAME` vía el mismo patrón que los
  modos de dificultad.

## Pantallas

### Flujo

`menu` → `intro` → **`ateneo`** → `event`

El botón "Comenzar el Juicio" de `IntroScreen` cambia de dispatchear
`BEGIN_GAME` a dispatchear `GO_TO_SCREEN('ateneo')`.

### `AteneoSelectScreen.tsx` (nuevo)

- Grilla de 10 tarjetas (`.ateneo-card`): retrato circular (`object-fit:cover`,
  `border-radius:50%`), acento de borde en el color de su escuela
  (reusa `PHILO_CLS`/variables `--util`, `--deon`, etc.), nombre, años,
  civilización, bio corta.
- Tap togglea selección (máx 4 — la 5ª tarjeta tocada no hace nada visible
  más que un estado "disabled" sutil en las no seleccionadas cuando ya hay
  4). Tarjeta seleccionada con check/borde dorado.
- Footer: botón "Comenzar el Juicio" (dispatch `SET_ATENEO_SELECTION` +
  `BEGIN_GAME`) y botón ghost "Omitir" (dispatch `BEGIN_GAME` con selección
  vacía). Ambos funcionan con 0-4 elegidos — el Ateneo es opcional.

## Integración en el dilema

`EventScreen.tsx`: si `ateneoComments[ev.id]` existe y
`state.ateneoSelection.length > 0`, se muestra un botón discreto
"🏛 Ateneo" cerca de `.verdict-prompt`. Si no hay comentarios para ese
dilema, el botón no se renderiza (sin placeholders ni avisos).

Click abre `AteneoModal.tsx` (mismo patrón de overlay fixed que
`OptionsModal`/`ConfirmDialog`): lista los filósofos de
`state.ateneoSelection` que tengan entrada en
`ateneoComments[ev.id]` (todos, dado que un dilema cubierto tiene los 10),
cada uno con retrato pequeño + nombre + su texto para ese dilema.

## Retratos

10 imágenes de dominio público / open-source (Wikimedia Commons, mismo
mecanismo usado para los fondos de splash/menú: `Special:FilePath` +
`Invoke-WebRequest`), descargadas una vez durante la implementación —
no en runtime. Redimensionadas a un tamaño fijo chico (~300px de lado
mayor) para no inflar el peso de carga. Guardadas en
`public/philosophers/<id>.jpg`. El recorte ovalado/circular es puramente
CSS (`border-radius` + `object-fit:cover`), el archivo fuente queda
rectangular. Créditos CC-BY (cuando no sean CC0/PD) se muestran discretos,
mismo patrón que el crédito de la foto del splash.

## Fase 1 — contenido

15-20 dilemas elegidos por mayor riqueza filosófica (tensiones claras entre
escuelas) del pool de 60. Para cada uno, comentario de los 10 filósofos
(~150-200 textos cortos, 2-4 frases c/u). Selección concreta de dilemas se
hace al implementar, priorizando variedad temática dentro del bloque
elegido.

## Testing

- `philosophers.ts`: test de forma (10 entradas, ids únicos, cada
  `PhilosophyKey` cubierta exactamente una vez).
- `ateneoComments.ts`: test de forma (cada dilema cubierto tiene exactamente
  las 10 keys de `philosophers`, sin texto vacío).
- `GameContext`: reducer test para `SET_ATENEO_SELECTION` (cap a 4,
  reset en `GO_TO_INTRO`, preservación hasta `BEGIN_GAME`).
- `AteneoSelectScreen`: toggle de selección, tope de 4, navegación con 0/1/4
  elegidos, "Omitir".
- `EventScreen`: botón Ateneo aparece solo con comentarios+selección,
  ausente en dilemas sin cobertura o sin selección.
- `AteneoModal`: renderiza solo los filósofos seleccionados, textos
  correctos para el dilema actual.
- E2e: smoke test cubriendo Intro → Ateneo (elegir 2) → Comenzar → abrir
  panel Ateneo en un dilema cubierto.

## Fuera de alcance (fases futuras)

- Cobertura de los ~40 dilemas restantes.
- Roster persistente entre partidas.
- Comentarios ligados a la opción específica elegida (hoy es lectura del
  dilema en general, no reacción a la decisión tomada).
