# Mimari — Faz 3 / Static-first

Faz 3 kabul edildi; commit `78df0f7`. V5 hedefi hosted Pages CMS + GitHub/Actions +
Cloudflare Pages'tir; uygulama static export kalır. DB/özel API/custom admin yoktur.
Faz 4.1-a güvenlik hazırlığı korunur. **Faz 4.1-b kategorileri, Faz 4.1-c1 ürünleri tek kaynaklı JSON
mimarisine taşıdı; 4.1-c2 dört şubeyi de JSON kaynağına aldı.** Galeri c3 ile JSON kaynağına, kurumsal metinler/ayarlar/duyurular c4 ile JSON mimarisine taşındı. CMS/CI/deployment aktif değildir.

Bugün kategori/ürün/şube/galeri JSON → strict Node/RSC loader → published server props → statik
sayfa/client filtresi akışı kullanılır. Üretilmiş manifest bu pilotta gerekmemiştir. Diğer türlere
geçiş ayrı 4.1-c işleridir. Detaylar [CMS_SETUP](CMS_SETUP.md), [CONTENT_GUIDE](CONTENT_GUIDE.md)
ve [SECURITY](SECURITY.md); ana kayıt plan.md §19. Güvenlik policy kodu hâlâ aktif CI değildir.

Aşağıdaki Faz 3/2.1 kayıtları tarihsel olarak korunur; önceki CMS yasağı ve V5'in
ilk aşamasındaki manifest önerisi güncel kategori pilotunun önüne geçmez.

## Faz 4.1-b — Gerçekleştirilen kategori pilotu

Tek kaynak altı `content/categories/category-*.json` dosyasıdır. `categories.server.ts`
Node/RSC katmanında dosyaları UTF-8/normal dosya/byte kontrolleriyle okur;
category-schema unknown JSON'a strict alan/tip/değer/ID-dosya adı/benzersizlik
uygular. ProductCategory ve MediaAsset sözleşmeleri korunur. Aynı sıra ve değerlerle
veri üretir; hata durumunda boş liste veya eski kayıt fallback'i yoktur.

`src/content/categories.ts` yalnız erişim/fonksiyon ve uyumluluk snapshot'ıdır.
Queries ve root denetimi getCategories üzerinden güncel dosyaları yükler. Liste/sayı
TS içinde sabitlenmez; yeni JSON eklemek build için yeterlidir. Ürün geçişi aşağıda,
diğer veri türleri TS olarak kalır. Kaynak JSON statik `out/` içine kopyalanmaz.

Bu pilotta üretilmiş manifest gerekmedi: CatalogBrowser bütün kategorileri zaten
server page'in published props'undan alıyor. Node fs içeren loader client import
zincirinde değildir; doğrulanmış veri client filtresine serialize edilir. Derleme
komutları/Next config/dependency/type ayarları değişmedi. Dev'de JSON sonrası dev sunucusunu
yeniden başlatıp sayfayı yenileyin; otomatik HMR iddiası yoktur. Gelecekte gerçekten ihtiyaç
olursa manifest yaklaşımı ayrıca değerlendirilir.

Yükleme, schema/parse, taslak ve bozuk dosya testleri; gerçek izole negatif build ve
draft statik çıktı testleriyle doğrulanır. Görsel decode/EXIF/CMS upload bu fazda yoktur.

## Faz 4.1-c1 — Ürünler ve kategori referansları

`content/products/` bir ürün/bir JSON koleksiyonudur. Şu an gerçek ürün sayısı 0;
`.gitkeep` dizini Git'te korur. loadProducts boş koleksiyonu kabul eder; kayıp dizin,
bozuk UTF-8/JSON, dosya tipi/boyutu, şema veya referans hatası build'i durdurur.
`product-schema.ts` sekiz zorunlu alanı, ID-dosya eşleşmesini, benzersiz ID/slug ve
MediaAsset dizisini unknown girdiden doğrular. Kategori ve ürünlerdeki ortak strict
alan/görsel denetimleri content-schema.ts'e alındı; kategori sözleşmesi değiştirilmedi.

