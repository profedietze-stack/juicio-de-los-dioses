import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('audioMuted', 'true'));
});

test('despues de dos visitas el juego abre sin conexion y se puede empezar una partida', async ({ page, context }) => {
  const errores: string[] = [];
  page.on('pageerror', e => errores.push(e.message));

  await page.goto('/juicio-de-los-dioses/');
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  // Primera visita sin controlar: la segunda ya pasa por el service worker y guarda los assets.
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.locator('.menu-title')).toBeVisible();
  // Espera a que se guarden los pedidos de esa visita.
  await page.waitForTimeout(1500);

  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.locator('.menu-title')).toBeVisible();

  await page.getByRole('button', { name: 'Partida Corta' }).click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await page.getByText('Immanuel Kant').click();
  await page.getByText('John Stuart Mill').click();
  await page.getByText('Friedrich Nietzsche').click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-event')).toBeVisible();
  await expect(page.locator('.tr-card')).toHaveCount(4);
  expect(errores).toEqual([]);
});
