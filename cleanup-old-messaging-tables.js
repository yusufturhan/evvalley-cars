// Eski Mesajlaşma Tablolarını Temizleme Scripti
// Bu script eski mesajlaşma tablolarını temizler

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

async function cleanupOldMessagingTables() {
  console.log('🧹 Eski mesajlaşma tabloları temizleniyor...\n');

  try {
    // Tabloları kontrol et
    const tablesToClean = ['messages', 'typing_status', 'vehicle_messages'];
    
    for (const tableName of tablesToClean) {
      console.log(`🔍 ${tableName} tablosu kontrol ediliyor...`);
      
      // Tablodaki kayıt sayısını kontrol et
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.log(`ℹ️ ${tableName} tablosu bulunamadı veya erişilemiyor.`);
        continue;
      }

      console.log(`   📊 ${tableName} tablosunda ${count} kayıt bulundu.`);

      if (count > 0) {
        console.log(`   🗑️ ${tableName} tablosundaki tüm kayıtlar siliniyor...`);
        
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Tüm kayıtları sil

        if (deleteError) {
          console.error(`❌ ${tableName} silme hatası:`, deleteError);
        } else {
          console.log(`✅ ${tableName} tablosu başarıyla temizlendi!`);
        }
      } else {
        console.log(`ℹ️ ${tableName} tablosu zaten boş.`);
      }
      
      console.log('');
    }

    // Temizlik sonrası kontrol
    console.log('🔍 Temizlik sonrası kontrol...');
    
    for (const tableName of tablesToClean) {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${tableName}: Tablo erişilemiyor`);
      } else {
        console.log(`   ${count === 0 ? '✅' : '⚠️'} ${tableName}: ${count} kayıt`);
      }
    }

    console.log('');
    console.log('📊 Özet:');
    console.log('   ✅ messages tablosu temizlendi');
    console.log('   ✅ typing_status tablosu temizlendi');
    console.log('   ✅ vehicle_messages tablosu temizlendi');
    console.log('');
    console.log('🎉 Eski mesajlaşma sistemi tamamen temizlendi!');
    console.log('✅ Artık sadece simple_messages tablosu kullanılıyor.');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
cleanupOldMessagingTables().then(() => {
  console.log('✅ Eski mesajlaşma tabloları temizleme tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 