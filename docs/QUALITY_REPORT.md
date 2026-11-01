# Faz 4.1-c3 — Galeri ve medya kalite raporu

Tarih: **1 Kasım 2026**. Yerel altyapı tamamlandı; gerçek CMS/push/deployment yoktur.
[MEDIA_GUIDE](MEDIA_GUIDE.md) · [Master plan §18](../plan.md).

## PASS

- Galeri TS boş kaynağından content/gallery JSON koleksiyonuna taşındı; gerçek galeri
  ve fotoğraf sayısı 0. Ürün/kategori/şube medyası kendi kaynağında kaldı; ikinci registry yok.
- Medya id/url/alt/gerçek width-height/variants, yayın/sıra ve kullanım alanını destekler.
  Galeri usages ile hero/ortak/şube yüzeylerine gider; embedded medya status/sortOrder
  isteğe bağlıdır. Draft veri ebeveyn published olsa bile serialize edilmez.
- İmza/decoder MIME/full pixel decode, gerçek ölçü/oran, güvenli yol/symlink, byte/
  çözünürlük/adet, eksik dosya, zorunlu alt ve global medya ID tekrarı doğrulanır.
  JPEG/PNG/WebP/AVIF izinli, SVG şimdilik tamamen kapalıdır.
- Standart build yalnız published fotoğrafları out/images'e yeniden encode edip
  EXIF/XMP/IPTC/ICC'siz yazar; draft/orphan raw dosyalar dışlanır. Kaynak byte'ları aynı kalır.
- Build sırasında JSON/görsel değişimi fingerprint ile reddedilir. Header/rota/tasarım,
  StaticImage/PhotoGallery, altı kategori ve dört koordinat korundu.
- 38 kritik dosya başlangıç arşiviyle byte eşit. Sharp 0.35.5 mevcut transitive sürümden
  exact doğrudan bağımlılık oldu; kontrolsüz paket/native sürüm değişikliği yoktur.

| Kontrol                        | Sonuç                                                             |
| ------------------------------ | ----------------------------------------------------------------- |
| TypeScript / ESLint / Prettier | PASS; ana strict aynı                                             |
| Vitest                         | **262/262**, 18 dosya; 52 yeni test                               |
| Production static export       | **67 dosya**, noindex true; rotalar aynı                          |
| Static HTTP                    | **3/3**                                                           |
| Playwright / sistem Chrome     | **48/48**, out/ üzerinde                                          |
| Responsive                     | **320, 393, 768, 1280 px**                                        |
| Kategori / ürün / şube export  | **3/3 · 4/4 · 5/5**                                               |
| İzole medya export             | **5/5**                                                           |
| Git fotoğraf kurtarma          | Temp repoda doğru → yanlış → yeni düzeltme commit'i; decode geçti |

Medya fixture üç hatalı build'i reddeder, EXIF'siz üretim dosyaları ve doğru MIME'i
HTTP'de doğrular; draft/orphan URL'leri 404'tür. Hero eager/high, galeri lazy ve
srcset/sizes dört genişlikte kontrol edilir. İzole ürün/şube fotoğrafları render edilir.
Son input değişikliği export'u reddeder. Gerçek kaynak/out'a test fotoğrafı eklenmedi.
67/68 farkı yalnız ham .gitkeep çıktıdan çıkarıldığı içindir; required rotalar/PNG/SEO korunur.

## WARNING

- CMS upload ekranı/.pages.yml/hesap/CI ve Cloudflare bağlantısı yok. Native image alanı
  dosya yolu saklar; Ali Abi'den piksel ölçüsü istemeden metadata yazacak güvenilir
  adaptör ve gerçek editor round-trip testi henüz kurulmadı. Şimdiki width/height zorunlu.
- Build'de EXIF temizliği orijinal dosyayı/Git geçmişini temizlemez. Public repo upload'u
  öncesi kaynak EXIF mahremiyeti ayrıca kontrol edilmelidir. Dev ham public dosyalarını sunar.
