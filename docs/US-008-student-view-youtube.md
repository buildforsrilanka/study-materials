# User Story: Student View YouTube Materials

**Story ID**: US-008
**Priority**: High
**Effort**: Small

## User Story

**As a** student
**I want to** watch YouTube videos
**So that** I can learn from video-based educational content

## Acceptance Criteria

- [ ] Clicking YouTube material card opens video
- [ ] On mobile: Opens in YouTube app (if installed) or browser
- [ ] On desktop: Opens in new browser tab
- [ ] Direct link to YouTube video (not embedded)
- [ ] Video URL is correctly formatted and valid
- [ ] Fallback handling if video is unavailable/deleted
- [ ] Play icon clearly indicates YouTube content

## Technical Notes

- Use window.open() or link with target="_blank" for external navigation
- YouTube URL format: https://youtube.com/watch?v={VIDEO_ID}
- Handle both youtube.com and youtu.be formats
- Extract video ID if stored separately
- No need for embedded player (external viewing)
- Consider adding rel="noopener noreferrer" for security

## Alternative Approach (Future)

- Option to embed YouTube player in modal for in-app viewing
- Would require YouTube IFrame API

## Related Stories

- US-002: Creator - Upload YouTube Video
- US-005: Student - Browse Materials
