# Gerçek Pages CMS editör kabulü ve bağlantı kontrol listesi

7 Kasım 2026. **Hazırlanmış test planıdır; aşağıdaki gerçek hesap testleri çalıştırılmadı.**
Yerel kaynak tabanlı round-trip PASS, gerçek panel/CI/Cloudflare kabulü PENDING'dir.
Teknik sözleşme [CMS_ADAPTER](CMS_ADAPTER.md), güven sınırları [SECURITY](SECURITY.md).

## Faz 4.2-b — Son dış servis doğrulaması ve commit hazırlığı

Ürün sahibi webhook'ların boşluğunu, Railway/Vercel Apps'in kaldırıldığını ve
Cloudflare Workers & Pages ekranında No projects found olduğunu doğruladı.
Bu kullanıcı UI beyanıdır; yetkili API incelemesi değildir. Yeni anonim kontrol
hedef deponun hâlâ Public ve bütün ref'lerinin boş olduğunu doğruladı. Önceki
UNKNOWN/BLOCKED kayıtları tarihseldir. Son audit/temiz belge checkpoint'i başarılıysa
PUSH_READY=YES (teknik hazırlık), DEPLOYMENT_TRIGGER=NONE (kullanıcı doğrulaması),
REMOTE_MAIN=EMPTY; PUSH_AUTHORIZED=NO. Güncel plan [PUSH_PREFLIGHT](PUSH_PREFLIGHT.md)
içinde. Gerçek push, dry-run/auth denemesi, remote ve dış kurulum yapılmaz.

## Faz 4.2-b — Kesin Public / Free kararı ve push kapısı

7 Kasım 2026: ürün sahibi **Public repository + GitHub Free** kararını kesinleştirdi;
ücretli plan/transfer yapılmayacak. Başlangıç main/aa1ea3e temiz, remote yok; 8 commit
aynı. Uzak ref/branch/ruleset/workflow/deployment listeleri boş. Webhook/App GET'leri
401; Cloudflare yetkili oturumu yok. **PUSH_READY=BLOCKED, DEPLOYMENT_TRIGGER=UNKNOWN,
REMOTE_MAIN=EMPTY.** Anonim boş deployment listesi tetikleyici yokluğu değildir.

Güncel kullanıcı UI adımları, onay sonrası komut planı ve Free bootstrap sırası
[PUSH_PREFLIGHT](PUSH_PREFLIGHT.md) içinde; bu kayıt eski tercih-bekleniyor
ifadelerinden önceliklidir. Push/dry-run/remote veya harici ayar işlemi yapılmadı.

## Faz 4.2-a — Güncel bağlantı hazırlığı (7 Kasım 2026)

C5 checkpoint **8d0046d** kabul edildi. Hedef repo anonim API ve ls-remote ile
yeniden doğrulandı: Public, refs/branches/rulesets boş; remote eklenmedi. Gerçek
hesap planı/kurulum yetkileri bilinmiyor. Onboarding, Public/Private/plan maliyeti,
hosted App izinleri ve açık kullanıcı adımları **[GITHUB_READINESS](GITHUB_READINESS.md)**
içinde; testli yerel Git araçları ve ilerideki CI sözleşmesi
**[AUTOMATION_DESIGN](AUTOMATION_DESIGN.md)** içindedir. Bu güncel kayıt aşağıdaki
tarihsel hazırlık önerilerinden önceliklidir; aktif CMS/Actions/Cloudflare yoktur.

## Önce ürün sahibinden gerekenler

- Hedef GitHub repo/ad/görünürlük kararı. Önceki Public durumu güncel tercih değildir.
- Source fotoğraf EXIF kararı: hosted upload raw byte'ları Git'e yazabilir. Tam
  pre-Git temizlik şartsa mevcut hosted-only akışla bağlantıya geçilmez; uygun
  mimari ayrıca seçilir. Private seçmek pre-upload temizlik değildir.
- Ali Bey'in davet edilecek e-posta adresi. Şifre/token sohbet veya JSON'a yazılmaz.
- Kabul için onaylı gerçek ürün adı/açıklama/kategori ve en az iki gerçek, yayın
  hakkı uygun fotoğraf. Mevcut gerçek ürün/fotoğraf 0; uydurma ürün yayımlanmaz.
- İlk push, App/hesap bağlantısı, GitHub koruma ayarları, davet ve Cloudflare
  önizleme deployment için ayrı açık yetki. Bu belge bu işlemleri başlatmaz.

## Bağlantı sırası — henüz uygulanmadı

