# Mesaj Sorunları Troubleshooting Rehberi

## 🔍 Problem: Eski Konuşmalar Kayboldu

### 📊 Mevcut Durum Analizi

Uygulamanızda **iki farklı mesajlaşma sistemi** bulunuyor:

1. **`vehicle_messages` tablosu** - Eski sistem (UUID tabanlı)
2. **`simple_messages` tablosu** - Yeni sistem (Email tabanlı)

**Aktif Sistem:** `SimpleChat` bileşeni → `simple_messages` tablosunu kullanıyor

### 🛠️ Çözüm Adımları

#### Adım 1: Veritabanı Kontrolü

```bash
# Mesaj tablolarını kontrol et
npm run check-messages
```

Bu komut şunları kontrol eder:
- `vehicle_messages` tablosundaki mesajlar
- `simple_messages` tablosundaki mesajlar
- Kullanıcı bilgileri
- Araç bilgileri

#### Adım 2: Mesaj Migration (Gerekirse)

Eğer `vehicle_messages` tablosunda eski mesajlarınız varsa:

```bash
# Mesajları vehicle_messages'dan simple_messages'a taşı
npm run migrate-messages
```

#### Adım 3: Environment Değişkenlerini Kontrol Et

`.env.local` dosyasında şu değişkenlerin olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 🔧 Manuel Kontrol

#### 1. Supabase Dashboard'da Kontrol

1. Supabase projenize gidin
2. Table Editor'da şu tabloları kontrol edin:
   - `vehicle_messages`
   - `simple_messages`
   - `users`
   - `vehicles`

#### 2. API Endpoint'lerini Test Et

```bash
# Simple messages API'sini test et
curl "http://localhost:3000/api/simple-messages?vehicleId=YOUR_VEHICLE_ID&currentUserEmail=YOUR_EMAIL"

# Vehicle messages API'sini test et
curl "http://localhost:3000/api/messages?vehicleId=YOUR_VEHICLE_ID&userId=YOUR_USER_ID&otherUserId=OTHER_USER_ID"
```

### 🐛 Yaygın Sorunlar ve Çözümleri

#### Sorun 1: "Mesaj bulunamadı" Hatası

**Neden:** Kullanıcı ID'leri Clerk ve Supabase arasında uyumsuz

**Çözüm:**
```javascript
// API'de kullanıcı ID dönüştürme kontrolü
console.log('User ID conversion:', {
  clerkId: userId,
  supabaseId: await getOrCreateUser(userId)
});
```

#### Sorun 2: "Tablo bulunamadı" Hatası

**Neden:** Veritabanı şeması güncel değil

**Çözüm:**
```sql
-- Supabase SQL Editor'da çalıştırın
CREATE TABLE IF NOT EXISTS simple_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    sender_email TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Sorun 3: "Yetki hatası" 

**Neden:** RLS (Row Level Security) politikaları

**Çözüm:**
```sql
-- RLS politikalarını kontrol edin
SELECT * FROM pg_policies WHERE tablename = 'simple_messages';
```

### 📋 Kontrol Listesi

- [ ] `.env.local` dosyası doğru ayarlanmış
- [ ] Supabase bağlantısı çalışıyor
- [ ] `simple_messages` tablosu mevcut
- [ ] Kullanıcılar `users` tablosunda kayıtlı
- [ ] Araçlar `vehicles` tablosunda mevcut
- [ ] API endpoint'leri çalışıyor
- [ ] Frontend'de doğru bileşen kullanılıyor

### 🚀 Hızlı Test

```bash
# 1. Veritabanı kontrolü
npm run check-messages

# 2. Eğer eski mesajlar varsa migration yap
npm run migrate-messages

# 3. Uygulamayı yeniden başlat
npm run dev
```

### 📞 Destek

Eğer sorun devam ederse:

1. Console log'larını kontrol edin
2. Network tab'ında API çağrılarını inceleyin
3. Supabase Dashboard'da tabloları kontrol edin
4. Bu rehberi takip edin

### 🔄 Gelecek İyileştirmeler

1. **Tek Mesajlaşma Sistemi:** `simple_messages` tablosunu standart yap
2. **Otomatik Migration:** Yeni kullanıcılar için otomatik veri taşıma
3. **Backup Sistemi:** Düzenli mesaj yedekleme
4. **Monitoring:** Mesaj kayıplarını önlemek için izleme sistemi 