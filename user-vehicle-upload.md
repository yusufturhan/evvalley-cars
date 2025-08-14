# Kullanıcı Araç Yükleme Sistemi

## 🎯 Kullanıcı Araç Yükleme

### Kullanıcı Bilgileri:
- **Email:** [Kullanıcının email'i]
- **Clerk ID:** [Clerk user ID]
- **Araç Sayısı:** [Kaç araç yüklenecek]
- **Araç Türü:** [EV, E-scooter, E-bike]

## 📋 Araç Yükleme Adımları

### 1. Kullanıcı Hesabına Erişim
- **Clerk Dashboard**'dan kullanıcıyı bulun
- **User ID**'yi not edin
- **Email** doğrulaması yapın

### 2. Araç Bilgilerini Hazırlama
- **Araç detayları** toplayın
- **Fotoğraflar** hazırlayın
- **Fiyat bilgileri** belirleyin
- **Açıklamalar** yazın

### 3. Database'e Yükleme
- **Supabase**'e araçları ekleyin
- **Clerk user ID** ile ilişkilendirin
- **Status** = "active" yapın
- **Created_at** timestamp ekleyin

## 🚗 Araç Yükleme Template

### EV Template:
```json
{
  "user_id": "clerk_user_id",
  "title": "2022 Tesla Model 3 Long Range",
  "description": "Excellent condition Tesla Model 3 with full self-driving capability...",
  "price": 45000,
  "currency": "USD",
  "category": "electric_vehicle",
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2022,
  "mileage": 15000,
  "location": "California, US",
  "images": ["url1", "url2", "url3"],
  "features": ["Autopilot", "Full Self-Driving", "Premium Interior"],
  "status": "active"
}
```

### E-Scooter Template:
```json
{
  "user_id": "clerk_user_id",
  "title": "Segway Ninebot MAX G30LP",
  "description": "Like new Segway scooter with extended range...",
  "price": 800,
  "currency": "USD",
  "category": "e_scooter",
  "brand": "Segway",
  "model": "Ninebot MAX G30LP",
  "year": 2023,
  "mileage": 500,
  "location": "New York, US",
  "images": ["url1", "url2"],
  "features": ["Extended Range", "LED Display", "App Connectivity"],
  "status": "active"
}
```

## 📊 Yükleme Süreci

### Adım 1: Kullanıcı Bilgilerini Alın
- **Email:** [Kullanıcının email'ini verin]
- **Araç sayısı:** [Kaç araç yüklenecek]
- **Araç türü:** [EV/E-scooter/E-bike]

### Adım 2: Araç Detaylarını Hazırlayın
- **Marka/Model** bilgileri
- **Yıl** ve **kilometre**
- **Fiyat** ve **konum**
- **Özellikler** listesi
- **Fotoğraf** URL'leri

### Adım 3: Database'e Yükleyin
- **Supabase** connection
- **INSERT** query'leri
- **User ID** ilişkilendirme
- **Status** kontrolü

## 🔧 Teknik Detaylar

### Database Schema:
```sql
INSERT INTO vehicles (
  user_id,
  title,
  description,
  price,
  currency,
  category,
  brand,
  model,
  year,
  mileage,
  location,
  images,
  features,
  status,
  created_at
) VALUES (
  'clerk_user_id',
  'Araç başlığı',
  'Araç açıklaması',
  45000,
  'USD',
  'electric_vehicle',
  'Tesla',
  'Model 3',
  2022,
  15000,
  'California, US',
  ['url1', 'url2'],
  ['feature1', 'feature2'],
  'active',
  NOW()
);
```

### Clerk User ID Bulma:
```javascript
// Clerk Dashboard'da kullanıcıyı bulun
// User ID'yi kopyalayın
// Database'e ekleyin
```

## 📋 Kullanıcı Bilgileri Formu

### Lütfen Şu Bilgileri Verin:
1. **Kullanıcının email'i:** [Email]
2. **Kaç araç yüklenecek:** [Sayı]
3. **Araç türü:** [EV/E-scooter/E-bike]
4. **Araç detayları:** [Marka, model, yıl, fiyat]
5. **Fotoğraf URL'leri:** [Varsa]

## 🎯 Sonuç

### Yükleme Sonrası:
- ✅ **Araçlar** kullanıcı hesabına eklenir
- ✅ **Site'de görünür** olur
- ✅ **Kullanıcı** kendi araçlarını yönetebilir
- ✅ **Admin panel**'den kontrol edilebilir

### Kullanıcı Deneyimi:
- **Site'ye giriş** yapar
- **Profile** sayfasına gider
- **Araçlarını** görür
- **Düzenleme** yapabilir
