# User Story: Creator Upload PDF Material

**Story ID**: US-001
**Priority**: High
**Effort**: Medium

## User Story

**As a** creator
**I want to** upload PDF learning materials via Google Drive links
**So that** students can access educational documents

## Acceptance Criteria

- [ ] Creator can access upload form with material type selector
- [ ] Form includes required fields: title, description, Google Drive URL
- [ ] Form includes dropdowns for: grade (1-14), medium (Sinhala/Tamil/English), subject
- [ ] Google Drive URL is validated to ensure it's a valid shareable link
- [ ] Material displays with document icon after successful upload
- [ ] Success message shown after upload
- [ ] Form resets or redirects after successful submission
- [ ] Error messages display for invalid inputs or failed uploads

## Technical Notes

- Validate Google Drive URL format on client and server
- Store material with type='pdf' in materials table
- Link to creator_id (authenticated user)
- URL should be public/shareable Google Drive link
- Grade 14 represents University level

## Related Stories

- US-004: Creator - Create New Subject
- US-003: Creator - View and Manage Materials
