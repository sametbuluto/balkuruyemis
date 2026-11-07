# Bal Kuruyemiş geliştirme kuralları

Bu dosya proje kökünün ve tüm alt klasörlerin geliştirme kurallarını tanımlar.
Ürün sahibinin güncel talimatları bu belgeden önceliklidir.

## Kapsam ve kaynaklar

- Proje bir kurumsal tanıtım sitesidir. Sepet, ödeme veya sipariş ekleme.
- Güncel ürün kararı Master Prompt V5.0'dır; önceki CMS yasağını değiştirir.
- Faz 3 kabul edildi, commit `78df0f7`. Faz 4.1-a/b/c1/c2 kabul edildi ve yerel Git
  ile kaydedildi. c3/c4 kabul edildi; aktif kapsam c5 CMS alan eşlemesi/güvenilir
  medya adaptörü, yerel .pages.yml ve gerçek kabul testlerinin hazırlığıdır.
  Hesap bağlantısı, push veya deployment başlatma; başarılı işi yerel commit ile kaydet.
- Hedef: hosted Pages CMS + GitHub + Actions + Cloudflare Pages. Site static export
  kalır; uygulamaya DB/PostgreSQL/Prisma/özel API/custom admin kurulmaz. CMS hizmetinin
  kendi kimlik doğrulaması/veri altyapısı bu yasakla karıştırılmaz.
- Bu tur tasarım değiştirme; ürün/fotoğraf/logoları uydurma. Logo ve gerçek medya Faz 5,
  kesin şube/sosyal bilgiler Faz 6, domain/SEO Faz 7, bakım/rollback Faz 8 hedefidir.
- Plan ve rapor kaynakları: plan.md §20, docs/CMS_SETUP.md, SECURITY.md,
  DEPLOYMENT.md, ROLLBACK.md ve EDITOR_GUIDE.md. PHASE4_PLAN eski görsel plandır.
- Push, CMS App yetkilendirmesi, hesap/davet/izin, GitHub ayarları, ödeme/domain ve
  deployment ayrı kullanıcı onayı gerektirir. Salt okunur bağlantı incelemesi yapılabilir.
- Sonraki fazlara kendiliğinden geçme.
- Kırmızı/siyah/beyaz tasarımı, rotaları, etkileşimleri ve testlerin amaçlarını koru.
- Özel uygulama backend/auth/admin geliştirme; harici CMS ve yayın kurulumunu bu ilk görevde başlatma.
- `plan.md` fazların, yapılan işlerin, teknik kararların ve doğrulama sonuçlarının
  ana kaydıdır. Her fazda güncelle. `docs/ARCHITECTURE.md` teknik ayrıntıları,
  `docs/ROADMAP.md` kısa kapsam özetini tutar; bu belgeler birbiriyle tutarlı olmalı.
- Doğrulanmış bilgiler: marka adı, slogan, İzmir Buca ve dört gerçek koordinat.
- Koordinatlar Konum 1–4 olarak tutulur; işletme adı/adres eşleşmesi doğrulanmadı.
- Ahmet Yesevi/Gediz veya başka şube adlarıyla eşleştirme.
- `location` kayıtlarını detay, sitemap ve LocalBusiness şeması olarak yayımlama.
- Şube adı, adres, telefon, saat, ürün, sosyal hesap, marka tarihi, sertifika
  veya kalite iddiası uydurma. Bilinmeyenleri boş tut; arayüzde açık durum mesajı göster.
- Demo içerik zorunlu olursa görünür biçimde “Örnek içerik” olarak işaretle.
- Tarihsel örnek şubeleri gerçek konumlarla karıştırma; canlı grid örnek kaynağı kullanmaz.
  Örnek kaydı gerçek şube detayında, sitemap'te veya yapılandırılmış veride yayımlama.
- Başlangıç kategorileri: Kuruyemiş, Kahve, Lokum, Baharat, Aktar ve Kozmetik.
- Gerçek görseller gelene kadar mağaza, ürün veya logo fotoğrafı üretme.
- Doğrulanmamış Google Haritalar, Instagram, WhatsApp veya telefon bağlantısı ekleme.
- Kullanıcının onayı olmadan canlı dağıtım veya harici depo oluşturma.
- Yıkıcı terminal işlemleri yapma. Başkasının değişikliğini geri alma.

