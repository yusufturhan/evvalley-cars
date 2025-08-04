import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sold, sold_at } = body;

    const supabase = createServerSupabaseClient();

    // Get the vehicle to check ownership
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Update the vehicle as sold
    const { data, error } = await supabase
      .from('vehicles')
      .update({
        sold: sold,
        sold_at: sold_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error marking vehicle as sold:', error);
      return NextResponse.json({ error: 'Failed to mark vehicle as sold' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      vehicle: data[0] 
    });

  } catch (error) {
    console.error('PUT /api/vehicles/[id]/mark-sold error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 