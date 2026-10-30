import { Suspense } from 'react';
import { PageIntro } from '@/components/ui/page-intro';
import { CatalogContent } from '@/features/catalog/catalog-content';
import { CatalogBrowser } from '@/features/catalog/catalog-browser';
import { getPublishedCategories, getPublishedProducts } from '@/content/queries';
import { site } from '@/content/site';
import { createPageMetadata } from '@/lib/metadata';

const description =
  'Bal Kuruyemiş ürün dünyası: kategori ve ürün tanıtımlarını keşfedin.';
export const metadata = createPageMetadata('Ürünlerimiz', description, '/urunlerimiz');

export default function ProductsPage() {
  const props = {
    categories: getPublishedCategories(),
    products: getPublishedProducts(),
    branchCountText: site.branchCountText,
  };
  return (
    <>
      <PageIntro
        eyebrow="Ürünlerimiz"
        title="Her buluşmaya bir eşlikçi."
        description="Kuruyemişten kahveye, lokumdan baharata. Ürün dünyamızın başlangıç kategorilerini keşfedin."
      />
      <Suspense fallback={<CatalogContent {...props} />}>
        <CatalogBrowser {...props} />
      </Suspense>
    </>
  );
}
