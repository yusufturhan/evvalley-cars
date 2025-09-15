import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/database';
import { uploadImage as uploadToStorage } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const year = searchParams.get('year');
    const seller_id = searchParams.get('seller_id');
    const seller_email = searchParams.get('seller_email');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const includeSold = searchParams.get('includeSold');

    // Validate and sanitize parameters
    const parsedLimit = limit ? Math.min(parseInt(limit), 100) : 12; // Max 100 items
    const parsedOffset = offset ? Math.max(parseInt(offset), 0) : 0;

    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    // Show all vehicles by default (including sold ones)
    // Only filter out sold vehicles if explicitly requested
    if (includeSold === 'false') {
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
    } else if (seller_email) {
      // Fallback: filter by seller email if seller_id is not provided
      query = query.eq('seller_email', seller_email);
    }

    if (year && year !== 'all') {
      const parsedYear = parseInt(year);
      if (!isNaN(parsedYear)) {
        query = query.eq('year', parsedYear);
      }
    }

    // Model exact match if provided via query param
    const modelParam = searchParams.get('model');
    if (modelParam && modelParam.trim().length > 0) {
      const pattern = `%${modelParam.trim()}%`;
      query = query.ilike('model', pattern);
    }

    // Color exact-ish match (stores may have mixed case)
    const colorParam = searchParams.get('color');
    if (colorParam && colorParam.trim().length > 0) {
      const c = `%${colorParam.trim()}%`;
      // Match either color or exterior_color columns
      query = query.or(`color.ilike.${c},exterior_color.ilike.${c}`);
    }

    if (minPrice) {
      const parsedMinPrice = parseFloat(minPrice);
      if (!isNaN(parsedMinPrice)) {
        query = query.gte('price', parsedMinPrice);
      }
    }

    if (maxPrice) {
      const parsedMaxPrice = parseFloat(maxPrice);
      if (!isNaN(parsedMaxPrice)) {
        query = query.lte('price', parsedMaxPrice);
      }
    }

    // Search functionality with validation
    if (search && search.trim().length > 0) {
      const sanitizedSearch = search.trim().substring(0, 100); // Limit search length
      query = query.or(`title.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%,brand.ilike.%${sanitizedSearch}%,model.ilike.%${sanitizedSearch}%`);
    }

    // Location search - exact city/area matching with strict exclusions
    if (location && location.trim().length > 0) {
      const locationQuery = location.trim().toLowerCase().substring(0, 100); // Limit location length
      
      // For San Francisco searches, use strict "starts with" matching and exclude nearby cities
      if (locationQuery.includes('san francisco')) {
        // Match typical formats: "San Francisco", "San Francisco, CA", "San Francisco CA"
        query = query.or(
          'location.ilike.San Francisco%',
          'location.ilike.san francisco%'
        );
        // Strictly exclude nearby cities
        query = query.not('location', 'ilike', '%santa clara%');
        query = query.not('location', 'ilike', '%san jose%');
        query = query.not('location', 'ilike', '%palo alto%');
        query = query.not('location', 'ilike', '%sunnyvale%');
        query = query.not('location', 'ilike', '%mountain view%');
        // Exclude broad region labels
        query = query.not('location', 'ilike', '%bay area%');
      }
      // For Santa Clara searches, use strict matching
      else if (locationQuery.includes('santa clara')) {
        query = query.or(
          'location.ilike.%Santa Clara%',
          'location.ilike.%santa clara%'
        );
        // Exclude San Francisco
        query = query.not('location', 'ilike', '%san francisco%');
        query = query.not('location', 'ilike', '%SF%');
      }
      // For other locations, prefer "starts with" to avoid substring false-positives
      else {
        query = query.ilike('location', `${locationQuery}%`);
      }
    }

    // Get total count first with error handling
    let totalCount = 0;
    try {
      const { count, error: countError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error getting total count:', countError);
        totalCount = 0;
      } else {
        totalCount = count || 0;
      }
    } catch (countError) {
      console.error('Error in count query:', countError);
      totalCount = 0;
    }

    // Apply pagination
    query = query.range(parsedOffset, parsedOffset + parsedLimit - 1);

    // Execute main query with timeout protection
    const { data, error } = await Promise.race([
      query,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 10000) // 10 second timeout
      )
    ]);

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch vehicles',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
      }, { status: 500 });
    }

    // Serialize dates and ensure all data is plain objects for Next.js 15 compatibility
    const serializedData = data?.map(vehicle => {
      try {
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
      } catch (serializeError) {
        console.error('Error serializing vehicle:', serializeError);
        return null;
      }
    }).filter(Boolean) || []; // Remove any null entries

    return NextResponse.json({ 
      vehicles: serializedData,
      total: totalCount,
      limit: parsedLimit,
      offset: parsedOffset
    });
  } catch (error) {
    console.error('GET /api/vehicles error:', error);
    
    // Return appropriate error based on error type
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
      }
      if (error.message.includes('database')) {
        return NextResponse.json({ error: 'Database connection error' }, { status: 503 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Accept JSON body instead of multipart form (client uploads images to storage)
    const json = await request.json();
    console.log('Received JSON body for vehicle create');

    const title = json.title as string;
    const description = json.description as string;
    const price = json.price as string;
    const year = json.year as string;
    const mileage = json.mileage as string;
    const fuel_type = json.fuel_type as string;
    const brand = json.brand as string;
    const model = json.model as string;
    const category = json.category as string;
    const range_miles = json.range_miles as string;
    const max_speed = json.max_speed as string;
    const battery_capacity = json.battery_capacity as string;
    const location = json.location as string;
    const seller_id = json.seller_id as string;
    const seller_type_from_form = (json.seller_type as string) === 'dealer' ? 'dealer' : 'private';
    const vehicle_condition = json.vehicle_condition as string;
    const title_status = json.title_status as string;
    const highlighted_features = json.highlighted_features as string;

    // Validate required fields
    if (!title || !price || !year || !brand || !model || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, price, year, brand, model, category' 
      }, { status: 400 });
    }

    // Validate VIN if provided
    const vin = json.vin as string;
    if (vin && vin.trim()) {
      // Check VIN length (should be 17 characters)
      if (vin.trim().length !== 17) {
        return NextResponse.json({ 
          error: 'VIN must be exactly 17 characters long' 
        }, { status: 400 });
      }

      // Check if an ACTIVE, UNSOLD listing already exists with the same VIN
      // Allow re-listing if previous listing is sold or inactive
      const { data: existingVehicle, error: vinCheckError } = await supabase
        .from('vehicles')
        .select('id, title, sold, is_active')
        .eq('vin', vin.trim())
        .eq('sold', false)
        .eq('is_active', true)
        .maybeSingle();

      if (vinCheckError && vinCheckError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('VIN check error:', vinCheckError);
        return NextResponse.json({ 
          error: 'Failed to check VIN uniqueness' 
        }, { status: 500 });
      }

      if (existingVehicle) {
        return NextResponse.json({ 
          error: `An active listing with VIN ${vin.trim()} already exists: ${existingVehicle.title}. Please mark the previous listing as sold or deactivate it before re-listing.` 
        }, { status: 400 });
      }
    }

    // Get seller email from form data - this should be the actual user's email
    const seller_email = json.seller_email as string;
    
    if (!seller_email) {
      console.error('❌ Seller email is missing from form data');
      console.error('❌ Form data received:', JSON.stringify(json, null, 2));
      return NextResponse.json({ 
        error: 'Seller email is required. Please make sure you are signed in with a valid email address.' 
      }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(seller_email)) {
      console.error('❌ Invalid email format:', seller_email);
      return NextResponse.json({ 
        error: 'Invalid email format. Please provide a valid email address.' 
      }, { status: 400 });
    }
    
    console.log('📧 Seller email from form:', seller_email);

    // Get or create user in Supabase based on email
    let actualSellerId = seller_id;

    if (!actualSellerId || actualSellerId === '1b69d5c5-283a-4d53-979f-4f6eb7a5ea0a') {
      // Try to find user by email
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', seller_email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('❌ Error finding user by email:', userError);
        return NextResponse.json({ 
          error: 'Failed to find user account' 
        }, { status: 500 });
      }

      if (existingUser) {
        actualSellerId = existingUser.id;
        console.log('✅ Found existing user by email:', actualSellerId);
        // Update seller_type to reflect the user's current selection
        try {
          const supabaseAdminForUpdate = createServerSupabaseClient();
          await supabaseAdminForUpdate
            .from('users')
            .update({ seller_type: seller_type_from_form })
            .eq('id', existingUser.id);
        } catch (e) {
          console.warn('⚠️ Failed to update seller_type for existing user:', e);
        }
      } else {
        // Create a minimal user record so the listing never blocks
        try {
          const supabaseAdminForUser = createServerSupabaseClient();
          const inferredFirstName = seller_email.split('@')[0];
          const desiredSellerType = (json.seller_type as string) === 'dealer' ? 'dealer' : 'private';

          const { data: newUser, error: createUserError } = await supabaseAdminForUser
            .from('users')
            .insert({
              clerk_id: json.clerk_id as string || `user_${Date.now()}`,
              email: seller_email,
              first_name: inferredFirstName,
              last_name: '',
              seller_type: seller_type_from_form || desiredSellerType,
            })
            .select('id')
            .single();

          if (createUserError || !newUser) {
            console.error('❌ Failed to auto-create user for email:', seller_email, createUserError);
            return NextResponse.json({ 
              error: 'Could not create user account for listing' 
            }, { status: 500 });
          }

          actualSellerId = newUser.id;
          console.log('✅ Auto-created user by email:', actualSellerId);
        } catch (autoCreateErr) {
          console.error('❌ Auto-create user unexpected error:', autoCreateErr);
          return NextResponse.json({ 
            error: 'Could not prepare user account for listing' 
          }, { status: 500 });
        }
      }
    }

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
      seller_id: actualSellerId,
      seller_email: seller_email,
      vehicle_condition: json.vehicle_condition as string || null,
      title_status: json.title_status as string || null,
      highlighted_features: json.highlighted_features as string || null,
      // Extended fields - only if provided
      interior_color: json.interior_color as string || null,
      exterior_color: json.exterior_color as string || null,
      body_seating: json.body_seating as string || null,
      combined_fuel_economy: json.combined_fuel_economy as string || null,
      transmission: json.transmission as string || null,
      horsepower: json.horsepower ? parseInt(json.horsepower as string) : null,
      electric_mile_range: json.electric_mile_range ? parseInt(json.electric_mile_range as string) : null,
      battery_warranty: json.battery_warranty as string || null,
      drivetrain: json.drivetrain as string || null,
      vin: json.vin as string || null,
      images: Array.isArray(json.images) ? json.images : [],
      is_active: true
    };

    console.log('=== VEHICLE DATA DEBUG ===');
    console.log('Inserting vehicle data:', JSON.stringify(vehicleData, null, 2));
    console.log('=== END VEHICLE DATA DEBUG ===');

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

    // No server-side uploads anymore. Client sends URLs.

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