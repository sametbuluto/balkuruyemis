import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/features/home/hero';
import { getPageCopy } from '@/content/page-copy';

describe('Hero', () => {
  it('yayınlanmış başlığı ve katalog ile şubelere giden ana bağlantıları sunar', () => {
    const copy = getPageCopy('home').hero;
    render(<Hero />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: `${copy.titleLead} ${copy.titleAccent}`,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: copy.catalogAction })).toHaveAttribute(
      'href',
      '/urunlerimiz',
    );
    expect(screen.getByRole('link', { name: copy.branchesAction })).toHaveAttribute(
      'href',
      '/subelerimiz',
    );
  });
});
