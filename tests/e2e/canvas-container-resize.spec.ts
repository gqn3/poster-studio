import { test, expect } from '@playwright/test';

test('canvas zoom tracks available editor space without window resize', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/editor');
  const container = page.locator('#canvas-container');
  const wrapper = container.locator('canvas').locator('xpath=../..');
  await expect(container).toBeVisible();
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  // Wait for the initial ResizeObserver measurement and CSS transition to settle.
  const expectedInitial = await container.evaluate(el => Math.max(0.05, Math.min((el.clientWidth - 80) / 960, (el.clientHeight - 120) / 1280)) * 960);
  await expect.poll(async () => wrapper.evaluate(el => el.getBoundingClientRect().width)).toBeCloseTo(expectedInitial, 0);
  const initialWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);

  // Opening a properties drawer changes editor space on real layouts. Simulate
  // the same container-only resize without changing the browser viewport.
  await container.evaluate(el => {
    el.style.width = '360px';
    el.style.maxWidth = '360px';
    el.style.flex = 'none';
  });
  await expect.poll(async () => wrapper.evaluate(el => el.getBoundingClientRect().width), {
    timeout: 5000,
  }).toBeLessThan(initialWidth);
  const narrowedWidth = await wrapper.evaluate(el => el.getBoundingClientRect().width);
  expect(narrowedWidth).toBeGreaterThan(0);

  await container.evaluate(el => {
    el.style.width = '';
    el.style.maxWidth = '';
    el.style.flex = '';
  });
  await expect.poll(async () => wrapper.evaluate(el => el.getBoundingClientRect().width), {
    timeout: 5000,
  }).toBeGreaterThan(narrowedWidth);
});
