# User Story: User Authentication

**Story ID**: US-009
**Priority**: Low (Implement Last)
**Effort**: Medium

## User Story

**As a** user
**I want to** register and login with my email and password
**So that** I can access role-specific features (creator or student)

## Acceptance Criteria

### Registration
- [ ] Registration page with email, password, full name fields
- [ ] Role selection: Creator or Student (required)
- [ ] Email validation (proper format)
- [ ] Password strength requirements (min 6-8 characters)
- [ ] Success redirect based on role:
  - Creator → Creator dashboard
  - Student → Browse materials page
- [ ] Error messages for invalid inputs or existing email
- [ ] Profile created in profiles table with selected role

### Login
- [ ] Login page with email and password fields
- [ ] Successful login redirects based on user role
- [ ] Error message for invalid credentials
- [ ] Session persists across page refreshes
- [ ] "Remember me" option (optional)

### Logout
- [ ] Logout button in navbar/header
- [ ] Clears session and redirects to landing/login page
- [ ] Confirmation dialog (optional)

### Protected Routes
- [ ] Creator routes require authentication + creator role
- [ ] Unauthenticated users redirected to login
- [ ] Wrong role users redirected or shown error
- [ ] Server-side auth checks on all protected pages

## Technical Notes

- Use Supabase Auth for authentication
- JWT-based session with HTTP-only cookies
- Create profile record on registration (trigger or server action)
- Implement middleware or layout-level auth checks
- Store role in profiles table, not auth.users
- Use server components for auth checks where possible
- Implement useAuth hook for client-side auth state
- RLS policies enforce creator_id matches auth.uid()

## Security Considerations

- Hash passwords (handled by Supabase)
- Validate role on server-side, never trust client
- Implement CSRF protection
- Rate limit auth endpoints
- Secure session management
- Email verification (optional but recommended)

## Implementation Order (Within Auth Story)

1. Supabase setup (already done)
2. Registration form + profile creation
3. Login form + session handling
4. Protected route middleware/guards
5. Logout functionality
6. Role-based redirects

## Related Stories

- All other stories depend on auth for creator/student distinction
- Can be mocked initially with hardcoded roles for development
