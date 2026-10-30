# Bal Kuruyemiş

İzmir Buca'da dört fiziksel şubesi bulunan Bal Kuruyemiş için Türkçe kurumsal
web sitesi. Slogan: **Lezzetin Doğal Adresi**.

Aktif kapsam **Faz 2.1: marka kimliği revizyonu**. Faz 1 altyapısı korunur.
E-ticaret, veritabanı, kimlik doğrulama, admin ve deployment bu fazın dışında.

Faz geçmişi, teknik kararlar, yapılan ve sıradaki işler için ana referans: **[plan.md](plan.md)**.

## Gereksinimler

- Node.js `^20.19.0`, `^22.13.0` veya `>=24.0.0`; yeni kurulumda Node.js 24 LTS tercih edin.
- npm ve Git.
- Mevcut ortam Node.js 20.20.0 ile doğrulanır. Paketlerin minimum Node gereksinimleri
  nedeniyle her 20.x veya 22.x sürümü desteklenmez.

## Yerel başlatma

Terminali proje kökünde açın:

```bash
npm ci
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.
Paketler zaten kuruluysa yalnızca `npm run dev` yeterlidir. Durdurmak için `Ctrl+C`.

Production sürümünü yerelde denemek için:

```bash
npm run build
npm run start
```

Varsayılan yerel kullanımda ortam değişkeni veya harici servis gerekmez.

## Teknolojiler

Next.js 16 App Router, React 19, TypeScript 6 strict, Tailwind CSS 4,
ESLint 9, Prettier 3, Vitest 4, React Testing Library ve Playwright.
Tam sürümler `package.json` ve `package-lock.json` içinde sabittir.

ESLint 10 yerine 9, Next.js lint eklentilerinin peer dependency uyumu için
seçilmiştir. TypeScript 6.0, typescript-eslint'in `<6.1` sınırı nedeniyle;
Vitest 4 ve jsdom 27 ise mevcut Node.js 20 ortamıyla uyum için kullanılır.

Geliştirme ve production build, Next.js'in desteklediği `--webpack` seçeneğini
kullanır. Bu geliştirme ortamında Turbopack'in PostCSS yardımcı sürecinin yerel port
açması engellendiği için Webpack ile doğrulama yapılmıştır.

## Komutlar

| Komut                  | İşlev                                                           |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Yerel geliştirme sunucusu                                       |
| `npm run typecheck`    | Next.js rota tiplerini üretir, TypeScript kontrolünü çalıştırır |
| `npm run lint`         | ESLint; uyarılar da başarısızlık sayılır                        |
| `npm run format`       | Kaynakları Prettier ile biçimlendirir                           |
| `npm run format:check` | Biçim kontrolü                                                  |
| `npm test`             | Vitest + React Testing Library testleri                         |
| `npm run test:watch`   | Bileşen testlerini izleme modunda açar                          |
| `npm run build`        | Production build                                                |
| `npm run check`        | Typecheck → lint → biçim → bileşen testleri → build             |
| `npm run test:e2e`     | Production build üzerinde masaüstü ve mobil Playwright testleri |
| `npm run test:e2e:ui`  | Playwright test arayüzü                                         |

Playwright'ın ilk kurulumunda:

```bash
npx playwright install chromium
npm run check
npm run test:e2e
```

Kurulu Google Chrome'u kullanmak için alternatif:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

E2E öncesi `npm run build` tamamlanmış olmalı. Testler `127.0.0.1:3100`
üzerindeki production sunucusunu kendisi açar ve kapatır; bu port boş olmalıdır.
Test çıktıları `test-results/`, HTML raporu `playwright-report/` altındadır.
Masaüstü, mobil ve tablet projeleri bulunur. 1280, 768, 393 ve 320 px ekran
görüntüleri ilgili test sonuç klasörüne kaydedilir.
Bu dizinler Git'e eklenmez.

## Klasörler

```text
src/
  app/                 # App Router sayfaları, layout, metadata, 404
    hakkimizda/
    urunlerimiz/
    subelerimiz/
      [slug]/          # Doğrulanmış şube kaydı yoksa 404
    iletisim/
  components/
    layout/            # Header ve Footer
    ui/                # Container, bölüm başlığı, çizgi ikonlar ve ortak arayüz
    brand/             # Değiştirilebilir logo, tipografik ikon/paylaşım görseli
    gallery/           # Next Image ile fotoğraf galerisi
    contact/           # Yapılandırılabilir iletişim kanalları
  config/              # Marka ve navigasyon bilgileri
  features/
    home/              # Ana sayfanın bölümleri
    catalog/           # Altı kategori, URL tabanlı seçim ve ürün arayüzü
    branches/          # Gerçek ve örnek şube ayrımı, şube kartları
    gallery/           # Gerçek fotoğraflar için boş veri kaynağı
  lib/                 # Ortak metadata üretimi
  styles/              # Merkezi tasarım tokenları
  types/               # Veritabanından bağımsız içerik modelleri
