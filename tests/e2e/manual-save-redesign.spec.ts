import {test,expect} from '@playwright/test';
test('save action persists the current design in this browser',async({page})=>{
 await page.goto('/editor');await page.getByRole('button',{name:'Text',exact:true}).click();await page.getByRole('button',{name:'Save design',exact:true}).click();
 await expect(page.getByText('Design saved in this browser')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(JSON.parse(localStorage.getItem('xhs_cover_versions')!).versions[0].data).objects.length);expect(saved).toBeGreaterThan(0);
});
