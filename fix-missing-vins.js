// Eksik VIN Numaralarını Düzeltme Scripti
// Bu script eksik VIN numaralarını düzeltir

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

async function fixMissingVins() {
  console.log('🔧 Eksik VIN numaraları düzeltiliyor...\n');

  try {
    // VIN'i boş olan araçları bul
    const { data: vehiclesWithMissingVin, error } = await supabase
      .from('vehicles')
      .select('*')
      .is('vin', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Araç bulma hatası:', error);
      return;
    }

    if (!vehiclesWithMissingVin || vehiclesWithMissingVin.length === 0) {
      console.log('✅ Tüm araçların VIN numarası mevcut!');
      return;
    }

    console.log(`🔍 ${vehiclesWithMissingVin.length} araçta eksik VIN bulundu:`);
    console.log('');

    vehiclesWithMissingVin.forEach((vehicle, index) => {
      console.log(`${index + 1}. ${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
      console.log(`   Satıcı: ${vehicle.seller_email}`);
      console.log(`   ID: ${vehicle.id}`);
      console.log(`   VIN: ${vehicle.vin || 'BOŞ'}`);
      console.log('');
    });

    console.log('❓ Bu kullanıcılardan VIN numaralarını almanız gerekiyor:');
    console.log('');
    
    const uniqueEmails = [...new Set(vehiclesWithMissingVin.map(v => v.seller_email))];
    uniqueEmails.forEach(email => {
      console.log(`   📧 ${email}`);
    });

    console.log('');
    console.log('📝 Lütfen bu kullanıcılardan VIN numaralarını alın ve bana verin.');
    console.log('   Format: email: VIN_NUMARASI');
    console.log('   Örnek: tayfunn.kocak@gmail.com: 1HGBH41JXMN109186');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
fixMissingVins().then(() => {
  console.log('✅ VIN kontrolü tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 