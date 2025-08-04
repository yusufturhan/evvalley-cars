import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: 'Missing messageIds array' }, { status: 400 });
    }

    console.log('📖 Marking messages as read:', messageIds);

    // Update messages as read using admin client
    const adminClient = createServerSupabaseClient();
    const { error } = await adminClient
      .from('simple_messages')
      .update({ is_read: true })
      .in('id', messageIds);

    if (error) {
      console.error('❌ Error marking messages as read:', error);
      return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
    }

    console.log('✅ Messages marked as read successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ POST /api/simple-messages/mark-read error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 