tests/
  setup.ts             # React Testing Library kurulumu
  e2e/                 # Playwright senaryoları
docs/
  ARCHITECTURE.md
  ROADMAP.md
```

## İçerik, logo ve görsel yönetimi

- Ana sayfa: sticky navbar, hero, kategoriler, marka tanıtımı, dört örnek şube,
  galeri, Instagram/WhatsApp alanları ve footer.
- Başlangıç kategorileri: Kuruyemiş, Kahve, Lokum, Baharat, Aktar ve Kozmetik.
  Ürünler henüz boş; fiyat, sepet ve ödeme alanı bulunmaz.
- Kategori bağlantıları `/urunlerimiz?kategori=kahve` biçimindedir.
  Bilinmeyen kategori tüm kategorilere güvenli dönüş mesajı gösterir.
- Örnek şubeler `exampleBranches` içinde tutulur; kartlarda **Örnek içerik** görünür.
  Gerçek kayıt kaynağı `branches` boştur. Örnek slug'ları 404 döner.
- Bilinmeyen şube adresi, telefon, saat, harita ve WhatsApp alanları `null` kalır.
- Sosyal bağlantılar `src/config/site.ts` içinde `contactChannels` üzerinden yönetilir.
  URL yokken link veya çalışmayan düğme gösterilmez.
- Renk ve fontlar `src/styles/tokens.css` içindedir. Harici font indirmesi yoktur.

Orijinal logo geldiğinde dosyayı `public/brand/` içine ekleyin; `src/config/site.ts`
içindeki `brandAssets.logo` alanına `MediaAsset` kaydını (URL, boyutlar, alt metin)
girin. Koyu zemin için `inverseLogo` kullanılabilir. Header, hero, Hakkımızda ve
Footer aynı `BrandMark` bileşenini kullanır. Logo yokken tipografik marka korunur.

Gerçek fotoğraflar geldiğinde yerel yolları, boyutları ve alternatif metinleriyle
`src/features/gallery/data.ts` içine ekleyin. Kategori/ürün/şube görselleri de
`MediaAsset` kullanır. `next/image`, responsive `sizes` ve lazy loading hazırdır.
Uzak depolama sağlayıcısı seçilmediği için harici görsel hostları açılmamıştır.
Gerçek fotoğraf yokken açıklamalı bekleme alanları gösterilir; stok veya üretilmiş
mağaza/ürün fotoğrafı bulunmaz.

## İkon ve kaydırma düzeltmeleri

- `/apple-touch-icon.png`: 180×180 PNG; root metadata bu gerçek adrese bağlıdır.
- `/icon`: 32×32 tipografik favicon; metadata bağlantısı açıkça tanımlıdır.
- `/opengraph-image`: 1200×630 tipografik paylaşım PNG'si.
- İkonlar geçici tipografik varlıklardır; orijinal marka varlıklarıyla güncellenebilir.
- HTML'deki `data-scroll-behavior="smooth"`, Next.js'e smooth scroll tercihini bildirir.
  Sticky navbar için scroll padding ve reduced-motion desteği korunur.

Varsayılan E2E testleri production sunucusundadır. Geliştirme modundaki kaydırma
uyarısını ayrıca kontrol etmek için:

```bash
PLAYWRIGHT_SERVER=dev PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- --project=desktop-chromium --grep 'sticky menü'
```

Dev QA 3000 portundaki mevcut geliştirme sunucusunu yeniden kullanır; yoksa
kendisi açıp kapatır. Kullanıcının çalışan sunucusunu durdurmaz. Varsayılan
production testleri 3100 portunu kullanır. Hiçbiri deployment yapmaz.

## Alan adı ve SEO

`.env.example` içindeki `NEXT_PUBLIC_SITE_URL`, yalnızca gerçek alan adı ürün sahibi
tarafından doğrulandıktan sonra ayarlanmalıdır. Değişken boşken:

- Sayfaların Türkçe başlıkları, açıklamaları, Open Graph ve Twitter metinleri bulunur.
- Canonical adres üretilmez; sitemap boş olur.
- Robots meta ve `robots.txt` indekslemeyi kapatır.

Alan adı ayarlandığında canonical adresleri ve temel sayfalardan oluşan sitemap
üretilir, indekslemeye izin verilir. Paylaşım PNG adresi de yalnızca gerçek alan
adı yapılandırıldığında metadata içine eklenir. Örnek şubeler sitemap’e girmez. Bu bir dağıtım işlemi değildir; canlıya çıkış
ayrı onay gerektirir. Önizleme ortamlarında bu değişkeni boş bırakın.

## Faz 1 doğrulama kaydı

30 Ekim 2026 tarihinde bu ortamda:

- `npm run check`: typecheck, ESLint, Prettier, 5 component testi ve production build başarılı.
- `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: 10 test başarılı.
- Production sunucusunda Türkçe açılış, klavye ile içerik atlama, temel rotalar,
  bilinmeyen şubede 404 ve geçersiz iletişim bağlantılarının yokluğu doğrulandı.
