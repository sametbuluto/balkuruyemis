import Link from 'next/link';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="eyebrow text-brand-red">404 · Sayfa bulunamadı</p>
      <h1 className="mt-5 font-display text-4xl sm:text-5xl">
        Burada bir sayfa bulamadık.
      </h1>
      <p className="mx-auto mt-6 max-w-md leading-8 text-muted">
        Aradığınız sayfa henüz yayımlanmamış veya adresi değişmiş olabilir.
      </p>
      <Link href="/" className="button-primary mt-8">
        Ana sayfaya dön
      </Link>
    </Container>
  );
}
