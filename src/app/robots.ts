import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  if (!siteUrl) return { rules: { userAgent: '*', disallow: '/' } };

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  };
}
