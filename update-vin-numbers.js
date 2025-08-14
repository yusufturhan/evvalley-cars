// VIN Numaralarını Güncelleme Scripti
// Bu script eksik VIN numaralarını günceller

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

async function updateVinNumbers() {
  console.log('🔧 VIN numaraları güncelleniyor...\n');

  try {
    // VIN güncellemeleri
    const vinUpdates = [
      {
        email: 'dakuber61@gmail.com',
        vin: 'JTDBCMFE5P3014950',
        vehicleInfo: 'Toyota Corolla Hybrid 2023'
      },
      {
        email: 'tayfunn.kocak@gmail.com', 
        vin: 'JTDBCMFE9P3014885',
        vehicleInfo: 'Toyota Corolla 2023'
      },
      {
        email: 'muhammedaliaslanusa@gmail.com',
        vin: 'JTDKN3DU7A0004332',
        vehicleInfo: 'Toyota Prius 2010'
      }
    ];

    console.log('📋 Güncellenecek VIN numaraları:');
    vinUpdates.forEach((update, index) => {
      console.log(`${index + 1}. ${update.vehicleInfo}`);
      console.log(`   Email: ${update.email}`);
      console.log(`   VIN: ${update.vin}`);
      console.log('');
    });

    // Her VIN'i güncelle
    for (const update of vinUpdates) {
      console.log(`🔧 ${update.vehicleInfo} güncelleniyor...`);
      
      const { data: updatedVehicle, error } = await supabase
        .from('vehicles')
        .update({ vin: update.vin })
        .eq('seller_email', update.email)
        .is('vin', null)
        .select()
        .single();

      if (error) {
        console.error(`❌ ${update.vehicleInfo} güncelleme hatası:`, error);
        continue;
      }

      if (updatedVehicle) {
        console.log(`✅ ${update.vehicleInfo} başarıyla güncellendi!`);
        console.log(`   ID: ${updatedVehicle.id}`);
        console.log(`   VIN: ${updatedVehicle.vin}`);
        console.log('');
      } else {
        console.log(`ℹ️ ${update.vehicleInfo} için güncellenecek araç bulunamadı.`);
        console.log('');
      }
    }

    // Güncelleme sonrası kontrol
    console.log('🔍 Güncelleme sonrası kontrol...');
    
    const { data: allVehicles, error: checkError } = await supabase
      .from('vehicles')
      .select('seller_email, brand, model, year, vin')
      .order('created_at', { ascending: false });

    if (checkError) {
      console.error('❌ Kontrol hatası:', checkError);
      return;
    }

    console.log('📊 VIN Durumu:');
    allVehicles.forEach(vehicle => {
      const status = vehicle.vin ? '✅' : '❌';
      console.log(`   ${status} ${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${vehicle.seller_email}: ${vehicle.vin || 'BOŞ'}`);
    });

    const vehiclesWithVin = allVehicles.filter(v => v.vin);
    const vehiclesWithoutVin = allVehicles.filter(v => !v.vin);

    console.log('');
    console.log('📈 Özet:');
    console.log(`   Toplam araç: ${allVehicles.length}`);
    console.log(`   VIN'li araç: ${vehiclesWithVin.length}`);
    console.log(`   VIN'siz araç: ${vehiclesWithoutVin.length}`);
    console.log(`   Tamamlanma oranı: ${((vehiclesWithVin.length / allVehicles.length) * 100).toFixed(1)}%`);

    if (vehiclesWithoutVin.length === 0) {
      console.log('🎉 Tüm araçların VIN numarası mevcut!');
    } else {
      console.log('⚠️ Hala VIN\'siz araçlar var.');
    }

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
updateVinNumbers().then(() => {
  console.log('✅ VIN güncelleme tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 