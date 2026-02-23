import { NextRequest, NextResponse } from 'next/server';
import { runSync } from '@/lib/sync/engine';

export const maxDuration = 300; // 5 minutes for Vercel Pro plan

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const syncRunId = await runSync({ triggeredBy: 'cron' });
    return NextResponse.json({ success: true, syncRunId });
  } catch (error) {
    console.error('[cron/sync] Fatal error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel Cron (which sends GET requests)
export async function GET(request: NextRequest) {
  return POST(request);
}
