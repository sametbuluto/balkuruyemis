import { site } from '@/content/site';
import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { SectionHeading } from '@/components/ui/section-heading';
import { BranchGrid } from '@/features/branches/branch-grid';

import { getGalleryImages } from '@/content/gallery';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata(
  'Şubelerimiz',
  `Bal Kuruyemiş’in İzmir Buca’daki ${site.branchCountText} şubesini keşfedin. İsim ve adres eşleştirmeleri bekleyen gerçek konumlar.`,
  '/subelerimiz',
);

export default function BranchesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Şubelerimiz"
        title={`Buca’da ${site.branchCountText} buluşma noktası.`}
        description={`Aynı marka, ${site.branchCountText} fiziksel şube. İzmir Buca’da sizinle buluşuyoruz.`}
      />
      <section className="section-space" aria-labelledby="branch-list-heading">
        <Container>
          <SectionHeading
            id="branch-list-heading"
            eyebrow="Bizi ziyaret edin"
            title="Size yakın bir Bal Kuruyemiş."
          />
          <div className="mb-8 border-l-2 border-brand-gold bg-surface px-6 py-5">
            <p className="text-sm font-semibold">
              Gerçek konumlar · Şube isimleri doğrulanıyor
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              {site.branchCountCapitalized} şubeden {site.knownLocationCountText} konum
              işletme sahibi tarafından paylaşıldı. Konumlar henüz şube isimleriyle
              eşleştirilmedi. Açık adres, telefon ve çalışma saatleri daha sonra
              eklenecek.
              {site.knownLocationCount < site.branchCount
                ? ' Konumu sağlanmayan şubede harita bağlantısı gösterilmez.'
                : null}
            </p>
          </div>
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
          <PhotoGallery
            images={getGalleryImages('branches-gallery')}
            label="Şube fotoğraf galerisi"
          />
        </Container>
      </section>
    </>
  );
}
