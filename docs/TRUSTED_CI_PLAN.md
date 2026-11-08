# Faz 4.2-d — Trusted CI ve required check geçiş planı

**8 Kasım 2026 / E2 güncellemesi:** Yerel workflow/GET observer/Git gate/Docker
validator uygulaması [TRUSTED_CI_IMPLEMENTATION](TRUSTED_CI_IMPLEMENTATION.md)
içinde kayıtlıdır. Main-bootstrap değişmedi; uzak workflow/run, attester, required
check ve otomatik aktarım kurulmadı. Yerel ve gerçek GitHub kabulü ayrıdır.
Aşağıdaki E1 ve daha eski bölümler tarihsel aşamaların kayıtlarıdır.

7 Kasım 2026. **Tasarımdır; .github/workflows altında dosya veya aktif run yoktur.**
Kurulum diff'i/pinleri/izinleri onaylanmadan yeni commit/push/PR veya workflow
çalıştırılmaz. [MAIN_PROTECTION_PLAN](MAIN_PROTECTION_PLAN.md) ile birlikte okunur.

## Faz 4.2-E1 — Kullanıcının kurduğu gerçek bootstrap doğrulandı

8 Kasım 2026 GET: ruleset **26805718** main-bootstrap Active; exact main, bypass=[],
mevcut admin current_user_can_bypass=never. Effective main'de deletion,
non_fast_forward ve pull_request(approvals=0); branch protected=true. Local/remote
SHA ac62779 aynı. Required check/workflow yok. Stale-review false taslaktan farklı
ve WARNING; değiştirilmedi. Bu güncel kayıt eski korunmuyor ifadelerinden önceliklidir.
[Gerçek doğrulama/E2 planı](MAIN_BOOTSTRAP_VERIFICATION.md). Salt okuma dışında
uzak işlem veya E2 implementasyonu yapılmadı.

## 1. Güvenlik sözleşmesi

- Public + Free özellik sınırı korunur; API'nin mevcut hesap için pro bildirmesi
  ücret/upgrade gereksinimi yaratmaz. Paid push ruleset veya Enterprise required
  workflow zorunluluğu önerilmez.
- Güven kökü current main commit M ve onun package-lock.json/scripts/workflow'larıdır.
  C=raw content-edit source, B=ortak ata, H=PR head/canonical candidate. Tam SHA'lar,
  gerçek Git tree/blob/mode ve PR bilgisi GitHub API/Git'ten bağımsız okunur.
- Payload/input'taki SHA yalnız önerilen hedef bilgisidir, yetki veya PASS kanıtı
  değildir. M/C/H, repo sayısal ID/owner, base main, trusted workflow SHA/path,
  run ID/attempt, candidate parent ve veri fingerprint'i yeniden doğrulanır.
- Untrusted workflow/artifact/cache/log veya stdout'taki PASS sonucu kullanılmaz.
  M/C/H değişince eski doğrulama geçersiz olur; queued run yeniden üretilir.
- Required check, kaynak dalın çalıştırabildiği workflow job adından ibaret olamaz.
  Aynı GitHub Actions App altında başka bir YAML aynı adlı yeşil job üretebilir.
  App ID=GitHub Actions seçmek tek başına trusted workflow kimliğini kanıtlamaz.

## 2. Önerilen dosyalar — henüz oluşturulmadı

| Gelecek workflow                        | Tetik / amaç                                                                                                                       | Yetki sınırı                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| .github/workflows/pr-diagnostics.yml    | pull_request → teknik PR için yardımcı sırsız testler                                                                              | permissions:{}; GitHub-hosted ayrı runner; hiçbir authoritative check veya yazma credential'ı yok                   |
| .github/workflows/trusted-candidate.yml | Default-main workflow_run controller; main-ref workflow_dispatch teknik onay/yeniden test; push/main açık PR yeniden değerlendirme | Root permissions:{}; metadata job'ında yalnız contents/pull-requests/actions read; source kodu/komutu çalıştırılmaz |
| .github/workflows/content-intake.yml    | İleride content-edit save/push sinyali                                                                                             | Sırsız sinyal; code checkout/cache/artifact yok; sonucu güven kanıtı değil; bu fazda source dalı/bağlantı kurulmaz  |
| .github/workflows/promote-content.yml   | Daha sonraki korunan PR/writer/senkronizasyon                                                                                      | Bu CI ilk kurulumunun kapsamı değil; ayrı onay ve ayrı minimum App tokenı                                           |

