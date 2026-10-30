import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { site, siteUrl, seo } from '@/config/site';
import './globals.css';
import { assertSiteContent } from '@/content/content.server';

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: { default: `${site.name} | ${site.slogan}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [{ url: '/icon', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  robots: { index: seo.indexable, follow: seo.indexable },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  assertSiteContent();
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only z-50 bg-white px-5 py-3 text-ink focus:fixed focus:top-3 focus:left-3 focus:not-sr-only"
        >
          İçeriğe geç
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
