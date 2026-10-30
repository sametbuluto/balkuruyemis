# BAL KURUYEMİŞ — Master uygulama ve faz planı

Son güncelleme: **30 Ekim 2026**. Aktif faz: **Faz 3 — Static-first migration ve dört gerçek konum tamamlandı, değerlendirmeye hazır**.

Bu belge her fazda güncellenir. Yapılan işler, sıradaki işler, teknik kararlar,
doğrulama sonuçları, içerik eksikleri ve kapsam sınırları burada birlikte tutulur.
Ürün sahibinin güncel talimatları bu planın önündedir.

## 1. Ürün ve marka

- Marka: **Bal Kuruyemiş**. Slogan: **Lezzetin Doğal Adresi**.
- Konum: İzmir Buca. Fiziksel şube sayısı: **4**.
- Amaç: kurumsal tanıtım, ürün/kategori keşfi, şube tanıtımı ve doğrulanmış
  Haritalar/Instagram/WhatsApp kanallarına yönlendirme.
- E-ticaret, fiyat, sepet, ödeme veya sipariş yönetimi yok.
- Türkçe varsayılan dil. Mobil öncelikli, erişilebilir, SEO altyapılı arayüz.
- Güncel marka kararı: canlı kırmızı, siyah/antrasit, beyaz ve nötr açık gri; sınırlı gold detaylar.
- Gerçek logo ve fotoğraflar henüz sağlanmadı; tipografik marka kullanılır.

## 2. Fazların durumu

| Faz                      | Durum        | Sonuç / hedef                                                                       |
| ------------------------ | ------------ | ----------------------------------------------------------------------------------- |
| Faz 1 — Proje altyapısı  | Tamamlandı   | Next.js, tasarım temeli, temel rotalar, testler ve yerel Git                        |
| Faz 2 — Kurumsal tasarım | Tamamlandı   | Ana sayfa bölümleri, kategori arayüzü, örnek şubeler, galeri ve iletişim            |
| Faz 2.1 — Marka kimliği  | Tamamlandı   | Tabela kimliğiyle uyumlu kırmızı/siyah/beyaz görsel revizyon ve kalite düzeltmeleri |
| Faz 3 — Statik mimari    | Tamamlandı   | Static export, Git içerik kaynakları ve dört gerçek konum                           |
| Faz 4 — Yayına hazırlık  | Başlatılmadı | Gerçek içerik ve yayın kontrolleri; ayrıca canlıya çıkış onayı gerekir              |

## 3. Faz 1 — Neler yapıldı?

- Boş proje köküne, iç içe klasör açmadan Next.js App Router kuruldu.
- TypeScript strict ve `noUncheckedIndexedAccess` açıldı.
- Tailwind CSS, ESLint flat config, Prettier, EditorConfig UTF-8 yapılandırıldı.
- Header, Footer, Container ve mobil menü oluşturuldu.
- Ana sayfa ve `/hakkimizda`, `/urunlerimiz`, `/subelerimiz`,
  `/subelerimiz/[slug]`, `/iletisim` rotaları oluşturuldu.
- Merkezi renk/font tokenları ve içerik tipleri tanımlandı.
- Metadata, robots ve sitemap temeli kuruldu. Gerçek alan adı olmadan URL
  uydurulmaz ve indeksleme açılmaz.
- Vitest, React Testing Library ve Playwright kuruldu.
- README, AGENTS, ARCHITECTURE ve ROADMAP yazıldı.
- Yerel Git deposu `main` dalında başlatıldı. Commit ve harici remote yok.

Faz 1 teknik doğrulaması: typecheck, ESLint, Prettier, production build,
**5 component testi ve 10 Playwright testi geçti**. 1280, 393 ve 320 px incelendi.

Karşılaşılan sorunlar ve çözümler:

- Turbopack PostCSS yardımcı süreci ortamın yerel port kısıtlamasına takıldı;
  Next.js'in desteklediği `--webpack` seçeneği dev/build komutlarına alındı.
- ESLint 10 bazı Next.js lint eklentileriyle uyumsuzdu; uyumlu kararlı 9.x seçildi.
- Başlıktaki satır kırılımı, ana sayfa title ve 320 px kırpılma sorunları testlerle düzeltildi.

## 4. Faz 2 — Uygulama sırası ve kabul kriterleri

### 4.1. İnceleme ve güvenli başlangıç

- [x] Git durumu, kurallar, bileşenler, veri modelleri ve mevcut testleri incele.
- [x] Mevcut kaynakların yerel anlık kopyasını al; reset/temizleme/commit yapma.
- [x] Bu master planı oluştur; aktif kapsamı AGENTS ile eşleştir.

### 4.2. Tasarım sistemi ve ortak yapı

- [x] Bordo ağırlığını, tipografik hiyerarşiyi ve ortak boşlukları geliştir.
- [x] Sticky responsive header; klavye, Escape ve mobil menü davranışını koru.
- [x] Gerçek logo için yapılandırılabilir görsel alanı ve tipografik fallback sağla.
- [x] Bölüm başlığı, görsel bekleme alanı ve sosyal iletişim bileşenlerini oluştur.
- [x] Footer'ı kategori ve kurumsal bağlantılarla tamamla.

### 4.3. Ana sayfa

