import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 20000,
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/main.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
    },
  },
});
