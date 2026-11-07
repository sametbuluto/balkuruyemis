import { getPageCopy } from '@/content/page-copy';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ArrowIcon } from '@/components/ui/arrow-icon';

export function BrandStory() {
  const copy = getPageCopy('home').story;
  return (
    <section
      className="section-space bg-brand-red text-white"
      aria-labelledby="brand-story-heading"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <p className="eyebrow text-white">{copy.eyebrow}</p>
          <h2
            id="brand-story-heading"
            className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-[-0.045em] text-balance sm:text-4xl lg:text-5xl"
          >
            {copy.titleLead} <br />
            {copy.titleTail}
          </h2>
        </div>
        <div className="border-t border-white/30 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
          <p className="text-lg leading-9 text-white">{copy.description}</p>
          <p className="mt-5 text-xl font-semibold text-white">{copy.signature}</p>
          <Link
            href="/hakkimizda"
            className="mt-7 inline-flex min-h-12 items-center gap-4 border border-white px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand-red"
          >
            {copy.action} <ArrowIcon />
          </Link>
        </div>
      </Container>
    </section>
  );
}
