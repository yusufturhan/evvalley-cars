// Test Production Resend API
const testProductionResend = async () => {
  try {
    console.log('🧪 Testing Production Resend API...');
    
    // Test with your actual Resend API key
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer re_W5uwDhWv_5npGUYJpzCVgcLRv3fov9vZQ`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'evvalley@evvalley.com',
        to: 'evvalley12@gmail.com',
        subject: 'Production Test Email from Evvalley',
        html: '<h1>Production Test</h1><p>This is a test email to verify Resend is working in production.</p>'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Production Resend API working!');
      console.log('📧 Email ID:', data.id);
      console.log('📧 Check your email: evvalley12@gmail.com');
    } else {
      console.log('❌ Production Resend API failed:', data);
      
      // Check specific error
      if (data.statusCode === 403) {
        console.log('❌ Forbidden - Check API key and domain verification');
      } else if (data.statusCode === 422) {
        console.log('❌ Validation Error - Check from email domain');
      } else if (data.statusCode === 429) {
        console.log('❌ Rate Limited - Too many requests');
      }
    }
    
  } catch (error) {
    console.error('❌ Production Resend Test Error:', error);
  }
};

// Run test
console.log('🚀 Testing Production Resend API...\n');
testProductionResend();
