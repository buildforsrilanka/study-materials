# Vertical Slicing Architecture Guide

## Overview

This project **mandatorily follows vertical slicing architecture**. Every feature must be implemented as a complete vertical slice from UI to database before moving to the next feature.

## What is Vertical Slicing?

**Vertical Slicing**: Building complete features end-to-end, delivering working functionality with each slice.

**Horizontal Slicing** (❌ DO NOT USE): Building one layer completely before moving to the next (e.g., all database models → all APIs → all UI).

## Why Vertical Slicing?

✅ Delivers working features incrementally
✅ Enables early testing of complete flows
✅ Reduces integration issues
✅ Provides faster user feedback
✅ Easier to change direction if needed
✅ Each commit/PR contains working functionality

## Vertical Slice Structure

Each vertical slice includes ALL layers:

```
┌─────────────────────────────────────┐
│   UI Layer (Components)             │ ← User Interface
├─────────────────────────────────────┤
│   API Layer (Server Actions/Routes) │ ← Business Logic
├─────────────────────────────────────┤
│   Database Layer (Supabase Queries) │ ← Data Persistence
└─────────────────────────────────────┘
```

## Implementation Example: Upload PDF Material (US-001)

### ❌ WRONG: Horizontal Approach

```
Day 1-2: Create ALL database schemas (materials, subjects, profiles)
Day 3-4: Create ALL server actions (upload, delete, list, filter)
Day 5-6: Create ALL UI components (forms, cards, lists)
Day 7-8: Wire everything together and debug integration issues
```

**Problems**: Nothing works until day 7, integration issues discovered late, can't test feature until everything is built.

### ✅ CORRECT: Vertical Approach

```
Day 1-3: Complete Upload PDF Feature (US-001)
  ├─ Create upload form UI (UploadForm.tsx)
  ├─ Create server action for PDF upload
  ├─ Add materials table (only needed columns)
  ├─ Add subjects table (minimal for dropdown)
  └─ Test complete flow: form → server → database → success

Day 4-5: Complete Browse Materials (US-005)
  ├─ Create browse page UI
  ├─ Create MaterialCard component
  ├─ Add server action to fetch materials
  ├─ Query materials table with subjects join
  └─ Test: materials display correctly

Day 6-7: Complete Filter Materials (US-006)
  ├─ Add FilterBar component
  ├─ Extend server action with filter params
  ├─ Add database indexes for filtering
  └─ Test: filters work on browse page
```

**Benefits**: Working upload feature after day 3, can get feedback early, each day produces testable functionality.

## Implementation Steps for Each Vertical Slice

### Step 1: Start with UI (Top Layer)

Create the user-facing component first:

```typescript
// Example: components/creator/UploadForm.tsx
'use client';

export function UploadForm() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Call server action (create next)
    await uploadPdfMaterial({ title, url, ... });
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Step 2: Create Server Action (Middle Layer)

Add the business logic that the UI calls:

```typescript
// Example: app/actions/materials.ts
'use server';

export async function uploadPdfMaterial(data: UploadData) {
  // Validate inputs
  if (!isValidGoogleDriveUrl(data.url)) {
    return { error: 'Invalid URL' };
  }

  // Call database layer (create next)
  const result = await insertMaterial(data);

  return result;
}
```

### Step 3: Add Database Logic (Bottom Layer)

Implement the data persistence:

```typescript
// Example: lib/supabase/materials.ts
import { createClient } from './server';

