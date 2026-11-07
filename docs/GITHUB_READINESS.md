# Faz 4.2-a — GitHub ve gerçek Pages CMS bağlantı hazırlığı

7 Kasım 2026. **Salt okunur uzak kontroller + yerel hazırlık. Push, görünürlük/App/
davet/secret/Cloudflare değişikliği yapılmadı.** Bu belge otomasyonun kurulmuş olduğu
anlamına gelmez. Tasarım [AUTOMATION_DESIGN](AUTOMATION_DESIGN.md), gerçek panel
kabulü [CMS_ACCEPTANCE](CMS_ACCEPTANCE.md) içinde.

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

## 1. Doğrulanan yerel ve uzak durum

| Kontrol                              | Gözlem                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| Başlangıç yerel dal/commit           | main / 8d0046da331ba8f9d5035cf750d42b3a1ccbfbd8, temiz çalışma ağacı                |
| Yerel geçmiş                         | 7 commit; b844bad → 78df0f7 → 11b2884 → 0507348 → 697db94 → ec334f8 → 8d0046d       |
| Local remote                         | Boş; origin eklenmedi                                                               |
| Hedef                                | sametbuluto/balkuruyemis; owner türü User (kişisel repo)                            |
| Anonim repo API                      | Public, size 0, default_branch main, archived/disabled false                        |
| Anonim ls-remote                     | Başarılı; yayımlanmış branch/tag ref'i yok                                          |
| Uzak branches / rulesets             | İki GET de boş liste; uzak main dalı henüz yok                                      |
| Hesabın gerçek planı / admin yetkisi | Yetkili oturum olmadığı için okunmadı; API private permissions/plan bilgisi vermedi |

Default_branch değerinin main olması dalın var olduğu veya korunduğu anlamına
gelmez. Bu anda main koruması kurulmuş/doğrulanmış sayılamaz. Uzak refs boşluğu
kontrol anına aittir; sonraki push'tan hemen önce tekrar kontrol gerekir.

### Commit geçmişi denetimi

`npm run publishing:audit` tüm reachable ref/commit ağaçlarını inceler. Başlangıçta
7 commit, 340 benzersiz blob; en büyük blob 307409 byte. Gerçek env/build/cache/
node_modules/test raporu yolu 0, bilinen sır deseni 0, raster blob 0, EXIF taşıyan
fotoğraf 0, büyük/atlanmış blob 0. `.env.example` yalnız şablondur. Rapor token
veya dosya içeriğini loglamaz. Tarihte silinmiş bir env/tokenın da bulunduğu negatif
izole test vardır. Bu, bilinen desen taramasıdır; evrensel secret tespit garantisi
veya harici güvenlik denetimi değildir. Dangling nesneler normal main push'una dahil
olmaz; bu rapor reachable geçmişi denetler.

.pages.yml, 12 form, bütün eski uygulama/veri/test kaynakları, altı kategori ve
dört koordinat aynı kaldı. Gerçek ürün/galeri/fotoğraf yok; geometrik test resimleri
ve örnek ürünler yalnız temp test projelerinde tutulur. Yedek/kanıt dizini:
/private/tmp/bal-phase42a/ (baseline-source.tar, history-audit.json ve GET sonuçları).

## 2. Public / Private ve plan kararı

| Seçenek                     | Site main koruması / required checks / auto-merge | Secret'ı main dalına sınırlama                           | Karar                                                                             |
| --------------------------- | ------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Public + güncel GitHub Free | Resmî olarak destekli                             | Public environment secret/deployment branch desteği var  | 0 USD plan maliyeti; kaynak/geçmiş/raw fotoğraf herkese açık                      |
| Kişisel Private + Free      | İstenen native korumalar desteklenmiyor           | Private environment/branch secret sınırı yok             | Tek repoda bu güven modeliyle otomatik yayın açılmaz                              |
| Kişisel Private + Pro       | Resmî olarak destekli                             | Private environment secret/deployment branch desteği var | Hesap planı/ödeme ekranı ve gerçek enforcement doğrulanmalı                       |
| Organizasyon Private + Team | Resmî olarak destekli                             | Destekli                                                 | Public fiyat listesi 4 USD/kullanıcı/ay; bu kişisel repoyu kendiliğinden kapsamaz |

Pro/Team'deki private environment için required reviewer/wait timer gibi ek
özellikler ile deployment branch/secret sınırları aynı değildir. Burada gereken
main-only secret erişimidir; editörün her içerikte insan onayı beklemesi hedeflenmez.
Pro'nun resmî tarihsel fiyat ilanı 4 USD/aydır (2020 FAQ); güncel kişisel hesap
checkout/fatura/vergi bu tur görülemedi. Bu sayı kesin güncel ödeme teklifi olarak
sunulmaz. Team liste fiyatı da ödeme dönemi/yenileme/vergi ekranında teyit edilir.
Satın alma, upgrade veya repo transferi yapılmadı.

