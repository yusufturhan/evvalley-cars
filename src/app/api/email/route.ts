import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@evvalley.com',
      to: [to],
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error('❌ Email sending error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log('✅ Email sent successfully:', data);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ Email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 