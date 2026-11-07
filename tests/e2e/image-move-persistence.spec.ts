import { test, expect, type Page } from '@playwright/test';

// Assert actual canvas pixels: serialized image URLs alone do not prove rendering.
async function expectRedImage(page: Page, left: number, top: number) {
  await expect.poll(() => page.locator('canvas.lower-canvas').evaluate((canvas: HTMLCanvasElement, position) => {
    const { width, height } = canvas;
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, width, height).data;
    let minX = width, minY = height, maxX = -1, maxY = -1, count = 0;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (pixels[i] > 240 && pixels[i + 1] < 15 && pixels[i + 2] < 15 && pixels[i + 3] > 240) {
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); count++;
      }
    }
    return Math.abs(minX / width - position.left) < 0.01
      && Math.abs(minY / height - position.top) < 0.01
      && Math.abs((maxX + 1) / width - position.left - 0.2) < 0.01
      && Math.abs((maxY + 1) / height - position.top - 0.2) < 0.01
      && Math.abs(count / (width * height) - 0.04) < 0.005;
  }, { left, top }), { message: `red image visibly renders at ${left}, ${top}`, timeout: 15000 }).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1'
    ? route.continue() : route.abort());
  // Seed once in each isolated context; reloads must restore the application's data.
  await page.addInitScript(() => {
    if (localStorage.getItem('xhs_cover_versions')) return;
    const image = document.createElement('canvas');
    image.width = image.height = 80;
    const context = image.getContext('2d')!;
    context.fillStyle = '#ff0000';
    context.fillRect(0, 0, 80, 80);
    localStorage.setItem('xhs_cover_versions', JSON.stringify({
      activeId: 'synthetic', versions: [{ id: 'synthetic', name: 'Synthetic image', createdAt: 1, updatedAt: 1,
        canvasSize: { name: 'Test square', width: 400, height: 400, ratio: '1:1' },
        data: JSON.stringify({ version: '7.4.0', background: '#ffffff', objects: [{
          type: 'Image', version: '7.4.0', originX: 'left', originY: 'top', left: 80, top: 80,
          width: 80, height: 80, scaleX: 1, scaleY: 1, src: image.toDataURL('image/png'), crossOrigin: null,
        }] }),
      }],
    }));
  });
  await page.goto('/editor');
  await expectRedImage(page, 0.2, 0.2);
});

test('saved image renders after consecutive reloads', async ({ page }) => {
  for (let reload = 0; reload < 2; reload++) {
    await page.reload();
    await expectRedImage(page, 0.2, 0.2);
  }
});

test('dragging an image autosaves and restores the rendered position', async ({ page }) => {
  await page.getByRole('button', { name: 'Select (V)', exact: true }).click();
  await page.waitForTimeout(1500); // Allow the editor panel and canvas fit animation to settle.
  const box = await page.locator('canvas.upper-canvas').boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width * 0.3, y = box!.y + box!.height * 0.3;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box!.width * 0.25, y + box!.height * 0.25, { steps: 12 });
  await page.mouse.up();
  await expectRedImage(page, 0.45, 0.45);
  await expect.poll(() => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('xhs_cover_versions') || '{}');
    const version = saved.versions.find((item: { id: string }) => item.id === saved.activeId);
    return JSON.parse(version.data).objects.map((object: { left: number; top: number; src: string }) => ({
      left: Math.round(object.left), top: Math.round(object.top), local: object.src.startsWith('data:image/png'),
    }));
  }), { timeout: 15000 }).toEqual([{ left: 180, top: 180, local: true }]);
  await page.reload();
  await expectRedImage(page, 0.45, 0.45);
});
