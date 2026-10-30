import { Container } from '@/components/ui/container';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface py-14 md:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-2 bg-brand-red sm:w-3"
      />
      <Container>
        <p className="eyebrow text-brand-red">{eyebrow}</p>
        <h1 className="relative mt-6 max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
