# Tarihsel görsel Faz 4 planı — V5 ile yeniden fazlandı

V5 önceliklidir: güncel Faz 4 CMS/GitHub/otomasyon hedefidir; bu belgedeki gerçek
logo/fotoğraf işleri Faz 5, kesin bilgiler Faz 6 olarak planlanır. Eski plan kayıt
olarak korunur. Güncel başlangıç ve kabul kriterleri [CMS_SETUP](CMS_SETUP.md) içindedir.

Tarih: **30 Ekim 2026**. Durum: **Yalnızca hazırlık planı; uygulama başlatılmadı.**
Ürün sahibi Faz 3 statik mimarisini ve dört konum entegrasyonunu kabul etti.
Geri dönüş noktası: `78df0f7e5505a396b3c7c64f8aaa7d69498cd747`.
Commit mesajı: `feat: complete static site migration and branch locations`.

Ana kayıt [plan.md §13](../plan.md); içerik sözleşmeleri ve dosya düzeni
[CONTENT_GUIDE](CONTENT_GUIDE.md) içindedir.

## 1. Bu turda tamamlananlar ve kapsam

- [x] Git durumu ve incelenmiş kaynak/belge listesi kontrol edildi.
- [x] Gerçek `.env` dosyaları, node_modules, out, .next, coverage ve test raporlarının
      Git kapsamına girmediği doğrulandı. `.env.example` boş/gizli olmayan ayar şablonudur.
- [x] Kaynaklarda ve staged içerikte bilinen anahtar/token desenleri tarandı;
      eşleşme bulunmadı. Bu tarama tüm olası sırları tespit etme garantisi değildir.
- [x] Faz 3, istenen mesajla yerelde commit edildi; 65 dosya değişikliği kaydedildi.
- [x] Logo, fotoğraf, kategori, şube kartı ve önizleme için bu hazırlık planı yazıldı.
- [ ] Faz 4 arayüz/içerik uygulaması — bu tur kapsamı değil.
- [ ] GitHub'a push veya Cloudflare'a yayın — bu tur kapsamı değil.

Statik export, merkezi Git içerik kaynakları, mevcut rotalar/testler, erişilebilir
mobil menü ve kırmızı/siyah/beyaz tasarım korunacak. DB, CMS, admin, auth, backend,
fiyat/sepet/ödeme eklenmeyecek. Üretilmiş mağaza/ürün fotoğrafı kullanılmayacak.

`docs/QUALITY_REPORT.md` bu turun başlangıcında boş bulundu; boş içeriği korundu.
Prettier kontrolü için yalnızca tek boş satırı kaldırıldı.
Faz 3 test geçmişi master plan §12.5 ve README'dedir. Hazırlık belgeleri commit'ten
sonra yazılmıştır; bu tur ikinci bir commit oluşturulmaz.

## 2. Uygulama sırası — henüz yapılacak işler

| Sıra | İş                                            | Ön koşul                                      | Teslim / kabul ölçütü                                                                                             |
| ---- | --------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 4.1  | Gerçek logo entegrasyonu                      | Orijinal logo ve koyu zemin varyantı          | Header/footer/hero/Hakkımızda oranları korunur; favicon, Apple ve OG gerçek markayla ayrıca güncellenir           |
| 4.2  | Fotoğraf hazırlığı                            | Gerçek dosyalar ve içerik/şube eşleşmeleri    | Yerel WebP/AVIF varyantları, doğru alt/boyut, belirlenmiş kadraj ve dosya bütçeleri                               |
| 4.3  | Kategorileri görselleştirme                   | Altı kategoriye ait onaylı fotoğraflar        | Mevcut kart oranları ve kategori URL/filtreleri korunur; gerçek görsel olmayan alan açık bekleme halinde kalır    |
| 4.4  | Şube kartlarını sadeleştirme                  | Aşağıdaki kart önerisinin değerlendirilmesi   | Daha az tekrar, mevcut dört koordinat ve iki harita eylemi korunur; boş iletişim linki ve yanlış şube kimliği yok |
| 4.5  | Yerel kabul ve regresyon                      | Onaylanan uygulamanın bitmesi                 | Statik build/HTTP/E2E, responsive ve erişilebilirlik kontrolleri; ürün sahibi tasarım değerlendirmesi             |
| 4.6  | GitHub/Pages önizleme hazırlığını sonlandırma | Yerel kabul ve aşağıdaki hesap/depo kararları | Ayarlar, yayınlanacak commit ve yayın kapsamı gözden geçirilir; push/deployment ayrıca açık talimat bekler        |

