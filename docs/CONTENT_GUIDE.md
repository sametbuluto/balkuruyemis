# Statik içerik düzenleme rehberi

Kategori, ürün, şube, galeri ve duyuruların tek kaynağı ilgili `content/` JSON
koleksiyonlarıdır. Beş sayfanın işletme metinleri `content/pages/`, marka/iletişim
ve sosyal bilgiler `content/settings/` altındadır. `src/content/` yalnız tipli
erişim, şema ve teknik kuralları tutar; ikinci düzenlenebilir metin listesi yoktur. Codex'e doğrulanmış yeni bilgiyi
vermek ve ilgili kaydı güncellemesini istemek yeterlidir. Her değişiklik yeniden
build ve doğrulama gerektirir; tarayıcıdan yönetim paneli veya runtime veri kaynağı yoktur.

## Güncel medya — Faz 4.1-c3

Galeri JSON, dosya güvenliği, EXIF temiz üretim çıktısı ve CMS alan planı:
[MEDIA_GUIDE](MEDIA_GUIDE.md). Embedded görseller kendi ürün/kategori/şube kaynağında
kalır; status/sortOrder isteğe bağlıdır. Galeride status/sortOrder/usages zorunludur.
Boş galeri geçerli; sahte fotoğraf yok. Aşağıdaki eski faz kayıtlarında decode/upload
kurulmadığı belirtilen yerler o fazların kapsamıdır; güncel decode/çıktı kontrolü c3'tedir.

## Faz 4.1-b — Kategori JSON pilotu

Altı kategori id/slug/ad/açıklama/image/sortOrder/status alanlarıyla birebir taşındı.
Her dosyada tek kayıt vardır; dosya adı tam olarak `<id>.json` olmalı. Örnek gerçek
kaynak: `content/categories/category-kahve.json`. TypeScript erişim modülü kategori
literal listesi içermez. Diğer içerik tipleri ve `.pages.yml` bu pilotta değiştirilmedi.

- Zorunlu alanlar: id, slug, name, description, image (yoksa null), sortOrder, status.
- id: `category-` öneki ve küçük ASCII kelimeler/tire; dosya adıyla eşleşir.
- slug: küçük ASCII harf/rakam ve tek tireli kelimeler. ID ile aynı olmak zorunda değildir.
- name/description: boş olmayan UTF-8 metin; yayın durumu yalnız draft/published.
- sortOrder: sıfır veya daha büyük güvenli tam sayı. ID ve slug koleksiyonda benzersizdir.
- image null veya mevcut MediaAsset sözleşmesidir. Alt/pozitif gerçek width/height ve
  yerel `/images/` yolu gerekir; varyant nesneleri de strict doğrulanır. Bu pilot görsel
  decode/optimizasyonu veya piksel ölçümü yapmaz; dosya varlığı mevcut root denetimindedir.
- Bilinmeyen/eksik alan, bozuk JSON, yanlış tip/ID, mükerrer slug/ID, geçersiz UTF-8,
  symlink ve JSON dışı dosya build'i durdurur. Dosya başına üst sınır 256 KiB'dir.

Yeni kategori için bu dizine yeni, benzersiz ID'li bir JSON eklemek yeterlidir;
TS import listesi veya manifest güncellenmez. `.DS_Store` ve `.gitkeep` görmezden
gelebilir; alt klasör ve diğer dosyalar kabul edilmez. Boş/kayıp dizinde fallback yoktur.
Draft kategori grid/filtre/footer içinde görünmez ve URL seçimi bilinmeyen kategori
mesajına döner. Fiziksel silme için 4.1-a güvenlik politikası gelecekteki aktarımda
ayrıca geçerlidir; bu pilot o CI hattını kurmaz.

`categories.server.ts` build/RSC katmanında okur; saf `category-schema.ts` unknown
JSON'u doğrular. `getPublishedCategories` ve root denetimi her sunucu okumasında güncel
kaynağı yükler. Eski productCategories import'u için yalnız bellekteki tipli snapshot
korunur; ikinci düzenlenebilir liste değildir. Client filtresi zaten server props
kullandığı için tarayıcıya fs veya kategori API'si eklenmez. `out/` kaynak JSON'larını içermez.

JSON dosyaları Next'in TS modül grafiğinde olmadığı için otomatik HMR varsayılmamalı;
geliştirmede JSON değişikliğinden sonra sunucuyu yeniden başlatıp sayfayı yenileyin. Statik yayına yansıması
her zamanki gibi yeni build gerektirir. Yeni npm komutu veya ön işleme manifesti yoktur.

