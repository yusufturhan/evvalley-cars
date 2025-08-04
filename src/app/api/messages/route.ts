import { NextResponse } from 'next/server';
import { supabase, createServerSupabaseClient } from '@/lib/database';

// Helper function to get or create user
async function getOrCreateUser(clerkId: string) {
  const adminClient = createServerSupabaseClient();
  
  // If the ID is already a Supabase UUID (doesn't start with 'user_'), return it as is
  if (!clerkId.startsWith('user_')) {
    console.log('ID is already a Supabase UUID:', clerkId);
    return clerkId;
  }
  
  // First, try to find existing user
  const { data: existingUser } = await adminClient
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();

  if (existingUser) {
    console.log('Found existing user:', existingUser.id);
    return existingUser.id;
  }

  // Create new user if not exists
  const { data: newUser, error } = await adminClient
    .from('users')
    .insert({
      clerk_id: clerkId,
      email: `${clerkId}@example.com`, // Temporary email
      first_name: 'User',
      last_name: 'Name'
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating user:', error);
    // Return a default UUID for now
    return '1b69d5c5-283a-4d53-979f-4f6eb7a5ea0a';
  }

  console.log('Created new user:', newUser.id);
  return newUser.id;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const clerkUserId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId'); // This is already a Supabase UUID

    if (!vehicleId || !clerkUserId || !otherUserId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log('GET /api/messages - Parameters:', {
      vehicleId,
      clerkUserId,
      otherUserId
    });

    // Convert current user's Clerk ID to Supabase ID
    const supabaseUserId = await getOrCreateUser(clerkUserId);
    
    // otherUserId is already a Supabase UUID (seller_id)
    const supabaseOtherUserId = otherUserId;

    console.log('Converted user IDs:', {
      supabaseUserId,
      supabaseOtherUserId
    });

    // Fetch messages using admin client
    const adminClient = createServerSupabaseClient();
    const { data: messages, error } = await adminClient
      .from('vehicle_messages')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .or(`and(sender_id.eq.${supabaseUserId},receiver_id.eq.${supabaseOtherUserId}),and(sender_id.eq.${supabaseOtherUserId},receiver_id.eq.${supabaseUserId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    console.log('Fetched messages:', messages?.length || 0);

    // Serialize dates
    const serializedMessages = messages?.map(msg => ({
      ...msg,
      created_at: msg.created_at?.toString(),
      updated_at: msg.updated_at?.toString()
    })) || [];

    return NextResponse.json({ messages: serializedMessages });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender_id, receiver_id, vehicle_id, content } = body;

    console.log('=== POST /api/messages DEBUG ===');
    console.log('Request body:', body);

    if (!sender_id || !receiver_id || !vehicle_id || !content) {
      console.error('Missing required fields:', { sender_id, receiver_id, vehicle_id, content });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert sender Clerk ID to Supabase ID
    console.log('Converting sender ID:', sender_id);
    const supabaseSenderId = await getOrCreateUser(sender_id);
    console.log('Supabase sender ID:', supabaseSenderId);

    // Convert receiver Clerk ID to Supabase ID (if it's a Clerk ID)
    let supabaseReceiverId = receiver_id;
    if (receiver_id.startsWith('user_')) {
      console.log('Converting receiver ID:', receiver_id);
      supabaseReceiverId = await getOrCreateUser(receiver_id);
      console.log('Supabase receiver ID:', supabaseReceiverId);
    }

    const messageData = {
      sender_id: supabaseSenderId,
      receiver_id: supabaseReceiverId,
      vehicle_id,
      content
    };

    console.log('Final message data:', messageData);

    // Insert message using admin client
    const adminClient = createServerSupabaseClient();
    console.log('Attempting to insert message...');
    
    const { data: message, error } = await adminClient
      .from('vehicle_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting message:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    console.log('Message sent successfully:', message);
    console.log('=== END POST /api/messages DEBUG ===');

    // Serialize dates
    const serializedMessage = {
      ...message,
      created_at: message.created_at?.toString(),
      updated_at: message.updated_at?.toString()
    };

    return NextResponse.json({ message: serializedMessage }, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 