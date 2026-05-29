-- ============================================================
-- Migration 004: Create Contracts and Inventories Tables
-- ============================================================

-- 1. Create pending_contracts table
CREATE TABLE IF NOT EXISTS public.pending_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create signed_contracts table
CREATE TABLE IF NOT EXISTS public.signed_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    signature_svg TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SIGNED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create inventories table
CREATE TABLE IF NOT EXISTS public.inventories (
    id UUID PRIMARY KEY, -- usually property_id
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.pending_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signed_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;

-- 5. Policies
CREATE POLICY "Public can create pending contracts" ON public.pending_contracts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can view pending contracts" ON public.pending_contracts FOR SELECT TO anon USING (true);
CREATE POLICY "Public can update pending contracts" ON public.pending_contracts FOR UPDATE TO anon USING (true);

CREATE POLICY "Public can create signed contracts" ON public.signed_contracts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can view signed contracts" ON public.signed_contracts FOR SELECT TO anon USING (true);

CREATE POLICY "Public can view inventories" ON public.inventories FOR SELECT TO anon USING (true);
CREATE POLICY "Partners can manage inventories" ON public.inventories FOR ALL TO anon USING ((current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024') WITH CHECK ((current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024');

-- Ensure partners can manage all
CREATE POLICY "Partners can manage pending contracts" ON public.pending_contracts FOR ALL TO anon USING ((current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024') WITH CHECK ((current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024');
CREATE POLICY "Partners can manage signed contracts" ON public.signed_contracts FOR ALL TO anon USING ((current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024') WITH CHECK ((current_setting('request.headers', true)::json ->> 'x-partner-secret') = 'paradise-premium-secret-2024');
