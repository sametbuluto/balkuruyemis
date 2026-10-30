import { createElement } from 'react';
import { ImageResponse } from 'next/og';
import { BrandShareArtwork } from '@/components/brand/image-artwork';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(createElement(BrandShareArtwork), {
    width: 1200,
    height: 630,
  });
}
