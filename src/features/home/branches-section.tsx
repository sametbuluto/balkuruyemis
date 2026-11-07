import { getPageCopy } from '@/content/page-copy';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { BranchGrid } from '@/features/branches/branch-grid';

export function BranchesSection() {
  const copy = getPageCopy('home').branches;
  return (
    <section className="section-space bg-surface" aria-labelledby="branches-heading">
      <Container>
        <SectionHeading
          id="branches-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={{ href: '/subelerimiz', label: copy.action }}
        />
        <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">{copy.notice}</p>
        <BranchGrid />
      </Container>
    </section>
  );
}
