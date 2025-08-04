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

    // Get user's vehicle count
    const { count: vehicleCount, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', id);

    if (vehicleError) {
      console.error('Error fetching vehicle count:', vehicleError);
    }

    const userData = {
      ...user,
      vehicle_count: vehicleCount || 0
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 