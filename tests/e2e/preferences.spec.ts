import { test, expect } from '@playwright/test';

for (const width of [390, 768, 1440]) {
  test(`Arabic and dark preferences survive reload at ${width}px`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('/');
    await page.getByRole('button', { name: 'التبديل إلى العربية' }).click();
    await page.getByRole('button', { name: 'تفعيل الوضع الداكن' }).click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByRole('button', { name: 'تفعيل الوضع الفاتح' })).toHaveAttribute('aria-pressed', 'true');
    await page.close();
  });
}
