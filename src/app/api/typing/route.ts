import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId, userEmail, isTyping } = body;

    if (!vehicleId || !userEmail || typeof isTyping !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('⌨️ Typing status update:', { vehicleId, userEmail, isTyping });

    // Update typing status using admin client
    const adminClient = createServerSupabaseClient();
    
    // Upsert typing status
    const { error } = await adminClient
      .from('typing_status')
      .upsert({
        vehicle_id: vehicleId,
        user_email: userEmail,
        is_typing: isTyping,
        last_typing_at: new Date().toISOString()
      }, {
        onConflict: 'vehicle_id,user_email'
      });

    if (error) {
      console.error('❌ Error updating typing status:', error);
      return NextResponse.json({ error: 'Failed to update typing status' }, { status: 500 });
    }

    console.log('✅ Typing status updated successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ POST /api/typing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const currentUserEmail = searchParams.get('currentUserEmail');

    if (!vehicleId) {
      return NextResponse.json({ error: 'Missing vehicleId' }, { status: 400 });
    }

    console.log('⌨️ Getting typing status for vehicle:', vehicleId);

    // Get typing status using admin client
    const adminClient = createServerSupabaseClient();
    const { data: typingStatus, error } = await adminClient
      .from('typing_status')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .eq('is_typing', true)
      .neq('user_email', currentUserEmail || '') // Exclude current user
      .order('last_typing_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching typing status:', error);
      return NextResponse.json({ error: 'Failed to fetch typing status' }, { status: 500 });
    }

    console.log('✅ Typing status fetched:', typingStatus?.length || 0);
    return NextResponse.json({ typingStatus: typingStatus || [] });
  } catch (error) {
    console.error('❌ GET /api/typing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 