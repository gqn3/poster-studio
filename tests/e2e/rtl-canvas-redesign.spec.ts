import {test,expect} from '@playwright/test';
test('Arabic mobile canvas stays inside its visible frame',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.addInitScript(()=>localStorage.setItem('tapndo-locale','ar'));await page.goto('/editor');
 await page.getByRole('button',{name:'نص',exact:true}).click();
 await expect.poll(()=>page.locator('canvas.lower-canvas').evaluate(c=>{const r=c.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})).toBe(true);
});
