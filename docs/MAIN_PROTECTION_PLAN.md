# Faz 4.2-d — Main koruması yapılandırma planı

7 Kasım 2026. **Yalnız yerel plan; hiçbir ruleset veya workflow kurulmadı.** Kullanıcı
önce tam değişiklik listesini istedi. Uygulanabilir başlangıç payload'u
[main-bootstrap.ruleset.json](github/main-bootstrap.ruleset.json), CI güven sınırı
[TRUSTED_CI_PLAN](TRUSTED_CI_PLAN.md), gerçek kabul [CMS_ACCEPTANCE](CMS_ACCEPTANCE.md).

## Faz 4.2-E1 — Kullanıcının kurduğu gerçek bootstrap doğrulandı

8 Kasım 2026 GET: ruleset **26805718** main-bootstrap Active; exact main, bypass=[],
mevcut admin current_user_can_bypass=never. Effective main'de deletion,
non_fast_forward ve pull_request(approvals=0); branch protected=true. Local/remote
SHA ac62779 aynı. Required check/workflow yok. Stale-review false taslaktan farklı
ve WARNING; değiştirilmedi. Bu güncel kayıt eski korunmuyor ifadelerinden önceliklidir.
[Gerçek doğrulama/E2 planı](MAIN_BOOTSTRAP_VERIFICATION.md). Salt okuma dışında
uzak işlem veya E2 implementasyonu yapılmadı.

## 1. Doğrulanan mevcut durum

| Alan                            | Salt okunur kanıt                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| Yerel / uzak main               | ac62779e3a5a8ad0de76dd4c040c32387bd1c474; eşit                                         |
| Repo / görünürlük               | sametbuluto/balkuruyemis; Public                                                       |
| Yetkili kullanıcı               | sametbuluto; mevcut Git credential yalnız GET için kullanıldı                          |
| Repo yetkileri                  | API permissions.admin/maintain/push/triage/pull=true                                   |
| Hesap planı                     | /user.plan.name=pro; ücret/fatura veya otomatik plan değişikliği kanıtı değildir       |
| Ürün kararı                     | Public + Free özellikleriyle tasarım; Pro/Team özelliğine veya satın almaya dayanılmaz |
| Main koruması                   | protected=false; classic protection 404 Branch not protected                           |
| Rulesets / effective main rules | 200; ikisi de boş liste                                                                |
| Workflow / deployment           | Workflow 0, deployment kaydı 0                                                         |
| Actions genel servisi           | enabled=true, allowed_actions=all, sha_pinning_required=false                          |
| GITHUB_TOKEN default            | read; can_approve_pull_request_reviews=false                                           |

Repo sayısal ID **1439737232**, owner ID **219654036**; gelecekteki controller
repo/actor adlarını tek başına güvenlik kimliği saymaz. allow_auto_merge=false
gözlendi; bu tur açılmadı, sonraki writer kurulumu ayrı yetki ister.

Hesabın API planı önceki Free varsayımından farklıdır; herhangi bir ödeme/upgrade/
downgrade yapılmadı. Public Free'nin resmî olarak desteklediği özellikler seçilir.
Mevcut hesabın admin rolü doğrulandı; credential ile Administration:write işlemi
çağrılarak denenmedi. UI/POST yetkisi için gerekirse hesap sahibi işlem yapar.
Token değeri okunabilir çıktıya veya projeye kaydedilmedi; yeni token/App yok.

## 2. Önerilen kesin başlangıç ayarları

Repo **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.
Bu UI yoluna gitmek bu tur Create/Save yetkisi değildir.

| UI alanı / kural                                        | Önerilen değer                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| Ruleset Name                                            | main-bootstrap                                                  |
| Enforcement status                                      | Active                                                          |
| Bypass list                                             | Boş; admin, kullanıcı, rol, deploy key veya GitHub App eklenmez |
| Target branches → Include by pattern                    | main; API tam ref refs/heads/main                               |
| Exclude                                                 | Yok                                                             |
| Restrict deletions                                      | Açık                                                            |
| Block force pushes                                      | Açık                                                            |
| Require a pull request before merging                   | Açık                                                            |
| Required approvals                                      | 0; Require approvals kapalı                                     |
| Dismiss stale pull request approvals                    | Açık; teknik akış ayrıca tam SHA bağlar                         |
| Require review from Code Owners                         | Kapalı                                                          |
| Require approval of most recent push                    | Kapalı                                                          |
| Require conversation resolution                         | Kapalı; her içerik için insan bağımlılığı eklenmez              |
| Require status checks                                   | **Bu aşamada kapalı; context yok**                              |
| Restrict creations / Restrict updates                   | Kapalı                                                          |
| Linear history / signatures / deployments / merge queue | Bu payload'da eklenmez                                          |
| Enterprise required workflows / paid push rulesets      | Kullanılmaz                                                     |

