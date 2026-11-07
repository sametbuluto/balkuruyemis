import { getPageCopy } from '@/content/page-copy';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { CategoryGrid } from '@/features/catalog/category-grid';
import { getPublishedCategories } from '@/features/catalog/data';

export function Explore() {
  const copy = getPageCopy('home').categories;
  return (
    <section className="section-space" aria-labelledby="categories-heading">
      <Container>
        <SectionHeading
          id="categories-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={{ href: '/urunlerimiz', label: copy.action }}
        />
        <CategoryGrid categories={getPublishedCategories()} />
      </Container>
    </section>
  );
}
