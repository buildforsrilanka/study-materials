# User Story: Creator Manage Materials

**Story ID**: US-003
**Priority**: High
**Effort**: Small

## User Story

**As a** creator
**I want to** view all my uploaded materials and delete them if needed
**So that** I can manage my content library

## Acceptance Criteria

- [ ] Creator can access a dashboard showing all their uploaded materials
- [ ] Each material displays: type icon (PDF/YouTube), title, description
- [ ] Each material shows metadata: grade, medium, subject, upload date
- [ ] Materials are sorted by upload date (latest first)
- [ ] Delete button/icon available for each material
- [ ] Confirmation dialog shown before deletion
- [ ] Material removed from list after successful deletion
- [ ] Creator can only see and delete their own materials (not others')
- [ ] Quick access link to upload new materials

## Technical Notes

- Query materials table filtered by creator_id
- Implement RLS policy: creators can only delete their own materials
- Order by created_at DESC
- Show appropriate icon based on material type
- Handle empty state (no materials yet)

## Related Stories

- US-001: Creator - Upload PDF Material
- US-002: Creator - Upload YouTube Video
