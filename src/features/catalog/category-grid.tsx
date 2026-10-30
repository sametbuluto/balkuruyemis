import { StaticImage } from '@/components/ui/static-image';
import Link from 'next/link';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { LineIcon, type LineIconName } from '@/components/ui/line-icon';
import type { ProductCategory } from '@/types/content';

const categoryIcons: Record<string, LineIconName> = {
  kuruyemis: 'kuruyemis',
  kahve: 'kahve',
  lokum: 'lokum',
  baharat: 'baharat',
  aktar: 'aktar',
  kozmetik: 'kozmetik',
};

export function CategoryGrid({ categories }: { categories: readonly ProductCategory[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <article key={category.id} className="group min-w-0">
          <Link
            href={`/urunlerimiz?kategori=${category.slug}`}
            className="block h-full border border-line bg-white transition-colors hover:border-brand-red focus-visible:border-brand-red"
          >
            <div className="relative flex aspect-[1.6] items-center justify-center overflow-hidden bg-surface">
              {category.image ? (
                <StaticImage
                  asset={category.image}
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 h-1 w-16 bg-brand-red transition-colors group-hover:bg-ink"
                  />
                  <LineIcon
                    name={categoryIcons[category.slug] ?? 'kuruyemis'}
                    className="h-20 w-20 text-brand-red"
                  />
                </>
              )}
              <span
                aria-hidden="true"
                className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold text-ink"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {category.name}
                </h3>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-red text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white">
                  <ArrowIcon />
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{category.description}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