`categoryId` aynı okumada strict JSON loader'dan alınan kategori kimliklerine karşı
doğrulanır. Draft kategoriye referans olabilir; getPublishedProducts yalnız published
ürün + published kategori birleşimini döndürür. Root içerik denetimi taslak dahil tüm
kayıtları doğrular; CatalogBrowser'a yalnız yayımlanmış ürünler serialize edilir.
Uyumluluk products export'u bellekteki snapshot'tır, getProducts her okumada dosyaları
yükler. TS ürün literal listesi veya sabit kategori seçenekleri tutulmaz.

Statik metadata/sitemap yeni ürün rotası veya Product schema üretmez. İzole export
testi, published ürünün gerçekten render edildiğini; draft ürünün ve draft kategoriye
bağlı ürünün HTML/RSC/JS/XML dahil tüm metin çıktılarından dışlandığını kontrol eder.
Fake ürünler yalnız geçici fixture kopyasındadır. Ürün görsel yükleme/decode, CMS
hesabı/.pages.yml, şube/galeri/metin geçişi ve 4.1-c2 başlatılmadı. UI/rota/URL
filtresi, dört koordinat, Next config ve npm komutları aynı kalır.

## Faz 4.1-c2 — Şube kaynağı ve kimlik onayı

Dört kayıt 14 alanıyla birebir content/branches/location-{1,2,3,4}.json dosyalarına taşındı.
branches.ts literal liste içermez; güncel getBranches/loadBranches ve uyumluluk snapshot'ı
sunar. Şube sorguları, root doğrulaması, build-time sayımlar ve Next config bu kaynağı kullanır.
Mevcut özel page.branch.tsx/generateStaticParams mekanizması değişmedi.

branch-schema strict unknown JSON, nullable alanlar, koordinat/Maps eşleşmesi ve
benzersiz ID/slug/fiziksel konum/adres denetimi yapar. Örnekler gerçek JSON'da reddedilir.
Kimlik ve yayın ayrı eksenlerdir. branch-identity.ts korunan ID + fingerprint onayları
(şu an boş) tutar; verified alanının id/slug/ad/adres/koordinat özetiyle eşleşmesi gerekir.
Sadece JSON düzenleyerek kimlik onayı alınamaz. Kimlik alanı değişirse onay yenilenir;
işletme verisinin tek kaynağı yine JSON'dur. Gerçek GitHub koruması/CI ayrı kurulacaktır.
Onaylı verified/published detay üretir; location ve draft kayda detay/schema/sitemap yoktur.
Yeni LocalBusiness/SEO özelliği eklenmedi.

Header eskiden content/site → branches üzerinden statik listeyi client'a import ediyordu.
FS loader sonrasında bu zincir build tarafından reddedildi. Header şimdi server wrapper'da
marka ve navigasyonu hazırlar; header-navigation client'ı yalnız props ve render edilmiş
marka slotu alır. CSS/DOM, sticky, menü/Escape/odak/aktif rota davranışı korundu.
Node fs/crypto/config verisi client bundle'a taşınmaz; statik export API gerektirmez.

Telefon/saat/WhatsApp null kalabilir; images ilk kapak ve detay galerisi sözleşmesini korur.
Dosya varlığı root'ta kontrol edilir; upload/decode/EXIF yoktur. Kaynak JSON statik hostta
404'tür. Hatalı veri build'i durdurur, fallback yoktur. Galeri/site metni geçişi, .pages.yml,
CMS hesabı ve 4.1-c3 başlatılmadı. Paket/config/renk/rota kararları korunur.

## Faz 4.1-c3 — Medya katmanı

Galeri JSON + strict gallery-schema/server loader; gömülü medya kendi ebeveynindedir.
Ortak medya status/sortOrder seçimi draft içeriği props/render'dan çıkarır; galeri usages
hero/brand/branches kullanımını seçer. StaticImage ve PhotoGallery aynı kaldı.
Root layout async dosya decode doğrulaması yapar; uygulama yine build-time/static'tir.