- 1280 px masaüstü ile 393 ve 320 px mobil genişlikleri kontrol edildi;
  yatay taşma ve hero metninin kırpılması için kontroller eklendi.
- Masaüstü ve mobil ekran görüntüleri incelendi. Mobil sonuçlar Chrome/Chromium
  emülasyonudur; fiziksel telefon, Safari veya Firefox testi yapılmadı.
- Yerel Git deposu `main` dalıyla başlatıldı. Commit ve harici remote oluşturulmadı.

Turbopack ile ilk build bu ortamın yerel port kısıtlamasında başarısız oldu;
Webpack ile build geçti. Playwright'ın yerel sunucusu ortam izniyle çalıştırıldı.
Canlı dağıtım yapılmadı.

## Faz 2 doğrulama kaydı

30 Ekim 2026:

- TypeScript, ESLint, Prettier ve Webpack production build başarılı.
- **13/13** Vitest testi; **18/18** Playwright testi başarılı.
- Dev modunda hedefli sticky/scroll testi **1/1** başarılı; smooth scroll uyarısı yok.
- 320, 393, 768 ve 1280 px düzenleri kontrol edildi; ekran görüntüleri incelendi.
- Apple ikon yanıtı 180×180 PNG, paylaşım yanıtı 1200×630 PNG; favicon metadata bağlı.
- Yeni bağımlılık eklenmedi, Git'te kullanıcı değişiklikleri ve çalışan dev sunucusu korundu.
- Testler Chrome/Chromium ve emülasyonla yapıldı; fiziksel cihaz, Safari/Firefox testi yapılmadı.

Tam faz geçmişi, çözüm ayrıntıları ve bekleyen içerikler [plan.md](plan.md) içinde.

## Faz 2.1 — Güncel görsel kimlik ve doğrulama

Canlı kırmızı `#ce142b`, antrasit `#18191b`, beyaz ve nötr açık gri.
Başlıklarda güçlü sistem sans; marka işaretinde mevcut Georgia kullanılır.
Navbar konumu kaldırıldı. Hero siyah/kırmızı ve gerçek fotoğrafa hazır;
kategori/şube kartları ve galeri yeni kimliğe taşındı. İşlevler ve rotalar aynı.

- TypeScript, ESLint, Prettier ve production build başarılı.
- **17/17 Vitest**, **27/27 production Playwright**, **1/1 dev sticky/scroll** testi geçti.
- 320, 393, 768 ve 1280 px ekran görüntüleri incelendi.
- Mevcut axe 4.14.0 ile 20 taramada **0 otomatik ihlal**; hero'daki otomatik ölçülemeyen
  kontrastlar manuel incelendi. Safari/WebKit ve Firefox binary dosyaları kurulu değil.
- Yeni paket, özellik, DB/admin/auth veya deployment yok; mevcut testler silinmedi.

Ayrıntılar: [kalite raporu](docs/QUALITY_REPORT.md) ve [master plan §11](plan.md).

## Sonraki çalışmalar

Önce [master planı](plan.md) okuyun. Kısa kapsam özeti için [ROADMAP](docs/ROADMAP.md), teknik kararlar
için [ARCHITECTURE](docs/ARCHITECTURE.md), geliştirme kuralları için
[AGENTS](AGENTS.md) dosyalarını okuyun. Sonraki fazlara ürün sahibinin talimatıyla geçilir.

Yerel Git deposu kullanılacak; harici GitHub deposu ve canlı dağıtım Faz 2.1'in parçası değildir.
