# Bal Kuruyemiş — Faz 2 / 2.1 son kalite raporu

Tarih: **30 Ekim 2026**. Güncel değerlendirme Faz 2.1 görsel revizyonunu içerir.
Önceki Faz 2 bulguları ve çözüm geçmişi [plan.md §10–11](../plan.md) içindedir.

## PASS

| Kontrol                                | Sonuç                                          |
| -------------------------------------- | ---------------------------------------------- |
| TypeScript strict / ESLint / Prettier  | Başarılı; lint uyarısı 0                       |
| Vitest                                 | **17/17**, 8 dosya                             |
| Production build                       | Webpack ile başarılı                           |
| Production Playwright / sistem Chrome  | **27/27**, masaüstü + mobil + tablet           |
| Geliştirme modu sticky / smooth scroll | **1/1**                                        |
| Ekranlar                               | **320, 393, 768, 1280 px**; taşma/kırpılma yok |
| Axe 4.14.0                             | **20 taramada otomatik ihlal 0**               |

- Navbar'da konum yazısı yok; sticky, klavye, Escape, odak ve aktif rota korunuyor.
- Kategori adının görünür metinle uyuşmazlığı, düşük kontrastlı numaralar ve
  bordo/gold metin sorunu yeni palet/semantik uygulamada giderildi.
- İç linkler gerçek HTTP 200 yanıtlarıyla doğrulandı; boş/sahte sosyal link yok.
- Metadata, Türkçe, tek H1, açıklama ve OG/Twitter başlıkları gerçek DOM ile karşılaştırıldı.
- Alan adı yokken noindex, robots disallow, boş sitemap ve canonical/görsel URL yokluğu doğru.
  Doğrulanmış alan adı senaryosu unit testinde izolasyonla ayrıca doğrulandı.
- Dört örnek şubenin her biri ve bilinmeyen sayfa HTTP 404/noindex döndürüyor.
  Örnek şubeler gerçek kayıt, sitemap veya aktif iletişim bağlantısı olmuyor.
- Apple ikon 180×180, paylaşım PNG 1200×630; favicon adresi çalışıyor.
- Görsel alanlar responsive; kategori/şube fotoğrafları fill + sabit oran,
  galeri lazy, hero gerçek fotoğraf gelirse preload kullanıyor.
- Paketler, strict TS ayarları, veri modelleri, içerik kaynakları ve SEO işlevleri
  snapshot ile karşılaştırılıp korundu. Mevcut testler kaldırılmadı.
- Git main, ilk commit öncesi. Kullanıcı değişiklikleri ve 3000 dev sunucusu korundu.
  Commit, remote, veritabanı, admin, auth veya deployment işlemi yapılmadı.

Komutlar:

```bash
npm run check
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
PLAYWRIGHT_SERVER=dev PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- --project=desktop-chromium --grep 'sticky menü' --reporter=list
```

## WARNING

- **Playwright Firefox 1555 ve WebKit 2370 kurulu değil.** Başlatma denemeleri
  “Executable doesn't exist” hatası verdi; bu tarayıcılarda test yapılamadı.
  Sistem Safari ile gerçek cihaz testi yapılmadı. Chrome sonucu Safari sonucu sayılmaz.
- Playwright'ın beklediği bundled Chromium 1248 de yok; testler kurulu Chrome
  üzerinden `PLAYWRIGHT_CHANNEL=chrome` ile çalıştırıldı.
- Axe taraması mevcut 3000 geliştirme sunucusunda yapıldı; production HTTP/DOM
  davranışı ayrı 27 Playwright testiyle doğrulandı.
- Axe, hero'daki geometrik zemin üzerinde üç tipografik öğenin kontrastına otomatik
  karar veremedi. Ekran görüntüleri ve renk hesabıyla manuel incelendi. Beyaz/antrasit
  **17.59:1**, beyaz/kırmızı **5.59:1**, gövde metni/gri **6.28:1**, gold/antrasit
  **6.57:1**. Beyaz dekoratif çizgi kesişimindeki muhafazakâr koyu griyle **9.61:1**.
  Otomatik tarama, tam WCAG sertifikası veya ekran okuyucu kullanıcı testi değildir.
- Gerçek logo, mağaza/ürün görselleri, ürün listeleri, şube adres/telefon/saatleri
  ve sosyal URL'ler bekleniyor. Tabela uyumu ürün sahibinin renk tarifine dayanıyor.
- Gerçek alan adı gelene kadar noindex/boş sitemap bilinçli; canlıya çıkışta
  doğrulanmış domain ve gerçek içerikle ayrıca kontrol gerekir.

## FAIL

Son çalıştırılan testlerde başarısız kontrol veya açık kritik hata yok.
Önceki axe ihlalleri revizyon sonrasında yeniden taranarak giderildi.
Eksik tarayıcılar WARNING olarak ayrı tutuldu; başarılı test olarak sayılmadı.

## Kanıtlar

- Master kayıt: [plan.md](../plan.md).
- Playwright HTML: `playwright-report/index.html`; son durum: `test-results/.last-run.json`.
- Responsive ekran görüntüleri: `test-results/site-sticky-*` cihaz sonuç klasörleri.
- Axe JSON: `test-results/axe-phase21.json`; kalıcı olmayan çalışma kopyası
  `/private/tmp/balproject-phase21.2Tfv2p/axe-after.json`.
- Revizyon öncesi axe bulguları:
  `/private/tmp/balproject-final-quality-20261030/axe-report.json`.
