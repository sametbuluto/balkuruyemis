import { site } from '@/content/site';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { SectionHeading } from '@/components/ui/section-heading';
import { LineIcon } from '@/components/ui/line-icon';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import { ContactChannels } from '@/components/contact/contact-channels';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata(
  'İletişim',
  `Bal Kuruyemiş ile bağlantıda kalın. İzmir Buca’daki ${site.branchCountText} şubemiz, Instagram ve WhatsApp iletişim alanlarımız.`,
  '/iletisim',
);

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="İletişim"
        title="Bir merhaba kadar yakın."
        description="Mağazalarımızda buluşalım, bağlantıda kalalım. Şube ve dijital iletişim bilgilerimizi bu sayfada bir araya getiriyoruz."
      />
      <section className="section-space" aria-labelledby="visit-heading">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              id="visit-heading"
              eyebrow="Bizi ziyaret edin"
              title="Buca’da buluşalım."
              description={`Bal Kuruyemiş, İzmir Buca’da ${site.branchCountText} fiziksel şubesiyle hizmet veriyor.`}
            />
          </div>
          <div className="border border-line bg-surface p-7 sm:p-10">
            <LineIcon name="location" className="text-brand-dark" />
            <h3 className="mt-6 font-display text-3xl">İzmir, Buca</h3>
            <p className="mt-4 max-w-lg text-sm leading-8 text-muted">
              Paylaşılan gerçek konumları şubelerimiz sayfasında haritada açabilir veya
              yol tarifi alabilirsiniz. Şube adı, açık adres, telefon ve çalışma saatleri
              henüz tamamlanmadı.
            </p>
            <Link href="/subelerimiz" className="button-primary mt-7">
              Şubelerimiz <ArrowIcon />
            </Link>
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
            eyebrow="Bağlantıda kalalım"
            title="Dijital kanallarımız"
            description="Resmî hesaplarımız hazır olduğunda aşağıdaki alanlardan bize ulaşabileceksiniz."
          />
          <ContactChannels />
        </Container>
      </section>
    </>
  );
}
