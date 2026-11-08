# Faz 4.2-E2 — Yerel trusted CI kalite raporu

8 Kasım 2026. **Yerel E2 uygulaması tamamlandı; gerçek GitHub CI/attester kurulmadı.**
Kapsam: yerel teknik branch, workflow/driver ve commit; uzak işlem yok.
[Teknik uygulama](TRUSTED_CI_IMPLEMENTATION.md), [plan §26](../plan.md).

## PASS

- İki workflow, GET observer, gerçek Git data-only gate ve Docker validator hazır.
- main/origin main ac62779e3a5a8ad0de76dd4c040c32387bd1c474; Public repo ve active
  main-bootstrap 26805718 birebir aynı; bypass=[]; workflow/deployment 0.
- 164 korunan kaynak baseline ile byte eşit; dört koordinat aynı. İki eski test,
  CMS metinlerini sabit literal yerine yayınlanan JSON üzerinden denetler; silinmedi.
- Actions pinleri tam SHA, base image digest; cache kapalı, persist-credentials:false.
  Host token read-only; sandbox token/ağ/host yazma erişimi almaz.

| Yerel kontrol               | Sonuç                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| npm run check               | PASS: strict TS, lint, Prettier, CMS config ve build/HTTP                                                         |
| Vitest                      | **512/512**, 31 dosya; önceki 426 ve 86 yeni CI testi                                                             |
| Production static export    | **67 dosya**, noindex true                                                                                        |
| Statik HTTP                 | **3/3**                                                                                                           |
| Chrome E2E                  | **51/51**, 320/393/768/1280 px                                                                                    |
| CMS kaynak round-trip       | PASS; ürün/metin/fotoğraf/kimlik ve responsive                                                                    |
| Publishing candidate export | **2/2**; Git B/M/C merge + conflict reddi                                                                         |
| Media export                | **5/5**; bozuk JSON/alt/görsel, sanitize/responsive ve drift                                                      |
| Publishing history audit    | PASS; kod commit'i sonrası 11 commit/419 blob; yasak yol/secret/raster/büyük dosya bulgusu 0                      |
| Gerçek yerel Docker         | PASS: tam reçete 511 Vitest + 51 Chrome + CMS config/build/HTTP + round-trip/candidate/media; GitHub run değildir |

API taklitleri ve gerçek yerel Git testleri: yanlış repo/owner/SHA, stale source/main,
workflow ID/path spoofing, eksik kimlik, teknik kod/workflow/env'nin içerik sayılması,
bozuk JSON/kategori ref/medya ve merge conflict reddi. Skipped/neutral sinyal sonucu
kanıt sayılmaz. Bunlar gerçek GitHub enforcement veya Check Run attester testi değildir.

## WARNING

- Native check'ler **authoritative:false**; attester, required check, candidate commit,
  PR writer ve otomatik merge yoktur. İlk PR için M'de driver yoksa H fallback yapılmaz;
  ayrı teknik incelemeli bootstrap gerekir. İlk sürüm fork ve package/lock değişimini reddeder.
- Docker Desktop ARM host üzerinde amd64 emülasyonu; gerçek Ubuntu Actions runtime,
  API GITHUB_TOKEN izinleri, workflow tetikleri, check provenance ve enforcement henüz denenmedi.
- İlk host koşularında 5 sn Git/decode timeout'u görüldü; dosya paralelliği kapatıldı,
  integration bütçesi 15 sn yapıldı. Assertion kapıları korunuyor, son host turu 512/512.
- Docker'da readonly cache, paket çözümleme yolu ve tmpfs noexec sorunları bulundu.
  Onaylı dependency'ler geçici /work/node_modules'a kopyalandı; yalnız /work exec,
  nosuid/nodev, readonly root/host ve ağsız non-root sınırı korunur. Relative .bin bağlantıları korundu; duplicate Vitest/Chai durumu giderildi.
  Canonical JSON alan sırası config eşitliğinde anlamdan ayrıldı; alan türü/etiketi/required
  değişiklikleri reddedilir. 5-worker Chrome 512 PID sınırına takıldı (max=185, OOM=0);
  tek worker, retries0 ile aynı 51 test geçti. PID/memory sınırı yükseltilmedi.
- Mevcut lockfile için npm audit: **8 moderate, 0 high/critical**; hepsi dev:true lint
  zincirinde minimatch DoS transitif etkisi. ESLint deprecated uyarısı da var.
  npm audit exit 1 ile bu bulguları bildirdi; paket/lock değiştirilmedi, force fix yapılmadı. Ayrı dependency teknik işi önerilir.
- Hosted CMS, App, Ali Bey kabulü, Cloudflare, Safari/Firefox ve fiziksel cihaz testi yok.

## FAIL

Son host ve gerçek Docker doğrulama reçetelerinde açık başarısız test yok. Önceki
başarısız koşular loglarda korunur; npm audit bulguları WARNING altında raporlandı.

## Git, kanıt ve sonraki izin

Branch chore/trusted-ci-bootstrap; main değişmedi. D/E1 belgeleri ayrı checkpoint
cd9c1c62b6576cabdf5d3b6cd5888fa9fbb06b26 ile korundu. E2 kod commit'i
**d4f5538da2fd8c1cf1e465b9e54d3a67ab9e1150**; belgeler ayrı
`docs: record trusted CI implementation and runtime evidence` commit'ine alınır. Push/PR/ayar/App/CMS/deployment yapılmadı.

Log ve preservation/API/pin/audit kanıtları /private/tmp/bal-phase42e2 altında.
Başarılı gerçek Docker fixture sonucu:
/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-ci-runtime-plNDxF/result.json.
Non-root, credential yokluğu, readonly host/imaj, cap-drop, seccomp ve ağ reddi
runtime probe ile geçti; fixture Git ref'leri değişmedi ve kendi container/tag
temizlendi. Bu, kernel güvenliği sertifikası veya GitHub enforcement kanıtı değildir.

Host toplamı 512; tam Docker snapshot'ı 511 test içerir. Eklenen son nullable CMS
metadata testiyle aynı helper Linux Node26 üzerinde ayrıca 5/5 doğrulandı
(config-node26.log). Workflow host Node24.22.2, container Node26.13.0, yerel
host Node20.20.0 ayrı tutulur. Alan doldurulunca optionality değişmez; .pages
formları aynı kalır. Bu saf metadata düzeltmesi sonrasında tüm host check yeniden geçti.
Tarama reachable Git blob'ları ve bilinen sır desenleriyle sınırlıdır; kapsamlı
sır denetimi veya uzak secret envanteri sayılmaz.
Chrome HTML raporu playwright-report içinde; generated/QA çıktıları Git dışı.
Yeni dosyalar TRUSTED_CI_IMPLEMENTATION tablosunda; mevcut teknik değişiklikler
media TS include, Vitest zamanlama, Hero/ana sayfa E2E içerik beklentileri ve
CMS config karşılaştırmasının canonical JSON sırasından bağımsızlığıdır.
.pages.yml/12 form alanı değişmedi; metadata değişimi negatif testleriyle reddedilir.
Görünüm, veri ve eski güvenlik katmanları değişmedi; yeni npm paketi yok.

Sonraki açık izin yalnız teknik branch push'u/PR içindir; merge/workflow run,
attester ve required check geçişi ayrıca belirlenir. E3'e kendiliğinden geçilmez.

---

## Tarihsel Faz 4.2-E1 raporu

# Faz 4.2-E1 — Main bootstrap gerçek API doğrulaması

8 Kasım 2026. **Salt okunur inceleme; ruleset kullanıcı tarafından kurulmuştu.**
[Gerçek alanlar ve E2 planı](MAIN_BOOTSTRAP_VERIFICATION.md), [plan §25](../plan.md).

## PASS

- Ruleset **26805718**, main-bootstrap, Active; exact refs/heads/main ve exclude=[].
- Authenticated detail bypass_actors=[]; mevcut admin current_user_can_bypass=never.
- main protected=true. Etkin deletion/non_fast_forward/pull_request kuralları aynı
  ruleset ID ile doğrulandı; required approvals=0, ekstra reviewer/codeowner/lastpush yok.
- Required status checks/restrict updates/creations bilinçli kapalı; başka kural yok.
- Yerel/uzak main **ac62779e3a5a8ad0de76dd4c040c32387bd1c474**, eşit.
- Uzak workflow/deployment 0. Mevcut 200 kaynak byte eşit; dört koordinat korundu.

## WARNING

- Taslak stale-review dismiss=true, gerçek **false**. Approvals=0 iken bootstrap
  hedefini bozmaz; değiştirilmedi. Teknik onay ileride exact SHA'ya bağlanmalıdır.
- require_extra_approval_for_unattributed_changes=true; nonzero approval count
  koşulunda değerlendirilir, şu an count=0. Merge/squash/rebase açık varsayılanları
  ve required_reviewers=[] de raporlandı.
- Classic protection API 404 döndürdü; bu, active ruleset/effective main kanıtını
  geçersiz kılmaz. İki koruma türü birbirine karıştırılmadı.
- Gerçek main push/force/delete veya App bypass reddi denenmedi. API gözlemi canlı
  negatif test değildir. Bootstrap required CI değildir; yetkili PR merge'ini
  içerik/doğrulama açısından henüz durdurmaz.
