# BAL KURUYEMİŞ — Master uygulama ve faz planı

Son güncelleme: **8 Kasım 2026**. Aktif durum: **Faz 4.2-E2 — Yerel trusted CI ve gerçek Docker doğrulaması tamamlandı; uzak run yapılmadı**.

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

| Faz                              | Durum              | Sonuç / hedef                                                                       |
| -------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| Faz 1 — Proje altyapısı          | Tamamlandı         | Next.js, tasarım temeli, temel rotalar, testler ve yerel Git                        |
| Faz 2 — Kurumsal tasarım         | Tamamlandı         | Ana sayfa bölümleri, kategori arayüzü, örnek şubeler, galeri ve iletişim            |
| Faz 2.1 — Marka kimliği          | Tamamlandı         | Tabela kimliğiyle uyumlu kırmızı/siyah/beyaz görsel revizyon ve kalite düzeltmeleri |
| Faz 3 — Statik mimari            | Tamamlandı         | Static export, Git içerik kaynakları ve dört gerçek konum                           |
| Faz 4.1 — CMS ön hazırlık        | Yerel hazırlık     | Audit, uyum/risk planı ve testli izin politikası; dış entegrasyon yok               |
| Faz 4.2-a — Bağlantı hazırlığı   | Yerelde tamamlandı | Git ingress/merge negatif testleri, güncel izin/plan ve ilk push hazırlığı          |
| Faz 4.2-b — İlk push ön kontrolü | Tamamlandı         | Dış servisler kullanıcı tarafından doğrulandı; local checkpoint ac62779             |
| Faz 4.2-c — İlk GitHub push      | Tamamlandı         | Public main ac62779; kullanıcı tarafından kabul edildi                              |
| Faz 4.2-d — Main/CI planı        | Yerel plan         | Exact ruleset ve trusted CI güven sınırı; uzak ayar yok                             |
| Faz 4.2-E1 — Bootstrap doğrulama | Tamamlandı         | Kullanıcının ruleset 26805718 ayarları/effective main salt API ile doğrulandı       |
| Faz 4.2-E2 — Yerel trusted CI    | Yerelde tamamlandı | Yerel workflow/observer/Docker; uzak run veya attester yok                          |
| Faz 4.2-E3–4.5 — Kurulum/yayın   | Başlatılmadı       | Ayrı push/PR/run/App/CMS/Pages yetkisi gerekir                                      |
| Faz 5 — Gerçek varlıklar         | Başlatılmadı       | Logo ve gerçek fotoğraflar                                                          |
| Faz 6 — Kesin bilgiler           | Başlatılmadı       | Şube kimlik/adres/saat ve sosyal hesaplar                                           |
| Faz 7 — Kurumsal yayın           | Başlatılmadı       | Domain/SEO/HTTPS ve yayın onayı                                                     |
| Faz 8 — Bakım                    | Başlatılmadı       | İzleme ve iki ayrı geri alma süreci                                                 |

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

## 19. Faz 4.1-c4 — Kurumsal metinler, sosyal/iletişim ve duyuru JSON

### 19.1. Kapsam ve koruma

7 Kasım 2026: c3 kabulüyle yalnız bu yerel geçiş yetkilendirildi. Başlangıç commit'i
**697db940005a633f96c9ea864acf04492846565e**, main. Devam sırasında var olan c4
çalışması korundu; reset/temizleme yapılmadı. 697db94 kaynakları ayrıca geçici baseline
kopyasında derlendi; gerçek statik tarayıcı çıktısıyla eşitlik ölçüldü. Güncel kanıt
ve loglar `/private/tmp/bal-c4-final/` içinde. Önceki faz kayıtları korunur.

Kategori/ürün/şube/galeri JSON'ları, bütün önceki testler, raster güvenlik kodu,
StaticImage, renk tokenları, lockfile, strict/Next/Playwright ayarları dahil seçilen
**61 korunan dosya byte eşit**. Altı kategori ve dört koordinat değişmedi:

| ID         | Latitude  | Longitude |
| ---------- | --------- | --------- |
| location-1 | 38.362633 | 27.148943 |
| location-2 | 38.374462 | 27.183882 |
| location-3 | 38.367344 | 27.148973 |
| location-4 | 38.378593 | 27.163704 |

Kaynakta ürün/galeri/duyuru sayısı hâlâ 0. Test görüntüleri ve duyurular yalnız
izole temp projelerdedir. Yeni paket, gerçek marka bilgisi veya dış işlem yoktur.

### 19.2. Tek kaynak ve düzenlenebilir alanlar

Yeni `content/pages/{home,about,contact,catalog,branches}.json` dosyaları beş sayfanın
SEO açıklamaları, başlıkları, işletme açıklamaları, bölüm metinleri ve CTA yazılarını
tutar. `content/settings/{site,social}.json` marka/slogan/kurumsal açıklama/footer,
nullable merkezi telefon/e-posta ve resmî sosyal link açıklamalarını tutar.
`content/announcements/.gitkeep` boş koleksiyonu korur; her ilerideki kayıt
announcement-<id>.json dosyasıdır. Aynı metnin ikinci TS listesi yoktur.

Hero başlık parçaları/vurgu ve satır kırılması kodda; JSON yalnız metni verir.
Sabit href/rota, UI hata/eksik veri mesajı/ARIA/navigasyon/filtre etiketleri, CSS,
ikon geometrisi, şube kimliği ve teknik canonical/noindex/domain/env kodda kalır.
Temel sayfalar zorunludur, status alanı yoktur; bu faz sayfa taslak önizleme sistemi
kurmaz. Draft/published yeni duyuru koleksiyonunda ve mevcut koleksiyonlarda çalışır.
Alan envanteri/sınırlar [EDITORIAL_GUIDE](docs/EDITORIAL_GUIDE.md) içindedir.

### 19.3. Doğrulama ve render

editorial-schema strict nested unknown girdide eksik/bilinmeyen alanı, yanlış tipi,
boş/uzun metni, geçersiz şablon/URL/telefon/e-posta değerini reddeder. Loader yalnız
Node/RSC katmanında normal dosya, UTF-8 ve 256 KiB denetimi yapar; sessiz fallback yok.
Yalnız tanımlı yedi sayfa/ayar dosyası okunur. Sayfa/sosyal/footer metinleri merkezi
sayım/marka değişkenleriyle çözülür; çözülmüş uzunluk da yeniden doğrulanır.

React düz metni escape eder; HTML/MDX çalıştırılmaz, CSS/HTML/href/SEO yayın ayarı
alanı yoktur. CatalogBrowser yalnız copy props alır, Node fs istemciye taşınmaz.
Uzun kelime için body overflow-wrap:anywhere eklendi; palette/boşluk/rota değişmedi.
Tel/mailto/sosyal link yalnız geçerli değer + verified ile oluşur. İşaret insan
teyididir, hesap sahipliği doğrulayıcısı değildir. Gerçek veriler bilinmediğinden
telefon/e-posta/URL null, verified false kalır.

Duyuru strict ID/slug/benzersizlik/sıra, opsiyonel MediaAsset ve gerçek UTC tarih
aralığı kullanır. Published ve başlangıç dahil/bitiş hariç filtresi build anında
uygulanır. Dışlanan kayıt/medya HTML/RSC/JS/yayına girmez; ham medya doğrulanır.
Boş duyuru bölümü render edilmez; yeni detay rotası/schema/sitemap girdisi yoktur.

build-site.mjs tek güvenilir SITE_BUILD_AT üretir: medya decode → Next Webpack →
sanitize out/images → export doğrulama. Medya raporu aynı anı ve bütün JSON'ların
fingerprint'ini tutar; drift build'i durdurur. Saatin ilerlemesi statik duyuruyu
kendiliğinden değiştirmez; yeni build/deployment gerekir. Zamanlayıcı kurulmadı.

### 19.4. Son doğrulama ve kanıt

| Kontrol                                     | Sonuç                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| npm run check                               | TypeScript strict, ESLint, Prettier, Vitest, build ve statik HTTP PASS |
| Vitest                                      | **328/328**, 22 dosya; önceki 262 test korundu                         |
| Production static export                    | **67 dosya**, noindex true; ana rotalar aynı                           |
| Statik HTTP                                 | **3/3**                                                                |
| Playwright / sistem Chrome                  | **51/51**, gerçek out/ üzerinde                                        |
| Responsive                                  | **320, 393, 768, 1280 px**; DOM kontrolleri ve ekran görüntüleri       |
| İzole metin export                          | **4/4**; üç negatif build ve pozitif HTML/tarayıcı kabulü              |
| İzole kategori / ürün / şube / medya export | **3/3, 4/4, 5/5, 5/5**                                                 |
| Baseline metin/metadata                     | Beş sayfa × görünür metin/title/description, **15/15 eşit**            |
| Koruma                                      | **61 dosya byte eşit**, altı kategori/dört koordinat aynı              |

Ek unit testler şema/URL/nullable/şablon/çözülmüş sınır/build anı/duyuru tarih ve
sıralamayı kapsar. Metin fixture'ı JSON başlık ve Hakkımızda değişimini gerçek
HTML'de doğrular. Zararlı img onerror metni çalışmaz; kırmızı span korunur.
Draft/future/expired ve onaysız iletişim işaretleri tüm statik metin çıktılarından
dışlanır; draft duyuru fotoğrafı 404'tür. İstemci saati 2030'a ilerletilse bile
statik duyuru HTML'i değişmez. SEO/404/ikon/robots/sitemap/menu testleri tekrar geçti.

