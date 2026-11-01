# BAL KURUYEMİŞ — Master uygulama ve faz planı

Son güncelleme: **1 Kasım 2026**. Aktif durum: **Faz 4.1-c3 — Galeri/medya altyapısı tamamlandı, CMS entegrasyonu bekliyor**.

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

| Faz                        | Durum          | Sonuç / hedef                                                                       |
| -------------------------- | -------------- | ----------------------------------------------------------------------------------- |
| Faz 1 — Proje altyapısı    | Tamamlandı     | Next.js, tasarım temeli, temel rotalar, testler ve yerel Git                        |
| Faz 2 — Kurumsal tasarım   | Tamamlandı     | Ana sayfa bölümleri, kategori arayüzü, örnek şubeler, galeri ve iletişim            |
| Faz 2.1 — Marka kimliği    | Tamamlandı     | Tabela kimliğiyle uyumlu kırmızı/siyah/beyaz görsel revizyon ve kalite düzeltmeleri |
| Faz 3 — Statik mimari      | Tamamlandı     | Static export, Git içerik kaynakları ve dört gerçek konum                           |
| Faz 4.1 — CMS ön hazırlık  | Yerel hazırlık | Audit, uyum/risk planı ve testli izin politikası; dış entegrasyon yok               |
| Faz 4.2–4.5 — CMS ve yayın | Başlatılmadı   | Pages CMS, güvenilir Actions, Pages preview ve Ali Bey testleri                     |
| Faz 5 — Gerçek varlıklar   | Başlatılmadı   | Logo ve gerçek fotoğraflar                                                          |
| Faz 6 — Kesin bilgiler     | Başlatılmadı   | Şube kimlik/adres/saat ve sosyal hesaplar                                           |
| Faz 7 — Kurumsal yayın     | Başlatılmadı   | Domain/SEO/HTTPS ve yayın onayı                                                     |
| Faz 8 — Bakım              | Başlatılmadı   | İzleme ve iki ayrı geri alma süreci                                                 |

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

## 13. Faz 3 kabul/commit ve Faz 4 hazırlık planı

30 Ekim 2026: ürün sahibi statik mimariyi ve dört konumu kabul etti. Önce mevcut
sürüm kaydedildi; ardından yalnızca plan belgeleri düzenlendi. Faz 4 uygulaması,
GitHub push ve Cloudflare deployment başlatılmadı.

### 13.1. Git teslim kaydı

- İstenen commit mesajı: `feat: complete static site migration and branch locations`.
- Tam hash: **`78df0f7e5505a396b3c7c64f8aaa7d69498cd747`**; kısa hash `78df0f7`.
- Dal: `main`; 65 dosya değişikliği. Şube şablonu rename olarak kaydedildi.
- `.env`, `.env.local`, node_modules, out, .next, coverage ve test raporları
  ignore kontrolünden geçti; Git'e girmedi. `.env.example` yalnızca şablon ayarlar içerir.
- Kaynak ve staged içerikte bilinen sır desenleri tarandı, eşleşme yoktu.
  Bu kontrol tüm sır türlerini tespit etme garantisi değildir.
- Commit sonrasında çalışma ağacı temizdi. Sonradan hazırlanan Faz 4 belgeleri
  çalışma ağacında bırakılır; bu görevde ek commit oluşturulmaz.
- Remote listesi boş. Ekran görüntüsündeki `sametbuluto/balkuruyemis` hedef adayı
  olarak not edildi; uzak depo içeriği/erişimi bu tur doğrulanmadı, bağlantı/push yapılmadı.
- `docs/QUALITY_REPORT.md` bu tur başında boştu; boş içeriği korundu (yalnızca Prettier boş satırı kaldırdı). Önceki Faz 3
  sonuçları §12.5 ve README'de kayıtlı; geçmiş sonuçlar yeni test sonucu gibi sunulmaz.

### 13.2. Faz 4 geliştirme planı

Ayrıntılı plan, içerik matrisi ve kabul listesi: **[PHASE4_PLAN](docs/PHASE4_PLAN.md)**.

1. Gerçek logo ve koyu zemin varyantını al; BrandMark yüzeyleri ve ikon/OG güncellemelerini hazırla.
2. Gerçek mağaza/ürün fotoğraflarını eşleştir; yerel AVIF/WebP varyantlarını ve alt/boyut bilgilerini hazırla.
3. Altı kategoriyi onaylı gerçek fotoğraflarla zenginleştir; mevcut oranları, filtreleri ve tasarımı koru.
4. Şube kartlarını sadeleştir: tek kısa eksik bilgi notu, kompakt görsel/ikon, iki Maps eylemi önerisi.
5. Statik out/ üzerinde regresyon, erişilebilirlik, responsive ve gerçek medya performansını değerlendir.
6. GitHub ve ücretsiz Cloudflare Pages önizleme ayarlarını gözden geçir; yayın işlemlerini sonraki açık talimata bırak.

Bunlar yapılacak işlerdir; uygulama kodu veya içerik verisi bu görevde değiştirilmez.
Mimari, testler, dört koordinat ve kırmızı/siyah/beyaz kimlik korunur.

### 13.3. İçerik kontrol listesi

- [x] Marka adı, slogan, renk yönü ve dört gerçek koordinat hazır.
- [ ] Orijinal SVG/vektör logo; şeffaf PNG ve koyu zemin varyantı.
- [ ] Gerçek fiziksel tabela referansı ve seçilecek hero fotoğrafı.
- [ ] Kuruyemiş/Kahve/Lokum/Baharat/Aktar/Kozmetik kategori fotoğrafları.
- [ ] Gerçek ürün listesi, kategori eşleşmesi, kısa açıklamalar ve fotoğraflar.
- [ ] Konum 1–4 ile eşleştirilmiş gerçek mağaza fotoğrafları.
- [ ] Konum 1–4 için doğrulanmış şube adı/adres/telefon/çalışma saatleri.
- [ ] Resmî Instagram ve WhatsApp adresleri.
- [ ] Sağlanan varlıkların sitede/depo görünürlüğünde yayın uygunluğu.
- [ ] Hedef GitHub depo/görünürlük ve Cloudflare hesap/proje kararları.

Alan adı ücretsiz önizlemenin ön koşulu değildir. Preview için site URL boş,
indeksleme false ve Pages noindex koruması planlanır. Git entegrasyonunun push'la
build/yayın tetikleyebileceği, ilk bağlantıda branch ayarlarının kontrol edilmesi
ve dış önizleme yayınının da deployment olduğu ayrıntılı planda belgelendi.

