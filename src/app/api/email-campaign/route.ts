import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { 
  getCampaignById, 
  getActiveCampaigns, 
  getTemplateById, 
  processTemplate,
  EmailCampaign 
} from '@/lib/email-campaigns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { campaignId, userId, customVariables } = await request.json();

    // Get campaign details
    const campaign = getCampaignById(campaignId);
    if (!campaign || !campaign.isActive) {
      return NextResponse.json(
        { error: 'Campaign not found or inactive' },
        { status: 404 }
      );
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get template
    const template = getTemplateById(campaign.template);
    if (!template) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }

    // Prepare variables
    const variables = {
      firstName: user.first_name || 'there',
      browseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vehicles`,
      sellUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sell`,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${user.email}`,
      preferencesUrl: `${process.env.NEXT_PUBLIC_APP_URL}/email-preferences`,
      ...customVariables
    };

    // Process template
    const { html, text } = processTemplate(template, variables);

    // Send email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: user.email,
      subject: campaign.subject,
      html: html,
      text: text,
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log email sent
    await supabase
      .from('email_logs')
      .insert({
        user_id: userId,
        campaign_id: campaignId,
        email_id: emailData?.id,
        sent_at: new Date().toISOString(),
        status: 'sent'
      });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: emailData?.id
    });

  } catch (error) {
    console.error('Campaign API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const activeOnly = searchParams.get('active') === 'true';

    let campaigns = activeOnly ? getActiveCampaigns() : getActiveCampaigns();
    
    if (type) {
      campaigns = campaigns.filter(campaign => campaign.type === type);
    }

    return NextResponse.json({
      campaigns,
      total: campaigns.length
    });

  } catch (error) {
    console.error('Campaign GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