- [x] Hero, altı kategori, kısa marka tanıtımı ve dört örnek şube kartı.
- [x] Fotoğraf galerisi için veri ve render altyapısı.
- [x] Instagram/WhatsApp alanları; URL yokken aktif bağlantı üretme.

### 4.4. İç sayfalar

- [x] Ürünlerimiz: kategori bağlantıları/filtreleri, kalıcı kategori URL'leri,
      bilinmeyen kategori durumu ve gerçek ürün bekleme durumu.
- [x] Şubelerimiz: dört açıkça etiketli örnek kart, doğrulanmış veriden ayrım.
- [x] Şube veri modeline WhatsApp alanı ekle; bilinmeyen alanlar `null` kalsın.
- [x] Hakkımızda ve İletişim sayfalarını tasarım sistemiyle tamamla.
- [x] Doğrulanmamış tarih, adres, telefon, ürün veya sosyal hesap üretme.

### 4.5. Teknik düzeltmeler ve SEO

- [x] `/apple-touch-icon.png` için gerçek PNG yanıtı ve metadata bağlantısı.
- [x] Smooth scroll uyarısının nedenini gider; reduced-motion desteğini koru.
- [x] Paylaşım metadata'sı ve tipografik Open Graph görseli.
- [x] Örnek şubeleri gerçek detay, sitemap ve SEO verisinden dışarıda tut.
- [x] Gerçek görsellerde Next Image, responsive sizes ve lazy loading.

### 4.6. Doğrulama ve teslim

- [x] TypeScript, ESLint ve Prettier.
- [x] Vitest: kategori/örnek içerik ayrımı, iletişim ve yeni davranışlar.
- [x] Production build.
- [x] Production sunucusunda Playwright: kategori geçişleri, navbar, örnek kartlar,
      ikon, metadata, geçersiz bağlantıların yokluğu ve 404.
- [x] 320, 393, 768 px mobil/tablet ve 1280 px masaüstü; taşma ve ekran görüntüsü kontrolü.
- [x] README, ROADMAP, ARCHITECTURE ve bu dosyada sonuçları güncelle.

## 5. Teknik mimari

- **Uygulama:** Next.js 16.4.3 App Router, React 19.3.1.
- **Tip sistemi:** TypeScript 6.0.3 strict; nullable bilinmeyen alanlar.
- **Stil:** Tailwind CSS 4.3.3, merkezi `src/styles/tokens.css`, sistem fontları.
- **Kalite:** ESLint 9.39.5, Prettier 3.9.10, Vitest 4.1.12,
  React Testing Library, Playwright 1.64.1.
- **Node:** mevcut 20.20.0 ile doğrulama; paket uyum aralıkları `package.json` içinde.
- **Paketler:** exact sürümler ve lockfile korunur. Faz 2 için yeni bağımlılık eklenmedi.
- **Çalışma ortamı:** yerel geliştirme, Webpack; harici servis gerektirmez.

Klasör sorumlulukları:

| Alan                    | Sorumluluk                                              |
| ----------------------- | ------------------------------------------------------- |
| `src/app`               | Route, layout, metadata, ikon ve paylaşım görseli       |
| `src/components`        | Ortak layout, UI, marka, galeri ve iletişim bileşenleri |
| `src/features/home`     | Ana sayfanın bölümleri                                  |
| `src/features/catalog`  | Kategori/ürün verisi ve katalog arayüzü                 |
| `src/features/branches` | Doğrulanmış ve örnek şube kaynakları, kartlar           |
| `src/config`            | Marka, logo ve sosyal kanal yapılandırması              |
| `src/types`             | PostgreSQL/ORM'den bağımsız içerik sözleşmeleri         |
| `src/lib`               | Metadata ve ortak yardımcılar                           |
| `tests/e2e`             | Production tabanlı uçtan uca kontroller                 |

Server Components varsayılandır. Sadece etkileşim gerektiren navbar istemci bileşenidir.
Kategori seçimi URL üzerinden yapılır; paylaşılabilir, tarayıcı geri/ileri akışıyla uyumludur.
Veriler şimdilik tipli yerel modüllerdedir; DB ve API entegrasyonu yoktur.

### 5.1. Faz 2 uygulama ayrıntıları

- UI paleti: bordo `#701c2b`, kırmızı `#a32638`, antrasit `#20201e`,
  kırık beyaz `#f8f6f1`, altın `#b99a5d`. PNG çıktılarının eş renkleri
  `src/components/brand/image-artwork.tsx` içinde bulunur; renderer CSS çalıştırmaz.
- Logo tek `BrandMark` üzerinden header, hero, Hakkımızda ve footer'a dağılır.
  `brandAssets.logo/inverseLogo` gerçek dosya yolları ve boyutlarını alır.
- Katalog sunucuda `searchParams` okur. Altı kategori Link ile seçilir;
  seçim paylaşılabilir, geri/ileri desteklenir, bilinmeyen query açık mesajla döner.
- Kategori/ürün/şube/grid ve galeri görselleri Next Image + responsive sizes
  kullanır. Gerçek dosya yokken görsel bekleme durumları veya çizgi ikonlar gösterilir.
- Şubelerde `contentKind` gerçek/örnek ayrımını, `status` yayın durumunu tutar.
  `getPublishedBranches` iki koşulu da arar. Örnek kaydın detail/sitemap erişimi yoktur.
- Görsel endpoint'leri: `/apple-touch-icon.png` 180×180, `/icon` 32×32,
  `/opengraph-image` 1200×630. ImageResponse ile build sırasında PNG üretilir.
