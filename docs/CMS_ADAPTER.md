# Faz 4.1-c5 — Pages CMS alan eşlemesi ve medya adaptörü

7 Kasım 2026. **Yerel prototip tamamlandı; hosted CMS, GitHub aktarımı ve Cloudflare
kurulmadı.** Gerçek kabul senaryoları [CMS_ACCEPTANCE](CMS_ACCEPTANCE.md) içindedir.

## Uyumluluk ve tek kaynak

JSON dosya/klasör düzeni Pages CMS ile uyumludur. Ancak **ham CMS kaydı mevcut
strict uygulama sözleşmesi değildir**: UUID prefix'i, boş/null alanlar ve medya
ölçüleri için trusted candidate dönüşümü gerekir. `.pages.yml` aynı content yollarını
hedefler. İkinci düzenlenebilir içerik deposu eklenmedi. Canonical main verisi mevcut
strict loader'larla okunur; loader'lar gevşetilmedi. Raw CMS verisi doğrudan build
edilip production'a gönderilmez.

| Alan        | CMS formu                                                                  | Trusted candidate davranışı                                                                                            |
| ----------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Ürün        | Türkçe ad/açıklama, kategori seçici, fotoğraf listesi, sıra/durum          | Gizli native UUID editorKey + filename → kalıcı product-ID; yeni slug otomatik, sonraki ad değişimi slug'ı değiştirmez |
| Kategori    | Ad/açıklama, opsiyonel fotoğraf, sıra/durum                                | Altı mevcut ID/slug korunur; yeni kategori açma bu prototipte teknik işlem                                             |
| Şube        | Ad/açıklama, nullable adres/telefon/saat/WhatsApp, fotoğraflar, sıra/durum | ID/slug/contentKind/koordinat/Maps değişimi reddedilir; verified kimlik değişimi mevcut hash onayı ister               |
| Galeri/hero | Fotoğraf seçici, Türkçe alt, kullanım alanları, sıra/durum                 | Dosya adından gallery-ID; gerçek ölçüler otomatik; hero/ortak/şube galerisi mevcut render sistemine gider              |
| Beş sayfa   | Nested object, string/text ve görünen CTA yazıları                         | Mevcut strict sayfa şemaları; HTML escape, yapı/rota/CSS/teknik SEO değişmez                                           |
| Site/sosyal | Marka/footer/iletişim ve resmî URL açıklamaları                            | Boş iletişim null; doğrulama işaretleri UI'de yok ve candidate yükseltmeyi reddeder                                    |
| Duyuru      | Başlık/açıklama, durum/sıra, opsiyonel fotoğraf ve tarih seçici            | announcement-ID/slug otomatik; açık saat dilimi UTC'ye normalize edilir; statik tarih filtresi korunur                 |

`.pages.yml` 5 koleksiyon ve 7 dosyayı iki grup altında sunar: toplam 12 form.
Yalnız ürün/galeri/duyuru oluşturulabilir; rename/delete kapalıdır. Mevcut fiziksel
şube ve kategori kimliğini artırma teknik onay sürecidir; bu durum formda gizlenmez.
Fotoğraf içindeki sıra/yayın listelerde düzenlenebilir; opsiyonel tek kapak nesnesi
fotoğraf/alt alanlarını sunar ve ebeveynin yayın durumunu izler.

### ID ve slug

