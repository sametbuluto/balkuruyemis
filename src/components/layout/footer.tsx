import { getFooterCopy } from '@/content/page-copy';
import { site } from '@/content/site';
import Link from 'next/link';
import { navigation } from '@/config/site';
import { Brand } from '@/components/ui/brand';
import { Container } from '@/components/ui/container';
import { getPublishedCategories } from '@/features/catalog/data';

export function Footer() {
  const copy = getFooterCopy();
  return (
    <footer className="border-t-4 border-brand-dark bg-ink text-white">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] lg:gap-12 lg:py-18">
          <div>
            <Brand inverse />
            <p className="mt-5 max-w-64 text-sm leading-7 text-white/65">
              {site.slogan}.
            </p>
            <p className="mt-4 max-w-60 text-xs leading-6 text-white/55">
              {copy.description}
            </p>
          </div>
          <div>
            <p className="eyebrow text-brand-gold">Keşfedin</p>
            <nav aria-label="Alt menü" className="mt-4 flex flex-col items-start">
              {navigation.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-11 items-center text-sm text-white/75 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="eyebrow text-brand-gold">Ürün dünyamız</p>
            <nav
              aria-label="Alt menü ürün kategorileri"
              className="mt-4 flex flex-col items-start"
            >
              {getPublishedCategories().map((category) => (
                <Link
                  key={category.id}
                  href={`/urunlerimiz?kategori=${category.slug}`}
                  className="inline-flex min-h-11 items-center text-sm text-white/75 transition-colors hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="eyebrow text-brand-gold">Bizi ziyaret edin</p>
            <p className="mt-6 font-display text-2xl">{copy.visitTitle}</p>
            <Link
              href="/subelerimiz"
              className="mt-3 inline-flex min-h-11 items-center text-sm text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              {copy.visitAction}
            </Link>
            <p className="mt-7 text-xs leading-6 text-white/55">
              {copy.socialDescription}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-xs leading-6 text-white/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
          </p>
          <p>{copy.signature}</p>
        </div>
      </Container>
    </footer>
  );
}
