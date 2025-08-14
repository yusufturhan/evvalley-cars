// Realtime Durumu Kontrol Scripti
// Bu script hangi tabloların Realtime'e ihtiyacı olduğunu kontrol eder

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

async function checkRealtimeStatus() {
  console.log('🔍 Realtime durumu kontrol ediliyor...\n');

  try {
    // Tüm tabloları kontrol et
    const tables = ['favorites', 'simple_messages', 'users', 'vehicles'];
    
    console.log('📊 Tablo Realtime Durumu:');
    console.log('');

    for (const tableName of tables) {
      console.log(`🔍 ${tableName} tablosu:`);
      
      // Tablodaki kayıt sayısını kontrol et
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.log(`   ❌ Tablo erişilemiyor`);
        continue;
      }

      console.log(`   📊 Kayıt sayısı: ${count}`);
      
      // Realtime ihtiyacını değerlendir
      let realtimeNeeded = false;
      let reason = '';

      switch (tableName) {
        case 'favorites':
          realtimeNeeded = true;
          reason = 'Kullanıcılar favori ekleme/çıkarma yaparken anlık güncelleme gerekli';
          break;
        case 'simple_messages':
          realtimeNeeded = true;
          reason = 'Mesajlaşma sistemi için anlık mesaj gösterimi gerekli';
          break;
        case 'users':
          realtimeNeeded = false;
          reason = 'Kullanıcı bilgileri nadiren değişir, anlık güncelleme gerekmez';
          break;
        case 'vehicles':
          realtimeNeeded = true;
          reason = 'Yeni araç ekleme, satış durumu değişiklikleri için anlık güncelleme gerekli';
          break;
      }

      console.log(`   ${realtimeNeeded ? '✅' : '❌'} Realtime gerekli: ${realtimeNeeded ? 'EVET' : 'HAYIR'}`);
      console.log(`   📝 Sebep: ${reason}`);
      console.log('');
    }

    console.log('📋 Öneriler:');
    console.log('');
    console.log('✅ Realtime AÇIK olmalı:');
    console.log('   - favorites (Favori ekleme/çıkarma)');
    console.log('   - simple_messages (Anlık mesajlaşma)');
    console.log('   - vehicles (Yeni araç ekleme, satış durumu)');
    console.log('');
    console.log('❌ Realtime KAPALI kalabilir:');
    console.log('   - users (Kullanıcı bilgileri nadiren değişir)');
    console.log('');
    console.log('💡 Realtime açmak için:');
    console.log('   1. Supabase Dashboard > Database > Tables');
    console.log('   2. İlgili tabloya tıkla');
    console.log('   3. Settings > Realtime > Enable');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
checkRealtimeStatus().then(() => {
  console.log('✅ Realtime kontrolü tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 