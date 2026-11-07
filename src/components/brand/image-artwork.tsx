import { getPageCopy } from '@/content/page-copy';
import { site } from '@/config/site';

// PNG üretimi CSS çalıştırmaz; UI tokenlarının raster çıktılardaki karşılıkları.
const palette = { red: '#ce142b', white: '#ffffff', ink: '#18191b' };

export function BrandIconArtwork({ size }: { size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: palette.red,
        color: palette.white,
        fontSize: size <= 32 ? 28 : 76,
        fontWeight: 700,
        letterSpacing: size <= 32 ? -2 : -6,
      }}
    >
      {size <= 32 ? 'b' : 'bal.'}
    </div>
  );
}

export function BrandShareArtwork() {
  const copy = getPageCopy('home');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: palette.ink,
        color: palette.white,
        borderTop: `12px solid ${palette.red}`,
        padding: '64px 76px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 22,
          letterSpacing: 4,
        }}
      >
        <span>{site.name.toLocaleUpperCase('tr-TR')}</span>
        <span>{site.shareLocation}</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 86,
          lineHeight: 1.12,
          letterSpacing: -3,
        }}
      >
        <span>{copy.hero.titleLead}</span>
        <span>{copy.hero.titleAccent}</span>
      </div>
      <div
        style={{
          display: 'flex',
          borderTop: '1px solid rgba(255,255,255,0.25)',
          paddingTop: 24,
          fontSize: 23,
          color: palette.white,
        }}
      >
        {site.shareDescription}
      </div>
    </div>
  );
}
