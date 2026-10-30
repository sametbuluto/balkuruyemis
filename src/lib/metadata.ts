import type { Metadata } from 'next';
import { site, siteUrl } from '@/config/site';

export function createPageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  const url = siteUrl ? new URL(pathname, siteUrl).href : undefined;
  const shareImage = siteUrl ? new URL('/opengraph-image', siteUrl).href : undefined;

  return {
    title: { absolute: `${title} | ${site.name}` },
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      siteName: site.name,
      locale: 'tr_TR',
      type: 'website',
      ...(url ? { url } : {}),
      ...(shareImage
        ? {
            images: [
              {
                url: shareImage,
                width: 1200,
                height: 630,
                alt: `${site.name} — ${site.slogan}`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: shareImage ? 'summary_large_image' : 'summary',
      title: `${title} | ${site.name}`,
      description,
      ...(shareImage ? { images: [shareImage] } : {}),
    },
  };
}
