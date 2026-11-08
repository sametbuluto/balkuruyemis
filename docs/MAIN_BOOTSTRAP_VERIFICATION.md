# Faz 4.2-E1 — Gerçek main-bootstrap ruleset doğrulaması

8 Kasım 2026. **GitHub GET ve ls-remote ile salt okunur inceleme.** Ajan ruleset'i
oluşturmadı/değiştirmedi; ürün sahibinin yaptığı kurulumu doğruladı. Uzak test
push'u, force/delete, teknik PR veya workflow çalıştırılmadı.

## PASS — Başlangıç koruması doğrulandı

| Alan                                                  | Gerçek API gözlemi                                  |
| ----------------------------------------------------- | --------------------------------------------------- |
| Ruleset                                               | main-bootstrap                                      |
| Ruleset ID                                            | **26805718**                                        |
| Kaynak                                                | Repository; sametbuluto/balkuruyemis                |
| Target / enforcement                                  | branch / **active**                                 |
| Include / exclude                                     | **refs/heads/main** / boş                           |
| Bypass actors                                         | **[]**; alan authenticated detail yanıtında görüldü |
| Mevcut admin bypass                                   | **current_user_can_bypass=never**                   |
| Main protected                                        | **true**                                            |
| Etkin main kuralları                                  | **deletion, non_fast_forward, pull_request**        |
| Etkin kuralların kaynağı                              | Üçünde de ruleset_id=26805718                       |
| Required approvals                                    | **0**                                               |
| Required reviewers / Code Owners / last push approval | [] / false / false                                  |
| Conversation resolution                               | false                                               |
| Required status checks                                | Yok; bu aşamada bilinçli olarak kapalı              |
| Restrict updates / creations                          | Yok; bilinçli olarak kapalı                         |
| Diğer ruleset                                         | Liste içinde başka ruleset görülmedi                |
| Workflow / deployment kayıtları                       | **0 / 0**                                           |

