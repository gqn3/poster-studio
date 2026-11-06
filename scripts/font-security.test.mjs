import { test } from 'node:test';
import assert from 'node:assert/strict';
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:13330';
test('font endpoints reject path traversal before reading arbitrary local files', async () => {
 for (const endpoint of ['/api/fonts','/api/fonts/woff2']) {
  const url = new URL(endpoint, origin);
  url.searchParams.set('path', endpoint.endsWith('woff2') ? '@chinese-fonts/../../public/icon.woff2' : '@chinese-fonts/../../package.json');
  const response = await fetch(url);
  assert.equal(response.status,403,endpoint);
 }
});
test('existing font stylesheet remains available', async () => {
 const url=new URL('/api/fonts',origin);
 url.searchParams.set('path','@chinese-fonts/lxgwwenkai/dist/LXGWWenKai-Regular/result.css');
 assert.equal((await fetch(url)).status,200);
});