Resmî UUID alanı otomatik UUID v4 üretir; mevcut product-... veya location-1 değeri
UUID alanına bağlanamaz. Ayrı, gizli `editorKey` form anahtarı kullanılır. Filename
şablonu `product-{fields.editorKey}.json` (galeri/duyuru kendi prefix'i), filename
input false'tur. Ali Bey kimlik, slug veya dosya yolu girmez. Canonical ID dosyanın
kalıcı stem'idir. Slug ilk kayıtta aynı güvenli stem'den türetilir; ürün için yeni
detay rotası eklenmez. editorKey canonical kayıttan çıkarılır; ikinci registry değildir.
Native hidden/filename ayarı yetki değildir: yanlış UUID, dosya/ID veya slug
uyuşmazlığı trusted adaptörde/strict şemada ayrıca reddedilir.

### Boş alanlar ve kaydetme

İncelenen upstream sanitizeObject, null/boş string/boş liste/boş nesne anahtarlarını
siler. settings.content.merge true, yönetilmeyen ID/koordinat/kimlik alanlarını
saklamaya yardımcı olur; güvenlik yetkisi sağlamaz. Nesneler recursive merge edilir,
diziler değiştirilir. Adaptör yalnız bilinen opsiyonelleri null/[]'a döndürür; zorunlu
ad/açıklama/durum/ref eksikliği fallback üretmez. Korunan nullable slug silinmişse
trusted null geri gelir; değişmiş dolu slug reddedilir. Yeni kaydın teknik slug'ı
önceki candidate'a geçmiş fakat CMS dalına henüz senkronize olmamışsa trusted slug
korunur. Canonical sözleşmeye girmeyen keyfi alanlar reddedilir.

Fotoğraf seçimi native image alanıdır: form state public/images/... yolunu taşır,
upstream write fonksiyonu /images/... URL'si yazar. Üründe object list kullanılır;
string path listesi MediaAsset listesi gibi kabul edilmez. Alt açıklamasını insan
yazar; piksel ölçüsü/metadata/ID girmez. Aynı URL'de mevcut medya ID/varyantları
korunabilir; fotoğraf değişince eski responsive varyantlar taşınmaz. Yeni responsive
varyantlar/resize otomatik üretilmez.

## Çalışan medya akışı

Seçim → tüm raw dosyalarda mevcut MIME/imza/full decode/path/symlink/byte/pixel
kontrolleri → auto-orientation ve EXIF/XMP/IPTC/ICC'siz re-encode → otomatik gerçek
width/height/medya ID → strict içerik/ref/kimlik/benzersizlik doğrulaması → ayrı
candidate verisi → mevcut npm build pipeline'ı.

- JPEG/PNG/WebP/AVIF; SVG kapalı. 5 MiB dosya, 20 MiB toplam, 128 dosya,
  24 MP, 8000 px sınırları korunur. Hatalı raw/orphan dosya da paketi durdurur.
- Boyutu eski fotoğraftan kalmış sayısal metadata bu açık adaptör adımında yeniden
  ölçülür. Uygulamanın normal strict loader'ı yanlış metadata'yı hâlâ reddeder.
- Yeni medya ID'si owner/slot/URL SHA-256 özetiyle üretilir; tüm ebeveynler arasında
  mükerrer ID yine reddedilir. Galeri ID'si kalıcı dosya adına bağlıdır.
- Kaynaklar yerinde değiştirilmez. Ayrı/boş output zorunludur; source/baseline içinde
  output veya dolu/symlink output reddedilir. Başarısız hazırlığın çıktısı yayımlanmaz.
- Candidate raw ve draft fotoğrafları da temiz tutar; üretim out/images yalnız
  published referansları alır. Draft/orphan içerik HTTP üzerinden sunulmaz.
- Parmak izi bir içerik kanıtıdır, Git SHA/atomik merge/branch protection yerine geçmez.

Teknik araç (Ali Bey'in çalıştıracağı komut **değildir**):

```bash
npm run cms:config:check
npm run cms:prepare -- /absolute/source-snapshot /absolute/trusted-baseline /absolute/empty-candidate
node scripts/test-cms-roundtrip.mjs
```

Output yalnız content/, public/images/ ve candidate-report.json içerir; site kodu
kopyalamaz/çalıştırmaz, Git veya network yazmaz. Gerçek CI bu veriyi **üç yönlü farkı
çözülmüş güvenilir main candidate'ına** aktaracak. Bu araç tek başına merge aracı
değildir: source snapshot'ını main üstüne kör kopyalamak eski metinleri geri alabilir.
Diff/path/mode/byte envanteri, exact M/C/candidate SHA, conflict/race/drift kapıları,
source dalına canonical senkronizasyon ve PR/required checks ayrıca kurulup sınanmalı.
İncelenmemiş source branch'in script/paket/workflow'u çalıştırılmamalıdır.

### İletişim ve şube güvenliği

CMS formu verified işaretlerini veya branch-identity.ts dosyasını sunmaz. Adaptör
trusted baseline'a göre verified yükseltmesini reddeder; mevcut onaylı telefon/
e-posta/sosyal URL değişirse yeni değer onaysız kalır. Ürün sahibi doğrulamasıyla
teknik onay gerekir; UI hidden veya URL biçimi sahiplik kanıtı değildir.
Location kayıtlarında ad/adres girilmesi verified yapmaz. Şube onay hash kapısı,
404/sitemap/LocalBusiness ayrımı korunur; şu an dört kayıt location'dır.

## EXIF: kaynak Git blob'u ve candidate farklıdır

**Hosted CMS için upload öncesi EXIF temizliği garanti edilemiyor.** İncelenen
media API dosya türünde extension kontrolünden sonra gönderilen base64 içeriği
GitHub'a yazar; desteklenen config'te pre-upload transform hook'u yoktur. Native
rename yalnız dosya adıdır. Bu adaptör Git'e zaten yazılmış raw blob'un geçmişini
veya mahremiyetini geriye dönük temizlemez.

| Seçenek                                                                  | Kullanıcı deneyimi                                    | Sınır / karar                                                                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Hosted CMS + raw upload + trusted sanitize                               | Ali Bey doğrudan seçer, piksel girmez                 | Source EXIF CMS/GitHub'a gidebilir. Public repo'da gizlilik garantisi yok; karar verilmeden gerçek fotoğraf yüklenmemeli    |
| Private repo + aynı akış                                                 | Aynı basit editör akışı                               | Raw EXIF yetkili hesap/App'lerde kalır; pre-upload temizlik değildir. GitHub planı ve main koruma desteği ayrıca doğrulanır |
| Teknik sorumlunun önceden temizlediği onaylı medya kütüphanesinden seçim | Ali Bey yalnız hazır dosyayı seçer, komut çalıştırmaz | Yeni telefon fotoğrafı self-service upload hedefini tamamlamaz; native UI upload kısıtı yetki olarak varsayılmaz            |
| Ön-upload dönüşümü olan ayrı çözüm / özelleştirilmiş CMS                 | Uygun servisle seçim basit tutulabilir                | Hosted config ile varmış gibi sunulamaz. Ayrı mimari/onay/entegrasyon gerekir; bu tur backend/servis kurulmadı              |

Ali Bey'e manuel terminal/EXIF temizleme komutu verme çözümü benimsenmedi. Kaynak
Git'e yazılmadan temiz olsun şartı kesin ise mevcut hosted-only upload akışı bu
şartı karşılamaz; harici bağlantı öncesi teknik mimari kararı gerekir.

## Resmî doğrulama ve yerel testin sınırı

Resmî Pages CMS 2.1.8 kaynak commit'i `6f4e860a35d934406580287e7042e5e111e207a1`
7 Kasım'da salt okunur incelendi. Pinlenmiş MIT lisanslı config-schema.ts fixture'ı
hash doğrulamasıyla gerçek Zod v3 uyumluluk modunda çalıştırılır; yalnız Zod ve
field registry importları yerel eşdeğerlerine bağlanır. Negatif bilinmeyen root
anahtar ve bilinmeyen field type kontrolleri de var. Resmî options şeması alt alanları
sıkı doğrulamaz; proje config eşitliği ve semantic unit testleri bunu tamamlar.
İlk view.sort/order yazımı şema tarafından reddedildi; gerçek array + view.default
biçimine düzeltildi. Geçersiz yapılandırma teslim edilmedi.

js-yaml 4.3.2 ve zod 4.6.7 zaten lockfile'da kuruluydu; yalnız gerekli YAML/resmî
şema doğrulaması için exact doğrudan dev bağımlılık olarak kaydedildi. Paket
sürümleri/runtime bağımlılıkları değiştirilmedi; .generated araçları Git'e girmez. .gitattributes yalnız hash'li upstream txt
fixture'larının byte/whitespace biçimini korur; uygulama whitespace kuralları değişmez.

Round-trip gerçek upstream initializeState/deepMap/sanitizeObject ve image write
fonksiyonlarını hash'li kaynak fixture'larından kullanır. Merge davranışının yerel
karşılığı arrays-replace/recursive-object'tir; auth, reference arama API'si, date
picker UI, GitHub upload/save ve hosted sürüm **test edilmiş sayılmaz**. Kategori
ID string'i native reference sözleşmesini temsil eder; gerçek picker seçimi kabul
listesinde bekler. Tarih girdisi native explicit-offset formatıyla temsil edilir.

Yerelde ürün oluşturma/yeniden adlandırma/farklı ölçülü fotoğraf seçimi, ikinci
kaydetme ve metadata, kategori/şube/metin/duyuru düzenleme, draft gizliliği, EXIF
kaynak/çıktı ve gerçek static HTML/Chrome dört genişlik doğrulandı. Orijinaller
byte eşit kaldı; bu sonuç **hosted editör veya otomatik yayın başarısı değildir**.

Kaynaklar: [alanlar](https://pagescms.org/docs/configuration/content/fields/),
[UUID](https://pagescms.org/docs/configuration/fields/uuid/),
[filename](https://pagescms.org/docs/configuration/content/filename/),
[reference](https://pagescms.org/docs/configuration/fields/reference/),
[image](https://pagescms.org/docs/configuration/fields/image/),
[date](https://pagescms.org/docs/configuration/fields/date/),
[settings merge](https://pagescms.org/docs/configuration/settings/),
[config şeması](https://github.com/pages-cms/pages-cms/blob/6f4e860a35d934406580287e7042e5e111e207a1/lib/config-schema.ts),
[kaydetme/upload API](https://github.com/pages-cms/pages-cms/blob/6f4e860a35d934406580287e7042e5e111e207a1/app/api/%5Bowner%5D/%5Brepo%5D/%5Bbranch%5D/files/%5Bpath%5D/route.ts).
