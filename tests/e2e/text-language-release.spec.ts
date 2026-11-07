import { test, expect } from '@playwright/test';
for (const [locale, expected, button] of [['en','Double-click to edit','Text'], ['ar','انقر مرتين للتحرير','نص']] as const) {
 test(`new text uses ${locale} language`, async ({ page }) => {
  await page.addInitScript((language) => localStorage.setItem('tapndo-locale', language), locale);
  await page.goto('/');
  await page.getByRole('button', { name: button, exact: true }).click();
  await expect.poll(() => page.evaluate(() => {
   const raw = localStorage.getItem('xhs_cover_versions');
   if (!raw) return '';
   const version = JSON.parse(raw).versions[0];
   return version.data ? JSON.parse(version.data).objects[0]?.text : '';
  })).toBe(expected);
 });
}
