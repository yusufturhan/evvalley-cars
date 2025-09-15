import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // API called
    // API called with ID
    const supabase = createServerSupabaseClient();
    
    // First try vehicles table
    // Searching vehicles table
    let { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_condition,
        title_status,
        highlighted_features,
        interior_color,
        exterior_color,
        body_seating,
        combined_fuel_economy,
        transmission,
        horsepower,
        electric_mile_range,
        battery_warranty,
        battery_capacity,
        drivetrain,
        vin
      `)
      .eq('id', id)
      .single();
    
    // Vehicles table search complete
    // Vehicles table search completed

    // If not found in vehicles, try ev_scooters
    if (error || !vehicle) {
      // Trying ev_scooters table
      const { data: scooter, error: scooterError } = await supabase
        .from('ev_scooters')
        .select('*')
        .eq('id', id)
        .single();
      
      // EV Scooters search completed
      
      if (scooter && !scooterError) {
        // Converting scooter to vehicle format
        // Convert scooter to vehicle format for compatibility
        vehicle = {
          ...scooter,
          category: 'ev-scooter',
          // Add any missing fields that the frontend expects
          fuel_type: 'Electric',
          drivetrain: 'Electric',
          body_seating: 'Scooter',
          combined_fuel_economy: 'Electric',
          horsepower: scooter.motor_power ? parseInt(scooter.motor_power) : null,
          electric_mile_range: scooter.max_speed ? parseInt(scooter.max_speed) : null,
          battery_warranty: scooter.warranty || null,
          vin: null, // Scooters don't have VIN
        };
        error = null;
      }
    }

    // If still not found, try e_bikes
    if (error || !vehicle) {
      const { data: bike, error: bikeError } = await supabase
        .from('e_bikes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (bike && !bikeError) {
        // Convert bike to vehicle format for compatibility
        vehicle = {
          ...bike,
          category: 'e-bike',
          // Add any missing fields that the frontend expects
          fuel_type: 'Electric',
          drivetrain: 'Electric',
          body_seating: 'Bike',
          combined_fuel_economy: 'Electric',
          horsepower: bike.motor_power ? parseInt(bike.motor_power) : null,
          electric_mile_range: bike.max_speed ? parseInt(bike.max_speed) : null,
          battery_warranty: bike.warranty || null,
          vin: null, // Bikes don't have VIN
        };
        error = null;
      } else {
        // Try e_bikes table
        // Trying e_bikes table
        const { data: bike, error: bikeError } = await supabase
          .from('e_bikes')
          .select('*')
          .eq('id', id)
          .single();
        
        // E-bikes search completed
        
        if (bike && !bikeError) {
          // Converting bike to vehicle format
          vehicle = {
            ...bike,
            category: 'e-bike',
            fuel_type: 'Electric',
            drivetrain: 'Electric',
            body_seating: 'Bike',
          };
          error = null;
        }
      }
    }

    if (error || !vehicle) {
      // Vehicle not found in any table
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    // Vehicle found successfully
    
    // Vehicle found

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
    let newImages: File[] = [];
    let deletedImages: number[] = [];
    let finalImages: string[] = [];
    
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
        highlighted_features: formData.get('highlighted_features') as string,
      };

      // Extract new images from FormData
      const images = formData.getAll('images') as File[];
      newImages = images.filter(img => img instanceof File && img.size > 0);
      
      console.log('📸 New images received:', newImages.length);

      // Support two strategies:
      // 1) Client sends deleted indices as JSON array in 'deletedImages'
      // 2) Client sends the final list of existing URLs in 'existingImages' (multi-value)
      // Extract deleted image indices
      const deletedImagesStr = formData.get('deletedImages') as string;
      if (deletedImagesStr) {
        try {
          deletedImages = JSON.parse(deletedImagesStr);
          console.log('🗑️ Deleted image indices:', deletedImages);
        } catch (error) {
          console.error('❌ Error parsing deletedImages:', error);
        }
      }

      // If existingImages provided, use them as the new order (excluding deleted ones)
      const existingImagesRaw = formData.getAll('existingImages');
      if (existingImagesRaw && existingImagesRaw.length > 0) {
        const existingImages = existingImagesRaw.map(v => String(v));
        // Use the existing images in the new order as the base for finalImages
        finalImages = existingImages;
        console.log('📸 Using existing images in new order:', finalImages.length);
      }
    } else {
      // Handle JSON
      updateData = await request.json();
    }
    
    // Get current vehicle data to compare price changes and get current images
    const { data: currentVehicle, error: currentError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (currentError || !currentVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Initialize finalImages with current images if not already set
    if (finalImages.length === 0) {
      finalImages = Array.isArray(currentVehicle.images) ? [...currentVehicle.images] : [];
    }

    // Apply deletions first
    if (deletedImages.length > 0) {
      console.log('🗑️ Processing deleted images for vehicle:', id);
      const remainingImages = finalImages.filter((_, index) => !deletedImages.includes(index));
      // Delete removed ones from storage
      for (const deletedIndex of deletedImages) {
        const imageUrl = finalImages[deletedIndex];
        if (imageUrl) {
          try {
            const imagePath = imageUrl.split('/').pop();
            if (imagePath) {
              await supabase.storage.from('vehicle-images').remove([imagePath]);
              console.log('🗑️ Deleted image from storage:', imagePath);
            }
          } catch (error) {
            console.error('❌ Error deleting image from storage:', error);
          }
        }
      }
      finalImages = remainingImages;
      console.log('📸 Remaining images after deletion:', finalImages.length);
    }

    // Then append any newly uploaded images
    if (newImages.length > 0) {
      console.log('🔄 Processing new images for vehicle:', id);
      const newImageUrls: string[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i];
        const fileExt = image.name.split('.').pop();
        const fileName = `${id}_${Date.now()}_${i}.${fileExt}`;
        try {
          const { error: uploadError } = await supabase.storage
            .from('vehicle-images')
            .upload(fileName, image, { cacheControl: '3600', upsert: false });
          if (uploadError) {
            console.error('❌ Image upload error:', uploadError);
            throw uploadError;
          }
          const { data: { publicUrl } } = supabase.storage
            .from('vehicle-images')
            .getPublicUrl(fileName);
          newImageUrls.push(publicUrl);
          console.log('✅ Uploaded new image:', fileName);
        } catch (error) {
          console.error('❌ Failed to upload image:', error);
          throw error;
        }
      }
      finalImages = [...finalImages, ...newImageUrls];
      console.log('📸 Total images after uploads:', finalImages.length);
    }

    // Update the images field
    updateData.images = finalImages;
    console.log('📸 Final images count:', finalImages.length);

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
                    subject: `🚗 Price Change Alert: ${vehicle.title}`,
                    html: `
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
                    `,
                    text: `
🚗 Price Change Alert: ${vehicle.title}

Hello ${user.full_name || 'there'},

The price of a vehicle in your favorites has been updated:

${vehicle.title}
New Price: $${vehicle.price.toLocaleString()}

Vehicle Details:
- Year: ${vehicle.year}
- Mileage: ${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' mi' : 'New'}
- Brand: ${vehicle.brand || 'N/A'}
- Fuel Type: ${vehicle.fuel_type || 'N/A'}
- Location: ${vehicle.location || 'N/A'}

View Vehicle: ${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicle.id}

You're receiving this email because you have this vehicle in your favorites.
Manage your favorites: ${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/favorites

Best regards,
The Evvalley Team
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

    // Re-index the updated vehicle for semantic search
    try {
      const indexResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/index-vehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: id })
      })
      
      if (!indexResponse.ok) {
        console.warn('Failed to re-index vehicle for semantic search:', await indexResponse.text())
      } else {
        console.log('Vehicle re-indexed successfully for semantic search')
      }
    } catch (indexError) {
      console.warn('Error re-indexing vehicle for semantic search:', indexError)
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