- Yeni ruleset/YAML/script/branch/commit/push/PR/run/App/CMS/deployment yok. E2 planı
  uygulanmadı, ayrı açık onay bekler. Yerel belgeler uncommitted kalır.

## Yerel doğrulama

| Bu tur yeniden çalıştırılan kontrol                      | Sonuç                                                                |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| Gerçek ruleset detail/effective main/SHA karşılaştırması | PASS; çekirdek fark yok, belirtilen WARNING alanları korundu         |
| npm run check                                            | PASS; strict TypeScript, ESLint, Prettier, Vitest, config/build/HTTP |
| Vitest                                                   | **426/426**, 27 dosya                                                |
| Pages CMS config                                         | PASS; .pages.yml aynı                                                |
| Production export / Static HTTP                          | **67 dosya**, noindex true / **3/3**                                 |
| Chrome Playwright                                        | **51/51**, 320/393/768/1280 regresyonları dahil                      |
| Kaynak koruma                                            | **200 dosya byte eşit**                                              |

Bu yerel QA sonuçları GitHub main push reddi/required CI kanıtı değildir. Yeni
WebKit/Firefox/fiziksel cihaz/axe, ayrı fixture export veya gerçek hosted CMS/
deployment testi çalıştırılmadı. API raw GET'ler, verification.json ve QA logları
/private/tmp/bal-phase42e1-20261108 altında. Önceki belgeler/taslak korundu; yeni
commit/push veya GitHub workflow/PR oluşturulmadı.

## FAIL

Çekirdek kullanıcı ayarı, effective main kuralları ve SHA eşitliğinde hata bulunmadı.
Kapsamda gerçek GitHub ret deneyi veya güvenilir CI kurulumu tamamlandı iddiası yok.

---

## Tarihsel Faz 4.2-d raporu

# Faz 4.2-d — Main koruması ve trusted CI yapılandırma planı

7 Kasım 2026. **Yalnız yerel plan; uzak değişiklik yapılmadı.**
[Exact ruleset/UI planı](MAIN_PROTECTION_PLAN.md), [trusted CI](TRUSTED_CI_PLAN.md),
[başlangıç JSON](github/main-bootstrap.ruleset.json), [plan §24](../plan.md).

## PASS

- Local/remote main **ac62779e3a5a8ad0de76dd4c040c32387bd1c474**, eşit; başlangıç temiz.
- Mevcut Git kimliğiyle sadece GET: login sametbuluto, repo admin rolü true.
- Public durum ve gerçek current main/rules/Actions ayarları okundu; main protected=false,
  classic protection 404 Branch not protected, effective rules/rulesets/workflows boş.
- Actions enabled=true, allowed_actions=all, sha_pinning_required=false; GITHUB_TOKEN
  default read, PR approval false. Hiçbir ayar değiştirilmedi.
- Free uyumlu exact başlangıç payload'u, UI yolları, gerçek check'e geçiş, LP job/App
  sınırları ve güvenli canary kabul planı yerelde hazırlandı. Aktif workflow yok.

## WARNING

- **API hesabın plan adını pro bildiriyor.** Bu ücret/fatura kanıtı değildir. Free
  hedefi korunur; hesap/plan değişikliği yapılmadı, Pro-only özellik kullanılmadı.
- Main henüz korunmuyor. Blueprint'in JSON kontrolü, gerçek GitHub kabul/enforcement
  veya direct push reddi kanıtı değildir. Required check/App/PR/run yoktur.
- PR-controlled workflow ve ortak Actions App kimliği tek başına güvenli check
  kaynağı değildir. Ayrı attester/provenance/sandbox/teknik sign-off uygulanıp gerçek
  test edilmeden tam otomasyon veya skipped/neutral sertleştirme tamamlandı denmez.
- Gerçek force/delete/main yazma, App bypass, başarısız-check merge engeli ve hosted
  CMS/Cloudflare testleri bu tur yapılmadı. Canary ayrıca izin ister.
- Tasarım .github dosyası oluşturmaz; yeni branch/commit/push/PR/run/App/token/secret,
  ruleset veya deployment yok. Yerel belgeler uncommitted kalır.

## Doğrulama

| Yerelde yeniden çalıştırılan kontrol | Sonuç                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| npm run check                        | PASS; strict, lint, Prettier, test/config, build/HTTP                              |
| Vitest                               | **426/426**, 27 dosya; mevcut negatif Git/schema/media/conflict/SHA testleri dahil |
| CMS config                           | PASS; mevcut .pages.yml aynı                                                       |
| Production export / Static HTTP      | **67 dosya**, noindex true / **3/3**                                               |
| Chrome Playwright                    | **51/51**; 320/393/768/1280 regresyonları                                          |
| Yerel ruleset taslağı                | JSON parse + hedef/boş bypass/PR/zero-approval/force-delete invariant'ları PASS    |
| Kaynak koruma                        | **200 dosya byte eşit**; gerçek workflow dosyası yok                               |

JSON taslağı GitHub server schema/enforcement testi değildir. Yerel typed proof
ve data gate testleri yeni önerilen ortak CI/check/sandbox'un uygulandığını kanıtlamaz.
Bağımsız fixture export script'leri, yeni axe/WebKit/Firefox/fiziksel cihaz/hosted
CMS veya gerçek yıkıcı GitHub testi bu tur çalıştırılmadı.

## FAIL

Son yerel kontrollerde başarısız test veya açık uygulama hatası yok. Uzak koruma
henüz uygulanmadı; bu bir PASS enforcement raporu değildir. Beklenmeyen uzak
değişimde veya eksik gerçek güven kapısında işlem durur. Eksik kapı için güvenlik gevşetilmez.
Kanıt GET JSON'ları/snapshot ve loglar /private/tmp/bal-phase42d altında. Mevcut
credential değeri hiçbir çıktıya/proje dosyasına kaydedilmedi; yeni credential yok.

---

## Tarihsel Faz 4.2-b raporu

# Faz 4.2-b — Dış servisler tamamlandı; ilk push adayı son kontrol

7 Kasım 2026. Ürün sahibi Webhooks boş, Railway/Vercel Apps kaldırıldı ve Cloudflare
No projects found bilgisini doğruladı. Bunlar **kullanıcı UI doğrulaması**; ajanın
yetkili dış servis API denetimi değildir. Son anonim repo/ref sorgusu Public/boş.
[Güncel kontrol/komut planı](PUSH_PREFLIGHT.md), [plan §22.9](../plan.md).

```text
PUSH_READY = YES (teknik hazırlık; gönderim izni değil)
DEPLOYMENT_TRIGGER = NONE (kullanıcı UI doğrulaması)
REMOTE_MAIN = EMPTY (yeniden anonim okuma)
PUSH_AUTHORIZED = NO
```

## PASS

- Başlangıç main/aa1ea3e; yalnız bekleyen belgeler. Kullanıcının PUSH_PREFLIGHT
  içindeki görev metni korunup altına güncel plan eklendi; kaynak snapshot alındı.
- Uzak hedef sametbuluto/balkuruyemis, Public; anonim ls-remote exit 0 ve ref'ler boş.
- Uygulama/JSON/.pages/config/test/paket/lockfile ve tasarım değiştirilmedi.
- Başlangıç reachable audit 8 commit/365 blob: bilinen sır/yasak çıktı/raster/EXIF/
  büyük/atlanmış blob bulgusu 0. Yeni belge commit'i sonrası audit ayrıca çalışır;
  nihai SHA ve sayımlar teslim yanıtı/QA raporunda raporlanır.
- Yerel belge commit'i yetkilendirildi. Yeni commit aa1ea3e'nin çocuğu; reset/rebase yok.

## WARNING

Gerçek push izni **verilmedi**. PUSH_READY=YES teknik hazırlık koşullarının
başarılı olmasını belirtir; PUSH_AUTHORIZED=NO kalır. DEPLOYMENT_TRIGGER=NONE
kullanıcı doğrulamasına, REMOTE_MAIN=EMPTY anonim uzak okumaya dayanır. Commit/audit
ve temiz ağaç son kontrolde teyit edilir. Tam SHA teslim yanıtında paylaşılır.

Actual git push --dry-run/auth ve yazma yetkisi testi yapılmadı; yalnız güvenli
main-only hazırlığı incelendi. Origin eklenmedi, gerçek push yok. Uzak durum sonraki
izin anında yeniden kontrol edilir. Main koruması/checks/App/CMS/Cloudflare hâlâ
kurulmadı. Kaydet → otomatik güvenli yayın kabulü tamamlandı denmez.

## Doğrulama

| Bu görevde yeniden çalıştırılan kontrol | Sonuç                                                                 |
| --------------------------------------- | --------------------------------------------------------------------- |
| npm run check                           | PASS; strict TS, ESLint, Prettier, test/config, build ve HTTP         |
| Vitest                                  | **426/426**, 27 dosya                                                 |
| Resmî .pages.yml kontrolü               | PASS                                                                  |
| Static export / HTTP                    | **67 dosya**, noindex true / **3/3**                                  |
| Chrome Playwright                       | **51/51**; 320/393/768/1280 regresyonları dahil                       |
| Korunan kaynaklar                       | **200 dosya byte eşit**, dört koordinat aynı                          |
| Kullanıcının PUSH_PREFLIGHT metni       | Byte prefix aynen korundu                                             |
| Dry-run planı                           | **bash -n PASS**, tek explicit main:main, sabit hedef; çalıştırılmadı |
| Yerel pre-push hook                     | Aktif pre-push veya custom hooksPath yok                              |
| Reachable geçmiş audit                  | Commit öncesi PASS; commit sonrası final ayrıca raporlanır            |