- Root metadata favicon ve Apple linklerini açıkça tanımlar. Paylaşım metadata'sında
  absolute görsel URL'si yalnızca doğrulanmış `NEXT_PUBLIC_SITE_URL` ile eklenir.
- Sticky header için scroll padding 7.5rem. HTML'de `data-scroll-behavior="smooth"`
  ve CSS'te reduced-motion korunur. Menü pathname değişince sıfırlanır.
- Playwright'a 768 px tablet projesi ve `PLAYWRIGHT_SERVER=dev` hedefli QA modu eklendi.

### 5.2. Faz 2 dosya kaydı

| Dosya / grup                                                                                    | Yapılan iş                                                  |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `src/app/page.tsx`, `src/features/home/*`                                                       | Ana sayfanın tüm bölümleri                                  |
| `src/app/urunlerimiz/page.tsx`, `src/features/catalog/*`                                        | Altı kategori, URL seçimi, ürün arayüzü                     |
| `src/app/subelerimiz/*`, `src/features/branches/*`                                              | Dört örnek kart, veri ayrımı, gerçek detay şablonu          |
| `src/app/hakkimizda/page.tsx`, `src/app/iletisim/page.tsx`                                      | Kurumsal iç sayfalar                                        |
| `src/components/brand/*`, `src/config/site.ts`                                                  | Logo fallback, yapılandırma, PNG çizimleri                  |
| `src/components/contact/*`, `src/components/gallery/*`                                          | Sosyal kartlar ve gerçek görsel altyapısı                   |
| `src/components/layout/*`, `src/components/ui/*`                                                | Sticky header, footer, bölüm başlıkları ve çizgi ikonlar    |
| `src/styles/tokens.css`, `src/app/globals.css`                                                  | Palet, boşluk, başlık ve scroll kuralları                   |
| `src/types/content.ts`, `src/features/gallery/data.ts`                                          | Nullable şube kanalları, örnek türü ve medya kaynakları     |
| `src/app/layout.tsx`, `src/lib/metadata.ts`, `src/app/sitemap.ts`                               | İkon, sosyal metadata ve doğrulanmış sitemap kayıtları      |
| `src/app/apple-touch-icon.png/route.ts`, `src/app/icon.tsx`, `src/app/opengraph-image/route.ts` | Gerçek PNG yanıtları                                        |
| `playwright.config.ts`, `tests/e2e/site.spec.ts`, `*.test.tsx`                                  | Tablet, kategori, örnek kayıt, medya, ikon ve menü testleri |
| `AGENTS.md`, `README.md`, `docs/*`, `plan.md`                                                   | Faz 2 kuralları, kullanım ve teknik kayıtlar                |

`package.json` ve `package-lock.json` sürümleri değiştirilmedi. Git'te reset,
commit veya remote işlemi yapılmadı; başlangıç kaynakları ayrıca yerel snapshot'ta korundu.

## 6. İçerik ve veri kuralları

- Başlangıç kategorileri ürün sahibinden geldi: Kuruyemiş, Kahve, Lokum, Baharat, Aktar, Kozmetik.
- Gerçek ürün listesi boştur. Fiyat alanı veya satın alma akışı eklenmez.
- Dört örnek şube tasarım gösterimidir. Görünür “Örnek içerik” etiketi gerekir.
- Doğrulanmış şubeler ve örnekler ayrı kaynaklardadır; örnekler yayımlanmış kayıt sayılmaz.
- Şubede ad, adres, telefon, saat, medya, harita ve WhatsApp alanları modellenir.
- Telefon, harita ve sosyal URL bilinmiyorsa `null`; boş veya sahte anchor yok.
- Galeri boşsa yalnızca açıkça açıklanmış görsel bekleme alanları gösterilir.
- Fotoğraf, mağaza görüntüsü veya resmî logo uydurulmaz.
- İkon ve sosyal paylaşım görseli yalnızca geçici tipografik marka kullanır.

## 7. Sonraki fazlarda ne yapılacak?

### Tarihsel Faz 3 önerisi — Veri ve admin (uygulanmadı, yeni kararla kapsam dışı)

PostgreSQL, ORM/migration seçimi, sunucu veri erişimi, güvenli giriş, rol/yetki
modeli, ürün/kategori/şube/duyuru/içerik yönetimi ve dosya yükleme.
Güvenlik, yayınlama ve yedekleme senaryoları gereksinimler netleşince tasarlanır.
Bu eski öneri Faz 3 static-first kararıyla ilk sürümden çıkarılmıştır; güncel kapsam §12’dir.

### Faz 4 — Gerçek içerik ve yayına hazırlık (henüz yetkilendirilmedi)

Gerçek logo/fotoğraflar/şube bilgileri ile örnek alanların değiştirilmesi,
doğrulanmış iletişim bağlantıları, alan adı/hosting seçimi, performans,
erişilebilirlik, SEO ve kabul kontrolleri. Gerçek içerik daha erken gelirse
ürün sahibinin yönlendirmesiyle mevcut fazda da kullanılabilir.
Deployment ancak ayrıca izin verildiğinde başlar.

## 8. Bekleyen bilgi ve kararlar

