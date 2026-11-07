# Kurumsal metin, iletişim ve duyuru sözleşmesi — Faz 4.1-c4

7 Kasım 2026. Bu belge çalışan yerel veri mimarisini anlatır. Pages CMS ekranı,
.pages.yml, hesap, CI aktarımı, zamanlayıcı veya Cloudflare yayını kurulmadı.

## Tek kaynak ve dosyalar

```text
content/
  pages/
    home.json
    about.json
    contact.json
    catalog.json
    branches.json
  settings/
    site.json
    social.json
  announcements/
    .gitkeep
```

Sayfa/ayar kaynakları tam olarak bu yedi dosyadır; yeni/keyfi dosya kabul edilmez.
Her duyuru bir `announcement-<id>.json` dosyasıdır. Şu an gerçek duyuru 0; boş
koleksiyon geçerlidir. Kategori/ürün/şube/galeri kaynakları aynı yerlerinde kalır.
TS erişim modülleri ikinci bir düzenlenebilir metin listesi tutmaz.

## İleride Ali Bey'in düzenleyebileceği işletme alanları

| Kaynak        | Alanlar                                                                                                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| home          | SEO başlık/açıklama; hero üst başlık, ana ve kırmızı başlık parçaları, iki açıklama, CTA yazıları; görsel bekleme metinleri; kategori/marka hikâyesi/şube/galeri/sosyal bölüm başlık ve açıklamaları; duyuru bölüm etiketi |
| about         | SEO, sayfa girişi, marka hikâyesi, devam metni, slogan, kategori alt bölüm başlığı ve CTA                                                                                                                                  |
| contact       | SEO, sayfa girişi, ziyaret/konum açıklamaları, şube CTA yazısı, dijital iletişim bölümü                                                                                                                                    |
| catalog       | SEO, sayfa girişi, genel kategori açıklaması, ürün bekleme ve mağazaya davet metni                                                                                                                                         |
| branches      | SEO, sayfa girişi, şube listesi ve eksik bilgi açıklaması, galeri başlık/açıklaması                                                                                                                                        |
| site          | Marka adı/slogan/konum, kurumsal açıklama, paylaşım görseli metinleri, nullable merkezi telefon/e-posta ve doğrulama işaretleri; footer açıklaması, ziyaret başlığı/CTA/sosyal not/imza                                    |
| social        | Instagram/WhatsApp nullable URL, verified, açıklama ve eylem yazısı                                                                                                                                                        |
| announcements | id, slug, title, description, status, sortOrder; isteğe bağlı image, startsAt, endsAt                                                                                                                                      |

Bu bir **hazır veri sözleşmesidir**; Ali Bey henüz panelden düzenleme yapamaz.
Fotoğraf, ürün veya metin için gerçek CMS → otomatik kontrol → korunan aktarım →
Cloudflare üzerinde kaynak SHA/içerik kabulü ayrıca kanıtlanmalıdır.

## Kodda kalanlar

- Rotalar, sabit CTA hedefleri, menü/ARIA etiketleri, filtre/geri dönüş/hata/404
  metinleri, eksik fotoğraf/telefon/saat/harita durumları ve genel UI eylemleri.
- Hero kırmızı span'i, satır kırılımı, tipografi, boşluklar, bileşen yapısı ve renkler.
  Uzun kelimeler body overflow-wrap ile kırılabilir; CSS editöre açılmaz.
- Geçici tipografik marka çizimi ve ikon geometrisi; gerçek logo hâlâ bekleniyor.
- Şube sayısı/koordinat/kimlik güvenliği, canonical/domain/noindex/sitemap ve env.
  İşletme SEO title/description alanı bu teknik yayın yetkisini değiştirmez.
- Yıl/telif ve teknik build zamanı. Bütün işletme geçmişi veya kuruluş yılı uydurulmaz.

CTA'nın görünen yazısı değişebilir; hedefi JSON'dan serbestçe girilemez. Zorunlu
beş temel sayfanın status alanı yoktur; bu faz sayfa taslak/önizleme sistemi kurmaz.
Draft/published, diğer koleksiyonlardaki mevcut davranış ve yeni duyurular içindir.

## Düz metin ve değişkenler

Yapısal anahtarlar sabittir; tüm alanlar şemadaki adlarıyla zorunludur. Bilinmeyen,
eksik, yanlış tipli, boş veya sınırı aşan alan build'i durdurur. Sayfa/ayar metinleri
HTML/Markdown değildir; etiketler React tarafından metin olarak escape edilir.
Raw HTML, script çalıştırma, MDX, sınıf/stil veya keyfi bağlantı alanı yoktur.

Ortak sınırlar: CTA/etiket 64, başlık 120, hero başlık parçası 60, paragraf 1200,
SEO açıklama 320 karakter. Marka adı 80, slogan 100; site açıklaması 320, paylaşım
alt metni 120, konum/paylaşım konumu 80. Telefon en fazla 30, e-posta 254,
sosyal URL 500 karakterdir. Geçersiz kontrol karakterleri reddedilir.

Mevcut metindeki otomatik sayımlar için yalnız şu sınırlı değişkenler vardır:
`{name}`, `{slogan}`, `{location}`, `{siteDescription}`, `{branchCountText}`,
`{branchCountCapitalized}`, `{knownLocationCountText}`. Bunlar kod çalıştırmaz;
merkezi veriden düz metin üretir. Şube sayısını elle yazmak yerine mevcut
şablonu koruyun. İsim/slogan/konum/telefon/e-posta/URL ve duyuru metni değişken
kabul etmez. Kurumsal açıklama kendisine referans veremez. Sayfa/sosyal/footer ve
site açıklamasında çözülmüş metinler de uzunluk sınırlarını tekrar geçer.

