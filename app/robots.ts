export const revalidate = 60;
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
 const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tapndo-poster-cxi5we.cranl.net';
 return { rules: process.env.TAPNDO_INDEXABLE === 'true' ? { userAgent: '*', allow: '/', disallow: ['/api/', '/share/', '/generate-thumbnails'] } : { userAgent: '*', disallow: '/' }, sitemap: `${base}/sitemap.xml` };
}