WebKit/Firefox/fiziksel cihaz/yeni axe/gerçek hosted CMS veya deployment testi yok.
Önceki izole candidate 2/2 bu görevde tekrar çalıştırılmadı; aşağıda tarihsel kaldı.

## FAIL

Son çalıştırılan kontrollerde hata veya beklenmeyen uzak ref bulunmadı. Yerel belge
commit'i sonrası temiz ağaç ve yeni geçmiş taraması teslim öncesi kontrol edilir;
bir hata olursa gerçek push yapılmadan durulur. Kanıt: /private/tmp/bal-firstpush-final-20261107/.

Başarılı yerel commit mesajı: `docs: finalize public GitHub first-push readiness`.
Tam SHA teslim yanıtı ve git log'da bulunur. Gerçek push/remote/dry-run/auth veya
harici kurulum yok; tam SHA için ayrıca açık kullanıcı onayı beklenir.

---

## Tarihsel Faz 4.2-b — Dış servisler beklenirken

# Faz 4.2-b — Public GitHub Free / ilk push öncesi son kontrol

7 Kasım 2026. Son onaylı SHA **aa1ea3ebf713cc0f4319582e51d4b85811d4cdf5**.
Hedef **https://github.com/sametbuluto/balkuruyemis**; Public + Free kesin karardır.
[Güvenli komutlar/UI adımları](PUSH_PREFLIGHT.md), [plan §22](../plan.md).

```text
PUSH_READY = BLOCKED
DEPLOYMENT_TRIGGER = UNKNOWN
REMOTE_MAIN = EMPTY
```

## Kullanıcı UI geri bildirimi — API gözleminden ayrı

Ürün sahibi son kontrolden sonra şu bilgileri verdi:

| Alan                             | Kullanıcının bildirdiği durum                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| GitHub Webhooks                  | Boş; kullanıcı UI üzerinden doğruladı                                                                       |
| Railway ve Vercel GitHub Apps    | İkisi de All repositories erişimine sahip                                                                   |
| Bal Kuruyemiş deployment projesi | Bu servislerde proje/tetikleyici varlığı doğrulanmadı                                                       |
| Erişim daraltma                  | Kullanıcı eski repolarla sınırlamayı ve balkuruyemis'i dışlamayı planlıyor; henüz tamamlandığı bildirilmedi |
| Cloudflare Pages                 | Henüz kontrol edilmedi                                                                                      |
| İlk push izni                    | Açıkça verilmedi                                                                                            |

All repositories erişimi, tek başına bir deployment projesinin varlığını kanıtlamaz.
Bu nedenle DEPLOYMENT_TRIGGER=UNKNOWN ve PUSH_READY=BLOCKED korunur. Kullanıcı
beyanı, ajanın yetkili API incelemesi veya tamamlanmış izin değişikliği gibi sunulmaz.
Sonraki eksik bilgi: Railway/Vercel kapsamından balkuruyemis'in gerçekten çıkarıldığı
ve Cloudflare/diğer yayın tetikleyicilerinin kontrol sonucu. Başka repolara veya App
ayarlarına ajan müdahale etmez; ilk push için yine ayrı açık onay gerekir.

## PASS

- Başlangıç main/aa1ea3e temiz, 8 commit/ataları aynı, remote yok. Yeni commit,
  geçmiş rewrite/reset veya origin değişikliği yapılmadı. fsck corruption bulmadı;
  eski dangling nesneler silinmedi ve normal main push'una dahil değildir.
- Anonim API: doğru hedef Public/size 0; ls-remote exit 0, refs boş. Branches/rulesets
  ve deployment listeleri boş; workflows total_count 0. Bunlar gözlenen uzak okumalardır.
- Reachable 8 commit / 365 blob; en büyük 307409 byte. Env/build/test çıktısı,
  bilinen sır deseni, raster/EXIF ve büyük/atlanmış blob bulgusu 0. Ek 365 blob
  UTF-8/NUL/yaygın binary imzası taramasında binary bulgusu 0; modlar 100644.
- .gitignore ile yetinilmedi. Bilinen desen taraması her parola/kişisel veriyi
  tespit garantisi değildir. Gerçek kişisel/EXIF fotoğraf gözlenmedi.
- Public Free bootstrap planı ve onay sonrası guard'lı main-only komutları hazır.
  Remote add, dry-run ve push komutları bu tur çalıştırılmadı.

| Kontrol                    | Sonuç                                                           |
| -------------------------- | --------------------------------------------------------------- |
| npm run check              | PASS; strict TS/lint/format/test/config/build/HTTP              |
| Vitest                     | **426/426**, 27 dosya; 363 eski + 63 publishing testi           |
| Resmî CMS config kontrolü  | PASS; mevcut .pages.yml değişmedi                               |
| Production static export   | **67 dosya**, noindex true                                      |
| Statik HTTP                | **3/3**                                                         |
| Playwright / sistem Chrome | **51/51**                                                       |
| Responsive                 | **320 / 393 / 768 / 1280 px**, mevcut regresyonlar              |
| İzole Git candidate export | **2/2**; normalizasyon/merge/build/HTTP/Chrome + conflict reddi |
| npm run publishing:audit   | PASS; mevcut gerçek script adı budur                            |

## WARNING

- Webhooks GET **401**, repo installation GET **401**; Apps envanteri okunamadı.
  gh/mevcut ortam token oturumu yok. Cloudflare hesabı/proje/Git bağlantısı da
  görülmedi. **Deployment tetikleyicisi yokluğu doğrulanamadı**, bu nedenle push BLOCKED.
- Boş deployment/workflow listesi dış App/webhook bağlantısının yokluğunu kanıtlamaz.
  Pages GET 404 de Cloudflare kontrolü değildir. Yukarıdaki kullanıcı UI yanıtı
  kısmi doğrulamadır; App kapsam değişikliği ve Cloudflare sonucu hâlâ beklenir.
- Uzak main ve required checks yok; branch protection veya CMS main yazma reddi
  kurulmuş/test edilmiş sayılamaz. Public Free destekleri resmî belgelerle
  doğrulandı; gerçek Billing ekranı okunmadı, Free kullanımı kullanıcı kararıdır.
- Yeni required context üretilmeden eklenmez; skipped/neutral native kabulü güven
  kanıtı sayılmaz. Trusted check kaynağı, teknik/içerik PR ayrımı, main-only secret
  sınırı ve otomatik aktarım sonraki açık yetkili kurulumda kanıtlanacak.
- Bu görev sonunda yalnız yerel belge değişiklikleri uncommitted; başlangıç temizdi.
  HEAD/ref/geçmiş korunur. Push öncesi belge checkpoint'i/temiz ağaç ve gönderilecek
  tam SHA ayrıca kararlaştırılır; değişiklikler silinerek temizlenmez.
- Public/Private EXIF temizliği değildir; ilk gerçek test metadata'sızlığı/yayın
  hakkı onaylı kişisel veri içermeyen görsellerle yapılmalıdır. Ali Bey JSON/piksel/
  terminal kullanmaz. Gerçek fotoğraf/ürün hâlâ bekleniyor.
- Yeni WebKit/Firefox/fiziksel cihaz/axe/hosted CMS veya gerçek yayın testi yok.

## FAIL

Son yerel doğrulamalarda başarısız test veya açık kritik uygulama hatası yok.
Push/gerçek GitHub korumaları/CMS/Cloudflare bu görevde uygulanmadı. PUSH_READY'nin
BLOCKED olması test başarısızlığı değil, eksik yetkili tetikleyici kontrolü ve açık
push izni nedeniyle beklenen güvenli duruştur; otomasyon tamamlandı denmez.

## Dosya, Git ve kanıt

Yalnız hazırlık belgeleri güncellendi, yeni PUSH_PREFLIGHT.md eklendi. Uygulama/
JSON/.pages/paket/config/test dahil **200 korunan kaynak byte eşit**; yeni özellik veya bağımlılık yok.
Commit/remote/dry-run/push/ayar/App/davet/secret/deployment yapılmadı. 4.2-c başlamadı.

Kanıt /private/tmp/bal-phase42b/: kaynak arşivi, before refs/history/status, API GET
sonuçları, history/binary audit, preservation ve publishing-audit/playwright/candidate
logları. Toplu check: /private/tmp/bal-phase42b-check.log. İzole candidate sonucu:
/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-publishing-export-fcAcJ4.
QA çıktıları Git dışıdır. Ayrı push onayı beklenir; dış tetikleyici UNKNOWN iken
push için izin verilse de önce bu engel çözülmelidir.

---

## Tarihsel Faz 4.2-a raporu

# Faz 4.2-a — GitHub / gerçek Pages CMS bağlantı hazırlığı