media:check trusted TS CLI'yi .generated altında derler; Sharp ile tüm public/images
imza/MIME/piksel/boyut/limit ve referans kontrolü yapar. Next export sonrası aynı input
fingerprint'i aranır; yalnız published referanslar temizlenip out/images'e yazılır.
Raw/draft/orphan dosyalar çıkarılır, kaynaklara dokunulmaz. .generated ikinci editör
kaynağı değildir, Git'e/hosting'e girmez. SVG kapalı; AVIF/WebP/JPEG/PNG geçerlidir.
Encoder/EXIF temizliği build'dedir; resize/varyant üretimi ve CMS metadata adaptörü
kurulmadı. Sharp 0.35.5 exact doğrudan bağımlılık oldu, sürüm/native paket değişmedi.
Ana strict tsconfig aynı; yardımcı CJS araç config'i ayrıdır. Ayrıntı: [MEDIA_GUIDE](MEDIA_GUIDE.md).

## Build ve çalışma sınırı

`next.config.ts`: `output: 'export'`, `images.unoptimized: true`. Next Server
Components yalnızca build sırasında çalışır. `npm run build` HTML/RSC, JS/CSS ve
PNG üretir; `verify-export.mjs` dosyaları doğrular ve `out/_headers` yazar.
Üretimde yalnızca `out/` yayımlanır. Node/Next runtime veya API sunucusu yoktur.
Yerel `serve-static.mjs` sadece statik QA aracıdır; Pages'e gönderilmez.

Beş ana route korunur. `robots`, `sitemap`, `icon` ve PNG GET yolları force-static
olarak export edilir. Tanımsız yollar root `404.html` ile HTTP 404 verir.
Pages'in extensionless HTML ve düz `.txt` RSC sunumu yerel QA sunucusunda taklit
edilir; Pages'e canlı dağıtım henüz yapılmadığı için hosting doğrulaması bekler.

## Şube detayları: boş parametre kısıtlaması

Next 16.4.3 deneme build'i, boş `generateStaticParams()` listesini `output: export`
ile reddetti. Sahte slug veya örnek şube üretilmedi. Mevcut şablon
`src/app/subelerimiz/[slug]/page.branch.tsx` olarak korunur. `next.config.ts`
`getPublishedBranches()` boş değilse `branch.tsx` özel page uzantısını etkinleştirir.
Şablondaki `generateStaticParams()` yalnızca `verified/published` kayıtları üretir;
`dynamicParams=false` ile diğerleri 404 kalır. İlk gerçek, kimliği doğrulanmış kayıt
eklendiğinde dosya taşıma veya config düzenleme gerekmez; yeniden build yeterlidir.

Bu davranış `test-branch-export.mjs` ile izole kopyada sentetik doğrulanmış şube
üzerinden test edilir. Sentetik kayıt gerçek `src/content` veya `out/` içine girmez.
Next sürüm yükseltmelerinde bu test yeniden çalıştırılmalıdır.

## Tek içerik kaynağı ve yayın güvenliği

Akış: **content → build-time doğrulama/sorgular → sayfa/özellik → statik dosyalar**.
`src/content/`: kategori, ürün, şube, galeri, marka, sosyal kaynaklar; seçim, harita,
sayım ve SEO yardımcıları. `src/types/content.ts` ortak sözleşmeleri tanımlar.
Eski feature data ve config modülleri veri kopyası değil re-export'tur.

- `location`: gerçek koordinat veya henüz konumu beklenen fiziksel kayıt; `slug:null`.
- `verified`: işletme adı/adres kimliği ürün sahibince doğrulanmış şube; gerçek slug.
- `example`: test/tasarım örneği; canlı liste, detay, sitemap veya schema kaynağı olmaz.
- `getVisibleBranches()` published ve örnek olmayan kayıtları sayar/gösterir.
- `getPublishedBranches()` yalnızca verified/published detay kayıtlarını döndürür.
- Şube sayıları, ana sayfa/metin/ikon çıktıları kaynak listesinden türetilir.
- Dört gerçek Konum 1–4 vardır; hepsinin adı/adres eşleşmesi beklenir. Detay sayısı 0.
- Harita linkleri kaynak URL ve koordinattan, yol tarifi Google URLs API formatıyla üretilir.
  Koordinat yoksa link yok; işletme adı/semt eşleştirme veya reverse-geocoding yapılmaz.

