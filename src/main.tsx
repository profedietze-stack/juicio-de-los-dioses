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
