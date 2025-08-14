# Hybrid Car Template - West Auto Nation

## 🚗 Kullanıcı Bilgileri
- **Email:** info@westautonation.com
- **Araç Türü:** Hybrid Car
- **Sayı:** 1 araç

## 📋 Hybrid Car Template

### Örnek Hybrid Car:
```json
{
  "user_id": "clerk_user_id_here",
  "title": "2023 Toyota Prius Prime XSE",
  "description": "Excellent condition Toyota Prius Prime with advanced hybrid technology. This plug-in hybrid offers exceptional fuel efficiency and modern features. Perfect for eco-conscious drivers who want the best of both worlds.",
  "price": 35000,
  "currency": "USD",
  "category": "hybrid_vehicle",
  "brand": "Toyota",
  "model": "Prius Prime",
  "year": 2023,
  "mileage": 12000,
  "location": "California, US",
  "images": [
    "https://i.imgur.com/example1.jpg",
    "https://i.imgur.com/example2.jpg",
    "https://i.imgur.com/example3.jpg"
  ],
  "features": [
    "Plug-in Hybrid",
    "Advanced Safety System",
    "Apple CarPlay",
    "Android Auto",
    "Wireless Charging",
    "Premium Audio System",
    "Heated Seats",
    "Blind Spot Monitor"
  ],
  "status": "active",
  "created_at": "2024-08-10T00:00:00Z"
}
```

## 🎯 Hybrid Car Seçenekleri

### Seçenek 1: Toyota Prius Prime
- **Model:** 2023 Toyota Prius Prime XSE
- **Fiyat:** $35,000
- **Özellikler:** Plug-in hybrid, 25-mile EV range
- **Yakıt:** 54 MPG combined

### Seçenek 2: Honda Insight
- **Model:** 2023 Honda Insight Touring
- **Fiyat:** $32,000
- **Özellikler:** Hybrid sedan, excellent fuel economy
- **Yakıt:** 52 MPG combined

### Seçenek 3: Hyundai Ioniq
- **Model:** 2023 Hyundai Ioniq Blue
- **Fiyat:** $30,000
- **Özellikler:** Hybrid hatchback, great value
- **Yakıt:** 58 MPG combined

## 📸 Fotoğraf Gereksinimleri

### Gerekli Fotoğraflar:
1. **Exterior front** (ön görünüm)
2. **Exterior side** (yan görünüm)
3. **Exterior rear** (arka görünüm)
4. **Interior dashboard** (iç panel)
5. **Interior seats** (koltuklar)
6. **Engine bay** (motor bölümü)

### Fotoğraf Formatı:
- **Boyut:** 1200x800px
- **Format:** JPEG/JPG
- **Kalite:** 85%
- **Dosya boyutu:** <2MB per fotoğraf

## 🔧 Database Insert Query

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
  'clerk_user_id_here',
  '2023 Toyota Prius Prime XSE',
  'Excellent condition Toyota Prius Prime with advanced hybrid technology. This plug-in hybrid offers exceptional fuel efficiency and modern features. Perfect for eco-conscious drivers who want the best of both worlds.',
  35000,
  'USD',
  'hybrid_vehicle',
  'Toyota',
  'Prius Prime',
  2023,
  12000,
  'California, US',
  ['https://i.imgur.com/example1.jpg', 'https://i.imgur.com/example2.jpg', 'https://i.imgur.com/example3.jpg'],
  ['Plug-in Hybrid', 'Advanced Safety System', 'Apple CarPlay', 'Android Auto', 'Wireless Charging', 'Premium Audio System', 'Heated Seats', 'Blind Spot Monitor'],
  'active',
  NOW()
);
```

## 📋 Kullanıcı İçin Bilgi

### Kullanıcı Erişimi:
- **Site:** https://www.evvalley.com
- **Login:** info@westautonation.com ile giriş
- **Profile:** Kullanıcı profilinde araç görünür
- **Edit:** Araç bilgilerini düzenleyebilir

### Araç Yönetimi:
- **View:** Araç detaylarını görüntüle
- **Edit:** Fiyat, açıklama güncelle
- **Status:** Aktif/Pasif yap
- **Delete:** Araç sil (gerekirse)