Ek export sözleşme kontrolü:

```bash
node scripts/test-category-export.mjs
```

Gerçek kaynaklara dokunmadan geçici proje kopyasında bozuk JSON/şema için iki build
reddi ve draft kategorinin statik çıktıdan dışlanması denenir. Eski/yeni alan eşitliği
bu migration tesliminde ayrıca kaydedildi; gelecekteki meşru CMS içerik değişikliklerini
kalıcı bir sabit hash testiyle engellemiyoruz. Sonuçlar plan.md §15'tedir.

Ürün geçişi Faz 4.1-c1 kapsamındadır; şube geçişi 4.1-c2, galeri/metinler sonraki ayrı işlerdir.
[CMS_SETUP](CMS_SETUP.md).

## Faz 4.1-c1 — Ürün JSON sözleşmesi

Tek düzenlenebilir kaynak `content/products/product-<kalıcı-kimlik>.json` dosyalarıdır.
Gerçek ürün henüz sağlanmadı: dizin yalnız `.gitkeep` içerir, ürün sayısı **0**.
Boş koleksiyon geçerlidir; kayıp dizin veya bozuk dosya sessizce boş listeye dönüşmez.
Test ürünleri yalnız unit fixture'larında ve geçici export kopyalarında bulunur.

| Alan        | Kural                                                                        |
| ----------- | ---------------------------------------------------------------------------- |
| id          | Benzersiz `product-` önekli küçük ASCII/tire kimlik; dosya adı `<id>.json`   |
| slug        | Benzersiz küçük ASCII/rakam ve tek tireli kelimeler                          |
| name        | Boş olmayan Türkçe/UTF-8 ürün adı                                            |
| categoryId  | `content/categories/` içinde strict doğrulamadan geçen gerçek kategori ID'si |
| description | Boş olmayan düz metin; React metin olarak işler                              |
| images      | Zorunlu dizi; görsel yoksa `[]`, varsa strict MediaAsset nesneleri           |
| sortOrder   | Sıfır veya daha büyük güvenli tam sayı                                       |
| status      | Yalnız `draft` veya `published`                                              |

Sekiz alanın tamamı zorunludur; fiyat veya başka bilinmeyen alan kabul edilmez.
Görsel nesnesi id/url/alt/pozitif width/height ve isteğe bağlı strict variants taşır;
null eleman veya yalnız dosya yolu yeterli değildir. Mevcut root denetimi dosyanın
public altında varlığını da kontrol eder. Fotoğraf yükleme, decode/EXIF veya otomatik
boyut/varyant üretimi bu görevde kurulmadı. CMS alanlarının bunlara bağlanması ayrı iştir.

Kategori referansı sabit seçenek listesine değil, her server/build okumasında gerçek
kategori JSON koleksiyonuna karşı denetlenir. Var olan draft kategoriye referans veri
olarak geçerlidir; **ürün ve kategorisi birlikte published olmadıkça** ziyaretçiye gitmez.
Draft ürünün geçersiz kategori referansı da build'i durdurur. ID/slug tekrarları,
bilinmeyen/eksik alan, bozuk JSON/UTF-8, yanlış tip, symlink ve JSON dışı dosya reddedilir.
Dosya başına sınır 256 KiB; `.gitkeep`/`.DS_Store` dışındaki yardımcı dosyaları buraya koymayın.

`products.server.ts` yalnız Node/RSC katmanında yükler, `product-schema.ts` saf strict
validation yapar. Ortak alan/görsel kuralları `content-schema.ts` içinde kategorilerle
paylaşılır. `products.ts` uyumluluk snapshot'ı ve güncel erişim fonksiyonu sunar;
ikinci düzenlenebilir TS listesi değildir. Client yalnız yayımlanmış server props alır;
kaynak JSON ve Node fs client'a/`out/` içine kopyalanmaz. JSON sonrası dev sunucusunu
yeniden başlatın ve sayfayı yenileyin; yayında yeniden statik build gerekir.

Ek kontrol:

```bash
node scripts/test-product-export.mjs
```

Geçici kopyada bozuk JSON, bilinmeyen alan ve geçersiz kategori için üç build reddi;
geçerli published/draft ürünler ve draft kategori için statik HTML/RSC/JS/SEO dışlama
kontrolü yapılır. Aynı izole katalog dört genişlikte tarayıcıyla denenir. Gerçek
kaynak/out değiştirilmez. `.pages.yml` veya çalışan CMS editörü henüz yoktur.

