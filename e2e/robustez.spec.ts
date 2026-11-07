import { test, expect, type Page } from '@playwright/test';

// Lo que los tests unitarios no ven: el juego en un celular de verdad, el Tribunal plegable,
// el modal del Ateneo sobre una pantalla con scroll, los invitados del Ateneo y un guardado roto.
// Silenciado y con guardado limpio la primera vez que se abre la pestaña.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('limpio')) {
      localStorage.clear();
      sessionStorage.setItem('limpio', '1');
      localStorage.setItem('audioMuted', 'true');
    }
  });
});

function vigilar(page: Page) {
  const errores: string[] = [];
  page.on('pageerror', e => errores.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errores.push(`console: ${m.text()}`); });
  return errores;
}

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

async function sinScrollHorizontal(page: Page) {
  const { ancho, visible } = await page.evaluate(() => ({
    ancho: document.documentElement.scrollWidth,
    visible: window.innerWidth,
  }));
  expect(ancho).toBeLessThanOrEqual(visible);
}

// El modal es position:fixed: tiene que caer entero dentro de la ventana aunque la pantalla
// de abajo este scrolleada (un transform heredado lo desplazaba fuera, con el fondo cortado).
async function modalDentroDeLaVentana(page: Page) {
  const caja = await page.locator('#ateneo-modal').boundingBox();
  const alto = await page.evaluate(() => window.innerHeight);
  expect(caja).not.toBeNull();
  expect(caja!.y).toBeGreaterThanOrEqual(0);
  expect(caja!.y + caja!.height).toBeLessThanOrEqual(alto + 1);
}

test.describe('celular (375x812)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('se puede jugar sin scroll horizontal, con la barra del Tribunal y sin errores', async ({ page }) => {
    test.setTimeout(90_000);
    const errores = vigilar(page);
    await empezarPartidaCorta(page);
    await sinScrollHorizontal(page);

    await decidir(page, 0);
    // Desde el segundo dilema el Tribunal queda plegado en una barra con su boton.
    await expect(page.locator('.hud-prog')).toContainText('2 / 15');
    await expect(page.locator('.tr-toggle')).toBeVisible();
    await expect(page.locator('.tr-court')).toHaveCount(0);
    await sinScrollHorizontal(page);

    await page.locator('.tr-toggle').click();
    await expect(page.locator('.tr-court')).toBeVisible();
    await sinScrollHorizontal(page);

    await decidir(page, 1);
    await decidir(page, 2);
    await expect(page.locator('.hud-prog')).toContainText('4 / 15');
    expect(errores).toEqual([]);
  });

  test('el Ateneo abre dentro de la ventana aunque la pantalla este scrolleada', async ({ page }) => {
    const errores = vigilar(page);
    await empezarPartidaCorta(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.locator('.ateneo-open-btn').click();
    await expect(page.locator('#ateneo-modal')).toBeVisible();
    await modalDentroDeLaVentana(page);
    await page.getByText('Cerrar').click();
    await expect(page.locator('#ateneo-modal')).toHaveCount(0);
    expect(errores).toEqual([]);
  });
});

test('Tribunal: abierto en el primer dilema, plegado desde el segundo y se vuelve a abrir', async ({ page }) => {
  await empezarPartidaCorta(page);
  await expect(page.locator('.tr-court')).toBeVisible();

  await decidir(page, 0);
  await expect(page.locator('.hud-prog')).toContainText('2 / 15');
  await expect(page.locator('.tr-court')).toHaveCount(0);
  await expect(page.locator('.tr-toggle')).toHaveAttribute('aria-expanded', 'false');

  await page.locator('.tr-toggle').click();
  await expect(page.locator('.tr-court')).toBeVisible();
  await expect(page.locator('.tr-toggle')).toHaveAttribute('aria-expanded', 'true');
});

test('Ateneo: el modal abre dentro de la ventana con la pantalla scrolleada (escritorio)', async ({ page }) => {
  await empezarPartidaCorta(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.locator('.ateneo-open-btn').click();
  await expect(page.locator('#ateneo-modal')).toBeVisible();
  await modalDentroDeLaVentana(page);
});

test('Ateneo: tras repetir una misma corriente, un invitado se suma y se anuncia en el dilema', async ({ page }) => {
  test.setTimeout(90_000);
  const errores = vigilar(page);
  await empezarPartidaCorta(page);
  await decidir(page, 0);
  await decidir(page, 1);
  await decidir(page, 2);
  await expect(page.locator('.hud-prog')).toContainText('4 / 15');

  // Se simula haber elegido siempre lo mismo: las tres decisiones guardadas pasan a ser de una sola
  // corriente. Es la unica forma de forzarlo sin conocer las opciones del banco.
  await page.evaluate(() => {
    const crudo = JSON.parse(localStorage.getItem('gameInProgress') || 'null');
    crudo.data.decisions = crudo.data.decisions.map((d: { philosophy: string }) => ({ ...d, philosophy: 'utilitarismo' }));
    localStorage.setItem('gameInProgress', JSON.stringify(crudo));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Continuar Partida' }).click();
  await expect(page.locator('.hud-prog')).toContainText('4 / 15');
  await expect(page.locator('.ateneo-invitado')).toHaveCount(0);

  await decidir(page, 0);
  await expect(page.locator('.hud-prog')).toContainText('5 / 15');
  await expect(page.locator('.ateneo-invitado')).toBeVisible();
  await expect(page.locator('.ateneo-invitado')).toContainText('se suma al Ateneo');

  // El invitado se guarda: sobrevive a una recarga.
  await page.reload();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Continuar Partida' }).click();
  await expect(page.locator('.hud-prog')).toContainText('5 / 15');
  const guardado = await page.evaluate(() => JSON.parse(localStorage.getItem('gameInProgress') || 'null').data.ateneoInvitados);
  expect(guardado).toHaveLength(1);
  expect(errores).toEqual([]);
});

test('un guardado roto no rompe el juego: el menu abre sin Continuar Partida', async ({ page }) => {
  const errores = vigilar(page);
  await page.addInitScript(() => {
    localStorage.setItem('gameInProgress', '{"version":2,"data":{"current":"tres","decisions":7}}');
    localStorage.setItem('gameHistory', 'esto no es json');
    localStorage.setItem('unlockedAchievements', '[[[');
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.locator('.menu-title')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nueva Partida' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuar Partida' })).toHaveCount(0);
  expect(errores).toEqual([]);
});
