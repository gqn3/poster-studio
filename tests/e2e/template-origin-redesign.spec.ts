import {test,expect} from '@playwright/test';
test('preset objects preserve their intended top-left origin',async({page})=>{
 await page.goto('/editor');await page.getByRole('button',{name:'Templates',exact:true}).click();await page.getByRole('img',{name:'Quote card · 720×960'}).click();await page.getByRole('button',{name:'Use template',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('xhs_cover_versions')||'{}');return x.versions?.[0]?.data?JSON.parse(x.versions[0].data).objects.map((o:{originX:string})=>o.originX):[]})).toEqual(['left','left','left','left']);
});