Seçilen tetik stratejisi **workflow_run + main-ref workflow_dispatch + push/main**.
workflow_run yalnız pr-diagnostics/content-intake sinyalidir; önceki run'ın yeşili,
artifact'ı veya cache'i hiçbir kontrolün yerine geçmez. Controller trusted main'de
bulunmadan otomatik akış açılmaz. Hedef workflow_id/path'leri gerçek ilk run'da
API'den sabitlenir; yalnız workflow adı yeterli değildir. PR ilişkisi belirsiz,
repo/base/ref farklı veya run/attempt eskiyse durulur. pull_request_target bu ilk
tasarımda kullanılmaz; privileged H checkout ihtiyacı yaratılmaz.

Main-ref provenance, event/run repo kimliği ve allowlist workflow kimliği API'den
kanıtlanır. PR/path filtresi check'i sessizce atlamamalıdır. Yeni main commit'i
ilgili açık PR'ları yeniden değerlendirir. Teknik review sonrasında main-ref
workflow_dispatch yeniden değerlendirmeyi başlatır; input PR/SHA öneri, yetki
kanıtı değildir. İçerik save otomatiği content-intake → workflow_run üzerinden
ilerler; içerikte manuel dispatch şartı yoktur. Sinyalin teslimi/bot tetikleme
kısıtları gerçek test ister; polling tek başına yayın garantisi sayılmaz.

Action/reusable workflow bağımlılıkları gerçek tam commit SHA ile sabitlenir;
kimlik/pinler implementation diff'inde doğrulanır, sahte SHA yazılmaz. Yeni action
lockfile/üçüncü taraf servis bu planda eklenmez. persist-credentials:false ve
fetch-depth:0 veya exact M/C/B/H nesnelerini getiren kontrollü fetch kullanılır.
Untrusted cache geri yüklenmez; cache ilk kurulumda kapalıdır. Source branch npm
paketi/script'i credential taşıyan işte hiçbir şekilde çalışmaz.

## 3. İşler ve minimum yetkiler

| İş                          | Veri/kod                                                                        | Yetki ve ortam                                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main controller             | M'deki driver; yalnız API/Git metadata ve sınıflandırma                         | GITHUB_TOKEN yalnız gerekli read: contents, pull-requests, actions; write/id-token/deployments/packages yok                                                                      |
| Content validator           | M code + M lockfile + yalnız C'den strict izinli veri; mevcut adapter/three-way | Ayrı fresh job permissions:{}, custom secret/environment yok; public kaynak anonim fetch; writer/attester credential'ı yok                                                       |
| Technical validator         | M driver kontrolünde H uygulama kodu; daha düşük güven düzeyi                   | Ayrı disposable sandbox/job, permissions:{}, secrets/environment/cache yok; diagnostics sonucu tek başına authority değil                                                        |
| Technical approval observer | GitHub PR review/main-ref yetkili inceleme olayı                                | Yalnız read; izinli teknik actor sayısal kimliği, subject M/H ve güncellik kanıtı                                                                                                |
| Check attester              | Yalnız M'deki doğrulanmış kod; H/C checkout/execute yok                         | Ayrı main-only protected environment; App yalnız checks:write + metadata:read; gözlem için GITHUB_TOKEN contents/pull-requests/actions read; contents/PR/actions/admin write yok |
| Gelecekte writer            | Tek doğrulanmış canonical tree/PR                                               | Ayrı contents:write + pull_requests:write; checks/workflows/admin/bypass yok; validator tokenıyla birleşmez                                                                      |

