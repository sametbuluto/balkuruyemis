/** Gelecek yayın hattı için yerel ön kontrol; henüz hiçbir workflow'a bağlı değildir. */
export const contentChangeLimits = {
  maxFiles: 50,
  jsonBytes: 256 * 1024,
  imageBytes: 5 * 1024 * 1024,
  batchBytes: 20 * 1024 * 1024,
} as const;

export interface ContentChangeDecision {
  ok: boolean;
  paths: string[];
  errors: string[];
}

const entryName = '[a-z0-9]+(?:-[a-z0-9]+)*';
const collectionPath = new RegExp(
  `^content/(products|categories|branches|gallery|announcements)/${entryName}\\.json$`,
);
const singletonPath = /^content\/(home|settings|social)\.json$/;
const imagePath = new RegExp(
  `^public/images/(brand|products|categories|branches|gallery)/(?:${entryName}/)*${entryName}\\.(jpg|jpeg|png|webp|avif)$`,
);

/**
 * Manifest gelecekte güvenilir main kodunun okuduğu gerçek Git nesnelerinden çıkarılmalı.
 * Dosya içeriği/JSON şeması, resim decode veya atomik merge garantisi vermez.
 */
export function assessContentChanges(input: unknown): ContentChangeDecision {
  const errors: string[] = [];
  const paths: string[] = [];
  const seen = new Set<string>();
  let totalBytes = 0;
  if (!Array.isArray(input) || input.length === 0)
    return { ok: false, paths: [], errors: ['Yayımlanacak dosya değişikliği gerekli.'] };
  if (input.length > contentChangeLimits.maxFiles)
    return { ok: false, paths: [], errors: ['Değişiklikte dosya sayısı sınırı aşıldı.'] };

  for (const entry of input as unknown[]) {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      errors.push('Geçersiz değişiklik kaydı.');
      continue;
    }
    const record = entry as Record<string, unknown>;
    const { path, status, mode, bytes } = record;
    if (
      Object.keys(record).some(
        (key) => !['path', 'status', 'mode', 'bytes'].includes(key),
      ) ||
      typeof path !== 'string' ||
      path.length > 240 ||
      typeof status !== 'string' ||
      typeof mode !== 'string' ||
      typeof bytes !== 'number' ||
      !Number.isSafeInteger(bytes) ||
      bytes <= 0
    ) {
      errors.push('Değişiklik alanları veya dosya boyutu geçersiz.');
      continue;
    }
    const label = JSON.stringify(path);
    if (!['A', 'M'].includes(status))
      errors.push(`${label}: silme/taşıma işlemi otomatik yayımlanamaz.`);
    if (mode !== '100644')
      errors.push(
        `${label}: yalnızca normal, çalıştırılamayan Git dosyası kabul edilir.`,
      );
    if (seen.has(path)) errors.push(`${label}: yinelenen dosya yolu.`);
    seen.add(path);
    const isJson = collectionPath.test(path) || singletonPath.test(path);
    const isImage = imagePath.test(path);
    if (!isJson && !isImage) errors.push(`${label}: içerik izin listesi dışında.`);
    if (isJson && bytes > contentChangeLimits.jsonBytes)
      errors.push(`${label}: JSON boyutu sınırı aşıldı.`);
    if (isImage && bytes > contentChangeLimits.imageBytes)
      errors.push(`${label}: görsel boyutu sınırı aşıldı.`);
    totalBytes += bytes;
    paths.push(path);
  }
  if (totalBytes > contentChangeLimits.batchBytes)
    errors.push('Toplam dosya boyutu sınırı aşıldı.');
  // Tek uygunsuz kayıt varsa izinli dosyalar da kısmen yayımlanamaz.
  return { ok: errors.length === 0, paths: errors.length ? [] : paths, errors };
}
