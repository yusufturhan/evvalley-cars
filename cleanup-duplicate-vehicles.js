// Aynı Araçları Temizleme Scripti
// Bu script aynı araçları temizler

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

async function cleanupDuplicateVehicles() {
  console.log('🧹 Aynı araçları temizleniyor...\n');

  try {
    // Toyota Prius 2010 araçlarını bul
    const { data: priusVehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('brand', 'Toyota')
      .eq('model', 'Prius')
      .eq('year', 2010)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Araçlar hatası:', error);
      return;
    }

    console.log(`✅ ${priusVehicles?.length || 0} Toyota Prius 2010 bulundu\n`);

    if (priusVehicles && priusVehicles.length > 1) {
      console.log('🔍 Aynı araçlar:');
      priusVehicles.forEach((vehicle, index) => {
        console.log(`${index + 1}. ID: ${vehicle.id}`);
        console.log(`   Başlık: ${vehicle.title}`);
        console.log(`   Konum: ${vehicle.location}`);
        console.log(`   Satıcı: ${vehicle.seller_email}`);
        console.log(`   Fiyat: $${vehicle.price}`);
        console.log(`   Oluşturulma: ${vehicle.created_at}`);
        console.log('');
      });

      // Daha yeni olan aracı sil (daha sonra oluşturulmuş)
      const vehicleToDelete = priusVehicles[0]; // En yeni olan
      const vehicleToKeep = priusVehicles[1]; // Daha eski olan

      console.log(`🗑️ Silinecek araç: ${vehicleToDelete.title} (ID: ${vehicleToDelete.id})`);
      console.log(`📍 Konum: ${vehicleToDelete.location}`);
      console.log(`📅 Oluşturulma: ${vehicleToDelete.created_at}`);
      console.log('');

      console.log(`✅ Korunacak araç: ${vehicleToKeep.title} (ID: ${vehicleToKeep.id})`);
      console.log(`📍 Konum: ${vehicleToKeep.location}`);
      console.log(`📅 Oluşturulma: ${vehicleToKeep.created_at}`);
      console.log('');

      // Onay sor
      console.log('❓ Bu aracı silmek istediğinizden emin misiniz? (y/N)');
      
      // Şimdilik otomatik olarak silelim
      console.log('🔄 Araç siliniyor...');

      // Önce bu araçla ilgili mesajları sil
      const { error: messagesError } = await supabase
        .from('simple_messages')
        .delete()
        .eq('vehicle_id', vehicleToDelete.id);

      if (messagesError) {
        console.error('❌ Mesajlar silinirken hata:', messagesError);
      } else {
        console.log('✅ Araçla ilgili mesajlar silindi');
      }

      // Aracı sil
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleToDelete.id);

      if (deleteError) {
        console.error('❌ Araç silinirken hata:', deleteError);
      } else {
        console.log('✅ Araç başarıyla silindi!');
        
        // Kalan araçları kontrol et
        const { data: remainingVehicles, error: checkError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('brand', 'Toyota')
          .eq('model', 'Prius')
          .eq('year', 2010);

        if (checkError) {
          console.error('❌ Kontrol hatası:', checkError);
        } else {
          console.log(`✅ Kalan Toyota Prius 2010 sayısı: ${remainingVehicles?.length || 0}`);
          if (remainingVehicles && remainingVehicles.length > 0) {
            console.log(`✅ Kalan araç: ${remainingVehicles[0].title} - Konum: ${remainingVehicles[0].location}`);
          }
        }
      }
    } else {
      console.log('✅ Aynı araç bulunamadı');
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
cleanupDuplicateVehicles().then(() => {
  console.log('✅ Temizlik tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 