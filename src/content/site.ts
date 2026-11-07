import type { BrandAssets } from '../types/content';
import { getVisibleBranches } from './branches';
import { capitalize, countLabel } from './format';
import { getSiteSettings } from './editorial.server';
import { formatCopy, siteSchema } from './editorial-schema';

const branchCount = getVisibleBranches().length;
const branchCountText = countLabel(branchCount);
const knownLocationCount = getVisibleBranches().filter(
  (branch) => branch.coordinates,
).length;

const settings = getSiteSettings();
const context = {
  name: settings.name,
  slogan: settings.slogan,
  location: settings.location,
  branchCountText,
  branchCountCapitalized: capitalize(branchCountText),
  knownLocationCountText: countLabel(knownLocationCount),
};
const description = formatCopy(settings.description, context);
const shareDescription = formatCopy(settings.shareDescription, {
  ...context,
  siteDescription: description,
});
// Çözülmüş metinler de uzunluk sınırlarından geçer.
siteSchema({ ...settings, description, shareDescription }, 'site(çözülmüş)');
export const site = {
  name: settings.name,
  slogan: settings.slogan,
  location: settings.location,
  shareLocation: settings.shareLocation,
  description,
  shareDescription,
  branchCount,
  branchCountText,
  branchCountCapitalized: capitalize(branchCountText),
  branchCountPadded: String(branchCount).padStart(2, '0'),
  knownLocationCount,
  knownLocationCountText: countLabel(knownLocationCount),
};

export const brandAssets: BrandAssets = { logo: null, inverseLogo: null };

export const navigation = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/urunlerimiz', label: 'Ürünlerimiz' },
  { href: '/subelerimiz', label: 'Şubelerimiz' },
  { href: '/iletisim', label: 'İletişim' },
] as const;
