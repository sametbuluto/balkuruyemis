// @vitest-environment node
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  symlink,
  readdir,
} from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  inspectImage,
  validateMediaFiles,
  writeSanitizedImages,
  mediaLimits,
} from './media-files.server';
import type { MediaAsset } from '../types/content';
let root: string;
const asset: MediaAsset = {
  id: 'test-media',
  url: '/images/gallery/test.png',
  alt: 'Yalnız test renk alanı',
  width: 16,
  height: 8,
};
const png = () =>
  sharp({ create: { width: 16, height: 8, channels: 3, background: '#ce142b' } })
    .png()
    .toBuffer();
const file = () => path.join(root, 'public/images/gallery/test.png');
beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'bal-media-'));
  await mkdir(path.join(root, 'public/images/gallery'), { recursive: true });
  await writeFile(file(), await png());
});
afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('Fiziksel medya doğrulaması ve statik temiz çıktı', () => {
  it.each(['png', 'jpeg', 'webp', 'avif'] as const)(
    'izinli formatı gerçek decoder/MIME/piksel verisiyle doğrular: %s',
    async (format) => {
      const target = path.join(root, `public/images/gallery/photo.${format}`);
      await writeFile(
        target,
        await sharp(await png())
          .toFormat(format)
          .toBuffer(),
      );
      const inspected = await inspectImage(target, `/images/gallery/photo.${format}`);
      expect([inspected.width, inspected.height, inspected.format]).toEqual([
        16,
        8,
        format,
      ]);
    },
  );
  it('eksik fiziksel dosya, alt, mükerrer medya ID ve boyut uyuşmazlığını reddeder', async () => {
    await expect(
      validateMediaFiles([{ ...asset, url: '/images/gallery/missing.png' }], root),
    ).rejects.toThrow('bulunamadı');
    await expect(validateMediaFiles([{ ...asset, alt: '' }], root)).rejects.toThrow(
      'alt metin',
    );
    await expect(validateMediaFiles([asset, asset], root)).rejects.toThrow(
      'mükerrer medya ID',
    );
    await expect(validateMediaFiles([{ ...asset, width: 17 }], root)).rejects.toThrow(
      'boyutları',
    );
  });
  it.each([
    '/images/../secret.png',
    '/images/gallery/%2e%2e/test.png',
    '/images/gallery/test.png?x=1',
    '//evil.test/test.png',
    '/images/gallery/a\\b.png',
  ])('güvensiz yol reddi: %s', async (url) => {
    await expect(validateMediaFiles([{ ...asset, url }], root)).rejects.toThrow(
      'güvensiz',
    );
  });
  it('bozuk/truncated görseli gerçek decode ile reddeder', async () => {
    const data = await png();
    await writeFile(file(), data.subarray(0, 40));
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('bozuk');
  });
  it('yanlış MIME/uzantı ve SVG/disguised SVG yüklemesini reddeder', async () => {
    await writeFile(
      file(),
      Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>'),
    );
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('MIME');
    const svg = path.join(root, 'public/images/gallery/test.svg');
    await writeFile(svg, '<svg/>');
    await expect(inspectImage(svg, '/images/gallery/test.svg')).rejects.toThrow('SVG');
  });
  it('symlink dosyayı ve üst dizin symlinkini reddeder', async () => {
    await symlink(file(), path.join(root, 'public/images/gallery/link.png'));
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('symlink');
    await rm(path.join(root, 'public/images/gallery/link.png'));
    await symlink(
      path.join(root, 'public/images/gallery'),
      path.join(root, 'public/images/branches'),
    );
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('symlink');
  });
  it('dosya byte ve çözünürlük limitlerini uygular', async () => {
    await writeFile(file(), Buffer.alloc(mediaLimits.fileBytes + 1));
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('5 MiB');
    await writeFile(
      file(),
      await sharp({
        create: { width: 8001, height: 1, channels: 3, background: 'white' },
      })
        .png()
        .toBuffer(),
    );
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('çözünürlük');
  });
  it('büyük piksel alanı ve çok sayıda dosya için kaynak sınırını uygular', async () => {
    await writeFile(
      file(),
      await sharp({
        create: { width: 5000, height: 5000, channels: 3, background: 'white' },
      })
        .png()
        .toBuffer(),
    );
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('bozuk');
    const bytes = await png();
    await writeFile(file(), bytes);
    for (let index = 0; index < mediaLimits.files; index++)
      await writeFile(path.join(root, `public/images/gallery/extra-${index}.png`), bytes);
    await expect(validateMediaFiles([], root)).rejects.toThrow('toplam byte/dosya');
  });

  it('yanlış fotoğrafı izole Git geçmişinden yeni düzeltme commit’iyle kurtarır', async () => {
    const git = (...args: string[]) =>
      execFileSync(
        'git',
        [
          '-C',
          root,
          '-c',
          'user.name=Media Fixture',
          '-c',
          'user.email=fixture@example.invalid',
          ...args,
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] },
      );
    git('init', '--quiet');
    git('add', 'public/images/gallery/test.png');
    git('commit', '--quiet', '-m', 'test: original fixture');
    const original = await readFile(file());
    await writeFile(file(), 'invalid fixture image');
    git('add', 'public/images/gallery/test.png');
    git('commit', '--quiet', '-m', 'test: wrong photo fixture');
    await expect(validateMediaFiles([asset], root)).rejects.toThrow('MIME');
    await writeFile(file(), git('show', 'HEAD~1:public/images/gallery/test.png'));
    await expect(validateMediaFiles([asset], root)).resolves.toBeInstanceOf(Map);
    git('add', 'public/images/gallery/test.png');
    git('commit', '--quiet', '-m', 'test: restore valid fixture');
    expect(await readFile(file())).toEqual(original);
    expect(git('rev-list', '--count', 'HEAD').toString().trim()).toBe('3');
  });

  it('responsive varyant gerçek boyut/format/oranını doğrular', async () => {
    await writeFile(
      path.join(root, 'public/images/gallery/small.webp'),
      await sharp(await png())
        .resize(8, 4)
        .webp()
        .toBuffer(),
    );
    const variant = {
      ...asset,
      variants: [
        { url: '/images/gallery/small.webp', width: 8, format: 'image/webp' as const },
      ],
    };
    await expect(validateMediaFiles([variant], root)).resolves.toBeInstanceOf(Map);
    await expect(
      validateMediaFiles(
        [{ ...variant, variants: [{ ...variant.variants[0]!, width: 9 }] }],
        root,
      ),
    ).rejects.toThrow('boyutları');
  });
  it('export EXIF/XMP ve orientation temizler; draft/orphan raw dosyaları dışlar; kaynağı korur', async () => {
    const target = path.join(root, 'public/images/gallery/source.jpg');
    const original = await sharp(await png())
      .withMetadata({ orientation: 6 })
      .withXmp('<x:xmpmeta xmlns:x="adobe:ns:meta/">TEST_ONLY_XMP_METADATA</x:xmpmeta>')
      .jpeg()
      .toBuffer();
    expect((await sharp(original).metadata()).xmp?.toString()).toContain(
      'TEST_ONLY_XMP_METADATA',
    );
    await writeFile(target, original);
    const publicAsset = {
      ...asset,
      id: 'source-photo',
      url: '/images/gallery/source.jpg',
      width: 8,
      height: 16,
    };
    const checked = await validateMediaFiles([asset, publicAsset], root);
    await mkdir(path.join(root, 'out/images'), { recursive: true });
    await writeFile(path.join(root, 'out/images/draft-secret.png'), await png());
    expect(await writeSanitizedImages([publicAsset], checked, root)).toBe(1);
    const result = await sharp(
      await readFile(path.join(root, 'out/images/gallery/source.jpg')),
    ).metadata();
    expect(result.exif).toBeUndefined();
    expect(result.xmp).toBeUndefined();
    expect(result.orientation).toBeUndefined();
    expect([result.width, result.height]).toEqual([8, 16]);
    expect(await readFile(target)).toEqual(original);
    expect(await readdir(path.join(root, 'out/images'))).toEqual(['gallery']);
    expect(await readdir(path.join(root, 'out/images/gallery'))).toEqual(['source.jpg']);
  });
});
