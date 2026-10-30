import { ImageResponse } from 'next/og';
import { BrandIconArtwork } from '@/components/brand/image-artwork';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<BrandIconArtwork size={size.width} />, size);
}