Logo ve kategori/mağaza görselleri farklı zamanlarda gelirse yalnızca sağlanan,
doğrulanmış varlıklarla çalışılabilir. Eksik içerikler uydurma verilerle tamamlanmaz.
Şube kartı önerisi teknik olarak fotoğraflardan bağımsız uygulanabilir; bu görevde
herhangi bir kart veya tasarım kodu değiştirilmemiştir.

## 3. Görsel entegrasyon kararları

### Logo

- Tercih: orijinal vektör master'dan hazırlanmış SVG; şeffaf PNG alternatif.
- Açık/koyu zemin sürümü ve kullanım oranları ürün sahibi tarafından doğrulanacak.
- Tek kaynak `src/content/site.ts` içindeki `brandAssets`; tüm BrandMark kullanımları
  aynı dosyalara bağlanacak. Gerçek dosya gelene kadar tipografik marka korunur.
- İkon/OG PNG çizimleri logo kaydından otomatik güncellenmez; ayrı build-time
  düzenleme ve PNG boyut/MIME testleri planlanır.
- Tabela referansı gerçek fotoğraftan alınacak; yeni logo veya tabela uydurulmayacak.

### Fotoğraflar ve kategoriler

- Dosyalar `public/images/{brand,categories,products,branches,gallery}/` altında;
  içerik referansları sadece `src/content/` üzerinden yönetilecek.
- Kaynak fotoğraf, kullanım izni, neyi/hangi şubeyi gösterdiği ve tercih edilen
  kadraj birlikte kaydedilecek. Fotoğraftan şube adı tahmini yapılmayacak.
- Kuruyemiş, Kahve, Lokum, Baharat, Aktar ve Kozmetik için birer temsil fotoğrafı
  önerilir. Bu altı fotoğraf önerisi içerik ihtiyacıdır; mevcut dosya varlığı değildir.
- Mevcut kart oranı, responsive düzen ve kırmızı/siyah/beyaz renkler korunacak.
- Fotoğraf varyantları önerisi: 480/768/1200 px; gerektiğinde hero 1600 px.
  Kaynak büyütülmeyecek. Kart için 60–120 KB, hero için 150–250 KB başlangıç hedefi;
  gerçek dosya kalitesi ve LCP ölçümüyle yeniden değerlendirilecek.
- StaticImage, AVIF/WebP source/sizes, boyut/alt, lazy ve hero önceliği kullanılacak;
  runtime optimizer veya harici resim servisi eklenmeyecek.

### Şube kartları — öneri, uygulanmadı

- Gerçek fotoğraf varsa mevcut sabit oranlı alan; yoksa daha küçük konum ikonu önerilir.
- Geçici ad Konum 1–4, tek kısa doğrulama durumu ve iki eylem: **Google Haritalar’da Aç**,
  **Yol Tarifi Al**. Eylemler mobilde en az 44 px etkileşim alanını koruyacak.
- Adres/telefon/saat bilinmiyorsa her biri için ayrı uzun bekleme satırları yerine
  tek kısa açıklama önerilir. Bilgi geldiğinde yalnızca gerçek alanlar gösterilecek.
- Koordinatlar aynen korunur; koordinatı olmayan gelecekteki kayıtta harita linki olmaz.
- Konum kaydı otomatik verified olmaz. Şube adı/adres kimliği doğrulanana kadar
  detay sayfası, sitemap şube girdisi veya LocalBusiness üretilmez.
- Mevcut testler silinmez; sadeleştirme uygulanınca bekleme metni beklentileri yeni
  sunuma uyarlanır, koordinat/bağlantı/kimlik ayrımı ve navigasyon regresyonları korunur.

## 4. İçerik kontrol listesi

Durumlar mevcut kaynak dosyalarına dayanır. Aşağıdaki eksikler henüz teslim alınmadı.

