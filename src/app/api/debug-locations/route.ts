import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('id, title, location, location_text, city, state, postal_code')
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      count: vehicles?.length || 0,
      vehicles: vehicles || [],
      note: 'Showing location fields for first 50 vehicles'
    });
  } catch (error) {
    console.error('Debug locations error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

