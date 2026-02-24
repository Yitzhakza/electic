import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { z } from 'zod';
import { sendChargingGuideEmail } from '@/lib/email';

const leadSchema = z.object({
  email: z.string().email(),
  phone: z.string().max(32).optional(),
  carModel: z.string().max(128).optional(),
  source: z.string().max(64).default('website'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const [result] = await db
      .insert(leads)
      .values({
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        carModel: parsed.data.carModel ?? null,
        source: parsed.data.source,
      })
      .returning();

    // Send charging guide email (non-blocking — don't fail the request if email fails)
    sendChargingGuideEmail(parsed.data.email, parsed.data.carModel).catch((err) => {
      console.error('Failed to send guide email:', err);
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
