import { getPageCopy } from '@/content/page-copy';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ContactChannels } from '@/components/contact/contact-channels';

export function SocialSection() {
  const copy = getPageCopy('home').social;
  return (
    <section
      className="section-space border-t border-line bg-white"
      aria-labelledby="social-heading"
    >
      <Container className="grid gap-2 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        <SectionHeading
          id="social-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <ContactChannels />
      </Container>
    </section>
  );
}
