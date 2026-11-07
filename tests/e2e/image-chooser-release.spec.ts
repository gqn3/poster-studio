import { test, expect } from '@playwright/test';

test('image chooser defaults to local upload and does not offer unavailable services', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Image', exact: true }).click();
  await expect(page.getByRole('button', { name: /Upload image/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /Online|Shared/ })).toHaveCount(0);
  await page.getByRole('tab', { name: 'Image library' }).click();
  await expect(page.getByText('Your image library is empty')).toBeVisible();
});
