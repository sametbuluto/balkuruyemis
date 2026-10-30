import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhotoGallery } from '@/components/gallery/photo-gallery';

describe('PhotoGallery', () => {
  it('veri yokken sahte fotoğraf üretmez, gerçek fotoğraf beklendiğini belirtir', () => {
    render(<PhotoGallery images={[]} />);
    expect(
      screen.getByRole('group', { name: 'Mağazalarımızdan fotoğraflar' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(
      screen.getByText('Mağazalarımızdan gerçek fotoğraflar eklenecek.'),
    ).toBeInTheDocument();
  });

  it('sağlanan görseli alternatif metin, responsive boyut ve lazy loading ile sunar', () => {
    render(
      <PhotoGallery
        images={[
          {
            id: 'test-photo',
            url: '/test-photo.jpg',
            alt: 'Test fotoğrafı',
            width: 1200,
            height: 900,
          },
        ]}
      />,
    );
    const image = screen.getByRole('img', { name: 'Test fotoğrafı' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('width', '1200');
    expect(image).toHaveAttribute('sizes');
    expect(
      screen.queryByText('Mağazalarımızdan gerçek fotoğraflar eklenecek.'),
    ).not.toBeInTheDocument();
  });
});
