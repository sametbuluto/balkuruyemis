import { getSiteSettings } from '@/content/editorial.server';
export function getContactLinks() {
  const settings = getSiteSettings();
  return {
    phone:
      settings.phoneVerified && settings.phone
        ? { label: settings.phone, href: `tel:${settings.phone.replace(/[ ()-]/g, '')}` }
        : null,
    email:
      settings.emailVerified && settings.email
        ? { label: settings.email, href: `mailto:${encodeURIComponent(settings.email)}` }
        : null,
  };
}
export function ContactDetails() {
  const links = getContactLinks();
  if (!links.phone && !links.email) return null;
  return (
    <dl className="mt-6 space-y-3 text-sm">
      {links.phone ? (
        <div>
          <dt>Telefon</dt>
          <dd>
            <a className="text-link" href={links.phone.href}>
              {links.phone.label}
            </a>
          </dd>
        </div>
      ) : null}
      {links.email ? (
        <div>
          <dt>E-posta</dt>
          <dd>
            <a className="text-link" href={links.email.href}>
              {links.email.label}
            </a>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
