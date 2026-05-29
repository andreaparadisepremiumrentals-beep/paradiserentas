-- ============================================================
-- 002 — Add Missing Columns for Metadata & Mocks
-- ============================================================

-- Add capacity and videoUrl, isMock
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS "videoUrl" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "isMock"   BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "capacity" SMALLINT DEFAULT 0;

-- Adjust updated_at trigger if needed (it already handles all columns)
