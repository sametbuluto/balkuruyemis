# Bal Kuruyemiş

**Faz 3: statik kurumsal site.** Next.js Static Export ile `out/` üretilir;
ziyaretçiye yalnızca HTML, CSS, JavaScript ve medya dosyaları servis edilir.
Node.js build/geliştirme/test için gerekir; yayında Next sunucusu gerekmez.
İlk sürümde veritabanı, özel backend, CMS, admin, üyelik ve e-ticaret yoktur.
Kırmızı/siyah/beyaz kimlik ve beş temel sayfa korunur.

[Master plan](plan.md) · [Mimari](docs/ARCHITECTURE.md) ·
[İçerik rehberi](docs/CONTENT_GUIDE.md) · [Kalite raporu](docs/QUALITY_REPORT.md)

## Yerelde açma

Node.js aralığı: `^20.19.0 || ^22.13.0 || >=24.0.0`; mevcut ortam 20.20.0.
Paketler mevcutsa tekrar kurmanız gerekmez. Temiz kurulumda `npm ci` kullanın.

```bash
npm run dev
```

Geliştirme: http://localhost:3000. Gerçek statik çıktıyı denemek için:

```bash
npm run build
npm run preview
```

Statik önizleme: http://127.0.0.1:4173. `npm start` aynı statik önizlemeyi açar;
`next start` kullanılmaz. Sunucuyu `Ctrl+C` ile durdurun.
Yerel önizleme betiği yalnızca QA aracıdır; hosting ortamına dağıtılacak backend değildir.
Varsayılan kullanımda ortam değişkeni veya harici servis gerekmez.

## Komutlar ve doğrulama

| Komut                                 | İşlev                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------- |
| `npm run typecheck`                   | Next rota tipleri + strict TypeScript                                     |
| `npm run lint`                        | ESLint, sıfır uyarı                                                       |
| `npm run format:check`                | Prettier                                                                  |
| `npm test`                            | Vitest + React Testing Library                                            |
| `npm run build`                       | Webpack static export + dosya/PNG/SEO doğrulaması + Cloudflare `_headers` |
| `npm run test:static`                 | `out/` üzerinde statik HTTP, 404, RSC, MIME ve geçici alan adı başlıkları |
| `npm run check`                       | Yukarıdaki kontroller, sırayla; build dahil                               |
| `npm run test:e2e`                    | `out/` üzerinden masaüstü, mobil ve tablet Playwright                     |
| `node scripts/test-branch-export.mjs` | Geçici kopyada doğrulanmış şube detay export testi                        |

```bash
npm run check
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

Playwright 3100 portunda statik sunucuyu açıp kapatır; port boş olmalıdır.
Chrome kurulu değilse `npx playwright install chromium` ardından channelsız komut kullanılabilir.
Testler 320, 393, 768 ve 1280 px kontrol eder. Çıktılar `test-results/`,
HTML raporu `playwright-report/` altındadır; Git'e eklenmez.
Build/typecheck aynı dizinde eşzamanlı çalıştırılmamalıdır.

İsteğe bağlı dev QA (statik QA yerine geçmez):

```bash
PLAYWRIGHT_SERVER=dev PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- --project=desktop-chromium --grep 'sticky menü'
```

Dev QA mevcut 3000 sunucusunu koruyarak yeniden kullanır.

## Mimari ve içerik

```text
src/
  app/                  # Beş sayfa, layout, 404, build-time SEO/PNG
    subelerimiz/[slug]/page.branch.tsx  # Yalnızca doğrulanmış şube varsa etkin
  content/              # Tek Git içerik kaynağı, sorgular ve doğrulama
  types/                # İçerik sözleşmeleri
  components/           # Layout, marka, iletişim, galeri ve StaticImage
  features/             # Ana sayfa, katalog ve şube arayüzleri
  config/               # Geriye uyumlu re-export
  styles/               # Kırmızı/siyah/beyaz tasarım tokenları
