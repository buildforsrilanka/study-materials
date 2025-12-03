# US-011: Search Materials by Title

## Description
As a student, I want to search for study materials by their title so that I can quickly find specific resources I am looking for.

## Acceptance Criteria
1.  **Search Input**: A search input field should be available on the student browse page.
2.  **Real-time/Debounced Search**: The search should trigger automatically after a short delay (debounce) or upon pressing Enter.
3.  **URL Sync**: The search query should be reflected in the URL query parameters (e.g., `?search=math`).
4.  **Filtering**: The material list should update to show only materials whose titles match the search query (case-insensitive partial match).
5.  **Pagination Reset**: When a new search is performed, the pagination should reset to page 1.
6.  **Empty State**: If no materials match the search query, a "No materials found" message should be displayed.

## Technical Notes
-   **Component**: Create a new `SearchInput` client component that manages the URL search params.
-   **Server Action**: Update `getMaterials` in `lib/actions/materials.ts` to accept a `search` or `query` parameter and apply an `ilike` filter on the `title` column.
-   **Debounce**: Use a debounce hook or utility to prevent excessive server requests while typing.
