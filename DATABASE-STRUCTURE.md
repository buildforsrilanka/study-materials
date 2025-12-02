# Database Structure - Normalized Schema

## Overview

This database uses a **normalized structure** where grades, mediums, and subjects are stored in separate tables and referenced by materials through foreign keys.

## Tables (5 Total)

### 1. `grades` - Grade Levels
Stores all educational levels from Kindergarten to University.

```sql
CREATE TABLE grades (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,          -- "Kindergarten", "Grade 1", etc.
  display_order INTEGER NOT NULL,     -- For sorting (0-14)
  created_at TIMESTAMPTZ
)
```

**Data (15 grades):**
- Kindergarten (0)
- Grade 1-13 (1-13)
- University (14)

**Usage:** Materials reference `grades.id` via `materials.grade_id`

---

### 2. `mediums` - Language Mediums
Stores the language mediums for educational content.

```sql
CREATE TABLE mediums (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,    -- "Sinhala", "Tamil", "English"
  created_at TIMESTAMPTZ
)
```

**Data (3 mediums):**
- Sinhala
- Tamil
- English

**Usage:** Materials reference `mediums.id` via `materials.medium_id`

---

### 3. `subjects` - Learning Subjects
Stores academic subjects.

```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,    -- "Mathematics", "Science", etc.
  created_at TIMESTAMPTZ
)
```

**Data (14 subjects):**
- Mathematics, Science, English, Sinhala, Tamil
- History, Geography, ICT
- Physics, Chemistry, Biology
- Business Studies, Economics, Accounting

**Usage:** Materials optionally reference `subjects.id` via `materials.subject_id`

---

### 4. `profiles` - User Profiles
User information extending Supabase auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('creator', 'student')),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**Note:** For development without auth, the foreign key to `auth.users` is temporarily removed.

**Mock Data:**
- ID: `00000000-0000-0000-0000-000000000000`
- Email: `test@creator.com`
- Role: `creator`

---

### 5. `materials` - Learning Materials
The main content table storing PDFs and YouTube videos.

```sql
CREATE TABLE materials (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('pdf', 'youtube')),
  url TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id),      -- Optional
  grade_id UUID REFERENCES grades(id),          -- Required
  medium_id UUID REFERENCES mediums(id),        -- Required
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**Foreign Keys:**
- `creator_id` → `profiles.id` (CASCADE delete)
- `grade_id` → `grades.id` (RESTRICT delete)
- `medium_id` → `mediums.id` (RESTRICT delete)
- `subject_id` → `subjects.id` (SET NULL delete)

---

## Relationships

```
┌─────────┐
│ grades  │ (15 rows)
└────┬────┘
     │
     │ FK: grade_id
     │
┌────▼──────────┐       ┌──────────┐
│   materials   │◄──────┤ profiles │
└────┬──────────┘       └──────────┘
     │                  FK: creator_id
     │
     │ FK: medium_id
     │
┌────▼────┐
│ mediums │ (3 rows)
└─────────┘

     ┌──────────┐
     │ subjects │ (14 rows)
     └────┬─────┘
          │
          │ FK: subject_id (optional)
          │
          └──────► materials
```

---

## Indexes

### Performance Indexes
```sql
-- Materials table
CREATE INDEX idx_materials_creator_id ON materials(creator_id);
CREATE INDEX idx_materials_subject_id ON materials(subject_id);
CREATE INDEX idx_materials_grade_id ON materials(grade_id);
CREATE INDEX idx_materials_medium_id ON materials(medium_id);
CREATE INDEX idx_materials_created_at ON materials(created_at DESC);

-- Grades table
CREATE INDEX idx_grades_display_order ON grades(display_order);
```

---

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### `grades` Table
- ✅ **SELECT**: Public (everyone can view)

### `mediums` Table
- ✅ **SELECT**: Public (everyone can view)

### `subjects` Table
- ✅ **SELECT**: Public (everyone can view)
- ✅ **INSERT**: Creators only

### `profiles` Table
- ✅ **SELECT**: Public (everyone can view)
- ✅ **UPDATE**: Own profile only

### `materials` Table
- ✅ **SELECT**: Public (everyone can view)
- ✅ **INSERT**: Creators only, must match auth.uid()
- ✅ **UPDATE**: Own materials only
- ✅ **DELETE**: Own materials only

---

## Querying Materials with Relations

### Fetch materials with all related data:

```typescript
const { data } = await supabase
  .from('materials')
  .select(`
    *,
    subjects:subject_id (id, name),
    grades:grade_id (id, name, display_order),
    mediums:medium_id (id, name)
  `)
  .order('created_at', { ascending: false })
