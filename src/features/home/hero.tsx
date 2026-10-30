import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { HeroVisual } from '@/features/home/hero-visual';

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-line bg-white">
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14 lg:py-18">
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-3 text-brand-red">
            <span aria-hidden="true" className="h-1 w-8 bg-brand-red" />
            Buca’dan, sizin için
          </p>
          <h1 className="mt-7 font-display text-[clamp(2.75rem,6.7vw,5.9rem)] leading-[1.02] font-bold tracking-[-0.065em]">
            Lezzetin <br />
            <span className="text-brand-red">Doğal Adresi.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-muted sm:text-lg">
            Günlük molalara, paylaşılan sofralara. <br />
            Bal Kuruyemiş ile tanışın; İzmir Buca’daki dört şubemizde buluşalım.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/urunlerimiz" className="button-primary">
              Ürünlerimizi keşfedin <ArrowIcon />
            </Link>
            <Link href="/subelerimiz" className="button-secondary">
              Şubelerimiz <ArrowIcon />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
            <span className="font-display text-4xl font-bold tracking-tight text-brand-red">
              04
            </span>
            <p className="text-xs leading-5 text-muted">
              Aynı marka, dört buluşma noktası. <br />
              <span className="font-semibold text-ink">Buca, İzmir</span>
            </p>
          </div>
        </div>
        <HeroVisual />
      </Container>
    </section>
  );
}
