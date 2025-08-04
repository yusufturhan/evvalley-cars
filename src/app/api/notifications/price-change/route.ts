import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, oldPrice, newPrice } = await request.json();

    if (!vehicleId || !oldPrice || !newPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Get vehicle details
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('title, brand, model, seller_id')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Get all users who have this vehicle in their favorites
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('user_id')
      .eq('vehicle_id', vehicleId);

    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    // Get user emails for notification
    const userIds = favorites.map(fav => fav.user_id);
    
    if (userIds.length === 0) {
      return NextResponse.json({ message: 'No users to notify' });
    }

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, full_name')
      .in('id', userIds);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Send email notifications
    const priceChangePercent = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1);
    const priceChangeDirection = newPrice > oldPrice ? 'increased' : 'decreased';

    for (const user of users) {
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: user.email,
            subject: `Price Update: ${vehicle.brand} ${vehicle.model}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">🚗 Evvalley</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Price Update Notification</p>
                </div>
                
                <div style="padding: 30px; background: white;">
                  <h2 style="color: #1C1F4A; margin-bottom: 20px;">Price Change Alert</h2>
                  
                  <p style="color: #4A5568; line-height: 1.6; margin-bottom: 20px;">
                    Hello ${user.full_name || 'there'},
                  </p>
                  
                  <p style="color: #4A5568; line-height: 1.6; margin-bottom: 20px;">
                    The price of a vehicle in your favorites has been updated:
                  </p>
                  
                  <div style="background: #F5F9FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #1C1F4A; margin: 0 0 10px 0;">${vehicle.brand} ${vehicle.model}</h3>
                    <p style="color: #4A5568; margin: 0 0 15px 0;">${vehicle.title}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                      <span style="color: #4A5568;">Old Price:</span>
                      <span style="color: #E53E3E; font-weight: bold;">$${oldPrice.toLocaleString()}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                      <span style="color: #4A5568;">New Price:</span>
                      <span style="color: #38A169; font-weight: bold;">$${newPrice.toLocaleString()}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #4A5568;">Change:</span>
                      <span style="color: ${newPrice > oldPrice ? '#E53E3E' : '#38A169'}; font-weight: bold;">
                        ${priceChangeDirection} ${priceChangePercent}%
                      </span>
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/vehicles/${vehicleId}" 
                       style="background: #3AB0FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      View Vehicle Details
                    </a>
                  </div>
                  
                  <p style="color: #4A5568; font-size: 14px; margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
                    You're receiving this email because you have this vehicle in your favorites. 
                    To manage your notifications, visit your profile settings.
                  </p>
                </div>
                
                <div style="background: #1C1F4A; color: white; padding: 20px; text-align: center; font-size: 14px;">
                  <p style="margin: 0;">© 2024 Evvalley. All rights reserved.</p>
                  <p style="margin: 5px 0 0 0; opacity: 0.8;">Electric Vehicle & E-Mobility Marketplace</p>
                </div>
              </div>
            `,
            text: `
Price Update: ${vehicle.brand} ${vehicle.model}

Hello ${user.full_name || 'there'},

The price of a vehicle in your favorites has been updated:

${vehicle.brand} ${vehicle.model}
${vehicle.title}

Old Price: $${oldPrice.toLocaleString()}
New Price: $${newPrice.toLocaleString()}
Change: ${priceChangeDirection} ${priceChangePercent}%

View Vehicle Details: ${process.env.NEXT_PUBLIC_BASE_URL}/vehicles/${vehicleId}

You're receiving this email because you have this vehicle in your favorites.
            `
          }),
        });

        if (!emailResponse.ok) {
          console.error(`Failed to send email to ${user.email}`);
        }
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      notifiedUsers: users.length 
    });

  } catch (error) {
    console.error('Price change notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 