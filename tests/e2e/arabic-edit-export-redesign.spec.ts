import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
test('Arabic text can be edited, restored and exported',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('tapndo-locale','ar'));await page.goto('/editor');
 await page.getByRole('button',{name:'نص',exact:true}).click();
 const canvas=page.locator('canvas.upper-canvas'); const box=await canvas.boundingBox(); if(!box)throw Error('No canvas');
 await page.mouse.dblclick(box.x+box.width/2,box.y+box.height/2);await page.keyboard.press('Control+A');await page.keyboard.insertText('مرحبا بالعالم');await page.keyboard.press('Escape');
 await expect.poll(()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('xhs_cover_versions')||'{}');return x.versions?.[0]?.data?JSON.parse(x.versions[0].data).objects[0]?.text:''})).toBe('مرحبا بالعالم');
 await page.reload(); await expect.poll(()=>page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('xhs_cover_versions')||'{}');return JSON.parse(x.versions[0].data).objects[0].text})).toBe('مرحبا بالعالم');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'تنزيل',exact:true}).click();const bytes=await readFile(await (await download).path());expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');expect(bytes.length).toBeGreaterThan(1000);
});