- Orijinal logo, ters renkli logo ve fiziksel tabela referansı.
- Gerçek ürünler, açıklamalar, kategori ve mağaza fotoğrafları.
- Dört şubenin adları, adresleri, telefonları ve çalışma saatleri.
- Google Maps, Instagram ve WhatsApp adresleri.
- Arama ihtiyacı, şubeye göre ürün farkları, ek dil ve iletişim formu.
- Admin rolleri, dosya depolama, DB/hosting ve alan adı.

Varsayım: bu fazda tek dil Türkçe; ziyaretçi üyeliği ve iletişim formu yok.
Kesin fontlar ve renk tonları, gerçek logo/tabela görüldüğünde yeniden değerlendirilebilir.

## 9. Faz 2 sonuç kaydı

### 9.1. Sonuç

Faz 2 uygulaması tamamlandı. Tasarım ürün sahibi değerlendirmesine hazır.
Faz 3, DB, admin, auth ve deployment başlatılmadı. Gerçek içerik gerektiren
alanlar açık bekleme durumu veya “Örnek içerik” etiketi taşır.

### 9.2. Çalıştırılan kontroller

| Kontrol                                      | Sonuç                                                         |
| -------------------------------------------- | ------------------------------------------------------------- |
| `npm run typecheck`                          | Başarılı; strict ve noUncheckedIndexedAccess korundu          |
| `npm run lint`                               | Başarılı; sıfır uyarı                                         |
| `npm run format:check`                       | Başarılı                                                      |
| `npm test`                                   | 6 dosyada **13/13** test geçti                                |
| `npm run build`                              | Webpack ile production build başarılı                         |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` | Üç cihaz projesinde **18/18** test geçti                      |
| Dev modunda hedefli sticky/scroll testi      | **1/1** geçti; smooth scroll uyarısı alınmadı                 |
| Ekran kontrolü                               | **320, 393, 768, 1280 px**; yatay taşma / kırpılmış metin yok |

Bileşen testleri: mobil menü/Escape/odak/rota dönüşü, footer bağlantıları, hero,
örnek şubelerin görünür etiketi ve yayın ayrımı, sosyal URL var/yok durumu,
galeride boş durum ile gerçek görselin alt/sizes/lazy özellikleri.

E2E: tüm altı kategori seçimi ve tarayıcı geri dönüşü, yanlış kategori, temel
rotalar, örnek/yanlış şube için 404, eksik sosyal/harita/telefon linklerinin yokluğu,
Apple PNG ve paylaşım PNG binary boyutları, favicon metadata, Türkçe/klavye,
sticky menü ve her görünümde metinlerin yatay sınırları.

Geliştirme modu komutu:

```bash
PLAYWRIGHT_SERVER=dev PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- --project=desktop-chromium --grep 'sticky menü' --output=/private/tmp/balproject-phase2.u0wNiL/development-tests --reporter=list
```

Production QA 3100 portunda otomatik açılıp kapanır. Dev QA 3000 portunda mevcut
sunucuyu yeniden kullanır; kullanıcı sunucusunu durdurmaz. İlk dev denemesi mevcut
Next.js dev kilidi nedeniyle başlayamadı; test mevcut sunucuyu kullanacak şekilde
düzenlendi ve yeniden çalıştırılarak geçti.

### 9.3. Bulunan ve çözülen sorunlar

1. Apple ikon yolu yoktu. `/apple-touch-icon.png` PNG route'u ve 180×180 metadata
   eklendi; doğrudan HTTP yanıtı ve PNG boyutları test edildi.
2. Smooth scroll CSS tercihi HTML'de bildirilmemişti. `data-scroll-behavior="smooth"`
   eklendi; reduced-motion ve sticky scroll padding korundu. Hem production hem dev doğrulandı.
3. İlk E2E turunda 15/18 test geçti; PNG'ler doğruyken favicon metadata bağlantısı
   eksik çıktı. Root'a açık `/icon` metadata'sı eklendi; son tur 18/18 geçti.
4. Yeni testte `split()[0]` strict denetimde undefined olabiliyordu; güvenli dosya adı
   üretimiyle düzeltildi. Tip denetimi gevşetilmedi.
5. `.next/types` altında `routes.d 2.ts` gibi yinelenmiş üretilmiş dosyalar bulundu.
   Kaynaklara dokunmadan kopyalar snapshot yanına taşınıp korundu; duplicate type hatası giderildi.

### 9.4. Korunan dosyalar, çıktı ve sınırlar

- `package.json`, `package-lock.json` ve `tsconfig.json` başlangıç snapshot'ıyla
  karşılaştırıldı; değişmedi. Yeni paket kurulmadı.
- Kaynak başlangıcı: `/private/tmp/balproject-phase2.u0wNiL/source.tar.gz`.
  Üretilmiş tip kopyaları aynı dizindeki `generated-type-copies/` içinde korunur.
- Production test durumu `test-results/.last-run.json`; HTML raporu `playwright-report/`.
  Ekran görüntüleri responsive testin cihaz klasörlerindedir. QA çıktıları Git'e girmez.
- Git `main` üzerinde hâlâ ilk commit öncesinde; reset, commit, remote veya deploy yapılmadı.
- Kullanıcının 3000 portundaki geliştirme sunucusu korundu.
- Mobil ve tablet sonuçları Chrome/Chromium emülasyonudur; fiziksel telefon,
  Safari ve Firefox test edilmedi.
- Gerçek logo, mağaza/ürün fotoğrafları, ürün listesi, şube bilgileri ve resmî
  iletişim URL'leri bekleniyor. Bunlar uydurma içerikle doldurulmadı.
- Sıradaki adım ürün sahibinin tasarım testi ve geri bildirimidir. Sonraki faza
  kendiliğinden geçilmez.

## 10. Faz 2 son kalite kontrolü — Revizyon öncesi kayıt

Ürün sahibinin son teslim kontrolü isteğiyle AGENTS ve kod incelendi. İlk turda
TypeScript, ESLint, Prettier, production build ve mevcut testler tekrar çalıştırıldı.
SEO ortam ayrımı için iki unit testi, bağlantı/metadata/404/klavye ve header/footer
sınırları için üç E2E denetimi eklendi. Yeni özellik veya paket eklenmedi.

- İlk genişletilmiş sonuç: **15/15 Vitest**, **27/27 production Chrome E2E** geçti.
- Gerçek HTTP davranışı; iç linkler, tek H1, sayfa title/description, robots/sitemap,
  dört örnek şube slug'ı ve genel 404 ile karşılaştırıldı.
- Mevcut `axe-core 4.14.0` ile 5 sayfa × 4 genişlikte ek erişilebilirlik taraması yapıldı.
- Bu tarama eski soluk kart numaralarında ve bordo üzerindeki gold metinde kontrast
  sorunları, kategori linklerinde görünür metin/erişilebilir ad uyuşmazlığı buldu.
- Galeri div'inin `aria-label` kullanımı da semantik grup rolüyle netleştirilmeliydi.
- Firefox 1555 ve Playwright WebKit 2370 çalıştırma denemeleri, gerekli binary dosyaları
  kurulu olmadığı için başlayamadı. Safari/Firefox uyumluluğu başarılı ilan edilmedi.
- Orijinal tarama: `/private/tmp/balproject-final-quality-20261030/axe-report.json`.

Bu kontrol sürerken ürün sahibi **Faz 2.1 marka revizyonunu** yetkilendirdi.
Bulunan erişilebilirlik sorunları yeni görsel uygulama içinde giderilip tekrar
kontrol edilecek. Bu kayıt revizyon öncesi bulguları korur; temiz sonuç iddiası değildir.

## 11. Faz 2.1 — Marka kimliği revizyonu

### 11.1. Kapsam ve tasarım kararları

- Fiziksel tabelanın ürün sahibince tarif edilen kırmızı/siyah/beyaz karakteri esas alınır.
- Birincil kırmızı `#ce142b`, koyu kırmızı hover `#ac1023`, antrasit `#18191b`,
  beyaz, açık gri `#f4f5f6`, çizgi `#dfe2e6`, metin `#555b63`.