## Kaynaklar

| Dosya                       | Düzenlenen içerik                                        |
| --------------------------- | -------------------------------------------------------- |
| `content/categories/*.json` | Kategori id/slug/ad/açıklama/sıra/yayın/görsel           |
| `content/products/*.json`   | Ürün id/slug/categoryId/ad/açıklama/görsel/sıra/yayın    |
| `content/branches/*.json`   | Fiziksel şubeler, koordinatlar ve doğrulama durumu       |
| `site.ts`                   | Marka adı, slogan, navigasyon, logo; türetilmiş sayımlar |
| `social.ts`                 | Doğrulanmış Instagram/WhatsApp adresleri; yokken null    |
| `content/gallery/*.json`    | Gerçek marka/mağaza fotoğrafları                         |

`src/features/*/data.ts` ve `src/config/site.ts` ikinci veri kaynağı değildir.
Buralara kopya kayıt eklemeyin. Sözleşmeler `src/types/content.ts`, doğrulama
`src/content/validation.ts` ve `content.server.ts` içindedir.

## Ürün veya kategori ekleme

1. Ürün sahibinin gerçek ad/açıklama/görsel verisini alın. Uydurma ürün yayımlamayın.
2. Kategori için content/categories altında ID ile eşleşen tek JSON dosyası oluşturun.
   Benzersiz `id`, küçük ASCII `slug`, ad, açıklama, `sortOrder`,
   `status: 'draft' | 'published'` ve nullable görsel ekleyin.
3. Ürün için content/products altında `<id>.json` oluşturup sekiz zorunlu alanı ekleyin.
   `images` görsel yoksa boş dizi olmalı; yalnız doğrulanmış gerçek ürün ekleyin.
   `categoryId` mevcut kategori id'si olmalı; yayımlanmamış kategorinin ürünü görünmez.
4. Yayımlamak için gerçek bilgiyi doğrulayıp status published yapın. Fiyat alanı yoktur.
5. Tek kaynak değişikliği sonrasında `npm run check` ve statik E2E çalıştırın.

## Faz 4.1-c2 — Şube JSON sözleşmesi

Dört fiziksel kayıt `content/branches/location-1.json` ile `location-4.json` arasındadır.
Her dosya tek şubedir; dosya adı `<id>.json`, ID küçük ASCII/rakam/tire biçimindedir.
Kimlik eşleşmesi gelince **aynı kaydı ve ID'yi** güncelleyin; ikinci şube oluşturmayın.
ID/slug, aynı koordinat veya normalize edilmiş aynı adres tekrarları reddedilir.
Bu denetim, iki farklı bilinmeyen konumun aynı işletme olup olmadığını dış kaynaktan araştırmaz.

Zorunlu 14 alan: id, slug, name, description, coordinates, googleMapsUrl, address,
phone, openingHours, whatsappUrl, images, sortOrder, status, contentKind.

- Şimdiki dört kayıt location/published; slug/adres/telefon/saat/WhatsApp null, images [].
- location kimlik eşleşmesi bekleyen gerçek konumdur; slug her zaman null kalır.
- verified kimliği ürün sahibince doğrulanmış kayıttır; ad, açık adres ve benzersiz
  slug gerektirir. JSON bayrağı tek başına onay değildir; aşağıdaki teknik kapı zorunludur.
- status draft/published, kimlik türünden ayrıdır. Draft kart/sayım/detay/sitemap'e girmez.
  Yalnız verified + published + eşleşen korunan onay detay üretir.
- coordinates null veya finite latitude [-90,90] / longitude [-180,180]. Yarım nesne reddedilir.
- Harita URL null olabilir; varsa koordinat zorunludur. Sahibin maps.google.com/?q=lat,lon
  ve www.google.com/maps/search/?api=1&query=lat,lon biçimleri HTTPS/host/yol/koordinat
  eşitliğiyle doğrulanır. Kısa linkler koordinatı yerelde doğrulanamadığı için kabul edilmez.
- Telefon null veya 7–15 rakam içeren telefon metni; WhatsApp null veya wa.me numarası /
  api.whatsapp.com/send?phone=... bağlantısıdır. openingHours null veya boş olmayan düz metin.
