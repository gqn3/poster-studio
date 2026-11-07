import {test,expect} from '@playwright/test';
test('mobile editing actions are visible without horizontal scrolling',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/editor');
 for(const name of ['Download design','Open properties']){
  const button=page.getByRole('button',{name,exact:true});await expect(button).toBeVisible();const box=await button.boundingBox();expect(box && box.x>=0 && box.x+box.width<=390).toBeTruthy();
 }
});
