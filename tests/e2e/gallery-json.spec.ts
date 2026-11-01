import { expect, test } from '@playwright/test';
import { getGalleryImages } from '../../src/content/gallery';

test('galeri JSON yalnız server/build katmanındadır; published galeri ve statik kaynak sınırı korunur', async ({
  page,
  request,
}) => {
  await page.goto('/');
  const gallery = page.getByRole('group', { name: 'Mağazalarımızdan fotoğraflar' });
  const entries = getGalleryImages('brand-gallery');
  for (const entry of entries)
    await expect(
      gallery.getByRole('img', { name: entry.alt, exact: true }),
    ).toHaveAttribute('loading', 'lazy');
  if (!entries.length) await expect(gallery.getByRole('img')).toHaveCount(0);
  for (const file of [
    '/content/gallery/media-test.json',
    '/src/content/gallery.server.ts',
    '/.generated/media-check.json',
  ])
    expect((await request.get(file)).status()).toBe(404);
});
