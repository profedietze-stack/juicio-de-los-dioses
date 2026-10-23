# Auditoría de «El Juicio de los Dioses» — 23 de octubre de 2026

Rama de trabajo: `tribunal-balanzas` (sin push, `master` intacto). Cada arreglo tiene su test, y se comprobó que ese test falla con el código anterior (`git stash` → rojo → `git stash pop`).

## Números

| | Antes | Ahora |
|---|---|---|
| Tests (vitest) | 215 | 268 |
| e2e Playwright | 8 | 10 (+ 1 offline en `npm run test:offline`) |
| `tsc -b` | limpio | limpio |
| ESLint | 0 errores, 5 advertencias | 0 errores, las mismas 5 |
| Bundle JS | 645 kB (204 kB gzip) | 645 kB (sin cambio) |
| CI (GitHub Actions) | solo `build` | `lint` + `test` + `build` |

## Hallazgos y estado

| ID | Sev. | Hallazgo | Estado |
|---|---|---|---|
| D1 | Alta | El puntaje dependía de la corriente: elegir siempre utilitarismo daba 100 y siempre deontología daba 9,3 (95 % de extinción). Contradice «ninguna opción es correcta». | **Arreglado**: modelo Tribunal (3 balanzas + La Sombra); condena solo La Sombra. Siempre utilitarismo condena 18 %, azar 12 %. |
| H9 | **Crítica** | «Continuar Partida» nunca se veía (`#btn-continue{display:none}` heredado del monolito). | **Arreglado**; e2e rojo→verde. |
| H10 | Alta | Al retomar se perdían modos y Ateneo (el ICR daba «Ateneo 0 %»). | **Arreglado**: autosave v2 guarda modos, Ateneo y Tribunal; los guardados v1 se descartan. |
| H2 | Alta | El service worker nunca hacía `cache.put` de JS/CSS/fuentes/audio: **sin internet el juego no abría** (e2e offline falla con el `sw.js` viejo). | **Arreglado**: cache-first con guardado al usar (solo 200 del propio sitio), precache tolerante, `respondWith` nunca rechaza, cache v4 con sello SHA-256 (`sw-precache.json` + test + `scripts/sellar-cache.mjs`). |
| H1 / H11 | Media | Opciones `div` sin teclado; modales sin `role="dialog"`, sin trampa de Tab ni Escape. | **Arreglado**: `role="button"` + Enter/Espacio + foco a «Continuar»; hook `useModal` en los 4 diálogos. |
| H3 | Media | «Mediador Universal» (≥ 8 corrientes) salía en el 98 % de las partidas de 40 y tapaba el final. | **Arreglado**: pide las 10 corrientes, ninguna sobre 15 %, y 30+ decisiones. |
| H4 | Media | El CI solo corría `build`. | **Arreglado**: corre lint y vitest antes del build. e2e **no** corre en CI (necesita navegadores; pendiente). |
| H6 | Baja | `launch.json` en el puerto 5173 sin `--strictPort` (riesgo de abrir otro juego). | **Arreglado**: puerto 5183 estricto. |
| H7 | Baja | Controles táctiles menores de 44 px. | **Arreglado** con `@media (pointer:coarse)`. No se midió en un dispositivo táctil real. |
| H12 | Baja | Intro decía «pool de 60». | **Arreglado**. |
| — | Baja | Dilema 12 con dos opciones de Virtuosismo. | **Arreglado** (la de cuidado y servicio pasa a Feminismo Ético); test sobre todo el banco. |
| ICR-1 | Media | Abrir y cerrar el Ateneo dos veces por dilema daba 100 % en «Consultas», sin leer nada. | **Arreglado**: la consulta cuenta si el modal estuvo abierto 5 s o más. |
| H8 | Baja | Bundle de 645 kB (204 kB gzip), la mayor parte datos (dilemas, 850 comentarios). | **No se tocó**: con el SW queda en caché tras la primera visita. Se puede partir el Ateneo con `import()` si molesta. |
| — | — | Final (dilema 60): 9 de 10 opciones «Sí». | **Arreglado**: 4 posturas críticas fundamentadas (utilitarismo negativo, nihilismo, virtuosismo, feminismo). |
| — | — | 13 opciones utilitarias casi siempre las más crueles. | **Reescritas** (`docs/tribunal-reescritura-utilitarismo.md`). |

## Revisiones de código y seguridad (Fase 4)

- **XSS:** `dangerouslySetInnerHTML` se usa en 5 sitios, todos con texto estático del propio juego (dilemas, glosario, síntesis). Ninguna entrada del jugador llega ahí. Sin riesgo hoy; si algún día se agrega texto libre del alumno, hay que escapar.
- **Terceros:** ningún recurso de terceros en la carga (fuentes autoalojadas). Un único enlace externo, de crédito de música, en la guía (no se carga).
- **Secretos:** `git log --all -S` con `password`, `api_key`, `ghp_`, `AKIA`, `BEGIN PRIVATE`: 0 resultados. `token`, `secret` y `sk-` dieron coincidencias que son palabras comunes (`js-tokens`, `task-`, «secreto médico») o `secrets.json` en `.gitignore`. Ningún `.env`, `.pem` ni `.key` versionado.
- **Persistencia:** `localStorage` envuelto en `try/catch` y versionado; el autosave valida campo por campo (incluido el Tribunal numérico).
- **Código:** sin `any`; 4 `eslint-disable` puntuales, ninguno nuevo.

## Pendientes y decisiones tuyas

1. **Citas (D4).** Marcadas por conocimiento propio, **sin verificar contra fuentes**: May Sarton (81) mal traducida («compañía» por *solitude*); la 20 (Saint-Exupéry) y la 83 («Proverbio atribuido») son la misma frase; atribuciones muy dudosas en Churchill (13), Chesterton (11), Hume (19), Piaf (73), Dostoievski (74), Bibesco (80) y Bourdieu (64); voseo de traducción en Klein (21) y Fried (77); «fuentes» sin autor en 14, 53, 54 y 70. ¿Hago una pasada de verificación con búsqueda web?
2. **Índice de Compromiso Reflexivo.** Sigue siendo inflable por otras vías: elegir 6 filósofos da +33 en «Amplitud» sin leer nada; la diversidad premia elegir corrientes al azar (el azar da ~100 %); el tiempo se infla dejando la pestaña abierta. Las consultas instantáneas al Ateneo ya no cuentan, pero queda lo anterior. Hacerlo menos inflable implica decidir qué valor pedagógico mide: es tuyo.
3. **Logros.** Siguen leyendo el puntaje (100 − Sombra%). «Extinción» (puntaje 0) se desbloquea con cualquier condena.
4. **Campo `impact`** viejo: sigue en los datos de 346 opciones, sin uso en pantalla.
5. **e2e en CI** y el e2e offline no corren en GitHub Actions todavía.
6. **Móvil:** vista de partida revisada en 375 px; pantalla final y modales sin revisar en móvil.
7. **Fase 5 (diseño de juego)** no se hizo como informe aparte.
