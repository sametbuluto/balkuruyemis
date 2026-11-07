/** Teknik build bağlamı; CMS içeriğinden ayarlanmaz. */
const startup = new Date().toISOString();
export function getBuildInstant(): Date {
  const value = process.env.SITE_BUILD_AT ?? startup;
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  )
    throw new Error('SITE_BUILD_AT geçerli ISO UTC build anı olmalı.');
  return new Date(value);
}
