import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store contact message in database
    const { data: contactMessage, error: dbError } = await supabase
      .from('contact_messages')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          subject: subject,
          message: message,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Send email notification (if email service is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Evvalley Contact <noreply@evvalley.com>',
            to: ['info@evvalley.com'],
            subject: `New Contact Form Message: ${subject}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1C1F4A;">New Contact Form Message</h2>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>From:</strong> ${firstName} ${lastName}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <p style="color: #666; font-size: 14px;">
                  This message was sent from the Evvalley contact form at ${new Date().toLocaleString()}
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Email sending failed:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    // Send auto-reply to user
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Evvalley Team <noreply@evvalley.com>',
            to: [email],
            subject: 'Thank you for contacting Evvalley',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1C1F4A;">Thank you for contacting Evvalley!</h2>
                <p>Dear ${firstName},</p>
                <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Your message:</strong></p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <p>If you have any urgent questions, you can also reach us directly at <a href="mailto:info@evvalley.com">info@evvalley.com</a></p>
                <p>Best regards,<br>The Evvalley Team</p>
              </div>
            `,
          }),
        });
      } catch (autoReplyError) {
        console.error('Auto-reply error:', autoReplyError);
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact message sent successfully',
        id: contactMessage.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
