import {test,expect} from '@playwright/test';
for(const width of [390,1920]) test(`Arabic canvas and interaction remain visible at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===390?844:930});await page.addInitScript(()=>localStorage.setItem('tapndo-locale','ar'));await page.goto('/editor');
 await page.getByRole('button',{name:'نص',exact:true}).click();const canvas=page.locator('canvas.upper-canvas');
 await expect.poll(()=>canvas.evaluate(c=>{const r=c.getBoundingClientRect(),p=c.closest('#canvas-container')!.getBoundingClientRect();return r.left>=p.left-1&&r.right<=p.right+1&&r.width>100})).toBe(true);
 const box=await canvas.boundingBox();if(!box)throw Error('No canvas');await page.mouse.dblclick(box.x+box.width/2,box.y+box.height/2);await page.keyboard.press('Control+A');await page.keyboard.insertText('تصميم جديد');await page.keyboard.press('Escape');
 await expect.poll(()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('xhs_cover_versions')||'{}');return x.versions?.[0]?.data?JSON.parse(x.versions[0].data).objects[0]?.text:''})).toBe('تصميم جديد');
});