İlk sandbox turunda yerel listen EPERM nedeniyle HTTP testleri çalışamadı;
gerekli erişimle statik HTTP, Playwright, fixture'lar ve tüm check zinciri tekrar
çalıştırıldı, geçti. Bu ortam kısıtı uygulama hatası diye gizlenmedi.

Kanıtlar: `/private/tmp/bal-c4-final/check-final.log`, `playwright.log`,
`editorial-fixture.log`, diğer dört fixture log'u, `copy-parity.json`,
`preservation-report.json`; ayrıca .next/static-export-report.json,
playwright-report/ ve test-results/.last-run.json. Baseline ve dört genişliğin önce/
sonra ekran görüntüleri aynı temp dizindedir. QA çıktıları Git'e girmez.

### 19.5. Git, teslim ve kalan işler

Anlamlı yerel commit mesajı:
`feat: migrate corporate copy and announcements to validated JSON`.
Tam hash teslim yanıtı/git log'da raporlanır; commit kendisini hash'leyemez.
Gerçek env/secret, node_modules, .next, out, .generated ve test raporları ignore
kapsamındadır; staged kaynaklar ayrıca incelenir. Remote/push/deployment yoktur.

**PASS:** C4 yerel veri mimarisi, içerik eşitliği ve tüm son kontroller tamamlandı.
**WARNING:** Gerçek telefon/e-posta/sosyal hesap, şube kimliği, logo/fotoğraf/ürün
ve duyuru beklenir. WebKit/Firefox/fiziksel cihaz/yeni axe bu fazda çalıştırılmadı.
CMS/.pages.yml/metadata adaptörü/CI/Cloudflare ve zamanlanmış yeniden build yoktur.
**FAIL:** Son doğrulamada başarısız test veya açık kritik hata yoktur.

Manuel kabul: `npm run build` ardından `npm run preview` ile 4173 portunda mevcut
metin/tasarımı ve kategori/menü/şube akışını inceleyin. Bilinmeyen linkler aktif
olmamalı; gerçek CMS ekranı beklenmemeli. Sonraki c5 önerisi upload metadata adaptörü
ve CMS alan eşleme/round-trip planını ayrı küçük kapsam olarak netleştirmektir.
Bu faz başlatılmadı. Ali Abi'nin gerçek panelden ürün adı/fotoğraf/ana sayfa metni
→ otomatik trusted kontroller → korunan aktarım → Cloudflare içerik/SHA üç kabulü
henüz gerçekleşmedi; yerel fixture bu dış entegrasyonların yerine geçmez.

## 20. Faz 4.1-c5 — CMS alan eşlemesi, medya adaptörü ve yerel .pages.yml

### 20.1. Yetki ve başlangıç

7 Kasım 2026. Ürün sahibi c4'ü kabul edip c5'i, .pages.yml prototipini ve gerçek
editör kabul hazırlığını yetkilendirdi. Başlangıç main/ec334f8500daa691fe4e9cd100e0f32945033a40;
çalışma ağacı temizdi. Başlangıç arşivi `/private/tmp/bal-c5/source-before.tar`.
Mevcut bütün fazlar/testler korundu; GitHub push/App/hesap/davet/Cloudflare yoktur.

148 korunan mevcut kaynak dosyası byte eşit: app/components/content/features/styles/
types/config/lib, bütün önceki testler ve content/public verileri dahil. Altı kategori,
dört koordinat ve kırmızı/siyah/beyaz tasarım aynı. Ürün/galeri/duyuru/fotoğraf gerçek
kayıtları 0 kaldı. Test ürün/görselleri yalnız temp dizinlerdedir.

### 20.2. Resmî uyum ve .pages.yml

Resmî Pages CMS 2.1.8 commit'i `6f4e860a35d934406580287e7042e5e111e207a1`, güncel
field/filename/reference/media/date/settings belgeleriyle birlikte salt okunur
incelendi. Native UUID otomatik üretir fakat prefix'li mevcut ID UUID değildir.
Gizli editorKey UUID + sabit filename template ile ürün/galeri/duyuru yaratılır;
canonical ID/slug dosya adından trusted adaptörde çıkarılır. Ali Bey ID/slug/JSON/
piksel/dosya yolu girmez. Eski ID/slug ve koordinatlar korunur.

.pages.yml 5 koleksiyon + 7 dosya, 12 Türkçe form sunar. Kategori reference gerçek
kayıttan ID alır; kategori listesi ikinci sabit seçenek listesi değildir. Ürün/galeri/
duyuru create açık; kategori/şube create teknik onboarding; bütün dosya/collection
rename/delete kapalı. Medya UI için hayalî delete/EXIF/byte hook ayarı eklenmedi.
Code/CSS/env/kimlik onayı/domain/noindex/verified bayrakları içerik formunda yoktur.

MIT lisanslı upstream config şeması hash'li txt fixture'dan derlenip gerçek Zod v3
uyumluluk modunda doğrulanır; yalnız Zod ve field registry importları bağlanır.
Bilinmeyen root anahtarı/field tipi negatif kontrolü ve 12 form/path/field semantic
unit testleri vardır. Resmî options şemasının iç option garantisi yok; alan eşlemesi
proje sözleşmesiyle ayrıca denetlenir. İlk view.sort/order biçimi resmî şemada
reddedildi, array + view.default yapısına düzeltildi.

### 20.3. Trusted candidate adaptörü

src/cms altındaki Node aracı raw CMS snapshot + trusted canonical baseline okur;
aynı content yollarını ayrı boş output içinde canonical hale getirir. İkinci kalıcı
editör registry'si yoktur. Native sanitizeObject null/boş string/liste/nesne anahtarını
sildiği için yalnız bilinen opsiyoneller null/[] normalize edilir. Zorunlu/unknown/
bozuk/ref/ID/slug/UTF-8/256 KiB hatasında fallback yoktur. Kalıcı ürün slug'ı ad değişince
korunur. Raw CMS verisi normal build'e doğrudan verilmez; strict loader gevşetilmedi.

Medya seçimi image picker + Türkçe alt alanıdır. Mevcut full decode/MIME/imza/path/
symlink/5 MiB/20 MiB/128 dosya/24 MP/8000 px kapıları korunur. SVG kapalıdır.
Auto-orientation + sRGB/re-encode ile metadata'sız candidate; gerçek width/height ve
owner/slot/URL tabanlı ID otomatik üretilir. Yeni fotoğraf, aynı URL'de byte değişimi
dahil, eski varyantı taşımaz; resize/varyant üretimi kurulmadı. Tüm medya ID'leri ve
referanslar canonical şemayla tekrar doğrulanır. Raw medya silme/rename de reddedilir.

Şube ID/slug/kind/koordinat/Maps değişimi baseline'a karşı reddedilir; verified kimlik
hash kapısı aynı. İletişim verified yükseltmesi reddedilir, mevcut onaylı değer değişirse
onayı sıfırlanır. UI hidden/readonly yetki sayılmaz. Source script/paketi çalıştırılmaz;
source/baseline yerinde yazılmaz; ayrı/boş output gerekir. Çıktı content/public-images
ve candidate-report'tur, Git merge veya deployment değildir.

Bu CLI aktif trusted CI sayılmaz: gerçek Git diff/mode envanteri, immutable M/C/SHA,
üç yönlü fark/çatışma, exact candidate PR/required checks, race ve source canonical
senkronizasyon hâlâ kurulmalı. Eski content-edit'i main üstüne kör kopyalamak yasaktır.

### 20.4. EXIF ve gerçek kullanıcı kabul sınırı

Hosted kaynak upload API'si extension kontrolünden sonra base64 içeriği GitHub'a
yazabilir; destekli config'te pre-upload sanitize hook'u doğrulanmadı. **Raw Git blob'u
EXIF temizliği garanti edilmez.** Candidate/out temizliği kaynak/history mahremiyeti
değildir. Public/private ve EXIF kararı gerçek bağlantıdan önce tamamlanmalıdır.
Private raw erişimini sınırlar ama pre-upload temizliği sağlamaz. Önceden temizlenmiş
medya kütüphanesi seçimi veya ayrı pre-upload çözümünün ödünleşimleri CMS_ADAPTER'da;
Ali Bey'e terminalde fotoğraf temizleme görevi verilmez.

Kaynak tabanlı wire fixture gerçek upstream initializeState/deepMap/sanitizeObject/
image write yardımcılarını kullanır; backend merge'in yerel arrays-replace karşılığı
vardır. Auth, canlı reference arama/date picker/upload/save API'si ve hosted sürüm
sınanmadı. Bu, gerçek editor testi diye sunulmaz. CMS_ACCEPTANCE.md 12 PENDING
senaryo, önkoşul/kullanıcı işlemleri ve source→candidate→main→Cloudflare SHA/HTTP
kanıt zincirini tanımlar. Üç gerçek panel akışı tamamlanmadan CMS bitmiş sayılmaz.

### 20.5. Doğrulama ve kanıtlar

| Kontrol                                       | Sonuç                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| TypeScript / ESLint / Prettier                | PASS; strict aynı                                                             |
| Vitest                                        | **363/363**, 24 dosya; önceki 328 test ve 35 yeni CMS testi                   |
| Resmî .pages.yml kontrolü                     | PASS; hash'li pinned şema, negatif ve field/path denetimi                     |
| Production static export                      | **67 dosya**, noindex true; ana rotalar aynı                                  |
| Statik HTTP                                   | **3/3**                                                                       |
| Playwright / Chrome                           | **51/51**, gerçek out/ üzerinde                                               |
| Kategori / ürün / şube / medya / metin export | **3/3, 4/4, 5/5, 5/5, 4/4**                                                   |
| CMS kaynak tabanlı round-trip                 | PASS; yeni/ikinci save, fotoğraf değişimi, kimlik/draft ve gerçek statik HTML |
| Responsive                                    | **320, 393, 768, 1280 px**; ana site ve izole CMS fixture                     |
| Kaynak koruma                                 | **148 dosya byte eşit**, altı kategori/dört koordinat aynı                    |

