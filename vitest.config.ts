import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // 60 s y no 20.
    //
    // Los tests que recorren la interfaz entera (App.test.tsx, ResultScreen)
    // tardan entre 10 y 25 segundos en una maquina descansada, asi que con 20
    // fallaban cada vez que habia algo mas corriendo en paralelo. Un test que
    // se pone rojo por carga y verde al repetirlo ensena a ignorar los rojos,
    // que es peor que no tenerlo.
    testTimeout: 60000,
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/main.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
    },
  },
});
