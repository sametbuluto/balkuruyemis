import { expect, test } from '@playwright/test';
import { getVisibleBranches } from '../../src/content/branches';

test('şube JSON göçü: gerçek konumlar görünür, kaynak ve kimlik onay dosyaları hosta açılmaz', async ({
  page,
  request,
}) => {
  const paths: string[] = [];
  page.on('request', (request) => paths.push(new URL(request.url()).pathname));
  await page.goto('/subelerimiz');
  for (const branch of getVisibleBranches()) {
    const card = page.getByRole('article', { name: branch.name, exact: true });
    await expect(card).toBeVisible();
    if (branch.contentKind === 'location')
      await expect(card.getByRole('link', { name: /Şubeyi keşfedin/ })).toHaveCount(0);
  }
  expect(
    paths.filter((path) => path.startsWith('/content/') || path.startsWith('/api/')),
  ).toEqual([]);
  for (const path of [
    '/content/branches/location-1.json',
    '/src/content/branches.server.ts',
    '/src/content/branch-identity.ts',
    '/subelerimiz/bilinmeyen-sube',
  ])
    expect((await request.get(path)).status()).toBe(404);
  expect(
    await page.locator('script[type="application/ld+json"]').allTextContents(),
  ).not.toEqual(expect.arrayContaining([expect.stringContaining('LocalBusiness')]));
});
