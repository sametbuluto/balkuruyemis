import { writeCmsCandidate } from './adapter.server';
const [source, baseline, output] = process.argv.slice(2);
if (!source || !baseline || !output || process.argv.length !== 5) {
  console.error(
    'Kullanım (teknik araç): cms:prepare -- <source snapshot> <trusted baseline> <ayrı boş output>',
  );
  process.exitCode = 1;
} else {
  writeCmsCandidate(source, baseline, output)
    .then((result) => {
      console.log(
        `CMS candidate hazır: ${result.canonical.size} JSON, ${result.images.size} temiz raster. Kaynaklar değiştirilmedi; yayın/Git merge yapılmadı.`,
      );
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : 'CMS candidate başarısız.');
      process.exitCode = 1;
    });
}
