import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error('GET /api/vehicles/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    
    // Check if request is FormData or JSON
    const contentType = request.headers.get('content-type');
    let updateData: any = {};
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await request.formData();
      updateData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
        year: formData.get('year') ? parseInt(formData.get('year') as string) : undefined,
        mileage: formData.get('mileage') ? parseInt(formData.get('mileage') as string) : undefined,
        fuel_type: formData.get('fuel_type') as string,
        brand: formData.get('brand') as string,
        model: formData.get('model') as string,
        category: formData.get('category') as string,
        range_miles: formData.get('range_miles') ? parseInt(formData.get('range_miles') as string) : undefined,
        max_speed: formData.get('max_speed') ? parseInt(formData.get('max_speed') as string) : undefined,
        battery_capacity: formData.get('battery_capacity') as string,
        location: formData.get('location') as string,
        interior_color: formData.get('interior_color') as string,
        exterior_color: formData.get('exterior_color') as string,
        body_seating: formData.get('body_seating') as string,
        combined_fuel_economy: formData.get('combined_fuel_economy') as string,
        horsepower: formData.get('horsepower') ? parseInt(formData.get('horsepower') as string) : undefined,
        electric_mile_range: formData.get('electric_mile_range') ? parseInt(formData.get('electric_mile_range') as string) : undefined,
        battery_warranty: formData.get('battery_warranty') as string,
        drivetrain: formData.get('drivetrain') as string,
        vin: formData.get('vin') as string,
      };
    } else {
      // Handle JSON
      updateData = await request.json();
    }
    
    // Get current vehicle data to compare price changes
    const { data: currentVehicle, error: currentError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (currentError || !currentVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Update vehicle
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('PUT /api/vehicles/[id] error:', error);
      return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
    }

    // Check if price changed and send notifications to favorite users
    if (updateData.price && updateData.price !== currentVehicle.price) {
      console.log('🔔 Price change detected!');
      console.log('Old price:', currentVehicle.price);
      console.log('New price:', updateData.price);
      
      try {
        // Get all users who have this vehicle in favorites
        const { data: favorites, error: favoritesError } = await supabase
          .from('favorites')
          .select('user_id')
          .eq('vehicle_id', id);

        console.log('🔍 Favorites found:', favorites?.length || 0);
        console.log('🔍 Favorites data:', favorites);

        if (!favoritesError && favorites && favorites.length > 0) {
          console.log('📧 Sending email notifications to', favorites.length, 'users');
          
          // Send email notifications to all users who favorited this vehicle
          for (const favorite of favorites) {
            try {
              console.log('📧 Sending email to user:', favorite.user_id);
              
              // Get user email for notification
              const { data: user, error: userError } = await supabase
                .from('users')
                .select('email, full_name')
                .eq('id', favorite.user_id)
                .single();

              if (!userError && user) {
                const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/api/email`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    to: user.email,
                    subject: `Price Change Alert: ${vehicle.title}`,
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                          <h1 style="margin: 0; font-size: 24px;">Evvalley</h1>
                          <p style="margin: 10px 0 0 0; opacity: 0.9;">Price change detected on your favorite vehicle!</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                          <h2 style="color: #1f2937; margin-bottom: 20px;">${vehicle.title}</h2>
                          
                          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #059669; margin: 0 0 10px 0;">💰 New Price</h3>
                            <p style="font-size: 24px; font-weight: bold; color: #059669; margin: 0;">$${vehicle.price.toLocaleString()}</p>
                          </div>
                          
                          <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicle.id}" 
                               style="background: #3AB0FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                              View Vehicle
                            </a>
                          </div>
                          
                          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                          
                          <div style="text-align: center; color: #6b7280; font-size: 14px;">
                            <p style="margin: 0;">This email was sent by Evvalley.</p>
                            <p style="margin: 5px 0;">Manage your favorite vehicles by visiting your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/favorites" style="color: #3AB0FF;">favorites page</a>.</p>
                          </div>
                        </div>
                      </div>
                    `,
                    text: `
Price Change Alert: ${vehicle.title}

Hello ${user.full_name || 'there'},

The price of a vehicle in your favorites has been updated:

${vehicle.title}
New Price: $${vehicle.price.toLocaleString()}

View Vehicle: ${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicle.id}

You're receiving this email because you have this vehicle in your favorites.
                    `
                  }),
                });
              
                console.log('📧 Email response status:', emailResponse.status);
                
                if (!emailResponse.ok) {
                  const errorData = await emailResponse.json();
                  console.error('📧 Email error:', errorData);
                } else {
                  console.log('✅ Email sent successfully to user:', favorite.user_id);
                }
              } else {
                console.log('📧 User not found for notification:', favorite.user_id);
              }
            } catch (emailError) {
              console.error('❌ Failed to send email notification:', emailError);
            }
          }
        } else {
          console.log('📧 No favorites found for this vehicle');
        }
      } catch (notificationError) {
        console.error('❌ Notification error:', notificationError);
      }
    } else {
      console.log('🔔 No price change detected');
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error('PUT /api/vehicles/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();

    // Get vehicle images before deletion
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('images')
      .eq('id', id)
      .single();

    // Delete images from storage
    if (vehicle?.images) {
      for (const imageUrl of vehicle.images) {
        const imagePath = imageUrl.split('/').pop();
        if (imagePath) {
          await supabase.storage.from('vehicle-images').remove([imagePath]);
        }
      }
    }

    // Delete vehicle from database
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('❌ Delete vehicle: Database error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }

    console.log('✅ Delete vehicle: Successfully deleted vehicle:', id);
    return NextResponse.json({ message: 'Vehicle deleted successfully' });

  } catch (error) {
    console.error('❌ Delete vehicle: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 