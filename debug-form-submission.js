// Form Gönderim Debug Scripti
// Bu script form verilerinin doğru gönderilip gönderilmediğini test eder

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

async function debugFormSubmission() {
  console.log('🐛 Form gönderimi debug ediliyor...\n');

  try {
    // En son eklenen aracı bul
    const { data: latestVehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Araç bulunamadı:', error);
      return;
    }

    console.log('🔍 En son eklenen araç detayları:');
    console.log(`   ID: ${latestVehicle.id}`);
    console.log(`   Başlık: ${latestVehicle.title}`);
    console.log(`   Marka: ${latestVehicle.brand}`);
    console.log(`   Model: ${latestVehicle.model}`);
    console.log(`   Yıl: ${latestVehicle.year}`);
    console.log(`   Fiyat: $${latestVehicle.price}`);
    console.log(`   Konum: ${latestVehicle.location}`);
    console.log(`   Satıcı: ${latestVehicle.seller_email}`);
    console.log(`   Kategori: ${latestVehicle.category}`);
    console.log(`   Yakıt Tipi: ${latestVehicle.fuel_type}`);
    console.log('');

    // Tüm alanları kontrol et
    const fieldsToCheck = [
      'vehicle_condition', 'title_status', 'highlighted_features',
      'interior_color', 'exterior_color', 'body_seating', 'transmission',
      'combined_fuel_economy', 'horsepower', 'electric_mile_range',
      'battery_warranty', 'drivetrain', 'vin'
    ];

    console.log('📋 Alan Kontrolü:');
    fieldsToCheck.forEach(field => {
      const value = latestVehicle[field];
      const status = value && value !== '' ? '✅' : '❌';
      console.log(`   ${status} ${field}: ${value || 'BOŞ'}`);
    });

    console.log('');
    console.log('🔍 Sorun Analizi:');
    
    // Boş alanları say
    const emptyFields = fieldsToCheck.filter(field => !latestVehicle[field] || latestVehicle[field] === '');
    const filledFields = fieldsToCheck.filter(field => latestVehicle[field] && latestVehicle[field] !== '');
    
    console.log(`   Toplam alan: ${fieldsToCheck.length}`);
    console.log(`   Dolu alan: ${filledFields.length}`);
    console.log(`   Boş alan: ${emptyFields.length}`);
    
    if (emptyFields.length > 0) {
      console.log('   ❌ Boş alanlar:', emptyFields.join(', '));
    }

    // API log'larını kontrol et
    console.log('');
    console.log('🔍 API Log Kontrolü:');
    console.log('   API log\'larını kontrol etmek için:');
    console.log('   1. Browser Developer Tools > Network tab');
    console.log('   2. Yeni araç ekle');
    console.log('   3. /api/vehicles POST isteğini kontrol et');
    console.log('   4. Request payload\'ını incele');

    // Form verilerini test et
    console.log('');
    console.log('🧪 Form Test Önerisi:');
    console.log('   1. http://localhost:3000/sell adresine git');
    console.log('   2. Tüm alanları doldur');
    console.log('   3. Browser Console\'da şu kodu çalıştır:');
    console.log(`
      // Form verilerini kontrol et
      const form = document.querySelector('form');
      const formData = new FormData(form);
      console.log('Form verileri:');
      for (let [key, value] of formData.entries()) {
        console.log(\`\${key}: \${value}\`);
      }
    `);

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

// Scripti çalıştır
debugFormSubmission().then(() => {
  console.log('✅ Debug tamamlandı!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script hatası:', error);
  process.exit(1);
}); 