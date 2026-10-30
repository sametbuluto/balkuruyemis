import Link from 'next/link';
import { StaticImage } from '@/components/ui/static-image';
import { LineIcon } from '@/components/ui/line-icon';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import type { BranchCardEntry } from '@/types/content';
import { getMapsLinks } from '@/content/maps';

export function BranchCard({ branch }: { branch: BranchCardEntry }) {
  const isExample = branch.contentKind === 'example';
  const isLocation = branch.contentKind === 'location';
  const maps = getMapsLinks(branch);
  const image = branch.images[0];

  return (
    <article
      className="flex min-w-0 flex-col border border-line border-t-2 border-t-brand-red bg-white"
      aria-label={`${branch.name}${isExample ? ' — Örnek içerik' : ''}`}
    >
      <div className="relative flex aspect-[1.6] items-center justify-center overflow-hidden bg-ink">
        {image && !isExample ? (
          <StaticImage
            asset={image}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <>
            <span
              aria-hidden="true"
              className="absolute top-4 left-4 border-l-2 border-brand-red pl-3 text-xs font-bold text-white"
            >
              {String(branch.sortOrder).padStart(2, '0')}
            </span>
            <LineIcon name="location" className="h-14 w-14 text-white" />
          </>
        )}
        {isExample ? (
          <span className="absolute right-3 bottom-3 border border-line bg-white px-2.5 py-1 text-[0.65rem] font-semibold text-muted">
            Örnek içerik
          </span>
        ) : null}
        {isLocation ? (
          <span className="absolute right-3 bottom-3 border border-line bg-white px-2.5 py-1 text-[0.65rem] font-semibold text-muted">
            {branch.coordinates ? 'Gerçek konum' : 'Konum bekleniyor'}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-brand-red">Buca, İzmir</p>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
          {branch.name}
        </h3>
        <dl className="mt-5 space-y-4 text-xs leading-6">
          <div>
            <dt className="font-semibold text-ink">Adres</dt>
            <dd className="text-muted">
              {branch.address ?? 'Adres bilgisi hazırlanıyor.'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Telefon</dt>
            <dd className="text-muted">
              {branch.phone ?? 'Telefon bilgisi hazırlanıyor.'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Çalışma saatleri</dt>
            <dd className="text-muted">
              {branch.openingHours ?? 'Çalışma saatleri hazırlanıyor.'}
            </dd>
          </div>
        </dl>
        {!isExample && branch.status === 'published' ? (
          <div className="mt-auto pt-6">
            {branch.contentKind === 'verified' ? (
              <Link href={`/subelerimiz/${branch.slug}`} className="text-link">
                Şubeyi keşfedin <ArrowIcon />
              </Link>
            ) : (
              <p className="mb-3 text-xs leading-6 text-muted">
                {branch.coordinates
                  ? 'Şube adı ve açık adres eşleşmesi bekleniyor.'
                  : 'Bu şubenin konumu henüz sağlanmadı. Daha sonra eklenecek.'}
              </p>
            )}
            <div className="flex flex-col items-start gap-x-4">
              {maps ? (
                <a
                  href={maps.view}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Google Haritalar’da Aç
                  <span className="sr-only"> (yeni sekmede açılır)</span>
                </a>
              ) : null}
              {maps?.directions ? (
                <a
                  href={maps.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Yol Tarifi Al<span className="sr-only"> (yeni sekmede açılır)</span>
                </a>
              ) : null}
              {branch.whatsappUrl ? (
                <a
                  href={branch.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  WhatsApp<span className="sr-only"> (yeni sekmede açılır)</span>
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="mt-auto border-t border-line pt-5 text-xs leading-6 text-muted">
            <span className="mt-5 block">
              Şube adı ve fotoğrafları gerçek bilgilerle güncellenecek.
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
