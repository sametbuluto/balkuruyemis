# Faz 4.1-c3 — Galeri ve medya sözleşmesi

1 Kasım 2026. Yerel medya altyapısıdır; CMS hesabı, upload ekranı, otomatik GitHub
aktarımı veya Cloudflare yayını kurulmadı. Gerçek galeri ve fotoğraf sayısı **0**.

## Tek kaynak ve sahiplik

| İçerik                        | Düzenlenebilir kaynak                | Medya sahipliği                                                 |
| ----------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| Ortak galeri / ana sayfa hero | content/gallery/<id>.json            | Her görsel tek kayıt; usages ile birden çok alanda kullanılır   |
| Ürün fotoğrafları             | content/products/<id>.json → images  | Ürün içinde object list; ikinci galeri kaydı gerekmez           |
| Kategori fotoğrafı            | content/categories/<id>.json → image | Nullable tek nesne                                              |
| Şube kapak / fotoğraflar      | content/branches/<id>.json → images  | Yayımlanmış/sıralanmış ilk görsel kapak; dizi detay galerisidir |
| Logo                          | src/content/site.ts → brandAssets    | Teknik kaynak; bu fazda site metinleri taşınmadı                |

Fiziksel dosyalar public/images/{brand,products,categories,branches,gallery}/ altında.
Dizinlerdeki .gitkeep fotoğraf değildir. Tek global medya registry'si veya ikinci
editör manifesti oluşturulmadı. .generated/ yalnız yeniden üretilebilir araç/QA raporudur;
Git'e ve statik siteye girmez. Aynı fiziksel dosya farklı bağlamlarda seçilebilir;
medya ID'leri tüm kayıt sahipleri arasında benzersiz olmalıdır.

Galeri zorunlu alanları: id, url, alt, width, height, sortOrder, status, usages.
Dosya adı <id>.json; id küçük ASCII/rakam/tire ve benzersizdir. usages benzersiz,
boş olmayan home-hero / brand-gallery / branches-gallery listesidir. Bir kayıt aynı
fotoğrafı hero ve galeride kullanabilir. Hero için önce home-hero, yoksa ilk
brand-gallery seçilir. Boş durumda mevcut tipografik/fotoğraf bekleme alanları kalır.

Galeri status yalnız draft/published, sıra sıfır veya daha büyük güvenli tam sayıdır.
Gömülü MediaAsset içinde status ve sortOrder isteğe bağlıdır; önceki sözleşmeyle
uyum için verilmezse published ve dizi sırası korunur. Draft görsel, ebeveyn ürün
veya şube published olsa bile ziyaretçiye serialize edilmez. Ebeveyn draft ise onun
fotoğrafları da üretim dosya çıktısına girmez. Kategori draft görseli null'a döner.

Her medya: zorunlu boş olmayan alt, pozitif width/height ve isteğe bağlı variants.
Varyant: yerel url, pozitif width ve image/webp veya image/avif. Gerçek en-boy oranı
1 piksel yuvarlama toleransıyla korunmalı. Alt metnin Türkçe, anlamlı ve doğru
fotoğrafa ait olduğunu insan doğrular; dil/anlamı otomatik tespit ettiğimiz iddia edilmez.

## Gerçek çalışan güvenlik kapıları

- Küçük ASCII güvenli dosya/dizin adları ve yalnız beş image alanı. HTTP/harici URL,
  query/hash, yüzde kodlama, backslash ve traversal reddedilir.
- Yalnız JPEG (.jpg/.jpeg), PNG, WebP, AVIF. Uzantı, binary imza, decoder MIME ve
  gerçek piksel decode birlikte doğrulanır; metadata header kontrolü tek başına yeterli sayılmaz.
- Sharp 0.35.5 zaten Next ile kurulu sürümdü; doğrudan exact bağımlılık oldu.
  metadata ile gerçek/orientation uygulanmış boyutlar okunur, stats ile sıkıştırılmış
  piksel verisi çözülür. Bozuk/truncated dosya, yanlış MIME ve animasyon/çoklu kare reddedilir.
- Kaynak ve çıktı dosyası en fazla 5 MiB, toplam 20 MiB; kaynakta en fazla 128 görsel.
  En uzun kenar 8000 px, toplam 24 milyon piksel. Bunlar uygulama politikasıdır;
  Pages CMS'nin native upload limitleri olarak sunulmaz.
- public/images altındaki **tüm** dosyalar denetlenir; orphan/draft bozuk dosya da
  build'i durdurur. Symlink dosya/dizin, normal olmayan dosya ve eksik referans reddedilir.
- JSON width/height dosyanın gerçek boyutuyla eşleşmeli. Responsive dosya formatı,
  genişliği ve oranı doğrulanır. Tüm ebeveynler ve taslaklar dahil mükerrer medya ID reddedilir.
- Root server layout async doğrular. Standart build ayrıca ön kontrol → Next export →
  medya temiz çıktı → export doğrulayıcı sırasını kullanır. API/runtime görüntü servisi yoktur.

SVG bu fazda **tamamen kapalıdır**, marka klasörü de istisna değildir. Script/event,
external resource, foreignObject ve XML riskleri için regex tabanlı bir SVG sanitizer
uydurulmadı. Gerçek vektör logo ileride teknik inceleme ve ayrı güvenilir dönüşüm
politikasıyla alınır; şu an raster logo veya mevcut tipografik fallback kullanılır.

## EXIF, optimizasyon ve yayın dosyası

