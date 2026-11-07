import { expect, test } from '@playwright/test';
import { getPageCopy } from '../../src/content/page-copy';
test('işletme metinleri JSON kaynağından gelir; ham kaynaklar ve duyuru JSON hosta açılmaz', async ({
  page,
  request,
}) => {
  const copy = getPageCopy('home');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    `${copy.hero.titleLead} ${copy.hero.titleAccent}`,
  );
  await page.goto('/hakkimizda');
  await expect(
    page.getByText(getPageCopy('about').story.description, { exact: true }),
  ).toBeVisible();
  for (const path of [
    '/content/pages/home.json',
    '/content/settings/site.json',
    '/content/settings/social.json',
    '/content/announcements/announcement-test.json',
  ])
    expect((await request.get(path)).status()).toBe(404);
});