### 13.4. Doğrulama

Bu tur `npm run check` ve `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`
yeniden çalıştırıldı: strict TypeScript, ESLint ve Prettier başarılı; **25/25 Vitest**,
**3/3 statik HTTP**, static export ve **36/36 Playwright** geçti. out/ yeniden
üretildi; Git'e alınmadı. 320/393/768/1280 px regresyon kontrolleri E2E içinde geçti.
İlk tur boş QUALITY_REPORT dosyasının tek boş satırı nedeniyle Prettier'da durdu;
boş içeriği değiştirmeden satır normalize edildi ve son toplu tur başarıyla tamamlandı.
Firefox/WebKit için yeni bir test veya yeni axe taraması yapılmadı; önceki kısıtlar
geçerli. Uygulama kaynakları/testleri/config'leri Faz 3 commit'iyle aynı.
Yalnızca belge değişiklikleri yapıldı; Faz 4 görsel uygulaması test edildi denmez.

## 14. Master Prompt V5.0 — Faz 4.1 ön inceleme ve yerel hazırlık

### 14.1. Güncel karar ve koruma

30 Ekim'de başlayan V5 çalışması 1 Kasım 2026'da sürdürülüp tamamlandı. V5 önceki
“CMS kapsam dışı” kararını değiştirir: hedef hosted Pages CMS + GitHub + Actions +
Cloudflare Pages. Site static export kalır; uygulamada DB/Prisma/özel API/custom
admin yoktur. CMS hizmetinin kendi auth/veri altyapısı bu sınırla karıştırılmaz.

- Son commit: `78df0f7e5505a396b3c7c64f8aaa7d69498cd747`; baseline `b844bad`.
- Başlangıçta önceki turdan doküman değişiklikleri vardı; korundu. 102 kaynak yolu
  arşivi `/private/tmp/bal-v5-start-epqoprmo/source.tar.gz`, diff aynı dizinde.
- Gerçek .env/otomatik çıktı Git'te değil; bilinen sır desenlerine rastlanmadı.
  package/lockfile exact sürümleri eşleşiyor; yeni paket yok.
- GitHub API 30 Ekim ve 1 Kasım'da HTTP 200, Public, size 0; anonim ls-remote refs
  boş. Local remote boş. Kullanıcı Public/Private tercihi ayrıca soruldu; yanıt yok.
  Mevcut Public durumu tercih olarak varsayılmadı. Hesabın ücretli planı okunmadı.
- Remote/branch/commit/push/App yetkisi/davet/hesap/ödeme/domain/deployment yok.
  Dört koordinat ve uygulama görünümü korunur.

### 14.2. Araştırma ve uygulanabilirlik

[CMS_SETUP](docs/CMS_SETUP.md) resmî kaynaklarla sekiz hedef içerik girişini,
alan/medya/davet/işlem/dal uyumunu, JSON migration risklerini ve küçük işleri tutar.
E-posta collaborator destekleniyor; özel Content Editor RBAC veya editöre özel
branch allowlist varmış gibi davranılmıyor. TypeScript kaynakları raw editor'a
sunulmayacak. Kategori reference koleksiyonundan alınacak; ikinci sabit seçenek
listesi oluşturulmayacak. Rename/delete açıkça kapatılacak; status draft ile yayından kaldırılacak.

Native maxSize/pixel/EXIF kontrolü veya otomatik güvenli save-to-production hook'u
varsayılmıyor. Image yolu tek başına MediaAsset değildir; alt/gerçek boyut/variant
normalizasyonu ayrı build-time işidir. Dış JSON unknown olarak strict şema ve iş
kurallarından geçecek; client tarafına fs taşınmayacak. Henüz veri formatı değiştirilmedi.

[SECURITY](docs/SECURITY.md) güvenilir main koduyla data-only candidate, exact SHA,
PR/required checks, ayrı bot/App yetkileri, race/conflict ve güvenli alternatifleri
anlatır. Public repo Free'de koruma/auto-merge destekler; Private tercihinde uygun
plan kontrol edilmeli. CMS kurulum kaynak manifesti geniş izinler ister; hosted
kurulumun gerçek izinleri görülmedi. En az yetki veya main koruması tamamlandı sayılmaz.

Güvenli ilk alternatif, Ali Bey'in main ref'ine bağlı “Yayına gönder” CMS action'ıdır;
insan inceleme onayı beklemez fakat save sonrası tam otomatik akışla aynı değildir.
Tam otomatik uyandırma/candidate/PR/merge tasarımı ayrı 4.3 entegrasyon testleri ister.
Content-edit script/artifact/cache veya sahte yeşil check'e güvenilmez. Koruma
kanıtlanamazsa yalnız doğrulama + manuel teknik PR merge alternatifiyle durulur;
otomasyon hedefi tamamlandı denmez. Cron tek başına kalıcı yayın garantisi değildir.

### 14.3. Bu görevde uygulanan yerel hazırlık

`src/lib/content-change-policy.ts`: gelecekte güvenilir Git okuyucunun üreteceği
manifest için saf ön kontrol. Planlanan content JSON ve raster medya yolları, A/M,
100644 mode, benzersiz path ve byte/adet limitleri. Kod/workflow/.pages/env,
silme/rename, symlink/submodule/executable, uygunsuz medya ve log satırı enjeksiyonu
reddedilir. Tek hatalı dosya paketin tamamını durdurur.

Bu helper aktif loader/CI değildir; JSON içerik şeması, medya decode/EXIF, Git
nesnelerinden envanter, hesap yetkisi ve atomik merge kontrolünü yapmaz. Dosya boyutu
limitleri başlangıç politika önerisidir, CMS'nin yerleşik yeteneği değildir.

Yeni belgeler: CMS_SETUP, SECURITY, DEPLOYMENT, ROLLBACK, EDITOR_GUIDE. AGENTS,
README, ARCHITECTURE, ROADMAP, CONTENT_GUIDE V5 ile eşleştirildi. Eski görsel
PHASE4_PLAN tarihsel olarak korundu. Önceden boş QUALITY_REPORT bu görevin gerçek
raporuyla dolduruldu; eski Faz 3 sonuçları §12'de kaldı.

### 14.4. İlk sıradaki küçük iş ve kabul kriterleri

