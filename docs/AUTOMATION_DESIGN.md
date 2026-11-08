# Güvenli içerik yayını — Faz 4.2-a hazırlığı

**8 Kasım 2026 / E2 güncellemesi:** Yerel workflow/GET observer/Git gate/Docker
validator uygulaması [TRUSTED_CI_IMPLEMENTATION](TRUSTED_CI_IMPLEMENTATION.md)
içinde kayıtlıdır. Main-bootstrap değişmedi; uzak workflow/run, attester, required
check ve otomatik aktarım kurulmadı. Yerel ve gerçek GitHub kabulü ayrıdır.
Aşağıdaki E1 ve daha eski bölümler tarihsel aşamaların kayıtlarıdır.

7 Kasım 2026. **Yerel Git/candidate araçları ve negatif testler çalışır; GitHub
Actions/korumalar/App tokenları ve Cloudflare kurulmadı.** Gerçek kurulum kapıları
[GITHUB_READINESS](GITHUB_READINESS.md) içinde. Normal site static export kalır.

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

## Hedef akış ve güven sınırı

Pages CMS → content-edit (raw veri) → trusted Git envanteri → aynı trusted kodla
normalizasyon → canonical üç yönlü merge → izole candidate → tam testler → exact
candidate required check → korunan PR → main → Cloudflare. Ali Bey kod, JSON,
piksel veya terminal kullanmaz. Backend/DB/özel admin eklenmez.

CMS App main'e doğrudan yazamaz. Site main yalnız required PR/checks ile ilerler;
App/bot/admin bypass, force push ve deletion kapalı olmalı. Raw source build/deploy
edilmez; Cloudflare content-edit preview'u da kapalıdır. GitHub'da bu koşulların
**gerçekten reddedildiği** kanıtlanmadan otomatik yazma açılmaz.

## Bu fazda gerçekten çalışan yerel parçalar

### Git ingress

src/publishing/git-source.server.ts fixed main/content-edit ref'lerini tam SHA ile
pinler; tek merge-base ister. Git bloblarından gerçek status/mode/byte envanteri
üretir. 4.1-a policy'nin A/M/path/byte/adet/toplam sınırını kullanır; aktif olmayan
legacy singleton yollarını ayrıca reddeder. Tek code/workflow/.pages/env değişimi,
silme/rename, executable/symlink/gitlink veya büyük dosya bütün paketi durdurur.

Source commit checkout edilmez; Git show/cat-file filtreleriyle code çalıştırılmaz.
Hook/fsmonitor/external diff kapalı, replace refs kapalı; credential/env tokenları
child Git'e taşınmaz. Okuma wrapper'ı push/update-ref gibi alt komutları reddeder.
Data-only snapshot'lar Git nesnelerinden ayrı temp dizine çıkarılır. Kaynak çalışma
ağacı, index, HEAD ve refs değiştirilmez. Bu bir GitHub transport/auth istemcisi değildir.

### Normalizasyon ve merge

Base B, current main M, raw source C aynı trusted kod/encoder ile normalize edilir.
Böylece aynı fotoğrafın metadata/encoder veya JSON format farkı sahte değişim olmaz.
Canonical S=N(C,B), N(B), N(M) üzerinde üç yönlü merge uygulanır:

- Source B ile aynıysa current main kazanır; eski snapshot main'i geri almaz.
- Main B ile aynıysa source değişimi alınır; iki taraf aynı değiştiyse kabul edilir.
- Nesnelerin bağımsız alanları birleşebilir; aynı alan çatışması durur.
- Diziler/binary ve fotoğraf nesneleri atomiktir. Eski caption/ölçü farklı fotoğrafa
  taşınmaz; iki bağımsız fotoğraf değişiminden biri rastgele seçilmez.
- Birleşmiş telefon/e-posta/sosyal URL için yalnız **aynı current-main değere bağlı**
  mevcut onay korunur. Eşzamanlı başka değere verilmiş verified onayı taşınmaz.

