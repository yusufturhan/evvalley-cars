import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/database';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Check database health
    const dbHealthy = await checkDatabaseHealth();
    
    const responseTime = Date.now() - startTime;
    
    if (!dbHealthy) {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'down',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      }, { status: 503 });
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'up',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      database: 'unknown',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error : 'Unknown error'
    }, { status: 500 });
  }
}
