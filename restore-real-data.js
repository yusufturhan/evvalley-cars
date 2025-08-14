// Gerçek Verileri Geri Yükleme Scripti
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

async function restoreRealData() {
  console.log('🔧 Gerçek veriler geri yükleniyor...\n');

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
    console.log(`   Oluşturulma: ${latestVehicle.created_at}`);
    console.log('');

    console.log('❓ Lütfen sizin girdiğiniz gerçek verileri bana söyleyin:');
    console.log('   1. Vehicle Condition ne girdiniz?');
    console.log('   2. Title Status ne girdiniz?');
    console.log('   3. Highlighted Features ne girdiniz?');
    console.log('   4. Interior Color ne girdiniz?');
    console.log('   5. Exterior Color ne girdiniz?');
    console.log('   6. Body/Seating ne girdiniz?');
    console.log('   7. Transmission ne girdiniz?');
    console.log('   8. Fuel Economy ne girdiniz?');
    console.log('   9. Horsepower ne girdiniz?');
    console.log('   10. Electric Range ne girdiniz?');
    console.log('   11. Battery Warranty ne girdiniz?');
    console.log('   12. Drivetrain ne girdiniz?');
    console.log('   13. VIN ne girdiniz?');
    console.log('');
    console.log('📝 Bu bilgileri verirseniz, hemen gerçek verilerinizi geri yükleyeceğim!');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
restoreRealData().then(() => {
  console.log('✅ Gerçek veri geri yükleme hazır!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 