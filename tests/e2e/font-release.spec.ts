import { test, expect } from '@playwright/test';
test('editor font choices do not fetch fonts with unverified redistribution rights', async ({ page }) => {
  const fontRequests: string[] = [];
  page.on('request', request => { if (request.url().includes('/api/fonts?') || request.url().includes('fontsapi.zeoseven.com')) fontRequests.push(request.url()); });
  await page.goto('/editor');
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(page.getByText('汇文明朝体')).toHaveCount(0);
  expect(fontRequests).toEqual([]);
});
