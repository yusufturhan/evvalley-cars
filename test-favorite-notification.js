// Test Favorite Sold Notification API
const testFavoriteNotification = async () => {
  try {
    console.log('🧪 Testing Favorite Sold Notification API...');
    
    const response = await fetch('https://www.evvalley.com/api/notifications/favorite-sold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: 'test-vehicle-id',
        vehicleTitle: 'Test Vehicle - Toyota Prius 2015',
        sellerEmail: 'test@example.com'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Favorite notification test successful!');
      console.log('📧 Total users to notify:', data.total);
      console.log('✅ Successful notifications:', data.successful);
      console.log('❌ Failed notifications:', data.failed);
    } else {
      console.log('❌ Favorite notification test failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Test with a real vehicle ID (replace with actual vehicle ID from your database)
const testWithRealVehicle = async () => {
  try {
    console.log('\n🧪 Testing with real vehicle ID...');
    
    // You can replace this with an actual vehicle ID from your database
    const realVehicleId = 'your-actual-vehicle-id-here';
    
    if (realVehicleId === 'your-actual-vehicle-id-here') {
      console.log('⚠️ Please replace the vehicle ID with a real one from your database');
      return;
    }
    
    const response = await fetch('https://www.evvalley.com/api/notifications/favorite-sold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId: realVehicleId,
        vehicleTitle: 'Real Vehicle Test',
        sellerEmail: 'test@example.com'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Real vehicle notification test successful!');
    } else {
      console.log('❌ Real vehicle notification test failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Real Vehicle Test Error:', error);
  }
};

// Run tests
console.log('🚀 Starting Favorite Notification Tests...\n');
testFavoriteNotification();
setTimeout(testWithRealVehicle, 2000);
