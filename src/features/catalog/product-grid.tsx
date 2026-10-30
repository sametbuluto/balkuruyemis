import { StaticImage } from '@/components/ui/static-image';
import { MediaPlaceholder } from '@/components/ui/media-placeholder';
import type { Product } from '@/types/content';

export function ProductGrid({ products }: { products: readonly Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const image = product.images[0];
        return (
          <article key={product.id} className="min-w-0 border border-line">
            {image ? (
              <StaticImage
                asset={image}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            ) : (
              <MediaPlaceholder label="Ürün fotoğrafı eklenecek." />
            )}
            <div className="p-6">
              <h3 className="font-display text-2xl">{product.name}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{product.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