Sonuç mevcut strict kategori/ürün/şube/galeri/sayfa/ayar/duyuru ve dosya decode
kurallarından tekrar geçer. Kimlik hash kapısı korunur. Hazırlık sonunda refs tekrar
kontrol edilir; M/C ilerlemişse çıktı yazılmaz. Birleşim yeni bir iş kuralı hatası
(ör. yanlış ref/tarih aralığı/medya ölçüsü) üretirse candidate reddedilir.

`npm run publishing:simulate -- <yerel-repo> <mainSHA> <contentSHA> <ayrı-boş-output>`
yalnız canonical data ve publication-report.json üretir. candidateCommitSha=null,
fullChecksRun=false ve remoteProtectionVerified=false bilerek raporlanır. Çıktı,
üzerinde Git commit/test yapılmadan merge kanıtı değildir. Gerçek code tree'si
trusted M'den gelmeli; source paket/script/workflow'u çalıştırılmaz.

### Yerel promotion modeli

simulatePromotionGate yalnız policy simülatörüdür. Tam proof profili varsayımsal
geçer; direct main write, eski main/source/PR SHA, yanlış parent/workflow, raw/kod
candidate, eksik koruma, App/admin bypass, yanlış App/context/SHA veya skipped/
neutral/failure check reddedilir. Validator'ın write token/secret/source code veya
source artifact'a güvenmesi reddedilir.

Bu bool/SHA alanları **yetki veya imza değildir**. Gerçek connector bunları bağımsız
GitHub API/Git nesnelerinden okumalıdır; workflow input'u, CMS payload'u veya
attacker artifact'ı kendine “verified” diyerek kanıt üretemez. Şu an API observer,
Check Run üretimi, PR veya merge writer yoktur; simülatör uzak işlem yapamaz.

## Gerçek Actions'a geçiş sözleşmesi — uygulanmadı

| Aşama               | Kod / yetki                                                                                             | Zorunlu doğrulama                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Uyandırma           | content-edit olayı yalnız sinyal; token yazması, checkout/cache/artifact yok                            | Repo/dal/run bilgisi yeniden API'den; sinyalin yeşili güven kanıtı değil                                    |
| Snapshot/validation | Trusted main SHA kodu; contents:read veya fetch sonrası permissions:{}; write token/secret/id-token yok | Tam M/C/B, gerçek path/mode/byte, normalization/merge; source script/paket/workflow yok                     |
| Full checks         | Aynı izole candidate üzerinde typecheck/lint/format/unit/config/build/HTTP/E2E                          | Source branch npm install/test çalıştırılmaz; yalnız trusted M paket/lock/scripts; başarısızlıkta yayın yok |
| Check attestation   | Ayrı, yalnız main-ref protected environment; minimum checks:write + gereken read                        | Actual tested candidate SHA/fingerprint, trusted workflow SHA/run bağlantısı ve expected App ID             |
| Candidate PR        | Ayrı minimum contents:write + pull_requests:write bot; workflows/admin/bypass yok                       | M üstüne yalnız doğrulanmış data tree, exact SHA; kod tree'si M ile aynı                                    |
| Auto-merge          | Required checks + strict up-to-date base; bypass yok                                                    | PR head, current M/C ve API sonuçları tekrar; server merge-time kuralları                                   |
| Cloudflare          | Yalnız main Git entegrasyonu; ayrı deployment onayı                                                     | Main SHA/deployment/HTTP zinciri; başarısız build önceki başarılı yayını korur                              |

Plan gerçek App izinleri/hesap planı görülmeden token veya secret yaratmaz. CMS
App'in geniş tokenı validator/merger tokenı olarak kullanılmaz. Validator check
kimliğiyle candidate writer ayrılır; writer kendisine başarılı check veremez.
Token mint eden işte source code/paket/zip çalıştırılmaz. İzin kapsamı hedef repo
ve ihtiyaç duyulan iş ile sınırlı olmalı; App private key'i repo genel secret olarak
content-edit workflow'una açılmamalıdır. Protected environment selected branch
**yalnız main** olmalı; yokluğu veya default açık ortam güvenli kabul edilmez.

