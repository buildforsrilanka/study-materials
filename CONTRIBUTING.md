# Contributing to Study Materials Platform

Thank you for your interest in contributing to Study Materials Platform! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Code Quality](#code-quality)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) when contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/study-materials.git
   cd study-materials
   ```
3. **Add upstream** remote to keep in sync:
   ```bash
   git remote add upstream https://github.com/buildforsrilanka/study-materials.git
   ```

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Making Changes

### Create a Feature Branch

1. Update your local repository:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. Create a new feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

   Use the branch naming convention:
   - `feat/feature-name` for new features
   - `fix/bug-description` for bug fixes
   - `docs/description` for documentation changes
   - `refactor/description` for refactoring
   - `perf/optimization-name` for performance improvements

### Development Guidelines

#### Code Style

- Follow the existing code style and patterns in the project
- Use TypeScript for type safety
- Keep components small and focused
- Use meaningful variable and function names

#### File Organization

```
components/
├── [Feature]/
│   ├── [Component].tsx       # Main component
│   ├── [Component].types.ts  # Type definitions
│   └── index.ts              # Exports
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useMaterials.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Functions**: camelCase (e.g., `formatDate()`)
- **Types/Interfaces**: PascalCase (e.g., `UserRole`)

### Testing

Before submitting your changes:

1. Run linting:
   ```bash
   npm run lint
   npm run lint:fix
   ```

2. Check formatting:
   ```bash
   npm run format:check
   npm run format
   ```

3. Type check:
   ```bash
   npm run type-check
   ```

## Commit Guidelines

We follow a strict commit message format to maintain a clean project history. See [README.md - Git Commit Guidelines](README.md#git-commit-guidelines) for detailed information.

### Commit Message Rules

1. **Type**: Use one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `release`, `deps`
2. **Scope**: Optional but recommended - the area of the codebase affected
3. **Subject**: Brief description (imperative mood, lowercase)
4. **Length**: First line max 72 characters
5. **Ticket ID**: Optional - add Jira/GitHub issue IDs in square brackets

### Examples

✅ **Good**:
```
feat(auth): add password reset functionality [PROJ-123]
fix(pdf-viewer): resolve loading issues on mobile
docs(readme): update installation instructions
refactor(materials-api): simplify database queries
```

❌ **Bad**:
```
fixed bug
Updated code
work in progress
changes
```

## Code Quality Standards

### TypeScript

- Enable strict mode (already configured)
- Use explicit return types for functions
- Avoid `any` types
- Use union types instead of overloads when appropriate

### React Components

- Use functional components with hooks
- Keep components under 200 lines when possible
- Extract complex logic into custom hooks
- Use meaningful prop names

### Documentation

- Add JSDoc comments for complex functions:
  ```typescript
  /**
   * Fetches materials from the database
   * @param userId - The user ID to fetch materials for
   * @param limit - Maximum number of materials to fetch
   * @returns Promise<Material[]> - Array of materials
   */
  async function fetchUserMaterials(userId: string, limit: number) {
    // implementation
  }
  ```

- Keep README files up to date
- Document breaking changes clearly

## Submitting Changes

### Before You Submit

1. Ensure all tests pass:
   ```bash
   npm run lint
   npm run format:check
   npm run type-check
   ```

2. Rebase on the latest upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

3. Test your changes thoroughly in the development environment

### Creating a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

2. Create a Pull Request on GitHub with:
   - Clear, descriptive title
   - Reference to related issues: `Closes #123`
   - Summary of changes
   - Screenshots (if UI changes)
   - Testing performed

3. Fill out the PR template completely

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Aim for 250-400 lines of changes per PR
- Request review from maintainers
- Be responsive to feedback and review comments
- Keep the PR updated with the latest main branch

## Reporting Issues

### Bug Reports

Include:
- Clear, descriptive title
- Environment details (OS, Node version, browser)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/error messages if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach (if any)
- Related issues or discussions

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Review Process

1. **Initial Review**: Maintainers review for:
   - Adherence to guidelines
   - Code quality
   - Test coverage
   - Documentation

2. **Feedback**: Reviewers may request changes

3. **Approval**: Once approved, PR will be merged

4. **Merge**: Squash commits to single commit before merging

## Questions?

- Check existing [issues](https://github.com/buildforsrilanka/study-materials/issues)
- Open a [discussion](https://github.com/buildforsrilanka/study-materials/discussions)
- Contact maintainers

## Recognition

All contributors will be recognized in the project. Thank you for helping make Study Materials Platform better! 🎉

---

**Happy contributing!**
