import { test, expect } from '@playwright/test';
test('home introduces the studio and opens a usable editor', async ({ page }) => {
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Make something/})).toBeVisible();
 await page.getByRole('link',{name:'Start designing',exact:true}).first().click();
 await expect(page).toHaveURL(/\/editor/, { timeout: 15000 });
 await expect(page.getByRole('button',{name:'Text',exact:true})).toBeVisible();
});
test('Arabic home is RTL and opens templates', async ({page}) => {
 await page.goto('/'); await page.getByRole('button',{name:'العربية'}).click();
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await page.getByRole('link',{name:'استعرض القوالب',exact:true}).first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
});
