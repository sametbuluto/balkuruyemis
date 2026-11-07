import { getPageCopy } from '@/content/page-copy';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { BrandMark } from '@/components/brand/brand-mark';
import { getPublishedCategories } from '@/features/catalog/data';
import { GallerySection } from '@/features/home/gallery-section';
import { createPageMetadata } from '@/lib/metadata';

const copy = getPageCopy('about');
export const metadata = createPageMetadata(
  copy.seo.title,
  copy.seo.description,
  '/hakkimizda',
);

export default function AboutPage() {
  return (
    <>
      <PageIntro {...copy.intro} />
      <section className="section-space" aria-labelledby="about-story-heading">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex min-h-80 flex-col items-center justify-center gap-8 border-b-8 border-brand-red bg-ink p-8 text-white sm:min-h-96">
            <BrandMark large inverse />
            <p className="eyebrow text-brand-gold">{copy.story.signature}</p>
          </div>
          <div>
            <p className="eyebrow text-brand-red">{copy.story.eyebrow}</p>
            <h2 id="about-story-heading" className="display-heading mt-5">
              {copy.story.titleLead} <br />
              {copy.story.titleTail}
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              {copy.story.description}
            </p>
            <p className="mt-5 text-base leading-8 text-muted">
              {copy.story.continuation}
            </p>
            <Link href="/subelerimiz" className="text-link mt-7">
              {copy.story.action} <ArrowIcon />
            </Link>
          </div>
        </Container>
      </section>
      <section
        className="section-space border-y border-line bg-surface"
        aria-labelledby="about-world-heading"
      >
        <Container>
          <SectionHeading
            id="about-world-heading"
            eyebrow={copy.categories.eyebrow}
            title={copy.categories.title}
            action={{ href: '/urunlerimiz', label: copy.categories.action }}
          />
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {getPublishedCategories().map((category) => (
              <li key={category.id} className="border-t border-line">
                <Link
                  href={`/urunlerimiz?kategori=${category.slug}`}
                  className="flex min-h-20 items-center justify-between gap-4 py-5 font-display text-2xl transition-colors hover:text-brand-red"
                >
                  {category.name}
                  <ArrowIcon />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <GallerySection />
    </>
  );
}
