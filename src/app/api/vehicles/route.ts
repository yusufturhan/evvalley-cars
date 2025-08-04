import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/database';
import { uploadImage as uploadToStorage } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const year = searchParams.get('year');
    const seller_id = searchParams.get('seller_id');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const includeSold = searchParams.get('includeSold');

    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    // Only show unsold vehicles by default, unless includeSold is true
    if (!includeSold) {
      query = query.eq('sold', false);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (brand && brand !== 'all') {
      query = query.eq('brand', brand);
    }

    if (seller_id) {
      query = query.eq('seller_id', seller_id);
    }

    if (year && year !== 'all') {
      query = query.eq('year', parseInt(year));
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`);
    }

    // Location search
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }



    // Serialize dates and ensure all data is plain objects for Next.js 15 compatibility
    const serializedData = data?.map(vehicle => {
      const plainVehicle = { ...vehicle };
      // Convert dates to strings
      if (plainVehicle.created_at) {
        plainVehicle.created_at = plainVehicle.created_at.toString();
      }
      if (plainVehicle.updated_at) {
        plainVehicle.updated_at = plainVehicle.updated_at.toString();
      }
      if (plainVehicle.sold_at) {
        plainVehicle.sold_at = plainVehicle.sold_at.toString();
      }
      // Ensure all properties are serializable
      return JSON.parse(JSON.stringify(plainVehicle));
    }) || [];

    return NextResponse.json({ vehicles: serializedData });
  } catch (error) {
    console.error('GET /api/vehicles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log('Received form data');

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const year = formData.get('year') as string;
    const mileage = formData.get('mileage') as string;
    const fuel_type = formData.get('fuel_type') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const category = formData.get('category') as string;
    const range_miles = formData.get('range_miles') as string;
    const max_speed = formData.get('max_speed') as string;
    const battery_capacity = formData.get('battery_capacity') as string;
    const location = formData.get('location') as string;
    const seller_id = formData.get('seller_id') as string;
    const vehicle_condition = formData.get('vehicle_condition') as string;
    const title_status = formData.get('title_status') as string;
    const highlighted_features = formData.get('highlighted_features') as string;

    // Validate required fields
    if (!title || !price || !year || !brand || !model || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, price, year, brand, model, category' 
      }, { status: 400 });
    }

    // Use a default UUID if seller_id is not provided or invalid
    const defaultSellerId = '1b69d5c5-283a-4d53-979f-4f6eb7a5ea0a';

    // Create vehicle data
    const vehicleData = {
      title,
      description,
      price: parseFloat(price),
      year: parseInt(year),
      mileage: mileage ? parseInt(mileage) : null,
      fuel_type: fuel_type || null,
      brand,
      model,
      category,
      range_miles: range_miles ? parseInt(range_miles) : null,
      max_speed: max_speed ? parseInt(max_speed) : null,
      battery_capacity: battery_capacity || null,
      location: location || null,
      seller_id: seller_id || defaultSellerId,
      vehicle_condition: vehicle_condition || null,
      title_status: title_status || null,
      highlighted_features: highlighted_features || null,
      // Extended fields - only if provided
      interior_color: formData.get('interior_color') as string || null,
      exterior_color: formData.get('exterior_color') as string || null,
      body_seating: formData.get('body_seating') as string || null,
      combined_fuel_economy: formData.get('combined_fuel_economy') as string || null,
      transmission: formData.get('transmission') as string || null,
      horsepower: formData.get('horsepower') ? parseInt(formData.get('horsepower') as string) : null,
      electric_mile_range: formData.get('electric_mile_range') ? parseInt(formData.get('electric_mile_range') as string) : null,
      battery_warranty: formData.get('battery_warranty') as string || null,
      drivetrain: formData.get('drivetrain') as string || null,
      vin: formData.get('vin') as string || null,
      images: [], // Will be populated after upload
      is_active: true
    };

    console.log('Inserting vehicle data:', vehicleData);

    // Use service role client to bypass RLS
    const supabaseAdmin = createServerSupabaseClient();
    
    const { data: vehicle, error: insertError } = await supabaseAdmin
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ 
        error: `Failed to create vehicle: ${insertError.message}` 
      }, { status: 500 });
    }

    console.log('Successfully created vehicle:', vehicle);

    // Handle image uploads
    const uploadedImages: string[] = [];
    const imageFiles = formData.getAll('images') as File[];

    console.log('=== IMAGE UPLOAD DEBUG ===');
    console.log('Image files found:', imageFiles.length);
    console.log('FormData keys:', Array.from(formData.keys()));

    if (imageFiles && imageFiles.length > 0) {
      console.log(`Uploading ${imageFiles.length} images...`);
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        console.log(`Processing image ${i + 1}:`, { 
          name: file.name, 
          size: file.size, 
          type: file.type,
          lastModified: file.lastModified
        });
        
        if (file && file.size > 0) {
          try {
            console.log(`Attempting to upload image ${i + 1} to Supabase Storage...`);
            const imageUrl = await uploadToStorage(file, vehicle.id, i);
            uploadedImages.push(imageUrl);
            console.log(`Successfully uploaded image ${i + 1}:`, imageUrl);
          } catch (uploadError) {
            console.error(`Error uploading image ${i + 1}:`, uploadError);
            console.error('Error details:', {
              message: uploadError instanceof Error ? uploadError.message : 'Unknown error',
              stack: uploadError instanceof Error ? uploadError.stack : undefined
            });
            // Continue with other images even if one fails
          }
        } else {
          console.log(`Skipping image ${i + 1}: file is empty or invalid`);
        }
      }

      console.log('Final uploaded images:', uploadedImages);

      // Update vehicle with image URLs
      if (uploadedImages.length > 0) {
        console.log('Updating vehicle with image URLs...');
        const { error: updateError } = await supabaseAdmin
          .from('vehicles')
          .update({ images: uploadedImages })
          .eq('id', vehicle.id);

        if (updateError) {
          console.error('Error updating vehicle with images:', updateError);
        } else {
          console.log('Successfully updated vehicle with image URLs');
        }
      } else {
        console.log('No images were successfully uploaded');
      }
    } else {
      console.log('No image files found in form data');
    }
    console.log('=== END IMAGE UPLOAD DEBUG ===');

    // Send new listing notifications to users who might be interested
    try {
      // Get users who have favorited similar vehicles (same category or brand)
      const { data: similarFavorites, error: favoritesError } = await supabaseAdmin
        .from('favorites')
        .select(`
          user_id,
          vehicles!inner(category, brand)
        `)
        .eq('vehicles.category', vehicleData.category)
        .or(`vehicles.brand.eq.${vehicleData.brand}`);

      if (!favoritesError && similarFavorites && similarFavorites.length > 0) {
        // Get unique users
        const uniqueUsers = [...new Set(similarFavorites.map(f => f.user_id))];
        
        // Send email notifications
        for (const userId of uniqueUsers) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: userId,
                vehicleId: vehicle.id,
                notificationType: 'new_listing',
                vehicleData: vehicle
              }),
            });
          } catch (emailError) {
            console.error('Failed to send new listing notification:', emailError);
          }
        }
      }
    } catch (notificationError) {
      console.error('New listing notification error:', notificationError);
    }

    // Serialize dates for Next.js 15 compatibility
    const serializedVehicle = {
      ...vehicle,
      created_at: vehicle.created_at?.toString(),
      updated_at: vehicle.updated_at?.toString()
    };

    return NextResponse.json({ vehicle: serializedVehicle }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}