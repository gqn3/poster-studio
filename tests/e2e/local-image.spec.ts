import { test, expect } from '@playwright/test';

test('local image stays on device and survives reload', async ({ page }) => {
  const uploads: string[] = [];
  page.on('request', request => { if (request.method() === 'POST' && request.url().includes('/api/qiniu-upload')) uploads.push(request.url()); });
  await page.goto('/editor');
  await page.getByRole('button', { name: 'Image', exact: true }).click();
  await page.getByRole('tab', { name: 'Upload' }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: /Upload image/ }).click();
  await (await chooser).setFiles({ name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII=', 'base64') });
  await expect.poll(() => page.evaluate(() => {
    const saved = localStorage.getItem('xhs_cover_versions');
    return saved ? JSON.parse(JSON.parse(saved).versions[0].data || '{"objects":[]}').objects.filter((o: { type: string }) => o.type.toLowerCase() === 'image').length : 0;
  }), { timeout: 15000 }).toBe(1);
  expect(uploads).toEqual([]);
  await page.reload();
  await expect.poll(() => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('xhs_cover_versions') || '{}');
    return JSON.parse(saved.versions[0].data).objects[0].src;
  })).toMatch(/^data:image\/png;base64,/);
});
