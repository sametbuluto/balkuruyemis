import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { getGalleryImages } from '@/content/gallery';

export function GallerySection() {
  return (
    <section
      className="section-space bg-ink text-white"
      aria-labelledby="gallery-heading"
    >
      <Container>
        <SectionHeading
          id="gallery-heading"
          eyebrow="Bizden kareler"
          title="Bal Kuruyemiş’ten anlar."
          description="Mağazalarımızı ve ürünlerimizi gerçek fotoğraflarla daha yakından tanıyacağınız alan."
          inverse
        />
        <PhotoGallery images={getGalleryImages('brand-gallery')} />
      </Container>
    </section>
  );
}
