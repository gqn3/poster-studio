import { test, expect } from '@playwright/test';

test('home theme switches light and dark and persists after reload', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: /Toggle theme|تغيير المظهر/ });
  const home = page.locator('.studio-home');
  await expect(home).toHaveAttribute('data-theme', 'light');
  const before = await home.evaluate(el => getComputedStyle(el).backgroundColor);
  await button.click();
  await expect(home).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  const after = await home.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(after).not.toBe(before);
  await page.reload();
  await expect(home).toHaveAttribute('data-theme', 'dark');
  await button.click();
  await expect(home).toHaveAttribute('data-theme', 'light');
});

test('gallery shows a styled fallback if thumbnails fail to download', async ({ page }) => {
  await page.route('**/templates/previews/**', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.template-card')).toHaveCount(6);
  await expect(page.locator('.template-thumb[data-preview-fallback="true"]').first()).toBeVisible();
  await expect(page.locator('.template-thumb-fallback').first()).toBeVisible();
});

test('shipping thumbnail asset resolves with an image response', async ({ page }) => {
  const response = await page.request.get('/templates/previews/en/0.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/image\//);
});
