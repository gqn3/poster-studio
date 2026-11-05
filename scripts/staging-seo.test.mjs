import { test } from 'node:test';
import assert from 'node:assert/strict';
test('unfinished build asks search engines not to index it', async () => {
  const response = await fetch(process.env.TEST_ORIGIN || 'http://127.0.0.1:13330');
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex, nofollow"\s*\/?\s*>/i);
});
