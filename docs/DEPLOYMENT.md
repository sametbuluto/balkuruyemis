# GitHub / Cloudflare Pages — V5 yayın hazırlığı

30 Ekim 2026 araştırması; 1 Kasım 2026 yerel tamamlama. **Push, App kurulumu ve deployment yapılmadı.**

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

## İlk push için gereken sıra — uygulanmadı

1. Mevcut webhook/App/Cloudflare bağlantılarının ilk push ile yayın tetiklemeyeceğini
   hesap sahibi doğrulasın. Public/Private tercihini ve gerçek GitHub planının required checks/auto-merge
   desteğini kesinleştir; [SECURITY](SECURITY.md) koşulları geçerli.
2. Çalışma ağacındaki kaynak/belge değişikliklerini gözden geçir; gereken yerel
   commit için yetki netleşsin. 4.1-c2 geri dönüş noktası `0507348`; c3 sonunda medya altyapısı da yerel commit ile kaydedilir.
3. Uzak ref'leri tekrar read-only kontrol et; şu an boş olsa da başka birinin eklediği
   geçmiş varsa koru. Yeniden git init/README overwrite veya force push yapma.
4. Kullanıcı push yetkisi verdiğinde origin hedefi
   `https://github.com/sametbuluto/balkuruyemis.git` olarak eklenir; review edilmiş
   main gönderilir. Bu tur remote dahi değiştirilmedi.
5. Bootstrap sonrası main koruması/required checks ve bypass kapalı davranışı
   yapılandırılıp denenir; content-edit korunmuş main'den oluşturulur.
6. CMS ve otomatik aktarım izinleri ayrıca [CMS_SETUP](CMS_SETUP.md) sırasıyla kurulur.

GitHub App, davet, branch protection veya repo görünürlüğü değiştirmek bu belgedeki
adımları yazmakla yetkilendirilmiş olmaz; mevcut talimat bu dış yazmaları kapsamıyor.

## Pages planı

| Ayar         | Hedef                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| Preset       | Next.js (Static HTML Export)                                                   |
| Build        | npm run build                                                                  |
| Çıktı        | out                                                                            |
| Üretim dalı  | main                                                                           |
| content-edit | Production değil; başlangıçta preview da kapalı                                |
| Preview      | Gerekirse yalnız doğrulanmış bot/candidate dalı; erişim ayrıca değerlendirilir |
| Domain       | İlk değerlendirmede gerçek domain yok; Pages'in verdiği adres kullanılacak     |
| SEO          | NEXT_PUBLIC_SITE_URL boş, NEXT_PUBLIC_ALLOW_INDEXING=false                     |

Node sürümü package engines ile uyumlu sabitlenip gerçek Pages build'inde sınanacak.
Pages main'i production environment diye adlandırsa da ilk site işletme sahibinin
noindex değerlendirmesidir. Domain satın alma, DNS/HTTPS/Search Console ve indeksleme
açılması Faz 7'dir. API server/Functions/DB gerekmiyor.

[Resmî Next static rehberi](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).
[Branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
ile content-edit dışlanır; varsayılan tüm dalların preview'ı açık bırakılmaz.
Preview URL'lerinin varsayılan public olduğu ve noindex'in erişim kontrolü olmadığı
[resmî belgede](https://developers.cloudflare.com/pages/configuration/preview-deployments/) açıklanır.

Free kota kontrolü, 30 Ekim 2026: ayda 500 build, eşzamanlı 1 build, build süresi
20 dakika, 20.000 dosya, tek asset 25 MiB. Gerçek fotoğraflar ve içerik yayın sıklığı
sonrasında kapasite tekrar ölçülecek. Yüklü fotoğraf Git geçmişi ayrı sınırdır.
[Cloudflare limits](https://developers.cloudflare.com/pages/platform/limits/).

## Gerçek bağlantı sonrası kabul kanıtı — şu an yok

- Başarılı candidate SHA → main SHA → Pages deployment ID/commit ilişkisi.
- Gerçek host üzerinde 200/404, PNG MIME, RSC/kategori navigasyonu ve tüm Maps linkleri.
- Default noindex, robots, boş sitemap ve `_headers` davranışı.
- Hatalı içerik main'e geçmez; başarısız Cloudflare build mevcut siteyi değiştirmez.
- Son başarılı production deployment geri yüklenir; preview rollback hedefi değildir.
- Content-edit değişikliği doğrudan bir site yayını başlatmaz.
- Build logunda token/sır yok; hesap/izin ve required-check ekranları kontrol edilir.

Bu dış testlerin hiçbiri şu an yapılmadı. Yerel out/ testleri yalnız yerel statik
davranışı doğrular. GitHub hesabının özel planı/secret/rules ayarları ve Cloudflare
build/deployment geçmişi yetkili bağlantı olmadan incelenemedi.

## Medya pipeline ve gerçek kabul

Hosting build komutu yalnız npm run build olmalıdır; sadece next build medya sanitize
ve taslak dosya dışlamasını tamamlamaz. Başarılı komutun out/ çıktısı dağıtılır;
.generated/ veya public/ kaynağı doğrudan yayımlanmaz. Bozuk medya/metadata veya build
sırasında input değişimi kontrolü durdurur. Kaynak raw EXIF temizlenmiş sayılmaz.
Ali Abi'nin gerçek CMS değişikliği → trusted kontroller → otomatik korunan aktarım →
Cloudflare yayın → HTTP/source SHA kanıtı gerçek hesaplarda geçmeden CMS tamamlanmaz.
Bu belge bu dış işlemleri başlatma yetkisi değildir; bu fazda deployment yapılmadı.

## C4 teknik build anı ve duyurular

Standart `npm run build`, build-site.mjs üzerinden tek SITE_BUILD_AT ile medya
check → Next → sanitize → verify çalıştırır. Tarih canonical UTC milisaniye biçimidir;
CMS ayarı veya public env değildir. Boş/bozuk açık değer build'i durdurur.
Duyurunun başlangıç/bitişinin uygulanması yeni başarılı build/deployment gerektirir.
Zamanlanmış tetikleme bu fazda kurulmadı; bu ihtiyaç ayrıca tasarlanıp gerçek
Cloudflare yayın geçmişinde sınanmalıdır. Yerel tarih testi harici yayın kanıtı değildir.

## C5 bağlantıya geçiş ön koşulları

.pages.yml ve medya adaptörü yerel prototiptir. Kullanıcı işlemleri/sıra ve PENDING
kabul tablosu CMS_ACCEPTANCE.md içindedir. Önce EXIF/repo görünürlüğü kararı, açık
push/App/koruma/davet yetkileri ve trusted candidate CI; sonra ayrıca Cloudflare
önizleme deployment onayı gerekir. Yalnız main npm run build/out ile yayımlanır;
content-edit otomatik preview'u kapalı olmalıdır. Raw CMS kaydı doğrudan Next build
girdisi değildir, teknik candidate dönüşümü zorunludur. Normalizasyon raporu→tested
candidate SHA→merge SHA→Cloudflare source commit/HTTP zinciri gerçek hesapta kanıtlanır.