CMS fixture ürün ekleme, gerçek kategori ID seçimi, şube metni, ana sayfa/Hakkımızda,
galeri/hero ve duyuru kaydını temsil eder. EXIF'li test JPEG'in orijinali byte eşit;
candidate ölçüleri orientation sonrası otomatik ve metadata temizdir. Canonical
ürün ikinci save'de yeniden adlandırılır ve 60×30 fotoğrafla değişir; ID/slug aynı,
piksel alanı formda yoktur. Draft işareti tüm out metin dosyalarında yoktur. Static
HTTP'de ürün fotoğrafı decode/lazy, hero preload, gizli kaynak 404, location detay
404 ve noindex korunur. Test resmi yalnız geometrik temp fixture'dır.

İlk round-trip testi hero'da loading=eager attribute varsayımı nedeniyle durdu;
Next gerçek preload link'i ve lazy olmama davranışıyla düzeltildi, uygulama görsel
bileşeni değiştirilmedi. İlk lint teknik araçtaki module değişken adını reddetti;
wireSource olarak düzeltildi. Offline npm cache yoktu; sistem TLS'li okuma/kurulumla
zaten kurulu exact js-yaml 4.3.2/zod 4.6.7 doğrudan dev bağımlılık oldu. Diğer paket
sürümleri/runtime bağımlılıkları değişmedi; ana strict/Next/Playwright aynı.

Kanıt: `/private/tmp/bal-c5/` içindeki check/roundtrip/playwright/export logları,
preservation-report.json ve source-before.tar. Son CMS temp yolu roundtrip-final.log
ve result.json içinde; browser PNG'ler o dizindedir. Resmî kaynak hash/provenance/MIT
lisansı tests/fixtures/pagescms altında, .generated araçları Git dışındadır.

### 20.6. Teslim ve bağlantı için gerekenler

