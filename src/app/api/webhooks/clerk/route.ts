import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Minimal Clerk webhook to send welcome email immediately on user.created
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    // Verify signature if secret is provided
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (secret) {
      const signature = (request.headers.get('svix-signature') || request.headers.get('clerk-signature') || '').toString();
      const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      if (!signature.includes(computed)) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
    const payload = JSON.parse(rawBody);
    const type = payload?.type || payload?.event_type || payload?.object;

    // Accept both Clerk webhook formats; focus on user.created
    const isUserCreated = type === 'user.created' || (payload?.data && payload?.data?.object === 'user' && payload?.type === 'user.created');
    if (!isUserCreated) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const data = payload?.data || payload; // Support different shapes
    const firstName = data?.first_name || data?.firstName || '';
    const email = (data?.email_addresses?.[0]?.email_address) || data?.primary_email_address?.email_address || data?.email || '';

    if (!email) {
      console.error('Welcome email: missing email in webhook payload');
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const nameForSubject = firstName ? `${firstName}` : 'there';
    const subject = `Welcome EvValley, ${nameForSubject}! 🌱⚡`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Welcome to EvValley</title>
        </head>
        <body style="margin:0;padding:0;background:#F5F9FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5F9FF;padding:24px 0;">
            <tr>
              <td>
                <table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" style="margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.06);overflow:hidden;">
                  <tr>
                    <td style="background:linear-gradient(90deg,#3AB0FF,#78D64B);padding:32px 28px;color:#ffffff;text-align:center;">
                      <div style="font-size:36px;line-height:1">⚡</div>
                      <h1 style="margin:8px 0 0 0;font-size:24px;font-weight:700;">Welcome to EvValley${firstName ? `, ${firstName}` : ''}!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      <p style="margin:0 0 16px 0;font-size:16px;">Why EvValley?</p>
                      <ul style="margin:0 0 16px 20px;padding:0;font-size:15px;color:#334155;">
                        <li>100% focused on EVs</li>
                        <li>Commission-free selling</li>
                        <li>Secure escrow system coming soon</li>
                        <li>Quick & simple listing process</li>
                      </ul>
                      <p style="margin:0 0 20px 0;font-size:16px;">👉 List your vehicle today and join our growing EV community!</p>
                      <div style="text-align:center;margin:24px 0 8px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.evvalley.com'}/sell" style="background:#1C1F4A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;display:inline-block;">List Your EV</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 28px;border-top:1px solid #e5e7eb;text-align:center;color:#64748b;font-size:12px;">
                      © ${new Date().getFullYear()} EvValley. You’re receiving this because you just signed up.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: 'Evvalley <evvalley@evvalley.com>',
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error('Welcome email send error:', error);
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Clerk webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}