Native GITHUB_TOKEN'ın push/PR tetikleme davranışı tam otomasyon için varsayılmaz.
Bot PR workflow'ları insan “Approve workflows to run” durumuna takılabilir. Ayrı
App tokenı/dispatch seçimi gerçek test ister. workflow_run write/secrets sınırına
sahip olabilir; önceki source artifact/cache/yeşil test sonucuna güvenilmez.
[Token yetkileri](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token),
[tetikleme davranışı](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow),
[workflow_run güven sınırı](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run).

## Required check ve teknik PR ayrımı

İçerik otomatik PR'ı için önerilen benzersiz context content-candidate/trusted-validation;
expected App ID gerçek kurulumda API'den teyit edilip bağlanır. Eksik/neutral/skipped
check başarı sayılmaz. Teknik code/workflow değişimi içerik otomasyonuna girmez;
onun için ayrı trusted validation ve teknik inceleme modu gerekir. Tek içerik
check'ini bütün teknik PR'ları kilitleyen eksik bir ruleset olarak aktive etmeyin.
Teknik PR'ın source code'u ayrı sırsız işte test edilmeli, writer secret'ıyla çalışmamalı.

Global insan review şartı içerik yayınında hedeflenmez; teknik değişiklik kontrolü
ayrı yapılır. CODEOWNERS/hidden yalnız başına güvenlik değildir. Admin dahil PR ve
checks enforcement ve App integration ID gerçekten doğrulanmalıdır. Şu an repo
boş/main yok; bu gereksinimler sunucuda uygulanmış değildir.

## Eşzamanlılık ve geri alma

Repo bazlı trusted concurrency/queue gerekli ama tek başına atomik değildir. Her
candidate B/M/C kaydeder. M ilerlerse yeniden merge/test; C ilerlerse yeni kayıt
kuyruğa alınır, önceki kanıt tekrar değerlendirilir. GitHub iki farklı ref'i tek
atomik işlemle kilitlemez; local son pin kontrolü remote CAS değildir. Server strict
checks + exact PR head, eski candidate'ın daha yeni main'i geri almasını engellemeli;
bu gerçek yarış testiyle kanıtlanır. Sonraki CMS commit'inin kaybolmaması ve eventual
son içeriğe ulaşılması izlenir; sadece tek başarılı run yeterli değildir.

Main merge sonrası canonical verinin content-edit'e üç yönlü, çatışma kontrollü
senkronizasyonu gerekir; kör copy/reset/force yoktur. Çatışmada otomatik iş durur,
teknik sorumlu çözer. Source düzeltme commit'i ile Cloudflare deployment rollback
ayrıdır; yanlış kaynağı düzeltmeden eski deployment'a dönmek sonraki yayında hatayı
tekrar getirir. Repo/EXIF/plan şartları sağlanmıyorsa otomatik yazma açılmaz.

## Yerel kanıt ve eksikler

63 yeni güvenlik/unit senaryosu gerçek temp Git mode/blob/refs, conflict/race, fake
check ve koruma durumlarını sınar. İzole Git candidate export 2/2, native CMS şekli
→ Git refs → normalization/merge → gerçek static build/HTTP/Chrome ve conflict reddini
kanıtlar. Dört genişlik 320/393/768/1280. Örnek ürün/metadata'sız geometrik test PNG
gerçek kaynak/out'a eklenmez. `npm run publishing:audit` geçmiş taramasını tekrarlar.

Aktif workflow, API observer, gerçek required-check App, writer, protection/bypass,
hosted editör oturumu ve Cloudflare testi yapılmadı. Bunlar önemsiz ayrıntılar değil,
gerçek otomatik yayına geçiş kapılarıdır. Yerel PASS, uzak güvenlik PASS değildir.