**4.1-b: Altı kategori için JSON pilotu.** Aynı id/slug/sıra/metin/null görseller;
tek düzenlenebilir kaynak; strict unknown parse ve iş kuralları; bozuk/şema dışı/
tekrar slug reddi; statik/client veri ve Next config/dev/typecheck/build sırası;
eski/yeni normalize çıktı eşitliği ve kategori E2E. Bu işte CMS App/davet veya
aktif otomatik yayın/tasarım değişikliği yapılmaz. Sonra diğer veri tiplerine tek tek geçilir.

Root .pages.yml 4.2-a'da gerçekten tüketilen JSON kaynaklarına bağlanacak. Bu tur
var olmayan dosyalara CMS bağlamak veya TS'yi ham editöre açmak yerine önce güvenli
veri sözleşmesi planlandı; 4.2 tamamlandı sayılmaz. Küçük görev/kabul matrisi CMS_SETUP'tadır.
Logo/fotoğraf Faz 5, kesin bilgiler Faz 6, domain/SEO Faz 7, bakım Faz 8'dir.

### 14.5. Doğrulama ve manuel kabul

Son toplu yerel sonuç, 1 Kasım 2026:

| Kontrol                    | Sonuç                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------- |
| TypeScript strict          | Başarılı; ayarlar gevşetilmedi                                                                          |
| ESLint / Prettier          | Başarılı; sıfır lint uyarısı                                                                            |
| Vitest                     | **64/64**, 10 dosya; yeni politika için 39 test dahil                                                   |
| Production static export   | Başarılı; **68 dosya**, noindex true                                                                    |
| Statik HTTP                | **3/3**                                                                                                 |
| Playwright / sistem Chrome | **36/36**, gerçek out/ sunucusunda                                                                      |
| Responsive regresyon       | **320, 393, 768, 1280 px** mevcut E2E kapsamında geçti                                                  |
| Kaynak koruma              | App/components/content/features/styles/types, önceki test/config/paket dosyaları Faz 3 commit'iyle aynı |

İlk tur .next/types içindeki `routes.d 2.ts` gibi üretilmiş kopyalar yüzünden typecheck
aşamasında durdu. Kopyalar silinmeden `/private/tmp/bal-v5-generated-copies-l3t_twe_`
içinde korundu; ardından aynı sıradaki tüm check ve E2E kontrolleri geçti. Bu bir
ortam/generated cache sorunudur; strict tipler veya kaynaklar değiştirilmedi.

Yeni code path uygulamaya veya CI'ya bağlı değildir. Önceki 38 testlik hedefli tur,
log güvenliği testi eklendikten sonra son toplu turda 39 politika/64 toplam test oldu.
Yeni axe, WebKit/Firefox, fiziksel cihaz, gerçek CMS veya yayın testi yapılmadı.
Sonuç: PASS yerel hazırlık/regresyon; WARNING harici yetki/entegrasyon ve tercihler;
FAIL son kontrollerde başarısız test yok. Git main/78df0f7, değişiklikler uncommitted.

Gerçek CMS edit/davet/yetki, GitHub branch koruması ve otomatik aktarım, Cloudflare
build/deployment/rollback testleri çalıştırılmadı; yerel policy bunları kanıtlamaz.
Resmî doküman araştırması ve anonim GitHub okuması dışında harici işlem yapılmadı.

Ürün sahibinin manuel kabulü: Public/Private tercihi, sekiz içerik girişinin kapsamı,
yetki/otomasyon sınırlamaları ve 4.1-b kabul ölçütleri. Çalışan CMS hesabı veya dış
preview yok; onları test etmesi beklenmez. Yeni sonuçlar [QUALITY_REPORT](docs/QUALITY_REPORT.md) içinde.

## 15. Faz 4.1-b — Kategori JSON migration pilotu

### 15.1. Başlangıç ve kapsam

1 Kasım 2026: ürün sahibi V5/4.1-a'yı kabul etti; yalnız kategori geçişini yetkilendirdi.
Git main/78df0f7; önceki doküman ve güvenlik politikası değişiklikleri korundu.
Kaynak snapshot: `/private/tmp/bal-phase41b-nUr6iB/source-before.tar.gz` ve
working-before.diff. Eski TS literal kayıtları güvenilir AST ile çıkarıldı;
`categories-before.ts/json` aynı çalışma dizininde korundu. Değerlendirme için
çalıştırılabilir ikinci kategori listesi veya sabit CMS veri hash testi eklenmedi.

Ürünler/şubeler/galeri taşınmadı; .pages.yml/App/hesap/secret/commit/push/deploy yok.
4.1-a policy ve testleri korunur. Site tasarımı/rotalar/filtre davranışı değişmedi.

### 15.2. Eski/yeni karşılaştırma

7 alan karşılaştırıldı: id, slug, name, description, image, sortOrder, status.

| ID                 | Slug      | Ad        | Sıra | Durum     | 7 alan |
| ------------------ | --------- | --------- | ---- | --------- | ------ |
| category-kuruyemis | kuruyemis | Kuruyemiş | 1    | published | Eşit   |
| category-kahve     | kahve     | Kahve     | 2    | published | Eşit   |
| category-lokum     | lokum     | Lokum     | 3    | published | Eşit   |
| category-baharat   | baharat   | Baharat   | 4    | published | Eşit   |
| category-aktar     | aktar     | Aktar     | 5    | published | Eşit   |
| category-kozmetik  | kozmetik  | Kozmetik  | 6    | published | Eşit   |

Eski 6, yeni 6; kayıp/değişen kayıt 0. Açıklamalar ve altı image:null değeri de birebir.
Canonical JSON SHA-256 (sıralı kayıtlar):
`f9ef00bbdcb4b05a9971aee9e4491c5e4c0cf176447e1f5b52254e07a1626aad` hem önce hem sonra aynı.
Karşılaştırma kanıtı `/private/tmp/bal-phase41b-nUr6iB/parity-report.json`.
Bu tarihsel hash gelecekte geçerli CMS düzenlemelerini engelleyen test değildir.

### 15.3. Uygulama ve dosyalar

- content/categories altında ID adına göre altı JSON: tek düzenlenebilir kaynak.
- categories.ts eski literal listeyi kaldırıp loadCategories erişimi ve eski importlar
  için bellekteki productCategories snapshot'ını sunar. İkinci düzenlenebilir liste yoktur.
- categories.server.ts: Node/RSC dosya yükleme, normal dosya/UTF-8/256 KiB kontrolü;
  boş/kayıp/bozuk kaynakta hata; her query/render güncel veri okur, fallback yok.
