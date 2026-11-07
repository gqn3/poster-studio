import { test, expect } from '@playwright/test';

test('image properties expose usable local controls without unavailable AI actions', async ({ page }) => {
  await page.goto('/editor');
  await page.getByRole('button', { name: 'Image', exact: true }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /Upload image/ }).click();
  await (await chooser).setFiles({name:'sample.png', mimeType:'image/png', buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII=', 'base64')});
  await expect(page.getByRole('tab', { name: 'Basic' })).toBeVisible();
  await expect(page.getByText('Opacity', { exact: true })).toBeVisible();
  await expect(page.getByText(/Background removal|AI改图/)).toHaveCount(0);
});
