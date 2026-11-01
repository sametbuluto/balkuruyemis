'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState, type ReactNode } from 'react';
import { Container } from '@/components/ui/container';

interface HeaderNavigationProps {
  navigation: readonly { href: string; label: string }[];
  brand: ReactNode;
}

export function HeaderNavigation(props: HeaderNavigationProps) {
  const pathname = usePathname();
  return <HeaderContent key={pathname} pathname={pathname} {...props} />;
}

function HeaderContent({
  pathname,
  navigation,
  brand,
}: HeaderNavigationProps & { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  function isActive(href: string) {
    return href === '/'
      ? pathname === '/'
      : pathname.startsWith(`${href}/`) || pathname === href;
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header
      className="sticky top-0 z-40 border-t-4 border-b border-t-brand-red border-b-line bg-white"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}
    >
      <Container className="flex min-h-24 items-center justify-between gap-3 sm:gap-5">
        {brand}
        <nav
          aria-label="Ana navigasyon"
          className="hidden items-center justify-end gap-8 lg:flex"
        >
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`border-b-2 py-3 text-sm font-semibold transition-colors hover:border-brand-red hover:text-brand-red ${isActive(href) ? 'border-brand-red text-brand-red' : 'border-transparent text-ink'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          ref={menuButton}
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border border-line px-3 text-sm lg:hidden"
        >
          <span>{isOpen ? 'Kapat' : 'Menü'}</span>
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
            <path
              d={isOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'}
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </Container>
      <nav
        id="mobile-navigation"
        aria-label="Mobil navigasyon"
        hidden={!isOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-6.25rem)] overflow-y-auto border-y border-line bg-white shadow-sm lg:hidden"
      >
        <Container className="flex flex-col py-3">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`min-h-12 px-2 py-3 text-base ${isActive(href) ? 'font-semibold text-brand-red' : 'text-ink'}`}
            >
              {label}
            </Link>
          ))}
        </Container>
      </nav>
    </header>
  );
}
