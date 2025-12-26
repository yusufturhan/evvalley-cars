import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { vehicleId, vehicleTitle, sellerEmail } = await request.json();

    console.log('🔔 Sending favorite sold notifications for vehicle:', vehicleId);

    // Get all users who have this vehicle in their favorites
    const supabase = createServerSupabaseClient();
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('user_id, users!inner(email, first_name, last_name)')
      .eq('vehicle_id', vehicleId);

    if (favoritesError) {
      console.error('❌ Error fetching favorites:', favoritesError);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    if (!favorites || favorites.length === 0) {
      console.log('ℹ️ No favorites found for this vehicle');
      return NextResponse.json({ message: 'No favorites to notify' });
    }

    console.log(`📧 Found ${favorites.length} users to notify`);

    // Send email notifications to each user
    const notificationPromises = favorites.map(async (favorite) => {
      const user = favorite.users;
      
      if (!user.email) {
        console.log('⚠️ User has no email:', user);
        return;
      }

      try {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3AB0FF 0%, #78D64B 100%); padding: 20px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚗 Vehicle Sold Notification</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hi ${user.first_name || 'there'}!</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                We wanted to let you know that a vehicle you had in your favorites has been sold:
              </p>
              
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3AB0FF; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0;">${vehicleTitle}</h3>
                <p style="color: #666; margin: 0;">This vehicle has been marked as sold by the seller.</p>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Don't worry! We have many other great electric vehicles available. 
                <a href="https://www.evvalley.com/vehicles" style="color: #3AB0FF; text-decoration: none; font-weight: bold;">
                  Browse our current listings →
                </a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                You're receiving this email because you had this vehicle in your favorites.
                <br>
                <a href="https://www.evvalley.com/favorites" style="color: #3AB0FF; text-decoration: none;">
                  Manage your favorites
                </a>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                © 2025 Evvalley. All rights reserved.
              </p>
            </div>
          </div>
        `;

        const { data: emailData, error: emailError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@evvalley.com',
          to: user.email,
          subject: `🚗 Vehicle Sold: ${vehicleTitle}`,
          html: emailContent,
        });

        if (emailError) {
          console.error(`❌ Failed to send email to ${user.email}:`, emailError);
          return { success: false, email: user.email, error: emailError };
        } else {
          console.log(`✅ Email sent successfully to ${user.email}:`, emailData?.id);
          return { success: true, email: user.email, emailId: emailData?.id };
        }
      } catch (error) {
        console.error(`❌ Error sending email to ${user.email}:`, error);
        return { success: false, email: user.email, error };
      }
    });

    const results = await Promise.all(notificationPromises);
    const successful = results.filter(r => r?.success).length;
    const failed = results.filter(r => !r?.success).length;

    console.log(`📊 Notification results: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      message: 'Favorite sold notifications sent',
      total: favorites.length,
      successful,
      failed,
      results
    });

  } catch (error) {
    console.error('❌ Error in favorite sold notification:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