export async function insertMaterial(data: MaterialData) {
  const supabase = createClient();

  const { data: material, error } = await supabase
    .from('materials')
    .insert({
      title: data.title,
      url: data.url,
      type: 'pdf',
      // ... other fields
    })
    .select()
    .single();

  if (error) throw error;
  return material;
}
```

### Step 4: Test Complete Flow

Test the entire vertical slice:

1. Open UI in browser
2. Fill form with test data
3. Submit form
4. Verify server action executes
5. Check database has new record
6. Verify success feedback in UI

### Step 5: Move to Next Vertical Slice

Only after the current slice is fully working, move to the next feature.

## Practical Guidelines

### DO ✅

- Implement one user story completely before starting another
- Create only the database columns needed for current feature
- Add indexes when feature needs them (not preemptively)
- Test each vertical slice independently
- Commit working features (complete slices)
- Use feature branches for each vertical slice

### DON'T ❌

- Create all database tables/types upfront
- Build all components before connecting to data
- Write infrastructure code "for future use"
- Implement features partially across multiple slices
- Create elaborate abstractions before understanding needs
- Build "reusable" code before using it twice

## User Story → Vertical Slice Mapping

Each user story should map to one vertical slice:

| User Story | Vertical Slice Includes |
|---|---|
| US-001: Upload PDF | Form UI + Server Action + DB Insert + Validation |
| US-002: Upload YouTube | Form UI + Server Action + DB Insert + URL Validation |
| US-003: Manage Materials | Dashboard UI + List Component + Query Action + Delete Action |
| US-005: Browse Materials | Browse UI + MaterialCard + Fetch Action + DB Query |
| US-006: Filter Materials | FilterBar UI + Filter Logic + Extended Query |
| US-007: View PDF | PDF Viewer UI + Google Drive URL handling |
| US-008: View YouTube | YouTube Link Handler + URL formatting |
| US-004: Create Subject | Subject Form + Create Action + DB Insert |

## Development Workflow

### For Each Vertical Slice:

```bash
# 1. Create feature branch
git checkout -b feature/us-001-upload-pdf

# 2. Implement UI layer
# Create component file, implement form, basic styling

# 3. Implement API layer
# Create server action, add validation

# 4. Implement database layer
# Create table (if needed), add query function

# 5. Wire everything together
# Connect UI → API → Database

# 6. Test complete flow
npm run dev
# Manual testing of feature

# 7. Commit working feature
git add .
git commit -m "feat: implement upload PDF material (US-001)

- Add upload form component
- Create server action for PDF upload
- Add materials table with required fields
- Validate Google Drive URLs
- Complete end-to-end flow tested"

# 8. Move to next vertical slice
git checkout -b feature/us-005-browse-materials
```

## Common Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Database-First Development

```
DON'T: Create all tables and types first
├─ materials table (all fields)
├─ subjects table (all fields)
├─ profiles table (all fields)
└─ Complete type definitions

DO: Create table when feature needs it
├─ Start US-001 (Upload PDF)
├─ Create materials table (only fields for upload)
├─ Complete and test US-001
├─ Start US-005 (Browse)
├─ Add materials query
└─ Complete and test US-005
```

### ❌ Anti-Pattern 2: API-First Development

```
DON'T: Create all server actions upfront
├─ uploadMaterial()
├─ deleteMaterial()
├─ listMaterials()
├─ filterMaterials()
└─ Then build UI later

DO: Create action when UI needs it
├─ Build upload form (US-001)
├─ Create uploadMaterial() action
├─ Test upload feature
├─ Build browse UI (US-005)
├─ Create listMaterials() action
└─ Test browse feature
```

### ❌ Anti-Pattern 3: Component Library First

```
DON'T: Build all components first
├─ MaterialCard.tsx (generic)
├─ FilterBar.tsx (all filters)
├─ UploadForm.tsx (both types)
└─ Then connect to data

DO: Build component when feature needs it
├─ Build upload form for US-001
├─ Make it work with real data
├─ Build MaterialCard for US-005
├─ Test with real materials
├─ Build FilterBar for US-006
└─ Connect to working browse page
```

## Summary

**Remember**: Every feature should go through ALL layers (UI → API → Database) before moving to the next feature. This is not optional - it's how this project must be built.

**When starting any new feature, ask:**
1. What UI does the user see?
2. What action does the UI trigger?
3. What data needs to be persisted?
4. Can I test this end-to-end right now?

If you can't answer all four, you're building horizontally. Stop and build vertically.