- images [] veya strict MediaAsset dizisi. İlk görsel mevcut kartta kapaktır; aynı dizi
  detay galerisinde kullanılır. İkinci bir kapak veri kaynağı yok; upload bu fazda kurulmadı.
- Bilinmeyen/eksik alan, bozuk JSON/UTF-8, yanlış tip/değer, JSON dışı dosya,
  symlink/alt klasör ve 256 KiB üstü dosya build'i durdurur. Boş/kayıp dizinde fallback yoktur.

Kimlik onayı `src/content/branch-identity.ts` içinde ID + SHA-256 fingerprint olarak
saklanır. Hash sırası [id, slug, name, address, latitude veya null, longitude veya null].
Onay listesi şu an **boştur**. Kaynak işletme bilgileri yalnız JSON'dadır; onay ikinci
bir adres listesi değildir. Teknik sorumlu ancak ürün sahibinin doğruladığı alanlarla
`branchIdentityFingerprint` kullanarak onay ekler. Kimlik alanı değişirse yeniden onay
ister; telefon/saat/görsel/status düzenlemesi kimlik hash'ini değiştirmez. Gelecekte
editör JSON'u değiştirebilir; bu kimlik kapısı doğrulanmamış değişikliği yayımlamaz.
Bu kaynak 4.1-a içerik izin listesi dışındadır; gerçek GitHub koruması/CI henüz kurulmadı.

`branches.server.ts` yalnız Node/RSC/build katmanında yükler; branches.ts erişim ve
uyumluluk snapshot'ı sunar. root denetimi ve sorgular güncel loader'ı kullanır.
Next config aynı JSON/onay kaynağından detay uzantısını seçer. Örnekler TS tarafında
ayrı kalır. JSON dosyaları ve teknik onay statik hosta kopyalanmaz. JSON değişiminden
sonra dev sunucusunu yeniden başlatın; yayın çıktısı için yeniden build gerekir.
`.pages.yml`, CMS hesabı, upload veya LocalBusiness üretimi bu fazda yoktur.

## Konumlar ve şube kimliği

İşletme sahibinin sağladığı güncel gerçek koordinatlar:

| Geçici ad | Latitude  | Longitude |
| --------- | --------- | --------- |
| Konum 1   | 38.362633 | 27.148943 |
| Konum 2   | 38.374462 | 27.183882 |
| Konum 3   | 38.367344 | 27.148973 |
| Konum 4   | 38.378593 | 27.163704 |

Dördüncü konum çalışma sırasında ayrıca sağlandı; artık bekleyen konum yoktur.
Ad/adres/telefon/saat eşleşmeleri hâlâ beklenir. Ahmet Yesevi, Gediz veya başka
isimlerle kendiliğinden eşleştirme yapılmaz. Koordinatlar reverse-geocode edilmedi.

- `contentKind: 'location'`, `slug: null` gerçek konumu gösterir. Bilinmeyen alanlar null.
- `googleMapsUrl`: sahibin verdiği `https://maps.google.com/?q=latitude,longitude`.
- Yol tarifi `https://www.google.com/maps/dir/?api=1&destination=...` şeklinde
  koordinattan üretilir. Virgül URL-encode edilir; origin cihaz/Google tarafından seçilir.
- API anahtarı, harita embed'i veya konum izni isteyen uygulama kodu yoktur.
- Yeni fiziksel kayıt eklenirse liste, metinler ve sayımlar otomatik güncellenir.
- Konum bilinmiyorsa coordinates ve googleMapsUrl null bırakılır; aktif link oluşmaz.
- `example` sadece test/örnek tasarımdır; gerçek konumlarla aynı gride katılmaz.

Bir konumun gerçek şube kimliği ürün sahibince doğrulandığında **aynı kaydı** güncelleyin:
`contentKind: 'verified'`, gerçek benzersiz slug/ad/adres/açıklama ve sadece bilinen
iletişim alanları. Yeni kopya ekleyip aynı fiziksel şubeyi iki kez saymayın.
Korunan kimlik onayı eşleşip status published olunca config detay şablonunu etkinleştirir ve build URL üretir.
Şube kimliğini doğrulamadan bu bayrağı değiştirmeyin. Sadece koordinat verilmesi
verified olmak için yeterli değildir. LocalBusiness şeması bu fazda hiç üretilmez.

Detay export mekanizmasını gerçek içeriğe dokunmadan sınamak için:

```bash
node scripts/test-branch-export.mjs
```