| İçerik                         | Durum              | Ürün sahibinden beklenen                                                     |
| ------------------------------ | ------------------ | ---------------------------------------------------------------------------- |
| Marka adı, slogan, renk yönü   | Hazır              | Bal Kuruyemiş / Lezzetin Doğal Adresi / kırmızı-siyah-beyaz korunacak        |
| Orijinal logo                  | Eksik              | SVG veya vektör master; varsa yüksek çözünürlüklü şeffaf PNG                 |
| Koyu zemine uygun logo         | Eksik              | Beyaz/ters renkli onaylı sürüm veya kullanım kararı                          |
| Gerçek tabela referansı        | Eksik              | Ön cephe/tabela fotoğrafı; GitHub ekran görüntüsü tabela referansı değildir  |
| Hero fotoğrafı                 | Eksik              | Geniş kadrajlı gerçek mağaza/ürün fotoğrafı ve ana görsel seçimi             |
| Altı kategori fotoğrafı        | Eksik              | Kuruyemiş, Kahve, Lokum, Baharat, Aktar, Kozmetik ile doğru eşleşme          |
| Ürün listesi ve fotoğrafları   | Eksik              | Gerçek ad, kategori, kısa açıklama, fotoğraf; fiyat istenmez                 |
| Şube fotoğrafları              | Eksik              | Hangi konuma ait olduğu belirtilmiş dış/iç fotoğraflar                       |
| Dört koordinat                 | Hazır              | Aşağıdaki konumlar değiştirilmeden korunacak                                 |
| Şube ad/adres eşleşmesi        | Eksik              | Konum 1–4 için işletme sahibinin açık doğrulaması                            |
| Telefon ve çalışma saatleri    | Eksik              | Her şube için doğrulanmış bilgi veya null bırakma kararı                     |
| Instagram/WhatsApp             | Eksik              | Resmî ve doğrulanmış adresler; gelene kadar aktif yönlendirme yok            |
| Fotoğraf/marka yayın uygunluğu | Eksik              | Paylaşılan dosyaların sitede ve seçilecek depoda kullanılabileceğinin teyidi |
| Cloudflare hesap/proje tercihi | Karar bekliyor     | Hesap erişimi ve proje adı; bu tur hesaba bağlanılmadı                       |
| GitHub depo doğrulaması        | Yerel bağlantı yok | Ekran görüntüsündeki deponun hedef olduğunun ve görünürlüğünün doğrulanması  |

Şube içerik teslim matrisi — **eşleştirme yapılmadı**:

| Kayıt   | Latitude  | Longitude | Gerçek ad / açık adres / telefon / saat / fotoğraf |
| ------- | --------- | --------- | -------------------------------------------------- |
| Konum 1 | 38.362633 | 27.148943 | Bekleniyor                                         |
| Konum 2 | 38.374462 | 27.183882 | Bekleniyor                                         |
| Konum 3 | 38.367344 | 27.148973 | Bekleniyor                                         |
| Konum 4 | 38.378593 | 27.163704 | Bekleniyor                                         |

Ahmet Yesevi/Gediz veya başka adlarla otomatik eşleştirme yoktur. Alan adı ücretsiz
Pages önizlemesi için ön koşul değildir; gerçek domain ve indeksleme ayrı yayın kararıdır.

Teslim sırasında her dosya için:

- [ ] Orijinal dosya ve kullanım uygunluğu biliniyor.
- [ ] Ürün/kategori/konum eşleşmesi ürün sahibi tarafından doğrulandı.
- [ ] Alt metin gerçek görüntüyü tarif ediyor; kişi/şube/ürün bilgisi uydurulmuyor.
- [ ] Dosya boyutu, varyant boyutları ve kadraj kontrol edildi.
- [ ] Kaynak kaydı güncellendi; görselin küçük/büyük ekranda önizlemesi onaylandı.

## 5. GitHub ve ücretsiz Cloudflare Pages önizleme planı

### Mevcut durum

Ekran görüntüsünde hedef aday depo `sametbuluto/balkuruyemis` ve Public olarak
görünüyor. Bu bilgi ekran görüntüsüne dayanır; çevrim içi depo içeriği/erişimi bu tur
doğrulanmadı. `git remote -v` boş; remote eklenmedi, push veya hesap bağlantısı yapılmadı.
Mevcut yerel Git geçmişi korunacak; GitHub quick setup komutlarıyla yeniden init veya
README üzerine yazma yapılmayacak. Gelecekte ilk push öncesi uzak geçmiş incelenecek;
varsa mevcut commit'ler korunacak, force push kullanılmayacak.

### Yalnızca planlanan ayarlar

| Alan                       | Planlanan değer                                                           |
| -------------------------- | ------------------------------------------------------------------------- |
| Hosting                    | Cloudflare Pages; statik dosyalar, Functions/Workers backend yok          |
| Framework preset           | Next.js (Static HTML Export)                                              |
| Root directory             | Proje kökü                                                                |
| Build command              | `npm run build`; doğrulayıcı ve `_headers` üretimi dahil                  |
| Output directory           | `out`                                                                     |
| Production branch          | `main`; mevcut SITE_PRODUCTION_BRANCH ile uyumlu                          |
| Önizleme dalı              | Öneri: `phase4-preview`; henüz oluşturulmadı                              |
| Node                       | Mevcut package engines ile uyumlu sürüm kurulumda doğrulanıp sabitlenecek |
| NEXT_PUBLIC_SITE_URL       | Önizleme için boş                                                         |
| NEXT_PUBLIC_ALLOW_INDEXING | `false`                                                                   |
| SITE_PRODUCTION_BRANCH     | `main`                                                                    |
| CF_PAGES_BRANCH            | Cloudflare'ın sağladığı değer; koda sabitlenmez                           |