- Aynı formatta re-encode vardır; otomatik resize/kadraj/varyant üretimi yok. Gerçek medya
  performansı ölçülmedi. Hazır varyantlar doğrulanır ve StaticImage ile sunulur.
- Yardımcı TS CJS derlemesinde TS6 Node resolution deprecation uyumluluğu ayrı config'tedir;
  ana strict aynı, TS7 öncesi araç çözümlemesi tekrar değerlendirilmelidir.
- Firefox/WebKit/fiziksel cihaz ve yeni axe taraması yapılmadı. Yerel test tam WCAG/host güvenliği değildir.
- İlk generated lint/tip kopyası ve fixture bekleme sorunları düzeltildi; son kontroller geçti.

## FAIL

Son kontrollerde başarısız test veya açık kritik hata yok. Hatalı JSON/görsel build
reddi beklenen güvenlik davranışıdır. **CMS entegrasyonu tamamlanmış değildir.**

## Dosyalar, Git ve kabul ölçütü

Yeni galeri schema/loader, media-selection, media-files/server, media-cli ve tool
config/runner; content/gallery ve public/images alanları; iki unit, bir E2E ve izole
medya export testi. Ortak MediaAsset/schema/yayın seçicileri, async root doğrulaması,
hero/galeri kullanım bağlantıları ve build script'leri güncellendi. Bileşenler yeniden
kurulmadı; eski testler kaldırılmadı. Dokümanlar ve resmî CMS alan eşlemesi güncellendi.

Başlangıç Git main/0507348; snapshot/kanıt arşivi /private/tmp/bal-phase41c3-z6h_8nuw/.
Medya kanıtı: bal-media-export-VqSdAU; diğer fixture yolları master planda kayıtlı.
.generated, out ve test raporları Git dışıdır. Başarılı çalışma yerel
`feat: add CMS-ready gallery and validated static media pipeline` commit'iyle kaydedilir;
hash git log ve teslim yanıtında bulunur. Remote/push/deployment/c4 yoktur.

Gerçek tamamlanma ölçütü: Ali Abi panelden ürün adı, fotoğraf veya ana sayfa metni
ile üç akışı kod/piksel metadata girmeden yürütür; otomatik trusted kontroller ve
korunan aktarım geçer; Cloudflare üzerinde yeni içerik/source SHA doğrulanır.
Bozuk medya önceki yayını değiştirmez; geri alma ve yeniden yayın da denenir.
Bu gerçek kabul henüz yapılmadı. c4 önerisi: site metinleri ve upload metadata
adaptörünü ayrı küçük işler halinde ele almak; kendiliğinden başlatılmadı.

---

## Tarihsel Faz 4.1-c2 raporu

# Faz 4.1-c2 — Şube JSON kalite raporu

Tarih: **1 Kasım 2026**. 4.1-a/b/c1 kabul edildi; önceki kaynaklar ve raporlar korundu.
Sözleşme [CONTENT_GUIDE](CONTENT_GUIDE.md), ayrıntılı kayıt [plan.md §17](../plan.md).

## PASS

- Dört kayıt **14 alanıyla birebir** content/branches/location-{1,2,3,4}.json'a taşındı.
  Dört koordinat, özgün Maps URL'leri ve Konum 1–4 adları aynı; eksik alanlar null.
- Strict JSON/UTF-8/tip/ID-filename/unknown alan ve mükerrer ID/slug/koordinat/adres
  denetimi var. Yanlış Maps eşleşmesi ve örnek şube JSON'u reddedilir. Fallback yoktur.
- Şube kimliği ayrı korunan ID/hash onayıyla doğrulanır. Şu an onay listesi boş.
  Sadece JSON'da verified seçmek onay vermez; yalnız onaylı verified/published detay
  üretir. LocalBusiness eklenmedi, location kayıtları detay/sitemap'e girmez.
