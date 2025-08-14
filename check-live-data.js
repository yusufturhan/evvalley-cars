// Canlı Ortam Veri Kontrol Scripti
// Bu script canlı ortamda araç verilerini kontrol eder

const { createClient } = require('@supabase/supabase-js');

// Environment değişkenlerini yükle
require('dotenv').config({ path: '.env.local' });

// Supabase bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL ve Service Role Key gerekli!');
  console.log('🔍 Environment değişkenleri:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLiveData() {
  console.log('🌐 Canlı ortam veri kontrolü...\n');

  try {
    // En son eklenen araçları kontrol et
    const { data: latestVehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Veri çekme hatası:', error);
      return;
    }

    console.log(`📊 Son ${latestVehicles.length} araç:`);
    console.log('');

    latestVehicles.forEach((vehicle, index) => {
      console.log(`🚗 Araç ${index + 1}:`);
      console.log(`   ID: ${vehicle.id}`);
      console.log(`   Başlık: ${vehicle.title}`);
      console.log(`   Marka: ${vehicle.brand}`);
      console.log(`   Model: ${vehicle.model}`);
      console.log(`   Yıl: ${vehicle.year}`);
      console.log(`   Fiyat: $${vehicle.price}`);
      console.log(`   Konum: ${vehicle.location}`);
      console.log(`   Satıcı: ${vehicle.seller_email}`);
      console.log(`   Kategori: ${vehicle.category}`);
      console.log(`   Yakıt Tipi: ${vehicle.fuel_type}`);
      
      // Detay alanları
      const detailFields = [
        'vehicle_condition', 'title_status', 'highlighted_features',
        'interior_color', 'exterior_color', 'body_seating', 'transmission',
        'combined_fuel_economy', 'horsepower', 'electric_mile_range',
        'battery_warranty', 'drivetrain', 'vin'
      ];
      
      console.log('   📋 Detay Alanları:');
      detailFields.forEach(field => {
        const value = vehicle[field];
        const status = value && value !== '' ? '✅' : '❌';
        console.log(`      ${status} ${field}: ${value || 'BOŞ'}`);
      });
      
      console.log(`   📅 Oluşturulma: ${vehicle.created_at}`);
      console.log('');
    });

    // Boş alan analizi
    console.log('📈 Genel Analiz:');
    const totalFields = latestVehicles.length * 13; // 13 detay alanı
    let emptyFields = 0;
    let filledFields = 0;
    
    latestVehicles.forEach(vehicle => {
      const detailFields = [
        'vehicle_condition', 'title_status', 'highlighted_features',
        'interior_color', 'exterior_color', 'body_seating', 'transmission',
        'combined_fuel_economy', 'horsepower', 'electric_mile_range',
        'battery_warranty', 'drivetrain', 'vin'
      ];
      
      detailFields.forEach(field => {
        if (vehicle[field] && vehicle[field] !== '') {
          filledFields++;
        } else {
          emptyFields++;
        }
      });
    });
    
    console.log(`   Toplam alan: ${totalFields}`);
    console.log(`   Dolu alan: ${filledFields}`);
    console.log(`   Boş alan: ${emptyFields}`);
    console.log(`   Doldurma oranı: ${((filledFields / totalFields) * 100).toFixed(1)}%`);

    // Canlı ortam URL'si
    console.log('');
    console.log('🌐 Canlı Ortam Bilgileri:');
    console.log(`   Supabase URL: ${supabaseUrl}`);
    console.log(`   Service Role Key: ${supabaseKey ? 'SET' : 'NOT SET'}`);

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
checkLiveData().then(() => {
  console.log('✅ Canlı ortam kontrolü tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 