import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test('loads the main menu', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('El Juicio de los Dioses')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nueva Partida' })).toBeVisible();
});

test('Guía Pedagógica shows all 10 philosophical currents on the Corrientes tab', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Guía Pedagógica' }).click();
  await page.getByRole('button', { name: 'Corrientes' }).click();
  await expect(page.locator('#tab-filosof .chip')).toHaveCount(10);
  await expect(page.locator('#tab-filosof h4', { hasText: 'Budismo' })).toBeVisible();
});

test('plays through the first dilemma and reaches the feedback panel', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Nueva Partida' }).click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-event')).toBeVisible();

  const title = await page.locator('#ev-title').textContent();
  await page.locator('.option-card').first().click();

  await expect(page.locator('#feedback-panel')).toBeVisible();
  await expect(page.locator('#ev-title')).toHaveText(title ?? '');

  await page.locator('.fb-continue').click();
  await expect(page.locator('#feedback-panel')).toHaveCount(0);
});