Tarih: **7 Kasım 2026**. C5 checkpoint **8d0046d** kabul edildi. Bu rapor yerel
hazırlık ve anonim uzak okuma sonuçlarıdır; gerçek otomatik CMS yayını değildir.
[Bağlantı/kullanıcı adımları](GITHUB_READINESS.md), [güvenli mimari](AUTOMATION_DESIGN.md),
[gerçek kabul protokolü](CMS_ACCEPTANCE.md), [plan §21](../plan.md).

## PASS

- Başlangıç temiz main/8d0046d, 7 commit, remote yok. Uzak repo Public ve gerçekten
  refs boş; branches/rulesets API de boş. Hesap yetkisi veya ayarı değiştirilmedi.
- Reachable geçmiş 7 commit/340 blob; env/build/test çıktısı, bilinen sır deseni,
  raster/EXIF ve büyük/atlanmış blob bulgusu 0. En büyük blob 307409 byte. Bilinen
  desen taraması tüm sır türlerini bulma garantisi değildir.
- Gerçek Git mode/blob/byte ingress + trusted C5 normalizasyonu + üç yönlü merge
  çalışıyor. Source code checkout/execute edilmez. Kod/workflow/env, rename/delete,
  symlink/exec/gitlink, bozuk JSON/görsel, SHA drift ve merge conflict reddedilir.
- Telefon/sosyal onayı yalnız aynı current-main değere bağlıdır; eşzamanlı başka
  değerle birleştirilmez. Kimlik/verified şube kapısı değişmedi.
- .pages.yml/12 form, eski testler, UI/veri/tasarım, altı kategori ve dört konum
  korundu; **187 önceki kaynak byte eşit**. Yeni paket/lockfile değişimi yok. Test ürün/fotoğrafları yalnız temp'te.

| Kontrol                               | Sonuç                                         |
| ------------------------------------- | --------------------------------------------- |
| TypeScript strict / ESLint / Prettier | PASS                                          |
| Vitest                                | **426/426**, 27 dosya; 363 eski + 63 yeni     |
| Resmî CMS config kontrolü             | PASS; .pages.yml aynı                         |
| Production static export              | **67 dosya**, noindex true                    |
| Statik HTTP                           | **3/3**                                       |
| Playwright / sistem Chrome            | **51/51**, out/ üzerinde                      |
| Responsive                            | **320, 393, 768, 1280 px**                    |
| Gerçek temp Git candidate export      | **2/2**, static HTTP/Chrome ve conflict reddi |
| Önceki CMS source-backed round-trip   | PASS; hosted editör testi değildir            |

`npm run publishing:audit`, `npm run publishing:simulate` ve izole
`node scripts/test-publishing-export.mjs` teknik araçları eklendi. Simülasyon ayrı
data/report üretir; candidateCommitSha=null/fullChecksRun=false/remoteProtectionVerified=false.
Promotion gate modelindeki bool/SHA alanları gerçek API yetki kanıtı değildir.

## WARNING

- **Uzak main henüz yok, koruma kurulmuş değil.** Gerçek hesap planı/installation
  grant okunmadı. Public Free native korumaları destekler; kişisel Private için
  Pro gerekir. Private Free tek repo güvenli otomasyon hedefini karşılamaz.
- Hosted public App metadata'sı write **actions/contents/repository_creation**,
  read checks/deployments/emails/metadata/pages/statuses ister; gerçek kurulum
  ekranı/onaylanan izinler henüz görülmedi. Self-host admin manifestinden ayrıdır.
- API observer, trusted Check Run attester, required checks, main-only secret
  environment, bot PR/auto-merge/source-sync kurulmadı. CMS'nin main'e save reddi
  yalnız yerel modelde sınandı; gerçek GitHub enforcement testi PENDING.
- Private repo EXIF temizliği değildir. İlk gerçek testler önceden metadata'sızlığı/
  yayın hakkı onaylı kişisel veri içermeyen görsellerle yapılmalı. Ali Bey'den JSON,
  piksel veya terminal istenmez. Gerçek ürün/fotoğraflar hâlâ bekleniyor.
- İlk push için Public/Private/gerçek plan kararı, mevcut webhook/Cloudflare yayın
  tetikleyicisi kontrolü ve **ayrı açık push izni** gerekir. Teknik olarak koşullu
  hazırız; ilk push'un yayın tetiklemeyeceği henüz hesap sahibi tarafından görülmedi.
- Hosted login/12 form/reference/image/date/UUID/davet ve Cloudflare kabulü PENDING.
  Yeni WebKit/Firefox/fiziksel cihaz/axe taraması yapılmadı. Eski bağımsız kategori/
  ürün/şube fixture script'leri bu tur ayrı tekrar çalıştırılmadı; mevcut unit/E2E
  ve kapsamlı CMS round-trip korundu.

## FAIL

Son yerel doğrulamada başarısız test veya açık kritik uygulama hatası yok. Beklenen
negatif test reddi başarıdır. **Tam otomatik harici yayın hedefi henüz karşılanmadı**;
bu rapor onu PASS olarak sunmaz.

## Git, dosyalar ve kanıt

