import { test, expect } from '@playwright/test';
test('public editor exposes canonical and a crawlable sitemap while private routes are excluded', async ({ request }) => {
 const origin='http://127.0.0.1:13331';
 const page=await request.get('/'); const html=await page.text();
 expect(html).toContain('rel="canonical"'); expect(html).not.toMatch(/name="robots" content="noindex/);
 const robots=await (await request.get('/robots.txt')).text(); expect(robots).toContain('Sitemap:'); expect(robots).toContain('/api/');
 const sitemap=await (await request.get('/sitemap.xml')).text(); expect(sitemap).toContain('<urlset'); expect(sitemap).toContain('<loc>');
});
