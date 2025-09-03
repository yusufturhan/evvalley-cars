// Using Node.js built-in fetch

async function testAPI() {
  console.log('🔍 Testing API endpoints...\n');

  const baseUrl = 'https://evvalley-cars-f87c6nrmd-yusufs-projects-e9d21f34.vercel.app';
  const userId = '981ea6ba-417d-4e93-ada8-f52934dde072';
  const email = 'carfornia.com@gmail.com';

  // Test 1: seller_id
  console.log('1️⃣ Testing seller_id endpoint...');
  try {
    const response1 = await fetch(`${baseUrl}/api/vehicles?seller_id=${userId}&includeSold=true`);
    console.log('Status:', response1.status);
    const data1 = await response1.json();
    console.log('Vehicles found:', data1.vehicles?.length || 0);
    console.log('Response:', JSON.stringify(data1, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n2️⃣ Testing seller_email endpoint...');
  try {
    const response2 = await fetch(`${baseUrl}/api/vehicles?seller_email=${encodeURIComponent(email)}&includeSold=true`);
    console.log('Status:', response2.status);
    const data2 = await response2.json();
    console.log('Vehicles found:', data2.vehicles?.length || 0);
    console.log('Response:', JSON.stringify(data2, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n3️⃣ Testing without includeSold...');
  try {
    const response3 = await fetch(`${baseUrl}/api/vehicles?seller_email=${encodeURIComponent(email)}`);
    console.log('Status:', response3.status);
    const data3 = await response3.json();
    console.log('Vehicles found:', data3.vehicles?.length || 0);
    console.log('Response:', JSON.stringify(data3, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI().catch(console.error);
