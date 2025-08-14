// Mesaj Migration Scripti
// vehicle_messages tablosundan simple_messages tablosuna veri taşır

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

async function migrateMessages() {
  console.log('🔄 Mesaj migration başlatılıyor...\n');

  try {
    // 1. Tüm vehicle_messages'ları al
    console.log('📥 vehicle_messages tablosundan veriler alınıyor...');
    const { data: vehicleMessages, error: vehicleError } = await supabase
      .from('vehicle_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (vehicleError) {
      console.error('❌ vehicle_messages hatası:', vehicleError);
      return;
    }

    console.log(`✅ ${vehicleMessages?.length || 0} mesaj bulundu`);

    if (!vehicleMessages || vehicleMessages.length === 0) {
      console.log('ℹ️ Taşınacak mesaj yok');
      return;
    }

    // 2. Kullanıcı bilgilerini al
    console.log('👥 Kullanıcı bilgileri alınıyor...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name');

    if (usersError) {
      console.error('❌ Kullanıcılar hatası:', usersError);
      return;
    }

    // Kullanıcı ID'sini email'e çevirmek için map oluştur
    const userMap = {};
    users?.forEach(user => {
      userMap[user.id] = {
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim()
      };
    });

    console.log(`✅ ${users?.length || 0} kullanıcı bulundu`);

    // 3. Araç bilgilerini al
    console.log('🚗 Araç bilgileri alınıyor...');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, title, seller_email');

    if (vehiclesError) {
      console.error('❌ Araçlar hatası:', vehiclesError);
      return;
    }

    console.log(`✅ ${vehicles?.length || 0} araç bulundu`);

    // 4. Mesajları dönüştür ve simple_messages'a ekle
    console.log('🔄 Mesajlar dönüştürülüyor...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const vehicleMsg of vehicleMessages) {
      try {
        // Gönderen ve alıcı bilgilerini al
        const senderInfo = userMap[vehicleMsg.sender_id];
        const receiverInfo = userMap[vehicleMsg.receiver_id];

        if (!senderInfo || !receiverInfo) {
          console.log(`⚠️ Kullanıcı bilgisi bulunamadı: sender_id=${vehicleMsg.sender_id}, receiver_id=${vehicleMsg.receiver_id}`);
          errorCount++;
          continue;
        }

        // Araç bilgisini al
        const vehicle = vehicles?.find(v => v.id === vehicleMsg.vehicle_id);
        if (!vehicle) {
          console.log(`⚠️ Araç bilgisi bulunamadı: vehicle_id=${vehicleMsg.vehicle_id}`);
          errorCount++;
          continue;
        }

        // Simple message formatına dönüştür
        const simpleMessage = {
          vehicle_id: vehicleMsg.vehicle_id,
          sender_email: senderInfo.email,
          receiver_email: receiverInfo.email,
          content: vehicleMsg.content,
          sender_name: senderInfo.name || 'User',
          receiver_name: receiverInfo.name || 'User',
          is_read: vehicleMsg.is_read,
          created_at: vehicleMsg.created_at,
          updated_at: vehicleMsg.updated_at
        };

        // Simple_messages tablosuna ekle
        const { error: insertError } = await supabase
          .from('simple_messages')
          .insert(simpleMessage);

        if (insertError) {
          console.error(`❌ Mesaj eklenirken hata:`, insertError);
          errorCount++;
        } else {
          successCount++;
          console.log(`✅ Mesaj taşındı: ${vehicleMsg.id} -> ${senderInfo.email} -> ${receiverInfo.email}`);
        }

      } catch (error) {
        console.error(`❌ Mesaj işlenirken hata:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Sonuçları:');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📝 Toplam: ${vehicleMessages.length}`);

    // 5. Son kontrol
    console.log('\n🔍 Son kontrol yapılıyor...');
    const { data: finalSimpleMessages, error: finalError } = await supabase
      .from('simple_messages')
      .select('count')
      .single();

    if (finalError) {
      console.error('❌ Son kontrol hatası:', finalError);
    } else {
      console.log(`✅ simple_messages tablosunda toplam ${finalSimpleMessages?.count || 0} mesaj var`);
    }

  } catch (error) {
    console.error('❌ Genel migration hatası:', error);
  }
}

// Migration'ı çalıştır
migrateMessages().then(() => {
  console.log('✅ Migration tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Migration hatası:', error);
  process.exit(1);
}); 