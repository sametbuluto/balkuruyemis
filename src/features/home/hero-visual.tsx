import Image from 'next/image';
import { BrandMark } from '@/components/brand/brand-mark';
import { brandGallery } from '@/features/gallery/data';

export function HeroVisual() {
  const photo = brandGallery[0];
  return (
    <div className="relative isolate flex min-h-96 w-full min-w-0 flex-col overflow-hidden bg-ink text-white sm:min-h-[30rem] lg:min-h-[34rem]">
      {photo ? (
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          sizes="(min-width: 1280px) 530px, (min-width: 1024px) 45vw, 100vw"
          preload
          className="-z-10 object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 w-4 bg-brand-red sm:w-6" />
          <div className="absolute top-14 -right-16 h-80 w-80 rotate-45 border border-white/10 sm:h-96 sm:w-96" />
          <div className="absolute top-28 -left-24 h-72 w-72 rotate-45 border border-white/10" />
        </div>
      )}
      <div className="m-6 flex items-center justify-between gap-4 border-b border-white/20 pb-5 sm:m-8">
        <p className="eyebrow text-white">Bal Kuruyemiş</p>
        <span aria-hidden="true" className="h-1 w-8 bg-brand-red" />
      </div>
      <div className="flex flex-1 items-center justify-center px-7 py-9">
        {!photo ? <BrandMark large inverse /> : null}
      </div>
      <div className="relative mt-auto grid grid-cols-[1fr_auto] border-t border-white/20 bg-ink">
        <div className="min-w-0 px-6 py-6 sm:px-8">
          <p className="eyebrow text-white">Bizden kareler</p>
          <p className="mt-2 max-w-52 text-xs leading-6 text-white/75">
            {photo
              ? 'Mağazalarımızdan bir kare.'
              : 'Gerçek mağaza ve ürün fotoğraflarımız yakında burada.'}
          </p>
        </div>
        <div className="flex items-center bg-brand-red px-4 py-6 sm:px-6">
          <span className="eyebrow max-w-20 text-white">Dört şubede</span>
        </div>
      </div>
    </div>
  );
}
