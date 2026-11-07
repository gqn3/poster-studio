import { test, expect } from '@playwright/test';

test('a template remains editable and undoable after being applied', async ({ page }) => {
  await page.goto('/editor');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Templates', exact: true }).click();
  await page.getByRole('img', { name: 'Quote card · 720×960' }).click();
  await page.getByRole('button', { name: 'Use template' }).click();
  await expect(page.getByRole('button', { name: 'Templates', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /720×960/ })).toBeVisible();
  const undo = page.getByRole('button', { name: 'Undo', exact: true });
  await expect(undo).toBeDisabled();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeEnabled();
});

test('applying a template then switching canvases preserves the template in the original canvas', async ({ page }) => {
  await page.goto('/editor');
  await expect(page.locator('canvas.upper-canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Templates', exact: true }).click();
  await page.getByRole('img', { name: 'Quote card · 720×960' }).click();
  await page.getByRole('button', { name: 'Use template' }).click();
  await expect(page.getByRole('button', { name: /Canvas 1|画布 1/ })).toBeVisible();
  await page.getByRole('button', { name: /Canvas 1|画布 1/ }).click();
  await page.getByRole('menuitem', { name: 'New canvas' }).click();
  await expect.poll(async () => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('xhs_cover_versions') || '{}');
    return saved.versions?.[0]?.data ? JSON.parse(saved.versions[0].data).objects.length : 0;
  }), { timeout: 3000 }).toBeGreaterThan(0);
  await page.waitForTimeout(600);
  const sourceObjects = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('xhs_cover_versions') || '{}');
    return JSON.parse(saved.versions[0].data).objects.length;
  });
  expect(sourceObjects).toBeGreaterThan(0);
});

