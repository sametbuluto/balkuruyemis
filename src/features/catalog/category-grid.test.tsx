import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CategoryGrid } from '@/features/catalog/category-grid';
import { getCategoryBySlug } from '@/features/catalog/data';

describe('CategoryGrid', () => {
  it('bağlantının erişilebilir adı görünür kategori adı ve açıklamasını içerir', () => {
    const category = getCategoryBySlug('kuruyemis');
    if (!category) throw new Error('Başlangıç kategorisi bulunamadı.');
    render(<CategoryGrid categories={[category]} />);
    expect(screen.getByRole('link')).toHaveAccessibleName(
      `${category.name} ${category.description}`,
    );
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/urunlerimiz?kategori=kuruyemis',
    );
  });
});