- category-schema.ts: unknown parse, strict alan/tip, ID-dosya eşleşmesi, benzersizlik,
  MediaAsset/varyant doğrulaması; published/draft seçimi. Tip sistemi gevşetilmedi.
- queries ve root içerik denetimi yeni getCategories yolunu kullanır. Client mevcut
  server props'unu kullanır; fs client'a girmez, statik hostta source JSON/API yoktur.
- Yeni schema/loader testleri; yeni E2E source gizliliği/API yokluğu; izole kategori
  export sözleşme script'i. Mevcut testler kaldırılmadı.
- Mevcut şube export fixture script'i yalnız content/ kopyalama bağımlılığıyla güncellendi.
- AGENTS/README/CONTENT_GUIDE/CMS_SETUP/ARCHITECTURE/ROADMAP ve kalite/plan kayıtları.

Bu pilot için manifest/preprocessing/generator veya yeni paket gerekmedi. Next config,
komutlar ve strict ayarları aynı. JSON sonrası dev'de tam sayfa yenileme gerekir;
otomatik HMR vaat edilmez. Statik yayında yeniden build gerekir.

### 15.4. Doğrulama

Son sonuç: **PASS**, 1 Kasım 2026.

| Kontrol                    | Sonuç                                                                        |
| -------------------------- | ---------------------------------------------------------------------------- |
| npm run check              | TypeScript strict, ESLint, Prettier, Vitest, build ve HTTP başarılı          |
| Vitest                     | **103/103**, 12 dosya; önceki 64 test ve 39 yeni kategori testi              |
| Production static export   | **68 dosya**, noindex true; rotalar aynı                                     |
| Static HTTP                | **3/3**                                                                      |
| Playwright / sistem Chrome | **39/39**, out/ üzerinden; kategori/source gizliliği dahil                   |
| Responsive                 | **320, 393, 768, 1280 px** mevcut kırpılma/taşma kontrolleri geçti           |
| İzole kategori export      | **3/3**; malformed JSON ve unknown field build reddi; draft görünmezliği     |
| İzole şube export          | **1/1**; yeni content/ konumuyla mevcut şablon çalışıyor                     |
| Veri/koruma                | **6/6 kayıt, 7/7 alan eşit**; 13 korunan dosya başlangıç arşiviyle byte eşit |

Kategori fixture kanıtı: `/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-category-export-4gDIrh`;
şube fixture: `/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-branch-export-603FFr`.
Koruma kanıtı: çalışma arşivindeki preservation-report.json. Kaynak kategori JSON'u
ve server TS yolu hostta 404; client filtre için yeni API/content isteği yok.
Playwright HTML: playwright-report/index.html, durum test-results/.last-run.json.
Bu QA çıktıları Git'e girmez. Yeni dependency/commit/push/deployment yok.

WARNING: otomatik JSON HMR eklenmedi; dev'de JSON düzenlemesinden sonra sunucuyu
tekrar başlatıp sayfayı yenileyin. Görsel decode ve gerçek CMS/Pages entegrasyonu,
Safari/WebKit/Firefox/fiziksel cihaz testi bu görevde yok. Son testlerde FAIL yok.

İlk typecheck tekrar oluşan .next/types/routes.d 2.ts kopyası yüzünden durdu;
numaralı generated kopyalar silinmeden aynı çalışma dizininin generated-type-copies
altına taşındı. Strict veya kaynaklar değiştirilmedi; production build sonra geçti.

### 15.5. Sonraki faz önerisi — başlatılmadı

4.1-c'de önce ürün sözleşmesi ve kategori ID referansları; ardından şube kimliği/
koordinat ayrımı, galeri/medya ve site metinleri ayrı işler olarak taşınabilir.
Her adımda birebir veri karşılaştırması, strict dış JSON ve gerçek statik build
kontrolü gerekir. Görsel decode/EXIF/optimizasyon ve CMS editörü farklı aşamalardır.
Bu turda diğer veri tipleri veya .pages.yml oluşturulmadı.

## 16. Faz 4.1-c1 — Ürün JSON içerik mimarisi

### 16.1. Başlangıç ve veri eşitliği

1 Kasım 2026: 4.1-b kabul edildi; yalnız ürün geçişi yetkilendirildi. Git main/78df0f7;
4.1-a/b dahil önceki uncommitted değişiklikler korundu. Başlangıç kaynak arşivi,
diff ve SHA manifesti `/private/tmp/bal-phase41c1-e1237sbd/` içinde. Eski ürün TS
kaynağı readonly boş listeydi; yeni JSON koleksiyonu da **0 ürün**. Gerçek veya
örnek ürün JSON'u oluşturulmadı; content/products yalnız `.gitkeep` içerir.

Başlangıca göre altı kategori JSON'u byte eşit. Dört koordinat, şube/galeri/site/sosyal,
App/components/features/styles/types/config kaynakları, 4.1-a policy/test, paket/lock,
strict TS, Next ve Playwright config dahil **75 korunan dosya** byte eşit doğrulandı.
Kanıt: preservation-report.json. Kategori schema'nın ortak alan/görsel yardımcıları
content-schema.ts'e çıkarıldı; kategori sözleşmesi korunup önceki testleri tekrar geçti.

### 16.2. Ürün sözleşmesi ve güven sınırı

Tek kaynak `content/products/product-<id>.json`; dosya başına bir ürün.
Sekiz zorunlu alan: **id, slug, name, categoryId, description, images, sortOrder, status**.
ID product- önekli ve dosya adıyla eşleşir; ID/slug benzersizdir. Ad/açıklama boş
olmayan UTF-8 metin, images boş dizi veya strict MediaAsset dizisi, sıra negatif
olmayan güvenli tam sayı, status yalnız draft/published olabilir. Fiyat alanı yoktur.

categoryId aynı server/build okumasında gerçek kategori JSON loader'ından gelen
kimliklere karşı doğrulanır; ikinci sabit kategori listesi yoktur. Draft kategoriye
referans geçerlidir; yalnız ürün ve kategorisi birlikte published ise ziyaretçiye
aktarılır. Draft ürünün yanlış referansı da reddedilir. Bilinmeyen/eksik alan, yanlış
tip/değer, bozuk JSON/UTF-8, ID-dosya uyuşmazlığı, mükerrer ID/slug, symlink, alt
klasör, JSON dışı dosya ve 256 KiB üstü dosya build'i durdurur. Boş koleksiyon
geçerli; kayıp dizin/bozuk veride fallback yoktur.

