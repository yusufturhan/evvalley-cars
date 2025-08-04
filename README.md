# Evvalley Cars - Araba İlan Sitesi

Modern ve güvenilir araba ilan platformu. Next.js, TypeScript, Tailwind CSS ve Supabase kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Modern Tasarım**: Responsive ve kullanıcı dostu arayüz
- **Real-time Mesajlaşma**: Kullanıcılar arası anlık iletişim
- **Gelişmiş Arama**: Marka, model, fiyat ve konum bazlı filtreleme
- **Güvenli Authentication**: Clerk ile güvenli kullanıcı girişi
- **Veritabanı Entegrasyonu**: Supabase ile güçlü veri yönetimi
- **Admin Paneli**: İlan yönetimi ve kullanıcı kontrolü

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Real-time**: Socket.io
- **Deployment**: Vercel

## 📦 Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/yourusername/evvalley-cars.git
cd evvalley-cars
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp env.example .env.local
```

4. **Gerekli değişkenleri doldurun**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase proje URL'i
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonim anahtarı
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public anahtarı
- `CLERK_SECRET_KEY`: Clerk secret anahtarı

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

## 🗄️ Veritabanı Yapısı

### Cars Tablosu
```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  brand VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mileage INTEGER,
  fuel_type VARCHAR,
  transmission VARCHAR,
  color VARCHAR,
  description TEXT,
  images TEXT[],
  location VARCHAR,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Tablosu
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id),
  car_id UUID REFERENCES cars(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel ile Deployment

1. **Vercel hesabı oluşturun**
2. **GitHub repository'nizi bağlayın**
3. **Environment değişkenlerini ayarlayın**
4. **Deploy edin**

### Environment Değişkenleri (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_publishable_key
CLERK_SECRET_KEY=your_production_clerk_secret_key
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 📱 Kullanım

### Kullanıcı İşlemleri
- **Kayıt/Giriş**: Clerk ile güvenli authentication
- **İlan Verme**: Detaylı araç bilgileri ile ilan oluşturma
- **Arama**: Gelişmiş filtreleme seçenekleri
- **Mesajlaşma**: Alıcı-satıcı arası iletişim

### Admin İşlemleri
- **İlan Yönetimi**: Onaylama, düzenleme, silme
- **Kullanıcı Yönetimi**: Kullanıcı hesaplarını kontrol etme
- **İstatistikler**: Platform kullanım verileri

## 🤝 Katkıda Bulunma

1. **Fork edin**
2. **Feature branch oluşturun** (`git checkout -b feature/amazing-feature`)
3. **Değişikliklerinizi commit edin** (`git commit -m 'Add amazing feature'`)
4. **Branch'inizi push edin** (`git push origin feature/amazing-feature`)
5. **Pull Request oluşturun**

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: evvalley@evvalley.com
- **Telefon**: 650 507 63 86
- **Adres**: East Palo Alto, CA

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Clerk](https://clerk.com/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
