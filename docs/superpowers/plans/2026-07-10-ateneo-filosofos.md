# Ateneo de Filósofos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the player pick up to 4 historical philosophers before starting a game; during dilemmas that have written content, a panel shows each chosen philosopher's interpretive take on that specific dilemma.

**Architecture:** Two new data files (`philosophers.ts`, `ateneoComments.ts`) reusing the existing `PhilosophyKey` type. One new screen (`AteneoSelectScreen`) inserted between Intro and the game start. One new modal (`AteneoModal`) surfaced from `EventScreen` via a conditional button. Reducer gains one action (`SET_ATENEO_SELECTION`) following the exact pattern already used for `hiddenPhilosophy`/`strictJudge`.

**Tech Stack:** React 18 + TypeScript + Vite, existing `GameContext` reducer, Vitest + Testing Library, Playwright e2e. No new dependencies.

---

## Reference data (used across multiple tasks)

### The 10 philosophers

| id | name | philosophy (`PhilosophyKey`) | years | civilization |
|---|---|---|---|---|
| `aristoteles` | Aristóteles | `virtuosismo` | 384–322 a.C. | Grecia antigua |
| `buda` | Buda (Siddhartha Gautama) | `budismo` | s. VI a.C. | India/Nepal antiguos |
| `seneca` | Séneca | `estoicismo` | 4 a.C.–65 d.C. | Roma (Hispania) |
| `kant` | Immanuel Kant | `deontologia` | 1724–1804 | Prusia (Alemania) |
| `mill` | John Stuart Mill | `utilitarismo` | 1806–1873 | Inglaterra |
| `nietzsche` | Friedrich Nietzsche | `nihilismo` | 1844–1900 | Alemania |
| `korn` | Alejandro Korn | `pragmatismo` | 1860–1936 | Argentina |
| `locke` | John Locke | `contractualismo` | 1632–1704 | Inglaterra |
| `beauvoir` | Simone de Beauvoir | `existencialismo` | 1908–1986 | Francia |
| `arendt` | Hannah Arendt | `feminismo` | 1906–1975 | Alemania / Estados Unidos |

### Phase 1 dilemma scope (18 ids, all in `block1.ts`)

`1, 2, 3, 4, 5, 7, 9, 10, 14, 17, 18, 19, 20, 22, 25, 28, 29, 30`

Titles for reference: 1 La Singularidad Inevitable · 2 El Precio de la Longevidad ·
3 La Verdad o la Paz · 4 El Derecho al Sufrimiento · 5 La Injusticia Perfecta ·
7 La Esclavitud Feliz · 9 El Precio de la Libertad · 10 El Valor de una Vida ·
14 El Paraíso que Requiere un Infierno · 17 El Éxtasis Sin Costo ·
18 La Muerte Elegida · 19 La Fusión de las Mentes · 20 El Planeta o la Especie ·
22 La Isla Perfecta · 25 La Máquina que Dice Sufrir · 28 El Yo que Cambia ·
29 La Misericordia con lo Salvaje · 30 El Veredicto Cósmico.

---

### Task 1: Extend `types.ts`

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add `'ateneo'` to the `Screen` union and `ateneoSelection` to `GameState`**

Open `src/types.ts`. Find the `Screen` union type (it currently includes
`'menu' | 'intro' | 'event' | 'result' | 'achievements' | 'info' | 'review'`)
and add `'ateneo'`:

```ts
export type Screen = 'menu' | 'intro' | 'ateneo' | 'event' | 'result' | 'achievements' | 'info' | 'review';
```

Find the `GameState` interface (it has `hiddenPhilosophy: boolean;` and
`strictJudge: boolean;` fields) and add, right after `strictJudge`:

```ts
  ateneoSelection: string[];
```

- [ ] **Step 2: Run typecheck to confirm it fails where GameState is constructed**

Run: `npx tsc -b --noEmit`
Expected: errors in `src/state/GameContext.tsx` about missing `ateneoSelection`
property on object literals (the `initialState` const and the `BEGIN_GAME`
case). This confirms the type change took effect — Task 3 fixes these.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat(ateneo): add ateneo screen and selection to game state types"
```

---

### Task 2: `philosophers.ts` data file

**Files:**
- Create: `src/data/philosophers.ts`
- Test: `src/data/philosophers.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/philosophers.test.ts
import { describe, it, expect } from 'vitest';
import { philosophers } from './philosophers';
import { ALL_PHILO_KEYS } from '../engine/results';

