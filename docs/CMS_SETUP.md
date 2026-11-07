# Pages CMS — V5 ön inceleme ve aşamalı kurulum planı

30 Ekim 2026 araştırması; 1 Kasım 2026 yerel tamamlama. **Kurulu CMS veya gerçek editör testi değildir.** Bu belge master
prompt V5'in araştırma kaydını korur. 7 Kasım C5 güncellemesi: tüm JSON kaynakları için
.pages.yml yerel prototipi, trusted metadata adaptörü ve kaynak tabanlı round-trip hazır.
Gerçek hesap/CI/workflow/yayın yoktur. Güncel [CMS_ADAPTER](CMS_ADAPTER.md) ve
[gerçek kabul planı](CMS_ACCEPTANCE.md) önceki fazların plan satırlarından önceliklidir.

## Faz 4.2-a — Güncel bağlantı hazırlığı (7 Kasım 2026)

C5 checkpoint **8d0046d** kabul edildi. Hedef repo anonim API ve ls-remote ile
yeniden doğrulandı: Public, refs/branches/rulesets boş; remote eklenmedi. Gerçek
hesap planı/kurulum yetkileri bilinmiyor. Onboarding, Public/Private/plan maliyeti,
hosted App izinleri ve açık kullanıcı adımları **[GITHUB_READINESS](GITHUB_READINESS.md)**
içinde; testli yerel Git araçları ve ilerideki CI sözleşmesi
**[AUTOMATION_DESIGN](AUTOMATION_DESIGN.md)** içindedir. Bu güncel kayıt aşağıdaki
tarihsel hazırlık önerilerinden önceliklidir; aktif CMS/Actions/Cloudflare yoktur.

## Mevcut durum

- Faz 3 anchor: `78df0f7`, önceki baseline `b844bad`. Önceki çalışma ağacı korundu;
  4.1-c2 sonunda kabul edilen veri mimarisi için yerel commit yetkisi verildi.
  Commit kaydı plan.md §17 içindedir. Remote/push oluşturulmadı.
- GitHub API: `sametbuluto/balkuruyemis`, **public**, size 0. Anonim `ls-remote`
  başarılı ve refs boş: kontrol anında yayımlanmış dal/etiket yok. Kullanıcının
  Private tercihi ayrıca soruldu; yanıt gelene kadar tercih kesinleşmiş sayılmaz.
- package/lockfile exact sürümleri eşleşiyor: Next 16.4.3, React 19.3.1,
  TS 6.0.3 strict, Tailwind 4.3.3; c3 için mevcut Sharp 0.35.5 doğrudan exact bağımlılık oldu.
- Kategoriler content/categories altında altı JSON dosyasında; ürünler content/products
  altında boş JSON koleksiyonu. Dört fiziksel şube content/branches JSON kaynağında; galeri content/gallery, metinler content/pages ve content/settings JSON kaynaklarında. Dört koordinat var;
  gerçek ürün/galeri/logo/sosyal hesap ve duyuru yok. İşlevsel UI metinleri kodda kalır.
- Kategori/ürün/şube için strict JSON parse/schema, referans, kimlik onayı ve dosya denetimi uygulandı. Diğer
  içeriklerde mevcut tipli iş kuralları geçerli; medya decode c3 ile çalışır, aktif CI silme farkı henüz yok.

## Resmî destek ve sınırlar

Araştırma resmî güncel dokümanlar ve kaynak commit'i
`6f4e860a35d934406580287e7042e5e111e207a1` üzerinden yapıldı. Hosted uygulamanın
tam sürümü/yetkileri hesabına bağlanmadan doğrulanamadı.

