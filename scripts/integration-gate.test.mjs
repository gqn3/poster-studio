import { test } from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN || 'http://127.0.0.1:13330';
test('unreviewed outbound integrations are unavailable on public deployment', async () => {
 for (const [path,method] of [['/api/ai-models','POST'],['/api/ai-image/jobs','POST'],['/api/image-to-image/jobs','POST'],['/api/unsplash','GET'],['/api/qiniu-upload','POST'],['/api/remove-bg','POST'],['/api/save-thumbnail','POST'],['/api/share/create','POST'],['/api/templates/public/create','POST'],['/api/materials/public/create','POST']]) {
   const res=await fetch(new URL(path,origin), {method,headers:{'content-type':'application/json'},...(method==='POST'?{body:'{}'}:{})});
   assert.equal(res.status,503,path);
 }
});


