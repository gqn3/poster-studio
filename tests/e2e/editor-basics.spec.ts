import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('text survives reload and PNG download contains image bytes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect.poll(async () => page.evaluate(() => {
    const saved = localStorage.getItem('xhs_cover_versions');
    if (!saved) return 0;
    const data = JSON.parse(saved).versions[0].data;
    return data ? JSON.parse(data).objects.length : 0;
  })).toBeGreaterThan(0);

  await page.reload();
  const stored = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('xhs_cover_versions') || '{}');
    return JSON.parse(saved.versions[0].data).objects[0].text;
  });
  expect(stored).toBe('Double-click to edit');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  const bytes = await readFile(await download.path());
  expect(bytes.length).toBeGreaterThan(1000);
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
});
