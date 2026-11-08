# Faz 4.2-E2 — Yerel trusted CI uygulaması

8 Kasım 2026. Teknik branch: `chore/trusted-ci-bootstrap`. Bu belge yerel uygulamayı
anlatır; [TRUSTED_CI_PLAN](TRUSTED_CI_PLAN.md) önceki tasarımı korur. Uzak workflow,
required check, attester, PR writer, CMS veya deployment kurulmuş değildir.

## Dosyalar ve yürütme

| Kaynak                                                  | Görev                                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `.github/workflows/pr-diagnostics.yml`                  | PR yardımcı diagnostics; authority değildir                               |
| `.github/workflows/trusted-candidate.yml`               | main koduyla read-only observer ve data-only doğrulama                    |
| `scripts/ci/observe-pr.mjs`                             | Güvenilir TypeScript observer giriş noktası                               |
| `scripts/ci/run-content-validation.mjs`                 | İçerik/teknik sandbox giriş noktası                                       |
| `scripts/ci/launch.mjs`                                 | Mevcut media TS derleme yapılandırmasıyla driver derleme                  |
| `src/ci/github.ts`                                      | Fixed repo GET API, M/C/H/run/workflow/policy gözlemi                     |
| `src/ci/git.ts`                                         | Credential'sız gerçek Git fetch, sınıflandırma ve güvenli blob export     |
| `src/ci/content.ts`                                     | Mevcut publishing candidate ve CMS adaptörüyle data-only hazırlık         |
| `src/ci/sandbox.ts`, `probe.ts`, `inside.ts`            | Docker sınırı, gerçek runtime probe ve sabit test reçetesi                |
| `scripts/ci/Dockerfile`, `provenance.json`              | M lockfile'ından imaj, doğrulanmış action SHA/image digest                |
| `scripts/test-ci-sandbox.mjs`                           | Ayrı geçici Git reposunda gerçek yerel Docker kabul fixture'ı             |
| `scripts/pages-config.mjs`, `validate-pages-config.mjs` | Canonical JSON alan sırasından bağımsız, değerleri strict config eşitliği |
| `src/ci/*.test.ts`                                      | API taklitleri, gerçek Git negatifleri ve workflow/sandbox sözleşmeleri   |

Yeni npm paketi yoktur. Root package/lockfile ve strict ayarları değişmez.
`tsconfig.media.json` CI girişini mevcut araç derlemesine ekler. Vitest dosyaları
küçük CPU bütçesinde sırayla çalışır; assertion'lar korunur; Git/görsel integration fixture'ları için 5 saniyelik varsayılan
yerine 15 saniyelik sınırlı test bütçesi kullanılır.

## Kimlik ve veri sınırı

Repo ID `1439737232`, owner ID `219654036`, Public/default main ve ruleset
`26805718` sabittir. API controller mevcut main **M**, kaynak branch **C**, PR head
**H** ve workflow/run ID/attempt/path/event ilişkisini okur. V1 aynı repo PR'larıyla
sınırlıdır; C=H gerektirir. Kullanıcı input'u yalnız PR numarasını seçer; SHA kanıtı
olmaz. Redirect, API hata/sayfalama, eksik kimlik ve main drift kapıyı kapatır.

Git fetch token kullanmaz; API gözlemindeki ref'leri ayrı bare repoya indirir,
SHA'ları tekrar karşılaştırır. Tek gerçek ortak ata **B**, Git blob/mode/byte ve
izinli A/M değişiklikleri mevcut publishing gate ile denetlenir. Kod, workflow,
package/env, silme/rename ve kimlik yükseltmesi data-only akışa alınmaz. Technical
PR ayrı sandbox tanılamasına gider. JSON, kategori referansı, medya decode ve
üç yönlü canonical merge mevcut CMS/publishing katmanında yapılır. Kaynak raw
veriye fallback veya yerinde dönüştürme yoktur. Bootstrap policy şekli değişirse
gate de durur; required-check geçişi beklenen policy sürümüyle birlikte ele alınır.

