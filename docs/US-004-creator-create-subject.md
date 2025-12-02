# User Story: Creator Create New Subject

**Story ID**: US-004
**Priority**: Medium
**Effort**: Small

## User Story

**As a** creator
**I want to** create new subjects while uploading materials
**So that** I can categorize content that doesn't fit existing subjects

## Acceptance Criteria

- [ ] Subject dropdown shows existing subjects from database
- [ ] "Create New Subject" or "Add Subject" option available in dropdown/form
- [ ] Clicking option opens input field or modal for new subject name
- [ ] Subject name is validated (non-empty, unique)
- [ ] New subject is saved to subjects table
- [ ] New subject immediately appears in dropdown after creation
- [ ] Success feedback shown when subject created
- [ ] Creator can continue with material upload after creating subject
- [ ] Error message if subject name already exists

## Technical Notes

- Pre-populate subjects table with default subjects (Math, Science, etc.)
- Validate uniqueness in subjects table (name column is unique)
- New subjects are shared across all creators
- Implement RLS: only creators can insert subjects
- Consider inline creation vs modal dialog approach

## Default Subjects

Mathematics, Science, English, Sinhala, Tamil, History, Geography, ICT, Physics, Chemistry, Biology, Business Studies, Economics, Accounting

## Related Stories

- US-001: Creator - Upload PDF Material
- US-002: Creator - Upload YouTube Video
