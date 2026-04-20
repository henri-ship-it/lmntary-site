-- ============================================================
-- LMNTARY Performance — Initial Supabase Schema
-- ============================================================
-- Run this in the Supabase SQL editor to bootstrap the database.
--
-- Tables:
--   user_profiles            — core user data + extracted style scores
--   pre_assessments          — ScoreApp "Pre-Assessment Pro" results
--   know_thyself_assessments — ScoreApp "Know Thyself" behavioural results
--   lesson_progress          — per-lesson completion tracking
--   reflections              — free-text journal entries per lesson
-- ============================================================


-- ─── User Profiles ────────────────────────────────────────────
-- One row per authenticated user. Linked to Supabase Auth via id.
-- Style scores are denormalized here for fast access during
-- personalisation (copied from know_thyself_assessments).

CREATE TABLE user_profiles (
  id                          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                       TEXT UNIQUE NOT NULL,
  first_name                  TEXT,
  last_name                   TEXT,

  -- Behavioural style (denormalized from know_thyself_assessments)
  dominant_style              TEXT,            -- 'Dynamo' | 'Analyst' | 'Caretaker' | 'Energiser'
  dynamo_pct                  SMALLINT,        -- 0-100
  analyst_pct                 SMALLINT,
  caretaker_pct               SMALLINT,
  energiser_pct               SMALLINT,

  -- Timestamps for assessment completion
  pre_assessment_completed_at TIMESTAMPTZ,
  know_thyself_completed_at   TIMESTAMPTZ,

  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);


-- ─── Pre-Assessment Pro (ScoreApp) ───────────────────────────
-- The deep intake questionnaire: professional context, goals,
-- challenges, self-ratings, strengths, improvement areas, etc.
-- ~60+ fields — stored as JSONB to absorb ScoreApp changes.

CREATE TABLE pre_assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  scoreapp_key    TEXT UNIQUE,       -- ScoreApp result_key for idempotency

  result_url      TEXT,
  result_pdf_url  TEXT,

  -- Structured extracts for fast queries
  scores          JSONB DEFAULT '{}'::JSONB,   -- e.g. {"personal_context_pct": 83, ...}
  answers         JSONB DEFAULT '{}'::JSONB,   -- e.g. {"current_role": "...", "goals": "...", ...}

  -- Full ScoreApp payload for future reference
  raw_payload     JSONB DEFAULT '{}'::JSONB,

  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ─── Know Thyself Behavioural Assessment (ScoreApp) ──────────
-- 4 style scores (Dynamo, Analyst, Caretaker, Energiser) as
-- percentages, plus 36 individual trait item scores.

CREATE TABLE know_thyself_assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  scoreapp_key    TEXT UNIQUE,       -- ScoreApp result_key for idempotency

  result_url      TEXT,
  result_pdf_url  TEXT,

  -- The four style percentages
  dynamo_pct      SMALLINT NOT NULL DEFAULT 0,
  analyst_pct     SMALLINT NOT NULL DEFAULT 0,
  caretaker_pct   SMALLINT NOT NULL DEFAULT 0,
  energiser_pct   SMALLINT NOT NULL DEFAULT 0,
  dominant_style  TEXT NOT NULL DEFAULT 'Unknown',

  -- All 36 trait item scores as JSONB
  trait_scores    JSONB DEFAULT '{}'::JSONB,

  -- Full ScoreApp payload
  raw_payload     JSONB DEFAULT '{}'::JSONB,

  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ─── Lesson Progress ─────────────────────────────────────────
-- Replaces localStorage. One row per user × course × lesson.

CREATE TABLE lesson_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_slug     TEXT NOT NULL,
  lesson_slug     TEXT NOT NULL,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  last_viewed_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, course_slug, lesson_slug)
);

-- Index for fast "get all progress for a course" queries
CREATE INDEX idx_lesson_progress_user_course
  ON lesson_progress(user_id, course_slug);


-- ─── Reflections ─────────────────────────────────────────────
-- Free-text journal entries. Users can have multiple reflections
-- per lesson (one per session / revisit).

CREATE TABLE reflections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_slug     TEXT NOT NULL,
  lesson_slug     TEXT NOT NULL,
  prompt          TEXT,              -- optional: the question/prompt shown
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reflections_user_lesson
  ON reflections(user_id, course_slug, lesson_slug);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE user_profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_assessments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE know_thyself_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections              ENABLE ROW LEVEL SECURITY;

-- user_profiles: users can read/update their own row
CREATE POLICY "Users read own profile"
  ON user_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users update own profile"
  ON user_profiles FOR UPDATE USING (id = auth.uid());

-- pre_assessments: users can read their own
CREATE POLICY "Users read own pre-assessment"
  ON pre_assessments FOR SELECT USING (user_id = auth.uid());

-- know_thyself_assessments: users can read their own
CREATE POLICY "Users read own know-thyself"
  ON know_thyself_assessments FOR SELECT USING (user_id = auth.uid());

-- lesson_progress: users can read/insert/update their own
CREATE POLICY "Users read own progress"
  ON lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own progress"
  ON lesson_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own progress"
  ON lesson_progress FOR UPDATE USING (user_id = auth.uid());

-- reflections: users can read/insert/update their own
CREATE POLICY "Users read own reflections"
  ON reflections FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own reflections"
  ON reflections FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own reflections"
  ON reflections FOR UPDATE USING (user_id = auth.uid());


-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
-- Trigger that creates a user_profiles row when a new user signs up.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
