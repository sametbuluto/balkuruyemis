import { ContactDetails } from '@/components/contact/contact-details';
import { getPageCopy } from '@/content/page-copy';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { SectionHeading } from '@/components/ui/section-heading';
import { LineIcon } from '@/components/ui/line-icon';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { ContactChannels } from '@/components/contact/contact-channels';
import { createPageMetadata } from '@/lib/metadata';

const copy = getPageCopy('contact');
export const metadata = createPageMetadata(
  copy.seo.title,
  copy.seo.description,
  '/iletisim',
);

export default function ContactPage() {
  return (
    <>
      <PageIntro {...copy.intro} />
      <section className="section-space" aria-labelledby="visit-heading">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              id="visit-heading"
              eyebrow={copy.visit.eyebrow}
              title={copy.visit.title}
              description={copy.visit.description}
            />
          </div>
          <div className="border border-line bg-surface p-7 sm:p-10">
            <LineIcon name="location" className="text-brand-dark" />
            <h3 className="mt-6 font-display text-3xl">{copy.visit.placeTitle}</h3>
            <p className="mt-4 max-w-lg text-sm leading-8 text-muted">
              {copy.visit.placeDescription}
            </p>
            <Link href="/subelerimiz" className="button-primary mt-7">
              {copy.visit.action} <ArrowIcon />
            </Link>
            <ContactDetails />
          </div>
        </Container>
      </section>
      <section
        className="section-space border-t border-line bg-surface"
        aria-labelledby="digital-heading"
      >
        <Container>
          <SectionHeading
            id="digital-heading"
            eyebrow={copy.digital.eyebrow}
            title={copy.digital.title}
            description={copy.digital.description}
          />
          <ContactChannels />
        </Container>
      </section>
    </>
  );
}
