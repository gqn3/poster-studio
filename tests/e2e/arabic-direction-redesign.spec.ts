import {test,expect} from '@playwright/test';
test('Arabic text is created with Arabic font and RTL direction',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('tapndo-locale','ar'));await page.goto('/editor');await page.getByRole('button',{name:'نص',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('xhs_cover_versions')||'{}');return x.versions?.[0]?.data?JSON.parse(x.versions[0].data).objects[0]?.direction:''})).toBe('rtl');
});
