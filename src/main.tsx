/*
  Las tipografias, servidas desde el propio sitio y no desde el CDN de Google.

  Los que abren esto son menores: ese servidor recibia, en cada carga y sin que
  nadie lo eligiera, la IP del aula y la hora. Y con el wifi de la escuela caido
  o el dominio filtrado, el juego se abria con otra letra.

  Solo el subconjunto latino y solo los grosores que el CSS usa.
*/
import '@fontsource/cinzel/latin-400.css'
import '@fontsource/cinzel/latin-600.css'
import '@fontsource/cinzel/latin-700.css'
import '@fontsource/cinzel/latin-900.css'
import '@fontsource/lora/latin-400.css'
import '@fontsource/lora/latin-500.css'
import '@fontsource/lora/latin-400-italic.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyUiPrefs, getUiPrefs } from './engine/uiPrefs'
import { initErrorBanner } from './utils/errorBanner'

// El banner global de errores. Un ErrorBoundary de React solo ve lo que
// revienta durante el render: los errores de `window` y las promesas sin
// atender pasan de largo y dejan la pantalla como si nada. En un aula eso
// es peor que un cartel feo, porque nadie sabe que mirar.
initErrorBanner()


applyUiPrefs(getUiPrefs())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Only register in production builds — the SW's cache-first strategy fights
// with Vite's dev server HMR module graph.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* offline support unavailable */ });
  });
}
