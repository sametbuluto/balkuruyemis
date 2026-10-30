import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BranchCard } from '@/features/branches/branch-card';
import { BranchGrid } from '@/features/branches/branch-grid';
import { exampleBranches, getPublishedBranch } from '@/features/branches/data';
import type { Branch } from '@/types/content';

const verifiedFixture: Branch = {
  id: 'test-branch',
  slug: 'test-sube',
  name: 'Test şubesi',
  description: 'Yalnızca test verisi.',
  address: null,
  phone: null,
  openingHours: null,
  googleMapsUrl: null,
  whatsappUrl: null,
  images: [],
  sortOrder: 1,
  status: 'published',
  contentKind: 'verified',
};

describe('Şube kartları', () => {
  it('dört örneği açıkça etiketler ve gerçek şube bağlantısı yayımlamaz', () => {
    render(<BranchGrid entries={exampleBranches} />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getAllByText('Örnek içerik')).toHaveLength(4);
    expect(screen.getAllByText('Adres bilgisi hazırlanıyor.')).toHaveLength(4);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    for (const example of exampleBranches)
      expect(getPublishedBranch(example.slug)).toBeUndefined();
  });

  it('örnek kayıt yanlışlıkla published olsa bile gerçek şubeye bağlantı vermez', () => {
    render(<BranchCard branch={{ ...verifiedFixture, contentKind: 'example' }} />);
    expect(screen.getByText('Örnek içerik')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('doğrulanmış şubeyi detay rotasına bağlar, boş iletişim alanlarına link üretmez', () => {
    render(<BranchCard branch={verifiedFixture} />);
    expect(screen.getByRole('link', { name: 'Şubeyi keşfedin' })).toHaveAttribute(
      'href',
      '/subelerimiz/test-sube',
    );
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.queryByText('Örnek içerik')).not.toBeInTheDocument();
  });
});