```

### Filter by grade, medium, and subject:

```typescript
const { data } = await supabase
  .from('materials')
  .select(`
    *,
    subjects (name),
    grades (name),
    mediums (name)
  `)
  .eq('grade_id', gradeId)
  .eq('medium_id', mediumId)
  .eq('subject_id', subjectId)
```

---

## Fetching Reference Data

### Get all grades (for dropdowns):
```typescript
import { getGrades } from '@/lib/supabase/grades'

const grades = await getGrades()
// Returns: [{ id, name, display_order }, ...]
```

### Get all mediums (for dropdowns):
```typescript
import { getMediums } from '@/lib/supabase/mediums'

const mediums = await getMediums()
// Returns: [{ id, name }, ...]
```

### Get all subjects (for dropdowns):
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: subjects } = await supabase
  .from('subjects')
  .select('*')
  .order('name')
```

---

## TypeScript Types

### Core Types
```typescript
type Grade = {
  id: string
  name: string
  display_order: number
  created_at: string
}

type Medium = {
  id: string
  name: string
  created_at: string
}

type Subject = {
  id: string
  name: string
  created_at: string
}

type Material = {
  id: string
  creator_id: string
  title: string
  description: string
  type: 'pdf' | 'youtube'
  url: string
  subject_id: string | null
  grade_id: string      // Changed from grade: number
  medium_id: string     // Changed from medium: string
  created_at: string
  updated_at: string
}
```

### Extended Type (with relations)
```typescript
type MaterialWithRelations = Material & {
  subjects: Subject | null
  grades: Grade
  mediums: Medium
}
```

---

## Benefits of Normalized Structure

✅ **Data Integrity**: Foreign keys ensure valid references
✅ **Consistency**: No typos in grade/medium names
✅ **Flexibility**: Easy to add new grades or mediums
✅ **Efficient Queries**: Indexed foreign keys for fast filtering
✅ **Centralized Management**: Update grade/medium names in one place
✅ **Referential Integrity**: CASCADE/RESTRICT rules protect data

---

## Migration Notes

### Changes from Previous Schema:

**Before:**
```typescript
materials {
  grade: INTEGER (1-14)
  medium: TEXT ('sinhala' | 'tamil' | 'english')
}
```

**After:**
```typescript
materials {
  grade_id: UUID → grades.id
  medium_id: UUID → mediums.id
}
```

### Form Changes:

**Upload Form** must now:
1. Fetch grades from database (not hardcoded)
2. Fetch mediums from database (not hardcoded)
3. Submit `grade_id` and `medium_id` (UUIDs, not strings/numbers)

**Filter Form** must now:
1. Fetch grades for dropdown
2. Fetch mediums for dropdown
3. Filter by `grade_id` and `medium_id`

---

## Verification Queries

After running `supabase-schema.sql`, verify setup:

```sql
-- Check all 5 tables exist
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'subjects', 'materials', 'grades', 'mediums');
-- Should return: 5

-- Check data counts
SELECT COUNT(*) FROM grades;    -- Should be 15
SELECT COUNT(*) FROM mediums;   -- Should be 3
SELECT COUNT(*) FROM subjects;  -- Should be 14

-- View all grades in order
SELECT name, display_order FROM grades ORDER BY display_order;

-- View all mediums
SELECT name FROM mediums ORDER BY name;
```

---

## Example: Creating a Material

```typescript
const { data, error } = await supabase
  .from('materials')
  .insert({
    creator_id: '00000000-0000-0000-0000-000000000000',
    title: 'Algebra Basics',
    description: 'Introduction to algebra',
    type: 'pdf',
    url: 'https://drive.google.com/...',
    subject_id: '<subject-uuid-for-mathematics>',
    grade_id: '<grade-uuid-for-grade-10>',
    medium_id: '<medium-uuid-for-english>',
  })
```

---

## Next Steps

1. ✅ Run `supabase-schema.sql` in Supabase SQL Editor
2. ✅ Verify all 5 tables created
3. ✅ Verify RLS policies enabled
4. ✅ Check counts: 15 grades, 3 mediums, 14 subjects
5. ✅ Ready to build US-001 (Upload PDF) with normalized schema!
