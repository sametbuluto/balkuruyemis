import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { BranchGrid } from '@/features/branches/branch-grid';
import { getPublishedBranches } from '@/features/branches/data';

export function BranchesSection() {
  return (
    <section className="section-space bg-surface" aria-labelledby="branches-heading">
      <Container>
        <SectionHeading
          id="branches-heading"
          eyebrow="Şubelerimiz"
          title="Buca’da dört buluşma noktası."
          description="İzmir Buca’daki dört şubemizde sizinle buluşalım."
          action={{ href: '/subelerimiz', label: 'Şubelerimizi keşfedin' }}
        />
        {getPublishedBranches().length === 0 ? (
          <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">
            Aşağıdaki kartlar örnek içeriktir. Gerçek şube adları, adresler ve ziyaret
            bilgileri eklendiğinde güncellenecek.
          </p>
        ) : null}
        <BranchGrid />
      </Container>
    </section>
  );
}
