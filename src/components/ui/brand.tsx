import Link from 'next/link';
import { site } from '@/config/site';
import { BrandMark } from '@/components/brand/brand-mark';

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — ana sayfa`}
      className={`inline-flex shrink-0 items-center gap-2 sm:gap-3 ${inverse ? 'text-white' : 'text-ink'}`}
    >
      <BrandMark inverse={inverse} />
    </Link>
  );
}