- Yeni JSON şube merkezi sayımı günceller; aynı fiziksel şube için ID korunur.
  images ilk kapak + detay galerisini, nullable telefon/WhatsApp/saat sözleşmesini korur.
- Header server/client sınırı ayrıldı; fs client'a aktarılmaz, menü/klavye/sticky
  davranışı korundu. Kaynak JSON ve teknik onay statik hostta 404'tür.
- Başlangıçla karşılaştırmada kategori/ürün kaynakları, policy, site/galeri, stil,
  paket/strict/config ve diğer korunan **82 dosya byte eşit**. Yeni paket yok.

| Kontrol                        | Sonuç                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| TypeScript / ESLint / Prettier | PASS; strict korundu                                                |
| Vitest                         | **210/210**, 16 dosya; 64 yeni şube testi                           |
| Production static export       | **68 dosya**, noindex true, aynı rotalar                            |
| Static HTTP                    | **3/3**                                                             |
| Playwright / sistem Chrome     | **45/45**, gerçek out/ sunucusunda                                  |
| Responsive regresyon           | **320, 393, 768, 1280 px**                                          |
| İzole kategori / ürün export   | **3/3 ve 4/4**                                                      |
| İzole şube export              | **5/5**; dört negatif build ve yayın/kimlik/404/sitemap kontrolleri |

Negatif şube build'leri malformed JSON, unknown field, yanlış Maps ve onaysız
verified kaydı reddeder. Pozitif fixture aynı ID kimlik yükseltmesini, yeni fiziksel
şubeyi, merkezi sayımı ve onaylı draft kaydın dışlanmasını doğrular. İndeksleme
sadece izole test domainiyle açılarak sitemap kontrol edilir. Gerçek build/ayarlar
noindex kalır; fixture'lar gerçek kaynak veya out/ içine eklenmez.

## WARNING

- Gerçek şube adı/adres eşleşmeleri ve telefon/saat/fotoğraflar bekleniyor. Onay
  hash'i teknik sorumlu tarafından ürün sahibi doğrulamasıyla eklenir. Kimlik alanı
  değişirse onay yenilenir; bu veri mimarisi kurulmuş bir CMS/CI güvenliği değildir.
- Fotoğraf upload/decode, .pages.yml, CMS hesabı ve harici yayın hattı kurulmadı.
- JSON sonrasında dev sunucusunu yeniden başlatıp sayfayı yenileyin; yayında yeniden build gerekir.
- WebKit/Firefox/fiziksel cihaz ve yeni axe taraması bu görevde çalıştırılmadı.
- İlk strict tip ve navbar client fs import hataları düzeltildi; son kontroller geçti.

## FAIL

Son kontrollerde başarısız test veya açık kritik hata yok. Negatif fixture build
reddi beklenen başarı davranışıdır.

## Git ve dosyalar

Yeni branch-schema/branches.server/branch-identity, iki unit dosyası ve branches-json
E2E eklendi. branches.ts/content.server.ts, Header sınırı, branch export script'i ve
belgeler güncellendi. Önceki kategori/ürün/policy testleri kaldırılmadı.

Başlangıç/kanıt/loglar: /private/tmp/bal-phase41c2-fxkd65p4/.
Canonical eski/yeni şube SHA-256 aynı:
`5185cc775a8e564cdd4e35af5cf97ea018904d5f746df7d880356aed6bd28c4b`.
Son şube fixture yolu branch-fixture-final.log içinde; diğer fixture yolları plan §17'de.

Önceki 4.1-a/b/c1 ve c2 kod/test commit: **`11b28847a041e4f6a49fc2cef8e5453daf7fb30e`**.
Belgeler ayrı `docs: record CMS content migrations and quality results` commit'inde kaydedilir.
Gizli env/otomatik çıktılar/test raporları Git dışıdır. Harici remote/push/deployment
veya 4.1-c3 başlatılmadı. Son commit hash'leri teslim yanıtında raporlanır.

