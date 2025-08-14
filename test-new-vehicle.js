require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase URL ve Service Role Key gerekli!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addTestVehicle() {
  try {
    console.log('🔍 Mevcut kullanıcılar kontrol ediliyor...');
    
    // Önce mevcut kullanıcıları kontrol et
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .limit(5);

    if (usersError) {
      console.error('❌ Kullanıcıları getirme hatası:', usersError);
      return;
    }

    console.log('👥 Mevcut kullanıcılar:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.full_name}`);
    });

    if (users.length === 0) {
      console.error('❌ Hiç kullanıcı bulunamadı!');
      return;
    }

    const sellerId = users[0].id; // İlk kullanıcıyı kullan
    console.log('✅ Kullanılacak seller ID:', sellerId);
    
    console.log('🚗 Yeni test aracı ekleniyor...');
    
    const testVehicle = {
      title: 'Test Vehicle - Complete Details',
      description: 'Bu araç tüm detayları ile test amaçlı eklenmiştir',
      price: 45000,
      year: 2023,
      mileage: 15000,
      fuel_type: 'electric',
      brand: 'Tesla',
      model: 'Model Y',
      category: 'ev-car',
      range_miles: 330,
      max_speed: 155,
      battery_capacity: '75 kWh',
      location: 'San Francisco, CA',
      seller_id: sellerId,
      seller_email: users[0].email,
      vehicle_condition: 'Excellent',
      title_status: 'Clean',
      highlighted_features: 'Autopilot, Premium Interior, Performance Package',
      interior_color: 'Black',
      exterior_color: 'Pearl White',
      body_seating: 'SUV/5 Seats',
      combined_fuel_economy: '330 miles',
      transmission: 'Single Speed',
      horsepower: 450,
      electric_mile_range: 330,
      battery_warranty: '8 years/120,000 miles',
      drivetrain: 'AWD',
      vin: '5YJ3E1EA0PF123456',
      images: [],
      is_active: true
    };

    const { data, error } = await supabase
      .from('vehicles')
      .insert(testVehicle)
      .select()
      .single();

    if (error) {
      console.error('❌ Araç ekleme hatası:', error);
      return;
    }

    console.log('✅ Test aracı başarıyla eklendi!');
    console.log('🚗 Araç ID:', data.id);
    console.log('📋 Araç detayları:');
    console.log('- Title:', data.title);
    console.log('- Condition:', data.vehicle_condition);
    console.log('- Title Status:', data.title_status);
    console.log('- Highlighted Features:', data.highlighted_features);
    console.log('- Interior Color:', data.interior_color);
    console.log('- Exterior Color:', data.exterior_color);
    console.log('- VIN:', data.vin);
    
    console.log('\n🌐 Test URL:');
    console.log(`https://www.evvalley.com/vehicles/${data.id}`);

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

addTestVehicle();
