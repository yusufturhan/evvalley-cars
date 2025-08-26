import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    
    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's vehicle count and first listing date
    const { data: vehicles, error: vehicleError } = await supabase
      .from('vehicles')
      .select('created_at')
      .eq('seller_id', id)
      .order('created_at', { ascending: true });

    if (vehicleError) {
      console.error('Error fetching vehicle data:', vehicleError);
    }

    const vehicleCount = vehicles?.length || 0;
    const firstListingDate = vehicles && vehicles.length > 0 ? vehicles[0].created_at : null;

    const userData = {
      ...user,
      vehicle_count: vehicleCount,
      first_listing_date: firstListingDate
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 