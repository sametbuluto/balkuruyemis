import { site } from '@/content/site';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { BranchGrid } from '@/features/branches/branch-grid';

export function BranchesSection() {
  return (
    <section className="section-space bg-surface" aria-labelledby="branches-heading">
      <Container>
        <SectionHeading
          id="branches-heading"
          eyebrow="Şubelerimiz"
          title={`Buca’da ${site.branchCountText} buluşma noktası.`}
          description={`İzmir Buca’daki ${site.branchCountText} şubemizde sizinle buluşalım.`}
          action={{ href: '/subelerimiz', label: 'Şubelerimizi keşfedin' }}
        />
        <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">
          İşletme sahibinin paylaştığı {site.knownLocationCountText} gerçek konum aşağıda
          yer alıyor. Şube isimleri ve açık adres eşleştirmeleri henüz tamamlanmadı.
        </p>
        <BranchGrid />
      </Container>
    </section>
  );
}
