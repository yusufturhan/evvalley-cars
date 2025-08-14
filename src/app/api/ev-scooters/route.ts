import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/database';
import { uploadImage as uploadToStorage } from '@/lib/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const brand = searchParams.get('brand');
    const year = searchParams.get('year');
    const seller_id = searchParams.get('seller_id');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const includeSold = searchParams.get('includeSold');

    let query = supabase
      .from('ev_scooters')
      .select('*')
      .order('created_at', { ascending: false });

    // Only show unsold scooters by default, unless includeSold is true
    if (!includeSold) {
      query = query.eq('sold', false);
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
      console.error('Error fetching ev_scooters:', error);
      return NextResponse.json({ error: 'Failed to fetch scooters' }, { status: 500 });
    }

    // Serialize dates and ensure all data is plain objects for Next.js 15 compatibility
    const serializedData = data?.map(scooter => {
      const plainScooter = { ...scooter };
      // Convert dates to strings
      if (plainScooter.created_at) {
        plainScooter.created_at = plainScooter.created_at.toString();
      }
      if (plainScooter.updated_at) {
        plainScooter.updated_at = plainScooter.updated_at.toString();
      }
      if (plainScooter.sold_at) {
        plainScooter.sold_at = plainScooter.sold_at.toString();
      }
      // Ensure all properties are serializable
      return JSON.parse(JSON.stringify(plainScooter));
    }) || [];

    return NextResponse.json({ scooters: serializedData });
  } catch (error) {
    console.error('GET /api/ev-scooters error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Basic validation
    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const year = parseInt(formData.get('year') as string);
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    
    if (!title || !price || !year || !brand || !model || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user's Supabase ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

          for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file.size > 0) {
          try {
            const imageUrl = await uploadToStorage(file, 'scooter-images', i);
            imageUrls.push(imageUrl);
          } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }
      }
    }

    // Prepare scooter data
    const scooterData = {
      title,
      description,
      price,
      year,
      brand,
      model,
      seller_id: userData.id,
      seller_email: user.email,
      location,
      images: imageUrls,
      range_miles: formData.get('range_miles') ? parseInt(formData.get('range_miles') as string) : null,
      max_speed: formData.get('max_speed') ? parseInt(formData.get('max_speed') as string) : null,
      battery_capacity: formData.get('battery_capacity') as string || null,
      weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
      max_load: formData.get('max_load') ? parseInt(formData.get('max_load') as string) : null,
      wheel_size: formData.get('wheel_size') as string || null,
      motor_power: formData.get('motor_power') as string || null,
      charging_time: formData.get('charging_time') as string || null,
      warranty: formData.get('warranty') as string || null,
      condition: formData.get('condition') as string || null,
      color: formData.get('color') as string || null,
      highlighted_features: formData.get('highlighted_features') as string || null,
    };

    // Insert into database
    const { data: newScooter, error: insertError } = await supabase
      .from('ev_scooters')
      .insert(scooterData)
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting scooter:', insertError);
      return NextResponse.json({ error: 'Failed to create scooter listing' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Scooter listed successfully', 
      scooter: newScooter 
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/ev-scooters error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 