[Gerçek ruleset](https://github.com/sametbuluto/balkuruyemis/rules/26805718).

Yerel ve uzak main SHA birebir aynı:

```text
ac62779e3a5a8ad0de76dd4c040c32387bd1c474
```

ls-remote yalnız main ve HEAD→main gösterdi; yeni dal/tag veya commit yok. Repo
Public. Mevcut Git kimliği sadece GET için kullanıldı; değeri kaydedilmedi ve yeni
token/App oluşturulmadı. API detail ve effective rules yanıtları karşılaştırıldı;
yalnız kullanıcının bildirdiği ayarlara veya yerel JSON taslağına dayanılmadı.

## WARNING — Taslak farkları ve ilave varsayılanlar

| Alan                                            | Önceki taslak / gerçek değer             | Değerlendirme                                                                                                                                            |
| ----------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dismiss_stale_reviews_on_push                   | true / **false**                         | Taslakla fark var; approvals=0 olduğundan başlangıç hedefini bozmaz. Teknik onay ileride exact SHA'ya bağlanmalı; eski review temizliğine güvenilmemeli. |
| require_extra_approval_for_unattributed_changes | Taslakta yok / **true**                  | Dokümana göre nonzero approval count koşulunda ek onay anlamı taşır; şu an count=0. İleride approval kuralı değişirse yeniden değerlendirilir.           |
| allowed_merge_methods                           | Taslakta yok / **merge, squash, rebase** | API'de ilave varsayılan; kullanıcı hedefiyle çelişmez. Test edilen aday ve merge commit'i farklı SHA olabilir; tree/kanıt zinciri gerekir.               |
| required_reviewers                              | Taslakta yok / **[]**                    | İlave insan reviewer zorunluluğu yok.                                                                                                                    |

Bu farklar otomatik düzeltilmedi. Önceki docs/github/main-bootstrap.ruleset.json
**öneri/taslak** olarak korunur; gerçek durumun kaydı bu belgedir. Eski JSON'u
aynen güncellemek stale-review değerini değiştirebilir; ayrı onay olmadan uygulanmaz.
Çekirdek kullanıcı gereksiniminde eksik kural veya beklenmeyen zorunlu CI/review yok.

Classic /branches/main/protection endpoint'i 404 Branch not protected döndürdü.
Bu, ruleset korumasının yokluğu şeklinde yorumlanmadı: branch protected=true,
aktif ruleset detail ve /rules/branches/main üç kuralı doğruluyor. Classic branch
protection ile ruleset API'leri ayrı kayıtlardır.

## Başlangıç korumasının sınırı

Bu yapı PR olmadan main güncellemesini, force push'u ve silmeyi engelleyecek şekilde
aktif yapılandırılmıştır; admin için bypass hakkı yoktur. **Gerçek reddi görmek için
main'e yazma denemesi yapılmadı.** Yapılandırma kanıtı canlı negatif test kanıtı
olarak sunulmaz. Gelecekte ayrıca izinli canary testleri main testi diye raporlanmaz.

PR mevcut olmak kaydıyla sıfır approval ve sıfır required check, içerik güvenliği
sağlamaz: yazma/merge yetkili aktör başarısız testli veya bozuk içerikli PR'ı bu
bootstrap kurallarıyla merge edebilir. JSON/media/category/kimlik doğrulaması henüz
required GitHub gate değildir. Hesap admininin kuralları sonradan değiştirme yetkisi
ortadan kalkmaz; bu yetki CMS editörüne verilmez. CMS/otomatik writer/Cloudflare
bu aşamada bağlanmaz. Var olmayan check context'i eklenmez.

## Faz 4.2-E2 — Uygulanabilir CI geliştirme planı

Bu liste **yapılacak işlerdir**. E2 implementasyonu ve uzak işlemler için ayrıca
açık izin gerekir. Ayrıntılı güven sınırları [TRUSTED_CI_PLAN](TRUSTED_CI_PLAN.md).

1. **Baseline ve yerel kayıt:** Main SHA, ruleset ID/ayarları ve yeni drift yeniden
   GET ile okunur. Mevcut 4.2-d/E1 belge değişiklikleri korunur. İzin sonrası ayrı
   teknik branch önerisi chore/trusted-ci-bootstrap; belgeler ve CI değişiklikleri
   anlaşılır commit'lere ayrılır. Korunan main'e doğrudan push yapılmaz.
2. **Yerel CI driver:** Mevcut publishing/content/media helper'larını kullanacak
   scripts/ci/observe-pr.mjs ve scripts/ci/run-content-validation.mjs önerilir.
   Repo ID 1439737232/base main ve API'den okunan tam M/C/H kimlikleri bağlanır.
   Caller SHA/log/artifact yetki sayılmaz. Bu dosyalar henüz oluşturulmadı.
3. **Workflow diff'i:** İlk iki dosya .github/workflows/pr-diagnostics.yml ve
   .github/workflows/trusted-candidate.yml. İlk dosya sırsız yardımcı PR testidir;
   kendi değiştirdiği workflow'un yeşili authoritative değildir. Trusted controller
   main'deki koddan workflow_run/main-ref dispatch/push-main ile çalışır. Sinyal
   yalnız uyandırmadır; untrusted script/paket/workflow privileged işte çalışmaz.
4. **Yetki/pin incelemesi:** Root permissions:{}; validator custom secret/environment
   almaz. Metadata işi yalnız gerekli contents/pull-requests/actions read. Cache
   ilk aşamada kapalı, persist-credentials:false. Linux/Node/Chrome ve kullanılan
   action'ların tam sürüm/SHA pinleri onaylanacak diff'te somutlaştırılır; sahte
   pin eklenmez. Kişisel mevcut Git credential'ı CI'ya taşınmaz.
5. **Güvenilir reçete:** M kodu ve onaylı M lockfile ile npm ci, npm run check,
   Chrome E2E ve mevcut schema/media/candidate export fixture'ları. Yalnız strict
   normalize içerik bind edilir. Teknik PR kodu ayrı credential'sız sandbox ve
   exact-SHA teknik inceleme ister; content-only otomasyona giremez. Koordinat,
   verified, draft ve kaynak gizliliği regresyonları sürer. Gerçek content-edit
   dalı veya CMS bağlantısı bu bootstrap için şart yapılmaz; izole fixture kullanılır.
6. **Teknik PR ve main bootstrap:** Yerel diff/check/pin/izin raporu incelenir;
   ancak ayrıca izin verildiğinde teknik branch push/PR ve workflow run yapılır.
   Başlangıçta required check bulunmadığından trusted workflow main'e teknik
   incelemeyle alınır. Bu dar bootstrap penceresinde CMS/writer açılmaz.
7. **Gerçek CI kanıtı:** Main workflow ID/path/SHA, PR head/base, run/attempt ve job
   sonuçları GitHub API'den doğrulanır. Bozuk JSON/image/ref, code-as-content,
   conflict ve stale SHA negatifleri gerçek izinli CI'da sınanır. Sadece yerel
   testten GitHub enforcement sonucu çıkarılmaz. Hata/eksik kimlikte durulur.
8. **Required check'e ayrı geçiş:** Sırsız CI'nın native yeşili tam güven kapısı
   değildir. Ortak önerilen bal/trusted-validation için güvenilir kaynak/ayrı dar
   attester ve gerçek App kimliği gerekebilir; App/token/environment oluşturmak
   **ayrı onay** ister. Gerçek check oluşmadan ruleset 26805718'e context eklenmez.
   Sonra ayrı onayla actual context + integration_id + strict güncellik eklenir;
   skipped/neutral veya eski run success sayılmaz. Source/default Actions App adı
   tek başına provenance değildir. Bootstrap'ın mevcut ayarları sessizce değiştirilmez.
9. **Ayrı sonraki kurulum:** Başarısız check'in merge'i engellemesi ve gerekli
   canary/provenance testleri kanıtlandıktan sonra ayrıca content-edit/auto-merge,
   Pages CMS App/davet ve en son Cloudflare izni. Ali Bey içerikte manuel teknik
   PR onayı beklemez; hiçbir terminal/JSON/piksel alanı doldurmaz.

Bu tur yeni workflow/script/branch/commit/PR/check/App veya deployment oluşturulmadı.
E2'ye kendiliğinden geçilmez. E2 için izin, CI dosyalarının yerelde hazırlanması ile
teknik branch/push/PR/run yetkilerini ayrı ve açık belirlemelidir.

## FAIL ve kanıt kapsamı

Çekirdek bootstrap ayarları/effective main kuralları/SHA eşitliğinde hata bulunmadı.
Stale-review farkı WARNING olarak korundu; gerçek push/delete/force/App ret testi
çalıştırılmadı. Mevcut local belgeler uncommitted; HEAD ve uygulama kaynakları aynı.
API raw kanıtları ve makine karşılaştırması /private/tmp/bal-phase42e1-20261108
altında. Anlamlı bu göreve özgü kontroller GET detail + effective rules + SHA ve
önceki taslak fark analizidir; uygulama test sonuçları varsa ayrı yerel QA kaydıdır.

[Effective rules API](https://docs.github.com/en/rest/repos/rules),
[required check semantics](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

Yerel proje kuralları gereği npm run check yeniden geçti: 426/426 Vitest (27 dosya),
strict/lint/Prettier, CMS config, 67 dosya export/3 HTTP. Chrome E2E 51/51, dört
genişlik regresyonları dahil. Bu app testleri ruleset'in sunucu ret testi değildir.
