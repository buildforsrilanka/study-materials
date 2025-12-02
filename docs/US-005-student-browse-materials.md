# User Story: Student Browse Materials

**Story ID**: US-005
**Priority**: High
**Effort**: Medium

## User Story

**As a** student
**I want to** browse all available learning materials
**So that** I can discover and access educational content

## Acceptance Criteria

- [ ] Student can access browse/materials page
- [ ] Latest materials displayed by default (sorted by upload date DESC)
- [ ] Each material shown as a card with:
  - Type icon (document for PDF, play button for YouTube)
  - Title
  - Description (short version if long)
  - Grade level badge
  - Medium badge
  - Subject badge
- [ ] Cards are responsive (grid layout on desktop, stack on mobile)
- [ ] Materials are clickable to open/view
- [ ] Loading state shown while fetching materials
- [ ] Empty state shown if no materials available
- [ ] All materials visible regardless of creator

## Technical Notes

- Query all materials from materials table (SELECT public via RLS)
- Join with subjects table to get subject name
- Order by created_at DESC
- Implement MaterialCard component for consistent display
- Consider pagination or infinite scroll for large datasets
- Use Next.js Image component for icons

## Related Stories

- US-006: Student - Filter Materials
- US-007: Student - View PDF Materials
- US-008: Student - View YouTube Materials