| Sıra | Kullanıcı / teknik sorumlu işlemi                                                                   | Geçiş koşulu                                                                                                               |
| ---- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1    | Repo/görünürlük/EXIF kararını verin; yerel commit'i inceleyin                                       | Açık push yetkisi; gerçek plan/koruma desteği ve önceden bağlı yayın tetikleyicisi yok; secret/test çıktısı yok            |
| 2    | Teknik sorumlu uzak geçmişi read-only tekrar kontrol edip yetkili ilk push'u yapar                  | Mevcut uzak geçmiş korunur, force push yok                                                                                 |
| 3    | Güvenilir main'de candidate CI ve PR/required checks kurulur; content-edit hazırlanır               | CMS'nin main'e doğrudan yazması gerçekten reddedilir; App/admin bypass kapalı                                              |
| 4    | GitHub hesabınızla hosted Pages CMS'ye girip GitHub App kurulumunu yalnız hedef repo için onaylayın | Gerçek istenen izinler görülür; least-privilege ve main kapısı doğrulanır                                                  |
| 5    | Repo ve content-edit dalını açın; committed .pages.yml kullanılsın                                  | Kullanıcı config'i yeniden yazmaz; 12 Türkçe form düzgün açılır; save/raw-normalize/build round-trip gerçek Git'te denenir |
| 6    | Pages CMS içinden Ali Bey'i e-postayla davet edin                                                   | GitHub write rolü verilmez; editor teknik ayar/.pages.yml/onay kaynağına erişemez                                          |
| 7    | Ayrı deployment onayıyla Cloudflare hesabında repo/Pages bağlantısı kurun                           | Yalnız main, build npm run build, output out, preview noindex; content-edit yayını kapalı                                  |
| 8    | Aşağıdaki kabul testlerini Ali Bey'in kendi oturumuyla yapın                                        | Teknik kullanıcı tokenı/ayarları editöre verilmez; source/candidate/main/deployment SHA eşleşir                            |

GitHub oturum açma/App ekranlarını hesap sahibi kendi tarayıcısında tamamlar.
Cloudflare yetkilendirmesi ve Ali Bey'in e-posta davetini kabul etmesi de kullanıcı
adımlarıdır. Teknik sorumlu CI/korumaları kurup doğrular; Ali Bey'den Git/JSON/terminal
veya piksel ölçüsü istenmez. Böyle bir gereksinim çıkarsa test FAIL olur.

Repo Private ise seçilen hesap planında gerekli korumaların gerçekten çalıştığı
kontrol edilir; koruma yok diye kapılar kaldırılmaz. Source/senkronizasyon çatışması
veya koruma başarısızlığında otomatik aktarım açılmaz. Manuel teknik PR alternatifi
kullanılırsa tam otomatik kabul sağlanmış sayılmaz.

## Her testte kaydedilecek kanıt

Test ID, editör rolü, tarih/saat ve saat dilimi, repo/dal; önce/sonra ekran görüntüsü;
CMS save source SHA; trusted main baseline SHA; normalleştirilmiş candidate SHA ve
input fingerprint; tüm required check URL/sonucu; bot PR/merge main SHA; Cloudflare
deployment ID/commit/başarısı; cache/hard-refresh sonrası gerçek HTTP içerik/medya.
Source ile candidate byte'ları metadata üretimi nedeniyle farklı olabilir; eşleşme
kanıtı source → normalizasyon raporu → tested candidate → merged main → deployment
zinciridir. Yerel dosya fingerprint'i tek başına bu zinciri kanıtlamaz.

## Hazır kabul senaryoları — hepsi PENDING / çalıştırılmadı

| ID     | Ali Bey'in panel işlemi                                                              | Beklenen sonuç ve kontrol                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CMS-01 | Sayfa yazıları → Ana Sayfa → başlığın ilk ve kırmızı kısmını değiştirip kaydet       | Kod/JSON yok; otomatik kontroller ve korunan aktarım sonrası Cloudflare HTTP'de yeni H1; kırmızı span, menü/rota/noindex ve mobil düzen aynı                           |
| CMS-02 | Ürünler → yeni ürün; onaylı ad/açıklama, kategori seçici, Taslak → kaydet            | ID/slug/dosya adı/piksel sorulmaz; gerçek kategori ID'si otomatik saklanır; taslak sitede/JS/RSC/SEO görünmez                                                          |
| CMS-03 | Aynı ürünü Yayında yap; sonra adını değiştir                                         | İnsan teknik PR onayı beklemeden trusted kapılar geçer; yeni isim Cloudflare'da; aynı kalıcı ID/slug korunur                                                           |
| CMS-04 | Ürüne fotoğraf seç/yükle, alt açıklama yaz; sonra farklı ölçülü ikinci fotoğrafı seç | width/height/medya ID otomatik; kaynak→candidate→out EXIF sınırı seçilen politikaya uyar; gerçek dosya doğru ölçüde ve lazy yüklenir; eski orphan fotoğraf HTTP'de yok |
| CMS-05 | Ana sayfa ve galeri → fotoğraf seç, kullanım Ana sayfa büyük görseli, Yayında        | Gerçek hero doğru fotoğraf/alt ile priority/preload; galeri lazy, responsive sizes/srcset varsa korunur                                                                |
| CMS-06 | Kategori açıklaması/fotoğrafı ve şube saati/açıklamasını düzenle                     | Kategori ID/slug ve dört koordinat aynı; location verified olmaz; bilinmeyen alanlar null; detay/LocalBusiness/sitemap sızması yok                                     |
| CMS-07 | Hakkımızda ve İletişim yazılarını düzenle; yeni resmî sosyal URL öner                | Düz metin güvenli render; teknik SEO/env değişmez; doğrulama bekleyen bağlantı aktif olmaz. Onay işaretini editör yükseltemez                                          |
| CMS-08 | Duyuru oluştur: önce Taslak, sonra Yayında ve başlangıç/bitiş saatlerini seç         | Tarih dilimi doğru; published + tarih aralığı build anına göre; zaman geçmesi kendi başına siteyi değiştirmez. Zamanlayıcı gerekiyorsa ayrıca gerçek test              |
| CMS-09 | Yanlış MIME/bozuk/çok büyük/SVG fotoğraf veya geçersiz URL yüklemeyi dene            | UI veya trusted doğrulama reddeder; source Git blob'u yazılmış olabilir, bu yüzden EXIF kararı önce alınır. Main ve önceki başarılı Cloudflare yayını değişmez         |
| CMS-10 | main'e doğrudan save, ID/onay/kod/workflow/.env değişimi; eşzamanlı iki edit/çatışma | App/bot/admin bypass yok; tüm paket fail-closed durur. Sadece hidden/readonly görüntüsü başarı kanıtı değildir                                                         |
| CMS-11 | Yanlış fotoğrafı Git geçmişindeki doğru sürümle teknik sorumlu geri alır             | Yeni düzeltme commit'i, kontroller, aynı ürün kimliği ve yeni yayın; deployment rollback ile source rollback ayrıdır                                                   |
| CMS-12 | Ali Bey çıkış yapıp tekrar e-posta oturumuyla girer                                  | Yalnız davetli repo/içerik/medya; teknik config, collaborator yönetimi ve onay dosyaları açılamaz                                                                      |

