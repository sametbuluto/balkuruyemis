import type { BrandAssets, ContactChannel } from '@/types/content';

export const site = {
  name: 'Bal Kuruyemiş',
  slogan: 'Lezzetin Doğal Adresi',
  description:
    'Bal Kuruyemiş ile tanışın. Ürünlerimizi ve İzmir Buca’daki dört şubemizi keşfedin.',
  location: 'Buca, İzmir',
  branchCount: 4,
} as const;

// Orijinal dosyalar geldiğinde /public altındaki yolları ve gerçek boyutlarını girin.
export const brandAssets: BrandAssets = { logo: null, inverseLogo: null };

export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Bal Kuruyemiş’ten kareler ve paylaşımlar için.',
    url: null,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Sorularınız ve şubelerimizle iletişim için.',
    url: null,
  },
];

export const navigation = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/urunlerimiz', label: 'Ürünlerimiz' },
  { href: '/subelerimiz', label: 'Şubelerimiz' },
  { href: '/iletisim', label: 'İletişim' },
] as const;

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Alan adı doğrulanana kadar canonical ve sitemap adresleri yayımlanmaz.
export const siteUrl = configuredUrl ? new URL(configuredUrl) : undefined;

if (siteUrl && !['http:', 'https:'].includes(siteUrl.protocol)) {
  throw new Error('NEXT_PUBLIC_SITE_URL geçerli bir HTTP(S) adresi olmalı.');
}
