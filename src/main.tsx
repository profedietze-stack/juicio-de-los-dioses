import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyUiPrefs, getUiPrefs } from './engine/uiPrefs'

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
