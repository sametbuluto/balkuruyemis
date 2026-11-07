import { getPageCopy } from '@/content/page-copy';
import { site } from '@/content/site';
import { Container } from '@/components/ui/container';
import { PageIntro } from '@/components/ui/page-intro';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { SectionHeading } from '@/components/ui/section-heading';
import { BranchGrid } from '@/features/branches/branch-grid';

import { getGalleryImages } from '@/content/gallery';
import { createPageMetadata } from '@/lib/metadata';

const copy = getPageCopy('branches');
export const metadata = createPageMetadata(
  copy.seo.title,
  copy.seo.description,
  '/subelerimiz',
);

export default function BranchesPage() {
  return (
    <>
      <PageIntro {...copy.intro} />
      <section className="section-space" aria-labelledby="branch-list-heading">
        <Container>
          <SectionHeading
            id="branch-list-heading"
            eyebrow={copy.list.eyebrow}
            title={copy.list.title}
          />
          <div className="mb-8 border-l-2 border-brand-gold bg-surface px-6 py-5">
            <p className="text-sm font-semibold">{copy.list.noticeTitle}</p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              {copy.list.notice}
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
            eyebrow={copy.gallery.eyebrow}
            title={copy.gallery.title}
            description={copy.gallery.description}
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