scripts/                # Statik QA sunucusu, çıktı doğrulama, izole export testi
tests/e2e/              # Gerçek statik HTTP üzerinde tarayıcı testleri
tests/static/           # Statik dosya sunumu testleri
public/images/          # Gerçek ve önceden optimize edilmiş yerel medya
docs/                   # Mimari, içerik, yol haritası ve kalite
out/                    # Üretilir; Git'e alınmaz
```

Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3 strict, Tailwind 4.3.3,
ESLint 9, Prettier 3, Vitest 4, RTL ve Playwright korunur; yeni paket eklenmedi.
Ortamın Turbopack yardımcı süreç kısıtlaması nedeniyle resmî `--webpack` seçeneği kullanılır.

Dört gerçek koordinat işletme sahibince sağlandı. `src/content/branches.ts` içindeki
Konum 1–4 henüz şube adı/adres eşleşmesi bekler. Hepsinde haritada açma ve
Google Maps URLs API `api=1&destination=...` yol tarifi vardır; adres/telefon/saat
uydurulmaz. Bu kayıtlar detay sayfası, sitemap veya LocalBusiness verisi üretmez.
Tarihsel örnek kayıtlar ayrı tutulur ve canlı gride girmez.

Kategoriler `src/content/categories.ts`, ürünler `products.ts`, sosyal kanallar
`social.ts`, marka/logo `site.ts`, galeri `gallery.ts` üzerinden yönetilir.
Değişiklik sonrası yeniden build gerekir; şube sayısı görünür kayıtlardan türetilir.
Yeni kayıt ve fotoğraf ekleme adımları [CONTENT_GUIDE](docs/CONTENT_GUIDE.md) içindedir.

Kategori query seçimi JavaScript ile çalışır; doğrudan URL, yenileme, geri/ileri ve
hatalı seçim mesajı korunur. Statik HTML tüm query'lerde genel katalog metadata'sını
taşır; sekme ve paylaşım metinleri de genel katalog kimliğinde kalır.
JavaScript kapalıyken genel kategori listesi kalır. Canonical katalog ana URL'sidir.

## SEO ve ortam değişkenleri

`.env.example` referanstır; gerçek değerleri Git'e eklemeyin. Hiçbiri sır değildir.

| Değişken                     | Davranış                                                         |
| ---------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | Ürün sahibince doğrulanmış HTTPS origin; varsayılan boş          |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Varsayılan `false`; domain tek başına indeksleme açmaz           |
| `SITE_PRODUCTION_BRANCH`     | Varsayılan `main`; Pages production dalıyla eşleşmeli            |
| `CF_PAGES_BRANCH`            | Cloudflare tarafından verilir; diğer dallarda indeksleme kapanır |

URL, kimlik bilgisi/yol/query/hash içeremez. Geçici `.pages.dev`, `.vercel.app`,
`.netlify.app`, localhost/IP/test adresleri canonical kaynağı olarak kabul edilmez.
Alan adı yokken canonical ve absolute paylaşım görseli yok; noindex, robots disallow
ve boş sitemap vardır. Domain ayarı canonical/OG URL üretir; indeksleme için ayrıca
`NEXT_PUBLIC_ALLOW_INDEXING=true` ve production dalı gerekir. Her değişiklikte build alınır.

`out/_headers` tüm `.pages.dev` ve dal önizlemelerinde ayrıca `X-Robots-Tag: noindex`
verir; domain yanlışlıkla ayarlansa bile geçici host korunur. Alan adı olmayan build
bütün hostlarda noindex başlığı taşır. Bu başlıkların gerçekten uygulanması hosta bağlıdır.
PNG'ler build'de oluşur: `/icon`, `/apple-touch-icon.png`, `/opengraph-image`.
Bilinmeyen yollar kök `404.html` ile gerçek HTTP 404 olmalıdır; SPA fallback açılmamalıdır.

## Cloudflare Pages hazırlığı — yayın yapılmadı

| Ayar              | Beklenen değer                                             |
| ----------------- | ---------------------------------------------------------- |
| Framework preset  | Next.js (Static HTML Export)                               |
| Build command     | `npm run build` (çıktı doğrulayıcısını da çalıştırır)      |
| Build output      | `out`                                                      |
| Root directory    | Proje kökü                                                 |
| Production branch | `main` veya `SITE_PRODUCTION_BRANCH` ile aynı seçilmiş dal |
| Node              | Desteklenen aralıkta sabit sürüm; mevcut doğrulama 20.20.0 |

GitHub bağlantısı ileride ayrıca yetkilendirilirse: repository'ye push → Pages
build → `out/` statik yayın. PR/dal build'lerinde noindex korunur. Bu fazda GitHub
repository, push, Cloudflare bağlantısı, domain veya deployment yapılmadı.

Yayın öncesi: gerçek içerikleri doğrula; yerel check/E2E'yi çalıştır; domain/indeksleme
için ürün sahibi onayı al; Pages'te 404, PNG MIME ve `_headers` davranışını yeniden
test et; fiziksel cihaz ve eksik tarayıcıları tamamla. Faz 4 kendiliğinden başlatılmaz.

Kaynaklar: [Next.js Static Export](https://nextjs.org/docs/app/guides/static-exports),
[Cloudflare statik Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/),
[Pages yönlendirme/404](https://developers.cloudflare.com/pages/configuration/serving-pages/),
[Pages başlıkları](https://developers.cloudflare.com/pages/configuration/headers/),
[Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).

## Faz 3 doğrulama sonucu

TypeScript, ESLint, Prettier, **25/25 Vitest**, static export, **3/3 statik HTTP** ve
**36/36 Playwright** geçti. `out/`: 68 dosya, yaklaşık 1.9 MiB. 320/393/768/1280 px
incelendi; 20 axe taramasında otomatik ihlal 0. WebKit/Firefox binary dosyaları yok;
bu tarayıcılar ve fiziksel cihaz testi eksik. Hero kontrastındaki otomatik ölçüm
sınırı [kalite raporunda](docs/QUALITY_REPORT.md) kayıtlıdır.

## Tarihsel doğrulamalar — önceki fazların davranışıdır

Aşağıdaki kayıtların eski sunucu/SEO/Git kararları Faz 3 tarafından güncellenmiştir.
Faz 2.1 geri dönüş commit'i ürün sahibi onayıyla yerelde `b844bad` olarak oluşturuldu.
Faz 3 değişiklikleri henüz commit edilmedi; harici remote yoktur.

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