| Konu                     | Doğrulanan davranış                                                                 | Projeye etkisi                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Yapılandırma             | Kök .pages.yml; repo/dal bağlamında okunur                                          | TypeScript'i ham editöre açmak yerine JSON alan şeması gerekir                                             |
| Koleksiyon               | collection çok dosya; file tek dosya; JSON destekli                                 | Yeni kategori için dosya ekleme, ürün için kategori reference alanı planlanır                              |
| Dal seçimi               | Kaynak UI dal seçimi/oluşturma sunuyor; schema'da editöre özel branch allowlist yok | CMS ekranındaki seçim güvenlik kontrolü değildir; main GitHub katmanında korunmalı                         |
| Davetli editör           | E-posta collaborator; içerik/medya düzenler, .pages.yml ve davet yönetmez           | Content Editor hedefi buna eşlenebilir; ayrı ayrıntılı RBAC rolü varmış gibi davranılmaz                   |
| Alanlar                  | required, string/text pattern, readonly, hidden                                     | Kimlik/yetki doğrulaması bu UI işaretlerine bırakılmaz                                                     |
| İşlemler                 | operations create/rename/delete; collection varsayılanları açıktır                  | rename/delete açıkça false; yayından kaldırma draft ile                                                    |
| Ürün kategorisi          | reference başka koleksiyona bağlanır; select sabit seçeneklidir                     | Koleksiyon ID'si saklanacak, kategori listesi YAML'e ikinci kaynak olarak kopyalanmayacak                  |
| Medya                    | image alanı dosya yolu; media input/output ve extensions                            | Alt ve türetilmiş boyutlar ayrıca modellenmeli; uploader optimizasyon servisi değildir                     |
| Taslak/yayın             | Kaydet Git'e yazar; bağımsız staging/approval motoru belgelenmemiş                  | status draft/published uygulamanın veri kuralıdır; Kaydet = canlıya çıktı değildir                         |
| Dosya boyutu/piksel/EXIF | İncelenen medya şemasında bu güvenceyi veren seçenek yok                            | Hayalî maxSize vb. eklenmez; byte/decode/metadata kontrolü pipeline'da yapılmalı                           |
| Yönetilmeyen alanlar     | settings.content.merge mevcut anahtarları koruyabilir                               | Kayıp alanı önler ama yetki sağlamaz; şema dışı anahtarlar güvenilir loader'da reddedilecek                |
| Yayın düğmesi            | actions, workflow_dispatch ve ref destekler                                         | Gerekirse main ref'ine bağlı “Yayına gönder” güvenli alternatif olabilir; otomatik save hook'u varsayılmaz |

