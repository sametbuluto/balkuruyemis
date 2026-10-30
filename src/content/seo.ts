interface SeoEnvironment {
  siteUrl?: string;
  allowIndexing?: string;
  pagesBranch?: string;
  productionBranch?: string;
}

export function resolveSeo(environment: SeoEnvironment) {
  let siteUrl: URL | undefined;
  if (environment.siteUrl?.trim()) {
    const parsed = new URL(environment.siteUrl.trim());
    if (
      parsed.protocol !== 'https:' ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== '/' ||
      parsed.search ||
      parsed.hash
    ) {
      throw new Error(
        'NEXT_PUBLIC_SITE_URL yalnızca HTTPS origin olmalı; yol, sorgu veya kimlik bilgisi içermemeli.',
      );
    }
    const host = parsed.hostname.toLowerCase();
    const isTemporary =
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host.endsWith('.local') ||
      host.endsWith('.test') ||
      host.endsWith('.invalid') ||
      host.endsWith('.pages.dev') ||
      host.endsWith('.vercel.app') ||
      host.endsWith('.netlify.app') ||
      /^[\d.:\[\]]+$/.test(host);
    if (!isTemporary) siteUrl = parsed;
  }
  const isPreview = Boolean(
    environment.pagesBranch &&
    environment.pagesBranch !== (environment.productionBranch || 'main'),
  );
  return {
    siteUrl,
    indexable: Boolean(siteUrl && environment.allowIndexing === 'true' && !isPreview),
  };
}

export const seo = resolveSeo({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
  pagesBranch: process.env.CF_PAGES_BRANCH,
  productionBranch: process.env.SITE_PRODUCTION_BRANCH,
});

export const siteUrl = seo.siteUrl;
