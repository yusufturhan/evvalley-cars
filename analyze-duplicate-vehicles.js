// Aynı Araçları Analiz Etme Scripti
// Bu script aynı araçları bulur ve analiz eder

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

async function analyzeDuplicateVehicles() {
  console.log('🔍 Aynı araçları analiz ediliyor...\n');

  try {
    // Tüm araçları al
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Araçlar hatası:', error);
      return;
    }

    console.log(`✅ Toplam ${vehicles?.length || 0} araç bulundu\n`);

    // Aynı marka/model araçları grupla
    const vehicleGroups = {};
    
    vehicles?.forEach(vehicle => {
      const key = `${vehicle.brand}-${vehicle.model}-${vehicle.year}`;
      if (!vehicleGroups[key]) {
        vehicleGroups[key] = [];
      }
      vehicleGroups[key].push(vehicle);
    });

    // Aynı araçları göster
    console.log('🔍 Aynı araçlar:');
    Object.keys(vehicleGroups).forEach(key => {
      const group = vehicleGroups[key];
      if (group.length > 1) {
        console.log(`\n🚗 ${key}:`);
        group.forEach((vehicle, index) => {
          console.log(`   ${index + 1}. ID: ${vehicle.id}`);
          console.log(`      Başlık: ${vehicle.title}`);
          console.log(`      Konum: ${vehicle.location}`);
          console.log(`      Satıcı: ${vehicle.seller_email}`);
          console.log(`      Fiyat: $${vehicle.price}`);
          console.log(`      Oluşturulma: ${vehicle.created_at}`);
          console.log(`      VIN: ${vehicle.vin || 'Belirtilmemiş'}`);
        });
      }
    });

    // Tekil araçları göster
    console.log('\n🔍 Tekil araçlar:');
    Object.keys(vehicleGroups).forEach(key => {
      const group = vehicleGroups[key];
      if (group.length === 1) {
        const vehicle = group[0];
        console.log(`🚗 ${key}:`);
        console.log(`   ID: ${vehicle.id}`);
        console.log(`   Başlık: ${vehicle.title}`);
        console.log(`   Konum: ${vehicle.location}`);
        console.log(`   Satıcı: ${vehicle.seller_email}`);
        console.log(`   Fiyat: $${vehicle.price}`);
      }
    });

    // Öneriler
    console.log('\n💡 Öneriler:');
    console.log('1. Aynı araçların hangisinin gerçek olduğunu belirleyin');
    console.log('2. Yanlış olan araçları silin');
    console.log('3. VIN numarası kontrolü ekleyin');
    console.log('4. Benzersizlik kısıtlamaları ekleyin');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
analyzeDuplicateVehicles().then(() => {
  console.log('✅ Analiz tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 