describe('philosophers', () => {
  it('has exactly 10 entries', () => {
    expect(philosophers.length).toBe(10);
  });

  it('has unique ids', () => {
    const ids = philosophers.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every PhilosophyKey exactly once', () => {
    const covered = philosophers.map(p => p.philosophy).sort();
    expect(covered).toEqual([...ALL_PHILO_KEYS].sort());
  });

  it('every entry has non-empty name, years, civilization, bio and portrait', () => {
    for (const p of philosophers) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.years.length).toBeGreaterThan(0);
      expect(p.civilization.length).toBeGreaterThan(0);
      expect(p.bio.length).toBeGreaterThan(20);
      expect(p.portrait).toMatch(/^\/philosophers\/.+\.jpg$/);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/philosophers.test.ts`
Expected: FAIL — `Cannot find module './philosophers'`

- [ ] **Step 3: Write the data file**

```ts
// src/data/philosophers.ts
import type { PhilosophyKey } from '../types';

export interface Philosopher {
  id: string;
  name: string;
  philosophy: PhilosophyKey;
  years: string;
  civilization: string;
  bio: string;
  portrait: string;
}

export const philosophers: Philosopher[] = [
  {
    id: 'aristoteles',
    name: 'Aristóteles',
    philosophy: 'virtuosismo',
    years: '384–322 a.C.',
    civilization: 'Grecia antigua',
    bio: 'Discípulo de Platón y maestro de Alejandro Magno, fundó el Liceo de Atenas. Sostuvo que la vida buena consiste en cultivar el carácter virtuoso a través del hábito y la razón práctica.',
    portrait: '/philosophers/aristoteles.jpg',
  },
  {
    id: 'buda',
    name: 'Buda (Siddhartha Gautama)',
    philosophy: 'budismo',
    years: 's. VI a.C.',
    civilization: 'India/Nepal antiguos',
    bio: 'Príncipe que renunció a su vida de privilegios para buscar el fin del sufrimiento. Enseñó que el apego y el deseo son la raíz del dolor, y que la liberación llega por el desapego y la compasión.',
    portrait: '/philosophers/buda.jpg',
  },
  {
    id: 'seneca',
    name: 'Séneca',
    philosophy: 'estoicismo',
    years: '4 a.C.–65 d.C.',
    civilization: 'Roma (Hispania)',
    bio: 'Filósofo, dramaturgo y consejero del emperador Nerón, nacido en Córdoba. Defendió que la virtud y la serenidad interior son lo único verdaderamente nuestro, ajeno a la fortuna.',
    portrait: '/philosophers/seneca.jpg',
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    philosophy: 'deontologia',
    years: '1724–1804',
    civilization: 'Prusia (Alemania)',
    bio: 'Filósofo de Königsberg que nunca salió de su ciudad natal. Formuló el imperativo categórico: actuar solo según máximas que puedan convertirse en ley universal, sin importar las consecuencias.',
    portrait: '/philosophers/kant.jpg',
  },
  {
    id: 'mill',
    name: 'John Stuart Mill',
    philosophy: 'utilitarismo',
    years: '1806–1873',
    civilization: 'Inglaterra',
    bio: 'Filósofo y economista educado por su padre desde la infancia. Refinó el utilitarismo de Bentham distinguiendo placeres superiores e inferiores, y defendió la libertad individual como condición del progreso.',
    portrait: '/philosophers/mill.jpg',
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    philosophy: 'nihilismo',
    years: '1844–1900',
    civilization: 'Alemania',
    bio: 'Filólogo y filósofo que proclamó la muerte de Dios y el vacío de los valores heredados. Propuso la voluntad de poder y la creación de valores propios frente al nihilismo que él mismo diagnosticó.',
    portrait: '/philosophers/nietzsche.jpg',
  },
  {
    id: 'korn',
    name: 'Alejandro Korn',
    philosophy: 'pragmatismo',
    years: '1860–1936',
    civilization: 'Argentina',
    bio: 'Médico psiquiatra y filósofo argentino, referente del Reformismo Universitario de 1918. Defendió la libertad como creación histórica concreta, no como abstracción, ligada a la experiencia y la acción.',
    portrait: '/philosophers/korn.jpg',
  },
  {
    id: 'locke',
    name: 'John Locke',
    philosophy: 'contractualismo',
    years: '1632–1704',
    civilization: 'Inglaterra',
    bio: 'Médico y filósofo, padre del liberalismo político. Sostuvo que los individuos poseen derechos naturales a la vida, la libertad y la propiedad, y que el gobierno legítimo nace del consentimiento de los gobernados.',
    portrait: '/philosophers/locke.jpg',
  },
  {
    id: 'beauvoir',
    name: 'Simone de Beauvoir',
    philosophy: 'existencialismo',
    years: '1908–1986',
    civilization: 'Francia',
    bio: "Filósofa, escritora y referente del existencialismo francés junto a Sartre. En 'El segundo sexo' analizó cómo la libertad y la identidad se construyen en situación, no en abstracto.",
    portrait: '/philosophers/beauvoir.jpg',
  },
  {
    id: 'arendt',
    name: 'Hannah Arendt',
    philosophy: 'feminismo',
    years: '1906–1975',
    civilization: 'Alemania / Estados Unidos',
    bio: "Filósofa política judeoalemana que huyó del nazismo. Acuñó la idea de la 'banalidad del mal' y sostuvo que la acción colectiva y el juicio propio son la base de la responsabilidad moral.",
    portrait: '/philosophers/arendt.jpg',
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/philosophers.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/philosophers.ts src/data/philosophers.test.ts
git commit -m "feat(ateneo): add the 10 philosophers data set"
```

---

### Task 3: Reducer — `SET_ATENEO_SELECTION`

**Files:**
- Modify: `src/state/GameContext.tsx`
- Test: `src/state/GameContext.test.tsx`

- [ ] **Step 1: Write the failing tests**

Append to `src/state/GameContext.test.tsx` (follow the existing pattern in
that file — a `Harness` component rendering buttons that dispatch actions,
wrapped in `<GameProvider>`):

```tsx
describe('SET_ATENEO_SELECTION', () => {
  function Harness() {
    const { state, dispatch } = useGame();
    return (
      <>
        <button onClick={() => dispatch({ type: 'GO_TO_INTRO', length: 40 })}>go-intro</button>
        <button onClick={() => dispatch({ type: 'SET_ATENEO_SELECTION', ids: ['kant', 'mill'] })}>select-two</button>
        <button onClick={() => dispatch({ type: 'SET_ATENEO_SELECTION', ids: ['kant', 'mill', 'nietzsche', 'seneca', 'buda'] })}>select-five</button>
        <button onClick={() => dispatch({ type: 'BEGIN_GAME' })}>begin</button>
        <div data-testid="selection">{state.ateneoSelection.join(',')}</div>
      </>
    );
  }

  function renderHarness() {
    render(
      <GameProvider>
        <Harness />
      </GameProvider>,
    );
  }

  it('starts empty', () => {
    renderHarness();
    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('stores up to 4 selected ids', () => {
    renderHarness();
    fireEvent.click(screen.getByText('select-two'));
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill');
  });

  it('caps at 4 even if more ids are dispatched', () => {
    renderHarness();
    fireEvent.click(screen.getByText('select-five'));
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill,nietzsche,seneca');
  });

  it('resets to empty on GO_TO_INTRO', () => {
    renderHarness();
    fireEvent.click(screen.getByText('select-two'));
    fireEvent.click(screen.getByText('go-intro'));
    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('is preserved through BEGIN_GAME', () => {
    renderHarness();
    fireEvent.click(screen.getByText('select-two'));
    fireEvent.click(screen.getByText('begin'));
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/state/GameContext.test.tsx`
Expected: FAIL — TypeScript error, `SET_ATENEO_SELECTION` is not a valid
action type, and `initialState`/`BEGIN_GAME` object literals are missing
`ateneoSelection` (from Task 1's type change).

- [ ] **Step 3: Implement the reducer changes**

In `src/state/GameContext.tsx`, find the `Action` union type and add, right
after the `SET_GAME_MODE` line:

```ts
  | { type: 'SET_ATENEO_SELECTION'; ids: string[] }
```

Find `const initialState: GameState = {` and add, right after
`strictJudge: false,`:

```ts
  ateneoSelection: [],
```

Find the `case 'GO_TO_INTRO':` block and add `ateneoSelection: [],` to the
returned object (same reset-on-new-intro pattern as `hiddenPhilosophy`/
`strictJudge`, but always empty — this isn't passed in via the action):

```ts
    case 'GO_TO_INTRO':
      return {
        ...state,
        screen: 'intro',
        pendingLength: action.length,
        hiddenPhilosophy: action.hiddenPhilosophy ?? false,
        strictJudge: action.strictJudge ?? false,
        ateneoSelection: [],
      };
```

Add a new case right after `case 'SET_GAME_MODE':`'s closing brace:

```ts
    case 'SET_ATENEO_SELECTION':
      return { ...state, ateneoSelection: action.ids.slice(0, 4) };
```

Find the `case 'BEGIN_GAME': {` block — it spreads `...initialState` and
then overrides specific fields including `hiddenPhilosophy: state.hiddenPhilosophy,`
and `strictJudge: state.strictJudge,`. Add right after those two lines:

```ts
        ateneoSelection: state.ateneoSelection,
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/state/GameContext.test.tsx`
Expected: PASS (all tests including the 5 new ones)

- [ ] **Step 5: Run full typecheck**

Run: `npx tsc -b --noEmit`
Expected: clean (no errors) — this also confirms Task 1's dangling errors
are now fixed.

- [ ] **Step 6: Commit**

```bash
git add src/state/GameContext.tsx src/state/GameContext.test.tsx
git commit -m "feat(ateneo): add SET_ATENEO_SELECTION action with 4-item cap"
```

---

### Task 4: Download the 10 portraits

**Files:**
- Create: `public/philosophers/aristoteles.jpg`, `buda.jpg`, `seneca.jpg`,
  `kant.jpg`, `mill.jpg`, `nietzsche.jpg`, `korn.jpg`, `locke.jpg`,
  `beauvoir.jpg`, `arendt.jpg`

- [ ] **Step 1: Create the target directory**

Run: `mkdir "C:\Users\nicod\Documents\JuegosEducativos\juicio-de-los-dioses\public\philosophers"` (PowerShell: `New-Item -ItemType Directory -Force -Path ...`)

- [ ] **Step 2: Download each portrait via Wikimedia's `Special:FilePath` redirect**

Run each of these (PowerShell `Invoke-WebRequest`, same technique already
used for the splash/menu backgrounds in this project — `Special:FilePath`
redirects to the actual file, `?width=400` requests a pre-scaled thumbnail
so no local resizing step is needed):

```powershell
$dir = "C:\Users\nicod\Documents\JuegosEducativos\juicio-de-los-dioses\public\philosophers"
$files = @{
  "aristoteles.jpg" = "https://commons.wikimedia.org/wiki/Special:FilePath/Aristoteles_Louvre.jpg?width=400"
  "buda.jpg"        = "https://commons.wikimedia.org/wiki/Special:FilePath/Gautama_Buddha.jpg?width=400"
  "seneca.jpg"      = "https://commons.wikimedia.org/wiki/Special:FilePath/Seneca.jpg?width=400"
  "kant.jpg"        = "https://commons.wikimedia.org/wiki/Special:FilePath/Immanuel_Kant_portrait_c1790.jpg?width=400"
  "mill.jpg"        = "https://commons.wikimedia.org/wiki/Special:FilePath/JohnStuartMill.jpg?width=400"
  "nietzsche.jpg"   = "https://commons.wikimedia.org/wiki/Special:FilePath/Nietzsche1882.jpg?width=400"
  "korn.jpg"        = "https://commons.wikimedia.org/wiki/Special:FilePath/Alejandro-korn.jpg?width=400"
  "locke.jpg"       = "https://commons.wikimedia.org/wiki/Special:FilePath/John_Locke.jpg?width=400"
  "beauvoir.jpg"    = "https://commons.wikimedia.org/wiki/Special:FilePath/Simone_de_Beauvoir_1955.jpg?width=400"
  "arendt.jpg"      = "https://commons.wikimedia.org/wiki/Special:FilePath/Young_Hannah_Arendt.jpg?width=400"
}
foreach ($f in $files.Keys) {
  Invoke-WebRequest -Uri $files[$f] -OutFile (Join-Path $dir $f) -UserAgent "Mozilla/5.0"
}
Get-ChildItem $dir | Select-Object Name, Length
```

Expected: 10 files listed, each roughly 15–80 KB.

- [ ] **Step 3: Check each file's license/author on its Wikimedia page**

For each of the 10 filenames above, open
`https://commons.wikimedia.org/wiki/File:<filename>` and note whether it's
PD/CC0 or CC-BY/CC-BY-SA. Most are PD (old paintings/busts/1882-era
photographs). `korn` (Alejandro-korn.jpg) is known CC-BY-SA — record the
author name from that file's page.

- [ ] **Step 4: Add attribution for any non-PD image**

If any file requires attribution (expected: at least `korn`), add a
one-line credits object so the UI can show it. Create:

```ts
// src/data/philosopherCredits.ts
// Only entries here need on-screen attribution (CC-BY/CC-BY-SA sources);
// PD/CC0 portraits are omitted.
export const philosopherCredits: Record<string, string> = {
  korn: 'Foto: Wikimedia Commons (CC BY-SA)',
};
```

(Adjust the exact author name in the string once confirmed in Step 3.)

- [ ] **Step 5: Commit**

```bash
git add public/philosophers src/data/philosopherCredits.ts
git commit -m "feat(ateneo): add portrait images for the 10 philosophers"
```

---

### Task 5: `AteneoSelectScreen`

**Files:**
- Create: `src/components/screens/AteneoSelectScreen.tsx`
- Test: `src/components/screens/AteneoSelectScreen.test.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/screens/AteneoSelectScreen.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider, useGame } from '../../state/GameContext';
import { MenuScreen } from './MenuScreen';
import { IntroScreen } from './IntroScreen';
import { AteneoSelectScreen } from './AteneoSelectScreen';

function Harness() {
  const { state } = useGame();
  return (
    <>
      {state.screen === 'menu' && <MenuScreen />}
      {state.screen === 'intro' && <IntroScreen />}
      {state.screen === 'ateneo' && <AteneoSelectScreen />}
      <div data-testid="screen">{state.screen}</div>
      <div data-testid="selection">{state.ateneoSelection.join(',')}</div>
    </>
  );
}

function renderAtAteneo() {
  render(
    <GameProvider>
      <Harness />
    </GameProvider>,
  );
  fireEvent.click(screen.getByText('Nueva Partida'));
  fireEvent.click(screen.getByText('Comenzar el Juicio'));
}

describe('AteneoSelectScreen', () => {
  beforeEach(() => localStorage.clear());

  it('shows all 10 philosopher cards', () => {
    renderAtAteneo();
    expect(document.querySelectorAll('.ateneo-card').length).toBe(10);
  });

  it('toggles selection on tap and reflects it in game state', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    expect(screen.getByText('Comenzar el Juicio').closest('button')).toBeTruthy();
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('kant');
  });

  it('caps selection at 4 — a 5th tap on an unselected card does nothing', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('John Stuart Mill'));
    fireEvent.click(screen.getByText('Friedrich Nietzsche'));
    fireEvent.click(screen.getByText('Séneca'));
    fireEvent.click(screen.getByText('Aristóteles'));
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('kant,mill,nietzsche,seneca');
  });

  it('tapping a selected card again deselects it', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('"Omitir" starts the game with no selection', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Immanuel Kant'));
    fireEvent.click(screen.getByText('Omitir'));
    expect(screen.getByTestId('screen').textContent).toBe('event');
    expect(screen.getByTestId('selection').textContent).toBe('');
  });

  it('"Comenzar el Juicio" starts the game', () => {
    renderAtAteneo();
    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(screen.getByTestId('screen').textContent).toBe('event');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/screens/AteneoSelectScreen.test.tsx`
Expected: FAIL — module not found, and `IntroScreen`'s "Comenzar el Juicio"
still dispatches `BEGIN_GAME` directly (fixed in Task 6).

- [ ] **Step 3: Write the component**

```tsx
// src/components/screens/AteneoSelectScreen.tsx
import { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';
import { philosophers } from '../../data/philosophers';
import { PHILO_CLS } from '../../engine/philosophyDisplay';
import { snd } from '../../engine/audio';

const MAX_SELECTION = 4;

export function AteneoSelectScreen() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    snd('tab');
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  }

  function start() {
    dispatch({ type: 'SET_ATENEO_SELECTION', ids: selected });
    dispatch({ type: 'BEGIN_GAME' });
  }

  function skip() {
    dispatch({ type: 'SET_ATENEO_SELECTION', ids: [] });
    dispatch({ type: 'BEGIN_GAME' });
  }

  return (
    <div className="screen ateneo-select-screen active" id="screen-ateneo">
      <div className="screen-heading">El Ateneo de los Filósofos</div>
      <div className="ateneo-intro-text">
        Elegí hasta {MAX_SELECTION} pensadores que te acompañen durante el juicio.
        Cuando lo necesites, vas a poder consultar cómo interpretarían el dilema
        que tenés delante.
      </div>
      <div className="ateneo-grid">
        {philosophers.map(p => {
          const isSelected = selected.includes(p.id);
          const disabled = !isSelected && selected.length >= MAX_SELECTION;
          const cls = PHILO_CLS[p.philosophy];
          return (
            <button
              key={p.id}
              type="button"
              className={`ateneo-card ${cls} ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => toggle(p.id)}
              disabled={disabled}
            >
              <img src={p.portrait} alt={p.name} className="ateneo-card-portrait" />
              <div className="ateneo-card-name">{p.name}</div>
              <div className="ateneo-card-meta">{p.years} · {p.civilization}</div>
              <div className="ateneo-card-bio">{p.bio}</div>
              {isSelected && <div className="ateneo-card-check">✓</div>}
            </button>
          );
        })}
      </div>
      <div className="ateneo-footer">
        <Button sound="start" onClick={start}>Comenzar el Juicio</Button>
        <Button ghost small onClick={skip}>Omitir</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add CSS**

Append to `src/index.css` (near the intro screen rules — search for
`/* INTRO SCREEN */` and add this block right after that section ends):

```css
/* ATENEO SELECT */
.ateneo-select-screen{flex:1;min-height:0;overflow-y:auto;padding:2rem 1.5rem 3rem;align-items:center;}
.ateneo-intro-text{max-width:640px;text-align:center;color:var(--muted);font-size:.88rem;line-height:1.7;margin:0 auto 1.6rem;}
.ateneo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;max-width:1000px;width:100%;margin:0 auto;}
.ateneo-card{
  position:relative;text-align:left;cursor:pointer;
  background:rgba(7,7,15,.55);border:1px solid rgba(212,175,55,.22);
  padding:1.1rem 1rem 1.3rem;display:flex;flex-direction:column;align-items:center;gap:.5rem;
  transition:border-color .2s,transform .2s;font-family:inherit;color:inherit;
}
.ateneo-card:not(.disabled):hover{transform:translateY(-3px);}
.ateneo-card.selected{border-color:var(--gold);box-shadow:0 0 20px var(--gold-glow);}
.ateneo-card.disabled{opacity:.4;cursor:not-allowed;}
.ateneo-card-portrait{width:88px;height:88px;border-radius:50%;object-fit:cover;border:2px solid rgba(212,175,55,.4);}
.ateneo-card-name{font-family:'Cinzel',serif;font-size:.82rem;color:var(--gold);text-align:center;letter-spacing:.5px;}
.ateneo-card-meta{font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;text-align:center;}
.ateneo-card-bio{font-size:.74rem;line-height:1.5;color:var(--text);text-align:center;}
.ateneo-card-check{position:absolute;top:.6rem;right:.6rem;color:var(--gold);font-size:1rem;}
.ateneo-footer{display:flex;flex-direction:column;align-items:center;gap:.7rem;margin-top:1.8rem;}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/screens/AteneoSelectScreen.test.tsx`
Expected: still FAIL on the navigation-dependent tests until Task 6 wires
`IntroScreen` → `ateneo`. The "shows all 10 philosopher cards" test may
also fail for the same reason (can't reach the screen yet). This is
expected — proceed to Task 6 before re-running.

- [ ] **Step 6: Commit**

```bash
git add src/components/screens/AteneoSelectScreen.tsx src/components/screens/AteneoSelectScreen.test.tsx src/index.css
git commit -m "feat(ateneo): add philosopher selection screen"
```

---

### Task 6: Wire navigation (Intro → Ateneo → event)

**Files:**
- Modify: `src/components/screens/IntroScreen.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Change IntroScreen's CTA to go to Ateneo instead of starting directly**

In `src/components/screens/IntroScreen.tsx`, find:

```tsx
          <Button sound="start" onClick={() => dispatch({ type: 'BEGIN_GAME' })} className="" style={{ minWidth: 240, fontSize: '.9rem', padding: '1rem 2rem' }}>
            Comenzar el Juicio
          </Button>
```

Replace the `onClick` with:

```tsx
          <Button sound="start" onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'ateneo' })} className="" style={{ minWidth: 240, fontSize: '.9rem', padding: '1rem 2rem' }}>
            Comenzar el Juicio
          </Button>
```

- [ ] **Step 2: Register the new screen in App.tsx**

In `src/App.tsx`, add the import:

```tsx
import { AteneoSelectScreen } from './components/screens/AteneoSelectScreen';
```

In `CurrentScreen()`'s switch, add a case right after `case 'intro':`:

```tsx
    case 'ateneo': return <AteneoSelectScreen />;
```

- [ ] **Step 3: Update `IntroScreen.test.tsx` for the new navigation target**

`src/components/screens/IntroScreen.test.tsx` currently has a `Harness`
that only renders `MenuScreen`/`IntroScreen`. Open it and add rendering for
the ateneo screen and update assertions that expect `state.screen` to become
`'event'` after clicking "Comenzar el Juicio" — they now land on `'ateneo'`
first. Locate any test asserting the old behavior (search for
`'Comenzar el Juicio'` in that file) and change the expected screen from
`'event'`/`document.getElementById('screen-event')` to
`document.getElementById('screen-ateneo')`.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: PASS for all files except any other test that assumed
"Comenzar el Juicio" jumps straight to the event screen — fix each one the
same way (assert `screen-ateneo` is reached, not `screen-event`). Search
across the repo for other occurrences:

Run: `grep -rn "Comenzar el Juicio" src --include=*.test.tsx`

For each match found outside `IntroScreen.test.tsx` and
`AteneoSelectScreen.test.tsx`, add a click on "Comenzar el Juicio" (from
`AteneoSelectScreen`) or "Omitir" right after the existing "Comenzar el
Juicio" click, so the flow reaches `event` again. Example for a harness
that renders `AteneoSelectScreen` conditionally:

```tsx
fireEvent.click(screen.getByText('Comenzar el Juicio')); // Intro -> Ateneo
fireEvent.click(screen.getByText('Omitir')); // Ateneo -> event, no selection
```

(Any harness component touched needs `AteneoSelectScreen` added to its
conditional rendering the same way `IntroScreen`/`ResultScreen`/etc. are
already added — follow the exact pattern already in that file.)

- [ ] **Step 5: Run full test suite again to confirm everything is green**

Run: `npx vitest run`
Expected: all test files PASS.

- [ ] **Step 6: Run typecheck and lint**

Run: `npx tsc -b --noEmit && npx eslint .`
Expected: tsc clean; eslint at the existing baseline (21 problems: 16
errors + 5 warnings, all pre-existing — no new ones introduced).

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/screens/IntroScreen.tsx src/components/screens/IntroScreen.test.tsx src/components/screens/AteneoSelectScreen.test.tsx
git commit -m "feat(ateneo): wire Intro -> Ateneo -> event navigation"
```

(Amend the `git add` list above with any other test file touched in Step 4.)

---

### Task 7: `ateneoComments.ts` — Phase 1 content

**Files:**
- Create: `src/data/ateneoComments.ts`
- Test: `src/data/ateneoComments.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/ateneoComments.test.ts
import { describe, it, expect } from 'vitest';
import { ateneoComments } from './ateneoComments';
import { philosophers } from './philosophers';
import { eventPool } from './dilemmas';

const PHILOSOPHER_IDS = philosophers.map(p => p.id).sort();

describe('ateneoComments', () => {
  it('covers exactly the 18 Phase 1 dilemma ids', () => {
    const covered = Object.keys(ateneoComments).map(Number).sort((a, b) => a - b);
    expect(covered).toEqual([1, 2, 3, 4, 5, 7, 9, 10, 14, 17, 18, 19, 20, 22, 25, 28, 29, 30]);
  });

  it('every covered dilemma id exists in the real dilemma pool', () => {
    const poolIds = new Set(eventPool.map(d => d.id));
    for (const id of Object.keys(ateneoComments).map(Number)) {
      expect(poolIds.has(id)).toBe(true);
    }
  });

  it('every covered dilemma has all 10 philosopher ids with non-empty text', () => {
    for (const [dilemmaId, comments] of Object.entries(ateneoComments)) {
      const keys = Object.keys(comments).sort();
      expect(keys, `dilemma ${dilemmaId}`).toEqual(PHILOSOPHER_IDS);
      for (const text of Object.values(comments)) {
        expect(text.length, `dilemma ${dilemmaId}`).toBeGreaterThan(30);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/ateneoComments.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the content file**

Write comments for all 18 Phase 1 dilemmas. Each philosopher's comment is a
2-3 sentence *interpretation* of the dilemma from their own system — never
"deberías elegir la opción X", always their reading of the tension. Two
fully worked dilemmas are given below as the exact pattern (voice, length,
register — informal "vos" is NOT used here, comments are written in the
philosopher's own descriptive voice, third-person or reflective first
person, matching the register already used in `philosophies.ts`'s `short`/
`tension` fields). Write the remaining 16 dilemmas (ids 2, 3, 4, 5, 9, 10,
14, 17, 18, 19, 20, 22, 25, 28, 29 — see the Phase 1 table at the top of
this plan for titles/descriptions, already present in
`src/data/dilemmas/block1.ts`) following this exact structure and register,
one entry per philosopher per dilemma, 10 entries each.

```ts
// src/data/ateneoComments.ts

// dilemaId -> { philosopherId: comentario }
// Cobertura Fase 1: 18 dilemas de block1.ts (ids 1,2,3,4,5,7,9,10,14,17,
// 18,19,20,22,25,28,29,30). El resto del pool queda para fases futuras —
// el sistema soporta cobertura parcial sin cambios de código.
export const ateneoComments: Record<number, Record<string, string>> = {
  1: {
    aristoteles: 'La pregunta no es si la inteligencia artificial superará a la humana, sino si quienes la desarrollan cultivan la prudencia necesaria para guiarla. Una capacidad sin carácter es una espada sin empuñadura.',
    buda: 'El deseo de acelerar, de controlar, de llegar primero: todo eso es apego a un resultado que no podés garantizar. La verdadera sabiduría está en actuar sin aferrarte a lo que la IA puede darte o quitarte.',
    seneca: 'Ninguna tecnología cambia lo único que depende de nosotros: nuestro juicio. Que la máquina piense más rápido no te exime de pensar bien; la prisa por decidir es, ella misma, el peligro mayor.',
    kant: 'La pregunta correcta no es qué produce el mejor resultado, sino qué reglas estarías dispuesto a universalizar. Si no aceptarías que cualquier laboratorio del mundo actúe con el mismo apuro que proponés, esa regla ya está descalificada.',
    mill: 'Hay que sumar con honestidad: el bienestar de miles de millones de personas futuras pesa tanto como el de las presentes. Un desarrollo cauteloso que reduce el riesgo catastrófico maximiza la felicidad esperada, aunque parezca más lento.',
    nietzsche: 'Los gobiernos paralizados no temen a la máquina: temen perder el monopolio de decidir el destino humano. Esa parálisis es más reveladora que cualquier informe técnico.',
    korn: 'La libertad no es una abstracción que se defiende con discursos: es una creación histórica concreta. Lo que hagamos con esta tecnología será, palabra por palabra, la libertad real de la próxima generación, no una idea sobre ella.',
    locke: 'Ninguna corporación ni gobierno tiene derecho natural a decidir unilateralmente el destino de todos. Si esto afecta a la humanidad entera, el consentimiento debe construirse colectivamente, no imponerse por quien llegue primero.',
    beauvoir: 'Cada generación se encuentra arrojada a una situación que no eligió, y esta no es la excepción. Lo que importa es que la decisión se tome en libertad y no por la inercia del miedo o de la ambición ciega.',
    arendt: 'Lo que más debería preocuparnos no es la máquina sino la ausencia de debate público real. Decisiones de esta magnitud tomadas por unos pocos, sin juicio colectivo, son el terreno donde crecen las peores catástrofes políticas.',
  },
  30: {
    aristoteles: 'Después de treinta juicios, la pregunta final no es qué hiciste sino en quién te convertiste haciéndolo. El carácter se forja en la repetición de las decisiones, no en una sola de ellas.',
    buda: 'Buscar un horizonte fijo, una "naturaleza moral" definitiva, es otra forma de apego. La brújula más sabia es la que se sostiene en la atención presente, dilema por dilema, sin necesitar una respuesta final.',
    seneca: 'Los dioses no imponen nada, decís, y eso es exactamente la condición estoica: lo único que controlamos es nuestro juicio. La brújula moral no apunta a un lugar, es la disciplina con que la sostenemos.',
    kant: 'Elegir conscientemente qué naturaleza moral queremos ser es, precisamente, el proyecto de la razón práctica: darnos a nosotros mismos la ley que seguimos, en vez de que las circunstancias la dicten por nosotros.',
    mill: 'Si de algo sirvió este largo juicio, es para calibrar mejor qué decisiones reducen el sufrimiento y amplían el bienestar. La brújula que vale la pena seguir es la que se corrige con la experiencia acumulada.',
    nietzsche: 'Que los dioses guarden silencio y solo pregunten es, en el fondo, la muerte de toda autoridad externa. La brújula moral que buscás no existe afuera: la única honesta es la que vos mismo creaste dilema tras dilema.',
    korn: 'La libertad se demuestra en el acto, no en la declaración de principios. Este juicio entero fue eso: treinta actos concretos que definieron, en los hechos y no en la abstracción, qué humanidad estás dispuesto a construir.',
    locke: 'Ninguna especie que se define a sí misma puede hacerlo sin acuerdo mutuo. Si de verdad hay una elección aquí, tiene que poder sostenerse como pacto entre quienes van a vivir sus consecuencias, no como decreto de uno solo.',
    beauvoir: 'Que los dioses solo observen y pregunten devuelve la responsabilidad exactamente a donde siempre estuvo: en la libertad situada de quien decide. No hay esencia humana previa que elegir, solo la que se construye en cada juicio.',
    arendt: 'El destino de la humanidad no es un hecho dado, es una elección perpetua: la trampa está en creer que hay una respuesta final. Lo que sostiene a una comunidad moral es seguir juzgando, en público y juntos, cada vez que haga falta.',
  },
};
```

Continue adding the remaining 16 dilemma ids (2, 3, 4, 5, 9, 10, 14, 17, 18,
19, 20, 22, 25, 28, 29) to the same object literal, each with the same
10-key structure, before the closing `};`. Pull the dilemma's `title`,
`quote` and `description` from `src/data/dilemmas/block1.ts` (find by
`id:`) to ground each philosopher's comment in the specific scenario —
don't write generic filler that could apply to any dilemma.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/ateneoComments.test.ts`
Expected: PASS (3 tests) once all 18 dilemma ids are present with all 10
philosopher keys each.

- [ ] **Step 5: Commit**

```bash
git add src/data/ateneoComments.ts src/data/ateneoComments.test.ts
git commit -m "feat(ateneo): write Phase 1 philosopher comments (18 dilemmas)"
```

---

### Task 8: `AteneoModal`

**Files:**
- Create: `src/components/modals/AteneoModal.tsx`
- Test: `src/components/modals/AteneoModal.test.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/modals/AteneoModal.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AteneoModal } from './AteneoModal';

describe('AteneoModal', () => {
  it('renders only the comments for the selected philosopher ids', () => {
    render(
      <AteneoModal
        dilemmaId={1}
        selection={['kant', 'mill']}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Immanuel Kant')).toBeInTheDocument();
    expect(screen.getByText('John Stuart Mill')).toBeInTheDocument();
    expect(screen.queryByText('Séneca')).not.toBeInTheDocument();
  });

  it('shows each philosopher\'s comment text for that dilemma', () => {
    render(
      <AteneoModal
        dilemmaId={1}
        selection={['kant']}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText(/imperativo categórico|universalizar/)).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<AteneoModal dilemmaId={1} selection={['kant']} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cerrar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay background', () => {
    const onClose = vi.fn();
    render(<AteneoModal dilemmaId={1} selection={['kant']} onClose={onClose} />);
    fireEvent.click(document.getElementById('ateneo-modal')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/modals/AteneoModal.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the component**

```tsx
// src/components/modals/AteneoModal.tsx
import { philosophers } from '../../data/philosophers';
import { ateneoComments } from '../../data/ateneoComments';

interface AteneoModalProps {
  dilemmaId: number;
  selection: string[];
  onClose: () => void;
}

export function AteneoModal({ dilemmaId, selection, onClose }: AteneoModalProps) {
  const comments = ateneoComments[dilemmaId] ?? {};
  const shown = philosophers.filter(p => selection.includes(p.id) && comments[p.id]);

  return (
    <div
      id="ateneo-modal"
      style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ateneo-modal-panel fade-up">
        <div className="ateneo-modal-title">🏛 El Ateneo Opina</div>
        <div className="ateneo-modal-list">
          {shown.map(p => (
            <div key={p.id} className="ateneo-modal-entry">
              <img src={p.portrait} alt={p.name} className="ateneo-modal-portrait" />
              <div>
                <div className="ateneo-modal-name">{p.name}</div>
                <div className="ateneo-modal-comment">{comments[p.id]}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: '.5rem', alignSelf: 'center' }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add CSS**

Append to `src/index.css`, right after the `.options-*` block added for
the Options modal (search for `.options-color{`):

```css
/* ATENEO MODAL */
.ateneo-modal-panel{
  max-width:560px;width:100%;max-height:88vh;overflow-y:auto;
  background:rgba(10,10,24,.99);border:1px solid rgba(212,175,55,.4);
  padding:1.6rem 1.5rem;display:flex;flex-direction:column;gap:1.1rem;
}
.ateneo-modal-title{font-family:'Cinzel',serif;font-size:.95rem;color:var(--gold);letter-spacing:2px;text-transform:uppercase;text-align:center;}
.ateneo-modal-list{display:flex;flex-direction:column;gap:1.1rem;}
.ateneo-modal-entry{display:flex;gap:.9rem;align-items:flex-start;}
.ateneo-modal-portrait{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid rgba(212,175,55,.4);flex-shrink:0;}
.ateneo-modal-name{font-family:'Cinzel',serif;font-size:.78rem;color:var(--gold);margin-bottom:.3rem;}
.ateneo-modal-comment{font-size:.85rem;line-height:1.6;color:var(--text);}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/modals/AteneoModal.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/modals/AteneoModal.tsx src/components/modals/AteneoModal.test.tsx src/index.css
git commit -m "feat(ateneo): add the Ateneo comments modal"
```

---

### Task 9: Wire the Ateneo button into `EventScreen`

**Files:**
- Modify: `src/components/screens/EventScreen.tsx`
- Test: `src/components/screens/EventScreen.test.tsx`

- [ ] **Step 1: Write the failing tests**

Append to `src/components/screens/EventScreen.test.tsx` (this file already
has a `ModesHarness`/`renderModesHarness` pattern for dispatching
`GO_TO_INTRO` with extra params before landing on `event` — follow that
same pattern, but dispatch `SET_ATENEO_SELECTION` too before `BEGIN_GAME`;
since `BEGIN_GAME` in this test file's harness is likely reached via
`GO_TO_INTRO` + a manual `BEGIN_GAME` dispatch rather than through the UI,
check the existing harness in that file and reuse it, adding one extra
dispatch button for the selection):

```tsx
describe('EventScreen Ateneo button', () => {
  function AteneoHarness({ selection }: { selection: string[] }) {
    const { dispatch } = useGame();
    return (
      <>
        <button onClick={() => {
          dispatch({ type: 'GO_TO_INTRO', length: 40 });
          dispatch({ type: 'SET_ATENEO_SELECTION', ids: selection });
          dispatch({ type: 'BEGIN_GAME' });
        }}>go</button>
        <EventScreen />
      </>
    );
  }

  function renderAteneoHarness(selection: string[]) {
    render(
      <GameProvider>
        <AteneoHarness selection={selection} />
      </GameProvider>,
    );
    fireEvent.click(screen.getByText('go'));
  }

  it('shows the Ateneo button on dilemma 1 (covered) when a philosopher is selected', () => {
    renderAteneoHarness(['kant']);
    expect(screen.getByText('🏛 Ateneo')).toBeInTheDocument();
  });

  it('hides the Ateneo button when no philosopher is selected', () => {
    renderAteneoHarness([]);
    expect(screen.queryByText('🏛 Ateneo')).not.toBeInTheDocument();
  });

  it('opens the modal with the selected philosopher\'s comment on click', () => {
    renderAteneoHarness(['kant']);
    fireEvent.click(screen.getByText('🏛 Ateneo'));
    expect(document.getElementById('ateneo-modal')).toBeInTheDocument();
    expect(screen.getByText('Immanuel Kant')).toBeInTheDocument();
  });
});
```

Note: dilemma 1 (`La Singularidad Inevitable`) is always the first dilemma
of a full 40-dilemma session per `buildNewSession`'s ordering — confirm
this against `src/engine/poolBuilder.ts` before relying on it; if session
order is randomized, use `state.sessionEvents[0].id` from the harness
instead of assuming id 1, or seed the test with a session that includes id
1 explicitly. Check `poolBuilder.test.ts` for how existing tests pin down
which dilemma appears first.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/screens/EventScreen.test.tsx`
Expected: FAIL — no "🏛 Ateneo" button exists yet.

- [ ] **Step 3: Implement the button and modal wiring**

In `src/components/screens/EventScreen.tsx`, add imports:

```tsx
import { useState } from 'react'; // already imported — just add to existing import
import { ateneoComments } from '../../data/ateneoComments';
import { AteneoModal } from '../modals/AteneoModal';
```

(`useState` is already imported in this file alongside `useEffect` — just
add `showAteneo` to the existing `useState` calls, don't duplicate the
import line.)

Inside the `EventScreen` component function, add:

```tsx
  const [showAteneo, setShowAteneo] = useState(false);
```

Find the `<div className="verdict-prompt" id="verdict-prompt">` block and
add, right after its closing `</div>`:

```tsx
            {state.ateneoSelection.length > 0 && ateneoComments[ev.id] && (
              <button
                type="button"
                className="btn btn-ghost btn-sm ateneo-open-btn"
                onClick={() => { snd('nav'); setShowAteneo(true); }}
              >
                🏛 Ateneo
              </button>
            )}
```

At the end of the component's returned JSX (right before the final closing
`</div>` of `#screen-event`), add:

```tsx
      {showAteneo && (
        <AteneoModal
          dilemmaId={ev.id}
          selection={state.ateneoSelection}
          onClose={() => setShowAteneo(false)}
        />
      )}
```

- [ ] **Step 4: Add CSS for the button placement**

Append to `src/index.css`, near `.verdict-prompt`:

```css
.ateneo-open-btn{display:block;margin:0 auto 1.1rem;}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/screens/EventScreen.test.tsx`
Expected: PASS (all tests, including the 3 new ones).

- [ ] **Step 6: Run the full suite, typecheck, lint**

Run: `npx vitest run && npx tsc -b --noEmit && npx eslint .`
Expected: all green; eslint at the existing baseline (21 problems).

- [ ] **Step 7: Commit**

```bash
git add src/components/screens/EventScreen.tsx src/components/screens/EventScreen.test.tsx src/index.css
git commit -m "feat(ateneo): show Ateneo button and modal during covered dilemmas"
```

---

### Task 10: e2e coverage

**Files:**
- Modify: `e2e/smoke.spec.ts`

- [ ] **Step 1: Add a new test**

Append to `e2e/smoke.spec.ts`:

```ts
test('Ateneo: selecting philosophers surfaces their comments on a covered dilemma', async ({ page }) => {
  await skipSplash(page);
  await page.getByRole('button', { name: 'Nueva Partida' }).click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-ateneo')).toBeVisible();

  await page.getByText('Immanuel Kant').click();
  await page.getByText('John Stuart Mill').click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-event')).toBeVisible();

  await expect(page.getByText('🏛 Ateneo')).toBeVisible();
  await page.getByText('🏛 Ateneo').click();
  await expect(page.locator('#ateneo-modal')).toBeVisible();
  await expect(page.getByText('Immanuel Kant')).toBeVisible();
  await expect(page.getByText('John Stuart Mill')).toBeVisible();

  await page.getByText('Cerrar').click();
  await expect(page.locator('#ateneo-modal')).toHaveCount(0);
});
```

This relies on dilemma 1 being covered by Phase 1 content and appearing
first in a full session — same caveat as Task 9's Step 1 note. If session
ordering isn't deterministic, adjust by reading the visible dilemma title
(`#ev-title`) and asserting the Ateneo button's presence conditionally, or
skip through dilemmas with "Continuar" until a covered one appears (check
against the 18 known covered ids).

- [ ] **Step 2: Run the e2e suite**

Run: `npx playwright test`
Expected: all tests PASS (5 existing + 1 new = 6).

- [ ] **Step 3: Commit**

```bash
git add e2e/smoke.spec.ts
git commit -m "test(ateneo): cover philosopher selection and comment panel with e2e"
```

---

### Task 11: Final full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the complete test suite**

Run: `npx vitest run`
Expected: all test files PASS, count increased from the pre-Ateneo baseline
of 168 tests by roughly 25-30 new tests.

- [ ] **Step 2: Run typecheck**

Run: `npx tsc -b --noEmit`
Expected: clean, no errors.

- [ ] **Step 3: Run lint**

Run: `npx eslint .`
Expected: 21 problems (16 errors + 5 warnings) — the pre-existing baseline,
unchanged by this feature. If the count differs, find and fix the new
issue before proceeding (do not adjust the baseline expectation without
first checking whether it's a real regression).

- [ ] **Step 4: Run e2e**

Run: `npx playwright test`
Expected: all 6 tests PASS.

- [ ] **Step 5: Manual smoke check in the browser preview**

Start the dev server, click through: Menú → Nueva Partida → Intro →
Comenzar el Juicio (lands on Ateneo) → select 2-3 philosophers → Comenzar
el Juicio → confirm the 🏛 Ateneo button appears on a covered dilemma
(e.g. "La Singularidad Inevitable") and opens a modal with the selected
philosophers' portraits and comments → confirm the button is absent on an
uncovered dilemma (any id not in the 18-item Phase 1 list, e.g. id 6 "El
Fin que Viene"). Also confirm portraits render (not broken images) for all
10 philosophers on the Ateneo selection screen.

- [ ] **Step 6: Final commit if any fixes were needed during verification**

```bash
git add -A
git commit -m "fix(ateneo): address issues found in final verification pass"
```

(Skip this step if Steps 1-5 all passed cleanly with no changes needed.)
