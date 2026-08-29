-- ============================================================
-- Migration 005: Add display_order for manual list ordering
-- ============================================================
-- Partners can reorder listings (drag & drop). The public pages sort
-- by display_order ascending; new listings are appended at the end
-- (display_order = max + 1) until a partner curates the order.
--
-- Run this in Supabase Dashboard → SQL Editor.

-- 1. Add the column (nullable so existing rows are safe)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS display_order INT;

-- 2. Backfill sequentially, preserving the current "newest first"
--    behaviour (created_at DESC). Newest → 1 (shown first).
WITH ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at DESC, id ASC) AS rn
  FROM public.properties
)
UPDATE public.properties p
SET display_order = ordered.rn
FROM ordered
WHERE p.id = ordered.id;

-- 3. Index for fast ordering / MAX lookups
CREATE INDEX IF NOT EXISTS idx_properties_display_order
ON public.properties(display_order);
