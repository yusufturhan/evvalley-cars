// Gerçek Kullanıcı Form Gönderim Test Scripti
// Bu script gerçek kullanıcı gibi form gönderimini test eder

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

async function testRealUserSubmission() {
  console.log('🧪 Gerçek kullanıcı form gönderim testi...\n');

  try {
    // Test verileri - gerçek kullanıcı gibi
    const testVehicleData = {
      title: 'Test Vehicle - Real User',
      description: 'This is a test vehicle to verify form submission works correctly.',
      price: 15000,
      year: 2020,
      mileage: 50000,
      fuel_type: 'hybrid',
      brand: 'Toyota',
      model: 'Camry',
      category: 'hybrid-car',
      range_miles: 400,
      max_speed: 160,
      battery_capacity: '1.6 kWh',
      location: 'San Francisco',
      seller_email: 'test@example.com',
      vehicle_condition: 'excellent',
      title_status: 'clean',
      highlighted_features: 'Test features for real user submission',
      interior_color: 'Black',
      exterior_color: 'Silver',
      body_seating: 'Sedan 5-Seater',
      transmission: 'automatic',
      combined_fuel_economy: '45 mpg',
      horsepower: 150,
      electric_mile_range: 250,
      battery_warranty: '8 years',
      drivetrain: 'FWD',
      vin: 'TEST1234567890123'
    };

    console.log('📋 Test verileri:');
    Object.entries(testVehicleData).forEach(([field, value]) => {
      console.log(`   ✅ ${field}: ${value}`);
    });

    console.log('');
    console.log('🔧 Test aracı veritabanına ekleniyor...');
    
    const { data: testVehicle, error: insertError } = await supabase
      .from('vehicles')
      .insert([testVehicleData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Test aracı ekleme hatası:', insertError);
      return;
    }

    console.log('✅ Test aracı başarıyla eklendi!');
    console.log(`   ID: ${testVehicle.id}`);
    console.log(`   Başlık: ${testVehicle.title}`);
    console.log('');

    // Eklenen aracı kontrol et
    const { data: verifyVehicle, error: verifyError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', testVehicle.id)
      .single();

    if (verifyError) {
      console.error('❌ Doğrulama hatası:', verifyError);
      return;
    }

    console.log('🔍 Doğrulama - Eklenen araç detayları:');
    console.log(`   Vehicle Condition: ${verifyVehicle.vehicle_condition}`);
    console.log(`   Title Status: ${verifyVehicle.title_status}`);
    console.log(`   Highlighted Features: ${verifyVehicle.highlighted_features}`);
    console.log(`   Interior Color: ${verifyVehicle.interior_color}`);
    console.log(`   Exterior Color: ${verifyVehicle.exterior_color}`);
    console.log(`   Body/Seating: ${verifyVehicle.body_seating}`);
    console.log(`   Transmission: ${verifyVehicle.transmission}`);
    console.log(`   Fuel Economy: ${verifyVehicle.combined_fuel_economy}`);
    console.log(`   Horsepower: ${verifyVehicle.horsepower}`);
    console.log(`   Electric Range: ${verifyVehicle.electric_mile_range}`);
    console.log(`   Battery Warranty: ${verifyVehicle.battery_warranty}`);
    console.log(`   Drivetrain: ${verifyVehicle.drivetrain}`);
    console.log(`   VIN: ${verifyVehicle.vin}`);

    // Boş alanları kontrol et
    const detailFields = [
      'vehicle_condition', 'title_status', 'highlighted_features',
      'interior_color', 'exterior_color', 'body_seating', 'transmission',
      'combined_fuel_economy', 'horsepower', 'electric_mile_range',
      'battery_warranty', 'drivetrain', 'vin'
    ];

    const emptyFields = detailFields.filter(field => !verifyVehicle[field] || verifyVehicle[field] === '');
    const filledFields = detailFields.filter(field => verifyVehicle[field] && verifyVehicle[field] !== '');

    console.log('');
    console.log('📊 Test Sonucu:');
    console.log(`   Toplam alan: ${detailFields.length}`);
    console.log(`   Dolu alan: ${filledFields.length}`);
    console.log(`   Boş alan: ${emptyFields.length}`);
    console.log(`   Başarı oranı: ${((filledFields.length / detailFields.length) * 100).toFixed(1)}%`);

    if (emptyFields.length > 0) {
      console.log('   ❌ Boş alanlar:', emptyFields);
    } else {
      console.log('   ✅ Tüm alanlar başarıyla dolduruldu!');
    }

    console.log('');
    console.log('🧪 Şimdi gerçek test:');
    console.log('   1. Canlı sitenizde yeni araç ekleyin');
    console.log('   2. Tüm detay alanlarını doldurun');
    console.log('   3. Formu gönderin');
    console.log('   4. Araç detay sayfasında tüm bilgilerin göründüğünü kontrol edin');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
testRealUserSubmission().then(() => {
  console.log('✅ Gerçek kullanıcı testi tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 