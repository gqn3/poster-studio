import { test, expect } from '@playwright/test';

test('touch pointer pans canvas when pan mode is active', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();

  const container = page.locator('#canvas-container');
  await expect(container).toBeVisible();

  // Pan mode is controlled by the topbar hand tool.
  const panButton = page.getByRole('button', { name: /pan canvas|تحريك اللوحة|进入拖拽模式/i });
  await expect(panButton).toBeVisible();
  await panButton.click();

  await expect(container).toHaveCSS('touch-action', 'none');
  const wrapper = container.locator('canvas.lower-canvas').locator('xpath=../../..');
  const before = await wrapper.evaluate(el => getComputedStyle(el).transform);

  const bounds = await container.boundingBox();
  expect(bounds).not.toBeNull();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;

  // CDP generates real touch input, so pointer capture behaves as it does on a device.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 17 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 35, y: y + 22, id: 17 }] });
  await expect.poll(() => wrapper.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
});
