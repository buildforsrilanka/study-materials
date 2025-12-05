# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 learning platform (study-materials) that connects educators (creators) with students. Creators upload PDFs (via Google Drive) and YouTube videos, while students browse and filter content by grade, language medium, and subject.

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth)
- **External Storage**: Google Drive (PDFs), YouTube (videos)

## Development Commands

```bash
# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture

### Vertical Slicing Principle

**CRITICAL**: This project follows vertical slicing architecture. Always implement features as complete vertical slices from UI to database.

**What this means:**
- Build one complete feature at a time (UI → API/Server Actions → Database)
- Each user story should be implemented as a full vertical slice
- Avoid building all database models first, then all APIs, then all UI (horizontal slicing)
- Each slice should deliver working, testable functionality

**Example**: For "Upload PDF Material" (US-001):
1. Create upload form UI component
2. Create server action to handle form submission
3. Add database insert logic in same iteration
4. Test the complete flow end-to-end
5. Move to next feature

**Do NOT:**
- Build all database schemas/types first
- Build all API routes before any UI
- Create "infrastructure" layers before features

See [docs/VERTICAL-SLICING-GUIDE.md](./docs/VERTICAL-SLICING-GUIDE.md) for implementation examples.

### Application Structure

The app uses Next.js App Router with route groups for role-based access:

- `app/(auth)/` - Login and registration pages
- `app/(creator)/` - Creator dashboard and upload pages (protected)
- `app/(student)/` - Student browse page
- `app/` - Root layout and landing page

### Key Directories

- `components/ui/` - shadcn/ui components
- `components/shared/` - Navbar, PDFViewer
- `components/creator/` - UploadForm, MaterialsList
- `components/student/` - BrowseMaterials, FilterBar, MaterialCard
- `lib/supabase/` - Supabase client (browser/server)
- `lib/` - Utilities and constants (grades, mediums)
- `types/` - Database TypeScript types

### User Roles

1. **Creator**: Upload materials, manage subjects, delete own content
2. **Student**: Browse materials, filter by grade/medium/subject, view content

### Database Schema (Supabase)

**profiles** - User profiles extending auth.users
- id, email, full_name, role (creator/student)

**subjects** - Learning subjects (Math, Science, etc.)
- id, name (unique)
- Pre-populated with 14+ default subjects
- Creators can add new subjects

**materials** - Learning content
- id, creator_id, title, description, type (pdf/youtube), url
- subject_id, grade (1-14, where 14=University), medium (sinhala/tamil/english)
- Indexed on: creator_id, subject_id, grade, medium, created_at

### Row Level Security (RLS)

- **profiles**: SELECT public, UPDATE own only
- **subjects**: SELECT public, INSERT creators only
- **materials**: SELECT public, INSERT/UPDATE/DELETE creators for own materials only

## Important Implementation Details

### Material Types

- **PDF**: Google Drive shareable links, viewed in built-in PDF viewer (react-pdf)
- **YouTube**: YouTube URLs (youtube.com or youtu.be), opens in YouTube app/browser

### Grade System

Grades 1-13 represent school levels, Grade 14 represents University level.

### Medium (Language)

Three supported languages: Sinhala, Tamil, English. Each material must specify one.

### Authentication Flow

- Registration requires role selection (creator/student)
- Protected routes check user role server-side
- Supabase Auth handles JWT sessions with HTTP-only cookies

### URL Validation

- Google Drive URLs validated for PDF materials
- YouTube URLs validated for video materials
- Both formats must be shareable/public

### Path Aliases

Uses `@/*` to reference root directory (configured in tsconfig.json).

## UI Component Library

Use shadcn/ui for all UI components. Required components:
- alert, button, card, dialog, input, label, select, textarea, tabs

Install new components with:
```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Code Standards

- Use TypeScript for all files
- Follow Next.js 16 App Router conventions
- Server components by default, use 'use client' only when needed
- Implement proper loading and error states
- Validate inputs client-side and server-side
- Use Supabase RLS for authorization (never trust client)
- **Always use vertical slicing**: Implement complete features end-to-end, one at a time

## Security Considerations

- Never bypass RLS policies
- Validate all URLs (Google Drive, YouTube)
- Sanitize user inputs
- Use environment variables for sensitive data
- Implement server-side auth checks on protected routes
- Enforce creator_id matches authenticated user when creating materials
