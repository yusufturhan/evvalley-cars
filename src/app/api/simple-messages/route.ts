import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to get user display name
async function getUserDisplayName(email: string): Promise<string> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('display_name, first_name, last_name')
      .eq('email', email)
      .single();

    if (error || !user) {
      return email.split('@')[0]; // Fallback to email username
    }

    return user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || email.split('@')[0];
  } catch (error) {
    console.error('Error getting user display name:', error);
    return email.split('@')[0];
  }
}

// Helper function to send email notification
async function sendEmailNotification(
  receiverEmail: string,
  senderName: string,
  vehicleTitle: string,
  messageContent: string
) {
  try {
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: receiverEmail,
        subject: `New message from ${senderName} about ${vehicleTitle} - Evvalley`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Evvalley</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px;">US EV & E-Mobility Marketplace</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff;">
              <h2 style="color: #059669; margin-bottom: 20px;">New Message Received</h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${senderName}</p>
                <p style="margin: 0 0 10px 0;"><strong>Vehicle:</strong> ${vehicleTitle}</p>
                <p style="margin: 0 0 15px 0;"><strong>Message:</strong></p>
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #059669; border-radius: 4px;">
                  <p style="margin: 0; line-height: 1.6;">${messageContent}</p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/vehicles/f355824c-030d-4b8c-ad60-dfc5c19ce479" 
                   style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  View Message
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
                <p style="margin: 0;">This email was sent from Evvalley - US EV & E-Mobility Marketplace</p>
                <p style="margin: 5px 0 0 0;">Contact: evvalley@evvalley.com</p>
              </div>
            </div>
          </div>
        `,
        text: `
Evvalley - New Message

From: ${senderName}
Vehicle: ${vehicleTitle}
Message: ${messageContent}

View message: ${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/f355824c-030d-4b8c-ad60-dfc5c19ce479

---
Evvalley - US EV & E-Mobility Marketplace
Contact: evvalley@evvalley.com
        `
      })
    });

    if (emailResponse.ok) {
      console.log('✅ Email notification sent successfully');
    } else {
      console.error('❌ Failed to send email notification');
    }
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const currentUserEmail = searchParams.get('currentUserEmail');

    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 });
    }

    console.log('🔄 Fetching messages for vehicle:', vehicleId);

    const { data: messages, error } = await supabase
      .from('simple_messages')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    // Mark messages as read for current user
    if (currentUserEmail && messages && messages.length > 0) {
      const unreadMessages = messages.filter(msg => 
        msg.receiver_email === currentUserEmail && !msg.is_read
      );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        
        await supabase
          .from('simple_messages')
          .update({ is_read: true })
          .in('id', messageIds);
      }
    }

    console.log('✅ Messages fetched:', messages?.length || 0);
    return NextResponse.json({ messages: messages || [] });

  } catch (error) {
    console.error('❌ Error in GET /api/simple-messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, senderEmail, receiverEmail, content } = await request.json();

    if (!vehicleId || !senderEmail || !receiverEmail || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('📤 Sending message:', { vehicleId, senderEmail, receiverEmail, content });

    // Get user names
    const senderName = await getUserDisplayName(senderEmail);
    const receiverName = await getUserDisplayName(receiverEmail);

    // Get vehicle title for email notification
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('title')
      .eq('id', vehicleId)
      .single();

    const vehicleTitle = vehicle?.title || 'Vehicle';

    const { data: message, error } = await supabase
      .from('simple_messages')
      .insert({
        vehicle_id: vehicleId,
        sender_email: senderEmail,
        receiver_email: receiverEmail,
        content: content.trim(),
        sender_name: senderName,
        receiver_name: receiverName,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error sending message:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    console.log('✅ Message sent successfully!');

    // Send email notification to receiver
    console.log('📧 Attempting to send email to:', receiverEmail);
    await sendEmailNotification(receiverEmail, senderName, vehicleTitle, content.trim());
    console.log('📧 Email notification completed');

    return NextResponse.json({ message });

  } catch (error) {
    console.error('❌ Error in POST /api/simple-messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 