`Restrict updates`, bypass'sız yapılandırmada normal PR merge'ini de kilitleyebilir;
doğrudan push'u PR kuralı engeller. Başlangıç JSON'unda yalnız pull_request,
non_fast_forward ve deletion kuralları vardır. Evaluate Free için seçilmez. Classic
protection ile ikinci örtüşen politika eklenmez; mevcut kurallar değişirse önce farkı
incelenir. Payload GitHub'a gönderilmedi, server tarafında kabul edilmiş sayılmaz.

Boş bypass listesi etkin ruleset'in admin/App yazmalarına da uygulanması hedefidir.
Hesap sahibinin daha sonra ayar değiştirme yetkisini elinden aldığı iddia edilmez.
Bu güven kökü CMS editör yetkisinden ayrıdır.

## 3. Başlangıç ve tam CI koruması

Başlangıç koruması PR olmadan main güncellemesini, force push'u ve silmeyi durdurur.
**İçeriğin doğru veya güvenli olduğunu doğrulamaz.** Zero approvals + henüz required
check yokken yazma yetkili biri PR merge edebilir. Bu pencerede CMS/bot/Cloudflare
bağlanmaz; teknik sorumlu bootstrap PR'larını inceleyerek ilerler.

Tam CI aşaması ayrıca gerçek, güvenilir bir Check Run; exact aday SHA; beklenen App;
strict up-to-date; teknik inceleme politikası ve korunan attester gerektirir. PR
kuralı tek başına bu garanti değildir. UI readonly/hidden veya CODEOWNERS yetki
sınırı değildir. İçerik yayınında global insan approval zorunluluğu eklenmez.

## 4. Onaylı uygulama sırası — bu tur yapılmadı

1. Tam başlangıç JSON'u ve hedef main için **ayrı açık ruleset onayı** alınır.
2. Yerel/uzak SHA, owner/repo ID ve effective rules yeniden GET ile karşılaştırılır.
   Beklenmeyen kural/branch/plan değişiminde durulur; mevcut politika overwrite edilmez.
3. Yetkili hesap başlangıç ruleset'ini oluşturur. API için Administration:write
   gerekir; yalnız bu yönetim işlemi, CI validator'ın yetkisi değildir.
4. Oluşan ruleset ID/GET payload'u ve effective main rules kaydedilir. Active,
   tam hedef, üç kural, bypass=[] ve zero approvals karşılaştırılır.
5. CI dosyaları ve tam diff ayrıca incelenir; yeni teknik branch/commit/push/PR ve
   workflow çalıştırma için **ayrı açık yetki** alınır. Önceki tek ilk-push yetkisi
   kullanılamaz. Required check yokken bootstrap teknik PR'ı insan incelemesiyle
   merge edilir; bu aşamada tam otomatik güvenli içerik kabulü yapılmaz.
6. Trusted workflow main'de oluştuktan sonra güvenli PR/candidate ve negatif testler
   çalışır. Gerçek check adı ve App ID görülür; geçiş ayrı onaylanır.
7. Ancak o zaman required_status_checks eklenir. Önerilen ortak context
   bal/trusted-validation; **öneridir, mevcut check değildir**. Gerçek üretilen ad
   farklıysa rapor ve sözleşme eşleştirilmeden ruleset kaydedilmez.
8. Required check parameters: strict_required_status_checks_policy=true;
   required_status_checks içindeki context gerçek ad, integration_id gerçek
   doğrulanmış App ID; do_not_enforce_on_create=false. Hayalî ID, Any source veya
   boş check listesiyle tam koruma ilan edilmez. Bu ek payload henüz oluşturulmadı.
