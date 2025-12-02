# User Stories Index

This document provides an overview of all user stories for the Learning Platform project.

## Priority Legend

- **Critical**: Must complete before anything else (foundational setup)
- **High**: Core functionality, implement first
- **Medium**: Important but can be developed after high priority items
- **Low**: Can be implemented last

## User Stories Overview

### Critical Priority (Setup - Must Complete First)

| ID | Story | Role | Effort | File |
|---|---|---|---|---|
| US-000 | Project Setup (shadcn + Supabase) | Developer | Small | [US-000-project-setup.md](./US-000-project-setup.md) |

### High Priority (Implement First)

| ID | Story | Role | Effort | File |
|---|---|---|---|---|
| US-001 | Upload PDF Material | Creator | Medium | [US-001-creator-upload-pdf.md](./US-001-creator-upload-pdf.md) |
| US-002 | Upload YouTube Video | Creator | Medium | [US-002-creator-upload-youtube.md](./US-002-creator-upload-youtube.md) |
| US-003 | View and Manage Materials | Creator | Small | [US-003-creator-manage-materials.md](./US-003-creator-manage-materials.md) |
| US-005 | Browse Materials | Student | Medium | [US-005-student-browse-materials.md](./US-005-student-browse-materials.md) |
| US-006 | Filter Materials | Student | Medium | [US-006-student-filter-materials.md](./US-006-student-filter-materials.md) |
| US-007 | View PDF Materials | Student | Medium | [US-007-student-view-pdf.md](./US-007-student-view-pdf.md) |
| US-008 | View YouTube Materials | Student | Small | [US-008-student-view-youtube.md](./US-008-student-view-youtube.md) |

### Medium Priority

| ID | Story | Role | Effort | File |
|---|---|---|---|---|
| US-004 | Create New Subject | Creator | Small | [US-004-creator-create-subject.md](./US-004-creator-create-subject.md) |

### Low Priority (Implement Last)

| ID | Story | Role | Effort | File |
|---|---|---|---|---|
| US-009 | Authentication System | All Users | Medium | [US-009-authentication.md](./US-009-authentication.md) |

## Development Approach

### Vertical Slicing Architecture

**CRITICAL**: This project uses vertical slicing. Implement each user story as a complete vertical slice (UI → API → Database) before moving to the next.

See [VERTICAL-SLICING-GUIDE.md](./VERTICAL-SLICING-GUIDE.md) for detailed implementation approach.

### Phase 0: Project Setup
**MUST COMPLETE FIRST** - Nothing can be built without this foundation.

**Story**: US-000 (Project Setup)

### Phase 1: Core Functionality (No Auth)
Focus on core features without authentication. Use hardcoded user IDs or mock auth for development.

**Build order (one complete vertical slice at a time)**:
1. US-001: Upload PDF (complete: form + action + database)
2. US-002: Upload YouTube (complete: form + action + database)
3. US-005: Browse Materials (complete: UI + fetch + database query)
4. US-006: Filter Materials (extend browse with filters)
5. US-007: View PDF (PDF viewer + Google Drive handling)
6. US-008: View YouTube (YouTube link handling)
7. US-003: Manage Materials (dashboard + list + delete)
8. US-004: Create Subject (form + action + database)

### Phase 2: Authentication
Implement full authentication system once core features are working.

**Stories**: US-009

## Story Dependencies

```
US-000 (Setup) ──> REQUIRED FOR ALL STORIES
                   │
                   ├──> US-001 (Upload PDF) ──┐
                   │                           ├──> US-003 (Manage Materials)
                   ├──> US-002 (Upload YT) ───┘
                   │
                   ├──> US-004 (Create Subject) ──> US-001, US-002 (used in upload forms)
                   │
                   ├──> US-005 (Browse) ──┐
                   │                       ├──> US-007 (View PDF)
                   │                       └──> US-008 (View YouTube)
                   │
                   ├──> US-006 (Filter) ──> US-005 (filters browse results)
                   │
                   └──> US-009 (Auth) ──> ALL (provides user context)
```

## Implementation Notes

### For Development Without Auth
- Use a hardcoded `creator_id` in upload forms
- Skip RLS policies initially or use service role key
- Mock user context in components
- Implement full auth (US-009) once core features are stable

### Database Setup Required Before Starting
**All covered in US-000 (Project Setup)**
- Create Supabase project
- Run database migrations (profiles, subjects, materials tables)
- Seed subjects table with default subjects
- Configure RLS policies (can be relaxed initially for development)
- Set up Supabase clients (browser/server)

### Testing Strategy
- Test each story independently
- Test story combinations (e.g., upload + browse)
- Test all filter combinations
- Test both material types (PDF + YouTube)
- Test responsive design for all stories
- Test error cases and edge cases

## Story Sizing

- **Small**: 1-2 days
- **Medium**: 3-5 days
- **Large**: 5+ days (none in current scope)

## Contact

For questions about user stories, refer to [REQUIREMENTS.md](./REQUIREMENTS.md) for detailed specifications.
