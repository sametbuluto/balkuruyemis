import { getPageCopy } from '@/content/page-copy';
import { site } from '@/content/site';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { HeroVisual } from '@/features/home/hero-visual';

export function Hero() {
  const copy = getPageCopy('home').hero;
  return (
    <section className="overflow-hidden border-b border-line bg-white">
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:py-18">
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-3 text-brand-red">
            <span aria-hidden="true" className="h-1 w-8 bg-brand-red" />
            {copy.eyebrow}
          </p>
          <h1 className="mt-7 font-display text-[clamp(2.75rem,6.7vw,5.9rem)] leading-[1.02] font-bold tracking-[-0.065em]">
            {copy.titleLead} <br />
            <span className="text-brand-red">{copy.titleAccent}</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-muted sm:text-lg">
            {copy.descriptionLead} <br />
            {copy.descriptionBody}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/urunlerimiz" className="button-primary">
              {copy.catalogAction} <ArrowIcon />
            </Link>
            <Link href="/subelerimiz" className="button-secondary">
              {copy.branchesAction} <ArrowIcon />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
            <span className="font-display text-4xl font-bold tracking-tight text-brand-red">
              {site.branchCountPadded}
            </span>
            <p className="text-xs leading-5 text-muted">
              {copy.countDescription} <br />
              <span className="font-semibold text-ink">{site.location}</span>
            </p>
          </div>
        </div>
        <HeroVisual />
      </Container>
    </section>
  );
}
