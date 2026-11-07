import {test,expect} from '@playwright/test';
for(const locale of ['en','ar'] as const) test(`core screens have no Chinese text in ${locale}`,async({page})=>{
 await page.addInitScript(l=>localStorage.setItem('tapndo-locale',l),locale);await page.goto('/editor');
 const noChinese=async()=>{await expect.poll(()=>page.locator('body').innerText().then(t=>/[\u3400-\u9fff]/u.test(t))).toBe(false)};
 await noChinese(); await page.getByRole('button',{name:locale==='ar'?'صورة':'Image',exact:true}).click();await noChinese();await page.getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:locale==='ar'?'شكل':'Shape',exact:true}).click();await noChinese();await page.getByRole('button',{name:locale==='ar'?'إلغاء':'Cancel',exact:true}).click();
 await page.getByRole('button',{name:locale==='ar'?'القوالب':'Templates',exact:true}).click();await noChinese();
});
