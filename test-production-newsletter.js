// Test Production Newsletter API
const testProductionNewsletter = async () => {
  try {
    console.log('🧪 Testing Production Newsletter API...');
    
    // Generate unique email
    const timestamp = Date.now();
    const testEmail = `production-test${timestamp}@example.com`;
    
    console.log('📧 Using email:', testEmail);
    
    const response = await fetch('https://www.evvalley.com/api/email-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        campaignType: 'buyer_updates',
        source: 'production_test'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Newsletter signup successful!');
      console.log('📧 Email should be sent to:', testEmail);
      
      // Check if email was actually sent
      if (data.data && data.data.id) {
        console.log('✅ Email record created in database');
        console.log('📊 Database ID:', data.data.id);
      }
      
      // Wait a bit and check if email was sent
      console.log('\n⏳ Waiting 5 seconds to check email delivery...');
      setTimeout(async () => {
        try {
          const checkResponse = await fetch(`https://www.evvalley.com/api/email-campaign?email=${testEmail}`);
          const checkData = await checkResponse.json();
          console.log('📊 Email Status Check:', checkData);
        } catch (error) {
          console.log('❌ Status check failed:', error.message);
        }
      }, 5000);
      
    } else {
      console.log('❌ Newsletter signup failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Production Test Error:', error);
  }
};

// Run test
console.log('🚀 Testing Production Newsletter API...\n');
testProductionNewsletter();
