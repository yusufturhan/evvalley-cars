// Araç Konumu Düzeltme Scripti
// Bu script araçların konumunu düzeltir

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

async function fixVehicleLocation() {
  console.log('🔧 Araç konumu düzeltiliyor...\n');

  try {
    // Los Angeles konumundaki Toyota Prius Hybrid araçları bul
    const { data: losAngelesVehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('brand', 'Toyota')
      .eq('model', 'Prius')
      .eq('location', 'Los Angeles');

    if (error) {
      console.error('❌ Araçlar hatası:', error);
      return;
    }

    console.log(`✅ Los Angeles konumunda ${losAngelesVehicles?.length || 0} Toyota Prius Hybrid bulundu\n`);

    if (losAngelesVehicles && losAngelesVehicles.length > 0) {
      losAngelesVehicles.forEach((vehicle, index) => {
        console.log(`🚗 Araç ${index + 1}:`);
        console.log(`   ID: ${vehicle.id}`);
        console.log(`   Başlık: ${vehicle.title}`);
        console.log(`   Konum: ${vehicle.location}`);
        console.log(`   Satıcı Email: ${vehicle.seller_email}`);
        console.log(`   Oluşturulma: ${vehicle.created_at}`);
        console.log('');
      });

      // Kullanıcıdan hangi aracı düzeltmek istediğini sor
      console.log('🔧 Hangi aracın konumunu düzeltmek istiyorsunuz?');
      console.log('1. İlk araç (ID: ' + losAngelesVehicles[0].id + ')');
      if (losAngelesVehicles.length > 1) {
        console.log('2. İkinci araç (ID: ' + losAngelesVehicles[1].id + ')');
      }
      console.log('3. Tüm Los Angeles araçlarını East Palo Alto yap');
      console.log('4. Hiçbiri (çık)');
      
      // Şimdilik otomatik olarak ilk aracı düzeltelim
      const vehicleToFix = losAngelesVehicles[0];
      
      console.log(`\n🔄 Araç düzeltiliyor: ${vehicleToFix.title} (ID: ${vehicleToFix.id})`);
      console.log(`📍 Eski konum: ${vehicleToFix.location}`);
      console.log(`📍 Yeni konum: East Palo Alto`);

      // Konumu güncelle
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ location: 'East Palo Alto' })
        .eq('id', vehicleToFix.id);

      if (updateError) {
        console.error('❌ Güncelleme hatası:', updateError);
      } else {
        console.log('✅ Konum başarıyla güncellendi!');
        
        // Güncellenmiş aracı kontrol et
        const { data: updatedVehicle, error: checkError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleToFix.id)
          .single();

        if (checkError) {
          console.error('❌ Kontrol hatası:', checkError);
        } else {
          console.log(`✅ Güncellenmiş araç: ${updatedVehicle.title} - Konum: ${updatedVehicle.location}`);
        }
      }
    } else {
      console.log('❌ Los Angeles konumunda Toyota Prius Hybrid bulunamadı');
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
fixVehicleLocation().then(() => {
  console.log('✅ Düzeltme tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 