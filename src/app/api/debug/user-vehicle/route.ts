import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
    }

    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // Get user's Supabase ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, clerk_id')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'User not found in Supabase',
        details: userError?.message 
      }, { status: 404 });
    }

    // Get user's vehicles
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, title, seller_id, seller_email, sold')
      .eq('seller_id', user.id);

    if (vehiclesError) {
      return NextResponse.json({ 
        error: 'Failed to fetch vehicles',
        details: vehiclesError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        clerkId: userId,
        supabaseId: user.id,
        email: user.email
      },
      vehicles: vehicles || [],
      debug: {
        userSupabaseId: user.id,
        vehicleCount: vehicles?.length || 0,
        vehiclesWithMatchingSellerId: vehicles?.filter(v => v.seller_id === user.id).length || 0
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
