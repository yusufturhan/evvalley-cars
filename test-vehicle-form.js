// Form Verilerini Test Etme Scripti
// Bu script form verilerinin doğru gönderilip gönderilmediğini test eder

const { createClient } = require('@supabase/supabase-js');

// Environment değişkenlerini yükle
require('dotenv').config({ path: '.env.local' });

// Supabase bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL ve Service Role Key gerekli!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVehicleForm() {
  console.log('🧪 Form verilerini test ediliyor...\n');

  try {
    // En son eklenen aracı bul
    const { data: latestVehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Araç bulunamadı:', error);
      return;
    }

    console.log('🔍 En son eklenen araç:');
    console.log(`   ID: ${latestVehicle.id}`);
    console.log(`   Başlık: ${latestVehicle.title}`);
    console.log(`   Marka: ${latestVehicle.brand}`);
    console.log(`   Model: ${latestVehicle.model}`);
    console.log(`   Yıl: ${latestVehicle.year}`);
    console.log(`   Fiyat: $${latestVehicle.price}`);
    console.log(`   Konum: ${latestVehicle.location}`);
    console.log(`   Satıcı: ${latestVehicle.seller_email}`);
    console.log(`   Kategori: ${latestVehicle.category}`);
    console.log(`   Yakıt Tipi: ${latestVehicle.fuel_type}`);
    console.log('');
    console.log('📋 Detay Bilgileri:');
    console.log(`   Araç Durumu: ${latestVehicle.vehicle_condition || 'Belirtilmemiş'}`);
    console.log(`   Başlık Durumu: ${latestVehicle.title_status || 'Belirtilmemiş'}`);
    console.log(`   Öne Çıkan Özellikler: ${latestVehicle.highlighted_features || 'Belirtilmemiş'}`);
    console.log(`   İç Renk: ${latestVehicle.interior_color || 'Belirtilmemiş'}`);
    console.log(`   Dış Renk: ${latestVehicle.exterior_color || 'Belirtilmemiş'}`);
    console.log(`   Gövde/Koltuk: ${latestVehicle.body_seating || 'Belirtilmemiş'}`);
    console.log(`   Şanzıman: ${latestVehicle.transmission || 'Belirtilmemiş'}`);
    console.log(`   Yakıt Ekonomisi: ${latestVehicle.combined_fuel_economy || 'Belirtilmemiş'}`);
    console.log(`   Beygir Gücü: ${latestVehicle.horsepower || 'Belirtilmemiş'}`);
    console.log(`   Elektrik Menzili: ${latestVehicle.electric_mile_range || 'Belirtilmemiş'}`);
    console.log(`   Batarya Garantisi: ${latestVehicle.battery_warranty || 'Belirtilmemiş'}`);
    console.log(`   Çekiş: ${latestVehicle.drivetrain || 'Belirtilmemiş'}`);
    console.log(`   VIN: ${latestVehicle.vin || 'Belirtilmemiş'}`);
    console.log('');
    console.log('📅 Zaman Bilgileri:');
    console.log(`   Oluşturulma: ${latestVehicle.created_at}`);
    console.log(`   Güncellenme: ${latestVehicle.updated_at}`);

    // Boş alanları say
    const emptyFields = [];
    const fieldsToCheck = [
      'vehicle_condition', 'title_status', 'highlighted_features',
      'interior_color', 'exterior_color', 'body_seating', 'transmission',
      'combined_fuel_economy', 'horsepower', 'electric_mile_range',
      'battery_warranty', 'drivetrain', 'vin'
    ];

    fieldsToCheck.forEach(field => {
      if (!latestVehicle[field] || latestVehicle[field] === '') {
        emptyFields.push(field);
      }
    });

    console.log('');
    console.log('📊 Analiz:');
    console.log(`   Toplam kontrol edilen alan: ${fieldsToCheck.length}`);
    console.log(`   Boş alan sayısı: ${emptyFields.length}`);
    console.log(`   Dolu alan sayısı: ${fieldsToCheck.length - emptyFields.length}`);
    
    if (emptyFields.length > 0) {
      console.log('   ❌ Boş alanlar:', emptyFields.join(', '));
    } else {
      console.log('   ✅ Tüm alanlar dolu!');
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
testVehicleForm().then(() => {
  console.log('✅ Test tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 