Validation **sırsızdır**. Uzak Check Run yazmak ise sırsız bir yetenek değildir;
attester ayrı yetkili bileşendir. Kişisel mevcut Git credential'ı CI'ya taşınmaz.
Default read ayarı aynı-repo YAML'in permissions isteğini tek başına sınırlamaz;
main-only environment, trusted kod/provenance ve App ayrımı gerekir. Native
GITHUB_TOKEN'ın ortak App kimliğine güvenerek spoof-proof koruma iddiası yapılmaz.

Önerilen ayrı attester App henüz yoktur; kurulumu/anahtarı/tokenı bu görevde
oluşturulamaz. Bu kapı onaylanıp gerçek çalışması görülmezse sadece sırsız CI
sonuçları raporlanır, tam required-check güvenliği/auto-publish etkinleştirilmez.
Public main-only environment UI yolu Settings → Environments; Selected branches
**yalnız main**, tüm protected branch'ler seçimi kullanılmaz. İçerik başına manuel
reviewer konulmaz. Event türünün gerçek environment ref davranışı test edilmelidir.

## 4. Content PR ve teknik PR ayrımı

### Otomatik içerik yolu

M/C/B exact pin → gerçek blob/mode/byte allowlist → M adapter ile normalize →
üç yönlü merge → yeniden strict schema/decode → M üstüne canonical data-only H →
tam kontroller → trusted verdict → PR/strict main. JSON/medya silme/rename ve
kod/workflow/env/paket değişikliği paketin tamamını durdurur. Şube kimlik hash'i,
koordinat ve verified kapıları aynı; C'den teknik onay alınmaz. Raw kaynak doğrudan
production veya candidate preview olarak yayımlanmaz.

İçerik yolu otomatik; insan PR review gerektirmez. H'nin current M üstünde olduğu,
kod/lock/workflow tree'sinin M ile aynı olduğu ve yalnız yeniden türetilmiş data
ile eşleştiği doğrulanır. Branch prefix, commit author veya bir JSON rapor yetki
sayılmaz. Writer PR'ının gerçek API actor'ı/installation'ı da kontrol edilir.

### Teknik değişiklik yolu

Kod/workflow/.pages/paket/policy değişikliği content-only olarak kabul edilmez.
Ayrı teknik inceleme ve validation gerekir. Yardımcı pull_request workflow'u H
tarafından değiştirilebilir; yeşili authoritative verdict'e dönüştürülmez.

Teknik H kodu çalıştırılacaksa trusted M driver'ı ayrı, credential'sız sandbox'ta
sabit kontrol reçetesini yönetir. H checkout runner üzerinde yapılmaz; Git nesneleri güvenli veri aktarımıyla
sandbox içine alınır, symlink/submodule/path kaçışı engellenir. H kodu host runner
env/socket/cache, driver dosyası,
Git credential veya attester dosyalarına erişememeli. Salt farklı job adı izolasyon
kanıtı değildir. Container/socket/volume/egress sınırları gerçek negatif testte
kanıtlanmadan bu worker güvenilir sonuç kaynağı sayılmaz. H'nin npm install script'i
ve lock değişikliği ayrı quarantine gerektirir; içerik CI M lockfile kullanmaya
kesin devam eder. Yeni lock/dependency ancak teknik onay sonrası güven köküne girer.

İnceleme kanıtı exact H/M için izinli teknik reviewer'ın geçerli PR review'ı olabilir.
GitHub kişinin kendi PR'ını approve etmesine izin vermez: tek owner durumunda
alternatif, **main-ref protected teknik onay workflow_dispatch** olayıdır. Controller
actor ID/yetki, main workflow SHA ve güncel PR head'i API'den bağlar; input SHA veya
label tek başına yetki değildir. H/M değişirse onay yenilenir. Bu alternatif henüz
kurulmuş veya test edilmiş değildir. CODEOWNERS/author adı/etiket güven kanıtı olmaz.
Ali Bey teknik PR veya terminal onayı vermez; manuel inceleme yalnız teknik değişiklikte.

## 5. Mevcut kontrollerin güvenilir reçetesi

Content validator'ın çalışma kökü M kodu ve onaylı lockfile'dır. Yalnız strict
normalize canonical content ve raster dosyaları eklenir. Bu kökte:

