// Araç Detayları Kontrol Scripti
// Bu script araçların location ve diğer detaylarını kontrol eder

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

async function checkVehicleDetails() {
  console.log('🔍 Araç detayları kontrol ediliyor...\n');

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

    if (vehicles && vehicles.length > 0) {
      vehicles.forEach((vehicle, index) => {
        console.log(`🚗 Araç ${index + 1}:`);
        console.log(`   ID: ${vehicle.id}`);
        console.log(`   Başlık: ${vehicle.title}`);
        console.log(`   Marka: ${vehicle.brand}`);
        console.log(`   Model: ${vehicle.model}`);
        console.log(`   Yıl: ${vehicle.year}`);
        console.log(`   Fiyat: $${vehicle.price}`);
        console.log(`   Konum: ${vehicle.location || 'Belirtilmemiş'}`);
        console.log(`   Satıcı Email: ${vehicle.seller_email}`);
        console.log(`   Satıcı ID: ${vehicle.seller_id}`);
        console.log(`   Kategori: ${vehicle.category}`);
        console.log(`   Yakıt Tipi: ${vehicle.fuel_type || 'Belirtilmemiş'}`);
        console.log(`   Araç Durumu: ${vehicle.vehicle_condition || 'Belirtilmemiş'}`);
        console.log(`   Başlık Durumu: ${vehicle.title_status || 'Belirtilmemiş'}`);
        console.log(`   İç Renk: ${vehicle.interior_color || 'Belirtilmemiş'}`);
        console.log(`   Dış Renk: ${vehicle.exterior_color || 'Belirtilmemiş'}`);
        console.log(`   Gövde/Koltuk: ${vehicle.body_seating || 'Belirtilmemiş'}`);
        console.log(`   Şanzıman: ${vehicle.transmission || 'Belirtilmemiş'}`);
        console.log(`   Yakıt Ekonomisi: ${vehicle.combined_fuel_economy || 'Belirtilmemiş'}`);
        console.log(`   Beygir Gücü: ${vehicle.horsepower || 'Belirtilmemiş'}`);
        console.log(`   Elektrik Menzili: ${vehicle.electric_mile_range || 'Belirtilmemiş'}`);
        console.log(`   Batarya Garantisi: ${vehicle.battery_warranty || 'Belirtilmemiş'}`);
        console.log(`   Çekiş: ${vehicle.drivetrain || 'Belirtilmemiş'}`);
        console.log(`   VIN: ${vehicle.vin || 'Belirtilmemiş'}`);
        console.log(`   Satıldı: ${vehicle.sold ? 'Evet' : 'Hayır'}`);
        console.log(`   Oluşturulma: ${vehicle.created_at}`);
        console.log(`   Güncellenme: ${vehicle.updated_at}`);
        console.log('');
      });
    }

    // Los Angeles içeren araçları bul
    console.log('🔍 Los Angeles içeren araçlar:');
    const losAngelesVehicles = vehicles?.filter(v => 
      v.location && v.location.toLowerCase().includes('los angeles')
    ) || [];
    
    if (losAngelesVehicles.length > 0) {
      losAngelesVehicles.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.title} - Konum: ${vehicle.location}`);
      });
    } else {
      console.log('❌ Los Angeles içeren araç bulunamadı');
    }

    console.log('');

    // East Palo Alto içeren araçları bul
    console.log('🔍 East Palo Alto içeren araçlar:');
    const eastPaloAltoVehicles = vehicles?.filter(v => 
      v.location && v.location.toLowerCase().includes('east palo alto')
    ) || [];
    
    if (eastPaloAltoVehicles.length > 0) {
      eastPaloAltoVehicles.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.title} - Konum: ${vehicle.location}`);
      });
    } else {
      console.log('❌ East Palo Alto içeren araç bulunamadı');
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
checkVehicleDetails().then(() => {
  console.log('✅ Kontrol tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 