import { test, expect } from '@playwright/test';

test('touch pointer pans canvas when pan mode is active', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const container = page.locator('#canvas-container');
  await expect(container).toBeVisible();

  // Pan mode is controlled by the topbar hand tool.
  const panButton = page.getByRole('button', { name: /pan canvas|تحريك اللوحة|进入拖拽模式/i });
  await expect(panButton).toBeVisible();
  await panButton.click();

  await expect(container).toHaveCSS('touch-action', 'none');
  const wrapper = container.locator('canvas').locator('xpath=../..');
  const before = await wrapper.evaluate(el => getComputedStyle(el).transform);

  const bounds = await container.boundingBox();
  expect(bounds).not.toBeNull();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;

  // Dispatch actual pointer events to exercise pointer capture and movement.
  await container.dispatchEvent('pointerdown', { pointerId: 17, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, button: 0 });
  await container.dispatchEvent('pointermove', { pointerId: 17, pointerType: 'touch', isPrimary: true, clientX: x + 35, clientY: y + 22, button: 0 });
  await expect.poll(() => wrapper.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  await container.dispatchEvent('pointerup', { pointerId: 17, pointerType: 'touch', isPrimary: true, clientX: x + 35, clientY: y + 22, button: 0 });
});
