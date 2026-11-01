# İçerik ve yayın geri alma planı

30 Ekim 2026 araştırması; 1 Kasım 2026 yerel tamamlama. Yerel Faz 3 geri dönüş commit'i `78df0f7`; ilk baseline `b844bad`.
Mevcut kaynak snapshot'ı `/private/tmp/bal-v5-start-epqoprmo/source.tar.gz`.
Harici CMS/yayın kurulmadığından aşağıdaki dış işlemler henüz denenmedi.

## A. İçerik kaynağını düzeltme

GitHub'daki doğru kayıt sürümü bulunur; yalnız ilgili JSON/medya dosyaları yeni bir
düzeltme commit'iyle geri getirilir. Kod geçmişi resetlenmez ve force push yapılmaz.
İlişkili kategori/görsel referansları birlikte kontrol edilir. Düzeltilmiş içerik
normal doğrulama ve korunan PR akışından geçer. content-edit'te bekleyen eski hatalı
değişiklik de düzeltilir; aynı hatanın yeniden aktarılmasına izin verilmez.

## B. Görünen yayını geri çevirme

Cloudflare'da önceki başarılı **production** deployment hedeflenir. Bu, GitHub'daki
kaynak dosyaları değiştirmez. Acil geri dönüşten sonra A adımıyla kaynak düzeltilmezse
sonraki build hatalı içeriği yeniden yayımlayabilir. Gerekirse teknik sorumlu
otomasyonu geçici durdurur; kontrol ve yeniden açma kayıt altına alınır.
Preview deployment bu rollback işleminin hedefi değildir.
[Cloudflare rollback](https://developers.cloudflare.com/pages/configuration/rollbacks/).

## Sınanacak senaryolar

| Senaryo                        | Beklenen koruma / düzeltme                                                                    | Bu tur durumu                            |
| ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Yanlış ürün silinmesi          | Delete/rename UI kapalı; diff silmeyi reddeder; teknik sorumlu stable ID'li kaydı kurtarır    | Yalnız yerel manifest silme reddi testli |
| Hatalı çalışma saati           | Mantıksal olarak makul ama yanlış saat otomatik kesin bilinemez; işletme sahibi düzeltir      | Dış CMS/kurtarma denenmedi               |
| Yanlış fotoğraf                | Bozuk dosya decode ile durdurulur; geçerli ama yanlış eşleşme insan incelemesi/düzeltme ister | Decode ve dış kurtarma bekliyor          |
| Başarısız build                | main aktarılmaz veya Pages'te önceki başarılı site kalır; loga göre düzeltme                  | Gerçek GitHub/Pages testi bekliyor       |
| Eşzamanlı kayıt/merge conflict | Stale candidate durdurulur; iki değişiklik sessizce kaybolmaz                                 | Tasarım var, entegrasyon testi yok       |

Geri alma dosyaları aynı içerik doğrulamasından geçmelidir. Eski bir dosyanın mevcut
şemayla artık uyumlu olmaması otomatik yayını durdurur; güvenlik kontrolü atlanmaz.
Ali Bey için ilk destek adımları [EDITOR_GUIDE](EDITOR_GUIDE.md) içindedir.
