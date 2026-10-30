import Image from 'next/image';
import type { MediaAsset } from '@/types/content';

interface StaticImageProps {
  asset: MediaAsset;
  alt?: string;
  sizes: string;
  fill?: boolean;
  className?: string;
  loading?: 'lazy' | 'eager';
  preload?: boolean;
}

/** Hazır AVIF/WebP varyantlarını tarayıcı seçer; /_next/image veya harici servis yoktur. */
export function StaticImage({
  asset,
  alt,
  sizes,
  fill = false,
  loading = 'lazy',
  preload = false,
  className,
}: StaticImageProps) {
  const variants = asset.variants ?? [];
  const image = (
    <Image
      src={asset.url}
      alt={alt ?? asset.alt}
      {...(fill ? { fill: true } : { width: asset.width, height: asset.height })}
      sizes={sizes}
      unoptimized
      className={className}
      {...(preload && !variants.length
        ? { preload: true }
        : {
            loading: preload ? 'eager' : loading,
            fetchPriority: preload ? 'high' : undefined,
          })}
    />
  );
  if (!variants.length) return image;
  return (
    <picture>
      {(['image/avif', 'image/webp'] as const).map((format) => {
        const sources = variants
          .filter((variant) => variant.format === format)
          .sort((a, b) => a.width - b.width);
        return sources.length ? (
          <source
            key={format}
            type={format}
            srcSet={sources
              .map((variant) => `${variant.url} ${variant.width}w`)
              .join(', ')}
            sizes={sizes}
          />
        ) : null;
      })}
      {image}
    </picture>
  );
}
