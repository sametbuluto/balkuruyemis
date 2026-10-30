import type { MetadataRoute } from 'next';
import { navigation, siteUrl } from '@/config/site';
import { getPublishedBranches } from '@/features/branches/data';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  return [
    ...navigation.map(({ href }) => ({ url: new URL(href, siteUrl).href })),
    ...getPublishedBranches().map((branch) => ({
      url: new URL(`/subelerimiz/${branch.slug}`, siteUrl).href,
    })),
  ];
}
