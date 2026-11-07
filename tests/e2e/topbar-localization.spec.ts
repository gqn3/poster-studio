import { test, expect } from '@playwright/test';

test('canvas actions and zoom controls are accessible in Arabic and English', async ({ page }) => {
  await page.goto('/editor');
  await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  await expect(page.getByRole('button', { name: 'Zoom out' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'تصغير' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'تكبير', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'إعادة ضبط التكبير' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'المزيد من الخيارات' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset zoom' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'More options' })).toHaveCount(0);
});
