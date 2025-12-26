import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { email } = await request.json();

    // Email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email,
          subscribed_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.evvalley.com'}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to Evvalley Newsletter! 🚗',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Evvalley Newsletter</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                    <span style="font-size: 32px;">🚗</span>
                  </div>
                  <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">Welcome to Evvalley!</h1>
                  <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">You're now subscribed to our newsletter</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">Thank You for Subscribing!</h2>
                  
                  <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                    Welcome to the Evvalley community! You're now part of a growing network of electric vehicle enthusiasts and professionals.
                  </p>
                  
                  <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">What you'll receive:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                      <li style="margin-bottom: 8px;">Latest EV industry news and trends</li>
                      <li style="margin-bottom: 8px;">Expert tips on EV maintenance and care</li>
                      <li style="margin-bottom: 8px;">New vehicle listings and market updates</li>
                      <li style="margin-bottom: 8px;">Exclusive offers and promotions</li>
                    </ul>
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.evvalley.com'}/blog" 
                       style="background: linear-gradient(135deg, #3AB0FF, #2A8FE6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(58, 176, 255, 0.3);">
                      📖 Read Our Latest Articles
                    </a>
                  </div>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
                  
                  <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0 0 10px 0;">This email was sent by Evvalley - Your trusted EV marketplace.</p>
                    <p style="margin: 0 0 15px 0;">Visit our website: 
                      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.evvalley.com'}" style="color: #3AB0FF; text-decoration: none; font-weight: 500;">www.evvalley.com</a>
                    </p>
                    <p style="margin: 0; font-size: 12px;">
                      You can unsubscribe at any time by clicking the link below.
                    </p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send welcome email');
      } else {
        console.log('Welcome email sent successfully to:', email);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter!',
        data: { id: data.id, email: data.email }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
