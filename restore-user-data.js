// Kullanıcının Gerçek Verilerini Geri Yükleme Scripti
// Bu script kullanıcının girdiği gerçek verileri geri yükler

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

async function restoreUserData() {
  console.log('🔧 Kullanıcının gerçek verileri geri yükleniyor...\n');

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

    console.log('🔍 Güncellenecek araç:');
    console.log(`   ID: ${latestVehicle.id}`);
    console.log(`   Başlık: ${latestVehicle.title}`);
    console.log(`   Marka: ${latestVehicle.brand}`);
    console.log(`   Model: ${latestVehicle.model}`);
    console.log(`   Yıl: ${latestVehicle.year}`);
    console.log(`   Fiyat: $${latestVehicle.price}`);
    console.log(`   Konum: ${latestVehicle.location}`);
    console.log(`   Satıcı: ${latestVehicle.seller_email}`);
    console.log('');

    // Kullanıcının girdiği gerçek veriler
    const realUserData = {
      vehicle_condition: 'good',
      title_status: 'clean',
      highlighted_features: 'Navigation System, Automatic Temperature Control, Exterior Parking Camera Rear, Remote Keyless Entry',
      interior_color: 'Gray',
      exterior_color: 'Dark Gray',
      body_seating: 'Hatchback 4D',
      transmission: 'automatic',
      combined_fuel_economy: 'City 48/ Hwy 51 mpg',
      horsepower: 138,
      electric_mile_range: null,
      battery_warranty: null,
      drivetrain: 'FWD',
      vin: 'JTDKN3DU8F1887777'
    };

    console.log('📋 Kullanıcının girdiği gerçek veriler:');
    Object.entries(realUserData).forEach(([field, value]) => {
      console.log(`   ✅ ${field}: ${value}`);
    });

    console.log('');
    console.log('🔧 Veriler güncelleniyor...');
    
    const { data: updatedVehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(realUserData)
      .eq('id', latestVehicle.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Güncelleme hatası:', updateError);
      return;
    }

    console.log('✅ Kullanıcının gerçek verileri başarıyla geri yüklendi!');
    console.log('');
    console.log('🧪 Şimdi test edin:');
    console.log('   1. Canlı sitenizde araç detay sayfasına gidin');
    console.log('   2. Vehicle Details bölümünü kontrol edin');
    console.log('   3. Artık sizin girdiğiniz gerçek veriler görünmeli');
    console.log('');
    console.log('📋 Güncellenen alanlar:');
    console.log('   ✅ Vehicle Condition: Good');
    console.log('   ✅ Title Status: Clean');
    console.log('   ✅ Highlighted Features: Navigation System, Automatic Temperature Control, Exterior Parking Camera Rear, Remote Keyless Entry');
    console.log('   ✅ Interior Color: Gray');
    console.log('   ✅ Exterior Color: Dark Gray');
    console.log('   ✅ Body/Seating: Hatchback 4D');
    console.log('   ✅ Transmission: Automatic');
    console.log('   ✅ Fuel Economy: City 48/ Hwy 51 mpg');
    console.log('   ✅ Horsepower: 138 hp');
    console.log('   ✅ Electric Range: N/A (Null)');
    console.log('   ✅ Battery Warranty: N/A (Null)');
    console.log('   ✅ Drivetrain: FWD');
    console.log('   ✅ VIN: JTDKN3DU8F1887777');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
restoreUserData().then(() => {
  console.log('✅ Gerçek veri geri yükleme tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 