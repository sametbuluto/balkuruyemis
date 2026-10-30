import type { BrandAssets } from '../types/content';
import { getVisibleBranches } from './branches';
import { capitalize, countLabel } from './format';

const branchCount = getVisibleBranches().length;
const branchCountText = countLabel(branchCount);
const knownLocationCount = getVisibleBranches().filter(
  (branch) => branch.coordinates,
).length;

export const site = {
  name: 'Bal Kuruyemiş',
  slogan: 'Lezzetin Doğal Adresi',
  location: 'Buca, İzmir',
  description: `Bal Kuruyemiş ile tanışın. Ürünlerimizi ve İzmir Buca’daki ${branchCountText} şubemizi keşfedin.`,
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
