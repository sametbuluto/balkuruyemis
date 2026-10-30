# Yol haritası

Ayrıntılı faz geçmişi, teknik kararlar ve doğrulama kayıtları **[plan.md](../plan.md)** içindedir.
Bu belge kapsamın kısa özetidir. Sonraki fazlar ayrıca talimat gerektirir.

## Faz 1 — Proje altyapısı · Tamamlandı

Next.js App Router, TypeScript strict, Tailwind, ortak bileşenler, temel rotalar,
SEO temeli, test araçları, dokümantasyon ve yerel Git kuruldu.
5 component ve 10 E2E testi geçti; ayrıntılar master planda korunur.

## Faz 2 — Kurumsal tasarım · Tamamlandı

- [x] Sticky responsive navbar ve esnek logo bileşeni.
- [x] Hero, altı kategori, marka tanıtımı ve dört etiketli örnek şube kartı.
- [x] Galeri ve Instagram/WhatsApp alanları; doğrulanmamış link yok.
- [x] Kategori tabanlı katalog, URL ile seçim ve bilinmeyen kategori durumu.
- [x] Şubelerimiz, Hakkımızda ve İletişim sayfalarının tamamlanması.
- [x] Örnek/gerçek kayıt ayrımı ve WhatsApp dahil taşınabilir veri modelleri.
- [x] Apple PNG, favicon, paylaşım PNG'si ve smooth scroll işareti.
- [x] Next Image, lazy loading ve responsive sizes altyapısı.
- [x] TypeScript, lint, biçim, 13 component testi ve production build.
- [x] Son masaüstü/mobil/tablet E2E ve geliştirme modu scroll doğrulaması.
- [x] 320, 393, 768 ve 1280 px ekran görüntüsü değerlendirmesi.

Sonuç: 13 component testi, 18 production E2E testi ve 1 hedefli dev testi geçti.
Ayrıntılı komutlar, sorunlar ve çıktılar master planda.

Gerçek ürünler, logo, fotoğraflar ve şube/iletişim bilgileri henüz sağlanmadı.
Bu içerikler için açık bekleme durumları ve örnek etiketleri bulunur.

## Faz 2.1 — Marka kimliği revizyonu · Tamamlandı

- [x] Kırmızı/siyah/beyaz tokenlar; güçlü sans başlıklar, korunan tipografik marka.
- [x] Navbar konumunun kaldırılması; sticky ve erişilebilir menünün korunması.
- [x] Hero, kategori, şube, galeri ve sosyal kartların yeni kimliği.
- [x] Önceki kategori adı ve kontrast bulgularının giderilmesi.
- [x] 17 Vitest, 27 production E2E, 1 dev testi ve 20 axe taraması.
- [x] 320 / 393 / 768 / 1280 px kontrolü; rotalar/veriler/paketler ve mevcut testler korundu.

WebKit/Firefox kurulu değil; bu tarayıcı sonuçları eksik. Gerçek marka ve fotoğraf
varlıkları hâlâ bekleniyor. [Kalite raporu](QUALITY_REPORT.md).

## Faz 3 — Veri ve admin · Başlatılmadı

PostgreSQL, migration/ORM seçimi, sunucu veri erişimi, güvenli giriş, yetki
modeli, ürün/kategori/şube/duyuru/içerik yönetimi ve dosya yükleme.
Ayrı ürün sahibi talimatı gerekir.

## Faz 4 — İçerik ve yayına hazırlık · Başlatılmadı

Gerçek varlıklarla örneklerin değiştirilmesi, onaylanmış iletişim URL'leri,
alan adı ve hosting, performans, erişilebilirlik, SEO ve kullanıcı kabul testleri.
Deployment için ayrıca onay gerekir. Gerçek içerik daha erken gelirse mevcut fazda
ürün sahibinin yönlendirmesiyle kullanılabilir.

## Bekleyen kararlar

Gerçek şube bilgileri ve görseller; ürünler; sosyal hesaplar; arama, ek dil ve
iletişim formu; admin rolleri ve yayınlama akışı; depolama/DB/hosting/alan adı.
Fiyat, sepet, ödeme ve sipariş kapsam dışıdır.
