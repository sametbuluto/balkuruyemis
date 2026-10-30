import Link from 'next/link';
import { ArrowIcon } from '@/components/ui/arrow-icon';

interface ContentNoticeProps {
  title: string;
  children: React.ReactNode;
  link?: { href: string; label: string };
}

export function ContentNotice({ title, children, link }: ContentNoticeProps) {
  return (
    <div className="border border-line bg-white p-7 sm:p-10">
      <span aria-hidden="true" className="mb-6 block h-px w-10 bg-brand-gold" />
      <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-4 max-w-2xl text-base leading-8 text-muted">{children}</div>
      {link ? (
        <Link href={link.href} className="text-link mt-6">
          {link.label} <ArrowIcon />
        </Link>
      ) : null}
    </div>
  );
}
