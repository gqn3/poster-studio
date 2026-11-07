import { test, expect } from '@playwright/test';

test('keyboard undo and redo keep the toolbar state synchronized', async ({ page }) => {
  await page.goto('/editor');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  const undo = page.getByRole('button', { name: 'Undo', exact: true });
  const redo = page.getByRole('button', { name: 'Redo', exact: true });
  const pixels = () => page.locator('canvas.lower-canvas').evaluate((canvas: HTMLCanvasElement) => { const ctx = canvas.getContext('2d')!; const image = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let count = 0; for (let i = 0; i < image.length; i += 4) if (image[i+3] > 100 && image[i] < 180 && image[i+1] < 180 && image[i+2] < 180) count++; return count; });
  const blank = await pixels();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect.poll(pixels).toBeGreaterThan(blank);
  await expect(undo).toBeEnabled({ timeout: 10000 });
  await page.keyboard.press('ControlOrMeta+z');
  await expect(redo).toBeEnabled();
  await expect.poll(pixels).toBe(blank);
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect.poll(pixels).toBeGreaterThan(blank);
  await expect(undo).toBeEnabled();
  await expect(redo).toBeDisabled();
  // An edit immediately after redo must remain in history once asynchronous loading finishes.
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page.waitForTimeout(500); // History deliberately debounces edits for 300 ms.
  await page.keyboard.press('ControlOrMeta+z');
  await expect.poll(pixels).toBeGreaterThan(blank);
  await page.keyboard.press('ControlOrMeta+z');
  await expect.poll(pixels).toBe(blank);
});

test('focused input retains its native undo rather than undoing the canvas', async ({ page }) => {
  await page.goto('/editor');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  const undo = page.getByRole('button', { name: 'Undo', exact: true });
  await expect(undo).toBeEnabled({ timeout: 10000 });
  // An isolated form input makes the focus contract independent of panel layout.
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.setAttribute('aria-label', 'Undo focus probe');
    document.body.append(input);
  });
  const input = page.getByRole('textbox', { name: 'Undo focus probe' });
  await input.focus();
  await input.fill('native undo test');
  await page.keyboard.press('ControlOrMeta+z');
  // Canvas history must not be consumed while a form field has focus.
  await expect(undo).toBeEnabled();
});

test('a new canvas cannot undo into a different canvas', async ({ page }) => {
  await page.goto('/editor');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Canvas 1' }).click();
  await page.getByRole('menuitem', { name: 'New canvas' }).click();
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled();
});