- Gold `#b99a5d` sadece küçük ve uygun kontrastlı vurgularda; kırmızı üzerinde küçük
  gold yazı yok. Krem zemin ve bordo görsel alanlar kaldırılır.
- Başlıklarda güçlü sistem sans; tipografik marka Georgia ile korunur.
  Yeni font indirmesi veya paket yoktur.
- Navbar konum yazısı kaldırılır; sticky, menü sıralaması, aktif rota ve mobil
  klavye/Escape davranışı korunur.
- Hero beyaz zeminde büyük kırmızı/siyah başlık, güçlü çift CTA ve siyah/kırmızı
  bir görsel panel kullanır. `HeroVisual`, gerçek galeri görseli gelirse Next Image
  ile yükler; şimdilik açık fotoğraf bekleme metni ve tipografik marka gösterir.
- Kategori kartları sabit oranlı fotoğraf alanı, kırmızı çizgi ikonlar, okunur
  numaralar ve daha belirgin link yüzeyi kullanır.
- Şube kartlarında fotoğraf oranı, siyah görsel alan, kırmızı vurgu ve örnek etiketi
  korunur. Doğrulanmamış bilgiler veya linkler eklenmez.
- Kırmızı marka bandı, açık gri şube alanı, siyah galeri ve beyaz sosyal alan
  bölümler arasında çeşitlilik sağlar. Yeni animasyon yoktur.

### 11.2. Koruma ve kalite planı

- [x] Revizyon öncesi kaynak snapshot'ı: `/private/tmp/balproject-phase21.2Tfv2p/source.tar.gz`.
- [x] Rotalar, veriler ve işlevleri koru; mevcut testleri kaldırma.
- [x] Navbar konum yazısını kaldır; canlı renk ve CTA sistemini uygula.
- [x] Kategori link adını görünür metinden türet; galeriye semantik grup rolü ekle.
- [x] Geçici ikon ve paylaşım PNG paletini yeni kimlikle eşleştir.
- [x] TypeScript, lint, Prettier, Vitest, production build.
- [x] 320, 393, 768 ve 1280 px Chrome E2E ve ekran görüntüleri.
- [x] Önceki SEO/404/örnek kayıt/menü testleri ve axe taramasını tekrar çalıştır.
- [x] Sonuç ve değişen dosyaları README/ARCHITECTURE/ROADMAP ve bu plana kaydet.

### 11.3. Sınırlar

Yeni ürün, rota veya veri özelliği yok. PostgreSQL, admin, auth, deployment ve
commit yok. Gerçek fotoğraf/logo/şube bilgileri hâlâ beklenir. Fiziksel tabela
fotoğrafı henüz sağlanmadığından görsel uyum ürün sahibinin renk tarifine dayanır.