Bu test geçici kopyada JSON/harita/onaysız kimlik için dört build reddini; onaylı
kimlik yükseltmesini, yeni fiziksel şubeyi, draft dışlamayı, HTTP 404 ve dört
genişlikte detay navigasyonunu sınar. Gerçek kaynak/out içine fixture yayımlamaz.

## Fotoğraf ve logo

Gerçek, kullanım hakkı bulunan dosyaları `public/images/` altında gruplandırın:
`brand/`, `categories/`, `products/`, `branches/`, `gallery/`. Bu fazda SVG kapalıdır; logo için raster PNG/WebP kabul edilir; fotoğraflarda önceden optimize edilmiş WebP ve tercihen AVIF kullanın.
Dosyalar yokken dizin veya sahte görsel üretmek zorunlu değildir.

Önerilen fotoğraf varyantları: 480, 768, 1200 ve yalnızca hero için gerekiyorsa
1600 px. Kaynağı büyütmeyin. Aynı kadraj ve en-boy oranını koruyun. EXIF/konum gibi
gereksiz metadata'yı kaldırın. Başlangıç bütçesi: kart 60–120 KB, hero 150–250 KB;
gerçek içerik geldiğinde görünür kalite ve Lighthouse/LCP ile doğrulayın.
Bunlar ölçülmüş mevcut sonuçlar değil, içerik kabul hedefleridir.

Medya kaydı `id`, `/images/...` yerel URL, anlamlı Türkçe alt, gerçek width/height
ve isteğe bağlı varyantlar içerir. Aşağıdaki yalnızca şema örneğidir; bu dosyalar
projede bulunmaz ve gerçek içerik olarak eklenmemelidir:

```ts
{
  id: 'ornek-medya-sozlesmesi',
  url: '/images/gallery/dosya-1200.webp',
  alt: 'Ürün sahibinin gerçek fotoğrafı tarif eden metni',
  width: 1200,
  height: 800,
  variants: [
    { url: '/images/gallery/dosya-480.avif', width: 480, format: 'image/avif' },
    { url: '/images/gallery/dosya-1200.avif', width: 1200, format: 'image/avif' },
    { url: '/images/gallery/dosya-480.webp', width: 480, format: 'image/webp' },
    { url: '/images/gallery/dosya-1200.webp', width: 1200, format: 'image/webp' },
  ],
}
```

`StaticImage` tarayıcıya kaynakları sunar; otomatik resim dönüştürmez. Sunucu tabanlı
`/_next/image` çağrısı yoktur. Varyantlarda responsive `srcset/sizes`, galeride gerçek
boyut/lazy, kartlarda sabit oran, hero'da eager/high priority korunur.
Varyantsız fallback tek boyutlu dosyadır; performans için hazırlanmış varyantları ekleyin.

Logoyu `brandAssets.logo`, koyu zemin sürümünü `inverseLogo` alanına yazın.
Gerçek logo gelince tipografik PNG ikon/OG çizimlerinin de ayrıca güncellenmesi gerekir;
logo kaydı bu türetilmiş çizimleri otomatik yeniden tasarlamaz.

## Güvenli bağlantılar ve doğrulama

Bilinmeyen URL null kalır; boş string veya `#` ile buton taklidi yapılmaz.
Google Maps/Instagram/WhatsApp için HTTPS ve izin verilen gerçek servis hostları
kullanılır. Build; benzersiz kimlik/slug, kategori referansı, koordinat aralığı ve
Maps eşleşmesi, alt/boyut, varyant formatı ve public dosya varlığını denetler.

```bash
npm run check
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
npm run preview
```

Yerel çıktı http://127.0.0.1:4173 üzerinden incelenir. İçerik düzeltmek deployment
izni anlamına gelmez. Yayın için ayrıca ürün sahibi onayı gerekir.

## Güncel metinler — Faz 4.1-c4

Beş sayfa, site/sosyal ayarlar, alan sınırları, metin değişkenleri, iletişim doğrulaması
ve duyuru tarih/yayın davranışı [EDITORIAL_GUIDE](EDITORIAL_GUIDE.md) içinde.
`node scripts/test-editorial-export.mjs` gerçek içeriklere dokunmadan izole negatif
build ve statik HTML/tarayıcı kabulünü çalıştırır. Gerçek CMS ekranı değildir.
Kaynak JSON değişince dev sunucusunu yeniden başlatın; statik yayında yeniden build gerekir.
