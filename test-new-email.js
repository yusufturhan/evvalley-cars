// Test Newsletter API with new email
const testNewEmail = async () => {
  try {
    console.log('🧪 Testing Newsletter API with new email...');
    
    // Generate unique email
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    console.log('📧 Using email:', testEmail);
    
    const response = await fetch('https://www.evvalley.com/api/email-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        campaignType: 'buyer_updates',
        source: 'test_script'
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
    } else {
      console.log('❌ Newsletter signup failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
};

// Run test
console.log('🚀 Testing Newsletter API with new email...\n');
testNewEmail();
