-- ============================================================
-- Paradise Premium Rentals — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. ENUMS
-- --------------------------------------------------------
CREATE TYPE property_category AS ENUM (
  'apartment',
  'house',
  'finca',
  'water_vehicle'
);

CREATE TYPE property_status AS ENUM (
  'available',
  'rented',
  'sold',
  'maintenance'
);

CREATE TYPE user_role AS ENUM (
  'buyer',
  'agent',
  'admin'
);

-- 2. PROFILES (extends auth.users)
-- --------------------------------------------------------
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        user_role DEFAULT 'buyer',
  phone       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Auto-create a profile row on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. PROPERTIES
-- --------------------------------------------------------
CREATE TABLE public.properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(14, 2) NOT NULL DEFAULT 0,
  area_m2       NUMERIC(10, 2),
  bedrooms      SMALLINT DEFAULT 0,
  bathrooms     SMALLINT DEFAULT 0,
  location      TEXT,
  neighborhood  TEXT,
  category      property_category NOT NULL DEFAULT 'apartment',
  amenities     JSONB DEFAULT '[]'::jsonb,
  images        TEXT[] DEFAULT '{}',
  pet_friendly  BOOLEAN DEFAULT FALSE,
  status        property_status DEFAULT 'available',
  owner_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast category filtering
CREATE INDEX idx_properties_category ON public.properties(category);
CREATE INDEX idx_properties_status   ON public.properties(status);
CREATE INDEX idx_properties_owner    ON public.properties(owner_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- 4. ROW LEVEL SECURITY
-- --------------------------------------------------------

-- Enable RLS on both tables
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- ---- Profiles ----
-- Anyone can read profiles
CREATE POLICY "Profiles: public read"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Profiles: self update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---- Properties ----
-- Anyone can read available properties (public catalog)
CREATE POLICY "Properties: public read"
  ON public.properties FOR SELECT
  USING (true);

-- Agents and admins can insert properties they own
CREATE POLICY "Properties: agent/admin insert"
  ON public.properties FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- Agents and admins can update their own properties
CREATE POLICY "Properties: owner update"
  ON public.properties FOR UPDATE
  USING (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  )
  WITH CHECK (
    auth.uid() = owner_id
  );

-- Agents and admins can delete their own properties
CREATE POLICY "Properties: owner delete"
  ON public.properties FOR DELETE
  USING (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('agent', 'admin')
    )
  );

-- 5. STORAGE BUCKET (run separately or via Dashboard)
-- --------------------------------------------------------
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('property-images', 'property-images', true);