```bash
npm ci
npm run check
npx playwright install --with-deps chrome
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
node scripts/test-cms-roundtrip.mjs
node scripts/test-publishing-export.mjs
node scripts/test-category-export.mjs
node scripts/test-product-export.mjs
node scripts/test-branch-export.mjs
node scripts/test-media-export.mjs
node scripts/test-editorial-export.mjs
```

Script isimleri mevcut projeden doğrulanır; CI bootstrap Linux Chrome kurulumu ve
tam Node/action sürümleri implementation sırasında izole runner'da test edilmeden
çalışıyor denmez. Node sürümü mevcut engine aralığında desteklenen LTS olarak
seçilip tam sürüm/digest sabitlenir; yerel Node 20.20.0 sonucu Linux CI kanıtı değildir.
Paket kurulumu yalnız M lockfile ile; untrusted lifecycle kodu trusted credential
ortamına girmez. Gereksiz tekrar eden fixture build'leri ayrı sırsız job'lara
bölünebilir; aynı kökte Next typegen/build paralel olmaz. SITE_BUILD_AT tek trusted
build anıdır, içerik editörü belirlemez. CI alan adı/indexing varsayılanı boş/false.

npm run check mevcut typecheck, ESLint, Prettier, Vitest, Pages CMS config,
media decode/normalizasyonlu production export ve Static HTTP testlerini içerir.
Chrome E2E 320/393/768/1280 regresyonlarını kapsar. Test fixtures gerçek content/out'a
kopyalanmaz. Draft/gizli JSON/LocalBusiness sızmaması ve dört koordinat korunması
mevcut testlerle sürer. Bunlar burada tarif edilen **gelecek CI reçetesidir**;
hepsinin bu tur tekrar çalıştırıldığı anlamına gelmez.

## 6. Required check'e geçiş ve SHA kanıtı

Başlangıç ruleset checksizdir. Gerçek güvenli test PR'ında kontroller çalıştıktan
sonra App, context, run/attempt, tested H/M/C ve final tree bağı kurulur. Önerilen
tek ortak verdict adı **bal/trusted-validation**, content ve technical modunu ayrı
inceler; global iki zorunlu check ile diğer PR türü kalıcı kilitlenmez. Bu isim
henüz mevcut değildir. Mevcut promotion-gate örneği content-candidate/trusted-validation
kullanır; yerel content simülatörü bu tur değiştirilmedi. Yeni ortak sözleşmeye
uyarlama ve teknik mod, ileride açık onaylı uygulama/test işidir.

Attester:

1. GitHub'dan current main M, PR H, source C, trusted workflow SHA/path/ID,
   run ID/attempt ve beklenen tamamlanmış job/step sonuçlarını yeniden okur.
2. İşlerin hepsinin gerçek success olduğunu ve classification/technical approval
   koşullarını denetler. needs çıktısı tek başına yeterli değil; yanlış run/attempt,
   source artifact/log/cache veya eski proof reddedilir. M driver'ın sandbox dışındaki,
   source'un erişemediği trusted çıktısı ancak run/attempt/workflow/subject bağlarıyla
   kullanılabilir; taşıma artifact'ı kendi başına kanıt değildir. Kaynak kodu attester'da
   çalıştırılmaz. Secret job **görsel decode/normalizasyon veya source install yapmaz**;
   test edilen H/tree kimliği API/Git nesneleriyle karşılaştırılır. Needs çıktısı
   yalnız bu izolasyon/provenance ve bağımsız API kontrolüyle anlam kazanır.
3. Tam H üzerinde kendi App kimliğiyle queued/in_progress → success veya failure
   Check Run üretir. Native GitHub skipped/neutral kabul edebilir; bu App bu durumları
   üretmez. Cancel/timeout/missing/unknown sonucu success'e çevrilmez. Attester hiç
   çalışmazsa check eksik/pending kalır ve merge durur; yeşil default yoktur.
4. Aynı adlı başka App/job check'i, Any source veya input'tan app_id kabul edilmez.
   Gerçek app.id (installation ID değil) ruleset integration_id ile eşleşir.
