import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { SectionHeading } from '@/components/ui/section-heading';
import { BranchGrid } from '@/features/branches/branch-grid';
import { getPublishedBranches } from '@/features/branches/data';
import { brandGallery } from '@/features/gallery/data';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata(
  'Şubelerimiz',
  'Bal Kuruyemiş’in İzmir Buca’daki dört fiziksel şubesini tanıyın. Doğrulanmış ziyaret bilgileri yakında paylaşılacak.',
  '/subelerimiz',
);

export default function BranchesPage() {
  const hasVerifiedBranches = getPublishedBranches().length > 0;
  return (
    <>
      <PageIntro
        eyebrow="Şubelerimiz"
        title="Buca’da dört buluşma noktası."
        description="Aynı marka, dört fiziksel şube. İzmir Buca’da sizinle buluşuyoruz."
      />
      <section className="section-space" aria-labelledby="branch-list-heading">
        <Container>
          <SectionHeading
            id="branch-list-heading"
            eyebrow="Bizi ziyaret edin"
            title="Size yakın bir Bal Kuruyemiş."
          />
          {!hasVerifiedBranches ? (
            <div className="mb-8 border-l-2 border-brand-gold bg-surface px-6 py-5">
              <p className="text-sm font-semibold">Örnek içerik</p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                Bu dört kart, şube bilgilerinin yerleşimini göstermek içindir. Şube
                adları, adresler, telefonlar, çalışma saatleri, yol tarifi ve WhatsApp
                bağlantıları gerçek bilgiler sağlandığında eklenecek.
              </p>
            </div>
          ) : null}
          <BranchGrid />
        </Container>
      </section>
      <section
        className="section-space border-t border-line bg-surface"
        aria-labelledby="branch-gallery-heading"
      >
        <Container>
          <SectionHeading
            id="branch-gallery-heading"
            eyebrow="Mağazalarımızdan"
            title="Şubelerimizi yakından tanıyın."
            description="Gerçek mağaza fotoğrafları eklendiğinde galerimiz burada yer alacak."
          />
          <PhotoGallery images={brandGallery} label="Şube fotoğraf galerisi" />
        </Container>
      </section>
    </>
  );
}
