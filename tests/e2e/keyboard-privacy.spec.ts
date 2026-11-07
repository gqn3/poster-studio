import { test, expect } from '@playwright/test';

test('typing into the editor does not log pressed keys', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', message => logs.push(message.text()));
  await page.goto('/');
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await page.keyboard.press('F8');
  expect(logs.filter(message => message.includes('F8'))).toEqual([]);
});

