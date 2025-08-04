import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    console.log('Converting Clerk ID to Supabase ID:', clerkId);

    // If the ID is already a Supabase UUID (doesn't start with 'user_'), return it as is
    if (!clerkId.startsWith('user_')) {
      console.log('ID is already a Supabase UUID:', clerkId);
      return NextResponse.json({ supabaseId: clerkId });
    }

    // Use admin client to bypass RLS
    const adminClient = createServerSupabaseClient();

    // First, try to find existing user
    const { data: existingUser } = await adminClient
      .from('users')
      .select('id, email')
      .eq('clerk_id', clerkId)
      .single();

    if (existingUser) {
      console.log('Found existing user:', existingUser.id, 'with email:', existingUser.email);
      return NextResponse.json({ supabaseId: existingUser.id });
    }

    // Create new user if not exists
    const { data: newUser, error } = await adminClient
      .from('users')
      .insert({
        clerk_id: clerkId,
        email: `${clerkId}@evvalley.com`,
        first_name: 'User',
        last_name: 'Name'
      })
      .select('id, email')
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    console.log('Created new user:', newUser.id, 'with email:', newUser.email);
    return NextResponse.json({ supabaseId: newUser.id });
  } catch (error) {
    console.error('POST /api/users/convert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 