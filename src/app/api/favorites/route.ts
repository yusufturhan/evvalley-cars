import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicle_id');
    let userId = searchParams.get('user_id');
    const clerkId = searchParams.get('clerk_id');

    const supabase = createServerSupabaseClient();
    
    // If client sent Clerk ID instead of Supabase user_id, resolve it first
    if (!userId && clerkId) {
      const { data: userByClerk, error: userByClerkError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkId)
        .single();

      if (!userByClerkError && userByClerk) {
        userId = userByClerk.id as string;
      }
    }

    let query = supabase.from('favorites').select('*');

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: favorites, error } = await query;

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites: favorites || [] });
  } catch (error) {
    console.error('GET /api/favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, vehicleId } = await request.json();
    
    if (!userId || !vehicleId) {
      return NextResponse.json({ error: 'User ID and Vehicle ID are required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // Check if favorite already exists
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('vehicle_id', vehicleId)
      .single();

    if (existingFavorite) {
      return NextResponse.json({ error: 'Vehicle is already in favorites' }, { status: 400 });
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        vehicle_id: vehicleId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('POST /api/favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Remove from favorites
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const vehicleId = searchParams.get('vehicleId');

    if (!userId || !vehicleId) {
      return NextResponse.json({ error: 'User ID and Vehicle ID are required' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('vehicle_id', vehicleId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 