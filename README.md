# Study Materials Platform

A comprehensive platform for educators to upload and share study materials (PDFs and YouTube videos) and for students to discover, filter, and access these resources with advanced search and pagination capabilities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Git Commit Guidelines](#git-commit-guidelines)
- [Contributing](#contributing)

## Features

### For Creators
- Upload PDF and YouTube video materials
- Create and manage subjects
- Organize materials by category
- Edit and delete materials
- Track uploaded content

### For Students
- Browse materials by subject and type
- Advanced filtering capabilities
- Full-text search functionality
- Responsive pagination
- View PDF content directly in browser
- Stream YouTube videos

### General
- User authentication and authorization
- Role-based access control (Creator/Student)
- Intuitive user interface
- Fast and responsive design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Handling**: PDF.js
- **Styling**: Radix UI, shadcn/ui
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/buildforsrilanka/study-materials.git
cd study-materials
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
study-materials/
├── app/                          # Next.js app directory
│   ├── (creator)/               # Creator routes
│   ├── (student)/               # Student routes
│   ├── actions/                 # Server actions
│   ├── api/                     # API routes
│   ├── auth/                    # Authentication routes
│   └── login, signup/           # Auth pages
├── components/                   # React components
│   ├── creator/                 # Creator-specific components
│   ├── student/                 # Student-specific components
│   └── ui/                      # UI components
├── lib/                         # Utility functions and helpers
│   ├── actions/                 # Server actions
│   ├── constants.ts             # Constants
│   ├── utils.ts                 # Utility functions
│   └── supabase/                # Supabase configuration
├── types/                       # TypeScript type definitions
├── public/                      # Static assets
├── docs/                        # Documentation
└── middleware.ts                # Next.js middleware
```

## Git Commit Guidelines

We maintain very precise rules for git commit messages to ensure readable history and facilitate changelog generation. Please follow these guidelines for all commits.

### Commit Message Format

Each commit message consists of a **type**, a **scope** (optional), **subject**, and optionally one or more **Jira ticket IDs**:

```
<type>(<scope>): <subject> <ticket id(s)>
```

**Line Length**: Any line of the commit message should preferably not exceed 72 characters. This ensures readability on GitHub and in various git tools.

#### Valid Example

```
feat(auth): add two-factor authentication support [PROJ-123] [PROJ-456]
```

### Commit Type

Must be one of the following:

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing or correcting existing tests |
| `chore` | Changes to the build process or auxiliary tools and libraries such as documentation generation |
| `build` | Changes that affect the build system or external dependencies |
| `ci` | Changes to CI configuration files and scripts |
| `release` | Commit that signifies a new version release |
| `deps` | Updates to dependencies (adds, updates, or removes) |

### Scope (Optional)

The scope specifies the nature of the change. For this project, examples include:

- **Frontend**: `auth`, `navigation`, `modal`, `upload-form`, `filter-sidebar`, `pdf-viewer`
- **Backend**: `api`, `database`, `auth-routes`, `materials-api`
- **Infrastructure**: `docker`, `config`, `build`, `ci`

**Valid Characters**: Alphanumeric (a-zA-Z0-9), dashes (-), and underscores (_)

**When to Omit**: You can ignore the scope when the change affects more than a single scope.

### Breaking Changes

Append an exclamation mark (`!`) after the type/scope to indicate a breaking API change (correlating with MAJOR in semantic versioning):

```
feat(api)!: redesign authentication endpoint [PROJ-789]
```

### Revert Commits

If the commit reverts a previous commit, it should begin with `revert:` followed by the header of the reverted commit:

```
revert: feat(auth): add two-factor authentication [PROJ-123]

This reverts commit abc1234567890def.
```

In the commit body, include: `These reverts commit <hash>.`, where hash is the SHA of the commit being reverted.

### Commit Examples

**Good Examples**:
```
feat(materials-upload): add PDF validation and compression
fix(pdf-viewer): resolve loading issues on mobile devices [PROJ-234]
docs(readme): update installation instructions
refactor(filter-sidebar): simplify state management logic
perf(search): optimize database queries for full-text search [PROJ-567]
test(authentication): add unit tests for login flow
chore(deps): update dependencies to latest versions
ci: configure GitHub Actions for automated testing
```

**Poor Examples** (❌):
```
fixed bug
Updated code
work in progress
changes
made updates to files
```

## Contributing

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes following the [Git Commit Guidelines](#git-commit-guidelines)

3. Push your branch:
   ```bash
   git push origin feat/your-feature-name
   ```

4. Create a Pull Request with a clear description of your changes

## Code Quality

- Use ESLint for code quality checks:
  ```bash
  npm run lint
  ```

- Format code consistently using Prettier

- Write meaningful commit messages following our guidelines

## Documentation

Additional documentation can be found in the `/docs` folder:

- [Requirements](docs/REQUIREMENTS.md)
- [User Stories](docs/USER-STORIES-INDEX.md)
- [Vertical Slicing Guide](docs/VERTICAL-SLICING-GUIDE.md)
- [Setup Instructions](SETUP-INSTRUCTIONS.md)
- [Database Structure](DATABASE-STRUCTURE.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Last Updated**: December 5, 2025
