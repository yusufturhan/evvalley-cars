// Test Resend API directly
const testResend = async () => {
  try {
    console.log('🧪 Testing Resend API directly...');
    
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
        subject: 'Test Email from Evvalley',
        html: '<h1>Test Email</h1><p>This is a test email to verify Resend is working.</p>'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Resend API working!');
      console.log('📧 Email ID:', data.id);
    } else {
      console.log('❌ Resend API failed:', data);
    }
    
  } catch (error) {
    console.error('❌ Resend Test Error:', error);
  }
};

// Run test
console.log('🚀 Testing Resend API...\n');
testResend();
