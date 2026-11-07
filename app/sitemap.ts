export const revalidate = 60;
import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
 const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tapndo-poster-cxi5we.cranl.net';
 return process.env.TAPNDO_INDEXABLE === 'true' ? [{ url: `${base}/` }] : [];
}
