import { defineConfig, devices } from '@playwright/test';

// Prueba del service worker: necesita el build de produccion (en desarrollo no
// se registra).  npx playwright test -c playwright.offline.config.ts
export default defineConfig({
  testDir: './e2e-offline',
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://localhost:5182', serviceWorkers: 'allow' },
  webServer: {
    command: 'npm run build && npx vite preview --port 5182 --strictPort',
    url: 'http://localhost:5182/juicio-de-los-dioses/',
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
