import { test, expect } from '@playwright/test';
test('Tab navigates normally after adding text instead of opening disabled AI settings', async ({ page }) => {
  await page.goto('/editor');
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
