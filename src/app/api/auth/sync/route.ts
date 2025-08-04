import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    console.log('🔄 Auth sync: Starting GET request...');
    
    // Get user ID from headers (sent by frontend)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('❌ Auth sync: No authorization header');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Use admin client to bypass RLS
    const adminClient = createServerSupabaseClient();
    console.log('🔄 Auth sync: Supabase client created');

    // Get user from Supabase using the provided user ID
    const { data: user, error: selectError } = await adminClient
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('clerk_id', authHeader.replace('Bearer ', ''))
      .single();

    if (selectError) {
      console.error('❌ Auth sync: Error fetching user:', selectError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ Auth sync: User found in Supabase:', user.id);
    return NextResponse.json({ 
      user: user,
      message: 'User synced successfully'
    });

  } catch (error) {
    console.error('❌ Auth sync: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔄 Auth sync: Starting...');
    
    // Get user data from request body
    const body = await request.json();
    const { clerkId, email, firstName, lastName } = body;

    if (!clerkId) {
      console.log('❌ Auth sync: No clerk ID provided');
      return NextResponse.json({ error: 'Missing clerk ID' }, { status: 400 });
    }

    console.log('🔄 Auth sync: Syncing user:', { clerkId, email, firstName, lastName });

    // Use admin client to bypass RLS
    const adminClient = createServerSupabaseClient();
    console.log('🔄 Auth sync: Supabase client created');

    // Check if user already exists
    const { data: existingUser, error: selectError } = await adminClient
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('clerk_id', clerkId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Auth sync: Error checking existing user:', selectError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (existingUser) {
      console.log('✅ Auth sync: User already exists in Supabase:', existingUser.id);
      
      // Update user with latest data from Clerk
      const { error: updateError } = await adminClient
        .from('users')
        .update({
          email: email || existingUser.email,
          first_name: firstName || existingUser.first_name,
          last_name: lastName || existingUser.last_name
        })
        .eq('clerk_id', clerkId);

      if (updateError) {
        console.error('❌ Auth sync: Error updating user:', updateError);
      } else {
        console.log('✅ Auth sync: User updated with latest data');
      }

      return NextResponse.json({ 
        supabaseId: existingUser.id,
        message: 'User synced successfully'
      });
    }

    console.log('🔄 Auth sync: Creating new user in Supabase...');

    // Create new user in Supabase
    const userEmail = email || `${clerkId}@evvalley.com`;
    const userFirstName = firstName || 'User';
    const userLastName = lastName || 'Name';

    const { data: newUser, error: insertError } = await adminClient
      .from('users')
      .insert({
        clerk_id: clerkId,
        email: userEmail,
        first_name: userFirstName,
        last_name: userLastName,
        seller_type: 'private' // Default seller type
      })
      .select('id, email, first_name, last_name')
      .single();

    if (insertError) {
      console.error('❌ Auth sync: Error creating user in Supabase:', insertError);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    console.log('✅ Auth sync: User created in Supabase:', newUser.id);
    return NextResponse.json({ 
      supabaseId: newUser.id,
      message: 'User synced successfully'
    });

  } catch (error) {
    console.error('❌ Auth sync: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 