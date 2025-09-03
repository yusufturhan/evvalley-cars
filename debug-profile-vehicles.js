const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugVehicles() {
  console.log('🔍 Debugging vehicles for carfornia.com@gmail.com...\n');

  // 1. Check if user exists
  console.log('1️⃣ Checking if user exists...');
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'carfornia.com@gmail.com');

  if (userError) {
    console.error('❌ Error fetching user:', userError);
    return;
  }

  console.log('👤 Users found:', users.length);
  if (users.length > 0) {
    console.log('📧 User email:', users[0].email);
    console.log('🆔 User ID:', users[0].id);
    console.log('🔑 Clerk ID:', users[0].clerk_id);
  }

  // 2. Check vehicles by seller_email
  console.log('\n2️⃣ Checking vehicles by seller_email...');
  const { data: vehiclesByEmail, error: emailError } = await supabase
    .from('vehicles')
    .select('*')
    .eq('seller_email', 'carfornia.com@gmail.com');

  if (emailError) {
    console.error('❌ Error fetching vehicles by email:', emailError);
  } else {
    console.log('🚗 Vehicles by seller_email:', vehiclesByEmail.length);
    vehiclesByEmail.forEach(v => {
      console.log(`   - ${v.title} (ID: ${v.id}, Sold: ${v.sold}, Active: ${v.is_active})`);
    });
  }

  // 3. Check vehicles by seller_id (if user exists)
  if (users.length > 0) {
    console.log('\n3️⃣ Checking vehicles by seller_id...');
    const { data: vehiclesById, error: idError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('seller_id', users[0].id);

    if (idError) {
      console.error('❌ Error fetching vehicles by ID:', idError);
    } else {
      console.log('🚗 Vehicles by seller_id:', vehiclesById.length);
      vehiclesById.forEach(v => {
        console.log(`   - ${v.title} (ID: ${v.id}, Sold: ${v.sold}, Active: ${v.is_active})`);
      });
    }
  }

  // 4. Check all vehicles (to see if any exist)
  console.log('\n4️⃣ Checking all vehicles in database...');
  const { data: allVehicles, error: allError } = await supabase
    .from('vehicles')
    .select('*')
    .limit(10);

  if (allError) {
    console.error('❌ Error fetching all vehicles:', allError);
  } else {
    console.log('🚗 Total vehicles in database:', allVehicles.length);
    allVehicles.forEach(v => {
      console.log(`   - ${v.title} (Seller: ${v.seller_email}, Sold: ${v.sold})`);
    });
  }

  // 5. Check if there are any vehicles with carfornia.com in any field
  console.log('\n5️⃣ Checking for any vehicles with carfornia.com...');
  const { data: anyCarfornia, error: anyError } = await supabase
    .from('vehicles')
    .select('*')
    .or('seller_email.ilike.%carfornia.com%');

  if (anyError) {
    console.error('❌ Error searching for carfornia.com:', anyError);
  } else {
    console.log('🚗 Vehicles with carfornia.com:', anyCarfornia.length);
    anyCarfornia.forEach(v => {
      console.log(`   - ${v.title} (Seller: ${v.seller_email}, ID: ${v.id})`);
    });
  }
}

debugVehicles().catch(console.error);