products.server.ts Node/RSC okuması yapar. products.ts yalnız erişim/uyumluluk
snapshot'ıdır; eski TS ürün literal listesi kaldırıldı. Queries/root tüm kayıtları
doğrular; client'a yalnız published props gider. Node fs/kaynak JSON statik hosta
ve client bundle'a taşınmaz. Yeni API, ürün rotası, Product schema veya metadata
özelliği eklenmedi; mevcut genel katalog SEO'su ve filtre URL davranışı korundu.
Görsel sözleşmesi ve mevcut dosya varlığı kontrolü var; upload/decode/EXIF kurulmadı.

### 16.3. Dosya kaydı

- content/products/.gitkeep: gerçek ürün bekleyen boş koleksiyon.
- Yeni product-schema.ts/products.server.ts ve ikisinin test dosyaları.
- content-schema.ts: kategori/ürün ortak strict alan ve medya yardımcıları;
  category-schema.ts bu yardımcıları kullanır, aynı kuralları sürdürür.
- products.ts, queries.ts, content.server.ts: JSON tek kaynağına erişim ve yayın filtresi.
- categories.server.test.ts: draft kategori testinde bağımsız ürün fixture'ı.
- tests/e2e/catalog-assertions.ts, products-json.spec.ts, site.spec.ts:
  mevcut boş durum denetimi korunur, gelecekte gerçek ürün varsa kartlar doğrulanır.
- scripts/test-product-export.mjs: geçici kaynakta üç negatif build ve görünürlük testi.
- AGENTS/README/CONTENT_GUIDE/ARCHITECTURE/CMS_SETUP/ROADMAP/QUALITY_REPORT ve bu plan.

Mevcut testler kaldırılmadı. Ürünlerin gerçek kaynağını kalıcı olarak boş olmaya
zorlayan test eklenmedi; boş koleksiyon davranışı temp fixture ile sınanır.

### 16.4. Son doğrulama

| Kontrol                    | Sonuç                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| npm run check              | TypeScript strict, ESLint, Prettier, Vitest, static export ve HTTP başarılı                  |
| Vitest                     | **146/146**, 14 dosya; önceki 103 + 43 yeni ürün testi                                       |
| Production static export   | **68 dosya**, noindex true; rotalar aynı                                                     |
| Statik HTTP                | **3/3**                                                                                      |
| Playwright / sistem Chrome | **42/42**, gerçek out/ sunucusunda                                                           |
| Responsive                 | **320, 393, 768, 1280 px**; mevcut taşma/kırpılma kontrolleri ve fixture ekranları           |
| İzole ürün export          | **4/4**: malformed/unknown field/invalid reference build reddi; published/draft/SEO kontrolü |
| İzole kategori export      | **3/3**, önceki pilot sözleşmesi tekrar geçti                                                |
| İzole şube export          | **1/1**, mevcut detay üretimi korundu                                                        |
| Kaynak/veri koruma         | 75 dosya byte eşit; 6 kategori aynı; eski/yeni gerçek ürün sayısı 0                          |

Ürün fixture'ı yalnız temp kopyada published ürün, draft ürün ve draft kategoriye
bağlı published ürün üretir. Published ürün katalogda görünür; iki gizli kaydın
ID/ad işaretleri HTML/RSC/TXT/XML/JSON/JS çıktılarında yoktur. Katalog dört genişlikte
Chrome ile denendi, ekranlar incelendi; kaynak JSON yolu 404. Gerçek out ve içerik
fixture verisiyle değiştirilmedi. Gerçek katalog/filtre/navigasyon/şube/SEO testleri
42 E2E içinde geçer. test-results ve playwright-report Git dışındadır.

İlk izole tarayıcı denemeleri temp dizinin macOS /var → /private/var yol farkıyla
404 sunduğu için başarısız oldu. Fixture sunucusuna realpath kökü verilerek düzeltildi;
son tur 4/4 geçti. Uygulamanın statik sunumu veya tasarımı bu nedenle değiştirilmedi.
Bu tur typecheck'de önceki generated kopya sorunu yaşanmadı; strict ayarlar değişmedi.

Kanıt dizinleri:

- Ana log/arşiv/koruma: `/private/tmp/bal-phase41c1-e1237sbd/`.
- Ürün: `/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-product-export-8AydTy`.
- Kategori: `/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-category-export-xg9mEJ`.
- Şube: `/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-branch-export-o5TMlr`.

### 16.5. Teslim ve sınırlar

**PASS:** Ürün JSON sözleşmesi, referans/yayın güvenliği ve yerel statik regresyon tamamlandı.
**WARNING:** Gerçek ürün/fotoğraf bekleniyor. JSON düzenlemesi sonrası dev'i yeniden
başlatıp sayfayı yenileyin; yayında yeniden build gerekir. Görsel yükleme/decode,
Pages CMS editörü/hesap/.pages.yml/CI entegrasyonu ve WebKit/Firefox/fiziksel cihaz
bu görevde test edilmedi; önceki tarayıcı kısıtları geçerli. Yeni axe taraması yok.
**FAIL:** Son kontrollerde başarısız test veya açık kritik hata yok.

Git main/78df0f7; değişiklikler uncommitted, önceki 4.1-a/b korunur. Commit, remote,
push, deployment, secret veya hesap oluşturulmadı. Yeni bağımlılık yok. Şube/galeri/
ana sayfa metin geçişi yapılmadı. Faz 4.1-c2 başlatılmadı; sonraki veri türü ayrıca
istenirse, referans/kimlik/yayın ayrımı ve birebir koruma testleriyle ele alınabilir.
Ürün sahibi yerelde boş katalog/kategori geçişlerini değerlendirebilir; çalışan
CMS editörünün var olduğu veya kullanıcıdan CMS testi beklendiği iddia edilmez.

## 17. Faz 4.1-c2 — Şube JSON geçişi ve veri mimarisi teslimi

### 17.1. Başlangıç, veri eşitliği ve koruma

1 Kasım 2026: ürün sahibi 4.1-c1'i kabul etti; yalnız şube JSON geçişini ve başarılı
4.1-a/b/c1/c2 çalışmalarının yerel commit'lerini yetkilendirdi. Başlangıç main/78df0f7;
önceki uncommitted içerik/policy/belgeler korundu. 130 kaynak dosyasının başlangıç
arşivi ve SHA manifesti `/private/tmp/bal-phase41c2-fxkd65p4/` içindedir.

