# Bal Kuruyemiş geliştirme kuralları

Bu dosya proje kökünün ve tüm alt klasörlerin geliştirme kurallarını tanımlar.
Ürün sahibinin güncel talimatları bu belgeden önceliklidir.

## Kapsam ve kaynaklar

- Proje bir kurumsal tanıtım sitesidir. Sepet, ödeme veya sipariş ekleme.
- Aktif kapsam Faz 3: static-first migration ve işletme sahibinin sağladığı gerçek konumlar.
- İlk sürüm statik kurumsal sitedir; DB, özel backend, CMS ve admin kapsam dışıdır.
- Sonraki fazlara kendiliğinden geçme.
- Kırmızı/siyah/beyaz tasarımı, rotaları, etkileşimleri ve testlerin amaçlarını koru.
- Veritabanı, ORM, kimlik doğrulama, admin ve deployment başlatma.
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
- İçerikleri tek kaynak olarak `src/content/` altında tut. `src/config/site.ts` ve
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
