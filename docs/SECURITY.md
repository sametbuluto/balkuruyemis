# Güvenlik ve otomatik içerik yayını — V5 tasarımı

**8 Kasım 2026 / E2 güncellemesi:** Yerel workflow/GET observer/Git gate/Docker
validator uygulaması [TRUSTED_CI_IMPLEMENTATION](TRUSTED_CI_IMPLEMENTATION.md)
içinde kayıtlıdır. Main-bootstrap değişmedi; uzak workflow/run, attester, required
check ve otomatik aktarım kurulmadı. Yerel ve gerçek GitHub kabulü ayrıdır.
Aşağıdaki E1 ve daha eski bölümler tarihsel aşamaların kayıtlarıdır.

30 Ekim 2026 araştırması; 1 Kasım 2026 yerel tamamlama. Tasarımdır; aktif bot/workflow/branch protection kurulmadı.

## Faz 4.2-E1 — Kullanıcının kurduğu gerçek bootstrap doğrulandı

8 Kasım 2026 GET: ruleset **26805718** main-bootstrap Active; exact main, bypass=[],
mevcut admin current_user_can_bypass=never. Effective main'de deletion,
non_fast_forward ve pull_request(approvals=0); branch protected=true. Local/remote
SHA ac62779 aynı. Required check/workflow yok. Stale-review false taslaktan farklı
ve WARNING; değiştirilmedi. Bu güncel kayıt eski korunmuyor ifadelerinden önceliklidir.
[Gerçek doğrulama/E2 planı](MAIN_BOOTSTRAP_VERIFICATION.md). Salt okuma dışında
uzak işlem veya E2 implementasyonu yapılmadı.

## Faz 4.2-d — Güncel güvenlik yapılandırma planı

Faz 4.2-c ilk push kabul edildi; yerel/uzak main **ac62779e3a5a8ad0de76dd4c040c32387bd1c474**.
Yeni GET incelemesinde admin rolü doğrulandı; main protected=false, effective rules/
rulesets/workflow listeleri boş. Actions açık, default token read ve PR approval
false. /user.plan.name=pro gözlendi; ücret kanıtı veya Free hedefinden sapma değildir.
Hiçbir hesap/uzak ayar değiştirilmedi. Güncel [MAIN_PROTECTION_PLAN](MAIN_PROTECTION_PLAN.md)
ve [TRUSTED_CI_PLAN](TRUSTED_CI_PLAN.md) önceki boş-repo/push-bekliyor ifadelerinden
önceliklidir. Başlangıç payload'u yalnız yerel docs/github altındadır; uygulanmadı.

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

## Güven sınırları

main kodu/paketleri/workflow'ları teknik sorumlunun kontrolünde kalır. CMS girdisi
veridir. Ali Bey'e GitHub write rolü verilmesi önerilmez; e-posta collaborator
modeli kullanılır. `hidden`, `readonly`, `settings.hide` ve CODEOWNERS tek başına
repository yetkisi veya dal kilidi sağlamaz. Tasarım kodu CMS şemasına dahil edilmez.