---

## Tarihsel Faz 4.1-c1 raporu

# Faz 4.1-c1 — Ürün JSON kalite raporu

Tarih: **1 Kasım 2026**. Yalnız ürün içerik mimarisi; 4.1-a/b değişiklikleri ve
önceki raporlar korundu. Ayrıntılı sözleşme [CONTENT_GUIDE](CONTENT_GUIDE.md), faz
kaydı [plan.md §16](../plan.md) içindedir.

## PASS

- Gerçek ürün kaynağı önce 0, sonra 0. content/products yalnız .gitkeep içerir;
  test ürünleri gerçek kaynağa veya out/ içine yazılmadı.
- Tek ürün kaynağı product-<id>.json; sekiz zorunlu alan: id, slug, name, categoryId,
  description, images, sortOrder, status. TS literal listesi kaldırıldı.
- Strict unknown parse/schema: bilinmeyen/eksik alan, yanlış tip/değer/ID/filename,
  duplicate ID/slug, bozuk JSON/UTF-8, geçersiz kategori, symlink ve byte limiti reddi.
- categoryId gerçek strict kategori JSON kayıtlarına karşı doğrulanır; sabit ikinci
  seçenek listesi yoktur. Yalnız published ürün + published kategori client'a gider.
- Boş koleksiyon geçerli, kayıp/bozuk veri fallback üretmez. JSON yalnız Node/RSC
  loader'da işlenir; kaynak JSON/server TS statik hostta 404, client veri API'si yok.
- İzole testte published ürün render edildi; draft ürün ve draft kategoriye bağlı
  ürünün ad/ID işaretleri HTML/RSC/TXT/XML/JSON/JS çıktılarında bulunmadı.
- Altı kategori JSON'u ve dört koordinat aynı. Başlangıç arşivine göre UI kaynakları,
  4.1-a policy/test, şube/galeri/site/sosyal, paket/lock/strict/config dahil 75 dosya byte eşit.

| Kontrol                        | Sonuç                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| TypeScript / ESLint / Prettier | PASS; strict korundu, lint uyarısı 0                               |
| Vitest                         | **146/146**, 14 dosya; 43 yeni ürün testi                          |
| Production static export       | PASS; **68 dosya**, noindex true, aynı rotalar                     |
| Static HTTP                    | **3/3**                                                            |
| Playwright / sistem Chrome     | **42/42**, gerçek out/ sunucusunda                                 |
| Responsive                     | **320 / 393 / 768 / 1280 px**; DOM kontrolleri ve ekran incelemesi |
| İzole ürün export              | **4/4**; üç negatif build + yayın/gizlilik/tarayıcı kontrolü       |
| İzole kategori export          | **3/3**                                                            |
| İzole şube export              | **1/1**                                                            |

Komutlar: npm run check; PLAYWRIGHT_CHANNEL=chrome npm run test:e2e;
node scripts/test-product-export.mjs; node scripts/test-category-export.mjs;
node scripts/test-branch-export.mjs. Ürün fixture'ı kaynakları yalnız geçici kopyada değiştirir.

## WARNING

- Gerçek ürün ve fotoğraf henüz yok. Görsellerin veri sözleşmesi hazır; upload,
  decode/EXIF, boyut türetme veya gerçek Pages CMS editörü kurulmadı.
- JSON sonrası dev sunucusunu yeniden başlatıp sayfayı yenileyin; otomatik HMR yok.
  Statik yayına yansımak için yeniden build gerekir.
- WebKit/Firefox/fiziksel cihaz ve yeni axe taraması bu görevde çalıştırılmadı;
  önceki eksik tarayıcı binary kısıtları geçerli. Chrome emülasyonu fiziksel cihaz testi değildir.
- İlk fixture tarayıcı denemesi macOS /var takma yolu nedeniyle yerel QA'da 404 verdi.
  Fixture sunucusunun kökü realpath ile çözüldü; son kontrol geçti. Uygulama tasarımı değişmedi.

