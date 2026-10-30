import { createElement } from 'react';
import { ImageResponse } from 'next/og';
import { BrandIconArtwork } from '@/components/brand/image-artwork';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(createElement(BrandIconArtwork, { size: 180 }), {
    width: 180,
    height: 180,
  });
}
