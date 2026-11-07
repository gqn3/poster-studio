import { test, expect } from '@playwright/test';
for (const theme of ['light', 'dark']) {
  test(`context menu has readable text in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((t) => { localStorage.setItem('tapndo-theme', t); localStorage.setItem('tapndo-locale', 'ar'); }, theme);
    await page.goto('/editor');
    await page.getByRole('button', { name: 'نص', exact: true }).click();
    const canvas = page.locator('canvas.upper-canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas missing');
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' });
    const action = page.getByRole('button', { name: /تنزيل الصورة/ });
    await expect(action).toBeVisible();
    const colors = await action.evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el.parentElement!).backgroundColor }));
    function luminance(rgb: string) {
      const values = rgb.match(/\d+/g)!.slice(0, 3).map(Number).map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    }
    const a = luminance(colors.color), b = luminance(colors.background);
    expect((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05)).toBeGreaterThanOrEqual(4.5);
  });
}