### 11.4. Sonuç

**Faz 2.1 tamamlandı.** Son kalite raporu: [QUALITY_REPORT](docs/QUALITY_REPORT.md).

| Kontrol                          | Sonuç                                                          |
| -------------------------------- | -------------------------------------------------------------- |
| TypeScript, ESLint ve Prettier   | Başarılı                                                       |
| Vitest                           | **17/17**, 8 dosya; eski testler korundu                       |
| Production build                 | Webpack ile başarılı; route listesi aynı                       |
| Production Chrome Playwright     | **27/27**, masaüstü/mobil/tablet                               |
| Dev sticky / smooth scroll testi | **1/1** geçti; çalışan 3000 sunucusu korundu                   |
| Responsive görünüm               | **320, 393, 768, 1280 px** incelendi; yatay taşma/kırpılma yok |
| Axe 4.14.0                       | 5 sayfa × 4 genişlik, **20 taramada otomatik ihlal 0**         |

Önceki kategori adlandırması ve kontrast ihlalleri yeniden taranarak giderildi.
Hero geometrik zemindeki üç tipografik öğe için axe kontrastı otomatik karara
bağlayamadı; bunlar manuel renk hesabı ve ekran görüntüsüyle incelendi.
Beyaz/antrasit 17.59:1; beyaz/kırmızı 5.59:1; gövde metni/açık gri 6.28:1;
gold/antrasit 6.57:1. Dekoratif çizgi kesişiminde beyaz metin için muhafazakâr
koyu gri zeminle 9.61:1 hesaplandı. Bu kayıt tam WCAG sertifikası iddiası değildir.

**WARNING:** Playwright WebKit ve Firefox binary dosyaları kurulu değil;
başlatma denemeleri başarısız oldu. Safari/Firefox testi başarılı olarak raporlanmadı.
Gerçek logo/fotoğraf/şube ve sosyal hesaplar bekleniyor. Alan adı ayarlanmadan
noindex ve boş sitemap bilinçli olarak korunur.

**FAIL:** Son doğrulamada başarısız çalışan test veya açık kritik hata yok.

### 11.5. Dosya ve koruma kaydı

- Görsel sistem: `src/styles/tokens.css`, `src/app/globals.css`, `PageIntro`.
- Navbar/marka: `header.tsx`, `brand-mark.tsx`, `image-artwork.tsx`, footer.
- Ana sayfa: `hero.tsx`, yeni `hero-visual.tsx`, `brand-story.tsx`, galeri ve sosyal bölümleri.
- Kartlar: kategori ve şube grid/kartları; galeri ve iletişim görünümü.
- İç sayfalarda mevcut rotalar üzerinde yalnızca sunum sınıfları güncellendi.
- Kategori erişilebilir adı, navbar konum yokluğu ve galeri grup rolü için regresyon
  kontrolleri eklendi. Mevcut test silinmedi.
- `AGENTS.md`, README, ARCHITECTURE, ROADMAP, master plan ve kalite raporu güncellendi.
- Snapshot karşılaştırması: paket/lockfile, strict TS ayarları, Playwright config,
  katalog/şube/galeri verileri, içerik tipleri, marka/iletişim config'i, SEO yardımcıları,
  robots, sitemap ve önceki `site.spec.ts` **aynı**. Eksilen kaynak dosyası yok.
- `brand-burgundy` UI tokenı kaldırılıp `brand-dark` ile değiştirildi; eski krem/bordo
  değerler yalnızca tarihsel Faz 2 kayıtlarında bulunur.
- Erişilebilirlik JSON'u: `/private/tmp/balproject-phase21.2Tfv2p/axe-after.json`;
  kopyası `test-results/axe-phase21.json` altında. Ekran görüntüleri responsive test
  çıktılarında, production HTML raporu `playwright-report/` içinde.
- Önceki örnek kayıt ayrımı, tüm iç bağlantılar, SEO, robots/sitemap, 404, ikon ve
  menü kontrolleri yeniden geçti. Git `main`, ilk commit öncesi; commit/remote/deploy yok.
- Faz 3 başlatılmadı. Sıradaki adım ürün sahibinin görsel değerlendirmesi.

## 12. Faz 3 — Static-first mimari geçişi ve gerçek konumlar

### 12.1. Güncel ürün kararı ve güvenli başlangıç

İlk sürüm statik kurumsal site olarak devam eder. PostgreSQL, özel backend, CMS,
admin ve auth ilk sürümden çıkarıldı. Önceki fazların teknik kayıtları tarihseldir;
Faz 3 için esas karar bu bölümdür. Tasarım revizyonu veya yeni satış özelliği yoktur.

- Git ön kontrolde ilk commit öncesindeydi. Tam 77 dosyalık Faz 2.1 arşivi:
  `/private/tmp/balproject-phase3-baseline-oomg3jvg/phase21-complete.tar.gz`;
  SHA-256 manifesti aynı klasörde `manifest.json`.
- Ürün sahibinden açık onay alındı: “Evet, yerel başlangıç commit’ini oluştur ve
  geçişe devam et.” Yerel baseline commit: **`b844bad`**.
- Mevcut kaynaklar korundu; reset/force/remote/push/deployment yapılmadı.
  Faz 3 değişiklikleri henüz commit edilmedi.
