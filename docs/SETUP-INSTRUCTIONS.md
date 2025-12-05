# Setup Instructions

## Current Progress ✅

- [x] Next.js project initialized
- [x] shadcn/ui installed (9 components)
- [x] Supabase packages installed
- [x] Client utilities created
- [x] Environment files created
- [x] Database schema SQL prepared

## Next Steps 🚀

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Organization**: Create or select existing
   - **Project Name**: `study-materials`
   - **Database Password**: Generate strong password (**SAVE THIS!**)
   - **Region**: Choose closest to your location
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

### Step 2: Get Your Credentials

After project is ready:

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (long JWT token starting with `eyJ...`)

### Step 3: Update .env.local

Open `.env.local` and replace the placeholder values:

```bash
# Replace these with your actual values from Step 2
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# This stays the same
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANT**: After updating, restart your dev server!

```bash
# Press Ctrl+C to stop the current server
# Then restart:
npm run dev
```

### Step 4: Run Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` in your code editor
4. **Copy the entire contents**
5. **Paste** into Supabase SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`

This will create:
- ✅ 3 tables (profiles, subjects, materials)
- ✅ All indexes for performance
- ✅ Row Level Security policies
- ✅ 14 default subjects
- ✅ Mock profile for testing

### Step 5: Verify Database Setup

In the SQL Editor, run these verification queries:

```sql
-- Should return 3 tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'subjects', 'materials');

-- Should return 14
SELECT COUNT(*) FROM subjects;

-- Should return the mock profile
SELECT * FROM profiles WHERE id = '00000000-0000-0000-0000-000000000000';
```

### Step 6: Test Connection

After updating `.env.local` and restarting the dev server:

Visit: `http://localhost:3000/test-ui`

You should see:
- ✅ Styled components working
- ✅ No errors in console

## Mock Creator ID for Development

Since authentication (US-009) is low priority, use this hardcoded ID for testing:

```typescript
const MOCK_CREATOR_ID = '00000000-0000-0000-0000-000000000000'
```

This profile exists in the database after running the schema SQL.

## Troubleshooting

### Environment variables not loading
- Make sure you restarted the dev server after updating `.env.local`
- Check the file is named exactly `.env.local` (not `.env` or `.env.development`)

### Database connection errors
- Verify credentials are correct in `.env.local`
- Check Supabase project is active (not paused)
- Ensure you're using the **anon/public key**, not the service role key

### Tables not created
- Make sure you ran the entire `supabase-schema.sql` file
- Check for any error messages in the SQL Editor
- Verify you're in the correct Supabase project

## Ready to Build Features!

Once all steps are complete, you're ready to start building features:
- **Next**: US-001 (Upload PDF Material)

See `docs/USER-STORIES-INDEX.md` for the complete roadmap.