Kaynaklar: [configuration](https://pagescms.org/docs/configuration/),
[content](https://pagescms.org/docs/configuration/content/),
[editors](https://pagescms.org/docs/configuration/content/editors/),
[collaborators](https://pagescms.org/docs/configuration/collaborators/),
[operations](https://pagescms.org/docs/configuration/content/operations/),
[fields](https://pagescms.org/docs/configuration/content/fields/),
[reference](https://pagescms.org/docs/configuration/fields/reference/),
[select](https://pagescms.org/docs/configuration/fields/select/),
[media](https://pagescms.org/docs/configuration/media/),
[image](https://pagescms.org/docs/configuration/fields/image/),
[settings](https://pagescms.org/docs/configuration/settings/),
[actions](https://pagescms.org/docs/configuration/actions/).
Dal UI: [sabit kaynak](https://github.com/hunvreus/pagescms/blob/6f4e860a35d934406580287e7042e5e111e207a1/components/repo/repo-branches.tsx).
Şema: [sabit kaynak](https://github.com/hunvreus/pagescms/blob/6f4e860a35d934406580287e7042e5e111e207a1/lib/config-schema.ts).

## Tek kaynaklı içerik — c4 dahil uygulanan kaynaklar

| CMS adı / Türkçe etiket           | Tek kaynak                    | Alan sözleşmesi                                                              |
| --------------------------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| Products / Ürünler                | content/products/id.json      | id, slug, kategori ID, ad, açıklama, medya, sıra, status                     |
| Categories / Kategoriler          | content/categories/id.json    | Mevcut ProductCategory; gerçek id/slug korunur                               |
| Branches / Şubeler                | content/branches/id.json      | Aynı fiziksel kayıt; koordinat, nullable iletişim, medya, status             |
| Gallery / Galeri                  | content/gallery/id.json       | Görsel yolu, zorunlu alt, sıra, status                                       |
| Announcements / Duyurular         | content/announcements/id.json | Düz metin, tarih, status; şu an kayıt/rota yok                               |
| Home Content / Ana Sayfa          | content/pages/home.json       | Başlık parçaları, alt metin ve tanıtım metinleri                             |
| Site Settings / Site Bilgileri    | content/settings/site.json    | Marka, iletişim, footer; diğer sayfalar content/pages; logo/teknik SEO kodda |
| Social Links / Sosyal Bağlantılar | content/settings/social.json  | Doğrulanmış URL veya null; teknik ayar yok                                   |

Tablodaki yollar artık uygulamanın gerçek kaynaklarıdır; duyuru koleksiyonu boştur.
Diğer dört kurumsal sayfa content/pages/{about,contact,catalog,branches}.json altındadır.
Sekiz üst CMS girişi ilk hedeftir; site ayarları/sayfalar gruplaması ileride gerçek
CMS round-trip ile doğrulanacak. C5 ile 12 formu sunan yerel .pages.yml oluşturuldu;
hosted editor ile henüz bağlanmadı.
TS modülleri yalnız tipli erişim sunar; ikinci kategori/ürün literal listesi yoktur.
Ürün koleksiyonu gerçek kayıt beklediği için yalnız .gitkeep içerir. categoryId
strict yüklenmiş kategori JSON kayıtlarına referans verir; draft ürün veya draft
kategoriye bağlı ürün ziyaretçiye serialize edilmez. Medya decode c3 ile yerelde çalışır; CMS upload henüz kurulmadı.
Strict server/build loader ve client'a props aktarımı pilotta yeterli olduğundan
üretilmiş manifest eklenmedi. JSON dışı içerik tipleri tek tek taşınacak; bu tur
Client tarafına fs veya yeni API taşınmadı. Unknown alan/tip/ID/slug/dosya adı
kuralları, bozuk JSON reddi ve published filtreleme kategori ve ürün testlerinde doğrulanır.
MDX/JS/raw HTML çalıştırılmaz. Teknik sınırlar CONTENT_GUIDE ve mimari belgededir.

Mevcut MediaAsset boyut/alt sözleşmesi korunur. CMS'nin yazdığı image yolu, zorunlu
alt ile birlikte, güvenilir decode aşamasında gerçek width/height ve varyantlara
normalize edilir. Ali Bey'den piksel ölçüsü girmesi istenmez. Boş opsiyonel metinler
null'a normalize edilir; yarım koordinat ve kısmi medya nesnesi hata verir.

Başlık/CTA metinleri sınırlı düz alanlardır; tasarım sınıfı, stil, rastgele link
ve env ayarı açılmaz. React escaping korunur. Duyurular c4 ile strict JSON,
build-time status/tarih filtresi ve isteğe bağlı ana sayfa bölümü kullanır.
Gerçek kayıt yoktur; yeni rota üretilmez. [Metin sözleşmesi](EDITORIAL_GUIDE.md).

## Küçük işler ve kabul kriterleri

| İş                                 | Durum                                    | Kabul kriteri                                                                                                              |
| ---------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 4.1-a V5 audit + sınır politikası  | Bu tur yerelde yapıldı                   | Başlangıç arşivi; resmî uyum matrisi; izinli/izinsiz yolların negatif testleri                                             |
| 4.1-b Kategori JSON pilotu         | Yerel pilot tamamlandı                   | Altı kayıt/id/slug/sıra birebir korunur; strict parser; statik/client kullanımı; bozuk JSON reddi; aynı UI ve kategori E2E |
| 4.1-c1 Ürün JSON                   | Yerel uygulama                           | Boş koleksiyon; strict schema; kategori referansı; draft dışlama; negatif build ve statik E2E                              |
| 4.1-c2 Şube JSON                   | Yerel uygulama                           | Dört konum/14 alan eşit; strict schema/Maps; korunan kimlik hash onayı; export/404/draft testleri                          |
| 4.1-c3 Galeri / medya              | Yerel altyapı tamamlandı                 | Strict JSON, decode, temiz statik çıktı; CMS upload hesabı yok                                                             |
| 4.1-c4 Metinler ve duyurular       | Yerel altyapı tamamlandı                 | Beş sayfa, site/sosyal JSON; strict şema, statik tarih ve kaçış testleri                                                   |
| 4.1-c5 CMS alan/medya adaptörü     | Yerel uygulama tamamlandı                | Otomatik metadata/ID, native kaynak tabanlı wire, ayrı canonical candidate; gerçek upload yok                              |
| 4.2-a Yerel .pages.yml prototipi   | Bu görevde ayrıca yetkilendirildi, hazır | 12 Türkçe form; resmî pinned şema ve yerel round-trip. Gerçek editör kabulü PENDING                                        |
| 4.2-b Gerçek CMS bağlantısı        | Kullanıcı yetkisi bekler                 | Yalnız hedef repo App kurulumu; main kaydı reddi; editörün kod/ayar erişemediği negatif test                               |
| 4.3-a Güvenilir candidate CI       | Bekliyor                                 | main kodu + yalnız veri; path/şema/medya/build/test; source/target SHA kaydı                                               |
| 4.3-b Korunan otomatik aktarım     | Kullanıcı yetkisi + entegrasyon testleri | Required checks + bot PR; race/conflict/failure ana dalı güncellemez; bypass yok                                           |
| 4.4 Pages önizleme                 | Ayrı deployment onayı                    | main üretim dalı; content-edit preview kapalı; noindex; HTTP/404/PNG ve geçmiş yayın kanıtı                                |
| 4.5 Ali Bey gerçek kullanıcı testi | Davet için ayrı onay                     | Sekiz içerik/medya akışı ve destek prosedürü; yayın ve rollback kanıtı                                                     |

4.1-b kategorileri, 4.1-c1 ürünleri, 4.1-c2 şubeleri, 4.1-c3 galeriyi taşıdı.
Site metinleri c4 ile taşındı; C5 candidate adaptörü ve yerel .pages.yml hazırdır. Şube kimlik onayı korunan ID/hash kaydı
üzerinden uygulanır; henüz hiçbir gerçek şube kimliği onaylanmadı. .pages.yml kullanıcı
talebiyle C5 sonunda yerel prototip oldu; CMS hesabı/App/workflow/uzak yazma/deployment yoktur.
4.2 tamamlandı sayılmaz. Önceki uyum matrisi 30 Ekim araştırma kaydıdır.

## Migration riskleri

| Risk                                           | Önlem / yapılacak test                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Yeni dosya yüklenmez veya client'a fs taşınır  | Statik loader/manifest ve dev/typecheck/build/E2E aynı pilotta doğrulanır                                             |
| ID/slug/null kaybı                             | Eski/yeni normalize çıktı karşılaştırması; stable ID ve category reference testi                                      |
| Draft kayıt sızması                            | Her tip için status filtresi; gerçek HTTP ve sitemap negatif testleri                                                 |
| Editör konumu verified yapar                   | Kimlik onayı teknik/korunan kaynakta; UI gizleme yetki sayılmaz; kayıt yetkili doğrulanmadan schema/detail yok        |
| Alan silinmesi/başlık tasarımı bozulur         | Round-trip, uzunluk sınırları, sabit görsel şablonu ve responsive test                                                |
| CMS kaydettiği ham medya Git geçmişini büyütür | Küçük dosya teslim politikası, gerçek byte/pixel denetimi; build reddi daha önce commit edilmiş blob'u Git'ten silmez |
| Sonuç yeşil ama test edilen kod güvenilmez     | [SECURITY](SECURITY.md) candidate tasarımı; content-edit üzerinde npm çalıştırıp bu sonucu güvenmek yok               |

Gerçek hosted CMS kaydetme/davet/dal/yeniden giriş davranışları, App izinleri ve
Cloudflare yayın geçmişi hesap bağlantısı olmadığı için doğrulanamadı. Yerel test
bu harici entegrasyonların yerine geçmez.

## 4.1-c3 güncellemesi ve kalan entegrasyon

Galeri, usages/status/sortOrder alanlarıyla tek JSON kaynağı oldu; embedded medya
kendi ebeveyninde kalır. Resmî image + object-list alan eşlemesi ve güvenli dosya/
build akışı [MEDIA_GUIDE](MEDIA_GUIDE.md) içinde. Eski matristeki “decode yok” ve
hedef satırları araştırma tarihini gösterir; decode/EXIF'siz çıktı artık yerelde çalışır.
Otomatik boyut yazan upload adaptörü, .pages.yml, gerçek hesap/round-trip/CI/Pages yoktur.
4.1-c4/site metni geçişi yerelde tamamlandı; CMS bağlantısı hâlâ ayrıca talimat gerektirir.

Ürün sahibi kabulü: Ali Abi gerçek panelde ürün adını, fotoğrafı veya ana sayfa metnini
düzenler; otomatik kontroller ve korunan aktarım geçer; Cloudflare'da yeni içerik ve
source SHA görülür. Üç akış ve hatalı dosyanın eski yayını koruması gerçek hesaplarda
kanıtlanmadan CMS tamamlandı denmez. Yerel fixture sonucu bu kabulün yerine geçmez.

## C5 güncel uyumluluk — 7 Kasım 2026

Yukarıdaki C3/C4 sınırlamaları kendi fazlarının tarihsel kaydıdır. Bugün yerel
.pages.yml resmî 6f4e860 şemasıyla doğrulanır; otomatik ID/ölçü, boş/null dönüşümü
ve EXIF'siz canonical candidate adaptörü çalışır. Uygulama strict loader'ı raw CMS
kaydını doğrudan kabul etmez. Teknik ayrıntı ve pre-Git EXIF sınırı CMS_ADAPTER'dadır.
Hosted sürüm/izinler, gerçek form/reference/upload, GitHub protected otomasyon ve
Cloudflare kanıtı CMS_ACCEPTANCE planında PENDING. Bunlar kurulmuş sayılmaz.
