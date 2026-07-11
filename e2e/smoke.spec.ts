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
  await expect(page.locator('.menu-title')).toBeVisible();
});

test('menu screen has its own background art', async ({ page }) => {
  await skipSplash(page);
  const bgImage = await page.locator('#screen-menu').evaluate(el => getComputedStyle(el, '::before').backgroundImage);
  expect(bgImage).toContain('menu-last-judgment.jpg');
});

test('loads the main menu', async ({ page }) => {
  await skipSplash(page);
  await expect(page.locator('.menu-title')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nueva Partida' })).toBeVisible();
});

test('Guía Pedagógica shows all 10 philosophical currents on the Corrientes tab', async ({ page }) => {
  await skipSplash(page);
  await page.getByRole('button', { name: 'Guía Pedagógica' }).click();
  await page.getByRole('button', { name: 'Corrientes' }).click();
  await expect(page.locator('#tab-filosof .chip')).toHaveCount(10);
  await expect(page.locator('#tab-filosof h4', { hasText: 'Budismo' })).toBeVisible();
});

async function skipAteneo(page: Page) {
  await expect(page.locator('#screen-ateneo')).toBeVisible();
  await page.getByRole('button', { name: 'Omitir' }).click();
}

test('plays through the first dilemma and reaches the feedback panel', async ({ page }) => {
  await skipSplash(page);
  await page.getByRole('button', { name: 'Nueva Partida' }).click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await skipAteneo(page);
  await expect(page.locator('#screen-event')).toBeVisible();

  const title = await page.locator('#ev-title').textContent();
  await page.locator('.option-card').first().click();

  await expect(page.locator('#feedback-panel')).toBeVisible();
  await expect(page.locator('#ev-title')).toHaveText(title ?? '');

  await page.locator('.fb-continue').click();
  await expect(page.locator('#feedback-panel')).toHaveCount(0);
});

const ATENEO_COVERED_TITLES = new Set([
  'La Singularidad Inevitable', 'El Precio de la Longevidad', 'La Verdad o la Paz',
  'El Derecho al Sufrimiento', 'La Injusticia Perfecta', 'La Esclavitud Feliz',
  'El Precio de la Libertad', 'El Valor de una Vida', 'El Paraíso que Requiere un Infierno',
  'El Éxtasis Sin Costo', 'La Muerte Elegida', 'La Fusión de las Mentes',
  'El Planeta o la Especie', 'La Isla Perfecta', 'La Máquina que Dice Sufrir',
  'El Yo que Cambia', 'La Misericordia con lo Salvaje', 'El Veredicto Cósmico',
  // Fase 2
  'El Fin que Viene', 'La Memoria Prohibida', 'Después de Dios',
  'Los Nuevos Sin Trabajo', 'La Democracia Instantánea', 'La Nueva Especie',
  'El Asesino Arrepentido', 'El Peso de Saber', 'La Igualdad que Duele',
  'El Placer que Daña Poco', 'La Deuda de los Muertos', 'El Conocimiento Peligroso',
  'La Náusea del Libre Albedrío', 'La Mitad que Faltó Siempre', 'La Justicia Detrás del Velo',
  'Uno por Diez', 'El Tranvía Cósmico', 'La Compasión Universal',
  // Fase 3
  'El Contrato que Nadie Firmó', 'La Calma ante lo Inevitable', 'El Deseo como Problema',
  'El Mal Menor', 'La Ingeniería del Alma', 'El Cuidado como Justicia',
  'La Hegemonía que Se Rinde', 'La Muerte como Ceremonia', 'La Soledad Epidémica',
  'El Oráculo de la Felicidad', 'La Templanza en la Crisis', 'La Compasión Incómoda',
  'El Peso de la Orden', 'Lo que se Aprende Antes', 'El Derecho del Presente',
  'La Seguridad que Amamos', 'El Exceso de Todo', 'El Derecho a No Saber',
]);

// Session order is randomized (see poolBuilder.ts), so the covered dilemma's
// position isn't fixed — advance through the session (always picking the
// first option) until landing on one covered by Phase 1 Ateneo content.
async function advanceToCoveredDilemma(page: Page) {
  for (let i = 0; i < 39; i++) {
    const title = await page.locator('#ev-title').textContent();
    if (title && ATENEO_COVERED_TITLES.has(title)) return;
    await page.locator('.option-card').first().click();
    await page.locator('.fb-continue').click();
  }
  throw new Error('No covered dilemma found in this session');
}

test('Ateneo: selecting philosophers surfaces their comments on a covered dilemma', async ({ page }) => {
  await skipSplash(page);
  await page.getByRole('button', { name: 'Nueva Partida' }).click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-ateneo')).toBeVisible();

  await page.getByText('Immanuel Kant').click();
  await page.getByText('John Stuart Mill').click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-event')).toBeVisible();

  await advanceToCoveredDilemma(page);

  await expect(page.getByText('🏛 Ateneo')).toBeVisible();
  await page.getByText('🏛 Ateneo').click();
  await expect(page.locator('#ateneo-modal')).toBeVisible();
  await expect(page.getByText('Immanuel Kant')).toBeVisible();
  await expect(page.getByText('John Stuart Mill')).toBeVisible();

  await page.getByText('Cerrar').click();
  await expect(page.locator('#ateneo-modal')).toHaveCount(0);
});
