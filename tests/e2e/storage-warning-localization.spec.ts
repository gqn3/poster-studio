import { test, expect } from '@playwright/test';

for (const locale of ['en', 'ar'] as const) {
  test(`autosave quota warning is understandable in ${locale}`, async ({ page }) => {
    await page.addInitScript((lang) => {
      localStorage.setItem('tapndo-locale', lang);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'xhs_cover_versions' && (window as any).__simulateQuota)
          throw new DOMException('Quota exceeded', 'QuotaExceededError');
        return original.call(this, key, value);
      };
    }, locale);
    await page.goto('/editor');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.getByRole('button', { name: locale === 'ar' ? 'نص' : 'Text', exact: true }).click();
    await page.evaluate(() => { (window as any).__simulateQuota = true; });
    await page.getByRole('button', { name: locale === 'ar' ? 'نص' : 'Text', exact: true }).click();
    await expect(page.getByText(locale === 'ar' ? 'مساحة تخزين المتصفح ممتلئة' : 'Browser storage is full', { exact: false })).toBeVisible({ timeout: 10000 });
  });
}