Test sonrasında API M/C/H yeniden okunur; değişim eski sonucu geçersiz kılar.
Canonical candidate veri fingerprint'i üretir; **candidate commit oluşturmaz**.
PR head, normalize edilmiş veri ve gelecekteki merge commit'i aynı kabul edilmez.
Birleştirme öncesi exact candidate commit/tree ve yarış kontrolü sonraki iştir.

## Job izinleri ve Docker

Workflow root permissions `{}`; diagnostics job yalnız contents/read ve
pull-requests/read; controller job'ları ayrıca actions/read ister. Checks/write,
contents/write, pull-requests/write, id-token, deployment veya özel App tokenı yok.
Mevcut read-only GITHUB_TOKEN yalnız host observer'da kullanılır. Checkout
persist-credentials:false; action'lar doğrulanmış tam SHA, Node sürümü sabittir.
Setup-node otomatik package-manager-cache dahil cache açıkça kapalıdır.
Host workflow Node 24.22.2 seçer; pinlenmiş Playwright imajında ölçülen Node
26.13.0 kullanılır (engine aralığı ikisini de kapsar); yerel host 20.20.0
sonuçları ayrı raporlanır. İmaj digest'i ve sürüm gözlemi provenance.json içindedir.

Sandbox imajı **M** ağacından ve onaylı M lockfile'ından hazırlanır; H script'i
hostta çalışmaz. Build ortamında da credential yoktur. Runtime non-root UID1000,
network:none, read-only root ve tek read-only Git mount, cap-drop ALL,
no-new-privileges, default seccomp ve kaynak limitleri kullanır. Docker socket,
host kaynak klasörü, Actions komut dosyaları veya credential env mount edilmez.
Araç cache'leri için onaylı bağımlılıklar relative .bin bağlantıları korunarak
geçici tmpfs'e kopyalanır; kaynak imaj
ve host mount salt okunur kalır. Docker varsayılan tmpfs noexec olduğundan yalnız
/work alanı native Node test modülleri için exec kullanır; nosuid/nodev korunur,
/tmp noexec kalır. Bu durum /proc/mounts üzerinden runtime probe ile denetlenir. Yalnız oluşturulan container/tag temizlenir.

Runtime probe non-root, credential yokluğu, readonly yazma reddi, capability,
seccomp ve dış ağ reddini gerçekten sınar. Bu kontroller kernel açığına karşı
mutlak güvenlik veya hosted runner kabulü iddiası değildir. PR loglarının Actions
komutları olarak yorumlanması run/build boyunca rastgele stop-commands ile kapanır.
Teknik package/lock değişiklikleri v1'de reddedilir; ayrı dependency quarantine ve
teknik inceleme olmadan yeni bağımlılıklar çalıştırılmaz.

Sabit sandbox reçetesi: `npm run check`, `npm run test:e2e -- --workers=1 --retries=0`, CMS round-trip,
publishing export ve media export. Test/build dosyaları geçici alanda kalır. Playwright'ın host CPU sayısından türettiği
5 worker 512 PID sınırına takıldı (pids.events max=185, OOM=0). Tek worker ile
limitler artırılmadan aynı 51 senaryo çalıştırılır.

## Tetikler, spoofing ve attester sınırı

- `pull_request`: PR YAML'i değişebilir; ürettiği yeşil check güven kanıtı değildir.
- `workflow_run`: default-main controller gerçek diagnostics workflow ID/path ve
  PR/head ilişkisini GET ile çözer. Sinyalin success/failure/skipped/neutral sonucu
  doğrulamayı atlatmaz; artifact/log/cache alınmaz. Check adı eşitliği yeterli değildir.
- `workflow_dispatch`: input SHA kabul etmez; main run kimliği ve seçilen PR yeniden doğrulanır.
- `push/main`: current main değişince açık PR'lar yeniden gözlenir. V1 en fazla 10
  PR kabul eder; daha fazla/sayfalı listede kısmi başarı yerine durur.