9. Kontrol/PR/strict/App ve drift/conflict reddi kanıtlanmadan content-edit yazarı,
   CMS App/davet veya Cloudflare kurulmaz. Sonraki otomasyon ayrıca yetkilendirilir.

## 5. Güvenli doğrulama protokolü

Bu görevde **yalnız mevcut durum GET'leri** yapıldı. Yıkıcı test veya uzak test ref'i
oluşturulmadı. Ruleset JSON parse/yerel sözleşme kontrolü GitHub enforcement değildir.

| Senaryo                           | Onay sonrasında güvenli kanıt yöntemi                                                             | Bu tur                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------ |
| Main PR/force/delete kuralları    | GET ruleset + GET rules/branches/main; hedef/bypass/active karşılaştırması                        | Şu an kural yokluğu doğrulandı |
| Main'e doğrudan push reddi        | Main'e farklı commit gönderilmez; API yapılandırması ayrı kanıt olarak tutulur                    | Gerçek ret denenmedi           |
| Force / deletion reddi            | Main üzerinde hiç denenmez; ayrı onaylı disposable canary ref/ruleset aynı kurallarla sınanabilir | PENDING                        |
| Admin bypass                      | Canary üzerinde admin kimliğiyle reddin gözlemi; main config bypass=[]                            | PENDING                        |
| App bypass                        | Gerçek App kurulumu sonrası dar canary testi; hidden bayrağı yeterli değil                        | PENDING; App yok               |
| Başarısız check merge'i durdurur  | Aynı politikaya sahip onaylı canary PR'da failure ve mergeable state; main'e merge denemesi yok   | PENDING                        |
| Yanlış App/context/SHA            | Canary check spoof denemeleri + API App ID/head_sha + blocked merge durumu                        | PENDING                        |
| Skipped/neutral                   | Güvenilir attester hiç success üretmemeli; kendi failure sonucuyla blocked PR                     | PENDING                        |
| Kod/workflow/env content değişimi | Gerçek yerel Git ingress negatif testleri; sonra trusted CI'da aynısı                             | Yalnız yerel kanıt             |
| JSON/image/category/merge/drift   | Mevcut unit/izole script'ler ve sonrasında gerçek trusted CI                                      | Yerel/uzak sonuçlar ayrılır    |

Canary'deki gerçek reddi **main'de gerçekleşmiş bir push reddi** gibi raporlamayız.
Main'e up-to-date/no-op push veya git push --dry-run, sunucu enforcement ret testi
sayılmaz. GitHub effective rules API yalnız Active kuralları gösterir; classic
protection ayrıca okunur. Endpoint 404/403 veya gözlem yetersizliği PASS değildir.
Ruleset uygulanmadan bu senaryoları gerçek server ret diye kanıtlamak mümkün değildir.

Her gelecekteki testte actor/App, hedef ref, policy ID, PR/check/run URL'leri, exact
M/C/H, önce/sonra ref ve API yanıtı kaydedilir. Beklenmeyen başarı/eksik kuralda
otomatik aktarım kapanır; force/delete/main reset denenmez. CI bozuldu diye gate
kaldırılmaz; teknik düzeltme PR'ı veya ayrıca açıkça onaylı kurtarma planı gerekir.

## 6. Gereken sonraki açık izinler

- Başlangıç main-bootstrap ruleset'inin tam JSON ile oluşturulması.
- Ayrı teknik branch/commit/push/PR, önerilen CI dosyalarının main'e alınması ve çalışması.
- Canary ref/ruleset/PR ve gerekiyorsa Check Run testleri; main force/delete testi yok.
- Dar attester App/environment/credential kurulumu ve sonrasında gerçek required
  check + App + strict geçişi. Bu fazda App/token/secret oluşturulmaz.
- Daha sonra ayrı content-edit/auto-merge, Pages CMS/davet ve deployment yetkileri.

Şu an tüm uzak değişiklik yetkileri kapalıdır. Plan yerelde uncommitted kalır;
yeni commit/push veya Faz 4.2-e başlatılmaz.

## Resmî kaynaklar

- [Public Free ve ruleset kapsamı](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Ruleset UI oluşturma](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Rules API alanları ve effective rules](https://docs.github.com/en/rest/repos/rules)
- [Native status check davranışı ve expected App](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
