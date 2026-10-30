import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/layout/footer';

describe('Footer', () => {
  it('temel sayfalara erişim sağlar; doğrulanmamış sosyal veya iletişim bağlantısı yayımlamaz', () => {
    render(<Footer />);
    const navigation = screen.getByRole('navigation', { name: 'Alt menü' });

    expect(within(navigation).getByRole('link', { name: 'İletişim' })).toHaveAttribute(
      'href',
      '/iletisim',
    );
    expect(within(navigation).getAllByRole('link')).toHaveLength(5);

    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')).toMatch(/^\//);
    }
    expect(screen.getByText('Buca’da dört şube.')).toBeInTheDocument();
  });
});
