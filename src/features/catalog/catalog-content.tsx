import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ContentNotice } from '@/components/ui/content-notice';
import { LineIcon } from '@/components/ui/line-icon';
import { CategoryGrid } from '@/features/catalog/category-grid';
import { ProductGrid } from '@/features/catalog/product-grid';
import type { Product, ProductCategory } from '@/types/content';

export interface CatalogContentProps {
  categories: readonly ProductCategory[];
  products: readonly Product[];
  branchCountText: string;
  selected?: ProductCategory;
  invalid?: boolean;
}

export function CatalogContent({
  categories,
  products,
  branchCountText,
  selected,
  invalid = false,
}: CatalogContentProps) {
  const visibleProducts = products.filter(
    (product) => !selected || product.categoryId === selected.id,
  );
  return (
    <section className="section-space" aria-labelledby="catalog-heading">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 id="catalog-heading" className="font-display text-3xl">
            Ürün kategorileri
          </h2>
          <p className="text-xs leading-6 text-muted">
            Gerçek ürün bilgileri ve fotoğraflar yakında.
          </p>
        </div>
        <nav
          aria-label="Ürün kategorileri"
          className="mb-10 flex flex-wrap gap-2 border-b border-line pb-7"
        >
          <Link
            href="/urunlerimiz"
            scroll={false}
            aria-current={!selected ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center border px-4 py-2 text-sm transition-colors ${!selected ? 'border-brand-dark bg-brand-dark text-white' : 'border-line hover:border-brand-dark'}`}
          >
            Tüm kategoriler
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/urunlerimiz?kategori=${category.slug}`}
              scroll={false}
              aria-current={selected?.id === category.id ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center border px-4 py-2 text-sm transition-colors ${selected?.id === category.id ? 'border-brand-dark bg-brand-dark text-white' : 'border-line hover:border-brand-dark'}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
        {invalid ? (
          <p
            role="status"
            className="mb-8 border-l-2 border-brand-gold bg-surface px-5 py-4 text-sm leading-7"
          >
            Kategori bulunamadı. Tüm kategorileri görüntülüyorsunuz.
          </p>
        ) : null}
        {selected ? (
          <div className="mb-10 grid gap-6 border border-line bg-surface p-7 sm:p-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow text-brand-red">Seçili kategori</p>
              <h2 className="mt-4 font-display text-4xl">{selected.name}</h2>
            </div>
            <p className="self-center text-base leading-8 text-muted">
              {selected.description}
            </p>
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
        {visibleProducts.length > 0 ? (
          <div className="mt-12">
            <ProductGrid products={visibleProducts} />
          </div>
        ) : (
          <div className="mt-12">
            <ContentNotice
              title={
                selected
                  ? `${selected.name} ürünleri hazırlanıyor.`
                  : 'Ürünlerle yakında tanışın.'
              }
            >
              <p>
                Ürün açıklamaları ve gerçek ürün fotoğrafları tamamlandığında bu alanda
                yer alacak.
              </p>
            </ContentNotice>
          </div>
        )}
        <p className="mt-7 flex items-start gap-3 text-xs leading-6 text-muted">
          <LineIcon name="location" className="h-5 w-5 shrink-0 text-brand-red" />
          Bal Kuruyemiş ile İzmir Buca’daki {branchCountText} şubemizde buluşabilirsiniz.
        </p>
      </Container>
    </section>
  );
}
