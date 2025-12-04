-- =============================================
-- STUDY MATERIALS PLATFORM - DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- =============================================
-- This script will:
-- 1. Drop all existing tables (fresh start)
-- 2. Create all tables with proper structure
-- 3. Seed default data
-- 4. Set up RLS policies (dev-friendly, allows MOCK_CREATOR_ID)
-- =============================================

-- =============================================
-- DROP EXISTING TABLES (Fresh Start)
-- =============================================
-- Drop in correct order to handle foreign key dependencies
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS mediums CASCADE;
DROP TABLE IF EXISTS grades CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: GRADES (No dependencies - create first)
-- Grade levels (Kindergarten, Grade 1-13, University)
-- =============================================
CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: MEDIUMS (No dependencies - create first)
-- Language mediums (Sinhala, Tamil, English)
-- =============================================
CREATE TABLE IF NOT EXISTS mediums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: SUBJECTS (No dependencies - create first)
-- Learning subjects (Math, Science, etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: PROFILES
-- Extends auth.users with role and additional info
-- Note: For development without auth, we'll temporarily
-- allow profiles without auth.users reference
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('creator', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLE: MATERIALS
-- Learning materials (PDFs and YouTube videos)
-- Depends on: profiles, subjects, grades, mediums
-- =============================================
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'youtube')),
  url TEXT NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE RESTRICT,
  medium_id UUID NOT NULL REFERENCES mediums(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEED GRADES (In order from lowest to highest)
-- =============================================
INSERT INTO grades (name, display_order) VALUES
  ('Kindergarten', 0),
  ('Grade 1', 1),
  ('Grade 2', 2),
  ('Grade 3', 3),
  ('Grade 4', 4),
  ('Grade 5', 5),
  ('Grade 6', 6),
  ('Grade 7', 7),
  ('Grade 8', 8),
  ('Grade 9', 9),
  ('Grade 10', 10),
  ('Grade 11', 11),
  ('Grade 12', 12),
  ('Grade 13', 13),
  ('University', 14)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- SEED MEDIUMS (Language mediums)
-- =============================================
INSERT INTO mediums (name) VALUES
  ('Sinhala'),
  ('Tamil'),
  ('English')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- SEED DEFAULT SUBJECTS
-- =============================================
INSERT INTO subjects (name) VALUES
  ('Mathematics'),
  ('Science'),
  ('English'),
  ('Sinhala'),
  ('Tamil'),
  ('History'),
  ('Geography'),
  ('ICT'),
  ('Physics'),
  ('Chemistry'),
  ('Biology'),
  ('Business Studies'),
  ('Economics'),
  ('Accounting')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- CREATE MOCK PROFILE FOR TESTING
-- Since auth is not implemented yet, create profile directly
-- =============================================
INSERT INTO profiles (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000000', 'test@creator.com', 'Test Creator', 'creator')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_materials_creator_id ON materials(creator_id);
CREATE INDEX IF NOT EXISTS idx_materials_subject_id ON materials(subject_id);
CREATE INDEX IF NOT EXISTS idx_materials_grade_id ON materials(grade_id);
CREATE INDEX IF NOT EXISTS idx_materials_medium_id ON materials(medium_id);
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_grades_display_order ON grades(display_order);

-- =============================================
-- ROW LEVEL SECURITY - PROFILES
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- ROW LEVEL SECURITY - GRADES
-- =============================================
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Grades are viewable by everyone"
  ON grades FOR SELECT
  USING (true);

-- =============================================
-- ROW LEVEL SECURITY - MEDIUMS
-- =============================================
ALTER TABLE mediums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mediums are viewable by everyone"
  ON mediums FOR SELECT
  USING (true);

-- =============================================
-- ROW LEVEL SECURITY - SUBJECTS
-- =============================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subjects are viewable by everyone"
  ON subjects FOR SELECT
  USING (true);

CREATE POLICY "Creators can insert subjects"
  ON subjects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'creator'
    )
  );

