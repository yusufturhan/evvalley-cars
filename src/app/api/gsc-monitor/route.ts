import { NextRequest, NextResponse } from 'next/server';
import { gscMonitor } from '@/lib/gsc-monitor';

export async function GET(request: NextRequest) {
  try {
    // Check for new GSC issues
    const newIssues = await gscMonitor.checkForIssues();
    
    // Get all issues
    const allIssues = gscMonitor.getIssues();
    const criticalIssues = gscMonitor.getCriticalIssues();
    
    return NextResponse.json({
      success: true,
      data: {
        newIssues,
        totalIssues: allIssues.length,
        criticalIssues: criticalIssues.length,
        allIssues: allIssues.slice(-10), // Last 10 issues
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('GSC Monitor Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check GSC issues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, url, type } = body;
    
    if (action === 'resolve' && url && type) {
      gscMonitor.resolveIssue(url, type);
      return NextResponse.json({ success: true, message: 'Issue resolved' });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GSC Monitor POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
