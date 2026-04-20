import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * POST /api/webhooks/scoreapp
 *
 * Receives webhook payloads from ScoreApp when a user completes either:
 *   1. Pre-Assessment Pro (deep intake questionnaire)
 *   2. Know Thyself (behavioural preference assessment)
 *
 * The payload is a CSV-style row converted to JSON by ScoreApp's webhook.
 * We detect which assessment it is by looking for style-specific fields
 * (Dynamo Score %, Analyst Score %, etc.) that only exist in Know Thyself.
 *
 * Auth: Uses a shared secret in the `x-webhook-secret` header.
 */

const WEBHOOK_SECRET = process.env.SCOREAPP_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  // ─── Verify webhook secret ────────────────────────────────
  const secret = req.headers.get('x-webhook-secret');
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    console.error('[ScoreApp Webhook] Invalid or missing secret');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (payload.email as string || '').toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: 'No email in payload' }, { status: 400 });
  }

  const admin = createAdminClient();

  // ─── Find or note user ────────────────────────────────────
  // The user might not have signed up yet. We still store the
  // assessment data and link it later when they create an account.
  const { data: profile } = await admin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  const resultKey = payload.result_key as string || null;
  const resultUrl = payload.result_url as string || null;
  const resultPdfUrl = payload.result_pdf_url as string || null;
  const completedAt = payload.scorecard_finished_at as string || new Date().toISOString();

  // ─── Detect assessment type ───────────────────────────────
  const isKnowThyself = 'Dynamo Score %' in payload || 'dynamo_score_pct' in payload;

  if (isKnowThyself) {
    return handleKnowThyself(admin, payload, {
      userId: profile?.id || null,
      email,
      resultKey,
      resultUrl,
      resultPdfUrl,
      completedAt,
    });
  } else {
    return handlePreAssessment(admin, payload, {
      userId: profile?.id || null,
      email,
      resultKey,
      resultUrl,
      resultPdfUrl,
      completedAt,
    });
  }
}

