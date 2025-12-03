# US-010: Pagination for Material Lists

## Description
As a student or creator, I want to view materials in a paginated list so that I can easily navigate through a large number of materials without overwhelming the page.

## Acceptance Criteria
- [ ] The material list should display a maximum of 10 items per page.
- [ ] Pagination controls (Previous, Next, Page Numbers) should be visible at the bottom of the list.
- [ ] Clicking "Next" should load the next set of materials.
- [ ] Clicking "Previous" should load the previous set of materials.
- [ ] Clicking a page number should load that specific page.
- [ ] The URL should reflect the current page number (e.g., `?page=2`).
- [ ] If there are no more materials, the "Next" button should be disabled.
- [ ] If on the first page, the "Previous" button should be disabled.
- [ ] Pagination should work with existing filters (Grade, Medium, Subject, Type).

## Technical Notes
- Update `getMaterials` in `lib/actions/materials.ts` to support pagination (limit/offset).
- Update `MaterialsList` to handle `page` search param.
- Create a reusable `Pagination` component or use Shadcn UI pagination if available.
- Ensure total count is fetched to calculate total pages.