Git entegrasyonu etkinleştirildiğinde push'lar build/yayın tetikleyebilir; branch
kontrolleri ilk bağlantıda incelenecek. Hesap bağlama, ilk push, Save and Deploy ve
önizleme URL'si üretme işlemleri bu görevde yapılmaz. Dışarıya önizleme yayınlamak da
deployment'tır; uygulama ve yayın için sonraki açık talimat beklenir.
[Cloudflare Git entegrasyonu](https://developers.cloudflare.com/pages/configuration/git-integration/).

Ücretsiz plan değerlendirmesi (30 Ekim 2026 resmî belgeleri): ayda 500 build,
aynı anda 1 build, Free için 20.000 dosya ve tek dosyada en fazla 25 MiB.
Bu proje statik kaldığında bu sınırlar önizleme hedefi için başlangıçta yeterli
görünüyor; gerçek medya sonrası ölçülüp yayın öncesi güncel kotalar kontrol edilecek.
Ücretli servis veya ek ürün açılması planlanmıyor.
[Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

Pages preview adresleri varsayılan olarak herkese açıktır; noindex erişim parolası
değildir. Özel inceleme gerekirse hesap seviyesinde Access seçeneği ayrıca
değerlendirilecek; uygulamaya kimlik doğrulama eklenmeyecek. Mevcut noindex meta,
robots ve `_headers` korumaları korunup gerçek hostta da test edilecek.
[Önizleme erişimi](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

Statik Next.js için preset ve `out` ayarları resmî rehberle uyumludur; proje kendi
çıktı doğrulamasını içerdiği için build komutu olarak `npm run build` kullanılacak.
[Next.js static export / Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## 6. Faz 4 kabul kontrol listesi — uygulama sonrasında çalıştırılacak

- [ ] Gerçek logo bütün yüzeylerde kırpılmadan ve doğru kontrastla görünüyor.
- [ ] Gerçek fotoğraflar doğru kategori/konumda, uygun boyut/alt ve yükleme önceliğinde.
- [ ] Şube kartları sade; dört koordinat ve iki Maps eylemi aynen korunuyor.
- [ ] Eksik iletişim/şube kimliği aktif sahte link veya SEO kaydı üretmiyor.
- [ ] Kategori doğrudan URL, geri/ileri, filtreler ve mobil menü çalışıyor.
- [ ] 320/393/768/1280 px düzen ve klavye/odak/reduced-motion kontrolü geçti.
- [ ] `npm run check` ve gerçek out/ üzerinde Playwright geçti; testler silinmedi.
- [ ] Statik 404, metadata, robots, sitemap, PNG dosyaları ve bütün iç linkler doğrulandı.
- [ ] Gerçek fotoğraflarla LCP/CLS ve otomatik/manuel erişilebilirlik yeniden incelendi.
- [ ] Firefox/WebKit ve fiziksel cihaz eksikleri mümkünse tamamlandı; yapılamayanlar açık raporlandı.
- [ ] Ürün sahibi içerik ve tasarım değerlendirmesini tamamladı.
- [ ] Push/önizleme yayını için commit, hedef depo/proje ve kapsam açıkça yetkilendirildi.

Bu listenin hazırlanması uygulamanın veya deployment'ın yapıldığı anlamına gelmez.
Faz 3 test geçmişi ayrı korunur; Faz 4 için henüz yeni görsel/tasarım testi sonucu yoktur.

## 7. Hazırlık turu doğrulama kaydı

Bu tur uygulama kaynakları değiştirilmedi. AGENTS teslim kuralı gereği mevcut
kontroller yeniden çalıştırıldı: typecheck/lint/Prettier, **25/25 Vitest**, static
export, **3/3 statik HTTP**, **36/36 Playwright** başarılı. Responsive regresyonlar
320/393/768/1280 px içerir. Bunlar mevcut Faz 3 sürümünün kontrolleridir; yukarıdaki
Faz 4 logo/fotoğraf/kart işlerinin tamamlandığı veya test edildiği anlamına gelmez.
Yeni axe/WebKit/Firefox testi yapılmadı; önceki tarayıcı eksikleri sürer.

Son çalışma ağacında yalnızca hazırlık belgeleri ve boş kalite raporunun biçim
normalizasyonu vardır. Push/deployment veya ikinci commit yapılmadı.
