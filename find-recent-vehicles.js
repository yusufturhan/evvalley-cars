require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase URL ve Service Role Key gerekli!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findRecentVehicles() {
  try {
    console.log('🔍 En son eklenen araçlar kontrol ediliyor...');
    
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, title, created_at, seller_email, vehicle_condition, title_status, highlighted_features, interior_color, exterior_color, vin')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Araçları getirme hatası:', error);
      return;
    }

    console.log('🚗 En son eklenen araçlar:');
    vehicles.forEach((vehicle, index) => {
      console.log(`\n${index + 1}. Araç:`);
      console.log(`   ID: ${vehicle.id}`);
      console.log(`   Title: ${vehicle.title}`);
      console.log(`   Seller: ${vehicle.seller_email}`);
      console.log(`   Created: ${vehicle.created_at}`);
      console.log(`   Condition: ${vehicle.vehicle_condition || 'N/A'}`);
      console.log(`   Title Status: ${vehicle.title_status || 'N/A'}`);
      console.log(`   Interior Color: ${vehicle.interior_color || 'N/A'}`);
      console.log(`   Exterior Color: ${vehicle.exterior_color || 'N/A'}`);
      console.log(`   VIN: ${vehicle.vin || 'N/A'}`);
      console.log(`   URL: https://evvalley.com/vehicles/${vehicle.id}`);
    });

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

findRecentVehicles();
