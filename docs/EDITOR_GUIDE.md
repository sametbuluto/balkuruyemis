# Ali Bey için içerik rehberi — kurulum öncesi taslak

**Sistem henüz hesabınıza bağlanmadı, davet gönderilmedi ve site yayınlanmadı.**
Bu rehber kurulacak akışı anlatır. Gerçek giriş ekranları ve size verilecek CMS
bağlantısı, kurulum ve kullanıcı testinden sonra buraya eklenecek.

## İçerik düzenleme

1. Size gönderilecek gerçek CMS bağlantısına girin ve e-posta davetini kullanın.
2. İçerik düzenleme dalı `content-edit` olmalı. Başka dal görürseniz değiştirmeden
   teknik sorumluya haber verin. Şimdilik böyle bir dal oluşturulmadı.
3. Ürün, kategori, şube veya ilgili metin alanını açın; gerçek bilgileri girin.
4. Hazır olmayan ürünü **Taslak** bırakın. Yayından kaldırmak için de Taslak seçin;
   kayıt silmek veya dosya adı değiştirmek normal içerik işi olmayacak.
5. Fotoğrafı doğru ürün/konumla eşleştirin; “fotoğrafta ne var” sorusunu yanıtlayan
   kısa alternatif metin yazın. Adres/telefon/saat bilinmiyorsa tahmin etmeyin.
6. Kaydedin. Kaydetmek içeriğin Git'e yazılmasıdır; ziyaretçilerin gördüğü siteye
   geçtiği anlamına gelmez. Yayın kontrolü başarısızsa mevcut doğru site korunmalı.

Tam otomatik yayın henüz yoktur. Güvenli ilk alternatif, kayıttan sonra **Yayına
gönder** düğmesiyle kontrolleri başlatmak olabilir; bunun gerçek CMS'de kurulup
denenmesi gerekir. Son akışta teknik sorumlunun her kayıt için onayı hedeflenmez.

## Dört konum

Konum 1–4 gerçek koordinatlardır. Henüz ad ve açık adres eşleşmesi doğrulanmadı.
Bir kayda isim verirken hangi konum olduğundan emin olun; aynı şubeyi ikinci kez
eklemeyin. Harita, telefon veya sosyal hesap adresini tahmin ederek doldurmayın.

## Fotoğraflar

Yalnız işletmenin kullanımına uygun gerçek dosyaları yükleyin. Başlangıç önerisi
en fazla 5 MiB raster dosyadır; kesin sınırlar kurulumda uygulanıp açıklanacak.
Fotoğrafın alt metnini ve doğru kategori/şubeyi kontrol edin. Telefonda görünen
dosya adının doğru olması tek başına fotoğrafın doğru şubeye ait olduğunu kanıtlamaz.

## Bir sorun olursa

- **Yanlış ürün kayboldu:** tekrar tekrar yeni kayıt eklemeyin; ürün adını ve yaklaşık
  işlem saatini teknik sorumluya bildirin. Git geçmişinden kurtarma gerekir.
- **Saat veya fotoğraf yanlış:** doğru bilgiyi aynı kayıtta düzeltin; yanlış kaydı
  ayrıca not edin. Hata ziyaretçiye yansıyorsa teknik sorumluya haber verin.
- **Kaydettim ama sitede yok:** taslak mı kontrol edin. Başarılı/başarısız kontrol
  bilgisini not alın; aynı işlemi çok kez tekrarlamayın.
- **Build başarısız / hata mesajı:** hangi kaydı değiştirdiğinizi ve görünen hatayı
  iletin. Bir token veya hesap şifresi paylaşmanız gerekmez.

Teknik sorumlu için kurtarma farkı: [ROLLBACK](ROLLBACK.md). Eski yayına dönmek,
GitHub'daki hatalı kaydı kendiliğinden düzeltmez.

## Medya hazırlığının güncel sınırı

Fotoğraf seçici/yükleme ekranı henüz yoktur. Gelecekte Ali Abi fotoğrafı seçip Türkçe
alt açıklama, yayın ve sıralamayı düzenler; piksel ölçüsü veya kod girmesi beklenmez.
Bunu sağlayacak metadata adaptörü ve gerçek editör testi henüz yapılmadı. Şu an
boyutu yanlış yazılmış veya bozuk dosya build'i durdurur; siteye gönderilmez.
Tam kabul: panelden ürün adı/fotoğraf/ana sayfa metni değiştirilince otomatik kontroller
geçer ve yeni içerik Cloudflare üzerinde görülür. Bu sonuç henüz doğrulanmadı.
