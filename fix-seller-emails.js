// Seller Email Düzeltme Scripti
// Bu script yanlış seller email'lerini düzeltir

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

async function fixSellerEmails() {
  console.log('🔧 Seller email\'leri düzeltiliyor...\n');

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

    // Seller ID'leri kontrol et
    const sellerIds = [...new Set(vehicles?.map(v => v.seller_id) || [])];
    console.log('🔍 Benzersiz seller ID\'leri:', sellerIds);

    // Her seller ID için kullanıcı bilgilerini al
    for (const sellerId of sellerIds) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .eq('id', sellerId)
        .single();

      if (userError) {
        console.error(`❌ Kullanıcı bulunamadı (ID: ${sellerId}):`, userError);
        continue;
      }

      console.log(`👤 Kullanıcı ${user.id}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Ad: ${user.first_name} ${user.last_name}`);

      // Bu kullanıcının araçlarını bul
      const userVehicles = vehicles?.filter(v => v.seller_id === sellerId) || [];
      console.log(`   Araç sayısı: ${userVehicles.length}`);

      // Yanlış email'li araçları düzelt
      for (const vehicle of userVehicles) {
        if (vehicle.seller_email !== user.email) {
          console.log(`   🔄 Düzeltiliyor: ${vehicle.title} (${vehicle.seller_email} → ${user.email})`);
          
          const { error: updateError } = await supabase
            .from('vehicles')
            .update({ seller_email: user.email })
            .eq('id', vehicle.id);

          if (updateError) {
            console.error(`   ❌ Güncelleme hatası:`, updateError);
          } else {
            console.log(`   ✅ Başarıyla güncellendi`);
          }
        }
      }
      console.log('');
    }

    // Son kontrol
    console.log('🔍 Son kontrol yapılıyor...');
    const { data: finalVehicles, error: finalError } = await supabase
      .from('vehicles')
      .select('id, title, seller_email, seller_id')
      .order('created_at', { ascending: false });

    if (finalError) {
      console.error('❌ Son kontrol hatası:', finalError);
    } else {
      console.log('📊 Güncel durum:');
      finalVehicles?.forEach(vehicle => {
        console.log(`   ${vehicle.title}: ${vehicle.seller_email} (ID: ${vehicle.seller_id})`);
      });
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
fixSellerEmails().then(() => {
  console.log('✅ Düzeltme tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 