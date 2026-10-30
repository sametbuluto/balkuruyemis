import Link from 'next/link';
import { ArrowIcon } from '@/components/ui/arrow-icon';

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  inverse?: boolean;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 lg:flex-row lg:items-end">
      <div className="max-w-2xl">
        <p className={`eyebrow ${inverse ? 'text-brand-gold' : 'text-brand-red'}`}>
          {eyebrow}
        </p>
        <h2 id={id} className="display-heading mt-4 text-balance">
          {title}
        </h2>
        {description ? (
          <p
            className={`mt-5 max-w-xl text-base leading-8 ${inverse ? 'text-white/70' : 'text-muted'}`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className={`text-link shrink-0 self-start lg:self-auto ${inverse ? 'text-white decoration-white/30 hover:text-white/80' : ''}`}
        >
          {action.label}
          <ArrowIcon />
        </Link>
      ) : null}
    </div>
  );
}