## Kod ve mimari

- TypeScript strict ve `noUncheckedIndexedAccess` açık kalmalı. `any` kullanma.
- App Router sayfalarını ince tut; işlevleri `src/features`, ortak arayüzü
  `src/components`, içerik sözleşmelerini `src/types` altında tut.
- Server Component varsayılandır. `use client` yalnızca etkileşim gerektiğinde eklenir.
- Kategorilerin tek kaynağı `content/categories/category-*.json` dosyalarıdır.
  `categories.server.ts` Node/RSC loader, category-schema strict runtime sözleşmesidir.
  Client kategorileri props ile alır; Node fs loader'ını client'a import etme.
- Ürünlerin tek kaynağı `content/products/product-*.json`; gerçek ürün yokken
  yalnız `.gitkeep` içeren boş koleksiyon geçerlidir. products.server.ts strict
  loader kullanır; categoryId gerçek kategori JSON kimliğine referans vermeli.
  Yalnız published ürün + published kategori ziyaretçiye aktarılır; draft veri client
  props/HTML/SEO içine girmez. Sahte ürün veya ikinci TS literal listesi ekleme.
- Şubelerin tek kaynağı `content/branches/<id>.json`; örnek kayıt bu koleksiyona girmez.
  `branch-identity.ts` yalnız korunan onay hash'leri taşır; JSON'daki verified bayrağı
  tek başına yetki değildir. ID/slug/ad/adres/koordinat özeti onayla eşleşmeden build durur.
  Kimlik alanı değişince ürün sahibi doğrulaması ve teknik onayın yenilenmesi gerekir.
  Şube sayımı JSON'dan türetilir; dört mevcut koordinatı koru. Header veri hazırlığını
  server wrapper'da, menü etkileşimini içerik/fs import etmeyen client bileşeninde tut.
- Galeri tek kaynağı content/gallery/<id>.json; ürün/kategori/şube medya nesneleri
  ebeveynlerinde kalır. İkinci düzenlenebilir medya registry'si ekleme. Galeri usages
  alanıyla hero/ortak/şube galerisini seçer; embedded status/sortOrder isteğe bağlıdır.
- Medya için standart npm run build pipeline'ını koru: tek build anıyla decode/doğrulama → Next →
  sanitize out/images → export denetimi. SVG şimdilik kapalı; yalnız JPEG/PNG/WebP/AVIF.
  .generated araç/raporları Git'e veya client'a taşıma. Source dosyaları değiştirme;
  taslak/orphan raw dosyaları statik çıktıdan dışla. MEDIA_GUIDE limitlerini koru.
- Kurumsal metinlerin tek kaynağı content/pages/{home,about,contact,catalog,branches}.json;
  marka/iletişim/sosyal ayarlar content/settings/{site,social}.json; duyurular
  content/announcements/announcement-*.json dosyalarıdır. editorial.server.ts yalnız
  Node/build katmanında strict yükler; client yalnız gerekli copy props alır.
  React düz metin renderını koru; HTML/CSS, href veya teknik SEO/env alanı açma.
  Temel sayfalar zorunlu; draft/published ve tarihler duyuru koleksiyonuna uygulanır.
  SITE_BUILD_AT teknik build anıdır; tarihli duyuruların değişmesi yeni build ister.
  verified iletişim bayrağı insan doğrulamasını belirtir, hesap sahipliğini kanıtlamaz.
  Ayrıntılar EDITORIAL_GUIDE.md içinde. Taşıma tip/schema/kimlik eşitliği testleriyle aşamalıdır. `src/config/site.ts` ve
  eski feature data modülleri yalnızca uyumluluk re-export noktalarıdır. Şube sayısını
  kayıt listesinden türet; UI içine sabit sayı yazma. Renk ve tipografi tokenlarını
  `src/styles/tokens.css` üzerinden yönet.
- İçerik kimlikleri ile URL slug'larını ayır; Git üzerinden yönetilen tipli
  düz veri modelleri kullan. Bilinmeyen alanlarda uydurma metin yerine `null` kullan.