src/publishing/*, üç teknik script ve iki hazırlık belgesi yeni; package.json
teknik komutları/tsconfig.media include ve AGENTS/README/mimari/güvenlik/yayın/CMS/
plan raporları güncellendi. Önceki kaynaklar/testler byte eşit. Anlamlı yerel
checkpoint kaydedilir, hash teslim yanıtında; remote/push/App/davet/secret/deploy yok.

Başlangıç arşivi/anonim GET'ler/audit/preservation ve son check/playwright/fixture
logları /private/tmp/bal-phase42a/ içinde. Git fixture sonucu
/var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-publishing-export-RYVYTt;
CMS fixture /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-cms-roundtrip-cHGLAo.
QA/env/build dosyaları Git dışıdır. Sonraki harici aşama açık izin olmadan başlamaz.

---

## Tarihsel Faz 4.1-c5 raporu

# Faz 4.1-c5 — CMS alan/medya adaptörü kalite raporu

Tarih: **7 Kasım 2026**. Yerel c5 ve .pages.yml hazırlığı tamamlandı. Gerçek CMS
hesabı/aktarımı/Cloudflare **tamamlanmadı**. [Teknik sözleşme](CMS_ADAPTER.md),
[gerçek editör kabul planı](CMS_ACCEPTANCE.md), [plan §20](../plan.md).

## PASS

- .pages.yml beş koleksiyon/yedi dosyayı 12 Türkçe forma eşler. Ürün/galeri/duyuru
  native UUID ve dosya şablonu kullanır; kategori picker gerçek ID'yi saklar.
  Teknik ID/slug/piksel/filepath alanı manuel giriş değildir; code/CSS/env/kimlik/
  verified/domain/noindex formda yoktur. Rename/delete bütün içeriklerde kapalıdır.
- Trusted Node adaptörü aynı raw content yollarını ayrı canonical candidate'a
  dönüştürür. Bilinen boş/null alanlar normalize edilir; bozuk/unknown/ref/ID/slug,
  eksik dosya ve raw medya silme/rename reddedilir. Strict uygulama loader'ı aynı.
- JPEG/PNG/WebP/AVIF decode/limit/path/symlink güvenliği; otomatik ID/gerçek ölçü ve
  EXIF'siz candidate çalışır. Raw byte'lar değişmez. Fotoğraf değişiminde eski ölçü/
  varyantlar taşınmaz; aynı URL'de byte değişimi için de test vardır.
- Protected şube kimliği/koordinatlar ve verified kapısı korunur; onaylı iletişim
  değeri değişirse onayı düşer. Draft ve location detay/schema ayrımı aynı.
- 148 mevcut kaynak byte eşit; altı kategori/dört koordinat aynı. Ürün/galeri/
  duyuru/fotoğraf gerçek sayıları 0; tüm test verileri temp projelerde.

| Kontrol                                       | Sonuç                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| TypeScript / ESLint / Prettier                | PASS; strict aynı                                                      |
| Vitest                                        | **363/363**, 24 dosya                                                  |
| .pages.yml                                    | Pinned resmî Zod şeması + negatif ve semantic field/path testleri PASS |
| Production static export                      | **67 dosya**, noindex true, rotalar aynı                               |
| Statik HTTP                                   | **3/3**                                                                |
| Playwright / Chrome                           | **51/51**, gerçek out/                                                 |
| Kategori / ürün / şube / medya / metin export | **3/3, 4/4, 5/5, 5/5, 4/4**                                            |
| CMS kaynak tabanlı yerel round-trip           | PASS; yeniden save/ad/fotoğraf, static HTML ve dört genişlik           |
| Responsive                                    | **320 / 393 / 768 / 1280 px**                                          |

MIT upstream 6f4e860 şeması ve form/default/deepMap/sanitize/image write fonksiyonları
hash'li fixture'dan kullanılır. Yerel wire ürünü ID/ölçü olmadan oluşturur; ikinci
save'de aynı ID/slug ile ad ve fotoğraf değişir. Piksel ölçüsü otomatik 60×30 olur.
Ana sayfa/Hakkımızda/şube/kategori/duyuru değişimi statik HTML'de doğrulanır. Draft
işareti out metinlerinde yok, source JSON 404; hero preload ve fotoğraf lazy/decode
çalışır. EXIF raw kaynakta var, candidate/out temiz; raw orijinal byte eşittir.

## WARNING

- Gerçek hosted editor, reference arama API'si/date picker UI, upload/save/auth,
  App/davet/GitHub korumaları, otomatik aktarım ve Cloudflare kabulü **çalıştırılmadı**.
  Yerel native-helper wire testi bu harici akışları kanıtlamaz. 12 gerçek kabul
  senaryosu PENDING; kullanıcı işlemleri CMS_ACCEPTANCE.md içinde.
- **Hosted upload için EXIF'in Git'e yazılmadan temizlenmesi garanti edilemez.**
  Raw blob zaten GitHub'a gidebilir; candidate/out temizliği geçmişi temizlemez.
  Public/private ve EXIF kararı gerçek upload/App ön koşuludur; ayrıntılı alternatifler
  CMS_ADAPTER'da. Ali Bey'e terminalde temizleme işi verilmedi.
- CLI Git merge/CI yetkisi değildir: immutable SHA, üç yönlü fark, path/mode manifest,
  PR/required checks, conflict/race ve canonical source senkronizasyonu kurulmalıdır.
  content-edit main/Cloudflare'a doğrudan bağlanmaz. Hidden/readonly yetki değildir.
- Yeni kategori/fiziksel şube onboarding ve verified sahiplik/kimlik onayı teknik
  işlemdir. Gerçek ürün/fotoğraf/logo/şube kimliği/sosyal hesaplar beklenir.
- WebKit/Firefox/fiziksel cihaz/yeni axe bu görevde çalıştırılmadı. Resize/varyant
  üretimi, pre-upload sanitizer ve zamanlanmış yayın servisi eklenmedi.

## FAIL

Son yerel doğrulamada başarısız test veya açık kritik uygulama hatası yoktur.
Tam pre-Git EXIF şartı mevcut hosted-only çözümle karşılandı diye raporlanmaz.
İlk testte hero loading attribute varsayımı, gerçek Next preload davranışına göre
düzeltildi; uygulama bileşeni değiştirilmedi. İlk config view şema ve lint module
adı hataları giderildi; son kontroller geçti.

## Git, dosyalar ve kabul

Başlangıç main/ec334f8 temizdi. Yeni .pages.yml, src/cms adapter/CLI ve iki test,
beş CMS teknik script'i, MIT/provenance/hash'li upstream test fixture'ları ve
CMS_ADAPTER/CMS_ACCEPTANCE belgeleri eklendi. Package scripts/yardımcı TS include
ve rehber/plan/kalite kuralları güncellendi. js-yaml 4.3.2 ve zod 4.6.7 zaten kurulu
sürümlerinden exact doğrudan dev bağımlılık oldu; başka sürüm/paket değişimi yoktur.

Yerel commit: `feat: prepare Pages CMS forms and trusted media adapter`.
Tam hash teslim yanıtında/git log'da. Secret/.env/otomatik çıktı/test raporları Git
dışıdır. Remote/push/hesap/App/davet/deployment yapılmadı.
Kanıtlar /private/tmp/bal-c5/; roundtrip-final.log son izole fixture yolunu gösterir.

Manuel yerel inceleme: npm run build, npm run preview, http://127.0.0.1:4173.
Bu site önizlemesidir, admin girişi değildir. Gerçek kabul: Ali Bey kendi panelinden
ürün adı/fotoğraf/ana sayfa metni değiştirir; otomatik trusted kapılar geçer ve
Cloudflare HTTP içerik/SHA zinciri kanıtlanır. Bu kabul henüz gerçekleşmedi.

---

## Tarihsel Faz 4.1-c4 raporu

# Faz 4.1-c4 — Kurumsal metin ve duyuru JSON kalite raporu

Tarih: **7 Kasım 2026**. Önceki c3 ve tüm veri mimarisi korundu. Yalnız yerel
uygulama; gerçek CMS veya yayın kurulmadı. [Metin sözleşmesi](EDITORIAL_GUIDE.md),
[master plan §19](../plan.md), [içerik rehberi](CONTENT_GUIDE.md).

## PASS

- Beş sayfanın işletme metinleri content/pages/*.json; marka/footer/iletişim ve
  sosyal ayarlar content/settings/{site,social}.json tek kaynağına taşındı.
  Ana/vurgulu hero başlığı, bölüm/kurumsal metinler, CTA yazıları ve işletme SEO
  açıklamaları düzenlenebilir. İkinci TS literal listesi yoktur.
- UI/navigasyon/hata/eksik veri metinleri, href/rota, kırmızı span/satır kırılımı,
  CSS ve canonical/noindex/domain yetkisi kodda kalır. Temel sayfalar zorunludur;
  sayfa status sistemi kurulmadı, yeni duyurular draft/published destekler.
- Strict nested şema, required/unknown/tip/uzunluk/URL ve UTF-8/256 KiB/normal
  dosya denetimi; bozuk kaynakta build reddi vardır. HTML React ile düz metin olur.
  Telefon/e-posta/sosyal değer null ve verified false; sahte link yoktur.
- Duyuru koleksiyonu boş; benzersiz ID/slug, sıra, opsiyonel medya ve UTC tarih
  sözleşmesi hazır. Published + başlangıç dahil/bitiş hariç filtre build'de çalışır.
  Tek SITE_BUILD_AT render ve sanitize export'u eşler; kaynak drift reddi korunur.
- 697db94 geçici kopyada yeniden derlendi. Beş sayfanın görünür metin/title/meta
  description sonuçları **15/15 birebir**. Altı kategori, dört gerçek koordinat ve
  **61 korunan kaynak dosyası byte eşit**. Yeni bağımlılık yok; eski testler korundu.

| Kontrol                                     | Sonuç                                              |
| ------------------------------------------- | -------------------------------------------------- |
| TypeScript / ESLint / Prettier              | PASS; strict aynı, lint uyarısı 0                  |
| Vitest                                      | **328/328**, 22 dosya                              |
| Production static export                    | **67 dosya**, noindex true, aynı ana rotalar       |
| Static HTTP                                 | **3/3**                                            |
| Playwright / sistem Chrome                  | **51/51**, out/ üzerinde                           |
| Responsive                                  | **320, 393, 768, 1280 px**; DOM ve ekran görüntüsü |
| İzole metin export                          | **4/4**                                            |
| İzole kategori / ürün / şube / medya export | **3/3, 4/4, 5/5, 5/5**                             |

Metin fixture'ı gerçek kaynağı değiştirmeden JSON başlık ve Hakkımızda metni
HTML'e yansımasını; kırmızı vurgu, XSS'nin çalışmamasını; onaysız iletişim ve
draft/future/expired duyuruların HTML/RSC/JS'de görünmemesini doğrular. Draft duyuru
fotoğrafı 404'tür. Malformed home JSON, geçersiz sosyal URL ve teknik SEO alanı
üç negatif build ile reddedilir. Saat ilerlemesi statik duyuruyu değiştirmez.

## WARNING

- Bu bir veri altyapısıdır; Ali Bey için gerçek CMS paneli, .pages.yml, upload
  metadata adaptörü, otomatik aktarım ve Cloudflare yayını henüz yoktur. Üç gerçek
  panel → otomatik kontrol → Cloudflare içerik/SHA kabul akışı hâlâ bekleniyor.
- verified iletişim işareti insanın sahiplik teyidini belirtir; URL biçim kontrolü
  veya bu işaret tek başına hesap sahipliğini kanıtlamaz. Gerçek telefon/e-posta,
  sosyal hesap, logo/fotoğraf/ürün, şube kimlik/adres/saat bilgileri beklenir.
- Tarihli duyuruların devreye girmesi/kalkması yeni build/deployment ister;
  zamanlanmış tetikleme kurulmadı. JSON sonrası dev sunucusunu yeniden başlatın.
- Bu fazda yeni WebKit/Firefox/fiziksel cihaz/axe taraması yapılmadı.
- İlk sandbox HTTP turu listen EPERM ile çalışamadı. Gerekli erişimle tekrar
  çalıştırılan son tam check, HTTP, Playwright ve fixture'lar başarılıdır.

## FAIL

Son doğrulamada başarısız test veya açık kritik hata yok. Negatif build reddi
beklenen koruma davranışıdır; gerçek kaynağa sahte duyuru/fotoğraf eklenmedi.

## Dosyalar, Git ve manuel kabul

- Yeni: yedi sayfa/ayar JSON, announcements/.gitkeep; editorial schema/server ve
  page-copy; announcement schema/loader/query; build-clock; ContactDetails,
  koşullu AnnouncementsSection; build-site/test-editorial-export araçları.
- Kullanım: beş rota, home bölümleri/footer/OG, site/social erişimi, katalog copy
  props, kök denetim ve medya fingerprint/duyuru yayın seçimi. Uzun kelime taşmasına
  karşı yalnız body overflow-wrap eklendi. Renk/tipografi tokenları değişmedi.
- Yeni testler: editorial/announcement/build-clock/contact unit dosyaları,
  editorial-json E2E. Önceki kategori/ürün/şube/galeri/media testleri değişmedi.
- Belgeler: EDITORIAL_GUIDE, AGENTS/README/CONTENT_GUIDE/ARCHITECTURE/CMS_SETUP/
  ROADMAP/EDITOR_GUIDE/SECURITY/DEPLOYMENT/ROLLBACK, plan ve bu rapor.

Başlangıç main/697db94; başarılı değişiklikler
`feat: migrate corporate copy and announcements to validated JSON` yerel commit'inde
kaydedilir. Son hash teslim yanıtında/git log'da bulunur. .env/otomatik çıktılar,
node_modules ve raporlar Git dışıdır. Remote/push/hesap/secret/deploy/c5 yoktur.

Güncel kanıt: /private/tmp/bal-c4-final/ altında check-final.log, playwright.log,
editorial-fixture.log, diğer dört fixture log'u, copy-parity.json ve
preservation-report.json. playwright-report/ ve test-results/ Git dışındadır.
Manuel inceleme: npm run build → npm run preview → http://127.0.0.1:4173.
c5 önerisi: ayrı yetkiyle medya metadata adaptörü ve CMS alan eşleme/round-trip
planını ele almak. Bu rapor c5'i başlatmaz.

---

## Tarihsel Faz 4.1-c3 raporu

# Faz 4.1-c3 — Galeri ve medya kalite raporu

Tarih: **1 Kasım 2026**. Yerel altyapı tamamlandı; gerçek CMS/push/deployment yoktur.
[MEDIA_GUIDE](MEDIA_GUIDE.md) · [Master plan §18](../plan.md).

## PASS

- Galeri TS boş kaynağından content/gallery JSON koleksiyonuna taşındı; gerçek galeri
  ve fotoğraf sayısı 0. Ürün/kategori/şube medyası kendi kaynağında kaldı; ikinci registry yok.
- Medya id/url/alt/gerçek width-height/variants, yayın/sıra ve kullanım alanını destekler.
  Galeri usages ile hero/ortak/şube yüzeylerine gider; embedded medya status/sortOrder
  isteğe bağlıdır. Draft veri ebeveyn published olsa bile serialize edilmez.
- İmza/decoder MIME/full pixel decode, gerçek ölçü/oran, güvenli yol/symlink, byte/
  çözünürlük/adet, eksik dosya, zorunlu alt ve global medya ID tekrarı doğrulanır.
  JPEG/PNG/WebP/AVIF izinli, SVG şimdilik tamamen kapalıdır.
- Standart build yalnız published fotoğrafları out/images'e yeniden encode edip
  EXIF/XMP/IPTC/ICC'siz yazar; draft/orphan raw dosyalar dışlanır. Kaynak byte'ları aynı kalır.
- Build sırasında JSON/görsel değişimi fingerprint ile reddedilir. Header/rota/tasarım,
  StaticImage/PhotoGallery, altı kategori ve dört koordinat korundu.
- 38 kritik dosya başlangıç arşiviyle byte eşit. Sharp 0.35.5 mevcut transitive sürümden
  exact doğrudan bağımlılık oldu; kontrolsüz paket/native sürüm değişikliği yoktur.

| Kontrol                        | Sonuç                                                             |
| ------------------------------ | ----------------------------------------------------------------- |
| TypeScript / ESLint / Prettier | PASS; ana strict aynı                                             |
| Vitest                         | **262/262**, 18 dosya; 52 yeni test                               |
| Production static export       | **67 dosya**, noindex true; rotalar aynı                          |
| Static HTTP                    | **3/3**                                                           |
| Playwright / sistem Chrome     | **48/48**, out/ üzerinde                                          |
| Responsive                     | **320, 393, 768, 1280 px**                                        |
| Kategori / ürün / şube export  | **3/3 · 4/4 · 5/5**                                               |
| İzole medya export             | **5/5**                                                           |
| Git fotoğraf kurtarma          | Temp repoda doğru → yanlış → yeni düzeltme commit'i; decode geçti |

Medya fixture üç hatalı build'i reddeder, EXIF'siz üretim dosyaları ve doğru MIME'i
HTTP'de doğrular; draft/orphan URL'leri 404'tür. Hero eager/high, galeri lazy ve
srcset/sizes dört genişlikte kontrol edilir. İzole ürün/şube fotoğrafları render edilir.
Son input değişikliği export'u reddeder. Gerçek kaynak/out'a test fotoğrafı eklenmedi.
67/68 farkı yalnız ham .gitkeep çıktıdan çıkarıldığı içindir; required rotalar/PNG/SEO korunur.

## WARNING

- CMS upload ekranı/.pages.yml/hesap/CI ve Cloudflare bağlantısı yok. Native image alanı
  dosya yolu saklar; Ali Abi'den piksel ölçüsü istemeden metadata yazacak güvenilir
  adaptör ve gerçek editor round-trip testi henüz kurulmadı. Şimdiki width/height zorunlu.
- Build'de EXIF temizliği orijinal dosyayı/Git geçmişini temizlemez. Public repo upload'u
  öncesi kaynak EXIF mahremiyeti ayrıca kontrol edilmelidir. Dev ham public dosyalarını sunar.
- Aynı formatta re-encode vardır; otomatik resize/kadraj/varyant üretimi yok. Gerçek medya
  performansı ölçülmedi. Hazır varyantlar doğrulanır ve StaticImage ile sunulur.
- Yardımcı TS CJS derlemesinde TS6 Node resolution deprecation uyumluluğu ayrı config'tedir;
  ana strict aynı, TS7 öncesi araç çözümlemesi tekrar değerlendirilmelidir.
- Firefox/WebKit/fiziksel cihaz ve yeni axe taraması yapılmadı. Yerel test tam WCAG/host güvenliği değildir.
- İlk generated lint/tip kopyası ve fixture bekleme sorunları düzeltildi; son kontroller geçti.

## FAIL

Son kontrollerde başarısız test veya açık kritik hata yok. Hatalı JSON/görsel build
reddi beklenen güvenlik davranışıdır. **CMS entegrasyonu tamamlanmış değildir.**

## Dosyalar, Git ve kabul ölçütü

Yeni galeri schema/loader, media-selection, media-files/server, media-cli ve tool
config/runner; content/gallery ve public/images alanları; iki unit, bir E2E ve izole
medya export testi. Ortak MediaAsset/schema/yayın seçicileri, async root doğrulaması,
hero/galeri kullanım bağlantıları ve build script'leri güncellendi. Bileşenler yeniden
kurulmadı; eski testler kaldırılmadı. Dokümanlar ve resmî CMS alan eşlemesi güncellendi.

Başlangıç Git main/0507348; snapshot/kanıt arşivi /private/tmp/bal-phase41c3-z6h_8nuw/.
Medya kanıtı: bal-media-export-VqSdAU; diğer fixture yolları master planda kayıtlı.
.generated, out ve test raporları Git dışıdır. Başarılı çalışma yerel
`feat: add CMS-ready gallery and validated static media pipeline` commit'iyle kaydedilir;
hash git log ve teslim yanıtında bulunur. Remote/push/deployment/c4 yoktur.

Gerçek tamamlanma ölçütü: Ali Abi panelden ürün adı, fotoğraf veya ana sayfa metni
ile üç akışı kod/piksel metadata girmeden yürütür; otomatik trusted kontroller ve
korunan aktarım geçer; Cloudflare üzerinde yeni içerik/source SHA doğrulanır.
Bozuk medya önceki yayını değiştirmez; geri alma ve yeniden yayın da denenir.
Bu gerçek kabul henüz yapılmadı. c4 önerisi: site metinleri ve upload metadata
adaptörünü ayrı küçük işler halinde ele almak; kendiliğinden başlatılmadı.

---

## Tarihsel Faz 4.1-c2 raporu

# Faz 4.1-c2 — Şube JSON kalite raporu

Tarih: **1 Kasım 2026**. 4.1-a/b/c1 kabul edildi; önceki kaynaklar ve raporlar korundu.
Sözleşme [CONTENT_GUIDE](CONTENT_GUIDE.md), ayrıntılı kayıt [plan.md §17](../plan.md).

## PASS

- Dört kayıt **14 alanıyla birebir** content/branches/location-{1,2,3,4}.json'a taşındı.
  Dört koordinat, özgün Maps URL'leri ve Konum 1–4 adları aynı; eksik alanlar null.
- Strict JSON/UTF-8/tip/ID-filename/unknown alan ve mükerrer ID/slug/koordinat/adres
  denetimi var. Yanlış Maps eşleşmesi ve örnek şube JSON'u reddedilir. Fallback yoktur.
- Şube kimliği ayrı korunan ID/hash onayıyla doğrulanır. Şu an onay listesi boş.
  Sadece JSON'da verified seçmek onay vermez; yalnız onaylı verified/published detay
  üretir. LocalBusiness eklenmedi, location kayıtları detay/sitemap'e girmez.
- Yeni JSON şube merkezi sayımı günceller; aynı fiziksel şube için ID korunur.
  images ilk kapak + detay galerisini, nullable telefon/WhatsApp/saat sözleşmesini korur.
- Header server/client sınırı ayrıldı; fs client'a aktarılmaz, menü/klavye/sticky
  davranışı korundu. Kaynak JSON ve teknik onay statik hostta 404'tür.
- Başlangıçla karşılaştırmada kategori/ürün kaynakları, policy, site/galeri, stil,
  paket/strict/config ve diğer korunan **82 dosya byte eşit**. Yeni paket yok.

| Kontrol                        | Sonuç                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| TypeScript / ESLint / Prettier | PASS; strict korundu                                                |
| Vitest                         | **210/210**, 16 dosya; 64 yeni şube testi                           |
| Production static export       | **68 dosya**, noindex true, aynı rotalar                            |
| Static HTTP                    | **3/3**                                                             |
| Playwright / sistem Chrome     | **45/45**, gerçek out/ sunucusunda                                  |
| Responsive regresyon           | **320, 393, 768, 1280 px**                                          |
| İzole kategori / ürün export   | **3/3 ve 4/4**                                                      |
| İzole şube export              | **5/5**; dört negatif build ve yayın/kimlik/404/sitemap kontrolleri |

Negatif şube build'leri malformed JSON, unknown field, yanlış Maps ve onaysız
verified kaydı reddeder. Pozitif fixture aynı ID kimlik yükseltmesini, yeni fiziksel
şubeyi, merkezi sayımı ve onaylı draft kaydın dışlanmasını doğrular. İndeksleme
sadece izole test domainiyle açılarak sitemap kontrol edilir. Gerçek build/ayarlar
noindex kalır; fixture'lar gerçek kaynak veya out/ içine eklenmez.

## WARNING

- Gerçek şube adı/adres eşleşmeleri ve telefon/saat/fotoğraflar bekleniyor. Onay
  hash'i teknik sorumlu tarafından ürün sahibi doğrulamasıyla eklenir. Kimlik alanı
  değişirse onay yenilenir; bu veri mimarisi kurulmuş bir CMS/CI güvenliği değildir.
- Fotoğraf upload/decode, .pages.yml, CMS hesabı ve harici yayın hattı kurulmadı.
- JSON sonrasında dev sunucusunu yeniden başlatıp sayfayı yenileyin; yayında yeniden build gerekir.
- WebKit/Firefox/fiziksel cihaz ve yeni axe taraması bu görevde çalıştırılmadı.
- İlk strict tip ve navbar client fs import hataları düzeltildi; son kontroller geçti.

## FAIL

Son kontrollerde başarısız test veya açık kritik hata yok. Negatif fixture build
reddi beklenen başarı davranışıdır.

## Git ve dosyalar

Yeni branch-schema/branches.server/branch-identity, iki unit dosyası ve branches-json
E2E eklendi. branches.ts/content.server.ts, Header sınırı, branch export script'i ve
belgeler güncellendi. Önceki kategori/ürün/policy testleri kaldırılmadı.

Başlangıç/kanıt/loglar: /private/tmp/bal-phase41c2-fxkd65p4/.
Canonical eski/yeni şube SHA-256 aynı:
`5185cc775a8e564cdd4e35af5cf97ea018904d5f746df7d880356aed6bd28c4b`.
Son şube fixture yolu branch-fixture-final.log içinde; diğer fixture yolları plan §17'de.

Önceki 4.1-a/b/c1 ve c2 kod/test commit: **`11b28847a041e4f6a49fc2cef8e5453daf7fb30e`**.
Belgeler ayrı `docs: record CMS content migrations and quality results` commit'inde kaydedilir.
Gizli env/otomatik çıktılar/test raporları Git dışıdır. Harici remote/push/deployment
veya 4.1-c3 başlatılmadı. Son commit hash'leri teslim yanıtında raporlanır.

---

## Tarihsel Faz 4.1-c1 raporu

# Faz 4.1-c1 — Ürün JSON kalite raporu

Tarih: **1 Kasım 2026**. Yalnız ürün içerik mimarisi; 4.1-a/b değişiklikleri ve
önceki raporlar korundu. Ayrıntılı sözleşme [CONTENT_GUIDE](CONTENT_GUIDE.md), faz
kaydı [plan.md §16](../plan.md) içindedir.

## PASS

- Gerçek ürün kaynağı önce 0, sonra 0. content/products yalnız .gitkeep içerir;
  test ürünleri gerçek kaynağa veya out/ içine yazılmadı.
- Tek ürün kaynağı product-<id>.json; sekiz zorunlu alan: id, slug, name, categoryId,
  description, images, sortOrder, status. TS literal listesi kaldırıldı.
- Strict unknown parse/schema: bilinmeyen/eksik alan, yanlış tip/değer/ID/filename,
  duplicate ID/slug, bozuk JSON/UTF-8, geçersiz kategori, symlink ve byte limiti reddi.
- categoryId gerçek strict kategori JSON kayıtlarına karşı doğrulanır; sabit ikinci
  seçenek listesi yoktur. Yalnız published ürün + published kategori client'a gider.
- Boş koleksiyon geçerli, kayıp/bozuk veri fallback üretmez. JSON yalnız Node/RSC
  loader'da işlenir; kaynak JSON/server TS statik hostta 404, client veri API'si yok.
- İzole testte published ürün render edildi; draft ürün ve draft kategoriye bağlı
  ürünün ad/ID işaretleri HTML/RSC/TXT/XML/JSON/JS çıktılarında bulunmadı.
- Altı kategori JSON'u ve dört koordinat aynı. Başlangıç arşivine göre UI kaynakları,
  4.1-a policy/test, şube/galeri/site/sosyal, paket/lock/strict/config dahil 75 dosya byte eşit.

| Kontrol                        | Sonuç                                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| TypeScript / ESLint / Prettier | PASS; strict korundu, lint uyarısı 0                               |
| Vitest                         | **146/146**, 14 dosya; 43 yeni ürün testi                          |
| Production static export       | PASS; **68 dosya**, noindex true, aynı rotalar                     |
| Static HTTP                    | **3/3**                                                            |
| Playwright / sistem Chrome     | **42/42**, gerçek out/ sunucusunda                                 |
| Responsive                     | **320 / 393 / 768 / 1280 px**; DOM kontrolleri ve ekran incelemesi |
| İzole ürün export              | **4/4**; üç negatif build + yayın/gizlilik/tarayıcı kontrolü       |
| İzole kategori export          | **3/3**                                                            |
| İzole şube export              | **1/1**                                                            |

Komutlar: npm run check; PLAYWRIGHT_CHANNEL=chrome npm run test:e2e;
node scripts/test-product-export.mjs; node scripts/test-category-export.mjs;
node scripts/test-branch-export.mjs. Ürün fixture'ı kaynakları yalnız geçici kopyada değiştirir.

## WARNING

- Gerçek ürün ve fotoğraf henüz yok. Görsellerin veri sözleşmesi hazır; upload,
  decode/EXIF, boyut türetme veya gerçek Pages CMS editörü kurulmadı.
- JSON sonrası dev sunucusunu yeniden başlatıp sayfayı yenileyin; otomatik HMR yok.
  Statik yayına yansımak için yeniden build gerekir.
- WebKit/Firefox/fiziksel cihaz ve yeni axe taraması bu görevde çalıştırılmadı;
  önceki eksik tarayıcı binary kısıtları geçerli. Chrome emülasyonu fiziksel cihaz testi değildir.
- İlk fixture tarayıcı denemesi macOS /var takma yolu nedeniyle yerel QA'da 404 verdi.
  Fixture sunucusunun kökü realpath ile çözüldü; son kontrol geçti. Uygulama tasarımı değişmedi.

## FAIL

Son kontrollerde başarısız test veya açık kritik hata yok. Hatalı JSON/ref fixture
build'lerinin başarısız olması beklenen koruma davranışıdır.

## Değişen dosyalar, Git ve kanıt

- Yeni: content/products/.gitkeep; product-schema.ts/products.server.ts ve iki test;
  ortak content-schema.ts; tests/e2e/catalog-assertions.ts, products-json.spec.ts;
  scripts/test-product-export.mjs.
- Erişim: products.ts, queries.ts, content.server.ts. Kategori şeması aynı kurallarla
  ortak helper'a alındı; categories.server.test.ts draft kategori fixture'ı güçlendirildi.
- site.spec.ts boş katalog denetimini koruyup ileride gerçek ürün kartlarını da destekler.
  Mevcut testler kaldırılmadı. AGENTS/README/mimari/içerik/CMS/yol haritası/plan güncellendi.
- Ana arşiv/log ve preservation-report.json: /private/tmp/bal-phase41c1-e1237sbd/.
  Ürün fixture: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-product-export-8AydTy.
  Kategori ve şube fixture yolları plan.md §16'da kayıtlıdır.
- Git main/**78df0f7**, önceki değişiklikler korunarak uncommitted; yeni commit veya remote yok.
  Push/deployment/hesap/secret/.pages.yml/DB/admin/yeni paket yok. Faz 4.1-c2 başlatılmadı.

---

## Tarihsel Faz 4.1-b raporu

# Faz 4.1-b — Kategori JSON pilotu kalite raporu

Tarih: **1 Kasım 2026**. Yalnız kategori geçişi; önceki V5/4.1-a raporu aşağıda korunur.

## PASS

- Eski/yeni **6/6 kayıt, 7/7 alan birebir**: id, slug, name, description, image,
  sortOrder, status. Kayıp/değişen kayıt 0; açıklamalar ve null görseller aynı.
- Canonical sıralı JSON SHA-256 önce/sonra aynı:
  `f9ef00bbdcb4b05a9971aee9e4491c5e4c0cf176447e1f5b52254e07a1626aad`.
- Eski TS kaynağı 78df0f7 ile aynıydı; snapshot ve parity/preservation kanıtları
  /private/tmp/bal-phase41b-nUr6iB içindedir. Tarihsel eşitlik sabit bir CI hash kilidi değildir.
- content/categories altında altı ayrı ID.json gerçek tek kaynak. Eski TS literal
  listesi kaldırıldı; compatibility snapshot ikinci düzenlenebilir kaynak değildir.
- Strict unknown parse/schema: bilinmeyen/eksik alan, yanlış tip/ID/filename,
  duplicate ID/slug, bozuk JSON/UTF-8, symlink ve boyut aşımları reddedilir.
- İzole export sözleşmesi **3/3**: malformed JSON ve unknown field build'i reddeder;
  draft kaydı statik HTML/bağlantılarda görünmez.
- Güncellenmiş şube detay export fixture testi **1/1** geçti.
- Başlangıç arşivine göre policy/test, şube/ürün/galeri/sosyal/site, paket/lock/TS/Next
  ve tasarım token/CSS dosyaları değişmedi. Dört gerçek koordinat korundu.

| Kontrol                        | Sonuç                                         |
| ------------------------------ | --------------------------------------------- |
| TypeScript / ESLint / Prettier | PASS; strict korundu, lint uyarısı 0          |
| Vitest                         | **103/103**, 12 dosya; 39 yeni kategori testi |
| Production static build        | PASS; out/ 68 dosya; rotalar/SEO aynı         |
| Static HTTP                    | **3/3**                                       |
| Playwright / sistem Chrome     | **39/39**; gerçek out/ statik sunucusunda     |
| Responsive regresyon           | **320, 393, 768, 1280 px**                    |
| İzole kategori export          | **3/3**                                       |
| İzole şube export              | **1/1**                                       |

Komutlar: npm run check; PLAYWRIGHT_CHANNEL=chrome npm run test:e2e;
node scripts/test-category-export.mjs; node scripts/test-branch-export.mjs.

## WARNING

- Gerçek Pages CMS/.pages.yml/GitHub write/Cloudflare işlemi yapılmadı. Diğer
  içerikler TS olarak kalır; 4.1-c başlatılmadı.
- JSON kaynağı Next'in modül grafiğinde olmadığından dev sunucusunu yeniden başlatıp sayfayı yenileyin;
  otomatik HMR iddiası yok. Yayında her değişiklik yeniden statik build gerektirir.
- Görsel shape/alt/dimensions/yerel yol doğrulanır; decode/EXIF/optimizasyon yeni
  özellik olarak eklenmedi. Mevcut root dosya varlığı kontrolü korunur.
- Yeni WebKit/Firefox/fiziksel cihaz/axe testi yok; önceki sınırlar geçerli.
- İlk typecheck eski .next/types kopyalarında durdu; numaralı generated dosyalar
  silinmeden çalışma arşivinin generated-type-copies dizininde korundu; build sonra geçti.

## FAIL

Son toplu turda başarısız test veya açık kritik hata yok. Negatif fixture build'lerinin reddedilmesi
beklenen başarıdır; gerçek kaynak/out/ dosyaları bu fixture'larda değiştirilmedi.

## Dosyalar ve kanıtlar

- Yeni kaynak: content/categories/category-{kuruyemis,kahve,lokum,baharat,aktar,kozmetik}.json.
- categories.server.ts/category-schema.ts ve iki test dosyası; categories.ts/queries.ts/content.server.ts erişim güncellemesi.
- Yeni tests/e2e/categories-json.spec.ts ve scripts/test-category-export.mjs.
- scripts/test-branch-export.mjs fixture kopyasına yalnız content dizini eklendi.
- AGENTS/README/CONTENT_GUIDE/ARCHITECTURE/CMS_SETUP/ROADMAP/plan ve bu rapor.

İzole kategori kanıtı: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-category-export-4gDIrh.
Şube export: /var/folders/wx/ytc9nkq5201247n6818stsd80000gn/T/bal-branch-export-603FFr.
Git main/78df0f7, eski değişiklikler korunarak uncommitted. Commit/push/secret/hesap/deployment yok.

---

## Tarihsel V5 / Faz 4.1-a raporu

# V5 / Faz 4.1 ön kontrol ve yerel hazırlık raporu

Tarih: **1 Kasım 2026**. Araştırma 30 Ekim'de başladı; GitHub durumu ve yerel
kaynaklar 1 Kasım'da yeniden kontrol edildi. Bu rapor önceki boş dosyaya yazıldı;
tarihsel Faz 3 sonuçları [plan.md §12](../plan.md) içinde korunur.

## PASS

- Son commit 78df0f7 / main; önceki doküman değişiklikleri korundu.
- GitHub public API HTTP 200, repo Public/size 0; anonim ls-remote başarılı, refs boş.
  Remote yok; push/ayar/yetki değişmedi.
- Gerçek .env ve otomatik çıktı izlenmiyor; bilinen sır deseni bulunmadı.
- Paket/lock exact sürümleri eşleşiyor; yeni bağımlılık yok.
- Resmî CMS uyum matrisi, güvenilir yayın tasarımı ve küçük görevler hazır.
- Yerel manifest path/mode/byte politikası ve negatif testler eklendi. Uygulama
  render akışı, dört konum ve tasarım kaynakları değişmedi.

| Kontrol                    | Sonuç                                       |
| -------------------------- | ------------------------------------------- |
| TypeScript strict          | PASS                                        |
| ESLint / Prettier          | PASS; sıfır lint uyarısı                    |
| Vitest                     | **64/64**, 10 dosya; 39 yeni politika testi |
| Production static build    | PASS; out/ 68 dosya ve noindex true         |
| Static HTTP                | **3/3**                                     |
| Playwright / sistem Chrome | **36/36**; gerçek out/ statik sunucusu      |
| Responsive regresyon       | **320, 393, 768, 1280 px**                  |

Çalıştırılan komutlar:

```bash
npm run check
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

Yeni politika; izinli veri yolları, kod/config/secret yollarının reddi, traversal,
mode/symlink/submodule, silme/rename, byte/adet/toplam sınırı, bozuk manifest ve
hata metnindeki log satırı enjeksiyonu için testlidir. Şema/medya/harici yayın testi değildir.

İlk typecheck üretilmiş duplicate tip kopyalarında durdu. Kopyalar kaynaklara
karışmadan `/private/tmp/bal-v5-generated-copies-l3t_twe_` içine taşındı ve son tam
tur başarıyla geçti. Tip kuralları gevşetilmedi.

## WARNING

- Public mevcut durumdur; Public/Private tercihi henüz yanıtlanmadı. Hesap planı ve
  gerçek branch protection/secret ayarları yetkili bağlantıyla okunmadı.
- CMS'de ayrıntılı RBAC, editöre özel branch lock veya native boyut/piksel/EXIF
  kontrolü doğrulanmadı. E-posta collaborator tek başına tüm yayın güvenliği değildir.
- CMS kaynak kurulum manifesti geniş izinler istiyor; hosted gerçek kurulum izni
  görülmedi. main bypass yokluğu ve en az yetki tamamlandı denmez.
- JSON migration/.pages.yml/App/davet/aktif Actions/Pages yok. Yeni helper yalnız
  manifest ön kontrolüdür; JSON/medya decode/yetki/atomik merge doğrulayıcısı değildir.
- Tam otomatik save sonrası yayın henüz kanıtlanmadı. Güvenli alternatif ve
  GITHUB_TOKEN tetikleme/Private plan sınırlamaları SECURITY belgesindedir.
- Gerçek logo, fotoğraf, ürün listesi, şube kimliği, sosyal hesap ve domain eksikleri sürer.
- Yeni WebKit/Firefox/fiziksel cihaz veya axe taraması çalıştırılmadı; önceki kısıtlar sürer.

## FAIL

Son toplu doğrulamada başarısız test veya açık yerel hata yok. İlk generated tip
sorunu giderilerek tüm kontroller tekrar geçti. Harici entegrasyonlar çalıştırılmadı;
başarılı olarak raporlanmadı ve hiçbir güvenlik kapısı kaldırılmadı.

## Kanıtlar, Git ve sıradaki iş

Snapshot: /private/tmp/bal-v5-start-epqoprmo/source.tar.gz. Güncel anonim repo
metadata: /private/tmp/bal-v5-github-repo-latest.json. Resmî kaynak linkleri
CMS_SETUP/SECURITY/DEPLOYMENT belgelerindedir.

Yeni kod: src/lib/content-change-policy.ts ve test dosyası. Diğer değişiklikler
kurallar, plan ve rehberlerdir; hepsi commit edilmemiştir. Remote/branch/push/App/
davet/deployment yapılmadı. İlk sıradaki uygulama önerisi: altı kategori JSON pilotu.
Ürün sahibi şu an Public/Private tercihini ve planı değerlendirebilir; henüz gerçek
CMS ekranı veya dış preview test edilemez.

Playwright HTML: `playwright-report/index.html`; son durum `test-results/.last-run.json`.
Build kanıtı `.next/static-export-report.json`. Bunlar ignore kapsamındadır.
Değişen kaynaklar: `AGENTS.md`, `README.md`, `plan.md`, mimari/yol haritası/içerik/
kalite belgeleri, tarihsel `PHASE4_PLAN.md`, yeni beş CMS/yayın/güvenlik/geri alma/
editör rehberi ve iki yerel policy dosyası. Uygulama render/veri ve eski testler değişmedi.
