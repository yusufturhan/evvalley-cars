import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, campaignType, source } = await request.json();

    if (!email || !campaignType) {
      return NextResponse.json({ error: 'Email and campaign type are required' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return NextResponse.json({ 
        message: 'Email already subscribed',
        subscribed: true 
      });
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          campaign_type: campaignType,
          source: source || 'website',
          subscribed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting subscriber:', error);
      
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return NextResponse.json({ 
          message: 'Email already subscribed',
          subscribed: true 
        });
      }
      
      return NextResponse.json({ 
        error: 'Failed to subscribe. Please try again later.',
        details: error.message 
      }, { status: 500 });
    }

    // Send welcome email based on campaign type
    let subject = '';
    let content = '';

    switch (campaignType) {
      case 'seller_incentives':
        subject = 'Start Earning Money Selling Your Electric Vehicle!';
        content = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Evvalley - Seller Incentives</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🚗 Welcome to Evvalley!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Electric Vehicle Marketplace</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1C1F4A; margin-top: 0;">Start Earning Money Selling Your EV!</h2>
              <p>You're now subscribed to our seller incentives program. Here's what you can expect:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin: 10px 0;"><strong>💰 No listing fees</strong> - List your EV for free</li>
                  <li style="margin: 10px 0;"><strong>👥 Large audience</strong> of EV buyers</li>
                  <li style="margin: 10px 0;"><strong>🛡️ Secure transactions</strong> with buyer protection</li>
                  <li style="margin: 10px 0;"><strong>⭐ Featured listings</strong> for maximum visibility</li>
                  <li style="margin: 10px 0;"><strong>📊 Market insights</strong> and pricing data</li>
                  <li style="margin: 10px 0;"><strong>🎁 Seller rewards</strong> and bonuses</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.evvalley.com/sell" style="background: #3AB0FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">🚀 Start Selling Today</a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 14px; color: #666; text-align: center;">
                You can unsubscribe at any time by clicking <a href="#" style="color: #3AB0FF;">here</a>
              </p>
            </div>
          </body>
          </html>
        `;
        break;
      
      case 'buyer_updates':
        subject = 'Stay Updated on Electric Vehicle Deals!';
        content = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Evvalley - Buyer Updates</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🔋 Welcome to Evvalley!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Electric Vehicle Marketplace</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1C1F4A; margin-top: 0;">Get Electric Vehicle Deals First!</h2>
              <p>You're now subscribed to our buyer updates. Get notified about:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin: 10px 0;"><strong>🚗 New electric vehicle listings</strong></li>
                  <li style="margin: 10px 0;"><strong>💰 Price drops and special deals</strong></li>
                  <li style="margin: 10px 0;"><strong>📱 New features and improvements</strong></li>
                  <li style="margin: 10px 0;"><strong>📚 Expert buying guides</strong></li>
                  <li style="margin: 10px 0;"><strong>🔋 EV charging and maintenance tips</strong></li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.evvalley.com/vehicles" style="background: #3AB0FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">🔍 Browse Vehicles</a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 14px; color: #666; text-align: center;">
                You can unsubscribe at any time by clicking <a href="#" style="color: #3AB0FF;">here</a>
              </p>
            </div>
          </body>
          </html>
        `;
        break;
      
      default:
        subject = 'Welcome to Evvalley - Your Electric Vehicle Marketplace!';
        content = `
          <h2>Welcome to Evvalley!</h2>
          <p>Thank you for subscribing to our newsletter. Stay updated on:</p>
          <ul>
            <li>🚗 Latest electric vehicle listings</li>
            <li>💰 Seller incentives and deals</li>
            <li>📚 Expert guides and tips</li>
            <li>🔋 EV industry news</li>
          </ul>
          <p><a href="https://www.evvalley.com" style="background: #3AB0FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Visit Evvalley</a></p>
        `;
    }

    // Send welcome email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@evvalley.com',
          to: email,
          subject: subject,
          html: content,
        });

        if (emailError) {
          console.error('❌ Email sending error:', emailError);
        } else {
          console.log('✅ Welcome email sent successfully:', emailData?.id);
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured, skipping email send');
    }

    return NextResponse.json({ 
      message: 'Successfully subscribed',
      data,
      subscribed: true 
    });

  } catch (error) {
    console.error('Error in email campaign subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignType = searchParams.get('campaign_type');

    let query = supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (campaignType) {
      query = query.eq('campaign_type', campaignType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subscribers:', error);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    return NextResponse.json({ 
      subscribers: data,
      total: data?.length || 0
    });

  } catch (error) {
    console.error('Error in email campaign GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
