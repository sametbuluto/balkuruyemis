import { getPageCopy } from '@/content/page-copy';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { getGalleryImages } from '@/content/gallery';

export function GallerySection() {
  const copy = getPageCopy('home').gallery;
  return (
    <section
      className="section-space bg-ink text-white"
      aria-labelledby="gallery-heading"
    >
      <Container>
        <SectionHeading
          id="gallery-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          inverse
        />
        <PhotoGallery images={getGalleryImages('brand-gallery')} />
      </Container>
    </section>
  );
}
