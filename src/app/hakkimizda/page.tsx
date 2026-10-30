import { site } from '@/content/site';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { SectionHeading } from '@/components/ui/section-heading';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { BrandMark } from '@/components/brand/brand-mark';
import { getPublishedCategories } from '@/features/catalog/data';
import { GallerySection } from '@/features/home/gallery-section';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata(
  'Hakkımızda',
  `Lezzetin Doğal Adresi Bal Kuruyemiş ile tanışın. İzmir Buca’da ${site.branchCountText} fiziksel şube ve başlangıç kategorilerimiz.`,
  '/hakkimizda',
);

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Hakkımızda"
        title="Buca’dan, sizin için."
        description={`Bal Kuruyemiş, İzmir’in Buca ilçesinde ${site.branchCountText} fiziksel şubesiyle hizmet veren bir perakende markasıdır.`}
      />
      <section className="section-space" aria-labelledby="about-story-heading">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex min-h-80 flex-col items-center justify-center gap-8 border-b-8 border-brand-red bg-ink p-8 text-white sm:min-h-96">
            <BrandMark large inverse />
            <p className="eyebrow text-brand-gold">Lezzetin Doğal Adresi</p>
          </div>
          <div>
            <p className="eyebrow text-brand-red">Bal Kuruyemiş</p>
            <h2 id="about-story-heading" className="display-heading mt-5">
              Günün küçük molalarına, <br />
              paylaşılan anlara.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Bir sohbetin yanında, bir fincan kahveyle ya da bir ikram sofrasında. Bal
              Kuruyemiş’in ürün dünyası, farklı buluşmalara eşlik eden kategorileri bir
              araya getiriyor.
            </p>
            <p className="mt-5 text-base leading-8 text-muted">
              İzmir Buca’daki {site.branchCountText} fiziksel şubemizde sizinle
              buluşuyoruz. Mağazalarımızı ve ürün kategorilerimizi keşfederek bizi daha
              yakından tanıyabilirsiniz.
            </p>
            <Link href="/subelerimiz" className="text-link mt-7">
              Şubelerimizi keşfedin <ArrowIcon />
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
            eyebrow="Ürün dünyamız"
            title="Farklı kategoriler. Tek bir adres."
            action={{ href: '/urunlerimiz', label: 'Kategorileri keşfedin' }}
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
