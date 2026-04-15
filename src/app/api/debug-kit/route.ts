import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'KIT_API_KEY not set', hasKey: false });
  }

  try {
    const res = await fetch('https://api.kit.com/v4/broadcasts?per_page=5', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    const status = res.status;
    const body = await res.json().catch(() => res.text());

    return NextResponse.json({
      hasKey: true,
      keyPrefix: apiKey.slice(0, 10) + '...',
      apiStatus: status,
      responseKeys: typeof body === 'object' ? Object.keys(body) : 'not-json',
      broadcastCount: body.broadcasts?.length ?? body.data?.length ?? 0,
      firstBroadcast: body.broadcasts?.[0] || body.data?.[0] || null,
      pagination: body.pagination || null,
      rawResponse: body,
    });
  } catch (err: any) {
    return NextResponse.json({
      hasKey: true,
      error: err.message,
      stack: err.stack,
    });
  }
}
