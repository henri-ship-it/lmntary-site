import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiSecret = process.env.KIT_API_SECRET;
  const apiKey = process.env.KIT_API_KEY;

  const results: any = {
    hasV3Secret: !!apiSecret,
    hasV4Key: !!apiKey,
    v3: null,
    v4: null,
  };

  // Test V3
  if (apiSecret) {
    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/broadcasts?api_secret=${apiSecret}`,
        { headers: { Accept: 'application/json' } }
      );
      const body = await res.json().catch(() => null);
      const broadcasts = body?.broadcasts || [];
      results.v3 = {
        status: res.status,
        broadcastCount: broadcasts.length,
        error: body?.error || body?.message || null,
      };
    } catch (err: any) {
      results.v3 = { error: err.message };
    }
  }

  // Test fetching a single broadcast by ID to see all available fields
  if (apiSecret && results.v3?.sampleBroadcasts?.[0]?.id) {
    try {
      const testId = results.v3.sampleBroadcasts[0].id;
      const res = await fetch(
        `https://api.convertkit.com/v3/broadcasts/${testId}?api_secret=${apiSecret}`,
        { headers: { Accept: 'application/json' } }
      );
      const body = await res.json().catch(() => null);
      const b = body?.broadcast || body;
      results.v3_single = {
        status: res.status,
        allKeys: Object.keys(b),
        published_at: b.published_at,
        public: b.public,
        subject: b.subject,
        description: b.description,
        thumbnail_url: b.thumbnail_url,
        contentFirst2000: (b.content || b.body || '').slice(0, 2000),
      };
    } catch (err: any) {
      results.v3_single = { error: err.message };
    }
  }

  // Test V4
  if (apiKey) {
    try {
      const res = await fetch(
        'https://api.kit.com/v4/broadcasts?per_page=5',
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
          },
        }
      );
      const body = await res.json().catch(() => null);
      results.v4 = {
        status: res.status,
        broadcastCount: body?.broadcasts?.length ?? 0,
        firstBroadcast: body?.broadcasts?.[0] || null,
        error: body?.errors || body?.error || null,
      };
    } catch (err: any) {
      results.v4 = { error: err.message };
    }
  }

  return NextResponse.json(results, { status: 200 });
}
