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
  messageContent: string,
  vehicleId: string
) {
  try {
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: receiverEmail,
        subject: `New message from ${senderName} about ${vehicleTitle} - Evvalley`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Message - Evvalley</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1C1F4A 0%, #3AB0FF 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 50%; margin-bottom: 20px;">
                  <span style="font-size: 32px;">💬</span>
                </div>
                <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">Evvalley</h1>
                <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">You have a new message!</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 25px 0; font-size: 22px; font-weight: 600;">New Message Received</h2>
                
                <!-- Message Details -->
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3AB0FF;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">From</p>
                      <p style="margin: 5px 0 0 0; font-weight: bold; color: #374151; font-size: 16px;">${senderName}</p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3AB0FF;">
                      <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Vehicle</p>
                      <p style="margin: 5px 0 0 0; font-weight: bold; color: #374151; font-size: 16px;">${vehicleTitle}</p>
                    </div>
                  </div>
                  
                  <!-- Message Content -->
                  <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Message:</p>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 6px;">
                      <p style="margin: 0; line-height: 1.6; color: #374151; font-size: 14px;">${messageContent}</p>
                    </div>
                  </div>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicleId}" 
                     style="background: linear-gradient(135deg, #3AB0FF, #2A8FE6); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(58, 176, 255, 0.3);">
                    💬 Reply to Message
                  </a>
                </div>
                
                <!-- Footer -->
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 35px 0;">
                
                <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  <p style="margin: 0 0 10px 0;">This email was sent by Evvalley - Your trusted EV marketplace.</p>
                  <p style="margin: 0 0 15px 0;">Manage your messages and browse more vehicles on our 
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles" style="color: #3AB0FF; text-decoration: none; font-weight: 500;">website</a>.
                  </p>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      © 2025 Evvalley. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
💬 New Message - Evvalley

Hello there,

You have received a new message from ${senderName} about the vehicle: ${vehicleTitle}

Message:
${messageContent}

Reply to this message: ${process.env.NEXT_PUBLIC_APP_URL || 'https://evvalley.com'}/vehicles/${vehicleId}

---
Evvalley - Your trusted EV marketplace
Manage your messages and browse more vehicles on our website.
© 2025 Evvalley. All rights reserved.
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

    // Security check: Ensure sender email is valid and not empty
    if (!senderEmail || senderEmail === '' || senderEmail === 'test@evvalley.com') {
      console.error('❌ Security violation: Invalid sender email:', senderEmail);
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
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
    await sendEmailNotification(receiverEmail, senderName, vehicleTitle, content.trim(), vehicleId);
    console.log('📧 Email notification completed');

    return NextResponse.json({ message });

  } catch (error) {
    console.error('❌ Error in POST /api/simple-messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 