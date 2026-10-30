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