- Gereksiz bağımlılık, soyutlama veya genel amaçlı framework ekleme.
- Sürümler kararlı, birbiriyle ve mevcut Node.js ile uyumlu olmalı.
  `package-lock.json` dosyasını takip et; `--force` / `--legacy-peer-deps` kullanma.
- Anahtar, parola veya kişisel veriyi koda, loglara ya da Git'e ekleme.
- Ortam değişkenlerini `.env.example` içinde yalnızca açıklama ve boş örneklerle belgele.

## Arayüz, erişilebilirlik ve SEO

- Varsayılan dil Türkçe; tüm metin dosyaları UTF-8 olmalı.
- Tasarım mobil öncelikli; 320 px ve üzeri ekranlarda yatay taşma olmamalı.
- Ana kimlik canlı kırmızı, siyah/antrasit ve beyazdır; yardımcı zeminler nötr açık gridir.
  Bordo/krem görünümüne dönme. Gold yalnızca sınırlı vurgu olarak kullanılmalı.
- Navbar'da konum metni gösterme; marka, dengeli navigasyon ve sticky davranışı koru.
- Semantik HTML, tek sayfa başlığı, görünür klavye odağı ve anlamlı link metinleri kullan.
- Mobil menüde `aria-expanded`, `aria-controls`, Escape desteği ve kapanınca
  odak dönüşünü koru. Klavye odağını gizli öğelerde bırakma.
- Hareket azaltma tercihini gözet; gerekli olmayan animasyon ekleme.
- Smooth scroll kullanıldığında HTML'de Next.js'in `data-scroll-behavior` işaretini koru.
- Görsellerde `StaticImage` üzerinden unoptimized Next Image ve hazır AVIF/WebP
  varyantları kullan. Boyut, alt, responsive sizes, lazy ve hero önceliğini koru.
- `output: export` korunmalı; request searchParams, cookies, Server Actions,
  runtime API, next start veya sunucu görsel optimizasyonu ekleme.
- Şube detay şablonu `page.branch.tsx`, yalnızca `getPublishedBranches()` boş değilken
  next.config içindeki özel uzantıyla etkinleşir. Sahte static parametre üretme.
- Onaylanmış alan adı gelene kadar canonical/sitemap adresi uydurma.

## Doğrulama ve teslim

- Önemli aşamalarda ilgili kontrolleri çalıştır; hatanın nedenini düzelt.
- Teslimden önce `npm run check` çalıştır. Bu komut typecheck, ESLint,
  Prettier, bileşen testleri, static export ve statik HTTP testlerini içerir.
- Build sonrasında `npm run test:e2e` çalıştır. Playwright `out/` sunan statik
  HTTP sunucusunu açar; masaüstü/mobil/tablet projeleri bulunur.
- Yeni şube export davranışı için `node scripts/test-branch-export.mjs` izole fixture
  build'i kullanılabilir. Sentetik kaydı gerçek içeriğe veya çıktıya ekleme.
- Next typegen/typecheck ve build aynı çalışma dizininde eşzamanlı çalıştırılmaz.
- Mobil ve tablet görünümünü özellikle 320, 393 ve 768 px genişliklerde kontrol et.
- Yeni davranışlar için anlamlı testler yaz. CSS sınıflarını veya basit uygulama
  ayrıntılarını tekrar eden testler ekleme.
- Çalıştırılmayan kontrolü başarılı raporlama. Ortam engelini somut olarak açıkla.
- Mimari veya komutlar değişirse ilgili dokümantasyonu güncelle.
- Kullanıcıya sonuçları ve yerel açılış adımlarını Türkçe açıkla.

## V5 CMS ve yayın güven sınırları

- Ali Bey'e Content Editor hedefi için Pages CMS e-posta collaborator modeli
  değerlendirilir; GitHub write rolü, ayrıntılı yerleşik RBAC veya branch lock varsayma.
- .pages.yml yalnız gerçekten tüketilen JSON kaynağı hazır olunca etkinleştirilir;
  mevcut TS dosyalarını raw/code editor olarak sunma. Sekiz hedef giriş CMS_SETUP'tadır.
- CMS destekleri resmî dokümanla doğrulanmalı; maxSize, draft motoru veya branch
  allowlist gibi doğrulanmamış seçenekler uydurulmaz. UI readonly/hidden yetki değildir.
