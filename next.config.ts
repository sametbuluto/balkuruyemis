import type { NextConfig } from 'next';
import { getPublishedBranches } from './src/content/branches';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Next 16.4 boş generateStaticParams dizisini export edemiyor. Şablon korunur;
  // yalnızca gerçek, kimliği tamamlanmış şube varsa özel sayfa uzantısı etkinleşir.
  pageExtensions: [
    'tsx',
    'ts',
    'jsx',
    'js',
    ...(getPublishedBranches().length ? ['branch.tsx'] : []),
  ],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