İncelenen Pages CMS kurulum manifesti contents/actions yanında administration write
da istiyor. Bu self-host kurulum örneğidir; hosted kurulumun gerçek izin diyaloğu bu
tur görülmedi. “Sadece içerik dosyalarına yetkili token” iddiası yapılmaz; GitHub App
contents izni yol bazında daraltılmış bir yetki değildir. Hesaba bağlanma öncesi
istenen izinler ve yalnız hedef repo seçimi incelenmeli; CMS App'ine main bypass
verilmemeli. Bu hedef doğrulanamazsa otomatik aktarım açılmaz.
[İncelenen manifest](https://github.com/hunvreus/pagescms/blob/6f4e860a35d934406580287e7042e5e111e207a1/scripts/setup-github-app.mjs).

## Public / Private ve GitHub planı

Public repo Free dahil branch protection ve auto-merge destekler. Private repo için
aynı özelliklerin Pro/Team gibi plan koşulları kontrol edilmeli. Mevcut hesabın ücretli
planı okunmadı; API'deki public durumu kullanıcı tercihi anlamına gelmez. Private
tercihi/plan kararı verilmeden korumalar eşdeğer sayılmaz veya kaldırılmaz.
[Branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches),
[auto-merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository).

## Önerilen akış — uygulanabilirlik entegrasyonla sınanacak

1. CMS yalnız içerik girişlerini content-edit'e kaydeder. main için PR ve required
   checks zorunlu; App/bot/admin bypass kapalı, force/deletion kapalı olmalı.
   CMS'de tek dala kilitleme varmış gibi davranılmaz; main'e doğrudan save'in gerçekten
   reddedildiği test edilir. content-edit Cloudflare tarafından yayımlanmaz.
2. İlk güvenli alternatif Pages CMS action ile `ref: main` workflow_dispatch'tir:
   Ali Bey “Yayına gönder” der, insan inceleme onayı beklemez. Payload yalnız veri
   sayılır; içerdiği repo/ref/path/sha yetki kanıtı değildir, GitHub'dan yeniden okunur.
3. Kaydet sonrası tam otomatik hedef için ayrı 4.3 denemesi: content-edit push'u
   sırsız/checkout yapmayan bir bildirim workflow'u başlatır; main'deki workflow_run
   yalnız uyandırma sinyali kabul eder. Önceki run'ın artifacts/cache/yeşil sonucu
   güvenilir kabul edilmez. Event repo/dal/kaynak commit doğrulanır. Alternatif main
   schedule'dır; gecikme ve Public depoda 60 gün hareketsizlik sınırı nedeniyle tek
   güvence olamaz. Otomatik tetikleme ve izleme gerçek entegrasyonda kanıtlanmalıdır.
4. Güvenilir main workflow'u main SHA M, content-edit SHA C ve ortak atayı kaydeder.
   Güvenilir kod, gerçek Git nesnelerinden diff/mode/byte envanteri çıkarır. C'nin
   script/paket/workflow'ları checkout edilip çalıştırılmaz. İzin listesi dışı tek
   değişiklik bütün otomatik aktarımı durdurur; kısmi paket yayını yapılmaz.
5. main M üzerine yalnız izinli verilerle bir candidate oluşturulur. Üç yönlü farkta
   çatışma veya eski content-edit'in main içeriğini geri alması ihtimali varsa durulur;
   main üstüne kör dizin kopyalama yapılmaz. JSON strict şema ve iş kuralları; medya
   gerçek decode/byte/pixel; typecheck/lint/format/Vitest/static build/HTTP/E2E çalışır.
   Bu job read-only, sırsız ve yazma tokenı olmadan ayrı runner'da çalışır.
6. Başarılı candidate kendi SHA/tree kimliğiyle bot branch ve PR olur. Sır sahibi
   aktarım job'u içerik script'i çalıştırmaz; doğrulanmış kimlikleri ve Git nesnelerini
   yeniden denetler. Token yalnız hedef repo contents/pull_requests için gereken
   düzeyde; workflows/administration/bypass yok. Credential main'e sınırlandırılmış
   GitHub Environment'ta tutulur; read-only validator'a verilmez.
7. PR candidate'ında kod/workflow/paketlerin main ile aynı olduğu ve tüm required
   checks'in **aynı candidate SHA** üzerinde geçtiği doğrulanır; native auto-merge
   etkinleşir. İçerik PR'ı için insan review şartı konulmadan otomasyon mümkündür;
   kod değişikliği path kuralına takılır ve ayrı teknik review akışına gider.
8. M veya C değişirse eski onay geçersizdir; yeni candidate yeniden test edilir.
   Concurrency grubu çakışmayı azaltır ama atomik koruma yerine geçmez. main'e
   force/update-ref bypass yapılmaz. Required-check strict güncellik ve GitHub'ın
   merge-time head denetimi kanıtlanır; çatışmada otomatik çözüm uydurulmaz.
   Son yayın kapısı her değişiklikte çalışır; path filtresiyle atlanmış/neutral
   test, başarılı tam doğrulama sayılmaz.
9. Yalnız main Cloudflare production build tetikler. Build'in başarısı ve yayımlanan
   commit eşleştirilir; başarısızlığın eski başarılı siteyi koruduğu gerçek test gerekir.
   Main commit varlığı “deployment başarılı” demek değildir.

Bu mimari önerisi henüz uçtan uca kanıtlanmadı. Güvenilir workflow ile tehlikeli
checkout/cache/token birleşimi önlenmeden tam otomasyon açılmaz. Bildirim workflow'u
ve content-edit üzerindeki çalıştırma/token erişimleri de negatif test kapsamındadır.
Onay verilmiş olsa dahi korunmuş main zorunlulukları desteklenmiyorsa güvenli alternatif
yalnız doğrulama + teknik sorumlunun manuel PR merge'idir; bu, tam otomasyon hedefinin
henüz karşılanmadığı şeklinde raporlanır.

Kaynaklar: [workflow güvenliği](https://docs.github.com/en/actions/reference/security/secure-use),
[workflow_run ve schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows),
[environment sınırları](https://docs.github.com/en/rest/deployments/environments).

Bot PR için normal GITHUB_TOKEN davranışı sessizce varsayılmaz: güncel belgelerde
botun oluşturduğu PR workflow'ları insanın “Approve workflows to run” eylemine
takılabilir. Tam otomasyon için ayrı, kısa ömürlü ve en az yetkili App tokenı adayı
test edilmeli; token oluşturma/secret kaydetme bu tur yapılmadı.
[Workflow tetikleme](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

## Bu turdaki yerel kontrolün gerçek kapsamı

`src/lib/content-change-policy.ts` saf bir manifest ön kontrolüdür; aktif workflow'a
ve uygulama loader'ına bağlı değildir. Hedef yollar: content altında beş JSON
koleksiyonu/üç singleton ve public/images altındaki beş raster medya dizini.
A/M, normal 100644 mode, ASCII güvenli ad, benzersiz yol kabul edilir. Kod, .env,
.pages.yml, SVG/HTML/JS, silme/rename, symlink/submodule/executable reddedilir.

Başlangıç politika önerisi: JSON 256 KiB, raster 5 MiB, paket 20 MiB, en fazla 50
dosya. Bunlar CMS'nin yerleşik limitleri değildir. Sayılar gelecekte güvenilir Git
okuyucudan gelecek; editörün kendi gönderdiği boyut/mode beyanı kabul edilmeyecek.
Gerçek dosya biçimi/JSON parse/decode/EXIF/kategori referansı/yetki/atomik merge
bu küçük helper tarafından doğrulanmaz; sonraki kapılar zorunludur.

## Medya ve içerik ek kontrolleri — yapılacak

- Raster uzantısı ve magic/decode eşleşmesi; dosya başı byte, toplam repo/diff,
  piksel sayısı ve en uzun kenar limiti. SVG teknik sorumlu kontrolünde kalır.
- Ham yükleme ile türetilmiş WebP/AVIF ayrılır; EXIF kaldırılır, kaynak büyütülmez.
  Dönüşüm build öncesi sırsız aşamada, deterministik varyantlarla yapılır.
- CMS ham resmi zaten Git'e commit etmiş olabilir: build reddi history boyutunu
  geri küçültmez. Eğitim + küçük kaynak dosyası + kota izleme gerekir; katı pre-upload
  sınırın hosted serviste doğrulanması gerekir. Desteklenmiyorsa tam garanti verilmez.
- Şema dışı alan, bozuk JSON, çok uzun metin, tekrar slug, olmayan kategori,
  yanlış Maps/koordinat, bozuk medya ve boş URL reddi; null/boş ayrımı açık tutulur.
- Location → verified yükseltmesi yalnız korunan kimlik onayıyla; eksik kimlikte
  detay/sitemap/LocalBusiness yok. Mevcut dört koordinat kendiliğinden değişmez.
- Taslak kayıt görünmez; fiziksel silme yerine draft. Silme farkı otomatik aktarımı
  durdurur. Metinler escape edilir; eval/MDX/dangerouslySetInnerHTML kullanılmaz.

Harici kabul testleri: kod/workflow ekleme, sahte yeşil check, eski SHA, eşzamanlı
iki içerik kaydı, merge conflict, hatalı medya, App'in main'e doğrudan yazması ve
editörün teknik ayarlara erişmesi. Hiçbiri yerel birim testinin başarısıyla tamamlanmış sayılmaz.

## 4.1-c2 — Yerel şube kimliği kapısı

`content/branches/*.json` işletme verisinin tek kaynağıdır. Onaylar yalnız
`src/content/branch-identity.ts` içinde ID + id/slug/ad/adres/koordinat SHA-256 özetidir.
Bu dosya içerik editörü izin listesi dışındadır. Loader verified kaydı ancak aynı
kimlik özeti onaylıysa kabul eder; hash bir secret veya elektronik imza değildir,
korunan teknik kayıttaki karşılaştırma değeridir. Şu an onay listesi boştur.
Kimlik alanı değişirse ürün sahibi doğrulamasıyla teknik onay da yenilenir.
Telefon/saat/görsel/status bu özete dahil değildir. JSON'da verified veya hidden UI
alanı ayarlamak onay vermez. Draft verified kayıt da onay denetiminden geçer.
Gerçek GitHub main koruması/güvenilir candidate CI henüz kurulmadı; yerel loader ve
policy testi bu harici yetkilerin yerine geçmez. LocalBusiness üretimi eklenmedi.

## 4.1-c3 — Aktif yerel medya kontrolü

Sharp full decode, binary imza/MIME, gerçek boyut/oran, 5 MiB dosya / 20 MiB toplam /
128 dosya / 24 MP / 8000 px sınırları, symlink/path ve global medya ID kontrolleri
çalışır. SVG kapalıdır. Draft/orphan dosyalar out/images'te kalmaz; published rasterlar
re-encode edilip kaynak EXIF/XMP/IPTC/ICC taşınmaz. Kaynak/Git blob'u temizlenmez;
public repo'ya upload öncesi EXIF mahremiyet kontrolü ayrıca gerekir.
Build drift fingerprint'i yereldir; exact Git SHA/candidate/branch protection güvenliği
hâlâ ayrı kurulacaktır. Başarısız build'in out'u yayımlanmaz. [MEDIA_GUIDE](MEDIA_GUIDE.md).

## C4 düz metin ve iletişim sınırı

Yeni gerçek kaynak yolları content/pages/{home,about,contact,catalog,branches}.json
ve content/settings/{site,social}.json'dur. Yerel content-change-policy bunları
kabul eder; önceki singleton aday yolları prototip uyumluluğu için durur fakat
uygulama bunları okumaz. Gelecek CMS/CI yalnız gerçek kaynaklara bağlanmalıdır.
Bu helper hâlâ aktif CI veya yetki sınırı değildir.

Strict nested şema bilinmeyen alanı, HTML/CSS ayarı, href/domain/noindex değişikliğini
reddeder. Metin içindeki HTML düz metin olarak escape edilir. Sosyal URL host/protokol
kuralları güvenli hedef biçimini doğrular; verified editoryal beyanı hesap sahipliğini
kanıtlamaz. Gerçek sahiplik ürün sahibince doğrulanmalıdır. İletişim taslak değerleri
ziyaretçi props/bağlantılarına aktarılmaz. SITE_BUILD_AT güvenilir build sürecinindir;
içerik şemasında yoktur. Statik tarih seçimi bir otomatik yayın servisi değildir.

## C5 input/candidate kapısı — çalışan yerel kontrol, aktif CI değil

.pages.yml artık yerel prototiptir; allowlist içeriği olarak editöre .pages/kimlik/
workflow/kod açılmaz. Adaptör protected branch alanlarını baseline'a karşı karşılaştırır;
koordinat/Maps/kind/ID/slug ve verified yükseltmesini reddeder, yeni iletişim değerinin
onayını düşürür. Eksik dosya veya raw medya silme/rename, bozuk/eksik ref/medya ve
bilinmeyen alan paketin tamamını durdurur. Teknik onaylar source snapshot'ından
okunmaz, trusted kodun branch-identity kaydı kullanılır.

Candidate aracı source script'i çalıştırmaz; yalnız izinli veri okur ve ayrı boş
dizine normalize/temiz veri yazar. Henüz Git nesnesinden manifest/üç yönlü fark,
exact SHA/PR/race/conflict/atomic merge/branch protection kurmaz. Bu katman yokken
CMS'yi main/Cloudflare'a doğrudan bağlamayın. CLI'ye immutable/premerged trusted
snapshot verilmesi gelecekteki job'ın sorumluluğudur; kör kopyalama güvenli değildir.

Hosted media upload kaynak base64'ü GitHub'a yazabilir; candidate EXIF temizliği eski
raw blob'u silmez. Public/private ve pre-Git gizlilik kararı bağlantı ön koşuludur.
Karşılaştırmalı seçenekler CMS_ADAPTER, gerçek başarısız upload/izin/rollback kabulü
CMS_ACCEPTANCE içinde. Yerel unit/wire testi hosted yetki kanıtı sayılmaz.

## 4.2-a izin ve kanıt ayrımı

7 Kasım public hosted App API kaydı write actions/contents/repository_creation;
read checks/deployments/emails/metadata/pages/statuses gösterdi. administration write
public hosted kayıtta yok; yukarıdaki self-host manifestiyle karıştırılmamalıdır.
Gerçek installation grant, kullanıcı planı ve bypass durumu henüz okunmadı.
[Public App API](https://api.github.com/apps/pages-cms).

Geçmiş taraması başlangıçtaki 7 commit/340 blob içinde gerçek env, build/test çıktısı,
bilinen sır deseni veya raster fotoğraf bulmadı. Private repo metadata temizliği
değildir; ilk gerçek CMS testi önceden EXIF/XMP/IPTC'siz ve yayın hakkı onaylı
fotoğraflarla yapılmalıdır. Source Git geçmişi candidate/out temizliğinden etkilenmez.

Yeni Git ingress gerçekten blob/mode/byte kontrol eder; üç yönlü merge conflict ve
SHA drift'te durur. Yerel promotion proof modeli gerçek GitHub koruması değildir.
API enforcement, trusted workflow/check App, main-only secret ortamı ve korunan PR
yazarı kurulmadan tam otomasyon açılmaz. Ayrıntı AUTOMATION_DESIGN içindedir.