Dört eski TS kaydı, **14 alanın tamamı birebir** korunarak ayrı JSON dosyalarına taşındı:

| Dosya                            | Latitude  | Longitude | Tür / durum          |
| -------------------------------- | --------- | --------- | -------------------- |
| content/branches/location-1.json | 38.362633 | 27.148943 | location / published |
| content/branches/location-2.json | 38.374462 | 27.183882 | location / published |
| content/branches/location-3.json | 38.367344 | 27.148973 | location / published |
| content/branches/location-4.json | 38.378593 | 27.163704 | location / published |

Slug, adres, telefon, çalışma saatleri ve WhatsApp null; images boş dizi kaldı.
Geçici Konum 1–4 adları, açıklamalar, sıra ve özgün Maps URL'leri de aynı.
Eski/yeni canonical JSON SHA-256:
`5185cc775a8e564cdd4e35af5cf97ea018904d5f746df7d880356aed6bd28c4b`.
Kanıt: branches-before.json ve parity-report.json. Bu migration karşılaştırmasıdır;
kalıcı olarak bütün koleksiyonu dört kayda kilitleyen bir hash testi eklenmedi.
Dört özgün koordinatın korunması ayrıca unit/E2E beklentisidir.

Kategori/ürün kaynakları, loader/schema/helpers, önceki export script'leri,
paket/lock/strict/config, renkler, feature/UI kaynakları dahil **82 korunan dosya**
başlangıç arşiviyle byte eşit doğrulandı. Header yalnız server/client sınırı için
ayrıldı; tasarım ve menü davranışı korunur. Galeri, site metni veya veri modeli taşınmadı.

### 17.2. Sözleşme ve kimlik onayı

Şubelerin tek düzenlenebilir kaynağı content/branches/<id>.json. branches.ts yalnız
loader erişimi ve uyumluluk snapshot'ı sunar; örnekler ayrı TS kaynağında kalır.
14 zorunlu alan: id, slug, name, description, coordinates, googleMapsUrl, address,
phone, openingHours, whatsappUrl, images, sortOrder, status, contentKind.

Strict schema unknown/eksik alanı, yanlış tip/değer/ID-filename, bozuk JSON/UTF-8,
mükerrer ID/slug/koordinat/normalize adresi ve örnek kaydı reddeder. Koordinat finite
ve coğrafi aralıkta olmalı; Maps HTTPS/host/yol ve sayısal koordinat eşitliği kontrol edilir.
Doğrulanamayan kısa Maps URL kabul edilmez. Nullable iletişim/saat ve MediaAsset dizisi
korunur; images[0] mevcut kapak, dizi detay galerisidir. Upload/decode kurulmadı.

branch-identity.ts teknik onay listesinde yalnız ID + kimlik fingerprint'i tutulur;
şube bilgilerinin ikinci düzenlenebilir kopyası yoktur. Hash sırası id/slug/ad/adres/
latitude/longitude. Şu an liste boş, kimliği onaylı gerçek şube **0**. JSON'daki verified
tek başına yetki değildir; kimlik hash'i onayla eşleşmeden build durur. Kimlik alanı
değişirse ürün sahibinin doğrulamasıyla teknik onay yenilenir; telefon/saat/görsel/
status bu hash'e dahil değildir. Bu yerel kapı gerçek GitHub koruması/CI kuruldu demek değildir.

location yalnız konumdur; slug null, detay/LocalBusiness yok. Yalnız onaylı verified +
published kayıt detay ve uygun SEO sitemap girdisi üretir. Draft kayıt kart/sayım/
detay/sitemap/client çıktısına girmez. Yeni LocalBusiness üretimi eklenmedi.
Yeni fiziksel şube JSON eklenince merkezi sayım güncellenir; kimlik eşleşmesinde
aynı ID güncellenir, ikinci fiziksel kayıt açılmaz. Eksik tanımlayıcılarla iki farklı
kaydın gerçek dünyada aynı yer olduğunu otomatik araştırma iddiası yoktur.

### 17.3. Çözülen teknik sorunlar ve dosyalar

İlk strict kontrolde ortak nesnenin status literal tipi ve test union daraltması
hataları bulundu; tipleri gevşetmeden düzeltildi. İlk loader testindeki aynı modül
binding mock'u gerçek dosya okuma/seçim testiyle değiştirildi.
İlk export, Header → config/site → branches zincirinde Node fs client import'unu
reddetti. header.tsx server wrapper ve header-navigation.tsx client etkileşim
bileşenine ayrıldı; logo server slotu ve navigation props kullanıldı. CSS/DOM ve
klavye/Escape/aktif rota davranışları korundu; son build/E2E geçti.

- Yeni: dört content/branches JSON, branch-schema.ts, branches.server.ts,
  branch-identity.ts, schema/loader testleri, tests/e2e/branches-json.spec.ts.
- Güncellenen: branches.ts, content.server.ts; Header sınırı; test-branch-export.mjs.
- Test export script'i TS literal eklemek yerine geçici JSON + ayrı teknik onay üretir.
  Gerçek kaynak/out'a fixture yazmaz. Mevcut testler kaldırılmadı.
- AGENTS/README/CONTENT_GUIDE/ARCHITECTURE/CMS_SETUP/SECURITY/ROADMAP/QUALITY_REPORT/plan.

### 17.4. Son kontroller

| Kontrol                    | Sonuç                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| npm run check              | TypeScript strict, ESLint, Prettier, Vitest, build, HTTP başarılı          |
| Vitest                     | **210/210**, 16 dosya; önceki 146 + 64 yeni şube testi                     |
| Production static export   | **68 dosya**, noindex true; gerçek konum detay sayısı 0                    |
| Statik HTTP                | **3/3**                                                                    |
| Playwright / sistem Chrome | **45/45**; gerçek out/ sunucusunda                                         |
| Responsive                 | **320, 393, 768, 1280 px**, menü/taşma/kırpılma ve izole detay ekranları   |
| Kategori export            | **3/3**                                                                    |
| Ürün export                | **4/4**                                                                    |
| Şube export                | **5/5**; dört negatif build ve onaylı kimlik/yeni şube/draft/HTTP kontrolü |
| Veri koruma                | **4/4 kayıt, 14/14 alan eşit**; 82 kaynak dosyası byte eşit                |