## FAIL

Son kontrollerde başarısız test veya açık kritik hata yok. Hatalı JSON/ref fixture
build'lerinin başarısız olması beklenen koruma davranışıdır.

## Değişen dosyalar, Git ve kanıt

- Yeni: content/products/.gitkeep; product-schema.ts/products.server.ts ve iki test;
  ortak content-schema.ts; tests/e2e/catalog-assertions.ts, products-json.spec.ts;
  scripts/test-product-export.mjs.
- Erişim: products.ts, queries.ts, content.server.ts. Kategori şeması aynı kurallarla
  ortak helper'a alındı; categories.server.test.ts draft kategori fixture'ı güçlendirildi.
- site.spec.ts boş katalog denetimini koruyup ileride gerçek ürün kartlarını da destekler.
  Mevcut testler kaldırılmadı. AGENTS/README/mimari/içerik/CMS/yol haritası/plan güncellendi.
- Ana arşiv/log ve preservation-report.json: /private/tmp/bal-phase41c1-e1237sbd/.
  Ürün fixture: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-product-export-8AydTy.
  Kategori ve şube fixture yolları plan.md §16'da kayıtlıdır.
- Git main/**78df0f7**, önceki değişiklikler korunarak uncommitted; yeni commit veya remote yok.
  Push/deployment/hesap/secret/.pages.yml/DB/admin/yeni paket yok. Faz 4.1-c2 başlatılmadı.

---

## Tarihsel Faz 4.1-b raporu

# Faz 4.1-b — Kategori JSON pilotu kalite raporu

Tarih: **1 Kasım 2026**. Yalnız kategori geçişi; önceki V5/4.1-a raporu aşağıda korunur.

## PASS

- Eski/yeni **6/6 kayıt, 7/7 alan birebir**: id, slug, name, description, image,
  sortOrder, status. Kayıp/değişen kayıt 0; açıklamalar ve null görseller aynı.
- Canonical sıralı JSON SHA-256 önce/sonra aynı:
  `f9ef00bbdcb4b05a9971aee9e4491c5e4c0cf176447e1f5b52254e07a1626aad`.
- Eski TS kaynağı 78df0f7 ile aynıydı; snapshot ve parity/preservation kanıtları
  /private/tmp/bal-phase41b-nUr6iB içindedir. Tarihsel eşitlik sabit bir CI hash kilidi değildir.
- content/categories altında altı ayrı ID.json gerçek tek kaynak. Eski TS literal
  listesi kaldırıldı; compatibility snapshot ikinci düzenlenebilir kaynak değildir.
- Strict unknown parse/schema: bilinmeyen/eksik alan, yanlış tip/ID/filename,
  duplicate ID/slug, bozuk JSON/UTF-8, symlink ve boyut aşımları reddedilir.
- İzole export sözleşmesi **3/3**: malformed JSON ve unknown field build'i reddeder;
  draft kaydı statik HTML/bağlantılarda görünmez.
- Güncellenmiş şube detay export fixture testi **1/1** geçti.
- Başlangıç arşivine göre policy/test, şube/ürün/galeri/sosyal/site, paket/lock/TS/Next
  ve tasarım token/CSS dosyaları değişmedi. Dört gerçek koordinat korundu.

| Kontrol                        | Sonuç                                         |
| ------------------------------ | --------------------------------------------- |
| TypeScript / ESLint / Prettier | PASS; strict korundu, lint uyarısı 0          |
| Vitest                         | **103/103**, 12 dosya; 39 yeni kategori testi |
| Production static build        | PASS; out/ 68 dosya; rotalar/SEO aynı         |
| Static HTTP                    | **3/3**                                       |
| Playwright / sistem Chrome     | **39/39**; gerçek out/ statik sunucusunda     |
| Responsive regresyon           | **320, 393, 768, 1280 px**                    |
| İzole kategori export          | **3/3**                                       |
| İzole şube export              | **1/1**                                       |

Komutlar: npm run check; PLAYWRIGHT_CHANNEL=chrome npm run test:e2e;
node scripts/test-category-export.mjs; node scripts/test-branch-export.mjs.

## WARNING

- Gerçek Pages CMS/.pages.yml/GitHub write/Cloudflare işlemi yapılmadı. Diğer
  içerikler TS olarak kalır; 4.1-c başlatılmadı.
- JSON kaynağı Next'in modül grafiğinde olmadığından dev sunucusunu yeniden başlatıp sayfayı yenileyin;
  otomatik HMR iddiası yok. Yayında her değişiklik yeniden statik build gerektirir.
- Görsel shape/alt/dimensions/yerel yol doğrulanır; decode/EXIF/optimizasyon yeni
  özellik olarak eklenmedi. Mevcut root dosya varlığı kontrolü korunur.
- Yeni WebKit/Firefox/fiziksel cihaz/axe testi yok; önceki sınırlar geçerli.
- İlk typecheck eski .next/types kopyalarında durdu; numaralı generated dosyalar
  silinmeden çalışma arşivinin generated-type-copies dizininde korundu; build sonra geçti.

## FAIL

Son toplu turda başarısız test veya açık kritik hata yok. Negatif fixture build'lerinin reddedilmesi
beklenen başarıdır; gerçek kaynak/out/ dosyaları bu fixture'larda değiştirilmedi.

## Dosyalar ve kanıtlar

- Yeni kaynak: content/categories/category-{kuruyemis,kahve,lokum,baharat,aktar,kozmetik}.json.
- categories.server.ts/category-schema.ts ve iki test dosyası; categories.ts/queries.ts/content.server.ts erişim güncellemesi.
- Yeni tests/e2e/categories-json.spec.ts ve scripts/test-category-export.mjs.
- scripts/test-branch-export.mjs fixture kopyasına yalnız content dizini eklendi.
- AGENTS/README/CONTENT_GUIDE/ARCHITECTURE/CMS_SETUP/ROADMAP/plan ve bu rapor.

İzole kategori kanıtı: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-category-export-4gDIrh.
Şube export: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-branch-export-603FFr.
Git main/78df0f7, eski değişiklikler korunarak uncommitted. Commit/push/secret/hesap/deployment yok.

---

## Tarihsel V5 / Faz 4.1-a raporu

# V5 / Faz 4.1 ön kontrol ve yerel hazırlık raporu

Tarih: **1 Kasım 2026**. Araştırma 30 Ekim'de başladı; GitHub durumu ve yerel
kaynaklar 1 Kasım'da yeniden kontrol edildi. Bu rapor önceki boş dosyaya yazıldı;
tarihsel Faz 3 sonuçları [plan.md §12](../plan.md) içinde korunur.

## PASS

- Son commit 78df0f7 / main; önceki doküman değişiklikleri korundu.
- GitHub public API HTTP 200, repo Public/size 0; anonim ls-remote başarılı, refs boş.
  Remote yok; push/ayar/yetki değişmedi.
- Gerçek .env ve otomatik çıktı izlenmiyor; bilinen sır deseni bulunmadı.
- Paket/lock exact sürümleri eşleşiyor; yeni bağımlılık yok.
- Resmî CMS uyum matrisi, güvenilir yayın tasarımı ve küçük görevler hazır.
- Yerel manifest path/mode/byte politikası ve negatif testler eklendi. Uygulama
  render akışı, dört konum ve tasarım kaynakları değişmedi.

| Kontrol                    | Sonuç                                       |
| -------------------------- | ------------------------------------------- |
| TypeScript strict          | PASS                                        |
| ESLint / Prettier          | PASS; sıfır lint uyarısı                    |
| Vitest                     | **64/64**, 10 dosya; 39 yeni politika testi |
| Production static build    | PASS; out/ 68 dosya ve noindex true         |
| Static HTTP                | **3/3**                                     |
| Playwright / sistem Chrome | **36/36**; gerçek out/ statik sunucusu      |
| Responsive regresyon       | **320, 393, 768, 1280 px**                  |

Çalıştırılan komutlar:

```bash
npm run check
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

Yeni politika; izinli veri yolları, kod/config/secret yollarının reddi, traversal,
mode/symlink/submodule, silme/rename, byte/adet/toplam sınırı, bozuk manifest ve
hata metnindeki log satırı enjeksiyonu için testlidir. Şema/medya/harici yayın testi değildir.

İlk typecheck üretilmiş duplicate tip kopyalarında durdu. Kopyalar kaynaklara
karışmadan `/private/tmp/bal-v5-generated-copies-l3t_twe_` içine taşındı ve son tam
tur başarıyla geçti. Tip kuralları gevşetilmedi.

## WARNING

- Public mevcut durumdur; Public/Private tercihi henüz yanıtlanmadı. Hesap planı ve
  gerçek branch protection/secret ayarları yetkili bağlantıyla okunmadı.
- CMS'de ayrıntılı RBAC, editöre özel branch lock veya native boyut/piksel/EXIF
  kontrolü doğrulanmadı. E-posta collaborator tek başına tüm yayın güvenliği değildir.
- CMS kaynak kurulum manifesti geniş izinler istiyor; hosted gerçek kurulum izni
  görülmedi. main bypass yokluğu ve en az yetki tamamlandı denmez.
- JSON migration/.pages.yml/App/davet/aktif Actions/Pages yok. Yeni helper yalnız
  manifest ön kontrolüdür; JSON/medya decode/yetki/atomik merge doğrulayıcısı değildir.
- Tam otomatik save sonrası yayın henüz kanıtlanmadı. Güvenli alternatif ve
  GITHUB_TOKEN tetikleme/Private plan sınırlamaları SECURITY belgesindedir.
- Gerçek logo, fotoğraf, ürün listesi, şube kimliği, sosyal hesap ve domain eksikleri sürer.
- Yeni WebKit/Firefox/fiziksel cihaz veya axe taraması çalıştırılmadı; önceki kısıtlar sürer.

## FAIL

Son toplu doğrulamada başarısız test veya açık yerel hata yok. İlk generated tip
sorunu giderilerek tüm kontroller tekrar geçti. Harici entegrasyonlar çalıştırılmadı;
başarılı olarak raporlanmadı ve hiçbir güvenlik kapısı kaldırılmadı.

## Kanıtlar, Git ve sıradaki iş

Snapshot: /private/tmp/bal-v5-start-epqoprmo/source.tar.gz. Güncel anonim repo
metadata: /private/tmp/bal-v5-github-repo-latest.json. Resmî kaynak linkleri
CMS_SETUP/SECURITY/DEPLOYMENT belgelerindedir.

Yeni kod: src/lib/content-change-policy.ts ve test dosyası. Diğer değişiklikler
kurallar, plan ve rehberlerdir; hepsi commit edilmemiştir. Remote/branch/push/App/
davet/deployment yapılmadı. İlk sıradaki uygulama önerisi: altı kategori JSON pilotu.
Ürün sahibi şu an Public/Private tercihini ve planı değerlendirebilir; henüz gerçek
CMS ekranı veya dış preview test edilemez.

Playwright HTML: `playwright-report/index.html`; son durum `test-results/.last-run.json`.
Build kanıtı `.next/static-export-report.json`. Bunlar ignore kapsamındadır.
Değişen kaynaklar: `AGENTS.md`, `README.md`, `plan.md`, mimari/yol haritası/içerik/
kalite belgeleri, tarihsel `PHASE4_PLAN.md`, yeni beş CMS/yayın/güvenlik/geri alma/
editör rehberi ve iki yerel policy dosyası. Uygulama render/veri ve eski testler değişmedi.