- Sonradan paylaşılan ek Faz 3 dosyası ilk talep ile birebir karşılaştırıldı;
  aynı static-first kapsamı doğrulandı. Son konum mesajı bu göreve dahil edildi.

### 12.2. Uyumsuzluklar ve çözümler

| Önceki davranış                  | Faz 3 çözümü                                               |
| -------------------------------- | ---------------------------------------------------------- |
| Runtime `searchParams` katalog   | Suspense + client URL seçimi; statik genel HTML            |
| `next start` production sunucusu | `out/` statik HTTP sunumu, `preview` komutu                |
| Varsayılan image optimizer       | Unoptimized Next Image + hazır AVIF/WebP srcset            |
| Boş dinamik şube parametreleri   | Özel `page.branch.tsx` uzantısı; gerçek kayıt varsa etkin  |
| Dağınık yerel veri               | Tek `src/content` kaynakları ve eski modüllerden re-export |
| Hardcoded şube sayıları          | Görünür gerçek kayıtlardan türetilen sayım ve metinler     |
| Domain tek başına indeksleme     | Domain + açık bayrak + production dalı; Pages host noindex |

Next 16.4.3 export denemesi boş `generateStaticParams()` listesini reddetti.
Örnek/sahte slug üretilmedi. Gerçek verified/published şube eklenince config özel
uzantıyı açar; mevcut template build-time detay üretir. Bu yol geçici kopyaya
sentetik doğrulanmış kayıt eklenerek test edildi; gerçek kaynak/out etkilenmedi.
Başarılı izole kanıt: `/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-branch-export-cK71BE`.

### 12.3. İçerik ve gerçek koordinatlar

`src/content/`: categories, products, branches, site, social, gallery; merkezi
queries/maps/seo/validation. Root layout yalnızca build sırasında dosya ve veri
kurallarını denetler. Özel backend veya API yoktur. `BranchLocation` ile konum
kimliği, `Branch` ile doğrulanmış şube kimliği ayrılır; example kaynağı ayrı kalır.

| Kayıt   | Latitude  | Longitude | Yayın durumu                                     |
| ------- | --------- | --------- | ------------------------------------------------ |
| Konum 1 | 38.362633 | 27.148943 | Gerçek konum; isim/adres eşleşmesi bekliyor      |
| Konum 2 | 38.374462 | 27.183882 | Gerçek konum; isim/adres eşleşmesi bekliyor      |
| Konum 3 | 38.367344 | 27.148973 | Gerçek konum; isim/adres eşleşmesi bekliyor      |
| Konum 4 | 38.378593 | 27.163704 | Sonradan sağlandı; isim/adres eşleşmesi bekliyor |

Başlangıçta dördüncü konum bekleniyordu; çalışma sırasında ürün sahibi paylaştı ve
kayıt Konum 4 olarak güncellendi. Dördünde de sahibin maps.google.com URL'si ve
Google Maps URLs API `api=1&destination=lat,lon` yol tarifi vardır. Adres/telefon/saat
null; semt/şube adı eşleştirmesi yapılmadı. Şu an detay üretilecek verified kayıt **0**.
Konumlar LocalBusiness, sitemap veya indekslenebilir şube detayına dönüşmez.
Koordinat yokken link üretilmeme davranışı fixture testinde korunur.

### 12.4. Statik çıktı, SEO ve medya

`npm run build`: Next Webpack export → `out/` → dosya doğrulama ve `_headers`.
Beş ana sayfa, root 404, robots/sitemap, RSC/JS/CSS ve üç PNG fiziksel dosyadır.
Next runtime gerekmez. Yerel QA sunucusu extensionless HTML, düz TXT, 404 ve Pages
başlık kurallarını test eder; uygulama backend'i değildir ve out/ içine girmez.

Domain boşken noindex, robots disallow, boş sitemap ve canonical yok. HTTPS origin
verilince canonical/OG URL üretilebilir; indekslemek için ayrıca
`NEXT_PUBLIC_ALLOW_INDEXING=true` gerekir. CF_PAGES_BRANCH production dalından
farklıysa indeksleme kapanır; geçici Pages hostlarında ayrıca X-Robots-Tag vardır.

Statik HTTP ve hydration sonrası DOM bütün kategori query'lerinde genel katalog
metadata'sını korur. Kategori H2/içerik/aria-current ile gösterilir. Request-time
kategori title ve yanlış-query noindex yerine canonical ana katalog URL'si kullanılır.
Client document.head müdahalesi yoktur. İlk istemci metadata denemesinde hydration
ve sayfa geçişi uyuşmazlıkları E2E ile bulundu; statik metadata sahipliği Next'te
bırakıldı. JS kapalıyken kategori listesi kalır; query filtrelemesi yoktur.
Bu bilinçli statik sınırdır ve test beklentileri bu mimariye göre güncellenmiştir.

StaticImage hazır AVIF/WebP varyantlarını destekler; gerçek fotoğraflar henüz yoktur.
Alt/boyut/lazy/hero önceliği korunur; sunucu optimizasyonu veya görsel servisi yok.
İçerik/dosya düzeni ve performans hedefleri `docs/CONTENT_GUIDE.md` içindedir.

### 12.5. Kontrol ve sorun kaydı

- İlk export kontrolü boş static params yüzünden başarısız oldu; özel uzantı çözümü geçti.
- Unoptimized Next Image tek fallback için sizes attribute üretmiyordu; eski galeri
  testi responsive varyant fixture'ı ile gerçek source sizes/lazy/alt davranışını denetler.