Her JSON normal dosya, UTF-8 ve en fazla 256 KiB olmalıdır. Symlink/traversal,
bozuk JSON veya kaynak yokluğu fallback'e dönmez. JSON yalnız server/build'de
okunur; katalog istemcisi gerekli düz metin props alır. Kaynak JSON hosta kopyalanmaz.
JSON düzenlemesinden sonra dev sunucusunu yeniden başlatıp sayfayı yenileyin;
otomatik HMR varsayılmaz. Yayına yansıması yeniden statik build gerektirir.

## Telefon, e-posta ve sosyal bağlantılar

Bilinmeyen gerçek telefon/e-posta ve iki sosyal URL **null**, verified alanları
**false** kalır. Uydurma değer eklenmez. Değer biçimi doğrulansa bile verified
false ise tel/mailto/sosyal bağlantı üretilmez. verified true + null hatadır.
İletişim değerleri yalnız gerektiği yerde render edilir; site nesnesiyle topluca
istemciye gönderilmez. Bu işaret insan teyididir, otomatik sahiplik kanıtı değildir.

Telefon 7–15 rakam ve güvenli boşluk/parantez/tire biçimi; e-posta güvenli temel
adres biçimi kullanır. Tel hedefi biçimden temizlenir, mailto değeri URL encode edilir.
Sosyal URL HTTPS olmalı; kimlik bilgisi/fragment/özel port ve yanlış host reddedilir.
Instagram yalnız instagram.com/www.instagram.com profil yoludur; login/reel/post
ve query yönlendirmeleri kapalıdır. WhatsApp yalnız wa.me/<uluslararası-rakamlar>
veya api.whatsapp.com/send?phone=<rakamlar> (&text isteğe bağlı) biçimidir.
URL doğrulaması işletmenin bu hesabı kullandığını kanıtlamaz.

## Duyurular: statik yayın ve tarih

Zorunlu alanlar: id, slug, title, description, status, sortOrder. ID `announcement-`
öneki ve küçük ASCII/tireli ad; dosya adı ID ile aynı. Slug küçük ASCII/rakam/tire,
ID ve slug benzersiz; sıra sıfır veya pozitif güvenli tam sayıdır. Başlık 120,
açıklama 1200 karakter, düz metin; draft/published dışında durum yoktur.

Opsiyonel image mevcut strict MediaAsset'tir; alt/gerçek ölçü/varyant ve decode/
MIME/limit/EXIF'siz out güvenliği [MEDIA_GUIDE](MEDIA_GUIDE.md) ile aynıdır. Resim
başka bir registry'ye kopyalanmaz. Draft medya görünmez; ham dosya yine doğrulanır.

startsAt/endsAt null veya gerçek ISO UTC `YYYY-MM-DDTHH:mm:ss[.sss]Z` zamanıdır.
Bitiş başlangıçtan sonra olmalıdır. Saat dilimi dönüşümü açık yapılır; tarih-only
ve hayalî takvim günü kabul edilmez. Filtre:

- Yalnız published; başlangıç varsa build anına eşit/önce.
- Bitiş varsa build anından sonra; bitiş anı hariçtir.
- Sonuç sortOrder, eşitlikte sabit ID sırasını korur. Dışlananlar HTML/RSC/JS ve
  yayımlanan medya dosyalarına girmez. Duyuru kalmazsa ana sayfa bölümü render edilmez.

`npm run build` güvenilir süreçte tek `SITE_BUILD_AT` canonical milisaniyeli UTC
anı üretir. Aynı an Next render/filtre ve medya export'unda kullanılır; rapor
.generated altında kalır. İçerik bu sırada değişirse fingerprint reddi build'i durdurur.
SITE_BUILD_AT CMS alanı veya public environment değişkeni değildir.

**Statik sayfa saat ilerleyince kendiliğinden değişmez.** Başlangıç/bitiş tarihinin
yayına yansıması yeni başarılı build/deployment gerektirir. Zamanlanmış yeniden
build bu fazda kurulmadı; gerekiyorsa ayrıca yetkilendirilip tasarlanmalıdır.
Yeni duyuru detay rotası/SEO schema veya ziyaretçi API'si eklenmedi.

## Çalıştırılabilir kabul ve kalan işler

`npm run check` ve `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` mevcut statik siteyi
kontrol eder. `node scripts/test-editorial-export.mjs` izole kopyada JSON başlık ve
Hakkımızda değişimi, üç negatif build, zararlı HTML, iletişim gizleme ve duyuru
status/tarih filtresini gerçek çıktı/tarayıcıda doğrular. Test verisi yayımlanmaz.

c5 önerisi: CMS alan eşleme/round-trip planını ve fotoğraf yolu → decode edilmiş
metadata adaptörünü küçük bir yerel iş olarak ele almak. Kullanıcıdan piksel veya
JSON yazmasını istemeyen akış ayrıca kurulmalıdır. Bu tur .pages.yml/hesap/CI/
push/deployment yapılmadı; sıradaki faz kendiliğinden başlatılmaz.

## C5 güncellemesi

C5 yerel .pages.yml ve trusted normalizasyonu hazırlar. Ali Bey'e gösterilecek alanlar
Türkçedir; ID/slug/ölçü/verified işaretleri/teknik SEO form değildir. CMS'nin kaldırdığı
boş/null anahtarlar adapter'de yalnız bilinen opsiyoneller için geri normalize edilir.
Telefon/e-posta/sosyal onayı yükseltmek teknik doğrulama gerektirir; onaylı değer
sonradan değişirse onayı düşer. Gerçek panel akışı henüz kurulmadı. C4'teki c5 önerisi
bu yerel görevle ele alındı; gerçek kabul CMS_ACCEPTANCE.md içindedir.