Root server layout `assertSiteContent()` çağırır: kimlik/slug/sıra, kategori referansı,
örnek yayın durumu, koordinat aralığı/Maps eşleşmesi, URL host/protokolü, yerel medya
alt/boyut/varyant ve gerçek dosya varlığı denetlenir. Hatalı içerik build'i durdurur.
Bu denetim build-time dosya okumasıdır; tarayıcıya fs veya backend taşınmaz.

## Katalog ve statik metadata

Request-time `searchParams` kaldırıldı. Katalog Server Page genel metadata ve
Suspense fallback üretir; `CatalogBrowser` `useSearchParams()` ile aynı tipli
kategorileri/ürünleri filtreler. Next Link query, geri/ileri ve yenileme korunur.
Bilinmeyen/yinelenen query açık durum mesajıyla tüm kategorilere döner.
Sadece yayımlanmış kategorilerin yayımlanmış ürünleri görünür.

Query başına ayrı HTML üretilmez. Statik HTTP ve hydration sonrası DOM genel katalog
başlığını/açıklamasını taşır; canonical katalog ana route'udur. Kategori seçimi sayfa
başlığı yerine görünür H2, içerik ve aria-current ile belirtilir. Request-time
kategori title ve yanlış-query noindex üretimi kaldırılmıştır; query URL'leri genel
katalog canonical'ına işaret eder. Varsayılan build tüm sayfalarda noindex kalır.
Client kod document.head değiştirmez; Next metadata sahipliği korunur. JS kapalıyken
genel kategori listesi görünür, filtreleme çalışmaz. Bu statik sınır testlerde belgelenir.

## Görseller ve SEO

`StaticImage`: unoptimized Next Image fallback + isteğe bağlı AVIF/WebP `<source>`
srcset/sizes. Boyut ve alt korunur; kartlar fill + sabit oran, galeri lazy,
hero eager/high priority veya tek görselde preload kullanır. Sunucu optimizasyonu yok;
görseller build öncesi optimize edilir. Gerçek fotoğraf yokken sahte fotoğraf eklenmez.
Dosya düzeni ve bütçeler CONTENT_GUIDE içindedir. Gerçek medya performansı henüz ölçülemez.

`resolveSeo`: geçerli HTTPS origin, açık indeksleme bayrağı ve production dalı gerekir.
Geçici hosting/IP adresleri dışlanır. Varsayılan noindex + robots disallow + boş sitemap.
Pages geçici hostlarında ek X-Robots-Tag korunur. Domain ayarı canonical üretir;
indeksleme ayrıca açılır. Hiçbir location/example şube detay veya LocalBusiness üretmez.
Üç PNG gerçek export dosyasıdır; boyut/MIME testleri vardır. Pages extensionless PNG
MIME için `_headers` kuralları üretilir. Yeni ortam değerleri yeniden build gerektirir.

## Kalite ve korunmuş sınırlar

Strict TypeScript, paket sürümleri/lockfile ve kırmızı/siyah/beyaz tasarım korunur.
Vitest, statik HTTP testleri ve gerçek `out/` üzerindeki Playwright kullanılır.
Next typegen ile aynı dizindeki build sırayla çalıştırılmalıdır.
Eksik WebKit/Firefox ve gerçek cihaz kontrolleri başarı sayılmaz.
Yayın, GitHub push veya Cloudflare bağlantısı yapılmaz. İlk yerel geri dönüş commit'i
`b844bad`; sonraki değişiklikler çalışma ağacındadır.

---

## Tarihsel mimari — Faz 2.1 (aşağıdaki kararlar güncel değildir)

# Mimari — Faz 2.1

Ana faz ve uygulama kaydı: [plan.md](../plan.md). Geliştirme kuralları: [AGENTS.md](../AGENTS.md).

## Amaç ve sınır

Türkçe, mobil öncelikli, premium kurumsal tanıtım sitesi. Bal Kuruyemiş, İzmir Buca'da
4 fiziksel şubeye sahip. E-ticaret, fiyat, veritabanı, auth, admin ve deployment bu fazda yok.

## Teknoloji ve uygulama yapısı

Next.js 16.4.3 App Router, React 19.3.1, TypeScript 6.0.3 strict ve Tailwind CSS 4.3.3.
Faz 1'deki paketler ve lockfile korunur; Faz 2 ve 2.1 için ek bağımlılık kurulmadı.
ESLint 9, Prettier 3, Vitest 4, React Testing Library ve Playwright kullanılır.
Node.js aralığı `package.json` içinde, mevcut test ortamı 20.20.0.