- main production; content-edit doğrudan yayımlanmaz. main required checks ve PR ile
  korunur. İncelenmemiş branch script/paket/workflow'unu sır taşıyan job'da çalıştırma.
- Güvenilir main koduyla yalnız izinli veriden candidate; şema/medya/build/test
  geçmeden aktarım yok. Exact candidate SHA, drift/race/conflict, token ve bypass
  kontrolü kurulup dış entegrasyonda kanıtlanmadan tam otomasyon tamamlandı denmez.
- src/lib/content-change-policy.ts bu tur yalnız yerel manifest prototipidir;
  dosya içeriği/medya decode/atomik merge doğrulaması veya aktif CI güvenliği sayılmaz.
- İçerik silme/rename otomatik aktarımda kapalı; draft ile yayından kaldırma tercih edilir.
- Kaynak rollback ile deployment rollback ayrıdır; yanlış kaynağı da düzelt.
- Yerel simülasyon ve gerçek GitHub/CMS/Cloudflare testi raporda ayrılır.
- Her görev sonunda PASS/WARNING/FAIL; dosyalar, neden, testler, Git/deploy durumu,
  sıradaki küçük iş ve ürün sahibinin manuel kabul adımları Türkçe raporlanır.

## Gerçek CMS kabul ölçütü

Ali Abi panelden ürün adı, fotoğraf veya ana sayfa metni değiştirir; otomatik trusted
kontroller ve korunan aktarım geçer; Cloudflare'da yeni içerik/source SHA kanıtlanır.
Kullanıcı kod/piksel metadata yazmaz. Bu gerçek üç akış geçmeden CMS tamamlandı denmez;
yerel altyapı veya simülasyon yeterli değildir. Bu faz harici kurulum/yayın yetkisi vermez.

## C5 CMS prototipi sınırı

- .pages.yml artık yerel prototiptir; 12 Türkçe form sunar. src/cms trusted adaptörü
  raw CMS verisini ayrı canonical candidate'a dönüştürür. Aynı dosya yolları kullanılır;
  ikinci düzenlenebilir veri listesi yoktur. Native editorKey UUID/dosya şablonundan
  ID/slug ve decode'dan piksel metadata üret; Ali Bey'den bunları yazmasını isteme.
- Normal npm build canonical main verisini strict okur; raw CMS içeriğine fallback
  ekleme. cms:prepare teknik CI aracıdır, Ali Bey için manuel komut akışı değildir.
- Source/baseline üstüne yazma; output ayrı/boş olmalı. JSON/medya silme/rename,
  korunan koordinat/kimlik ve verified yükseltmesi reddedilir. Onaylı iletişim değeri
  değişince onayı düşür. Bu yerel gate aktif GitHub branch koruması veya atomik merge değildir.
- Raw kaynak EXIF'i Git'e zaten gidebilir; candidate ve out temizliği pre-upload
  mahremiyet garantisi değildir. Source dosyalarını yerinde dönüştürme. Public/private
  ve EXIF kararı gerçek upload/App bağlantısından önce kesinleşmelidir.
- .pages yapılandırmasını npm run cms:config:check ile pinlenmiş resmî şemaya karşı
  doğrula. Upstream txt fixture'ları MIT lisanslı hash'li araştırma/test kaynaklarıdır;
  uygulama/client'a veya editör içerik alanına taşınmaz. .gitattributes yalnız bu raw
  txt dosyalarının orijinal byte/whitespace biçimini korur. TypeScript strict gevşemez.
- node scripts/test-cms-roundtrip.mjs kaynak tabanlı yerel testtir. Hosted login,
  reference picker API, upload, davet, GitHub aktarımı ve Cloudflare kabulü sayılmaz.
  Gerçek senaryolar CMS_ACCEPTANCE.md içinde PENDING; harici izin verilmeden çalıştırma.
- Tüm geçmiş testleri koru. docs/CMS_ADAPTER.md teknik katmanı, CMS_ACCEPTANCE.md
  kullanıcı işlemleri/gerçek kanıt zincirini tutar. Sonraki harici faza kendiliğinden geçme.
