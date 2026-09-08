import { test, expect } from '@playwright/test';

// El banner tiene que aparecer con un error de window y con una promesa sin
// atender. Son los dos casos que un ErrorBoundary de React NO ve.
test('el banner aparece ante un error de window', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { setTimeout(() => { throw new Error('prueba-banner'); }, 0); });
  const banner = page.locator('#__error_banner__');
  await expect(banner).toBeVisible({ timeout: 5000 });
  await expect(banner).toContainText('prueba-banner');
});

test('el banner aparece ante una promesa sin atender', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { Promise.reject(new Error('promesa-sin-atender')); });
  const banner = page.locator('#__error_banner__');
  await expect(banner).toBeVisible({ timeout: 5000 });
  await expect(banner).toContainText('promesa-sin-atender');
});