Standart npm run build yalnız yayımlanmış referansların temizlenmiş kopyalarını
out/images içine yazar. Next public klasörünü ham kopyaladığı için üretilmiş
out/images yeniden oluşturulur; raw/draft/orphan dosyalar sitede kalmaz. Kaynak
public/images veya JSON dosyaları silinmez/değiştirilmez. Kaldırılan çıktılar yalnız
yeniden üretilebilir build dosyalarıdır.

Sharp auto-orientation, sRGB dönüşümü ve aynı raster formata yeniden encoding uygular;
çıktı EXIF/XMP/IPTC/ICC metadata'sını taşımaz. Bu bir upload sırasında temizleme hizmeti
değildir. Encoder sıkıştırması vardır; dosyanın her durumda küçüleceği vaat edilmez.
Otomatik resize, AVIF/WebP varyant üretimi veya kadraj seçimi **kurulmadı**. Önceden
hazırlanmış varyantlar StaticImage srcset/sizes ile çalışır. Galeri lazy, hero eager/high
priority davranışı korunur; StaticImage bileşeni yeniden yazılmadı.

Ön kontrol ve export arasında JSON veya görsel değişirse fingerprint farkı build'i
reddeder. Bu yerel drift kontrolü, ilerideki exact Git SHA/candidate CI güvenliğinin
ve korunan main dalının yerine geçmez. Yalnız başarılı standart build artefaktı
kullanılmalı; başarısız build'den kalan out/ yayımlanmamalıdır.

Önemli sınır: kaynak/Git içindeki orijinal dosyanın EXIF'i burada temizlenmez.
Özellikle public repo kullanılacaksa gerçek fotoğrafları Git'e yüklemeden önce
mahremiyet/EXIF kontrolü gerekir. CMS upload'u kaynağı Git'e yazabilir; build'deki
temizlik geçmiş blob'larını geriye dönük temizlemez. Hosting olmayan yerel dev
public/ kaynak dosyalarını sunar; temiz üretim önizlemesi için build + preview kullanılır.

## Pages CMS eşlemesi — henüz bağlanmadı

Güncel resmî media desteği input/output, extension/rename ayarları; image alanı dosya
seçme/yükleme; object list nested metadata saklama sunar. Planlanan input public/images,
output /images; url alt alanı image, images nesne listesi, alt metin/yayın/sıra ayrı
alanlardır. Ham multiple-image path dizisi, MediaAsset nesne dizisiymiş gibi kabul edilmez.
[Media](https://pagescms.org/docs/configuration/media/),
[Image](https://pagescms.org/docs/configuration/fields/image/),
[Object list](https://pagescms.org/docs/configuration/fields/object/).

Mevcut sözleşmede width/height zorunludur ve doğrulanır. Ali Bey'in piksel ölçüsü
girmeden çalışacağı gerçek editör için upload sonrası güvenilir metadata üretme/
normalizasyon adaptörü hâlâ gerekir. CMS'nin bu ölçüleri veya responsive varyantları
kendiliğinden yazdığını varsaymıyoruz. readonly/hidden alanlar güvenlik değildir.
Yeni resim farklı boyuttaysa eski metadata ile build durur; otomatik düzeltme yapıldığı
iddia edilmez. Bu adaptör ve gerçek editör round-trip testi sonraki entegrasyon işidir.
.pages.yml, CMS action/workflow, hesap, token veya upload ekranı bu fazda oluşturulmadı.

## Kontrol ve geri alma

```bash
npm run media:check
npm run check
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
node scripts/test-media-export.mjs
npm run preview
```

Node 20 doğrudan TypeScript çalıştırmadığı için run-media.mjs trusted TS CLI'yi
.generated/media-tools altında CommonJS olarak derler. tsconfig.media.json strict
ayarları miras alır; yalnız bu yardımcı derleme için eski Node resolution deprecation
uyarısı TS 6.0 seviyesinde bastırılır. Ana tsconfig/strict değiştirilmedi; TypeScript 7
öncesi yardımcı compiler çözümlemesi yeniden değerlendirilmelidir.

Yanlış fotoğraf için doğru Git commit'inden yalnız ilgili binary/JSON birlikte alınır;
reset/force yerine yeni düzeltme commit'i oluşturulur, bütün kontroller tekrar çalışır.
İzole temp repoda doğru → yanlış → Git show ile kurtarma → yeni commit akışı testlidir.
Gerçek hosted CMS/Cloudflare rollback testi değildir. [ROLLBACK](ROLLBACK.md).

## Gerçek CMS tamamlanma ölçütü

Ali Abi gerçek panelde ürün adı değiştirir, fotoğraf yükler/değiştirir veya ana sayfa
metnini düzenler. Kullanıcı kod yazmaz/piksel ölçmez. Kaydetme commit'i → güvenilir
otomatik kontroller → korunan kaynak aktarımı → Cloudflare başarılı deployment →
HTTP üzerinde yeni içerik ve eşleşen kaynak SHA kanıtı görülür. Bozuk medya yüklemesi
önceki yayını değiştirmemelidir. Fotoğraf geri alma ve yeniden yayın da denenir.

Bu üç akış gerçek hesaplarda uçtan uca geçmeden **CMS entegrasyonu tamamlandı denmez**.
Yerel 4.1-c3 testleri bu kabulün yerine geçmez. 4.1-c4 önerisi: site/ana sayfa düz
metin sözleşmesi ve upload metadata adaptörünü ayrı küçük işler olarak netleştirmek;
uygulamaya bu görevde geçilmedi.
