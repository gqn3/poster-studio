import { test, expect } from '@playwright/test';
test('saving a template is localized and private', async ({page})=>{
 const writes:string[]=[];page.on('request',r=>{if(r.url().includes('/api/templates/public/create'))writes.push(r.url())});
 await page.goto('/editor');await page.getByRole('button',{name:'Text',exact:true}).click();
 await page.getByRole('button',{name:'Save as template'}).click();
 await page.getByLabel('Template name').fill('My card');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('canvas-templates')||'')).toContain('My card');
 expect(writes).toEqual([]);
});