CMS-01, CMS-03/04 ve CMS-05 akışlarında **Ali Bey'in kendi panel işlemi → otomatik
trusted kontroller → korunan aktarım → Cloudflare üzerinde yeni içerik ve SHA zinciri**
kanıtlanmadan entegrasyon tamamlandı sayılmaz. “Yerel test geçti”, “CMS save commit'i
var” veya “build yeşil” bu kabulün yerine geçmez.

Gerçek hosted sürümde etiket/selector/alan davranışı farklıysa ekran kaydı ve raw
save farkı ile tespit edilir; şema yanlışsa bağlantı durdurulur. Otomatik tarayıcı
senaryosu hazırlanacaksa bu gerçek selector'lar doğrulanmadan çalışıyor denmez.
Şu anki belge yürütülebilir manuel kabul protokolüdür; sahte login testi eklenmedi.

## Mevcut yerel kanıt

`node scripts/test-cms-roundtrip.mjs`, pinned upstream state/deepMap/sanitize/image
write yardımcılarıyla gerçek şekli temsil eden JSON üretir. Ana sayfa/Hakkımızda,
ürün oluşturma/yeniden adlandırma/fotoğraf değiştirme, kategori/şube, duyuru ve null
normalizasyonu izole candidate → statik build → Chrome üzerinde çalıştırıldı.
Dört genişlik: 320/393/768/1280. Raw EXIF'in kaldığı, candidate/out'ta temizlendiği
ve piksel ölçüsünün otomatik geldiği doğrulandı. Bu **kaynak tabanlı yerel sözleşme
testidir**; hosted form, reference arama, upload API, auth ve gerçek yayın testi değildir.

Resmî başlangıç: [Pages CMS quick start](https://pagescms.org/docs/quick-start/),
[davetli editör](https://pagescms.org/docs/configuration/collaborators/),
[Cloudflare static Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## 4.2-a gerçek GitHub kapıları — tamamı PENDING

- GH-01: Hesabın planı ve aktif main ruleset/PR/strict required-check sonucu API/UI'de
  görülür; CMS App main'e doğrudan save ve bypass denemesi gerçekten reddedilir.
- GH-02: Aynı context'i yanlış App veya farklı candidate SHA ile yeşil gösterme
  denemesi merge yetkisi vermez; source workflow/artifact güven kanıtı sayılmaz.
- GH-03: Main-only protected environment sırrına content-edit erişimi reddedilir;
  validator write token/secret almaz, source code çalıştırmaz.
- GH-04: Hatalı JSON/bozuk görsel/kod değişimi ve aynı alan merge çatışması main'i
  değiştirmez; eşzamanlı M/C değişiminde eski kanıt yenilenir, yeni edit kaybolmaz.
- GH-05: Bot PR tetiklenmesi/required checks/auto-merge ve canonical source-sync
  insan teknik onayı gerektirmeden çalışır; exact SHA/HTTP zinciri kaydedilir.

Yerel 63 yeni negatif/unit test ve izole Git candidate export testi bu gerçek
kurulum denemelerinin yerine geçmez. Native reference/date/UUID/image alanları
gerçek hosted sürümde, Europe/Istanbul saat diliminde ve ikinci save'de ayrıca
kontrol edilir. Davetin hosted plan/ücret ve rol kısıtları gerçek ekrandan teyit edilir.
