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
      
      // If user not found, try to create them
      if (selectError.code === 'PGRST116') {
        console.log('🔄 Auth sync: User not found, creating new user...');
        
        // Get user info from Clerk
        const clerkId = authHeader.replace('Bearer ', '');
        
        try {
          // Fetch user details from Clerk
          const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          });

          let userEmail = `${clerkId}@evvalley.com`; // Fallback email
          let firstName = 'User';
          let lastName = 'Name';

          console.log('📡 Clerk API response status:', clerkResponse.status);

          if (clerkResponse.ok) {
            const clerkUser = await clerkResponse.json();
            console.log('📧 Clerk user data received:', {
              id: clerkUser.id,
              email_addresses: clerkUser.email_addresses?.length || 0,
              first_name: clerkUser.first_name,
              last_name: clerkUser.last_name
            });
            
            // Extract email from primary email address
            if (clerkUser.email_addresses && clerkUser.email_addresses.length > 0) {
              userEmail = clerkUser.email_addresses[0].email_address;
            }
            
            // Extract name
            if (clerkUser.first_name) firstName = clerkUser.first_name;
            if (clerkUser.last_name) lastName = clerkUser.last_name;
          } else {
            const errorText = await clerkResponse.text();
            console.warn('⚠️ Could not fetch user from Clerk:', clerkResponse.status, errorText);
            console.log('🔄 Using fallback data for user creation');
          }

          console.log('🔄 Auth sync: Creating user in Supabase with data:', {
            clerk_id: clerkId,
            email: userEmail,
            first_name: firstName,
            last_name: lastName
          });

          const { data: newUser, error: insertError } = await adminClient
            .from('users')
            .insert({
              clerk_id: clerkId,
              email: userEmail,
              first_name: firstName,
              last_name: lastName,
              seller_type: 'private'
            })
            .select('id, email, first_name, last_name')
            .single();

          if (insertError) {
            console.error('❌ Auth sync: Error creating user:', insertError);
            console.error('❌ Insert error details:', {
              code: insertError.code,
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint
            });
            return NextResponse.json({ 
              error: 'Failed to create user',
              details: insertError.message 
            }, { status: 500 });
          }

          console.log('✅ Auth sync: User created in Supabase:', newUser.id);
          return NextResponse.json({ 
            user: newUser,
            message: 'User created and synced successfully'
          });
        } catch (clerkError) {
          console.error('❌ Auth sync: Error fetching from Clerk:', clerkError);
          console.error('❌ Clerk error details:', {
            message: clerkError.message,
            stack: clerkError.stack,
            clerkId: clerkId
          });
          return NextResponse.json({ 
            error: 'Failed to fetch user from Clerk',
            details: clerkError.message 
          }, { status: 500 });
        }
      }
      
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has placeholder email and update it
    if (user.email && user.email.includes('@evvalley.com') && user.email.startsWith('user_')) {
      console.log('🔄 Auth sync: Updating placeholder email for user:', user.id);
      
      try {
        // Fetch user details from Clerk
        const clerkId = authHeader.replace('Bearer ', '');
        const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (clerkResponse.ok) {
          const clerkUser = await clerkResponse.json();
          console.log('📧 Updating user with Clerk data:', clerkUser);
          
          // Extract real email and name
          let realEmail = user.email; // Keep current if no real email found
          let firstName = user.first_name || 'User';
          let lastName = user.last_name || 'Name';
          
          if (clerkUser.email_addresses && clerkUser.email_addresses.length > 0) {
            realEmail = clerkUser.email_addresses[0].email_address;
          }
          if (clerkUser.first_name) firstName = clerkUser.first_name;
          if (clerkUser.last_name) lastName = clerkUser.last_name;

          // Update user in Supabase
          const { data: updatedUser, error: updateError } = await adminClient
            .from('users')
            .update({
              email: realEmail,
              first_name: firstName,
              last_name: lastName
            })
            .eq('id', user.id)
            .select('id, email, first_name, last_name')
            .single();

          if (!updateError && updatedUser) {
            console.log('✅ Auth sync: User email updated:', updatedUser.email);
            return NextResponse.json({ 
              user: updatedUser,
              message: 'User synced and updated successfully'
            });
          }
        }
      } catch (updateError) {
        console.error('❌ Auth sync: Error updating user:', updateError);
        // Continue with original user data if update fails
      }
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