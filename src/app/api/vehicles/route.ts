import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/database';
import { uploadImage as uploadToStorage } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    // Use service role key to bypass RLS policies and get all vehicles
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const page = searchParams.get('page');
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
    const soldParam = searchParams.get('sold');

    // Add caching headers for better performance
    const response = new Response();
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes cache
    response.headers.set('CDN-Cache-Control', 'public, max-age=300');

    // Validate and sanitize parameters
    // Use limit parameter for pagination (default: 12 for homepage, no limit for /vehicles page)
    const parsedLimit = limit ? Math.min(parseInt(limit), 10000) : undefined;
    
    // Calculate offset from page parameter (only if limit is provided)
    let parsedOffset = 0;
    if (parsedLimit && page) {
      const parsedPage = Math.max(parseInt(page), 1); // Page starts from 1
      parsedOffset = (parsedPage - 1) * parsedLimit;
    } else if (parsedLimit && offset) {
      parsedOffset = Math.max(parseInt(offset), 0);
    }

    // IMPORTANT: We need to get ALL vehicles, so we set a very high limit from the start
    // Supabase's default limit is 1000, but we want all vehicles (currently 97, but could grow)
    // CRITICAL: We DON'T use count: 'exact' here because it can cause limit issues
    // We get the count from a separate query above, so we only need the data here
    // range() must be called AFTER all filters are applied to override default limits
    let query = supabase
      .from('vehicles')
      .select('*') // No count: 'exact' to avoid limit issues
      .order('created_at', { ascending: false });

    // Sold filter behavior:
    // - Default: show ALL vehicles (both sold and unsold) - no filter applied
    // - If sold='false': show only unsold vehicles
    // - If sold='true': show only sold vehicles
    // - If includeSold='false': show only unsold vehicles (backward compatibility)
    if (soldParam === 'false' || includeSold === 'false') {
      query = query.eq('sold', false);
    } else if (soldParam === 'true') {
      query = query.eq('sold', true);
    }
    // If no sold param and includeSold !== 'false', show all (both sold and unsold)

    if (category) {
      query = query.eq('category', category);
    }

    if (brand && brand !== 'all') {
      // Case-insensitive brand match (e.g., "tesla" vs "Tesla")
      query = query.ilike('brand', brand);
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
      const c = colorParam.trim();
      // Normalize a few known paint names to canonical colors server-side
      const map: Record<string,string> = {
        'midnight silver metallic': 'gray', 'midnight silver': 'gray', 'obsidian black': 'black', 'pearl white': 'white'
      };
      const canonical = map[c.toLowerCase()] || c;
      const like = `%${canonical}%`;
      query = query.or(`color.ilike.${like},exterior_color.ilike.${like}`);
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

    // Location search - robust city matching
    if (location && location.trim().length > 0) {
      const raw = location.trim().substring(0, 100);
      const cityOnly = raw.split(',')[0].trim();
      // Exact city (before comma) by patterns: "City", "City,", "City ", "City, ST"
      const patterns = [
        `location.eq.${cityOnly}`,
        `location.ilike.${cityOnly},%`,
        `location.ilike.${cityOnly} %`,
        `location.ilike.${cityOnly}`,
      ];
      query = query.or(patterns.join(','));
    }

    // Get total count USING THE SAME FILTERS as the data query
    // IMPORTANT: Use service role client to bypass RLS for accurate count
    let totalCount = 0;
    try {
      const supabaseForCount = createServerSupabaseClient();
      let countQuery = supabaseForCount
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      // Apply the same filters to countQuery
      // Default: show ALL vehicles (both sold and unsold) - no filter applied
      // If sold='false': show only unsold vehicles
      // If sold='true': show only sold vehicles
      // If includeSold='false': show only unsold vehicles (backward compatibility)
      if (soldParam === 'false' || includeSold === 'false') {
        countQuery = countQuery.eq('sold', false);
      } else if (soldParam === 'true') {
        countQuery = countQuery.eq('sold', true);
      }
      // If no sold param and includeSold !== 'false', show all (both sold and unsold)

      if (category) {
        countQuery = countQuery.eq('category', category);
      }

      if (brand && brand !== 'all') {
        countQuery = countQuery.ilike('brand', brand);
      }

      if (seller_id) {
        countQuery = countQuery.eq('seller_id', seller_id);
      } else if (seller_email) {
        countQuery = countQuery.eq('seller_email', seller_email);
      }

      if (year && year !== 'all') {
        const parsedYear = parseInt(year);
        if (!isNaN(parsedYear)) {
          countQuery = countQuery.eq('year', parsedYear);
        }
      }

      const modelParam = searchParams.get('model');
      if (modelParam && modelParam.trim().length > 0) {
        const pattern = `%${modelParam.trim()}%`;
        countQuery = countQuery.ilike('model', pattern);
      }

      const colorParam = searchParams.get('color');
      if (colorParam && colorParam.trim().length > 0) {
        const c = colorParam.trim();
        const map: Record<string,string> = {
          'midnight silver metallic': 'gray', 'midnight silver': 'gray', 'obsidian black': 'black', 'pearl white': 'white'
        };
        const canonical = map[c.toLowerCase()] || c;
        const like = `%${canonical}%`;
        countQuery = countQuery.or(`color.ilike.${like},exterior_color.ilike.${like}`);
      }

      if (minPrice) {
        const parsedMinPrice = parseFloat(minPrice);
        if (!isNaN(parsedMinPrice)) {
          countQuery = countQuery.gte('price', parsedMinPrice);
        }
      }

      if (maxPrice) {
        const parsedMaxPrice = parseFloat(maxPrice);
        if (!isNaN(parsedMaxPrice)) {
          countQuery = countQuery.lte('price', parsedMaxPrice);
        }
      }

      if (search && search.trim().length > 0) {
        const sanitizedSearch = search.trim().substring(0, 100);
        countQuery = countQuery.or(`title.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%,brand.ilike.%${sanitizedSearch}%,model.ilike.%${sanitizedSearch}%`);
      }

      if (location && location.trim().length > 0) {
        const raw = location.trim().substring(0, 100);
        const cityOnly = raw.split(',')[0].trim();
        const patterns = [
          `location.eq.${cityOnly}`,
          `location.ilike.${cityOnly},%`,
          `location.ilike.${cityOnly} %`,
          `location.ilike.${cityOnly}`,
        ];
        countQuery = countQuery.or(patterns.join(','));
      }

      const { count, error: countError } = await countQuery;

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

    // Apply pagination if limit is provided (for homepage with 12 per page)
    // If no limit is provided, fetch all vehicles (for /vehicles page - but we'll use pagination there too)
    if (parsedLimit) {
      // Pagination mode: use range only (range includes limit functionality)
      // Supabase range is inclusive: range(0, 11) returns 12 items (0-11)
      query = query.range(parsedOffset, parsedOffset + parsedLimit - 1);
    } else {
      // No limit provided: fetch all vehicles (for backward compatibility)
      // But we'll use a reasonable max limit to avoid performance issues
      query = query.range(0, 9999);
    }

    // Execute main query WITHOUT count to avoid any limit issues
    // We already have totalCount from the separate count query above
    // DEBUG: Log the query to see what's being executed
    console.log('=== VEHICLES QUERY DEBUG ===');
    console.log('Total count from separate query:', totalCount);
    console.log('Parsed limit:', parsedLimit);
    console.log('Parsed offset:', parsedOffset);
    console.log('Range:', parsedLimit ? `${parsedOffset} to ${parsedOffset + parsedLimit - 1}` : '0 to 9999');
    
    const queryResult = await Promise.race([
      query,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 10000) // 10 second timeout
      )
    ]) as { data: any[] | null; error: any; count: number | null };
    
    const { data, error } = queryResult;
    // Use totalCount from the separate count query, not from this query
    const count = totalCount;
    
    // DEBUG: Log the result
    console.log('Vehicles returned from query:', data?.length || 0);
    console.log('Expected total:', totalCount);
    console.log('============================');

    if (error) {
      console.error('Error fetching vehicles:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch vehicles',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
      }, { status: 500 });
    }

    // Debug: Get vehicle count for response
    const vehiclesCount = data?.length || 0;

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
      offset: parsedOffset,
      limit: parsedLimit,
      page: page ? parseInt(page) : undefined,
      debug: {
        vehiclesCount: vehiclesCount,
        totalCount: totalCount,
        parsedLimit: parsedLimit,
        parsedOffset: parsedOffset,
        rangeApplied: parsedLimit ? `range(${parsedOffset}, ${parsedOffset + parsedLimit - 1})` : 'range(0, 9999)',
        note: parsedLimit ? `Pagination mode: ${vehiclesCount} vehicles returned for page ${page || 1}` : 'No limit: fetching all vehicles'
      }
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
    const video_url = json.video_url as string | null;

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
      video_url: video_url && typeof video_url === 'string' && video_url.trim() ? video_url : null,
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

    // Send new listing notification to newsletter subscribers
    try {
      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.evvalley.com'}/api/notifications/new-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          vehicleTitle: vehicle.title,
          vehicleBrand: vehicle.brand,
          vehicleModel: vehicle.model,
          vehiclePrice: vehicle.price,
          vehicleCategory: vehicle.category,
          vehicleLocation: vehicle.location,
        }),
      });

      if (notificationResponse.ok) {
        console.log('✅ New listing notifications sent to subscribers');
      } else {
        console.error('❌ Failed to send new listing notifications');
      }
    } catch (notificationError) {
      console.error('❌ Error sending new listing notifications:', notificationError);
    }

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

    // Index the new vehicle for semantic search
    try {
      const indexResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/index-vehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: serializedVehicle.id })
      })
      
      if (!indexResponse.ok) {
        console.warn('Failed to index vehicle for semantic search:', await indexResponse.text())
      } else {
        console.log('Vehicle indexed successfully for semantic search')
      }
    } catch (indexError) {
      console.warn('Error indexing vehicle for semantic search:', indexError)
    }

    return NextResponse.json({ vehicle: serializedVehicle }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}