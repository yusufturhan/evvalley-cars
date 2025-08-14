import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('email_logs')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by campaign if specified
    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Error fetching email logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch email logs' },
        { status: 500 }
      );
    }

    // Get summary statistics
    const { data: stats } = await supabase
      .from('email_logs')
      .select('status')
      .eq('campaign_id', campaignId || '');

    const summary = {
      total: stats?.length || 0,
      sent: stats?.filter(s => s.status === 'sent').length || 0,
      failed: stats?.filter(s => s.status === 'failed').length || 0,
      opened: stats?.filter(s => s.status === 'opened').length || 0,
      clicked: stats?.filter(s => s.status === 'clicked').length || 0,
    };

    return NextResponse.json({
      success: true,
      data: logs,
      summary,
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    });

  } catch (error) {
    console.error('Email logs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, campaign_id, email_id, status, error_message } = await request.json();

    const { data, error } = await supabase
      .from('email_logs')
      .insert({
        user_id,
        campaign_id,
        email_id,
        status: status || 'sent',
        error_message
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating email log:', error);
      return NextResponse.json(
        { error: 'Failed to create email log' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Email logs POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