Tek uygulama / tek depo. Dev ve build, ortam uyumu için Next.js'in resmî Webpack
seçeneğini kullanır. Mikroservis, ayrı API sunucusu, ORM veya yükleme servisi kurulmaz.

Akış: **Route → özellik / ortak bileşen → tipli yerel veri modülü**.

| Alan                     | Sorumluluk                                                            |
| ------------------------ | --------------------------------------------------------------------- |
| `src/app`                | Route, layout, metadata, robots, sitemap ve görsel HTTP yanıtları     |
| `src/components/brand`   | Yapılandırılabilir logo, tipografik fallback ve PNG çizimi            |
| `src/components/layout`  | Sticky Header, Footer                                                 |
| `src/components/ui`      | Container, SectionHeading, PageIntro, çizgi ikonlar ve durum alanları |
| `src/components/contact` | URL var/yok durumunu yöneten sosyal kanal kartları                    |
| `src/components/gallery` | Gerçek görsel veya açık bekleme durumu                                |
| `src/features/home`      | Altı ana sayfa içerik bölümü                                          |
| `src/features/catalog`   | Kategori verisi, sorgular, kategori ve ürün gridleri                  |
| `src/features/branches`  | Gerçek/örnek kaynak ayrımı, şube kartları                             |
| `src/features/gallery`   | Gerçek galeri varlıkları için boş kaynak                              |
| `src/config`             | Marka, logo ve sosyal kanallar                                        |
| `src/types`              | ORM'den bağımsız içerik sözleşmeleri                                  |
| `src/styles`             | UI renk/font tokenları                                                |
| `tests/e2e`              | Production ve isteğe bağlı dev modu tarayıcı kontrolleri              |

Server Components varsayılandır. Kullanıcı kodundaki client giriş noktası Header'dır.
Menü durumu pathname değişiminde sıfırlanır; önceki rotaya dönüşte yeniden açılmaz.
Mobil menü akışa bağlı, modal olmayan bir dropdown'dır; scroll alanı viewport'a göre sınırlıdır.

## Rotalar ve render davranışı

| Route                         | Davranış                                                          |
| ----------------------------- | ----------------------------------------------------------------- |
| `/`                           | Hero, kategori, marka, şube, galeri ve iletişim bölümleri; statik |
| `/hakkimizda`                 | Doğrulanmış kurumsal bilgiler ve kategori/galeri tanıtımı; statik |
| `/urunlerimiz`                | `searchParams` tabanlı kategori seçimi; sunucuda dinamik          |
| `/urunlerimiz?kategori=kahve` | Paylaşılabilir kategori seçimi; canonical katalog ana URL'si      |
| `/subelerimiz`                | Doğrulanmış şubeler; yoksa etiketli dört örnek kart; statik       |
| `/subelerimiz/[slug]`         | Yalnızca yayımlanmış ve doğrulanmış kayda detay; diğerleri 404    |
| `/iletisim`                   | Ziyaret ve sosyal kanal alanları; statik                          |
| `/apple-touch-icon.png`       | Build sırasında üretilen 180×180 PNG                              |
| `/icon`                       | Tipografik 32×32 favicon                                          |
| `/opengraph-image`            | Build sırasında üretilen 1200×630 tipografik PNG                  |
| `/robots.txt`, `/sitemap.xml` | Doğrulanmış alan adı ayarına bağlı                                |

Kategori linkleri Next Link ve `scroll={false}` kullanır. Filtre durumu URL'dedir;
geri/ileri çalışır ve ekstra client state gerekmez. Bilinmeyen veya yinelenen kategori
parametresinde tüm kategoriler ve açık durum mesajı gösterilir; yanlış query indekslenmez.

## İçerik modeli

`MediaAsset`: kalıcı id, URL, alternatif metin, gerçek genişlik ve yükseklik.
`ProductCategory`: id/slug, ad, açıklama, nullable görsel, sıra ve yayın durumu.
`Product`: kategori id'si, ad, açıklama, medya, sıra ve yayın durumu; fiyat yok.
`Branch`: id/slug, ad, açıklama, nullable adres/telefon/saat/Google Maps/WhatsApp,
medya, sıra, yayın durumu ve `contentKind: verified | example`.

