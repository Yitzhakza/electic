import { NextRequest, NextResponse } from 'next/server';
import { syncCoupons } from '@/lib/sync/coupon-sync';

export const maxDuration = 300; // 5 minutes

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncCoupons();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[cron/coupon-sync] Fatal error:', error);
    return NextResponse.json(
      { error: 'Coupon sync failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
