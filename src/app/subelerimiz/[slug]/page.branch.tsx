import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ContentNotice } from '@/components/ui/content-notice';
import { PageIntro } from '@/components/ui/page-intro';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { getPublishedBranch, getPublishedBranches } from '@/features/branches/data';
import { createPageMetadata } from '@/lib/metadata';

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedBranches().map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = getPublishedBranch(slug);
  if (!branch)
    return { title: 'Şube bulunamadı', robots: { index: false, follow: false } };
  return createPageMetadata(
    branch.name,
    branch.description,
    `/subelerimiz/${branch.slug}`,
  );
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = getPublishedBranch(slug);
  if (!branch) notFound();

  return (
    <>
      <PageIntro
        eyebrow="Şubelerimiz"
        title={branch.name}
        description={branch.description}
      />
      <Container className="py-14 md:py-20">
        <ContentNotice title="Ziyaret bilgileri">
          <dl className="space-y-5">
            {branch.address ? (
              <div>
                <dt className="font-semibold text-ink">Adres</dt>
                <dd>{branch.address}</dd>
              </div>
            ) : null}
            {branch.phone ? (
              <div>
                <dt className="font-semibold text-ink">Telefon</dt>
                <dd>{branch.phone}</dd>
              </div>
            ) : null}
            {branch.openingHours ? (
              <div>
                <dt className="font-semibold text-ink">Çalışma saatleri</dt>
                <dd>{branch.openingHours}</dd>
              </div>
            ) : null}
          </dl>
          {branch.googleMapsUrl ? (
            <a
              href={branch.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-6"
            >
              Google Haritalar’da aç{' '}
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          ) : null}
          {branch.whatsappUrl ? (
            <a
              href={branch.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-6 ml-6"
            >
              WhatsApp ile iletişim <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          ) : null}
        </ContentNotice>
        <div className="mt-10">
          <PhotoGallery
            images={branch.images}
            label={`${branch.name} fotoğraf galerisi`}
          />
        </div>
      </Container>
    </>
  );
}
