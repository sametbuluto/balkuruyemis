import { getSiteSettings, getRawPage } from './editorial.server';
import {
  resolveCopy,
  pageSchemas,
  siteSchema,
  type PageCopy,
  type Parser,
  type PageId,
} from './editorial-schema';
import { site } from './site';
export function getCopyContext() {
  return {
    name: site.name,
    slogan: site.slogan,
    location: site.location,
    siteDescription: site.description,
    branchCountText: site.branchCountText,
    branchCountCapitalized: site.branchCountCapitalized,
    knownLocationCountText: site.knownLocationCountText,
  };
}
export function getPageCopy<K extends PageId>(id: K) {
  const resolved = resolveCopy(getRawPage(id), getCopyContext());
  return (pageSchemas[id] as Parser<PageCopy<K>>)(resolved, `pages/${id}(çözülmüş)`);
}

export function getFooterCopy() {
  const settings = getSiteSettings();
  return siteSchema(
    { ...settings, footer: resolveCopy(settings.footer, getCopyContext()) },
    'footer(çözülmüş)',
  ).footer;
}