Şube fixture'ı mevcut ID'yi onaylı verified kayda yükseltir; yeni fiziksel şube ve
onaylı draft kayıt ekler. Sayım 5 olur, draft hariç kalır; onaylı detaylar 200,
location/draft/bilinmeyen detaylar 404'tür. Test domaini example.com ile yalnız
izole build'de indeksleme açılıp sitemap'in sadece onaylı/published detayları içerdiği
doğrulanır. Draft işaretleri HTML/RSC/TXT/XML/JSON/JS çıktılarında bulunmaz.
Gerçek build noindex ve boş sitemap olarak kalır; deployment yapılmaz.

Loglar/parity/preservation arşivi: `/private/tmp/bal-phase41c2-fxkd65p4/`.
Kategori fixture: bal-category-export-AWTcB3; ürün: bal-product-export-0bcUOc;
son şube fixture yolu aynı arşivin branch-fixture-final.log dosyasındadır.
Tarayıcı raporu playwright-report/, ekranlar test-results/; Git dışındadır.

### 17.5. Git teslimi ve sınırlar

Önceki 4.1-a/b/c1 ve bu şube geçişi birlikte kontrol edildi. Kod/test ve belgeler
iki yerel commit olarak ayrılır. Kod/test commit: **`11b28847a041e4f6a49fc2cef8e5453daf7fb30e`**.
Belge teslim commit mesajı: `docs: record CMS content migrations and quality results`.
Son belge commit hash'i `git log -1` ve ürün sahibine teslim yanıtından okunur;
belgenin kendi hash'ini kendi içine yazması gerekmez.

Git ignore/aday dosyalar kontrol edildi; gerçek env/sır dosyası, node_modules,
.next, out, coverage ve test raporları commit'e alınmaz. Bilinen sır desenleri
aday kaynaklarda taranır; bu tarama tüm sır çeşitlerini bulma garantisi değildir.
Commit öncesi staged içerik ve diff gözden geçirilir. Remote/push/deploy yoktur.

PASS: Şube JSON geçişi ve yerel regresyon tamamlandı. WARNING: Gerçek şube kimlik,
adres/telefon/saat/fotoğrafları bekleniyor. JSON sonrası dev'i yeniden başlatıp
sayfayı yenileyin; yayın için build gerekir. Yeni WebKit/Firefox/fiziksel cihaz/axe,
CMS/CI/Cloudflare testi yapılmadı. FAIL: Son kontrolde başarısız test veya kritik hata yok.
.pages.yml, galeri/site metni geçişi, backend/admin/DB/secret/hesap/deployment yok.
Faz 4.1-c3 başlatılmadı; sonraki çalışma ayrıca talimat gerektirir.

## 18. Faz 4.1-c3 — Galeri/medya mimarisi ve güvenli statik çıktı

### 18.1. Başlangıç, kapsam ve ürün kabulü

1 Kasım 2026. Başlangıç Git main/0507348, çalışma ağacı temizdi. Faz 4.1-a/b/c1/c2
kaydı korundu; 141 kaynak dosyası snapshot ve manifesti
`/private/tmp/bal-phase41c3-z6h_8nuw/` içinde. Bu görev yalnız galeri/medya katmanıdır.
Galeri önce TS boş listeydi, şimdi content/gallery/.gitkeep ile boş JSON koleksiyonu;
gerçek fotoğraf ve ürün eklenmedi. Dört şube ve altı kategori JSON'u byte eşit.
38 kritik kaynak (tüm önceki JSON, şube kimlik onayı, policy, strict ana TS/Next config,
StaticImage/PhotoGallery, stiller ve diğer korunan dosyalar) arşivle byte eşit doğrulandı.

Ürün sahibinin kesin kabul ölçütü plana işlendi: Ali Abi gerçek panelden ürün adını,
fotoğrafı veya ana sayfa metnini değiştirir; otomatik kontroller ve korunan aktarım
geçer; Cloudflare'da yeni içerik ve kaynak SHA kanıtlanır. Kullanıcı kod/piksel ölçüsü
girmez. Üç gerçek uçtan uca akış geçmeden CMS tamamlandı denmez. Bu faz hesap/CI/
push/yayın kurmaz; yerel fixture testleri bu kabulün yerine geçmez.

### 18.2. Veri ve dosya mimarisi

Ayrıntılı sözleşme ve resmî CMS kaynakları: [MEDIA_GUIDE](docs/MEDIA_GUIDE.md).

- content/gallery/<id>.json: id/url/alt/width/height/sortOrder/status/usages ve isteğe
  bağlı responsive variants. usages: home-hero / brand-gallery / branches-gallery;
  aynı görsel bir kayıtla birden çok global yüzeyde kullanılabilir.
- Ürün/kategori/şube görselleri kendi JSON kaynaklarında kalır; ikinci medya registry'si yok.
  MediaAsset'e optional status/sortOrder eklendi; eski kayıtlar published/dizi sırası
  varsayımını korur. Galeride bu iki alan zorunludur. Draft medya ebeveyn published
  olsa bile render/props ve statik dosya çıktısından çıkarılır.
- public/images/{brand,products,categories,branches,gallery}/ yalnız .gitkeep ile hazır.
  Fiziksel dosya sahipliği görünürdür; örnek işletme fotoğrafı konmadı.
- gallery-schema/server, media-selection ve uyumluluk gallery erişimi. Hero ayrı
  kullanım alanını seçer, yoksa ortak galerinin ilk published görseline döner.
- StaticImage ve PhotoGallery dosyaları değişmedi; srcset/sizes, lazy ve hero yükleme
  önceliği korunur. Root async build-time doğrular; backend/runtime API yoktur.

### 18.3. Dosya güvenliği ve gerçekten çalışanlar

Sharp 0.35.5 Next ile zaten kurulu ve lockfile'da bulunan sürümdü; exact doğrudan
bağımlılık oldu. Yeni sürüm/native binary yüklenmedi. İmza + decoder MIME + gerçek
pixel decode uygulanır. JPEG/PNG/WebP/AVIF dışında dosya reddedilir; SVG bu fazda
marka klasöründe de kapalıdır. Güvenli ASCII yerel yol, traversal/query/hash/yüzde
kodlama/backslash/symlink reddi, eksik dosya ve global medya ID tekrarı kontrolleri var.

Politika: dosya/çıktı 5 MiB, toplam 20 MiB, en fazla 128 kaynak görsel, 8000 px kenar,
24 MP. JSON genişlik/yükseklik EXIF orientation uygulanmış gerçek boyutla; varyantlar
format/genişlik/oranla eşleşir. Metadata header okumakla yetinilmez; stats full decode
bozuk/truncated dosyayı reddeder. Draft/orphan dosyalar da kaynakta doğrulanır.

