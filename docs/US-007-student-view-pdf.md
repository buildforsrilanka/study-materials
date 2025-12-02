# User Story: Student View PDF Materials

**Story ID**: US-007
**Priority**: High
**Effort**: Medium

## User Story

**As a** student
**I want to** view PDF materials in an in-app viewer
**So that** I can read documents without leaving the platform

## Acceptance Criteria

- [ ] Clicking PDF material card opens built-in PDF viewer
- [ ] PDF loads from Google Drive URL
- [ ] Viewer displays PDF content clearly
- [ ] Navigation controls available (next/previous page, page number)
- [ ] Zoom controls available (zoom in/out/fit)
- [ ] Full-screen viewing option
- [ ] Close/Back button to return to browse page
- [ ] Loading indicator while PDF loads
- [ ] Error message if PDF fails to load
- [ ] Viewer is responsive (works on mobile, tablet, desktop)

## Technical Notes

- Use react-pdf library for PDF rendering
- Handle Google Drive URL format (may need conversion for direct access)
- Implement PDFViewer component in components/shared/
- Consider using modal/dialog or separate route for viewer
- Handle large PDF files (lazy loading pages)
- Test with various Google Drive sharing link formats
- Fallback option to open in new tab if viewer fails

## Google Drive URL Handling

- Google Drive shareable links need conversion for embedding
- Format: `https://drive.google.com/file/d/{FILE_ID}/view`
- May need to use: `https://drive.google.com/uc?export=view&id={FILE_ID}`

## Related Stories

- US-001: Creator - Upload PDF Material
- US-005: Student - Browse Materials
