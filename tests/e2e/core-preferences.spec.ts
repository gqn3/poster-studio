import { expect, test } from '@playwright/test';

test('regional Arabic preference is resolved through shared Core and retained', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tapndo-locale', 'ar-SA'));
  await page.goto('/editor');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('button', { name: 'حفظ التصميم' })).toBeVisible();
});
