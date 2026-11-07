import { test, expect } from '@playwright/test';
test('Arabic preset applies localized editable text', async ({page})=>{
 await page.addInitScript(()=>localStorage.setItem('tapndo-locale','ar'));
 await page.goto('/editor'); await page.getByRole('button',{name:'القوالب',exact:true}).click();
 await page.getByRole('img',{name:'بطاقة اقتباس · 720×960'}).click();
 await page.getByRole('button',{name:'استخدام القالب',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('xhs_cover_versions')||'{}');return x.versions?.[0]?.data?JSON.parse(x.versions[0].data).objects.map((o:{text?:string})=>o.text).filter(Boolean):[]})).toContain('فكرتك تبدأ هنا');
});