5. Uygulanacak strict=true, tam H ve latest M/C drift kontrolüyle yeniden değerlendirme
   zorunludur. Context gerçekten görülmeden ruleset'e eklenmez. Check'in PR merge
   ref'i/main/source SHA'sına yanlışlıkla bağlanmadığı API head_sha ile kanıtlanır.

Güvenilir App'in success-only politikası gerçek testle kanıtlanmadıkça GitHub native
status semantics'i otomatik olarak sertleşmiş sayılmaz. Actions ortak App'iyle aynı
adı yazmak bu şartı sağlamaz. App private key yalnız main-only environment'ta ve
en dar repo erişimiyle; validator/source branch job'ına verilmez.

Yeni attempt başlamadan önce aynı H üzerindeki önceki yeşilin yeniden kullanımı
önlenir: App yeni queued/in_progress verdict üretir; superseded run success yazamaz.
Main/source event'leri eski subject'leri geçersizleştirir, writer son API kontrolünü
tekrarlar. GitHub iki farklı M/C ref'ini tek atomik CAS ile kilitlemez; source
olayının teslimi ile merge arasında sıfır yarış penceresi garanti edilmez. Queue,
son-C kontrolü, strict main ve en son edit'e eventual ulaşma ayrıca gerçek test ister.

H/M/C değişiminde eski Check Run kullanılmaz. Main güncellenince açık PR'lar yeniden
queue edilir; strict kontrolü yeterli tetikleme/yeniden test kurgusu olmadan kurmak
PR'ları beklemede bırakabilir. GITHUB_TOKEN PR/push tetikleme ve bot PR approval
sınırları gerçek entegrasyonda denenir. Bu tur merge/PR/run/credential yoktur.

PR merge SHA'sı H'den farklı olabilir (merge/squash/rebase). Kanıt zinciri
source C → normalized/tested H/tree → merged main M2/tree → deployment M2'dir;
aynı tree/güncel base ve izinli değişiklikler doğrulanır. H=M2 gibi yanlış SHA
varsayımı yapılmaz. Cloudflare bu aşamada bağlı değildir.

## 7. Actions UI ve ayar etkileri

Settings → Actions → General ekranındaki mevcut read default ve PR creation/approval
false korunur. allow_actions=all ve sha_pinning_required=false şu an gözlendi.
Implementation diff'inde full-SHA actions allowlist'i hazır olduğunda ayrı onayla
selected allowlist + full-SHA enforcement önerilir; Allow all veya değiştirilmiş
PR YAML'i güvenlik sınırı sayılamaz. Henüz tam action pinleri yokken seçili ayar
kaydedilip bootstrap yanlışlıkla kilitlenmez. Bu tur hiçbir Actions ayarı değişmez.
Repo General → Pull Requests auto-merge ayarı ileride writer kurulurken ayrıca
incelenir/onaylanır; read-only CI bunun açıldığı anlamına gelmez.

## 8. Tamamlanmamış parçalar ve durma şartı

Mevcut Git/candidate/typed proof helper'ları CI API observer/Check Run attester,
review ledger, sandbox, gerçek App veya atomik remote promotion değildir. Bunlar
bu planla var olmuş sayılmaz. Run identity/job verdict'in bağımsız doğrulanması,
exact SHA event/race ve teknik review yolu uygulanıp negatif test edilmelidir.

Bozuk JSON, yanlış kategori, corrupt image, unapproved verified, deletion/rename,
code-as-content, merge conflict, stale main/source ve forged check yerel testlere
sahiptir; GitHub enforcement kanıtı ancak gerçek izinli testlerden çıkar. Bir kapı
kanıtlanmazsa writer/auto-merge/CMS açılmaz. Token/App veya required check desteği
sınırlı diye korumalar gevşetilmez; yerel sonuçlar/diagnostics ile durulur ve eksik
entegrasyon açıkça raporlanır. Sonraki faza kendiliğinden geçilmez.

## Resmî kaynaklar

- [Workflow/token ayarları](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)
- [Untrusted checkout ve Actions güvenliği](https://docs.github.com/en/actions/reference/security/secure-use)
- [Event ve workflow_run güven sınırı](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Expected App ve skipped/neutral semantics](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Public environment sınırları](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