Native job check'lerini platform oluşturabilir; araç Check Runs API'sine yazmaz.
Hiç PR yoksa validate job skipped olabilir. Bu sonuç authority değildir. App yokken
**authoritative:false / checkWritten:false / requiredCheck:false** döner. GitHub'ın
native Actions App kimliği farklı YAML'lerin aynı check adını üretmesini tek başına
engellemez; bu job/context'ler required check olarak eklenmemelidir. Bypass listesini
read-only token göremeyebilir; bu durum `bypassListVisible:false` olarak kaydedilir,
boş liste kanıtı sayılmaz. Yazma/merge katmanı yoktur, eksik kanıtla yayın yapılmaz.

## Bootstrap ve ayrı izin gereken sonraki adım

Uzak main ac62779'da bu driver'lar yoktur. İlk teknik PR, main'de driver yokken H'den
host script'i çalıştırarak kendini doğrulayamaz; fail-closed durur. Trusted workflow_run
ancak workflow default main'e alındıktan sonra etkin olabilir. İlk teknik diff ayrıca
incelenmeli, yerel kanıtları değerlendirilip ayrı push/PR/merge yetkisiyle bootstrap
edilmelidir. Bootstrap ruleset'i gevşetilmez; hayalî check zorunlu yapılmaz.

Sonraki açık izin: yalnız teknik branch push'u ve teknik PR açma. Merge, workflow
çalıştırma/Actions ayarları, attester App/izinleri ve required-check geçişi ayrıca
belirlenir. Sonrasında gerçek Ubuntu run ID/attempt, workflow SHA, kaynak H ve
App provenance görülür; attester yalnız başarılı ve eksiksiz sabit job setini exact
candidate SHA'ya bağlar. Failure/cancel/skipped/neutral/stale/yanlış workflow/check
negatifleri gerçek GitHub'da test edilmeden otomatik aktarım açılmaz. Content-edit,
CMS kurulumu, Ali Bey daveti ve Cloudflare kabulü daha sonraki ayrı aşamalardır.

## Resmî kaynaklar

[Actions güvenliği](https://docs.github.com/en/actions/reference/security/secure-use),
[workflow_run ve default branch tetikleri](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows),
[Public + Free ruleset kapsamı](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).
Pin kanıtları `scripts/ci/provenance.json`; yerel/uzak test ayrımı güncel kalite raporundadır.

## Bağımlılık audit kaydı

8 Kasım 2026 npm audit mevcut lockfile'da 8 moderate bulgu bildirdi; high/critical 0. Sekizi de dev:true lint zincirinde (@typescript-eslint, typescript-eslint,
eslint-config-next, minimatch); aynı minimatch DoS advisory'sinin transitif etkileri
ayrı paket sayımlarıdır. ESLint 9 için deprecated uyarısı da görüldü. Bu tur paket/lock
değişmedi; `npm audit fix --force` çalıştırılmadı. Kontrollü dependency teknik PR'ı
ayrı değerlendirilmelidir. Statik export bu development araçlarını yayınlamaz;
bu bilgi CI'daki bağımlılık riskinin yok olduğu anlamına gelmez.

## CMS config eşitliği düzeltmesi

Canonical JSON nesne anahtarlarını yeniden sıralar; bu, generator'ın fields
sırasını değiştirebilir. Eşitlik yalnız fields sunum sırasını ve nesne anahtar
sırasını önemsiz sayar. Alan adı/türü/etiketi/zorunluluğu ve seçeneklerin tüm
değerleri karşılaştırılır; upstream strict şema/hash kontrolü korunur. Nullable
phone/email/url alanları doldurulunca zorunlu hale gelmez; optionality sözleşmeden
gelir. .pages.yml ve 12 formun mevcut sunumu değişmedi.

Son ek optionality testi host toplamını 512'ye çıkardı. Tam Docker fixture'ı
511 testlik snapshot üzerinde çalışır; son saf metadata düzeltmesinin beş senaryosu
aynı Linux Node 26 imajında ayrıca 5/5 geçti. Bu ayrım gerçek GitHub run kanıtı değildir.
Chrome stable kurulumu test imajı hazırlanırken yapılır (ölçülen 157.0.8103.38);
base digest ve npm lock pinlidir fakat browser kurulumu tam hermetik değildir.
