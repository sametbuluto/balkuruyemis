import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '@/features/home/hero';

describe('Hero', () => {
  it('marka sloganını ve katalog ile şubelere giden ana bağlantıları sunar', () => {
    render(<Hero />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Lezzetin Doğal Adresi.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ürünlerimizi keşfedin' })).toHaveAttribute(
      'href',
      '/urunlerimiz',
    );
    expect(screen.getByRole('link', { name: 'Şubelerimiz' })).toHaveAttribute(
      'href',
      '/subelerimiz',
    );
  });
});
