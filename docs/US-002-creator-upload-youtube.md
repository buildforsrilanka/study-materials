# User Story: Creator Upload YouTube Video

**Story ID**: US-002
**Priority**: High
**Effort**: Medium

## User Story

**As a** creator
**I want to** upload YouTube video links as learning materials
**So that** students can access video-based educational content

## Acceptance Criteria

- [ ] Creator can toggle material type to "YouTube" in upload form
- [ ] Form includes required fields: title, description, YouTube URL
- [ ] Form includes dropdowns for: grade (1-14), medium (Sinhala/Tamil/English), subject
- [ ] YouTube URL is validated (supports youtube.com and youtu.be formats)
- [ ] Material displays with play icon after successful upload
- [ ] Success message shown after upload
- [ ] Form resets or redirects after successful submission
- [ ] Error messages display for invalid YouTube URLs

## Technical Notes

- Validate both youtube.com and youtu.be URL formats
- Store material with type='youtube' in materials table
- Link to creator_id (authenticated user)
- Extract video ID if needed for embedding/display

## Related Stories

- US-004: Creator - Create New Subject
- US-003: Creator - View and Manage Materials
