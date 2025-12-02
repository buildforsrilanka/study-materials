# User Story: Student Filter Materials

**Story ID**: US-006
**Priority**: High
**Effort**: Medium

## User Story

**As a** student
**I want to** filter materials by grade, medium, and subject
**So that** I can quickly find relevant content for my needs

## Acceptance Criteria

- [ ] Filter bar/panel visible on browse page
- [ ] Grade filter dropdown with options 1-13 + University
- [ ] Medium filter dropdown with options: Sinhala, Tamil, English
- [ ] Subject filter dropdown populated from subjects table
- [ ] Filters can be applied individually or combined
- [ ] Materials update in real-time as filters change
- [ ] "Clear Filters" or "Reset" button available
- [ ] Selected filter values persist during session
- [ ] Filter counts/badges show number of active filters
- [ ] Empty state shown if no materials match filters

## Technical Notes

- Implement FilterBar component with controlled inputs
- Build dynamic query based on active filters
- Use Supabase query filters (.eq(), .in())
- Handle multiple filter combinations efficiently
- Consider URL query params for shareable filtered views
- Debounce filter changes if needed for performance
- Fetch subjects list for dropdown options

## Filter Combinations Example

- Grade 10 + English Medium
- Grade 14 (University) + Physics Subject
- Tamil Medium only
- All filters active

## Related Stories

- US-005: Student - Browse Materials
- US-004: Creator - Create New Subject
