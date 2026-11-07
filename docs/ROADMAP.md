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

## Tarihsel Faz 3 önerisi — Veri ve admin · Yeni kararla kapsam dışı

PostgreSQL, migration/ORM seçimi, sunucu veri erişimi, güvenli giriş, yetki
modeli, ürün/kategori/şube/duyuru/içerik yönetimi ve dosya yükleme.
Bu eski öneri uygulanmadı; Faz 3 statik site kararıyla ilk sürümden çıkarıldı.

## Faz 3 — Static-first migration ve gerçek konumlar · Tamamlandı

- [x] Onaylı yerel Faz 2.1 geri dönüş commit'i `b844bad` ve tam kaynak arşivi.
- [x] Static export, runtime gerektirmeyen kategori seçimi ve statik HTTP önizleme.
- [x] Tek tipli içerik kaynağı; doğrulama, türetilmiş şube sayısı, AVIF/WebP desteği.
- [x] Dört gerçek koordinat; Google Haritalar ve API=1 yol tarifi; detay/schema ayrımı.
- [x] Boş static params kısıtına sahte slug üretmeden çözüm; izole gerçek-şube fixture build'i.
- [x] SEO noindex/preview koruması, gerçek PNG dosyaları ve Cloudflare Pages dokümantasyonu.
- [x] Son statik HTTP, tarayıcı, responsive ve kalite sonuçlarını kaydet.

Sonuç: 25/25 Vitest, 3/3 statik HTTP, 36/36 statik Playwright; typecheck/lint/
Prettier/export başarılı. 20 axe taramasında otomatik ihlal 0; eksik WebKit/Firefox
ve otomatik ölçülemeyen hero kontrastı kalite raporunda WARNING olarak kayıtlı.

Bu fazda GitHub, Cloudflare hesabı, domain, push ve deployment yoktur.

## V5 güncel yol haritası

V5 önceki “CMS kapsam dışı” kararını değiştirir. Tasarım ve static export korunur.
Ayrıntılı küçük işler/kabul kriterleri: [CMS_SETUP](CMS_SETUP.md).

| Faz                                   | Durum / küçük işler                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 4.1 GitHub ve güvenli içerik mimarisi | Audit/izin politikası, kategori/ürün/şube/galeri/metin/duyuru JSON ve medya kapısı hazır; CMS bekliyor; remote/push yok |
| 4.2 Pages CMS prototipi               | Gerçek JSON kaynağı sonrası .pages.yml, round-trip ve yetki testleri; App bağlantısı ayrıca onay                        |
| 4.3 Actions doğrulama/aktarımı        | Güvenilir candidate, required checks, bot PR ve race/conflict testleri; şu an yalnız tasarım                            |
| 4.4 Pages ücretsiz önizleme           | Ayrı deployment onayı; main/noindex, content-edit doğrudan yayın yok                                                    |
| 4.5 Ali Bey hesabı ve gerçek testler  | Davet/yetki için onay; editör, yayın ve kurtarma akışları                                                               |
| 5 Gerçek marka varlıkları             | Orijinal logo, ürün/mağaza fotoğrafları ve görsel sadeleştirme                                                          |
| 6 Kesin şube/sosyal bilgiler          | Konumları koruyarak ad/adres/telefon/saat eşleşmesi                                                                     |
| 7 Domain ve kurumsal yayın            | Onaylı domain/HTTPS/canonical/robots/sitemap/Search Console/yerel SEO                                                   |
| 8 Bakım ve kurtarma                   | İçerik ve deployment rollback, izleme ve destek prosedürü                                                               |

Önceki görsel Faz 4 önerisi [PHASE4_PLAN](PHASE4_PLAN.md) içinde tarihsel korunur.
Public/Private tercihi ve GitHub planı kesinleşmeden koruma gereksinimleri kaldırılmaz.
Gerçek içerikler eksik; ilk sürümde fiyat/sepet/ödeme/sipariş yok.

## Faz 4.1-c1 — Ürün JSON · Yerel uygulama

Boş ürün koleksiyonu, strict sekiz alanlı sözleşme, gerçek kategori JSON referansları,
published ürün/kategori birleşimi, server/build yükleme ve izole negatif build testleri.
Görseller yalnız veri sözleşmesidir; upload/CMS hesabı/.pages.yml yoktur. Kategori
filtreleri, tasarım ve dört koordinat korunur. Sonuçlar [QUALITY_REPORT](QUALITY_REPORT.md).
4.1-c2 bu görevde başlatılmaz; sonraki veri türü ayrıca yetkilendirilmelidir.

## Faz 4.1-c2 — Şube JSON · Yerel uygulama

Dört konum/14 alan aynı kaldı; strict server loader, Maps eşleşmesi, fiziksel kayıt
tekrarını reddetme, korunan kimlik hash onayı ve verified/published detay üretimi.
Header server/client sınırı ayrıldı; tasarım ve menü davranışı korundu. Kabul edilen
4.1-a/b/c1/c2 çalışmaları yerel Git'e kaydedilir. Harici işlem veya 4.1-c3 yoktur.

## Faz 4.1-c3 — Galeri ve medya · Yerel altyapı

Galeri JSON, embedded görsel yayın/sıra, Sharp decode ve EXIF'siz statik çıktı,
draft/orphan dosya dışlama, drift reddi ve izole Git fotoğraf kurtarma testi.
Gerçek medya 0; .pages.yml/hesap/CI/Cloudflare yok. c4 önerisi: site metinleri ve
upload metadata adaptörünü ayrı işler halinde netleştirmek; başlatılmadı.
CMS ancak Ali Abi'nin gerçek panel değişikliği otomatik kontrollerden geçip
Cloudflare'da yayımlandığında kabul edilecek; yerel altyapı bu hedefi tamamlamaz.

## Faz 4.1-c4 — Kurumsal metin ve duyuru JSON · Yerel altyapı

Beş sayfa ve site/sosyal ayarları tek JSON kaynağından gelir. Sınırlı düz metin/CTA,
güvenli URL ve nullable iletişim, boş duyuru koleksiyonu, statik yayın/tarih filtresi
ve gerçek çıktı kabul testleri hazır. Tasarım/rotalar, altı kategori ve dört koordinat
korundu. Gerçek CMS, otomatik aktarım ve Cloudflare yayını tamamlanmadı.

c5 önerisi: kullanıcıdan ayrıca kapsam alarak medya metadata adaptörünü, CMS Türkçe
alan eşlemesini ve round-trip testlerini ele almak. .pages.yml/hesap/CI/yayın bu tur
yoktur. Gerçek panel → otomatik kontroller → Cloudflare üç kabul akışı hâlâ beklenir.