Güncel sözleşme CMS_ADAPTER.md; gerçek editör kabulü/kullanıcı adımları CMS_ACCEPTANCE.md.
.pages.yml, src/cms/*, beş teknik script, upstream test fixture'ları, package/lock ve
yardımcı TS include; AGENTS/README/mimari/CMS/medya/içerik/SEO-yayın/güvenlik/rehber/
yol haritası/plan/kalite belgeleri değişti. Eski veri/UI/test dosyaları aynı kaldı.

PASS: Yetkilendirilen yerel c5 ve .pages.yml/kabul hazırlığı tamamlandı.
WARNING: Source pre-Git EXIF ve repo görünürlüğü kararı; gerçek içerik, hesap/CI/yayın
ve gerçek kullanıcı testleri beklenir. WebKit/Firefox/fiziksel cihaz/yeni axe yok.
FAIL: Son yerel doğrulamada başarısız test veya açık kritik uygulama hatası yok.
Pre-Git temizlik şartı hosted-only çözümle sağlanmış sayılmaz.

Başarılı yerel commit mesajı: `feat: prepare Pages CMS forms and trusted media adapter`.
Hash teslim yanıtı/git log'da raporlanır. .env/node_modules/out/.next/.generated/test
raporları Git dışıdır. Remote/push/App/davet/token/Cloudflare değişmedi; c5 sonrası
harici entegrasyon kendiliğinden başlatılmaz. Ürün sahibinin ayrıca repo/EXIF seçimi,
push/App/koruma/davet ve deployment yetkileri gereklidir; Ali Bey'den JSON/piksel/Git
komutu istenen bir gerçek akış kabul edilmez.

## 21. Faz 4.2-a — GitHub ve gerçek Pages CMS bağlantı hazırlığı

### 21.1. Başlangıç ve kapsam

7 Kasım 2026: ürün sahibi C5 yerel prototipini 8d0046da331ba8f9d5035cf750d42b3a1ccbfbd8
checkpoint'iyle kabul etti. Başlangıç main/8d0046d, temiz çalışma ağacı, 7 commit ve
remote yoktu. Yedek: /private/tmp/bal-phase42a/baseline-source.tar. Bu tur yalnız
salt okunur harici inceleme ve geri alınabilir yerel hazırlıktır. Yeni işletme JSON
mimarisi, .pages.yml/tasarım değişikliği, push, App/davet/secret veya deployment yok.

### 21.2. Gerçek uzak okuma / hesap sınırı

- Anonim API: sametbuluto/balkuruyemis Public, size 0, owner User. Başarılı anonim
  ls-remote'da refs boş; branches ve rulesets GET'leri de boş liste döndürdü. Uzak
  main henüz yoktur; default_branch=main değeri koruma/varlık kanıtı değildir.
- Kullanıcının gerçek Free/Pro/Team planı, admin izinleri ve installation grant
  yetkili oturum olmadığı için görülmedi. Koruma enforcement başarılı sayılmaz.
- Public App API write actions/contents/repository_creation, read checks/deployments/
  emails/metadata/pages/statuses istiyor. Hosted public kayıtta administration write
  yoktur; eski self-host kurulum manifestinin administration isteğinden ayrıldı.
  Gerçek kurulum ekranı/izin daraltma olanağı ve davet ücret/rol ekranı görülmedi.
- Source upstream SHA 6f4e860a35d934406580287e7042e5e111e207a1 aynı; hosted sürümünün
  aynı olduğu iddia edilmez. E-posta collaborator resmi model, granular RBAC veya
  editöre özel branch lock değil. GitHub write rolü Ali Bey'e verilmez.

Resmî plan/ruleset/protection/auto-merge/environment belgeleri yeniden okundu.
Public Free korumaları destekler. Kişisel Private Free tek repo otomasyon için
gereken native kapıları karşılamaz; kişisel Pro veya org Team koşulu vardır.
Main-only environment secret desteği ile private required reviewer/wait timer
desteği ayrı özelliklerdir. Org Team güncel liste 4 USD/kullanıcı/ay; kişisel Pro
için resmî tarihsel 2020 fiyatı 4 USD/ay, güncel checkout/vergi görülmediğinden
kesin teklif değildir. Gerçek plan ve enforcement kullanıcı hesabında doğrulanır.
Ayrı private raw/public trusted repo alternatifi yalnız tasarım önerisidir;
ücretli plan veya manuel teknik PR seçeneğiyle birlikte GITHUB_READINESS'dadır.

### 21.3. Geçmiş ve medya denetimi

Başlangıçtaki reachable 7 commit/340 benzersiz blob incelendi; en büyük 307409 byte.
Gerçek env, node_modules, out, .next, .generated, coverage/test raporu yolu 0; bilinen
sır deseni 0; raster fotoğraf/EXIF 0; büyük/atlanmış blob 0. .env.example şablondur.
Tarama sır değerlerini loglamaz; bütün sır türlerini yakalama garantisi değildir.
Tarihte eklenip silinen sahte env/tokenı bulma testi ayrı temp Git'te çalışır.

Private seçmek EXIF temizliği değildir. Raw upload Git geçmişine metadata yazabilir;
adaptör/out temizliği bunu geri almaz. İlk gerçek kullanıcı testleri teknik sorumlu
tarafından önceden metadata'sızlığı ve yayın hakkı doğrulanmış, kişisel veri içermeyen
gerçek görsellerle yapılır. Ali Bey fotoğraf seçer/alt yazar; terminal/piksel girmez.
Gerçek ürün/fotoğraf listesi hâlâ boştur; test resmi canlı kaynağa eklenmedi.

### 21.4. Yeni yerel güvenlik katmanı

- src/publishing/git-source.server.ts: tam M/C SHA ve tek ortak ata B; gerçek Git
  raw diff/mode/blob-byte envanteri. Tek kod/workflow/.pages/env, legacy singleton,
  silme/rename/exec/symlink/gitlink veya limit ihlali tüm paketi reddeder. Hook/
  fsmonitor/external diff/replace ref ve child credential aktarımı kapalı; source
  kodu checkout/execute edilmez. Main/HEAD/index/refs değiştirilmez.
- candidate.server.ts: B/M/C ayrı snapshot, aynı trusted C5 normalizasyonu, canonical
  üç yönlü merge, son strict schema/media decode ve pin yeniden kontrolü. Bağımsız
  JSON alanları birleşir; aynı alan çatışması ve diziler/binary/medya çakışması durur.
  Mevcut telefon/sosyal onay başka eşzamanlı değere taşınamaz. Kimlik hash kapısı aynı.
- three-way.ts ve promotion-gate.ts: yapısal merge ve typed yerel proof modeli.
  Model direct main/raw/kod/stale SHA/yanlış workflow/check App/context/skipped check/
  bypass/eksik koruma ve validator secret/write-token güven ihlallerini reddeder.
  Model input'u yetki/imza değildir; gerçek API okuyucu/attester/writer hâlâ yoktur.
- publishing:simulate ayrı boş dizine yalnız data ve publication-report.json yazar.
  candidateCommitSha=null, fullChecksRun=false, remoteProtectionVerified=false;
  gerçek candidate commit/check/PR/merge kanıtı üretmez. publishing:audit read-only
  reachable geçmiş taramasıdır. scripts/test-publishing-export.mjs izole entegrasyondur.

İlerideki job/LP token ayrımı, main-only protected environment, check App sabitleme,
üç yönlü source-sync, queue/drift ve teknik PR ayrımı AUTOMATION_DESIGN'dadır.
GitHub iki ref'i tek atomik CAS ile kilitlemez; local pin kontrolü uzak merge-time
koruması değildir. Required checks/server strict head ve gerçek yarış testleri
olmadan otomatik writer açılmaz. Aktif workflow dosyası bırakılmadı.

### 21.5. Son doğrulama

| Kontrol                      | Sonuç                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| npm run check                | TypeScript strict, ESLint, Prettier, config, Vitest, export, HTTP PASS              |
| Vitest                       | **426/426**, 27 dosya; önceki 363 ve 63 yeni publishing testi                       |
| Resmî .pages.yml kontrolü    | PASS; C5 dosyası byte eşit                                                          |
| Production static export     | **67 dosya**, noindex true; rotalar aynı                                            |
| Static HTTP                  | **3/3**                                                                             |
| Playwright / sistem Chrome   | **51/51**, gerçek out/ üzerinde                                                     |
| Responsive                   | **320, 393, 768, 1280 px**, önceki kontroller ve PNG'ler                            |
| Git candidate izole export   | **2/2**; native CMS şekli → gerçek refs → merge → build/HTTP/Chrome; conflict reddi |
| Önceki CMS kaynak round-trip | PASS; gerçek hosted/CMS API testi değildir                                          |
| Git geçmiş audit             | PASS; başlangıç 7 commit/340 blob, bilinen bulgu 0                                  |

63 yeni test gerçek temp Git nesneleriyle kod/workflow/env/mode/link/delete/rename/
byte reddini, malformed JSON/bozuk görsel/onaysız verified ve ref hatalarını, üç yönlü
çatışmayı, sırasında ilerleyen main'i ve onay-değer yarışını kapsar. Sahte check ve
koruma senaryoları yerel modeldir; GitHub'da main'e yazma reddi test edilmiş değildir.
İzole native UUID ürünü ve 32×16 metadata'sız geometrik PNG yalnız fixture'dadır.

İlk publishing unit turunda .gitkeep'in tek LF içerdiği ve exec-mode fixture'ının
çalışma ağacı modu eksikliği görüldü; boşluk-only keep ve gerçek chmod/stage düzeltildi.
İlk fixture browser testi CSS uppercase innerText beklediği için durdu; gerçek
textContent denetimine çevrildi, uygulama değiştirilmedi. Son turlar geçti.

Kanıt/loglar: /private/tmp/bal-phase42a/ altında history-audit, preservation-report,
check/playwright/git-export-final/cms-roundtrip kayıtları ve anonim GET JSON'ları.
Git fixture: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-publishing-export-RYVYTt;
CMS fixture: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-cms-roundtrip-cHGLAo.
Yeni Firefox/WebKit/fiziksel cihaz/axe veya harici yazma/yayın testi yapılmadı.
Eski kategori/ürün/şube export script'leri korundu; bu tur ayrı ayrı tekrar
çalıştırılmadı. Tam eski unit/E2E ve CMS round-trip regresyonları çalıştırıldı.

### 21.6. Dosya ve Git teslimi

Yeni src/publishing (Git okuyucu/candidate/merge/proof/CLI ve üç unit dosyası), üç
publishing/history/test script'i, GITHUB_READINESS ve AUTOMATION_DESIGN belgeleri.
package.json yalnız iki teknik komut, tsconfig.media.json yalnız CLI include aldı.
AGENTS, README, mimari/yol haritası/SECURITY/DEPLOYMENT/CMS_SETUP/CMS_ACCEPTANCE/
QUALITY_REPORT ve bu plan güncellendi. Yeni paket veya lockfile değişimi yoktur.
Eski UI/veri/loader/test dosyaları, .pages.yml, korunan kimlik, altı kategori ve dört
koordinat dahil **187 korunan dosya byte eşit**; koruma raporu başlangıç commit'ine karşı üretildi.

Başarılı hazırlık yerel checkpoint olarak kaydedilir; hash teslim yanıtı/git log'da
raporlanır. Remote/harici refs/görünürlük/App/davet/secret/Cloudflare değiştirilmez.
QA çıktıları/env otomatik dosyalar ignore kapsamındadır. Sonraki dış aşama başlamaz.

### 21.7. Karar ve kullanıcıdan gerekenler

PASS: yerel hazırlık/testler ve salt okunur uzak inceleme tamamlandı.
WARNING: uzak main/koruma yok; gerçek hesap planı/App grant/checks/otomasyon ve hosted
12 form/kullanıcı/Cloudflare kabulü henüz doğrulanmadı. Yerel PASS uzak güvenlik PASS
değildir. İlk push teknik olarak koşullu hazır; henüz izin verilmedi.
FAIL: son yerel kontrollerde başarısız test/açık kritik uygulama hatası yok.

Net sonraki adım: kullanıcı gerçek GitHub planı + Public/Private tercihini bildirir;
mevcut webhook/App/Cloudflare bağlantısının ilk push ile yayın başlatmayacağını
doğrular; sonra **yalnız ilk push için ayrı açık izin** verir. Bir sonraki iş
bootstrap koruma/CI'dır; CMS App/hesap ve davet/deployment ayrı ayrı onaylanır.
GitHub tokenı/parola/ödeme bilgisi sohbetten istenmez. Uzak geçmiş push öncesi yeniden
kontrol edilir; refs değişmişse işlem durur, force/mirror/all kullanılmaz.

## 22. Faz 4.2-b — Public GitHub Free ilk push öncesi son kontrol

### 22.1. Karar, başlangıç ve koruma

7 Kasım 2026: kullanıcı Public repository + GitHub Free kararını kesinleştirdi;
ücretli Pro/Team veya transfer yok. Kaydet sonrası insan onayı beklemeyen, fakat
trusted otomatik kapılardan geçen içerik yayını hedefi korundu. Bu görevde **push
izni verilmedi**; remote/dry-run/ayar/App/davet/secret/Cloudflare işlemleri yasak.

Başlangıç main/aa1ea3ebf713cc0f4319582e51d4b85811d4cdf5, temiz ağaç; remote yok.
Sekiz commit sırası/ataları korundu. Git fsck missing/corrupt nesne bulmadı; eski
reachable olmayan dangling tree/blob'lar silinmedi, normal main push'una dahil
olmaz. Yedek/kanıt: /private/tmp/bal-phase42b/source-before.tar, before-status,
before-refs ve before-history. Git geçmişine yeni commit/reset/rebase eklenmedi.

### 22.2. Yeni gerçek uzak okuma ve kesin durum

Hedef https://github.com/sametbuluto/balkuruyemis.git. Anonim API 200 Public/size 0,
owner User/full_name doğru; ls-remote exit 0 ve ref'ler boş. Branches/rulesets GET
200 boş, workflows GET 200 total_count 0, deployments GET 200 boş. Repo Pages GET
404; GitHub Pages gözlemidir, Cloudflare yokluğunu kanıtlamaz. Webhooks ve repo
installation GET 401 Requires authentication. Repo installation endpoint'i tüm
App'leri listeleyen genel kullanıcı endpoint'i sayılmaz. gh kurulu ve mevcut
GH_TOKEN/GITHUB_TOKEN oturumu yok; yeni yetki/token/oturum kurulmadı. Keychain veya
parola dosyaları aranmadı. Cloudflare hesabı/projeleri yetkili görülmedi.

**PUSH_READY = BLOCKED; DEPLOYMENT_TRIGGER = UNKNOWN; REMOTE_MAIN = EMPTY.**

Uzak main default_branch metadata'sına rağmen henüz yok ve korunmuş sayılmaz.
Anonim boş workflow/deployment listesi webhook/harici yayın yokluğu değildir.
Kullanıcı UI kontrolü soruldu; yanıt gelene kadar UNKNOWN kalır. Hiçbir uzak
sistem değişmedi. Ref/visibility push'tan hemen önce yeniden kontrol edilecek;
beklenmeyen dolulukta durulacak, overwrite/otomatik merge yapılmayacak.

### 22.3. Reachable geçmiş denetimi ve sınırları

Mevcut gerçek script npm run publishing:audit; publishing alias'ı yok, eklenmedi.
8 commit / 365 benzersiz blob; en büyük 307409 byte. Gerçek env, node_modules,
.next/out/.generated/coverage/test raporu yolu 0, bilinen sır deseni 0, raster ve
EXIF/XMP/IPTC bulgusu 0, 10 MiB üstü/atlanmış blob 0. .env.example şablon.

İlave geçici tarama 365 blob'un tamamını strict UTF-8, NUL ve JPEG/PNG/GIF/RIFF/ZIP/
ELF/PDF imzalarıyla inceledi; binary bulgusu 0. Tree entry modları 100644. Tarama
.gitignore ile sınırlı değildir; Git blob byte'ları okundu. Tüm sır/parola/gizlenmiş
veri/kişisel veri türlerini bulma garantisi yok; reachable dışı nesne veya ignored
çalışma dosyası taraması gibi sunulmaz. Normal sadece main push'u onaylı reachable
geçmişi taşır. Gerçek kişisel/EXIF'li fotoğraf gözlenmedi. İlk gerçek CMS testinde
metadata'sızlığı ve yayın hakkı önceden onaylı kişisel veri içermeyen fotoğraf şartı
korundu; Public/Private seçimi EXIF temizliği değildir. Ali Bey terminal/piksel girmez.

### 22.4. Public/Free mimarisi ve güvenli bootstrap — uygulanmadı

Resmî GitHub branch protection/rulesets/environment belgeleri ve Cloudflare Git
branch kontrolü yeniden okundu. Public Free PR/required checks/strict up-to-date,
force/deletion ve admin/App bypass engeli destekleri kullanılacak. Paid push
rulesets/Enterprise required workflows/native merge queue ön koşul değil. Path
sınırı trusted içerik kapısındadır; UI veya CODEOWNERS tek başına yetki sayılmaz.
Gerçek hesabın Billing ekranı okunmadı; Free kullanımı ürün sahibi kararıdır.

1. UI tetikleyici yokluğu + tam SHA için açık izin; yalnız main ilk push. CMS ve
   Cloudflare bağlı olmamalı; başka writer olmayan bootstrap penceresi doğrulanır.
2. Main oluşunca Active PR koruması, force/deletion/bypass engeli. Henüz üretilmemiş
   check context eklenmez. CMS bu başlangıç korumasıyla bağlanmaz.
3. Teknik PR ile trusted CI/attester/writer; validator sırsız/read-only main kodu.
   Main-only environment ve dar App yetkisi gerekiyorsa ayrı onayla kurulur.
4. Gerçek candidate SHA üzerinde tam başarılı check/context/App kaynağı görülür;
   sonra required check + expected App + strict açılır. Native skipped/neutral
   kabulüne güvenilmez; attester tüm kontroller bitmeden success vermez.
5. Teknik kod PR'ı ayrı trusted teknik inceleme/validation; içerik PR'ı data-only
   otomasyon. İçerik için global manuel approval şartı yok, teknik değişiklik CMS
   akışına sokulmaz. Yanlış context ile teknik PR'lar kilitlenmez.
6. Content-edit protected main'den; üç yönlü source-sync/conflict/race ve main direct
   write reddi gerçek denenir. CMS App'e bypass verilmez; kimlik/verified korunur.
7. CMS App, Ali Bey daveti ve Cloudflare deployment birbirinden ayrı onaylı işlerdir.
   Yalnız main production; content-edit/candidate preview kapalı. Önceki başarılı
   yayının hatalı değişimde korunması gerçek SHA/HTTP kabulüyle doğrulanır.

Bu sıra bir uygulama değil hazırlık planıdır. Gerçek required check/koruma, API
attester/writer veya Cloudflare kabulü hâlâ yoktur. Ürün sahibi önce UI kontrolünü
yapar, sonra ilk push için ayrıca izin verir; bu görevle 4.2-c başlatılmaz.

### 22.5. Komut planı ve kullanıcı işlemleri

Tam guard'lı komut planı ve post-push API/tree doğrulaması docs/PUSH_PREFLIGHT.md
İçindedir. Branch/clean tree/aa1ea3e/empty refs/public URL → yalnız doğru origin →
main dry-run → SHA/clean/empty refs tekrar → explicit main:main normal push → uzak
SHA/main/tree kontrolü. Komutlar **çalıştırılmadı**; NO onay/tetikleyici işaretleriyle
kopyalanınca da durur. Birden çok pushurl/farklı URL/beklenmeyen ref durumunda durur.
Force/force-with-lease/mirror/all/tag toplu yükleme yok. Dry-run deployment kanıtı
veya ref kilidi değildir; kısa onaylı pencerede eşzamanlı yazma olmamalıdır.

Kullanıcı repo Settings/Webhooks, Integrations/GitHub Apps (All repositories dahil),
kişisel Installed Apps ve Cloudflare Workers & Pages Git/branch controls ekranlarını
inceleyip sonucu bildirir. Bir bağlantı varsa PRESENT ve push BLOCKED; kaldırma/
devre dışı bırakma ayrı izin ister. Şifre/token paylaşılmaz, yeni App kurulmaz.

### 22.6. Yeniden çalıştırılan kontroller

| Kontrol                      | Sonuç                                                                  |
| ---------------------------- | ---------------------------------------------------------------------- |
| npm run check                | strict TS, ESLint, Prettier, Vitest, CMS config, build/HTTP PASS       |
| Vitest                       | **426/426**, 27 dosya; önceki tüm testler ve 63 publishing testi       |
| Resmî CMS config             | PASS; pinned 6f4e860a... şema, .pages.yml aynı                         |
| Static export                | **67 dosya**, noindex true                                             |
| Static HTTP                  | **3/3**                                                                |
| Chrome Playwright            | **51/51**, out/ üzerinde                                               |
| Responsive regresyon         | **320, 393, 768, 1280 px**, mevcut test kapsamında                     |
| İzole candidate export       | **2/2**; gerçek temp Git/normalize/build/HTTP/Chrome ve conflict reddi |
| Publishing + ek binary audit | PASS; 8/365, bulgu/atlanmış blob 0                                     |

Yerel testler uzak main write reddi veya Cloudflare publish davranışı değildir.
Yeni hosted CMS/WebKit/Firefox/fiziksel cihaz/axe testi yapılmadı. Kategori/ürün/
şube/media/metin export fixture script'leri bu görevde ayrı tekrar çalıştırılmadı.
Hata/gevşetilen güvenlik kapısı yok. Loglar /private/tmp/bal-phase42b-check.log ve
/private/tmp/bal-phase42b/{publishing-audit,playwright,candidate-export}.log; HTTP
kanıtları aynı dizinde. Candidate temp yolu candidate-export.log içinde kayıtlıdır.

### 22.7. Dosyalar ve Git teslimi

Yalnız belgeler: yeni PUSH_PREFLIGHT; AGENTS/README/plan/QUALITY_REPORT ve güncel
Public/Free banner'ları için GITHUB_READINESS/AUTOMATION_DESIGN/SECURITY/CMS_ACCEPTANCE/
DEPLOYMENT/CMS_SETUP; ARCHITECTURE/ROADMAP. Uygulama/JSON/.pages/test/paket/config ve
renk/tasarım değişmedi. **200 korunan kod/data/test/config dosyası HEAD ile byte eşittir**;
ref/index/geçmiş aynı kalır. Belgeler uncommitted bırakılır; aa1ea3e onaylı SHA
korundu. Yeni commit seçilirse yeni tam SHA ayrıca incelenip onaylanmalıdır.

PASS: yerel güvenlik/kalite kontrolleri ve boş Public repo okuması tamamlandı.
WARNING: deployment UNKNOWN, push BLOCKED ve izinsiz; kullanıcı UI doğrulaması ve
belge checkpoint'i/temiz ağaç işi bekler. Gerçek korumalar kurulmuş sayılmaz.
FAIL: son yerel kontrollerde başarısız test/açık kritik uygulama hatası yok; gerçek
push/CMS/yayın hedefi bu tur gerçekleştirilmedi ve başarılı raporlanmadı.

### 22.8. Kullanıcı UI yanıtı — kısmi doğrulama ve devam eden engel

Ürün sahibi GitHub Webhooks bölümünün boş olduğunu doğruladı. Railway ve Vercel
GitHub Apps hesabında kurulu, ikisi de All repositories erişimine sahip. Bal
Kuruyemiş için gerçek deployment projesi/tetikleyici varlığı doğrulanmadı. Kullanıcı
bu erişimleri yalnız eski kullanılan repository'lerle sınırlandırıp balkuruyemis'i
kapsam dışında bırakmayı planlıyor; tamamlandığı henüz bildirilmedi. Cloudflare
Pages bağlantısı kontrol edilmedi. İlk push izni açıkça verilmedi.

Bu yeni kayıt kullanıcı UI beyanıdır; önceki anonim API 401 gözlemi değişmez ve
ajanın yetkili entegrasyon denetimi sayılmaz. App erişimi tek başına deployment
projesi kanıtı olmadığından DEPLOYMENT_TRIGGER **UNKNOWN**, PUSH_READY **BLOCKED**
korundu. REMOTE_MAIN önceki son okuma itibarıyla EMPTY; bu yanıtta uzak ref'ler
tekrar sorgulanmadı. Railway/Vercel kapsam değişikliğinin tamamlanması ve Cloudflare
kontrol sonucu beklenir. Sonrasında da tam SHA için ayrı açık push izni gerekir.

Yalnız PUSH_PREFLIGHT/QUALITY_REPORT ve bu plan güncellendi; uygulama, Git HEAD,
remote, App izinleri ve harici sistemler değiştirilmedi. Belgelerde Prettier ve
Git whitespace denetimi yapıldı; bu yalnız belge güncellemesinde uygulama/test/build
tekrar çalıştırılmadı. Önceki test sonuçları yeni çalıştırma gibi sunulmaz.

### 22.9. Son dış servis doğrulaması ve ilk push adayı

Ürün sahibi webhook listesinin boş olduğunu, Railway ve Vercel GitHub Apps'in
kaldırıldığını, Cloudflare hesabında Workers & Pages ekranında No projects found
olduğunu ve proje/deployment bağlantısı olmadığını bildirdi. Bu kullanıcı UI
kanıtıdır; ajanın yetkili App/Cloudflare API denetimi değildir. Public + Free kararı
aynı kalır. Önceki §22.2/22.8 UNKNOWN kayıtları geçmiş durumu tutar.

Yeni görev, bekleyen dokümantasyonu yerel commit ile kaydetmeyi ve yeni tam HEAD'i
raporlamayı yetkilendirdi; **gerçek push izni yine verilmedi**. Başlangıç main/aa1ea3e,
önceki 12 belge değişikliği ve untracked PUSH_PREFLIGHT vardı. PUSH_PREFLIGHT son
görev metniyle değiştirilmişti; bu kullanıcı metni byte prefix olarak korundu,
güncel kontrol ve main-only dry-run planı altına eklendi. Başlangıç kaynak/diff/
kullanıcı dosyası /private/tmp/bal-firstpush-final-20261107 içinde yedeklendi.

Hedef repo yeniden anonim GET ile Public/doğru full_name ve HTML URL olarak
kontrol edildi; ls-remote exit 0 ve ref'ler tamamen boş. Beklenmeyen uzak geçmiş
bulunmadı. Önceki 8 commit/365 blob audit'inde bilinen sır, yasak env/build/test
çıktısı, raster/EXIF veya büyük/atlanmış blob bulgusu 0. Belge commit'i sonrası
nihai reachable geçmiş ve binary imzası kontrolü ayrıca yapılır; tam SHA ve sayımlar
teslim yanıtı/QA raporunda tutulur. Aynı commit kendi SHA'sını içeremez; belgede
push adayı kendiliğinden HEAD seçilmez, tam SHA açık kullanıcı onayına bağlanır.

AGENTS/README, hazırlık/güvenlik/CMS/yayın/kalite/mimari/roadmap ve bu plan yalnız
belge düzeyinde güncellendi. Önceki 200 kod/data/test/config kaynağı ve dört konum
aynı kalır; test/paket/dependency veya tasarım değişimi yok. Uygun yerel mesaj:
`docs: finalize public GitHub first-push readiness`. Reset/rebase veya geçmiş
rewrite yok; yeni doc commit aa1ea3e'nin çocuğu olacaktır. Env/QA/çıktı Git dışıdır.

Koşullar başarıyla tamamlandığında PUSH_READY=YES teknik hazır oluşu gösterir;
DEPLOYMENT_TRIGGER=NONE kullanıcı doğrulamasına dayanır, REMOTE_MAIN=EMPTY son
anonim okuma kanıtıdır. PUSH_AUTHORIZED=NO kalır. Transport auth/yazma yetkisi veya
actual dry-run başarılı diye raporlanmaz; bu görev yalnız dry-run hazırlığını
kontrol eder. Main-only guard'lı plan SHA/clean/URL/public/empty-refs kontrolü,
no-follow-tags/recurse-submodules=no ve force/mirror/all yasaklarını içerir.

Son check/audit sonuçları QUALITY_REPORT ve /private/tmp/bal-firstpush-final-20261107
loglarında kaydedilir. Önceki sonuçlar yeni test gibi sunulmaz. Gerçek ilk push,
Pages CMS App/davet, Actions yayın otomasyonu ve Cloudflare deployment başlatılmaz.
Push sonrası koruma/CI sırası yalnız plan olarak kalır. Bir sonraki işlem tam yeni
SHA için kullanıcının ayrı açık ilk push onayını beklemektir; onay anında uzak
ref'ler/Public durumu yeniden kontrol edilir ve beklenmeyen değişimde durulur.

Son yeniden çalıştırılan sonuçlar: npm run check PASS; 426/426 Vitest (27 dosya),
resmî CMS config PASS, 67 dosya noindex static export ve 3/3 HTTP; Chrome E2E 51/51.
Dört genişlik regresyonları geçti. 200 korunan kaynak byte eşit, kullanıcı görev
metni PUSH_PREFLIGHT başında byte prefix olarak aynı. Dry-run planı bash -n PASS;
aktif pre-push/custom hooksPath yok. Gerçek auth/dry-run/remote/push yok. Belge
commit'i sonrası final audit/temiz ağaç kontrol edilir ve tam SHA teslim edilir.
Teknik PUSH_READY=YES ile PUSH_AUTHORIZED=NO ayrıdır; sonraki işlem yalnız açık
ilk push onayını bekler. Bu görevde izole candidate export veya yeni tarayıcı
motoru/hosted CMS/deployment testleri yeniden çalıştırılmadı.

## 23. Faz 4.2-c — Kabul edilen ilk GitHub push kaydı

Kullanıcı yalnız ac62779e3a5a8ad0de76dd4c040c32387bd1c474 main commit'i için tek ilk
push yetkisi verdi. Clean main/SHA/Public/boş refs ve reachable audit yeniden geçti.
Origin doğru HTTPS hedefe eklendi. Gerçek main:main dry-run başarılı; koşullar yeniden
GET/ls-remote ile denetlenip yalnız main normal push ile oluşturuldu. Geçici pre-push
hook gerçek advertised remote SHA'nın sıfır ve local SHA'nın onaylı olması şartını
kontrol etti; başka ref/force/tag/mirror yoktu, hook kalıcı config'e yazılmadı.

Sonuç: uzak main=yerel ac62779; HEAD→main; başka dal/tag yok. GitHub recursive ağacın
220 dosyası/sha/mode'u onaylı local tree ile eşit, forbidden path yok. 9 commit/378
reachable blob audit'inde bilinen secret/raster/EXIF/büyük/atlanmış blob bulgusu 0.
İlk ref karşılaştırması HEAD alias'ını ek dal saymıştı; yalnız okuma karşılaştırması
symref ayrımıyla düzeltildi, ikinci gerçek push yapılmadı. API'de rulesets/workflow/
deployment 0, main protected=false. Çalışma ağacı temiz; yeni commit yoktu.
Kanıt /private/tmp/bal-first-github-push-20261107/RESULT.json ve GET/log dosyalarında.
Bu fazda plan dosyası değiştirilmedi; kullanıcı exact SHA ve yeni commit yasağını
korumak için sonuç şimdi sonraki yetkili yerel belge işinde kaydediliyor.

## 24. Faz 4.2-d — Main ruleset ve trusted CI güvenlik yapılandırma planı

### 24.1. Kapsam ve gerçek salt okunur kanıt

Kullanıcı 4.2-c'yi kabul etti; bu tur yalnız uygulanacak ayarlar ve CI planı istendi.
Yerel başlangıç main/ac62779 temiz, origin doğru; uzak aynı SHA ve yalnız main/HEAD.
Source-before.tar /private/tmp/bal-phase42d içinde. Yeni push/remote branch/PR/run,
ruleset/Actions ayarı, App/token/secret, Pages CMS/davet veya deployment yetkisi yok.

Mevcut Git credential'ı memory içinde yalnız sabit GitHub GET'lerine kullanıldı;
değeri log/proje dosyasına yazılmadı. /user login=sametbuluto; repo.permissions
admin/maintain/push/triage/pull=true. /user.plan.name **pro**; bu ödeme/fatura kanıtı
değildir. Kullanıcı hedefi Public + Free; yalnız bu modelin resmî destekleri seçilir,
plan/hesap/ücret değişikliği yapılmaz. UI admin rolü görüldü, API Administration:write
mutasyonu denenmedi. Önceki anonim plan-bilinmiyor durumu bu gerçek GET ile güncellendi.

Main protected=false; classic protection 404 Branch not protected; rulesets ve
effective main rules 200 boş. Workflow/deployment 0. Actions enabled=true,
allowed_actions=all, sha_pinning_required=false; default_workflow_permissions=read,
can_approve_pull_request_reviews=false. Bunların hiçbiri değiştirilmedi.

### 24.2. İncelenebilir öneriler ve kesin ayarlar

Yeni docs/MAIN_PROTECTION_PLAN.md ve docs/TRUSTED_CI_PLAN.md; gerçek JSON taslağı
docs/github/main-bootstrap.ruleset.json. Başlangıç tam ref refs/heads/main, Active,
bypass=[], pull_request(approvals=0, stale dismiss=true, codeowner/lastpush/thread
zorunlulukları=false), deletion ve non_fast_forward. Required status check yok;
Restrict updates/creations veya ücretli push rule/Enterprise workflow eklenmez.
Payload parse/alan kontrolü yereldir; GitHub server validation veya uygulanmış
ruleset değildir. UI Settings→Rules→Rulesets→New branch ruleset; sonra gereken
Actions/Environments yolları ilgili belgelerde tam listelidir.

Başlangıç PR/force/delete engelidir, içerik güvenliği değildir. Checksiz ve sıfır
approval aşamasında write yetkilisi PR merge edebilir; CMS/bot/Cloudflare bağlanmaz.
Tam aşama gerçek trusted Check Run/context/App + strict + exact H ve teknik onay
ister. Check oluşmadan hayalî ad/ID required yapılmaz. Native skipped/neutral kabulü
kendi başına success garantisi değildir; trusted attester bu durumları success'e
çeviremez. Ortak önerilen bal/trusted-validation iki PR türünü farklı modda inceler;
eski content-candidate/trusted-validation yerel simülatörü bu tur değişmez.

### 24.3. CI dosyaları, izinleri ve teknik/içerik ayrımı

Önerilen fakat oluşturulmayan dosyalar: pr-diagnostics.yml (sırsız yardımcı PR CI),
trusted-candidate.yml (workflow_run/main dispatch/push-main controller), ileride
content-intake.yml sinyali ve ayrıca yetkili promote-content.yml writer. Gerçek
.github/workflows dosyası bu tur yok. Action pinleri tam SHA olarak gelecekteki
onaylı diff'te bağlanır; sahte sürüm/hash uydurulmaz. Linux Chrome/Node/pin/sandbox
kurulumu gerçek CI'da henüz denenmedi.

Content kontrol M kodu/M package-lock ile yalnız strict normalize C verisini alır;
code/workflow/env değişikliği otomasyona girmez. Yerel adapter/Git ingress/3-way ve
kimlik/verified/koordinat kapıları korunur. Teknik PR'da H kodu credential'sız
sandbox'ta M driver'la, ayrı insan teknik inceleme akışıyla sınanır. İçerik için
manuel approval yoktur. PR'ın değiştirdiği workflow yeşili veya ortak GitHub
Actions App kimliği tek başına trusted kanıt olamaz.

Validator permissions:{}, custom secret/environment yok; metadata controller yalnız
gereken contents/pull-requests/actions read. Attester ayrı main-only environment ve
ayrı dar checks:write App; writer ayrıca contents/PR write, checks/admin/bypass yok.
Mevcut kişisel Git credential'ı CI'ya taşınmaz. Source artifact/cache/log/SHA beyanına
güvenilmez; API/Git/run/attempt/workflow subject ve H/M/C yeniden bağlanır. App veya
sandbox kanıtı yoksa tam otomatik kapı açılmaz; planı uygulama gibi raporlamayız.

Teknik onay için exact SHA yetkili review veya tek owner/self-review sınırında
main-ref actor doğrulamalı teknik sign-off önerildi; bu alternatifin uygulanması
ve negatif testleri ayrı iştir. Global CODEOWNERS/label güvenliği varsayılmadı.

### 24.4. Güvenli enforcement testi ve izin sınırları

Main'e gerçek force/delete/değişik commit göndererek test yapılmaz. GET active
rules/effective main/classic protection ve bypass analizi yapılandırma kanıtıdır;
gerçek ret değildir. Ayrı açık izinli disposable canary policy/ref/PR testleriyle
admin/force/delete/failure-check/yanlış App-SHA davranışı sınanabilir. Canary ret
main'de gerçekleşmiş ret gibi sunulmaz. No-op/dry-run server enforcement testi değil.

Kod-as-content, malformed JSON/image/category, merge conflict, stale M/C testleri
mevcut yerel testlere dayanır; uzak enforcement henüz PENDING. Gerçek App bypass
ret testi App kurulumu olmadan yapılmış sayılamaz. Bir kapı eksikse writer/auto-merge/
CMS kapalı kalır; CI hatası diye koruma kaldırılmaz. Ayrı izin sırası: exact bootstrap
ruleset → teknik branch/CI diff/commit/push/PR/run → canary/attester/environment →
gerçek context/App/strict ruleset geçişi; sonra ayrıca CMS/davet/Cloudflare.

### 24.5. Doğrulama, dosyalar ve Git

Bu yerel planın son format/JSON/koruma/test sonuçları QUALITY_REPORT ve
/private/tmp/bal-phase42d loglarında tutulur. Yeni uygulama özelliği veya test
silme/dependency/config/veri değişikliği yok; dört koordinat korunur. AGENTS/README,
master plan/mimari/roadmap/güvenlik/CMS/yayın/kalite belgeleri güncellenir. Yerel
belgeler uncommitted; HEAD/local/remote main ac62779 ve dokuz commit kalır.
Gerçek workflow veya JSON payload'u GitHub'a gönderilmedi; 4.2-e başlamaz.

Son yerel sonuçlar: npm run check PASS; 426/426 Vitest (27 dosya), CMS config,
strict/lint/Prettier, 67 dosya noindex export ve 3/3 HTTP. Chrome E2E 51/51;
320/393/768/1280 regresyonları mevcut testlerde geçti. Ruleset JSON parse + yerel
ayar invariant'ları PASS, GitHub server schema/enforcement testi yapılmadı.
200 korunan kaynak byte eşit ve gerçek .github/workflows yok. Yerel Git main
ac62779 aynı; plan değişiklikleri uncommitted. Son uzak read-only kontrol ve
koruma raporu QA dizinindedir. App/secret/canary/required checks/teknik sign-off
ve CI sandbox uygulamaları bu turun sonucu değildir. Tek bir main/source atomik
kilidi varsayılmadı; queue/eski run/son source ve strict base testleri gelecekte gerekir.

## 25. Faz 4.2-E1 — Gerçek main-bootstrap ruleset doğrulaması

8 Kasım 2026: kullanıcı main-bootstrap ruleset'ini kurduğunu bildirdi. Bu görev
salt okunur doğrulama ve E2 geliştirme planıdır; yeni uzak ayar veya E2 uygulaması
yetkisi yok. Önceki 4.2-d uncommitted belgeleri ve uygulama korundu. Git main/HEAD
ac62779e3a5a8ad0de76dd4c040c32387bd1c474; origin doğru, remote SHA eşit.

### 25.1. Gerçek GitHub kanıtı

Repo ID 1439737232 Public. Yetkili mevcut Git kimliği yalnız GET için kullanıldı,
credential değeri log/projeye yazılmadı. Ruleset listesinde yalnız **26805718**
main-bootstrap; detail 200 active/branch, source doğru repo. Conditions include
refs/heads/main, exclude=[]; bypass_actors=[] ve current_user_can_bypass=never.
Branch API protected=true. Effective rules endpoint'i deletion/non_fast_forward/
pull_request üçlüsünü aynı ruleset ID ile döndürdü. PR required approvals=0,
required_reviewers=[], Code Owner/last push approval/thread resolution false.
Required status check/restrict updates/restrict creations veya başka kural yok.

Classic protection GET 404 Branch not protected döndürdü; bu endpoint farklı
koruma türüdür. Ruleset detail + protected flag + effective rules kanıtı nedeniyle
koruma yokluğu diye raporlanmadı. Workflow/deployment 0; ls-remote yalnız main ve
HEAD→main. Force/delete/different-commit push/no-op/dry-run testi yapılmadı; API
koruma konfigürasyonu canlı ret deneyi değildir.

### 25.2. Eksik ve beklenmeyen alan analizi

Çekirdek kullanıcı gereksinimi eksiksiz. Önceki yerel taslağın
**dismiss_stale_reviews_on_push=true** alanı gerçekte **false**. Approval=0 olduğu
şimdiki bootstrap için engel değil; teknik onayın ileride exact SHA'ya bağlanması
ve eski review'a güvenilmemesi gerekir. Bu fark WARNING ve otomatik düzeltilmedi;
docs/github/main-bootstrap.ruleset.json taslak olarak aynı kaldı.

API ayrıca require_extra_approval_for_unattributed_changes=true (nonzero approval
count koşulunda anlamlı), allowed_merge_methods=[merge,squash,rebase] ve
required_reviewers=[] döndürdü. Şu an ek insan onayı gerektirmiyor. İleride review
ayarları değişirse conditional alan yeniden değerlendirilmeli. H ile merged main
SHA'sı farklı olabildiğinden tree/kanıt zinciri gereği korunur.

### 25.3. Bootstrap sınırı ve E2 planı

Bootstrap doğrudan main yazma/force/delete engeli olarak aktif yapılandırılmıştır;
required CI değildir. Approvals=0/check yokken yetkili aktör bozuk/başarısız testli
PR merge edebilir. Adminin policy ayarı değiştirme yetkisi ortadan kalkmaz. CMS/
automatic writer/Cloudflare bağlanmaz; App bypass reddi henüz canlı test değildir.

Yeni MAIN_BOOTSTRAP_VERIFICATION.md gerçek alanları, farkları ve somut E2 sırasını
tutar. E2 önerisi: ayrı chore/trusted-ci-bootstrap branch'i (ayrı izin), mevcut
belgeleri koruyarak CI driver/wrapper ve ilk iki YAML'i yerelde hazırlama; M kodu/
M lockfile, read-only metadata, sırsız validator, full-SHA action pin/Chrome-Linux
reçetesi. Teknik değişiklikler ayrı sandbox ve SHA bağlı inceleme; data-only yolu
trusted schema/media/kimlik kapısından geçer. Gerçek workflow main'e teknik PR ile
alınır; sonra run/attempt/workflow/app/head kanıtı görülür. Context/App/strict geçişi
ve dar attester kurulumu ayrıca yetki ister; native untrusted job yeşili trusted
verdict sayılmaz. Henüz content-edit/CMS branch'i veya yeni App şartı kurulmaz.

E2 için izin yerel uygulama, commit/branch/push/PR/run kapsamlarını açıkça ayırmalı.
Gerçek check oluşmadan ruleset 26805718'e required context eklenmez. Ali Bey'in
content save akışında manuel teknik onay/JSON/terminal/piksel ihtiyacı yaratılmaz.
Bu görevde hiçbir E2 script/YAML/PR/branch veya deployment oluşturulmadı.

### 25.4. Doğrulama, Git ve teslim

API yanıtları/önceki diff/status, observed-summary ve verification.json
/private/tmp/bal-phase42e1-20261108 altında. Yerel makine karşılaştırması çekirdek
alanlarda PASS; stale-review ve conditional default alanları WARNING. 200 korunan
kaynak byte eşit; .pages/paket/strict/veri/tasarım ve dört koordinat değişmedi.
Önceki uncommitted belgeler korundu; yeni doğrulama kaydı ve plan/rehberler güncellendi.
Local/remote commit ve Git history değişmedi; yeni commit/push/ayar yok.

Bu görevin yeniden çalıştırılmış yerel QA sonuçları QUALITY_REPORT ve QA loglarında
ayrı tutulur. Uygulama testleri gerçek GitHub enforcement olarak sunulmaz. Sonraki
E2 veya ruleset değişikliği ayrıca açık kullanıcı onayını bekler.

E1 son yerel QA: npm run check PASS; 426/426 Vitest (27 dosya), CMS config,
strict/lint/Prettier, 67 dosya noindex static export ve 3/3 HTTP; Chrome E2E 51/51
(320/393/768/1280 regresyonları). Son belge format/whitespace kontrolü geçti.
Bu kontroller gerçek GitHub enforcement testi değildir. Main-bootstrap çekirdek
ayarlarındaki makine fark listesi boş; stale-review/conditional alanlar WARNING.
Son durum GET tekrarında aynı ruleset/effective rules/SHA doğrulanır; ayar değişimi
veya E2 uygulaması yapılmaz. Local main ac62779, belgeler uncommitted kalır.

## 26. Faz 4.2-E2 — Yerel trusted GitHub Actions CI

### 26.1. Yetki ve başlangıç

8 Kasım 2026. E1 kabul edildi; yalnız yerel workflow/driver geliştirme, teknik branch
ve başarılı yerel commit yetkisi verildi. Push, PR, GitHub run/ayar, required check,
App/token/secret, CMS/davet, Cloudflare ve otomatik merge/yayın yetkisi verilmedi.
Kaynak/diff başlangıcı `/private/tmp/bal-phase42e2/source-before.tar.gz` ve before.diff.

main ve origin/main ac62779e3a5a8ad0de76dd4c040c32387bd1c474 olarak korundu.
`chore/trusted-ci-bootstrap` oluşturuldu; önceden commit edilmemiş D/E1 belgeleri
ayrı `cd9c1c62b6576cabdf5d3b6cd5888fa9fbb06b26` checkpoint'inde kaydedildi.
Önce/sonra GET: Public repo, active main-bootstrap 26805718, aynı üç effective kural,
bypass=[]; yalnız uzak main ref'i, workflow 0, deployment 0. Ruleset JSON'u birebir aynı.
Python CA deposu bir GET denemesini durdurdu; TLS gevşetilmeden Node HTTPS ile doğrulandı.

### 26.2. Uygulama

İki yerel YAML: pr-diagnostics ve trusted-candidate. scripts/ci observer/validator
wrapper'ları ve src/ci API/Git/content/sandbox/probe/inside katmanları eklendi.
Mevcut publishing policy, Git blob envanteri, CMS adaptörü ve canonical üç yönlü
merge yeniden kullanılır; ikinci içerik kaynağı veya yeni dependency oluşturulmadı.
M/C/H API'den, B gerçek Git nesnelerinden gelir. Sonunda tekrar API drift denetimi
vardır. Kod/workflow/env/dependency, bozuk JSON/ref/medya, merge conflict ve stale
kimlik içerik doğrulamasını geçemez. Ayrıntılar TRUSTED_CI_IMPLEMENTATION.md içinde.

Host job yalnız read token ile API GET yapar. PR kodu credential'sız non-root,
network:none, readonly root/Git mount ve cap-drop Docker sınırında kalır. Onaylı
M dependency'leri tmpfs'e kopyalanır; tool cache'i host/imaj üstüne yazmaz. Action
SHA'ları ve MCR image digest'i resmî kaynaklardan doğrulandı, provenance.json'a
kaydedildi. Setup-node otomatik cache'i dahil tüm cache kullanımı kapalıdır.

Native diagnostics/check yeşili authority değildir; aynı isim/App spoofing, skipped,
neutral ve eski SHA sonucu yayın izni üretmez. V1'de candidateCommitSha null,
authoritative/checkWritten false; attester/writer/merge yoktur. Fork ve teknik
package/lock değişiklikleri ayrı quarantine gerektirdiğinden v1'de reddedilir.
M'de driver yokken H'den fallback yok; ilk teknik PR ayrı incelemeli bootstrap ister.

### 26.3. Koruma ve doğrulama kaydı

Mevcut içerik, UI, CMS/publishing, eski testler, paket/lock, strict TS, Next ve .pages
kaynaklarından 164 dosya baseline ile byte eşit; iki eski test yalnız içerik beklentilerinin
CMS ile düzenlenebilir olması için güncellendi. Dört koordinat aynı. Değişen mevcut
teknik dosyalar tsconfig.media.json (CI derleme girişi) ve vitest.config.ts (dosya
paralelliği kapalı, Git/görsel işlemleri için testTimeout 15 saniye). Assertion
kapıları korunur; zaman bütçesi 5 saniyeyi aşan gerçek Git/decode işlemlerine göre
ayarlanır. Hero unit ve ana sayfa E2E sabit metin yerine yayınlanan JSON
başlık/CTA alanlarını denetler; test amacı ve senaryo sayısı korunur.

İlk eşzamanlı Docker build/host QA turunda üç, ikinci serial host turunda bir eski/Git
fixture 5 saniye timeout verdi. Son test sonuçları kalite raporuna ayrı kaydedilir;
bu erken turlar başarılı sayılmaz. Docker ilk gerçek koşuda izolasyon probe'unu geçti,
Vite readonly dependency cache yazmasında durdu; onaylı dependency'lerin geçici tmpfs
kopyasıyla düzeltildi. Kopyada /work/node_modules yolu, relative .bin symlink
koruması ve yalnız /work için exec gerekir; /tmp noexec, nosuid/nodev ve readonly
host sınırları korunur. Sonraki gerçek koşuda 507 test geçti, fakat canonical JSON
anahtar sırası CMS config eşitliğini bozdu. Karşılaştırma yalnız fields sırasını ve
nesne anahtar sırasını önemsiz sayacak şekilde düzeltildi; tüm alan değerleri
ve upstream schema/hash denetimi korunur. Dört regresyon testi eklendi; .pages.yml
değişmedi. Host yeniden kontrolü 511/511, CMS config, build ve HTTP geçti.
Docker Node 26.13.0, workflow host Node 24.22.2 ve yerel host Node 20.20.0
ölçümleri birbirinden ayrılır; tümü mevcut engine aralığında. Kaynak veya host
mount yazılabilir yapılmadı.

Kanıt/loglar `/private/tmp/bal-phase42e2/`; preservation.json, remote-before/after.json,
audit ve QA logları oradadır. Docker fixture'ları ayrı geçici Git reposundadır;
sentetik metin/görseller gerçek içeriğe yazılmaz. ARM macOS üzerinde amd64 emülasyonu
native Ubuntu GitHub runner testi sayılmaz. Güncel toplu sonuç QUALITY_REPORT'tadır.

### 26.4. Sonraki ayrı izinler — başlatılmadı

Teknik branch push'u ve teknik PR için ayrı açık onay gerekir. İlk PR diff'i ve
bootstrap ayrı incelenir; M'de driver yokken PR script'i hostta çalıştırılmaz.
Gerçek GitHub workflow/run/attempt/SHA, Docker native runner, bağımsız dar attester,
exact candidate commit/tree ve required check geçişi sonraki işlerdir. Ruleset'e
henüz olmayan context eklenmez; main koruması gevşetilmez. Content-edit/CMS kurulumu,
Ali Bey daveti ve gerçek Cloudflare kabulü bu turda yapılmaz. E3'e geçilmedi.

E2 kod commit'i: `d4f5538da2fd8c1cf1e465b9e54d3a67ab9e1150` —
feat: add read-only trusted CI observers and isolated validation. Önceki checkpoint
cd9c1c6 ve main ac62779 korunur. Belgeler ayrı commit'e alınır.
Son host npm run check 512/512, CMS config, static export 67 ve HTTP 3/3 geçti.
86 yeni CI testi vardır; 426 önceki test senaryosu korunur. Docker tam koşusu
511 testlik snapshot'tadır; son nullable config metadata testi ayrıca aynı
Linux Node26 imajında 5/5 hedefli doğrulandı. Tek-worker E2E, mevcut PID/memory
limitlerini değiştirmeden çalışır; eski 5-worker koşusunda pids.events max=185,
OOM=0 gözlendi. Yerel gitref'ler ve gerçek uygulama kaynakları korunur.

### 26.5. Kesin sonuç ve teslim

PASS: host npm run check 512/512 Vitest (31 dosya), strict/lint/Prettier/CMS config,
67 dosya statik export ve 3/3 HTTP; host Chrome 51/51, round-trip PASS, candidate
2/2 ve media 5/5. Gerçek Docker tam reçetesi 511 Vitest/51 Chrome + aynı build/HTTP
ve CMS/candidate/media adımlarını geçti. Son saf optional CMS metadata düzeltmesi
Linux Node26 üzerinde ayrıca 5/5, tüm host suite 512/512 ile doğrulandı.
Docker fixture: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-ci-runtime-plNDxF.
Non-root/no-token/readonly/cap-drop/seccomp/network-denied probe PASS; Git ref'leri
aynı, sadece oluşturduğu container/tag temizlendi. Gerçek GitHub run değildir.

WARNING: actual GitHub workflow/run/token izinleri, native Ubuntu runner, App/attester,
exact candidate commit ve required checks/otomatik aktarım kanıtlanmadı. Son code
commit sonrası reachable history audit 11 commit / 419 blob, bulgu 0; kaynak raster 0.
Mevcut dev lint zincirinde npm audit 8 moderate (exit 1), high/critical 0; force fix
yapılmadı. Son QA reçetesinde açık FAIL yok. İlk başarısız denemeler kanıtlarda korunur.

Final GET: Public main ac62779, yalnız uzak main ref'i, workflow/deployment 0; ruleset
26805718 ve effective üç kural başlangıçla birebir aynı/bypass=[]. Hiçbir uzak
mutasyon yapılmadı. Belgeler ayrı `docs: record trusted CI implementation and runtime evidence`
commit'ine alınır; nihai HEAD teslim yanıtında raporlanır. E3/push/PR/run/App/CMS
ve deployment başlatılmadı. Teknik branch push'u/PR ve sonraki kurulumlar için ayrı
açık onay beklenir. Ali Bey'in gerçek CMS→Cloudflare üç kabul akışı hâlâ PENDING.
