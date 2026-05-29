-- ============================================================
-- Migration 003: Secure RLS Logic
-- ============================================================

-- 1. Enable RLS (Safety first)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Access (Everyone can see the paradise)
DROP POLICY IF EXISTS "Properties: public read" ON public.properties;
CREATE POLICY "Properties: public read" 
ON public.properties FOR SELECT 
USING (true);

-- 3. Secure Mutation Policy (INSERT, UPDATE, DELETE)
-- This requires a 'x-partner-secret' header in the HTTP request.
-- Note: In Supabase dashboard, you can set a secret in the 'vault' 
-- or use a hardcoded value for this exercise.
DROP POLICY IF EXISTS "Acceso total para socios" ON public.properties;
DROP POLICY IF EXISTS "Properties: partner mutation" ON public.properties;

CREATE POLICY "Properties: partner mutation" 
ON public.properties FOR ALL 
TO anon
USING (
  (current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024'
)
WITH CHECK (
  (current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024'
);

-- 4. Audit Log (Optional but premium)
-- Log who deleted what if we had a partners table, but for now we rely on the header.
