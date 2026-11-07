import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// A visible 32x32 opaque red PNG. A one-pixel image or checking localStorage alone
// cannot prove Fabric has restored and rendered an image after reload.
const redPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKElEQVR4nO3NMQEAAAjDMMC/ZzDBvlRA01vZJvwHAAAAAAAAAAAAbx2jxAE/i2AjOgAAAABJRU5ErkJggg==',
  'base64'
);

async function redPixelsOnCanvas(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas-container canvas.lower-canvas');
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 220 && data[i + 1] < 80 && data[i + 2] < 80 && data[i + 3] > 200) count++;
    }
    return count;
  });
}

test('embedded image actually renders after reload and PNG export is nonempty', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes('/api/qiniu-upload')) uploads.push(request.url());
  });
  await page.goto('/editor');
  await page.getByRole('button', { name: 'Image', exact: true }).click();
  await page.getByRole('tab', { name: 'Upload' }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /Upload image/ }).click();
  await (await chooser).setFiles({ name: 'red.png', mimeType: 'image/png', buffer: redPng });

  // Verify actual pixels rather than only the serialized data URL.
  await expect.poll(() => redPixelsOnCanvas(page), { timeout: 15000 }).toBeGreaterThan(100);
  await expect.poll(() => page.evaluate(() => {
    const raw = localStorage.getItem('xhs_cover_versions');
    if (!raw) return false;
    const versions = JSON.parse(raw).versions;
    return versions.some((v: { data?: string }) => v.data && JSON.parse(v.data).objects.some(
      (o: { type?: string; src?: string }) => o.type?.toLowerCase() === 'image' && o.src?.startsWith('data:image/png;base64,')
    ));
  }), { timeout: 15000 }).toBe(true);

  await page.reload();
  await expect.poll(() => redPixelsOnCanvas(page), { timeout: 15000 }).toBeGreaterThan(100);
  expect(uploads).toEqual([]);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.png$/i);
  const bytes = await readFile(await download.path());
  expect(bytes.length).toBeGreaterThan(1000);
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
});
