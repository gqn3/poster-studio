import { test, expect } from '@playwright/test';

test('template gallery and confirmation are usable in English and Arabic', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Templates', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Template library' })).toBeVisible();
  await page.getByPlaceholder('Search templates').fill('Quote card');
  await page.getByRole('img', { name: 'Quote card · 720×960' }).click();
  await expect(page.getByRole('heading', { name: 'Use template' })).toBeVisible();
  await expect(page.getByText('This will replace the current canvas.')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
  await page.getByRole('button', { name: 'القوالب', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'مكتبة القوالب' })).toBeVisible();
  await page.getByPlaceholder('ابحث عن قالب').fill('بطاقة اقتباس');
  await page.getByRole('img', { name: 'بطاقة اقتباس · 720×960' }).click();
  await expect(page.getByRole('heading', { name: 'استخدام القالب' })).toBeVisible();
  await expect(page.getByText('سيُستبدل محتوى اللوحة الحالية.')).toBeVisible();
});
