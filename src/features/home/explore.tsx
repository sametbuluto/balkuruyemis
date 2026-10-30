import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { CategoryGrid } from '@/features/catalog/category-grid';
import { getPublishedCategories } from '@/features/catalog/data';

export function Explore() {
  return (
    <section className="section-space" aria-labelledby="categories-heading">
      <Container>
        <SectionHeading
          id="categories-heading"
          eyebrow="Ürün dünyamız"
          title="Her buluşmaya bir eşlikçi."
          description="Kuruyemişten kahveye, ikramlardan günlük bakıma. Başlangıç kategorilerimizi keşfedin."
          action={{ href: '/urunlerimiz', label: 'Tüm kategoriler' }}
        />
        <CategoryGrid categories={getPublishedCategories()} />
      </Container>
    </section>
  );
}
