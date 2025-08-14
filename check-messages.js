// Veritabanı Mesaj Kontrol Scripti
// Bu script hem vehicle_messages hem de simple_messages tablolarını kontrol eder

const { createClient } = require('@supabase/supabase-js');

// Environment değişkenlerini yükle
require('dotenv').config({ path: '.env.local' });

// Supabase bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL ve Service Role Key gerekli!');
  console.log('Lütfen .env.local dosyasında bu değişkenleri ayarlayın:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMessages() {
  console.log('🔍 Mesaj tablolarını kontrol ediliyor...\n');

  try {
    // 1. vehicle_messages tablosunu kontrol et
    console.log('📋 vehicle_messages tablosu:');
    const { data: vehicleMessages, error: vehicleError } = await supabase
      .from('vehicle_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (vehicleError) {
      console.error('❌ vehicle_messages hatası:', vehicleError);
    } else {
      console.log(`✅ Toplam ${vehicleMessages?.length || 0} mesaj bulundu`);
      if (vehicleMessages && vehicleMessages.length > 0) {
        console.log('📝 Son 10 mesaj:');
        vehicleMessages.forEach((msg, index) => {
          console.log(`${index + 1}. ID: ${msg.id}`);
          console.log(`   İçerik: ${msg.content.substring(0, 50)}...`);
          console.log(`   Gönderen: ${msg.sender_id}`);
          console.log(`   Alıcı: ${msg.receiver_id}`);
          console.log(`   Araç ID: ${msg.vehicle_id}`);
          console.log(`   Tarih: ${msg.created_at}`);
          console.log(`   Okundu: ${msg.is_read}`);
          console.log('');
        });
      }
    }

    console.log('─'.repeat(50));

    // 2. simple_messages tablosunu kontrol et
    console.log('📋 simple_messages tablosu:');
    const { data: simpleMessages, error: simpleError } = await supabase
      .from('simple_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (simpleError) {
      console.error('❌ simple_messages hatası:', simpleError);
    } else {
      console.log(`✅ Toplam ${simpleMessages?.length || 0} mesaj bulundu`);
      if (simpleMessages && simpleMessages.length > 0) {
        console.log('📝 Son 10 mesaj:');
        simpleMessages.forEach((msg, index) => {
          console.log(`${index + 1}. ID: ${msg.id}`);
          console.log(`   İçerik: ${msg.content.substring(0, 50)}...`);
          console.log(`   Gönderen Email: ${msg.sender_email}`);
          console.log(`   Alıcı Email: ${msg.receiver_email}`);
          console.log(`   Araç ID: ${msg.vehicle_id}`);
          console.log(`   Tarih: ${msg.created_at}`);
          console.log(`   Okundu: ${msg.is_read}`);
          console.log('');
        });
      }
    }

    console.log('─'.repeat(50));

    // 3. Kullanıcıları kontrol et
    console.log('👥 Kullanıcılar:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, clerk_id, email, first_name, last_name')
      .limit(10);

    if (usersError) {
      console.error('❌ Kullanıcılar hatası:', usersError);
    } else {
      console.log(`✅ Toplam ${users?.length || 0} kullanıcı bulundu`);
      if (users && users.length > 0) {
        console.log('📝 Kullanıcılar:');
        users.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}`);
          console.log(`   Clerk ID: ${user.clerk_id}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Ad: ${user.first_name} ${user.last_name}`);
          console.log('');
        });
      }
    }

    console.log('─'.repeat(50));

    // 4. Araçları kontrol et
    console.log('🚗 Araçlar:');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, title, seller_id, seller_email')
      .limit(5);

    if (vehiclesError) {
      console.error('❌ Araçlar hatası:', vehiclesError);
    } else {
      console.log(`✅ Toplam ${vehicles?.length || 0} araç bulundu`);
      if (vehicles && vehicles.length > 0) {
        console.log('📝 Araçlar:');
        vehicles.forEach((vehicle, index) => {
          console.log(`${index + 1}. ID: ${vehicle.id}`);
          console.log(`   Başlık: ${vehicle.title}`);
          console.log(`   Satıcı ID: ${vehicle.seller_id}`);
          console.log(`   Satıcı Email: ${vehicle.seller_email}`);
          console.log('');
        });
      }
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
checkMessages().then(() => {
  console.log('✅ Kontrol tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 