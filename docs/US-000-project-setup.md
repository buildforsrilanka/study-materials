# User Story: Project Setup and Configuration

**Story ID**: US-000
**Priority**: Critical (Must Complete First)
**Effort**: Small

## User Story

**As a** developer
**I want to** set up the foundational project infrastructure
**So that** I can build features on top of a properly configured Next.js, shadcn/ui, and Supabase stack

## Acceptance Criteria

### shadcn/ui Setup
- [ ] shadcn/ui initialized in the project
- [ ] Required UI components installed: button, card, input, label, select, textarea, dialog, alert, tabs
- [ ] Components directory created at `components/ui/`
- [ ] Tailwind CSS configured correctly
- [ ] Theme configuration working (light/dark mode support)
- [ ] Test component renders correctly

### Supabase Setup
- [ ] Supabase project created on supabase.com
- [ ] Database URL and anon key obtained
- [ ] Environment variables configured in `.env.local`
- [ ] Supabase client utilities created:
  - `lib/supabase/client.ts` (browser client)
  - `lib/supabase/server.ts` (server client)
- [ ] Connection to Supabase tested successfully
- [ ] TypeScript types for Supabase generated (optional but recommended)

### Database Schema
- [ ] `profiles` table created with RLS policies
- [ ] `subjects` table created with RLS policies
- [ ] `materials` table created with RLS policies
- [ ] Default subjects seeded (Math, Science, English, etc.)
- [ ] Database indexes created for performance
- [ ] Foreign key relationships configured

### Environment Configuration
- [ ] `.env.local` file created with all required variables
- [ ] `.env.example` file created as template
- [ ] `.env.local` added to `.gitignore` (verify it exists)
- [ ] Environment variables documented in README or setup guide

### Project Structure
- [ ] Key directories created:
  - `components/ui/` (shadcn components)
  - `components/shared/` (shared components)
  - `components/creator/` (creator-specific)
  - `components/student/` (student-specific)
  - `lib/supabase/` (Supabase clients)
  - `lib/` (utilities)
  - `types/` (TypeScript types)
- [ ] Path aliases configured in `tsconfig.json` (`@/*`)

### Verification
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes
- [ ] Supabase connection works (test query)
- [ ] shadcn components render correctly

## Implementation Steps

### Step 1: Install shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Select these options when prompted:
# - Style: Default
# - Base color: Slate (or your preference)
# - CSS variables: Yes
# - Configure components.json: Yes
# - Tailwind CSS: Yes (already installed)
# - Import alias: @/components

# Install required UI components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add dialog
npx shadcn@latest add alert
npx shadcn@latest add tabs
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `study-materials` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created (~2 minutes)
6. Go to Settings → API
7. Copy:
   - Project URL
   - Anon (public) key

### Step 3: Configure Environment Variables

Create `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `.env.example` (for documentation):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 5: Create Supabase Client Utilities

**File: `lib/supabase/client.ts`** (Browser client)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**File: `lib/supabase/server.ts`** (Server client)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie removal in Server Components
          }
        },
      },
    }
  )
}
```

### Step 6: Create Database Schema

Go to Supabase SQL Editor and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('creator', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'youtube')),
  url TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 14),
  medium TEXT NOT NULL CHECK (medium IN ('sinhala', 'tamil', 'english')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_materials_creator_id ON materials(creator_id);
CREATE INDEX idx_materials_subject_id ON materials(subject_id);
CREATE INDEX idx_materials_grade ON materials(grade);
CREATE INDEX idx_materials_medium ON materials(medium);
CREATE INDEX idx_materials_created_at ON materials(created_at DESC);

-- Row Level Security Policies

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subjects
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

-- Materials
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Materials are viewable by everyone"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Creators can insert their own materials"
  ON materials FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'creator'
    )
  );

CREATE POLICY "Creators can update their own materials"
  ON materials FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own materials"
  ON materials FOR DELETE
  USING (auth.uid() = creator_id);

-- Seed default subjects
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
```

### Step 7: Create Project Directories

```bash
# Create directory structure
mkdir -p components/ui
mkdir -p components/shared
mkdir -p components/creator
mkdir -p components/student
mkdir -p lib/supabase
mkdir -p types
```

### Step 8: Create Constants File

**File: `lib/constants.ts`**

```typescript
export const GRADES = [
  { value: 1, label: 'Grade 1' },
  { value: 2, label: 'Grade 2' },
  { value: 3, label: 'Grade 3' },
  { value: 4, label: 'Grade 4' },
  { value: 5, label: 'Grade 5' },
  { value: 6, label: 'Grade 6' },
  { value: 7, label: 'Grade 7' },
  { value: 8, label: 'Grade 8' },
  { value: 9, label: 'Grade 9' },
  { value: 10, label: 'Grade 10' },
  { value: 11, label: 'Grade 11' },
  { value: 12, label: 'Grade 12' },
  { value: 13, label: 'Grade 13' },
  { value: 14, label: 'University' },
] as const;

export const MEDIUMS = [
  { value: 'sinhala', label: 'Sinhala' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'english', label: 'English' },
] as const;

export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'youtube', label: 'YouTube Video' },
] as const;
```

### Step 9: Verify Setup

Test Supabase connection by creating a test page:

**File: `app/test-db/page.tsx`** (temporary, delete after testing)

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function TestDB() {
  const supabase = createClient();

  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .limit(5);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <p className="mb-4">✅ Connected to Supabase successfully!</p>
      <h2 className="text-xl font-semibold mb-2">Subjects:</h2>
      <ul className="list-disc pl-6">
        {subjects?.map((subject) => (
          <li key={subject.id}>{subject.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Visit `http://localhost:3000/test-db` to verify connection.

## Technical Notes

- Use `@supabase/ssr` for Next.js App Router compatibility
- Server and client Supabase instances are separate (different auth contexts)
- RLS policies are critical - never bypass them with service role key in production
- Grade 14 represents University level
- All timestamps use TIMESTAMPTZ for timezone support
- Indexes created for common query patterns (filtering by grade, medium, etc.)

## Related Stories

This story must be completed before all other stories:
- US-001 through US-009 all depend on this setup

## Verification Checklist

Before marking this story complete:
- [ ] Run `npm run dev` - no errors
- [ ] Run `npm run build` - succeeds
- [ ] Visit test-db page - shows subjects
- [ ] shadcn button component renders
- [ ] All directories created
- [ ] Environment variables working
- [ ] Database has all 3 tables with RLS enabled
- [ ] Default subjects seeded (14 subjects)

## Clean Up After Verification

After verifying everything works:
```bash
# Remove test page
rm -rf app/test-db
```

## Notes for Development Without Auth

Since authentication (US-009) is low priority:
- You can temporarily disable RLS policies for development, OR
- Use a hardcoded UUID for `creator_id` when testing creator features
- Example: `const MOCK_CREATOR_ID = '00000000-0000-0000-0000-000000000000'`
- Re-enable RLS and implement proper auth when working on US-009
