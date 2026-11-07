import { getPageCopy } from '@/content/page-copy';
import { Suspense } from 'react';
import { PageIntro } from '@/components/ui/page-intro';
import { CatalogContent } from '@/features/catalog/catalog-content';
import { CatalogBrowser } from '@/features/catalog/catalog-browser';
import { getPublishedCategories, getPublishedProducts } from '@/content/queries';
import { createPageMetadata } from '@/lib/metadata';

const copy = getPageCopy('catalog');
export const metadata = createPageMetadata(
  copy.seo.title,
  copy.seo.description,
  '/urunlerimiz',
);

export default function ProductsPage() {
  const props = {
    categories: getPublishedCategories(),
    products: getPublishedProducts(),
    copy: copy.content,
  };
  return (
    <>
      <PageIntro {...copy.intro} />
      <Suspense fallback={<CatalogContent {...props} />}>
        <CatalogBrowser {...props} />
      </Suspense>
    </>
  );
}