Standart build: media:check → Next static export → temiz medya export → verify-export.
TS CLI Node 20 için .generated/media-tools altında strict CJS derlenir; ana TS ayarı
aynıdır. Yardımcı eski Node resolution için TS6 deprecation uyumluluğu ayrı config'tedir;
TS7 öncesi yeniden değerlendirilmelidir. .generated Git/lint/format/hosting dışında.

Next public dosyalarını ham kopyaladığı için yalnız üretilmiş out/images yeniden
oluşturulur. Published referanslar auto-orient/sRGB/re-encode edilip EXIF/XMP/IPTC/ICC'siz
yazılır; draft ve orphan raw dosyalar 404 olur. Kaynak görsel/JSON değiştirilmez.
Input fingerprint değişirse build reddedilir; bu yerel kapı gerçek exact Git SHA
candidate/CI güvenliğinin yerine geçmez. Başarısız build out'u yayımlanmaz.

### 18.4. Henüz çalışmayan/entegrasyon bekleyenler

CMS hesabı, .pages.yml, upload ekranı, action/CI, GitHub push veya Cloudflare yoktur.
CMS image alanı yalnız dosya yolunu seçer; MediaAsset object list'e eşleme ve güvenilir
width/height yazan upload adaptörü henüz kurulmadı. Ali Abi'den piksel ölçüsü istemeyen
editörün gerçek round-trip testi bekler. Mevcut sözleşmede ölçüler zorunlu ve doğrulanır.

Yeniden encoding/sıkıştırma vardır ama dosyanın daima küçülmesi vaat edilmez. Otomatik
resize/kadraj veya responsive varyant üretimi yoktur; hazırlanmış varyantlar doğrulanır.
Kaynak/Git EXIF temizlenmez; public repo'ya gerçek dosya yüklemeden önce kaynak
mahremiyet kontrolü ayrıca gerekir. Yerel dev ham public dosyalarını sunar; temiz
üretim davranışı build + preview ile görülür. Gerçek fotoğraf performansı ölçülmedi.

### 18.5. Testler ve sorun kaydı

| Kontrol                             | Sonuç                                                                 |
| ----------------------------------- | --------------------------------------------------------------------- |
| TypeScript strict, ESLint, Prettier | Başarılı                                                              |
| Vitest                              | **262/262**, 18 dosya; önceki 210 + 52 galeri/medya testi             |
| Production static export            | **67 dosya**, noindex true, aynı rotalar                              |
| Static HTTP                         | **3/3**                                                               |
| Playwright / sistem Chrome          | **48/48**, gerçek out/ üzerinde                                       |
| Responsive                          | **320, 393, 768, 1280 px**; gerçek boş site ve izole görsel fixture   |
| Kategori / ürün / şube export       | **3/3, 4/4, 5/5**, gerçek npm build pipeline'ıyla                     |
| Medya export                        | **5/5**; üç negatif build, temiz yayın/responsive ve drift reddi      |
| Kaynak / Git fotoğraf kurtarma      | Orijinaller byte eşit; geçici repoda 3 commit'li kurtarma testi geçti |

67 dosya önceki 68'e göre bir adet az: raw public/images/.gitkeep de artık out'a
bırakılmaz; ana HTML/SEO/PNG/RSC dosyaları korunur. Gerçek galeri/medya dosyası 0.
Yeni medya unit testleri missing alt/path/MIME/dimensions/file/ID, status/sıra, decode,
symlink, limits, variant oranı, EXIF/rotation ve Git kurtarmayı kapsar.

Medya fixture'ı yalnız temp kopyada geometrik test görüntüleri, ürün ve branch image
metadata'sı üretir. Hero eager/high, galeri lazy/srcset/sizes, iki ebeveynde fotoğraf
render'ı, dört genişlik, doğru MIME ve draft/orphan kaynak dosyaları 404 doğrulanır.
EXIF/ICC'siz çıktı ve orijinal byte eşitliği testlidir. Bozuk JSON, eksik alt ve bozuk
fotoğraf build'i durdurur. Sonradan dosya değişikliği fingerprint reddi testlidir.

İlk testlerde mock binding/fixture ID hataları giderildi. İlk browser beklemesi ekran
dışındaki lazy şube fotoğrafını yüklenmiş varsaydığı için durdu; her görsel görünür
alana alınarak gerçek decode test edildi. Üretilmiş JS ilk lint'e dahil olmuştu;
yalnız .generated ignore edildi, kaynak kuralları gevşetilmedi. Yardımcı derleyicide
Node resolution uyumluluğu ayarlandı. Önceki .next/types/routes.d 2.ts generated kopya
hatası bir kez tekrarlandı; ana strict/exclude değiştirilmeden sırayla kontrol tekrar geçti.

Kanıtlar:

- Ana arşiv/loglar/preservation-report: /private/tmp/bal-phase41c3-z6h_8nuw/.
- Medya: bal-media-export-VqSdAU; kategori: bal-category-export-jzYa4n;
  ürün: bal-product-export-J6CMEO; şube: bal-branch-export-FHnWBP temp dizinleri.
- playwright-report/ ve test-results/ Git dışında. .generated medya raporları Git dışında.

### 18.6. Teslim, Git ve sıradaki öneri

Başlangıç 0507348 üzerine mevcut değişiklikler korunup yalnız yerel anlamlı commit
oluşturulur: `feat: add CMS-ready gallery and validated static media pipeline`.
Commit hash'i teslim yanıtında/git log'da raporlanır. Gerçek env, node_modules,
.next, out, .generated ve test raporları commit'e girmez; bilinen sır desenleri taranır.

PASS: Yerel galeri/medya altyapısı ve regresyon tamamlandı. WARNING: gerçek fotoğraf,
CMS metadata adaptörü, editör/CI/Cloudflare ve Firefox/WebKit/fiziksel cihaz testleri
beklenir; yeni axe taraması yapılmadı. FAIL: Son kontrollerde başarısız test veya kritik
hata yok. Ana sayfa/kurumsal metinler, admin/backend/DB ve 4.1-c4 başlatılmadı.
Önerilen c4: site/ana sayfa düz metin sözleşmesini ve upload metadata adaptörü tasarımını
ayrı küçük işlere bölmek; sonra gerçek CMS round-trip ve otomatik yayın kabulünü yürütmek.