// ─── Know Thyself Handler ─────────────────────────────────────
async function handleKnowThyself(
  admin: ReturnType<typeof createAdminClient>,
  payload: Record<string, unknown>,
  meta: {
    userId: string | null;
    email: string;
    resultKey: string | null;
    resultUrl: string | null;
    resultPdfUrl: string | null;
    completedAt: string;
  }
) {
  // Extract the four style percentages
  const dynamoPct = Number(payload['Dynamo Score %'] || payload['dynamo_score_pct'] || 0);
  const analystPct = Number(payload['Analyst Score %'] || payload['analyst_score_pct'] || 0);
  const caretakerPct = Number(payload['Caretaker Score %'] || payload['caretaker_score_pct'] || 0);
  const energiserPct = Number(payload['Energiser Score %'] || payload['energiser_score_pct'] || 0);

  // Determine dominant style
  const styles = [
    { name: 'Dynamo', pct: dynamoPct },
    { name: 'Analyst', pct: analystPct },
    { name: 'Caretaker', pct: caretakerPct },
    { name: 'Energiser', pct: energiserPct },
  ];
  const dominant = styles.reduce((a, b) => (b.pct > a.pct ? b : a)).name;

  // Extract individual trait scores (the 36 items)
  const traitKeys = Object.keys(payload).filter(
    (k) =>
      !k.includes('Score %') &&
      !k.includes('Score - Actual') &&
      !['first_name', 'last_name', 'email', 'scorecard_started_at', 'scorecard_finished_at',
        'time_taken', 'completed', 'optin', 'optin_detail', 'utm_source', 'utm_campaign',
        'utm_medium', 'utm_term', 'utm_content', 'result_key', 'result_url', 'result_pdf_url',
        'referrer', 'landing_page', 'ip_address_country', 'Overall Score %', 'Overall Score - Actual',
      ].includes(k)
  );
  const traitScores: Record<string, number> = {};
  for (const key of traitKeys) {
    const val = Number(payload[key]);
    if (!isNaN(val)) traitScores[key] = val;
  }

  if (meta.userId) {
    // Store assessment
    const { error } = await admin.from('know_thyself_assessments').upsert(
      {
        user_id: meta.userId,
        email: meta.email,
        scoreapp_key: meta.resultKey,
        result_url: meta.resultUrl,
        result_pdf_url: meta.resultPdfUrl,
        dynamo_pct: dynamoPct,
        analyst_pct: analystPct,
        caretaker_pct: caretakerPct,
        energiser_pct: energiserPct,
        dominant_style: dominant,
        trait_scores: traitScores,
        raw_payload: payload,
        completed_at: meta.completedAt,
      },
      { onConflict: 'scoreapp_key' }
    );

    if (error) {
      console.error('[ScoreApp] Know Thyself insert error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    // Update user profile with style data
    await admin.from('user_profiles').update({
      first_name: (payload.first_name as string) || null,
      last_name: (payload.last_name as string) || null,
      dominant_style: dominant,
      dynamo_pct: dynamoPct,
      analyst_pct: analystPct,
      caretaker_pct: caretakerPct,
      energiser_pct: energiserPct,
      know_thyself_completed_at: meta.completedAt,
      updated_at: new Date().toISOString(),
    }).eq('id', meta.userId);
  }

  console.log(`[ScoreApp] Know Thyself processed for ${meta.email}: ${dominant} (D:${dynamoPct} A:${analystPct} C:${caretakerPct} E:${energiserPct})`);
  return NextResponse.json({
    success: true,
    type: 'know_thyself',
    dominant_style: dominant,
    user_linked: !!meta.userId,
  });
}

// ─── Pre-Assessment Handler ──────────────────────────────────
async function handlePreAssessment(
  admin: ReturnType<typeof createAdminClient>,
  payload: Record<string, unknown>,
  meta: {
    userId: string | null;
    email: string;
    resultKey: string | null;
    resultUrl: string | null;
    resultPdfUrl: string | null;
    completedAt: string;
  }
) {
  // Extract score percentages
  const scores: Record<string, number> = {};
  const scoreKeys = Object.keys(payload).filter((k) => k.includes('Score %'));
  for (const key of scoreKeys) {
    scores[key] = Number(payload[key] || 0);
  }

  // Extract free-text answers (everything that's a string and not a score/metadata field)
  const metaFields = new Set([
    'first_name', 'last_name', 'email', 'scorecard_started_at', 'scorecard_finished_at',
    'time_taken', 'completed', 'optin', 'optin_detail', 'utm_source', 'utm_campaign',
    'utm_medium', 'utm_term', 'utm_content', 'result_key', 'result_url', 'result_pdf_url',
    'referrer', 'landing_page', 'ip_address_country',
  ]);
  const answers: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(payload)) {
    if (!metaFields.has(key) && !key.includes('Score %') && !key.includes('Score - Actual')) {
      answers[key] = val;
    }
  }

  if (meta.userId) {
    const { error } = await admin.from('pre_assessments').upsert(
      {
        user_id: meta.userId,
        email: meta.email,
        scoreapp_key: meta.resultKey,
        result_url: meta.resultUrl,
        result_pdf_url: meta.resultPdfUrl,
        scores,
        answers,
        raw_payload: payload,
        completed_at: meta.completedAt,
      },
      { onConflict: 'scoreapp_key' }
    );

    if (error) {
      console.error('[ScoreApp] Pre-assessment insert error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    // Update user profile
    await admin.from('user_profiles').update({
      first_name: (payload.first_name as string) || null,
      last_name: (payload.last_name as string) || null,
      pre_assessment_completed_at: meta.completedAt,
      updated_at: new Date().toISOString(),
    }).eq('id', meta.userId);
  }

  console.log(`[ScoreApp] Pre-assessment processed for ${meta.email}, user_linked: ${!!meta.userId}`);
  return NextResponse.json({
    success: true,
    type: 'pre_assessment',
    user_linked: !!meta.userId,
  });
}
