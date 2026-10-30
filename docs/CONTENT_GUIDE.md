# Statik içerik düzenleme rehberi

İçeriklerin tek kaynağı `src/content/` dizinidir. Codex'e doğrulanmış yeni bilgiyi
vermek ve ilgili kaydı güncellemesini istemek yeterlidir. Her değişiklik yeniden
build ve doğrulama gerektirir; tarayıcıdan yönetim paneli veya runtime veri kaynağı yoktur.

## Kaynaklar

| Dosya           | Düzenlenen içerik                                        |
| --------------- | -------------------------------------------------------- |
| `categories.ts` | Kategori id/slug/ad/açıklama/sıra/yayın/görsel           |
| `products.ts`   | Ürün id/slug/categoryId/ad/açıklama/görsel/sıra/yayın    |
| `branches.ts`   | Fiziksel şubeler, koordinatlar ve doğrulama durumu       |
| `site.ts`       | Marka adı, slogan, navigasyon, logo; türetilmiş sayımlar |
| `social.ts`     | Doğrulanmış Instagram/WhatsApp adresleri; yokken null    |
| `gallery.ts`    | Gerçek marka/mağaza fotoğrafları                         |

`src/features/*/data.ts` ve `src/config/site.ts` ikinci veri kaynağı değildir.
Buralara kopya kayıt eklemeyin. Sözleşmeler `src/types/content.ts`, doğrulama
`src/content/validation.ts` ve `content.server.ts` içindedir.

## Ürün veya kategori ekleme

1. Ürün sahibinin gerçek ad/açıklama/görsel verisini alın. Uydurma ürün yayımlamayın.
2. Kategori için benzersiz `id`, küçük ASCII `slug`, ad, açıklama, `sortOrder`,
   `status: 'draft' | 'published'` ve nullable görsel ekleyin.
3. Ürün için `products.ts` listesine aynı alanlar, `categoryId` ve `images` ekleyin.
   `categoryId` mevcut kategori id'si olmalı; yayımlanmamış kategorinin ürünü görünmez.
4. Yayımlamak için gerçek bilgiyi doğrulayıp status published yapın. Fiyat alanı yoktur.
5. Tek kaynak değişikliği sonrasında `npm run check` ve statik E2E çalıştırın.

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
Status published olunca config detay şablonunu etkinleştirir ve build URL üretir.
Şube kimliğini doğrulamadan bu bayrağı değiştirmeyin. Sadece koordinat verilmesi
verified olmak için yeterli değildir. LocalBusiness şeması bu fazda hiç üretilmez.

Detay export mekanizmasını gerçek içeriğe dokunmadan sınamak için:

```bash
node scripts/test-branch-export.mjs
```

Bu test geçici kopyada açıkça sentetik şube ekler, build logunu ve çıktıyı geçici
dizinde bırakır. Gerçek out/ içerisine örnek şube yayımlamaz.

## Fotoğraf ve logo

Gerçek, kullanım hakkı bulunan dosyaları `public/images/` altında gruplandırın:
`brand/`, `categories/`, `products/`, `branches/`, `gallery/`. Logo için SVG/PNG
kabul edilir; fotoğraflarda önceden optimize edilmiş WebP ve tercihen AVIF kullanın.
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
