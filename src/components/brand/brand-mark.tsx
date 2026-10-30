import { StaticImage } from '@/components/ui/static-image';
import { brandAssets, site } from '@/config/site';

export function BrandMark({
  inverse = false,
  large = false,
}: {
  inverse?: boolean;
  large?: boolean;
}) {
  const logo = inverse ? (brandAssets.inverseLogo ?? brandAssets.logo) : brandAssets.logo;

  if (logo) {
    return (
      <StaticImage
        asset={logo}
        alt={site.name}
        sizes={large ? '(min-width: 1024px) 360px, 240px' : '176px'}
        className={
          large
            ? 'mx-auto h-auto max-h-48 w-60 object-contain lg:w-90'
            : 'h-auto max-h-14 w-40 object-contain sm:w-44'
        }
      />
    );
  }

  if (large) {
    return (
      <div className="text-center">
        <p className="font-brand text-[clamp(6rem,15vw,10rem)] leading-none font-bold tracking-[-0.09em]">
          bal<span className="text-brand-red">.</span>
        </p>
        <p className="mt-5 pl-2 text-xs tracking-[0.45em] uppercase sm:text-sm">
          Kuruyemiş
        </p>
      </div>
    );
  }

  return (
    <>
      <span className="font-brand text-[3.25rem] leading-none font-bold tracking-[-0.09em]">
        bal<span className="text-brand-red">.</span>
      </span>
      <span
        className={`border-l pl-2 text-[0.65rem] font-bold tracking-[0.2em] uppercase sm:pl-3 ${inverse ? 'border-white/25' : 'border-line'}`}
      >
        Kuruyemiş
      </span>
    </>
  );
}
