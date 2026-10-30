import Image from 'next/image';
import { MediaPlaceholder } from '@/components/ui/media-placeholder';
import type { MediaAsset } from '@/types/content';

export function PhotoGallery({
  images,
  label = 'Mağazalarımızdan fotoğraflar',
}: {
  images: readonly MediaAsset[];
  label?: string;
}) {
  if (images.length === 0) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="group"
        aria-label={label}
      >
        <MediaPlaceholder
          label="Mağazalarımızdan gerçek fotoğraflar eklenecek."
          className="min-h-72 sm:col-span-2 lg:row-span-2 lg:min-h-96"
        />
        <MediaPlaceholder label="Şubelerimizden kareler yakında." className="min-h-48" />
        <MediaPlaceholder
          label="Galerimiz gerçek görsellerle tamamlanacak."
          className="min-h-48"
        />
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="group"
      aria-label={label}
    >
      {images.map((image) => (
        <figure key={image.id} className="overflow-hidden border border-line bg-surface">
          <Image
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1280px) 370px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="aspect-[4/3] h-auto w-full object-cover"
          />
          <figcaption className="px-5 py-4 text-sm leading-6 text-muted">
            {image.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
