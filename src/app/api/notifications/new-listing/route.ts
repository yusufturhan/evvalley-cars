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
    const { 
      vehicleId, 
      vehicleTitle, 
      vehicleBrand, 
      vehicleModel, 
      vehiclePrice, 
      vehicleCategory, 
      vehicleLocation 
    } = await request.json();

    if (!vehicleId || !vehicleTitle) {
      return NextResponse.json({ error: 'Vehicle ID and title are required' }, { status: 400 });
    }

    // Get all active newsletter subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email, campaign_type')
      .eq('status', 'active')
      .in('campaign_type', ['buyer_updates', 'general']);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers found');
      return NextResponse.json({ message: 'No subscribers to notify' });
    }

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(vehiclePrice);

    // Create email content
    const subject = `🚗 New ${vehicleBrand} ${vehicleModel} Listed on Evvalley!`;
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Vehicle Listing - Evvalley</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🚗 New Vehicle Alert!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A new electric vehicle has been listed on Evvalley</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #1C1F4A; margin-top: 0;">${vehicleTitle}</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Brand:</strong> <span>${vehicleBrand}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Model:</strong> <span>${vehicleModel}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Price:</strong> <span style="color: #3AB0FF; font-weight: bold;">${formattedPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Category:</strong> <span>${vehicleCategory}</span>
            </div>
            ${vehicleLocation ? `
            <div style="display: flex; justify-content: space-between;">
              <strong>Location:</strong> <span>${vehicleLocation}</span>
            </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.evvalley.com/vehicles/${vehicleId}" 
               style="background: #3AB0FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🔍 View Vehicle Details
            </a>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://www.evvalley.com/vehicles" 
               style="color: #3AB0FF; text-decoration: none; font-weight: bold;">
              Browse All Vehicles →
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            You received this email because you subscribed to Evvalley newsletter.<br>
            <a href="#" style="color: #3AB0FF;">Unsubscribe</a> | 
            <a href="https://www.evvalley.com" style="color: #3AB0FF;">Visit Evvalley</a>
          </p>
        </div>
      </body>
      </html>
    `;

    // Send emails to all subscribers
    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Evvalley <notifications@evvalley.com>',
          to: [subscriber.email],
          subject: subject,
          html: emailContent,
        });

        if (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
          errorCount++;
        } else {
          console.log(`✅ Email sent to ${subscriber.email}`);
          successCount++;
        }
      } catch (emailError) {
        console.error(`Error sending email to ${subscriber.email}:`, emailError);
        errorCount++;
      }
    }

    return NextResponse.json({
      message: 'New listing notifications sent',
      successCount,
      errorCount,
      totalSubscribers: subscribers.length
    });

  } catch (error) {
    console.error('Error in new listing notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send new listing notifications' 
    }, { status: 500 });
  }
}
