import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log('📧 Email notification API called');
    const { userId, vehicleId, notificationType, vehicleData } = await request.json();
    
    console.log('📧 Request data:', { userId, vehicleId, notificationType });
    
    const supabase = createServerSupabaseClient();
    
    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('📧 User lookup result:', { user: user?.email, error: userError });

    if (userError || !user) {
      console.log('❌ User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get vehicle information
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    let emailSubject = '';
    let emailContent = '';

    switch (notificationType) {
      case 'price_change':
        emailSubject = `🚗 Price Change Alert: ${vehicle.title}`;
        emailContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Price Change Alert</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                  <span style="font-size: 32px;">🚗</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">Evvalley</h1>
                <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Price change detected on your favorite vehicle!</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">${vehicle.title}</h2>
                
                <!-- Price Highlight -->
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; color: white;">
                  <h3 style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">💰 New Price</h3>
                  <p style="font-size: 32px; font-weight: bold; margin: 0;">$${vehicle.price.toLocaleString()}</p>
                </div>
                
                <!-- Vehicle Details -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
                  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #3AB0FF;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Year</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; color: #374151; font-size: 18px;">${vehicle.year}</p>
                  </div>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #3AB0FF;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Mileage</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; color: #374151; font-size: 18px;">${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' mi' : 'New'}</p>
                  </div>
                </div>
                
                <!-- Additional Details -->
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 25px 0;">
                  <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">Vehicle Details</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div>
                      <span style="color: #6b7280;">Brand:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.brand || 'N/A'}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280;">Fuel Type:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.fuel_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280;">Location:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280;">Condition:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.vehicle_condition || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicle.id}" 
                     style="background: linear-gradient(135deg, #3AB0FF, #2A8FE6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(58, 176, 255, 0.3);">
                    👀 View Vehicle Details
                  </a>
                </div>
                
                <!-- Footer -->
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
                
                <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  <p style="margin: 0 0 10px 0;">This email was sent by Evvalley - Your trusted EV marketplace.</p>
                  <p style="margin: 0 0 15px 0;">Manage your favorite vehicles by visiting your 
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/favorites" style="color: #3AB0FF; text-decoration: none; font-weight: 500;">favorites page</a>.
                  </p>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      © 2025 Evvalley. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
        
      case 'new_listing':
        emailSubject = `🆕 New Listing: ${vehicle.title}`;
        emailContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Vehicle Listing</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                  <span style="font-size: 32px;">🆕</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">Evvalley</h1>
                <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">New vehicle listing added to our marketplace!</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">${vehicle.title}</h2>
                
                <!-- Price Highlight -->
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; color: white;">
                  <h3 style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">💰 Price</h3>
                  <p style="font-size: 32px; font-weight: bold; margin: 0;">$${vehicle.price.toLocaleString()}</p>
                </div>
                
                <!-- Vehicle Details -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
                  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #3AB0FF;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Year</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; color: #374151; font-size: 18px;">${vehicle.year}</p>
                  </div>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #3AB0FF;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Mileage</p>
                    <p style="margin: 5px 0 0 0; font-weight: bold; color: #374151; font-size: 18px;">${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' mi' : 'New'}</p>
                  </div>
                </div>
                
                <!-- Additional Details -->
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 25px 0;">
                  <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">Vehicle Details</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                    <div>
                      <span style="color: #6b7280;">Brand:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.brand || 'N/A'}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280;">Fuel Type:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.fuel_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280;">Location:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span style="color: #6b7280;">Condition:</span>
                      <span style="color: #374151; font-weight: 500; margin-left: 5px;">${vehicle.vehicle_condition || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Description Preview -->
                ${vehicle.description ? `
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 25px 0;">
                  <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">Description</h4>
                  <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 14px;">
                    ${vehicle.description.length > 150 ? vehicle.description.substring(0, 150) + '...' : vehicle.description}
                  </p>
                </div>
                ` : ''}
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicle.id}" 
                     style="background: linear-gradient(135deg, #3AB0FF, #2A8FE6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(58, 176, 255, 0.3);">
                    👀 View Vehicle Details
                  </a>
                </div>
                
                <!-- Footer -->
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
                
                <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  <p style="margin: 0 0 10px 0;">This email was sent by Evvalley - Your trusted EV marketplace.</p>
                  <p style="margin: 0 0 15px 0;">Browse more vehicles by visiting our 
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles" style="color: #3AB0FF; text-decoration: none; font-weight: 500;">vehicles page</a>.
                  </p>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      © 2025 Evvalley. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    // Send email
    console.log('📧 Sending email to:', user.email);
    console.log('📧 Email subject:', emailSubject);
    
    const { data, error } = await resend.emails.send({
              from: 'Evvalley <evvalley@evvalley.com>',
      to: [user.email],
      subject: emailSubject,
      html: emailContent,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log('✅ Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 