-- =============================================
-- ROW LEVEL SECURITY - MATERIALS
-- =============================================
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Materials are viewable by everyone"
  ON materials FOR SELECT
  USING (true);

-- DEV-FRIENDLY: Allows inserts with MOCK_CREATOR_ID (no auth required)
-- When implementing US-009 (Authentication), replace with stricter policy
CREATE POLICY "Creators can insert materials (dev-friendly)"
  ON materials FOR INSERT
  WITH CHECK (
    -- Allow if using the mock creator ID (development without auth)
    creator_id = '00000000-0000-0000-0000-000000000000'
    -- OR if authenticated and role is creator (production)
    OR (
      auth.uid() = creator_id
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'creator'
      )
    )
  );

-- DEV-FRIENDLY: Allows updates with MOCK_CREATOR_ID
CREATE POLICY "Creators can update materials (dev-friendly)"
  ON materials FOR UPDATE
  USING (
    creator_id = '00000000-0000-0000-0000-000000000000'
    OR auth.uid() = creator_id
  );

-- DEV-FRIENDLY: Allows deletes with MOCK_CREATOR_ID
CREATE POLICY "Creators can delete materials (dev-friendly)"
  ON materials FOR DELETE
  USING (
    creator_id = '00000000-0000-0000-0000-000000000000'
    OR auth.uid() = creator_id
  );


-- =============================================
-- VERIFICATION QUERIES
-- Run these to verify everything is set up correctly
-- =============================================

-- Check all tables exist (should return 5)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'subjects', 'materials', 'grades', 'mediums')
ORDER BY table_name;

-- Check grades count (should be 15: Kindergarten + Grades 1-13 + University)
SELECT COUNT(*) as grades_count FROM grades;

-- Check mediums count (should be 3)
SELECT COUNT(*) as mediums_count FROM mediums;

-- Check subjects count (should be 14)
SELECT COUNT(*) as subjects_count FROM subjects;

-- View all grades in order
SELECT name, display_order FROM grades ORDER BY display_order;

-- View all mediums
SELECT name FROM mediums ORDER BY name;

-- Check mock profile exists
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000000';

-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'subjects', 'materials', 'grades', 'mediums')
ORDER BY tablename;

-- =============================================
-- MIGRATION: Update existing materials table
-- Run this section ONLY if you already created the materials table
-- with subject_id as nullable and need to update it
-- =============================================

-- Check if materials table exists and has nullable subject_id
-- DO $$
-- BEGIN
--   -- Only run if materials table exists
--   IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'materials') THEN
--
--     -- Update any existing materials without a subject to have a default subject
--     UPDATE materials
--     SET subject_id = (SELECT id FROM subjects ORDER BY name LIMIT 1)
--     WHERE subject_id IS NULL;
--
--     -- Make subject_id NOT NULL
--     ALTER TABLE materials
--     ALTER COLUMN subject_id SET NOT NULL;
--
--     -- Drop the old foreign key constraint if it exists
--     ALTER TABLE materials
--     DROP CONSTRAINT IF EXISTS materials_subject_id_fkey;
--
--     -- Add new foreign key constraint with RESTRICT
--     ALTER TABLE materials
--     ADD CONSTRAINT materials_subject_id_fkey
--       FOREIGN KEY (subject_id)
--       REFERENCES subjects(id)
--       ON DELETE RESTRICT;
--
--     RAISE NOTICE 'Materials table updated: subject_id is now NOT NULL';
--   END IF;
-- END $$;

-- =============================================
-- TRIGGER: HANDLE NEW USER
-- Automatically create profile when a new user signs up
-- =============================================

-- Function to handle new user insertion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'creator') -- Default to creator
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- FIX: Insert profiles for existing users who missed the trigger
-- =============================================
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name',
  COALESCE(raw_user_meta_data->>'role', 'creator')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