Kaynaklar: [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches),
[rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets),
[auto-merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository),
[environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments),
[planlar](https://docs.github.com/en/get-started/learning-about-github/githubs-plans),
[güncel Team fiyatı](https://github.com/pricing),
[tarihsel Pro fiyatı](https://docs.github.com/en/get-started/learning-about-github/faq-about-changes-to-githubs-plans).

### Koruma yoksa alternatif

Korumaları kapatıp CMS App'e site main yazma yetkisi vermeyiz. İlk seçenek uygun
Pro/Team planını doğrulamaktır. Ücretli plan istenmiyorsa teknik sorumlu kontrollü
manuel PR/yayın ile durmak mümkündür; bu tam otomatik kabul değildir.

Ayrı bir öneri, untrusted raw CMS içeriği için Private veri repo'su ve korunan
Public site repo'sudur; CMS App site repo'suna kurulmaz. Plan maliyeti Free sınırları
içinde 0 USD olabilir fakat iki repo/relay/erişim/CI kotası ve izleme ek karmaşıklık
gerektirir. Cron tek başına teslim/yayın garantisi sayılmaz; otomatik tetikleme,
çatışma ve izinler ayrıca tasarlanıp test edilmeden bu alternatif hazır değildir.
Bu tur yeni repo veya bu alternatif mimari uygulanmadı.

## 3. Hosted Pages CMS App hangi izinleri istiyor?

`GET https://api.github.com/apps/pages-cms` anonim public metadata'sı 7 Kasım'da:

| İzin anahtarı                                               | Düzey |
| ----------------------------------------------------------- | ----- |
| actions                                                     | write |
| contents                                                    | write |
| repository_creation                                         | write |
| checks / deployments / emails / metadata / pages / statuses | read  |

Olaylar delete/push/repository/workflow_run. **Bu kayıt senin hesabında verilmiş bir
kurulum izni değildir.** Gerçek installation/repository selection/bypass ayarları
okunmadı. Kurulum ekranı bu public kayıttan farklı istek gösterirse durup tekrar
incelemek gerekir. Source setup manifest'indeki administration:write varsayılanı
ile hosted App'in bu tur gözlenen izinleri karıştırılmaz; hosted public kayıtta
administration:write görülmedi.

Contents yetkisi dosya yoluyla sınırlandırılmış değildir. Only select repositories
seçimi repository-scoped erişimi daraltır; repository_creation gibi daha geniş
izinleri otomatik olarak gereksiz hale getirmez. Hosted App'in sabit isteklerini
biz kullanıcı adına azaltamıyoruz. Gerekli görülmeyen/broad izin kabul edilmiyorsa
App kurulmaz; alternatif ayrıca değerlendirilir. CMS App'e main bypass verilmez.

[Public App API](https://api.github.com/apps/pages-cms),
[App tanıtımı](https://github.com/apps/pages-cms),
[resmî collaborator modeli](https://pagescms.org/docs/configuration/collaborators/).

## 4. Ali Bey kullanıcı modeli ve 12 form

Resmî model e-posta collaborator: içerik/medya düzenler; .pages.yml, collaborator
ve cache admin yönetmez. GitHub write rolü verilmez. Ayrıntılı RBAC veya editöre
özel dal kilidi varmış gibi davranılmaz. Ana sayfa email invite ve ücretsiz kullanım
anlatırken App tanıtımında Pro/granular permissions metni bulunuyor; hosted gerçek
hesaptaki davet/ücret/rol ekranı görülmeden özel plan veya granular yetki sözü verilmez.

Repo ve content-edit açıldıktan sonra beklenen menü:

| Yer                                  | Form                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| Ürünler                              | Ad/açıklama, gerçek kategori seçici, fotoğraflar, sıra/durum |
| Kategoriler                          | Mevcut altı kategori düzenleme                               |
| Şubeler / Konumlar                   | Mevcut fiziksel kayıtların metin/saat/fotoğrafları           |
| Ana sayfa ve galeri fotoğrafları     | Fotoğraf, Türkçe alt, kullanım, sıra/durum                   |
| Duyurular                            | Başlık/açıklama, görsel, durum/sıra, isteğe bağlı tarih      |
| Sayfa yazıları → 5 dosya             | Ana Sayfa, Hakkımızda, İletişim, Ürünlerimiz, Şubelerimiz    |
| İşletme ve sosyal bilgiler → 2 dosya | Marka ve iletişim; Sosyal bağlantılar                        |

Image native picker kaynak yolunu yazar; ölçü/ID adaptörde oluşur. Reference gerçek
kategori ID'sini saklar; canlı arama API'si henüz test edilmedi. Date alanı boş
default ve açık UTC offset formatı kullanır; gerçek tarayıcı saat dilimi (ilk testte
Europe/Istanbul) ve tarih picker kaydı ayrıca doğrulanır. Native UUID editorKey
üretir; filename input gizlidir. Yeni ve mevcut kaydın ikinci save'i ID/slug'ı
korumalıdır. Yerel source-backed test bunları temsil eder; hosted render/auth/save
aynı sürüm varsayılmaz. Şube onay/koordinat ve verified alanları açılmaz.

## 5. İlk push için kontrollü plan — çalıştırılmadı

1. Public/Private tercihini ve hesabındaki Free/Pro/Team bilgisini doğrula. Değişiklik
   gerekiyorsa ayrı izin al; bu tur görünürlüğe dokunulmadı.
2. Hesap sahibi repo'ya bağlı webhook/App/Cloudflare projesi olup olmadığını kontrol
   etsin. Boş repo bile önceden bir yayın servisine bağlanmış olabilir. İlk push'un
   otomatik deployment başlatmayacağı doğrulanmadan push yapılmaz.
3. Yerel commit ve geçmiş audit/check/E2E sonuçlarını incele; backup/temiz main olsun.
   İlk push için ayrıca açık izin al. Bu belge veya c5 kabulü push izni değildir.
4. Yetki sonrası ls-remote ve remote URL yeniden kontrol edilir. Uzak refs değişmişse
   push durur; uzak geçmiş overwrite edilmez. Origin yalnız doğru hedefe eklenir.
5. İzinli aşamada dry-run ve yalnız refs/heads/main:refs/heads/main push'u yapılır.
   --force, --mirror, --all, geçmiş reset veya gerçek env/rapor push'u yoktur.
6. Repo'da main oluşunca ve CMS/Cloudflare henüz bağlı değilken koruma/CI bootstrap
   tamamlanır. Required check App/context ve main-only environment gerçek API/UI'de
   doğrulanır; CMS App'in main'e save'i engellediği kontrollü gerçek test ayrıca izin ister.
7. Bu kapılar ve aşağıdaki medya şartı geçmeden CMS App/davet/Cloudflare kurulmaz.

İlk kaynak push'una **teknik olarak koşullu hazırız**: kaynak/geçmiş temiz ve ref'ler
boş. Kullanıcı kararları, hesap/harici integrasyon kontrolü ve açık push izni hâlâ
eksik. Otomatik CMS yayını hazır veya güvenli biçimde aktif denemez.

## 6. Medya ve ilk gerçek test

Private repo EXIF temizliği değildir. Hosted raw upload, metadata'yı Git blob'una
yazabilir; local candidate/out temizliği geçmişi silmez. İlk canlı editör testinde
teknik sorumlu önceden EXIF/XMP/IPTC'siz olduğu doğrulanmış, yayın hakkı onaylı ve
kişisel veri içermeyen gerçek fotoğrafları hazırlar. Ali Bey yalnız seçer/yükler,
Türkçe alt metin yazar; terminal veya piksel ölçüsü girmez. Gerçek ürün/fotoğraf
şu an yok, işletme sahibi sağlamalıdır. Kişisel telefon fotoğrafları mahremiyet
koşulları sağlanmadan GitHub'a aktarılmaz. [CMS_ADAPTER](CMS_ADAPTER.md).

## 7. Şimdi gereken net kullanıcı adımları

- GitHub Settings/Billing ekranında gerçek planı bildir; Public kalma / Private
  tercihine karar ver. Şifre, token veya ödeme bilgisi paylaşma.
- Repo'nun şu anda herhangi bir yayın servisine bağlı olmadığını doğrula.
- Rapor ve yerel checkpoint'i inceleyip **yalnız ilk push** için ayrı izin ver.
- Sonraki aşamada koruma/CI kurulumu yetkisi; ardından App'in gerçek izin ekranını
  inceleyip yalnız hedef repo kurulumunu onayla. Ali Bey'in e-posta adresini belirle;
  davet henüz gönderilmez. Cloudflare bağlantısı/yayın ayrıca izin ister.

[CMS_ACCEPTANCE](CMS_ACCEPTANCE.md) gerçek testlere geçişte kullanılacak protokoldür.
Bu tur `.github/workflows` aktive edilmedi; hesap planı, App kimliği, checks ve
bypass/secret korumaları görülmeden çalışıyor gibi gösterilen yayın workflow'u
bırakılmadı. Kaynak hazırlığı ile çalışan harici otomasyon ayrımı korunur.
