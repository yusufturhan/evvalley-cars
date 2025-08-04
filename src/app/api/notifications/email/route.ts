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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🚗 Evvalley</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Price change detected on your favorite vehicle!</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">${vehicle.title}</h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #059669; margin: 0 0 10px 0;">💰 New Price</h3>
                <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">$${vehicle.price.toLocaleString()}</p>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">YEAR</p>
                  <p style="margin: 0; font-weight: bold; color: #374151;">${vehicle.year}</p>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">MILEAGE</p>
                  <p style="margin: 0; font-weight: bold; color: #374151;">${vehicle.mileage ? vehicle.mileage.toLocaleString() : 'New'}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vehicles/${vehicle.id}" 
                   style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View Vehicle
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <div style="text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">This email was sent by Evvalley.</p>
                <p style="margin: 5px 0;">Manage your favorite vehicles by visiting your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/favorites" style="color: #059669;">favorites page</a>.</p>
              </div>
            </div>
          </div>
        `;
        break;
        
      case 'new_listing':
        emailSubject = `🆕 New Listing: ${vehicle.title}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🚗 Evvalley</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">New vehicle listing added!</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">${vehicle.title}</h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #059669; margin: 0 0 10px 0;">💰 Price</h3>
                <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">$${vehicle.price.toLocaleString()}</p>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">YEAR</p>
                  <p style="margin: 0; font-weight: bold; color: #374151;">${vehicle.year}</p>
                </div>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 6px;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">MILEAGE</p>
                  <p style="margin: 0; font-weight: bold; color: #374151;">${vehicle.mileage ? vehicle.mileage.toLocaleString() : 'New'}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vehicles/${vehicle.id}" 
                   style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View Vehicle
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <div style="text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">This email was sent by Evvalley.</p>
                <p style="margin: 5px 0;">Browse more vehicles by visiting our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vehicles" style="color: #059669;">vehicles page</a>.</p>
              </div>
            </div>
          </div>
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