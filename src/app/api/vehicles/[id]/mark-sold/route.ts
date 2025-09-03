import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

async function sendFavoriteSoldNotifications(vehicleId: string, vehicleTitle: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.evvalley.com'}/api/notifications/favorite-sold`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleId,
        vehicleTitle,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Favorite sold notifications sent:', result);
    } else {
      console.error('❌ Failed to send favorite sold notifications');
    }
  } catch (error) {
    console.error('❌ Error sending favorite sold notifications:', error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sold, sold_at } = body;

    const supabase = createServerSupabaseClient();

    // Get the vehicle to check ownership and get title for notifications
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('seller_id, title')
      .eq('id', id)
      .single();

    if (vehicleError || !vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Update the vehicle as sold
    const updateData: any = {
      sold: sold,
      updated_at: new Date().toISOString()
    };
    
    // Only set sold_at if it's provided (when marking as sold)
    if (sold_at) {
      updateData.sold_at = sold_at;
    } else {
      // When unmarking as sold, set sold_at to null
      updateData.sold_at = null;
    }

    const { data, error } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error marking vehicle as sold:', error);
      return NextResponse.json({ error: 'Failed to mark vehicle as sold' }, { status: 500 });
    }

    // If vehicle was marked as sold, send notifications to users who favorited it
    if (sold && vehicle.title) {
      console.log('🔔 Vehicle marked as sold, sending favorite notifications...');
      // Send notifications asynchronously (don't wait for it)
      sendFavoriteSoldNotifications(id, vehicle.title);
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