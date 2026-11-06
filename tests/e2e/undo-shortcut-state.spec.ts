import { test, expect } from '@playwright/test';

test('keyboard undo and redo keep the toolbar state synchronized', async ({ page }) => {
  await page.goto('/');
  const undo = page.getByRole('button', { name: 'Undo', exact: true });
  const redo = page.getByRole('button', { name: 'Redo', exact: true });
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(undo).toBeEnabled({ timeout: 10000 });
  await page.keyboard.press('ControlOrMeta+z');
  await expect(redo).toBeEnabled();
  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(undo).toBeEnabled();
  await expect(redo).toBeDisabled();
});

test('focused input retains its native undo rather than undoing the canvas', async ({ page }) => {
  await page.goto('/');
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
