# Sitemap'i Yeniden Gönderme Rehberi

## Google Search Console'dan Sitemap'i Yeniden Gönderme

### Adım 1: Google Search Console'a Giriş Yap
1. [Google Search Console](https://search.google.com/search-console) adresine git
2. `https://www.evvalley.com` property'sini seç

### Adım 2: Sitemap'i Yeniden Gönder
1. Sol menüden **"Sitemaps"** (Site Haritaları) seçeneğine tıkla
2. Mevcut sitemap'i görüntüle: `https://www.evvalley.com/sitemap.xml`
3. Eğer sitemap listede yoksa:
   - **"Yeni sitemap ekle"** (Add a new sitemap) butonuna tıkla
   - `sitemap.xml` yaz ve **"Gönder"** (Submit) butonuna tıkla
4. Eğer sitemap zaten varsa:
   - Sitemap'in yanındaki **"Yeniden gönder"** (Resubmit) butonuna tıkla
   - Veya sitemap'i silip tekrar ekle

### Adım 3: URL İste (Opsiyonel - Hızlı İndeksleme İçin)
1. Sol menüden **"URL İste"** (URL Inspection) seçeneğine tıkla
2. Önemli sayfaların URL'lerini tek tek gir ve **"İndeksleme İste"** (Request Indexing) butonuna tıkla
3. Örnek URL'ler:
   - `https://www.evvalley.com/`
   - `https://www.evvalley.com/vehicles`
   - `https://www.evvalley.com/blog`
   - `https://www.evvalley.com/vehicles/ev-cars`
   - `https://www.evvalley.com/vehicles/hybrid-cars`

### Adım 4: Doğrulama
1. **"Sitemaps"** sayfasında sitemap'in durumunu kontrol et
2. **"Başarılı"** (Success) durumunda olmalı
3. **"Gönderilen URL sayısı"** (Submitted URLs) sayısını kontrol et
4. Google'ın sitemap'i işlemesi 1-2 gün sürebilir

## Sitemap URL'i
Sitemap'iniz şu adreste mevcut:
- **https://www.evvalley.com/sitemap.xml**

## Otomatik Güncelleme
Sitemap otomatik olarak her saat güncellenir (`revalidate: 3600`). 
Yeni sayfalar eklendiğinde veya mevcut sayfalar güncellendiğinde sitemap otomatik olarak güncellenir.

## Sorun Giderme

### Sitemap Bulunamıyor Hatası
- Sitemap URL'ini tarayıcıda aç: `https://www.evvalley.com/sitemap.xml`
- XML formatında görünüyorsa sitemap çalışıyor demektir
- Google Search Console'da tekrar dene

### Sitemap İşlenmiyor
- Sitemap'in XML formatında olduğundan emin ol
- Sitemap'teki URL'lerin geçerli olduğundan emin ol
- Robots.txt dosyasının sitemap'i engellemediğinden emin ol

### URL'ler İndekslenmiyor
- Sayfaların `robots: { index: true }` olduğundan emin ol
- Sayfaların canonical URL'lerinin doğru olduğundan emin ol
- Sayfaların içerik kalitesinin yeterli olduğundan emin ol
- Internal linking'in yeterli olduğundan emin ol

## İçerik Güncellemeleri
Sitemap otomatik olarak şunları içerir:
- ✅ Tüm statik sayfalar (Ana sayfa, Hakkında, İletişim, vb.)
- ✅ Tüm kategori sayfaları (EV Cars, Hybrid Cars, E-Bikes, E-Scooters)
- ✅ Tüm aktif araç ilanları (satılmamış, max 1000 adet)
- ✅ Tüm blog yazıları
- ✅ Blog kategori sayfaları

## Notlar
- Sitemap her saat otomatik güncellenir
- Yeni sayfalar eklendiğinde sitemap'e otomatik eklenir
- Satılan araçlar sitemap'ten otomatik kaldırılır
- Sitemap'te maksimum 1000 araç gösterilir (en güncel olanlar)