- İlk genişletilmiş E2E: 30/33; doğrudan query metadata hydration sorunu bulundu.
  Sonraki metadata eşitleme denemesi sayfa geçişinde 33/36 verdi. Client head
  müdahalesi kaldırılıp statik genel metadata kararı uygulandı; testlerin filtre,
  title ve navigasyon amaçları yeni render modeline göre korunarak güncellendi.
- İlk izole fixture build'inde tests/setup kopyası eksikti; tam test setup kopyalanınca geçti.
- Eşzamanlı typegen/build bir kez üretilmiş tipleri değiştirerek kontrolü bozdu;
  kontroller sıraya alındı. Aynı çalışma dizininde paralel çalıştırılmaz.
- `.next/types` altında `routes.d 2.ts` vb. kopyalar yeniden görüldü; kaynağa dokunmadan
  `/private/tmp/bal-generated-copies-vem547gq` içine taşınarak korundu.
  Strict TS ayarları gevşetilmedi; tekrar typecheck geçti.

Son kontrol sonuçları, 30 Ekim 2026:

| Kontrol                                      | Sonuç                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| `npm run check`                              | Başarılı; sırayla typecheck, lint, Prettier, Vitest, build, statik HTTP  |
| Vitest                                       | **25/25**, 9 dosya                                                       |
| Production build                             | Static export başarılı; `out/` içinde **68 dosya**, yaklaşık **1.9 MiB** |
| `npm run test:static`                        | **3/3**; HTML/query/RSC, HTTP 404, MIME/HEAD, geçici Pages host noindex  |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` | **36/36**; gerçek statik HTTP üzerinde                                   |
| Responsive                                   | **320, 393, 768, 1280 px**; DOM sınır ve ekran görüntüsü kontrolü        |
| İzole şube export build'i                    | Başarılı; gerçek kaynak/out değişmeden detay sayfası ve beş şube sayımı  |
| Axe 4.14.0                                   | Statik HTTP, 5 sayfa × 4 genişlik; **20 taramada otomatik ihlal 0**      |
| JavaScript kapalı katalog                    | Genel title + 6 kategori + tüm kategoriler seçimi doğrulandı             |

PASS: dört konumun özgün Maps URL’leri ve API=1 yol tarifleri doğru koordinatları
kullanıyor. Geçici adlar korunuyor; detay URL veya LocalBusiness yok. Bütün iç linkler,
metadata, robots/sitemap, 404, ikonlar, kategori ve navbar akışları statik çıktıda geçti.
Lockfile, strict TS ve renk/CSS dosyaları baseline ile aynı. E2E testleri sayımları
merkezi kaynaktan alır; doğrulanmış koordinat beklentileri ayrıca açık olarak testlidir.

WARNING: Firefox 1555 ve WebKit 2370 başlatma denemelerinde executable bulunamadı;
Safari/Firefox ve fiziksel cihazlar test edilmedi. Axe hero geometrik zeminde üç öğe
için kontrastı otomatik ölçemedi; aynı alanın ekran görüntüsü ve değişmeyen Faz 2.1
palet hesapları incelendi. Otomatik tarama tam WCAG sertifikası değildir. Gerçek
fotoğraf performansı ve Cloudflare üzerindeki canlı hosting davranışı henüz test edilmedi.
Katalog query metadata’sı genel tutulur; filtreleme JavaScript gerektirir.

FAIL: son doğrulamada başarısız test veya açık kritik hata yok.

Kanıt: `playwright-report/index.html`, `test-results/.last-run.json`,
`test-results/axe-phase3.json`, `.next/static-export-report.json` ve responsive PNG’ler.
Axe yedeği `/private/tmp/bal-phase3-axe.json`. QA çıktıları Git’e alınmaz.
Güncel kısa rapor: [QUALITY_REPORT](docs/QUALITY_REPORT.md).

### 12.6. Dosyalar ve teslim sınırları

- `next.config.ts`, package scripts ve Playwright config: statik export/preview.
- `src/content/*`, içerik tipleri, eski data/config re-export'ları: tek kaynak ve doğrulama.
- Katalog page/browser/content/selection: statik URL filtreleme.
- Şube page, card/grid, `page.branch.tsx`: gerçek konumlar ve güvenli detay ayrımı.
- `StaticImage`, galeri/logo/ürün/kategori/hero: statik medya entegrasyonu.
- Home/footer/about/contact/PNG: merkezi şube sayımı; tasarım tokenları değişmedi.
- Robots/sitemap/root metadata: statik SEO ve noindex korumaları.
- `scripts/*`, tests/static, ek E2E ve içerik testleri: gerçek out/ doğrulaması.
- AGENTS, README, ARCHITECTURE, ROADMAP, CONTENT_GUIDE, QUALITY_REPORT ve bu plan.

Yeni bağımlılık yok; lockfile ve TypeScript strict ayarları korunur. out/ Git'e girmez.
Yerel önizleme: `npm run build` ardından `npm run preview`, http://127.0.0.1:4173.
Cloudflare Pages için npm run build / out ayarları README'de hazır; bağlantı yapılmadı.
Sonraki adım Faz 4 için gerçek kimlik/görsel/iletişim/domain kabulü ve yayın öncesi
kontrollerdir; bu faz veya deployment kendiliğinden başlatılmaz.
