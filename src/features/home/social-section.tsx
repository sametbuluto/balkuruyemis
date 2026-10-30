import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ContactChannels } from '@/components/contact/contact-channels';

export function SocialSection() {
  return (
    <section
      className="section-space border-t border-line bg-white"
      aria-labelledby="social-heading"
    >
      <Container className="grid gap-2 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        <SectionHeading
          id="social-heading"
          eyebrow="Bağlantıda kalalım"
          title="Bir merhaba kadar yakın."
          description="Paylaşımlarımız ve iletişim kanallarımız için ayrılan bu alan, resmî hesaplarımızla yakında tamamlanacak."
        />
        <ContactChannels />
      </Container>
    </section>
  );
}
