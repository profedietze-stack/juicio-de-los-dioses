import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

async function skipSplash(page: Page) {
  await page.goto('/');
  await expect(page.locator('#screen-splash')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.locator('#screen-splash')).toHaveCount(0);
}

test('shows the splashscreen with background art, then Continuar reveals the menu', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-splash')).toBeVisible();
  await expect(page.getByText('El Juicio', { exact: false })).toBeVisible();

  const bgImage = await page.locator('#screen-splash').evaluate(el => getComputedStyle(el).backgroundImage);
  expect(bgImage).toContain('splash-christ-redeemer.jpg');

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.locator('#screen-splash')).toHaveCount(0);
  await expect(page.getByText('El Juicio de los Dioses')).toBeVisible();
});

test('menu screen has its own background art', async ({ page }) => {
  await skipSplash(page);
  const bgImage = await page.locator('#screen-menu').evaluate(el => getComputedStyle(el, '::before').backgroundImage);
  expect(bgImage).toContain('menu-last-judgment.jpg');
});

test('loads the main menu', async ({ page }) => {
  await skipSplash(page);
  await expect(page.getByText('El Juicio de los Dioses')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nueva Partida' })).toBeVisible();
});

test('Guía Pedagógica shows all 10 philosophical currents on the Corrientes tab', async ({ page }) => {
  await skipSplash(page);
  await page.getByRole('button', { name: 'Guía Pedagógica' }).click();
  await page.getByRole('button', { name: 'Corrientes' }).click();
  await expect(page.locator('#tab-filosof .chip')).toHaveCount(10);
  await expect(page.locator('#tab-filosof h4', { hasText: 'Budismo' })).toBeVisible();
});

test('plays through the first dilemma and reaches the feedback panel', async ({ page }) => {
  await skipSplash(page);
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
