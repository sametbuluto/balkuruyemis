'use client';

import { useSearchParams } from 'next/navigation';
import { CatalogContent, type CatalogContentProps } from './catalog-content';
import { resolveCategorySelection } from './catalog-selection';

export function CatalogBrowser(props: CatalogContentProps) {
  const search = useSearchParams();
  const { selected, invalid } = resolveCategorySelection(
    search.toString(),
    props.categories,
  );
  return <CatalogContent {...props} selected={selected} invalid={invalid} />;
}
