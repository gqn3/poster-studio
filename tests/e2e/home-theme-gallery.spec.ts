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
  await page.locator('.template-card').first().scrollIntoViewIfNeeded();
  await expect(page.locator('.template-thumb[data-preview-fallback="true"]').first()).toBeVisible();
  await expect(page.locator('.template-thumb-fallback').first()).toBeVisible();
});

test('shipping thumbnail asset resolves with an image response', async ({ page }) => {
  const response = await page.request.get('/templates/previews/en/0.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/image\//);
});

for (const width of [1440, 390]) for (const locale of ['en', 'ar']) {
  test(`actual previews and persistent themes at ${width}px (${locale})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript((lang) => localStorage.setItem('tapndo-locale', lang), locale);
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('#templates').scrollIntoViewIfNeeded();
    const imgs = page.locator('.template-thumb img');
    await expect(imgs).toHaveCount(6);
    await expect.poll(() => imgs.evaluateAll(nodes => nodes.filter(n => (n as HTMLImageElement).naturalWidth > 0).length)).toBe(6);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await page.getByRole('button', { name: /Toggle theme|تغيير المظهر/ }).click();
    await expect(page.locator('.studio-home')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('.studio-home')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: /Toggle theme|تغيير المظهر/ }).click();
    await page.reload();
    await expect(page.locator('.studio-home')).toHaveAttribute('data-theme', 'light');
    await context.close();
  });
}