Altı kategori ürün sahibinin başlangıç listesidir. Ürün ve gerçek şube kaynakları
boştur. Örnek şubeler ayrı `exampleBranches` kaynağındadır ve `draft/example` taşır.
`getPublishedBranches` hem `published` hem `verified` ister. Örnek kart, yanlışlıkla
published işaretlense bile detay veya iletişim linki göstermez. Gerçek detaylar,
sitemap ve ilerideki DB import işlemi örnek kayıt kaynağını kullanmamalıdır.

`brandAssets` içinde normal ve ters logo tanımlanabilir; null iken typografik marka
kullanılır. `contactChannels` içindeki null URL, link veya düğme üretmez. Örnek şube
kartlarının adres/telefon/saat alanlarında uydurma bilgi yerine bekleme metni bulunur.

## Tasarım ve görseller

- Ana kırmızı `#ce142b`, koyu kırmızı `#ac1023`, antrasit `#18191b`, beyaz ve açık gri `#f4f5f6`.
- Altın `#b99a5d` sınırlı vurgu; başlıklar güçlü sistem sans, tipografik marka Georgia.
- Navbar konum metni içermez. Siyah/kırmızı hero, kırmızı marka bandı, gri şubeler,
  siyah galeri ve beyaz sosyal alan görsel ritmi oluşturur.
- Eski `brand-burgundy` yerine `brand-dark` kullanılır; krem/bordo UI kaldırılmıştır.
- UI tokenları `src/styles/tokens.css` içinde. PNG renderer CSS çalıştırmadığından
  aynı paletin raster karşılıkları `image-artwork.tsx` içinde tutulur.
- Ortak section spacing ve heading sınıfları; 320 / 393 / 768 / 1280 px kontrolü.
- Geçişler renklerle sınırlı; reduced-motion gözetilir. Scroll animasyon paketi yok.
- Gerçek fotoğraf ve logo yok; üretilmiş/stock mağaza veya ürün fotoğrafı eklenmedi.
- Kategori ikonları yalnızca UI çizimleridir; ürün fotoğrafı gibi sunulmaz.

Logo, kategori, ürün, şube ve galeri görselleri `next/image` kullanır. Kartların
fotoğraf alanları sabit aspect ratio + fill ile korunur; fotoğraflar lazy ve responsive
sizes kullanır. Galeri görselleri gerçek width/height taşır. `HeroVisual` ilk gerçek
galeri fotoğrafı geldiğinde fill + preload kullanır; üst alan görseli lazy yüklenmez. Gerçek dosyalar gelene kadar
bu yol component testleriyle doğrulanır. Uzak görsel hostları açılmadı; ilk entegrasyon
`public/` yolları içindir. Depolama servisi sonraki fazda seçilecektir.

## Erişilebilirlik ve SEO

Türkçe HTML, UTF-8, tek H1, bölümlere isim veren başlıklar, içeriğe geç bağlantısı,
görünür focus, en az 44 px etkileşim hedefleri. Sticky header scroll padding ile
dengelenir. Menü `aria-expanded` / `aria-controls` / Escape ve odak dönüşünü korur.

