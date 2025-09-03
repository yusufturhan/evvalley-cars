// Test Newsletter API
const testNewsletterAPI = async () => {
  try {
    console.log('🧪 Testing Newsletter API...');
    
    const response = await fetch('https://www.evvalley.com/api/email-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        campaignType: 'buyer_updates',
        source: 'test_script'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Newsletter signup successful!');
    } else {
      console.log('❌ Newsletter signup failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Test with different email
const testWithRealEmail = async () => {
  try {
    console.log('\n🧪 Testing with real email...');
    
    const response = await fetch('https://www.evvalley.com/api/email-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'evvalley12@gmail.com',
        campaignType: 'buyer_updates',
        source: 'test_script'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Newsletter signup successful!');
      console.log('📧 Check your email: evvalley12@gmail.com');
    } else {
      console.log('❌ Newsletter signup failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Run tests
console.log('🚀 Starting Newsletter API Tests...\n');
testNewsletterAPI();
setTimeout(testWithRealEmail, 2000);
