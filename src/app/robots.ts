import type { MetadataRoute } from 'next';
import { siteUrl, seo } from '@/config/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (!siteUrl || !seo.indexable) return { rules: { userAgent: '*', disallow: '/' } };

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  };
}
