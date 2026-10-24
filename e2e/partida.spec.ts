import { test, expect, type Page } from '@playwright/test';

// Guardado entre recargas: se limpia solo la primera vez que se abre la pestaña.
// Silenciado, porque el docente (o quien prueba) esta delante.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('limpio')) {
      localStorage.clear();
      sessionStorage.setItem('limpio', '1');
      localStorage.setItem('audioMuted', 'true');
    }
  });
});

async function empezarPartidaCorta(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Partida Corta' }).click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await page.getByText('Immanuel Kant').click();
  await page.getByText('John Stuart Mill').click();
  await page.getByText('Friedrich Nietzsche').click();
  await page.getByRole('button', { name: 'Comenzar el Juicio' }).click();
  await expect(page.locator('#screen-event')).toBeVisible();
}

async function decidir(page: Page, indice: number) {
  await page.locator('.option-card').nth(indice).click();
  await page.locator('.fb-continue').click();
}

test('el boton Continuar Partida se ve y se puede tocar despues de recargar', async ({ page }) => {
  await empezarPartidaCorta(page);
  await decidir(page, 0);
  await decidir(page, 1);
  await expect(page.locator('.hud-prog')).toContainText('3 / 15');

  await page.reload();
  await page.getByRole('button', { name: 'Continuar' }).click();
  // Un click de verdad: si el boton esta oculto por CSS, Playwright espera y falla.
  await page.getByRole('button', { name: 'Continuar Partida' }).click();

  await expect(page.locator('#screen-event')).toBeVisible();
  await expect(page.locator('.hud-prog')).toContainText('3 / 15');
  // El Ateneo elegido se conserva al retomar.
  await expect(page.locator('.ateneo-open-btn')).toBeVisible();
});

test('una partida corta completa llega al final con el Tribunal y sin errores de consola', async ({ page }) => {
  test.setTimeout(150_000);
  const errores: string[] = [];
  page.on('pageerror', e => errores.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errores.push(`console: ${m.text()}`); });

  await empezarPartidaCorta(page);
  await expect(page.locator('.tr-card')).toHaveCount(4);

  for (let i = 0; i < 15; i++) {
    await expect(page.locator('.hud-prog')).toContainText(`${i + 1} / 15`);
    await decidir(page, i % 4);
  }

  await expect(page.locator('#screen-result')).toBeVisible();
  await expect(page.locator('#tribunal-final .tr-card')).toHaveCount(4);
  await expect(page.locator('.tr-lectura p')).toHaveCount(2);
  await expect(page.locator('#r-score')).toHaveText(/^\d+\/26$/);
  await expect(page.locator('#engagement-dedicacion li').first()).toContainText('de 15 dilemas');
  await expect(page.locator('#engagement-exploracion')).toContainText('de 10 corrientes');
  await expect(page.locator('#engagement-index')).toHaveCount(0);
  expect(errores).toEqual([]);
});