Smooth scroll için HTML'de `data-scroll-behavior="smooth"` bulunur. Next.js'in sayfa
geçişindeki scroll davranışını doğru yönetebilmesi için bu işaret gerekir.
[Resmî açıklama](https://nextjs.org/docs/messages/missing-data-scroll-behavior).

Türkçe sayfa title/description, Open Graph ve Twitter metinleri ortaktır. Gerçek
alan adı yokken canonical ve paylaşım görseli URL'si uydurulmaz, robots noindex olur.
`NEXT_PUBLIC_SITE_URL` verildiğinde absolute canonical ve PNG paylaşım adresleri üretilir.
Sitemap yalnızca temel sayfaları ve varsa doğrulanmış/yayımlanmış şubeleri listeler.
Şube adresleri doğrulanmadan LocalBusiness yapılandırılmış verisi üretilmez.

İkon ve paylaşım dosyaları Next.js ImageResponse ile yerelde üretilir. Root metadata
hem favicon hem apple-touch-icon bağlantısını açıkça tanımlar; Apple'ın standart PNG
adresine doğrudan istek 404 vermez. Orijinal logo geldiğinde bu geçici tipografik
varlıklar da ayrıca güncellenebilir.

Kategori linkinin erişilebilir adı görünür başlık ve açıklamasından türetilir;
görünür içeriği daraltan aria-label yoktur. Galeri etiketli `group` rolü kullanır.
Soluk kart numaraları ve kırmızı üzerindeki gold yazı, kontrast ihlallerini giderecek
şekilde değiştirildi. Güncel QA sonucu [QUALITY_REPORT](QUALITY_REPORT.md) içindedir.

## Doğrulama

`npm run check`: typegen + TypeScript, ESLint, Prettier, Vitest ve production build.
Playwright production sunucusunu otomatik açıp kapatır; masaüstü, mobil ve tablet
projeleri bulunur. Responsive test, yatay taşmanın yanında ekran dışına kırpılan
metinleri ve sticky konumu da denetler. PNG testleri HTTP durumunu, türünü ve
binary genişlik/yükseklik alanlarını kontrol eder.

Dev'e özgü scroll uyarısı için `PLAYWRIGHT_SERVER=dev` ile hedefli test çalıştırılabilir.
Bu mod 3000 portundaki mevcut sunucuyu koruyarak yeniden kullanır; production modu
3100 portunda ayrı QA sunucusu açar.
Sonuçlar ve tam komutlar [plan.md](../plan.md) içinde tutulur. Fiziksel cihaz,
Safari ve Firefox test edilmedi. Hiçbir test deployment gerektirmez.

## Faz 4.1-c4 — Kurumsal metinler, ayarlar ve duyurular

`content/pages/*.json` ve `content/settings/*.json` tek kaynaktır. editorial-schema
unknown girdiden strict nested şema çıkarır; editorial.server yalnız Node/RSC'de
normal dosya/UTF-8/256 KiB kontrolüyle okur. Eksik/bozuk/şema dışı dosya veya alan
build'i durdurur. page-copy sabit değişkenleri site ve merkezi şube sayımıyla çözer;
çözülmüş metinler de sınırları tekrar geçer. CatalogBrowser yalnız CatalogCopy props
alır; schema tipi type-only import, fs client'a aktarılmaz.

JSON yalnız görünür düz metni belirler. Hero vurgusu, satır kırılması, href, route,
stil, canonical/noindex/domain güvenliği kodda kalır. Teknik UI ve eksik veri durumları
de kodda kalır. React escaping korunur; HTML/MDX renderer eklenmedi. Uzun kelimelerin
mobil taşmasını önlemek için yalnız body overflow-wrap:anywhere eklendi; renk/boşluk
sistemi aynı. İletişimde URL/tip doğrulamasına ek olarak verified bayrağı gerekir;
bu editoryal insan beyanıdır, hesap sahipliği veya aktif CI yetkilendirmesi değildir.

Duyuru JSON koleksiyonu boştur. Strict ID/slug/opsiyonel medya/UTC tarih aralığı,
published + [başlangıç,bitiş) filtresi uygulanır. Filtrelenen kayıtlar HTML/RSC/JS ve
medya export'una girmez; ham görsellerin tamamı decode denetiminden yine geçer.
Duyuru bölümü boşken render edilmez; yeni detay rotası/LocalBusiness/sitemap girdisi yok.

build-site.mjs tek SITE_BUILD_AT üretip medya check, Next Webpack, medya sanitize
ve export denetimine aktarır. Medya raporu bu zamanı ve bütün JSON fingerprint'ini
tutar; export aynı zamanı kullanır, kaynak drift'i reddedilir. Tarih geçmesi tek
başına statik yayını değiştirmez. Zamanlanmış yeniden build/deployment kurulmadı.

[EDITORIAL_GUIDE](EDITORIAL_GUIDE.md) alan sözleşmesi; plan §19 kabul/test kaydıdır.
Önceki faz bölümlerindeki TS metin/komut açıklamaları kendi tarihsel kapsamlarıdır.
