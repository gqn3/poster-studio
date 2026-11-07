import { test, expect } from '@playwright/test';
test('image filters are understandable in Arabic', async ({ page }) => {
 await page.addInitScript(() => localStorage.setItem('tapndo-locale','ar'));
 await page.goto('/'); await page.getByRole('button', {name:'صورة',exact:true}).click();
 const chooser=page.waitForEvent('filechooser'); await page.getByRole('button',{name:/رفع صورة/}).last().click();
 await (await chooser).setFiles({name:'sample.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII=','base64')});
 await page.getByRole('tab',{name:'مرشحات'}).click();
 await expect(page.getByText('تدرج رمادي',{exact:true})).toBeVisible();
});
