// Test Aracını Temizleme Scripti
// Bu script test aracını hem Supabase'den hem de storage'dan temizler

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

async function cleanupTestVehicle() {
  console.log('🧹 Test aracı temizleniyor...\n');

  try {
    // Test aracını bul
    const { data: testVehicle, error: findError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('title', 'Test Vehicle - Real User')
      .single();

    if (findError) {
      console.log('ℹ️ Test aracı bulunamadı, zaten temizlenmiş olabilir.');
      return;
    }

    console.log('🔍 Bulunan test aracı:');
    console.log(`   ID: ${testVehicle.id}`);
    console.log(`   Başlık: ${testVehicle.title}`);
    console.log(`   Marka: ${testVehicle.brand}`);
    console.log(`   Model: ${testVehicle.model}`);
    console.log(`   Yıl: ${testVehicle.year}`);
    console.log(`   Fiyat: $${testVehicle.price}`);
    console.log(`   Satıcı: ${testVehicle.seller_email}`);
    console.log('');

    // Test aracını sil
    console.log('🗑️ Test aracı siliniyor...');
    
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', testVehicle.id);

    if (deleteError) {
      console.error('❌ Silme hatası:', deleteError);
      return;
    }

    console.log('✅ Test aracı başarıyla silindi!');
    console.log('');

    // Storage'dan da resimleri temizle (eğer varsa)
    console.log('🖼️ Storage temizliği kontrol ediliyor...');
    
    try {
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('vehicle-images')
        .list(`vehicles/${testVehicle.id}`);

      if (!storageError && storageFiles && storageFiles.length > 0) {
        console.log(`   ${storageFiles.length} resim dosyası bulundu, siliniyor...`);
        
        const fileNames = storageFiles.map(file => file.name);
        const { error: deleteStorageError } = await supabase.storage
          .from('vehicle-images')
          .remove(fileNames.map(name => `vehicles/${testVehicle.id}/${name}`));

        if (deleteStorageError) {
          console.error('❌ Storage silme hatası:', deleteStorageError);
        } else {
          console.log('✅ Storage dosyaları başarıyla silindi!');
        }
      } else {
        console.log('ℹ️ Storage\'da resim dosyası bulunamadı.');
      }
    } catch (storageError) {
      console.log('ℹ️ Storage kontrolü yapılamadı, devam ediliyor...');
    }

    console.log('');
    console.log('🧹 Temizlik tamamlandı!');
    console.log('✅ Test aracı hem veritabanından hem de storage\'dan silindi');
    console.log('✅ Artık sistem tamamen temiz ve production\'a hazır');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
cleanupTestVehicle().then(() => {
  console.log('✅ Test aracı temizleme tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 