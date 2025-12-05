# Open Source Configuration Guide

## Overview

This document outlines all the essential configurations and settings that have been added to prepare the Study Materials Platform for open-source release on GitHub.

## 📋 Files Created & Updated

### 1. **Code Quality & Formatting**

#### `.prettierrc.json`
Prettier configuration for consistent code formatting across the project.

**Features:**
- 100-character print width
- 2-space indentation
- Single quotes for strings
- Trailing commas (ES5 compatible)
- Unix line endings (LF)

**Usage:**
```bash
npm run format          # Format all files
npm run format:check   # Check if files are formatted
```

#### `.prettierignore`
Specifies files/directories that Prettier should ignore.

#### `.editorconfig`
Ensures consistent code style across different editors and IDEs.

**Supported by:**
- VS Code (with extension)
- JetBrains IDEs
- Sublime Text
- Vim
- Emacs

### 2. **Git Hooks & Commit Validation**

#### `.husky/` directory
Git hooks setup using Husky framework.

**Included Hooks:**
- **pre-commit**: Runs linters and formatters before committing
- **commit-msg**: Validates commit message format
- **prepare-commit-msg**: Prepares commit message (optional hook)

#### `.lintstagedrc.json`
Configuration for lint-staged - runs linters only on staged files.

**Pipeline:**
```
Pre-commit Hook
  ↓
Lint Staged Files
  ↓
Fix Issues with ESLint
  ↓
Format with Prettier
  ↓
Type Check with TypeScript
```

### 3. **Project Metadata**

#### `package.json` (Updated)
Added essential project metadata:

```json
{
  "description": "A comprehensive platform for educators to upload and share study materials",
  "license": "MIT",
  "repository": { "type": "git", "url": "..." },
  "bugs": { "url": "..." },
  "homepage": "..."
}
```

**New Scripts:**
```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
  "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
  "type-check": "tsc --noEmit",
  "prepare": "husky install"
}
```

**New Dev Dependencies:**
- `husky` - Git hooks management
- `lint-staged` - Run linters on staged files
- `prettier` - Code formatter

### 4. **Environment Configuration**

#### `.env.example`
Template for environment variables. Copy this to `.env.local` for local development.

**Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Optional Variables:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

### 5. **Git Configuration**

#### `.gitignore` (Enhanced)
Comprehensive ignore patterns including:
- IDE configurations (.vscode, .idea)
- OS files (Thumbs.db, .DS_Store)
- Build and dependency artifacts
- Environment files
- Temporary and backup files
- Husky directories

### 6. **Documentation**

#### `README.md` (Enhanced)
- Project overview
- Features list
- Tech stack
- Getting started guide
- Project structure
- **Comprehensive Git Commit Guidelines**
- Contributing guidelines
- Code quality standards
- Support information

#### `CONTRIBUTING.md` (New)
Complete contribution guidelines including:
- Code of Conduct reference
- Development setup instructions
- Making changes workflow
- Code style guidelines
- Naming conventions
- File organization
- Testing requirements
- Commit guidelines with examples
- Pull request process
- Reporting issues

#### `CODE_OF_CONDUCT.md` (New)
Professional code of conduct based on Contributor Covenant:
- Community standards
- Inclusive behavior guidelines
- Unacceptable behavior definitions
- Enforcement mechanisms
- Attribution

#### `SECURITY.md` (New)
Security policy for vulnerability reporting:
- Vulnerability reporting email
- Information to include in reports
- Response timeline
- Security best practices
- Supported versions
- Dependencies information

#### `CHANGELOG.md` (New)
Tracks all notable changes following Keep a Changelog format:
- Unreleased changes
- Versioned releases
- Added/Changed/Deprecated/Removed/Fixed/Security sections

### 7. **Issue & PR Templates**

#### `.github/ISSUE_TEMPLATE/` directory

**Bug Report (YAML)**
- Structured bug report form
- OS/environment information
- Screenshots support
- Clear reproduction steps

**Feature Request (YAML)**
- Problem description
- Solution description
- Alternatives considered
- Affected components

**Setup Questions (YAML)**
- Setup-related questions
- Environment details
- Error message capture
- Troubleshooting checklist

#### `.github/PULL_REQUEST_TEMPLATE.md`
Professional PR template with:
- Change description
- Related issues
- Type of change
- Testing information
- Code quality checklist
- Breaking changes section

### 8. **CI/CD Pipeline**

#### `.github/workflows/ci.yml`
GitHub Actions workflow for continuous integration:

**Jobs:**
1. **Lint**: ESLint and format checking
2. **Type-Check**: TypeScript type validation
3. **Build**: Next.js build verification

**Triggers:**
- Push to main/develop branches
- Pull requests to main/develop

**Features:**
- Caching for faster builds
- Parallel job execution
- Build artifact upload

### 9. **Setup Scripts**

#### `scripts/setup.sh` (Unix/Mac/Linux)
Automated setup script that:
- Verifies Node.js version
- Installs dependencies
- Sets up Husky git hooks
- Provides next steps guidance

#### `scripts/setup.bat` (Windows)
Windows batch equivalent of setup script.

**Usage:**
```bash
# Unix/Mac/Linux
bash scripts/setup.sh

# Windows
scripts/setup.bat
```

## 🚀 Installation & Setup

### For Contributors

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/study-materials.git
   cd study-materials
   ```

3. **Run setup script:**
   ```bash
   # On Unix/Mac/Linux
   bash scripts/setup.sh
   
   # On Windows
   scripts/setup.bat
   ```

4. **Or manual setup:**
   ```bash
   npm install
   npm run prepare
   cp .env.example .env.local
   # Edit .env.local with your credentials
   npm run dev
   ```

### For Maintainers

All configurations are automatically enforced through:
- **Pre-commit hooks**: Run on every commit
- **PR template**: Guide contributors
- **CI/CD workflow**: Validates PRs
- **Issue templates**: Standardize issues

## ✅ Commit Workflow

### Making a Commit

1. Stage your changes:
   ```bash
   git add .
   ```

2. Commit (Husky will automatically):
   - Run ESLint and fix issues
   - Run Prettier and format code
   - Run TypeScript type checking
   - Validate commit message format

   ```bash
   git commit -m "feat(auth): add two-factor authentication"
   ```

3. If validation fails, fix issues and commit again

4. Push to your fork:
   ```bash
   git push origin feat/your-feature
   ```

5. Create Pull Request on GitHub

## 📋 Development Commands

```bash
# Development
npm run dev              # Start dev server

# Linting & Formatting
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint and fix issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes

# Type Checking
npm run type-check      # TypeScript type checking

# Build
npm run build           # Production build
npm run start           # Start production server

# Git Hooks
npm run prepare         # Setup Husky hooks
```

## 🔒 Enforced Standards

### Commit Messages
All commits must follow: `<type>(<scope>): <subject> [TICKET-ID]`

**Enforced at**: Pre-commit hook
**Validation**: `.husky/commit-msg`

### Code Formatting
- Lines max 100 characters
- 2-space indentation
- Unix line endings (LF)
- Trailing commas (ES5 compatible)

**Enforced at**: Pre-commit hook
**Configuration**: `.prettierrc.json`

### Code Linting
- TypeScript strict mode enabled
- ESLint with Next.js config
- Import sorting
- Unused variable detection

**Enforced at**: Pre-commit hook & CI/CD
**Configuration**: `eslint.config.mjs`

### Type Safety
- Full TypeScript compilation
- No implicit `any` types
- Strict null checks

**Enforced at**: Pre-commit hook & CI/CD
**Configuration**: `tsconfig.json`

## 📊 CI/CD Pipeline Status

Pull requests are automatically checked for:
- ✅ ESLint compliance
- ✅ Prettier formatting
- ✅ TypeScript types
- ✅ Successful build

All checks must pass before merging.

## 🛠️ Troubleshooting

### Husky hooks not running?

```bash
npm run prepare
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Commit message validation failing?

Ensure your message follows the format:
```
<type>(<scope>): <subject>

Valid types: feat, fix, docs, style, refactor, perf, test, chore, build, ci, release, deps
```

### Prettier/ESLint issues?

```bash
npm run format          # Auto-fix formatting
npm run lint:fix        # Auto-fix linting issues
```

## 📚 Additional Resources

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [README](README.md)
- [Husky Docs](https://typicode.github.io/husky/)
- [Prettier Docs](https://prettier.io/docs/)
- [ESLint Docs](https://eslint.org/docs/)

## ✨ Summary of Benefits

1. **Consistency**: All code follows the same style and format
2. **Quality**: Automated linting and type checking
3. **Community**: Clear guidelines for contributors
4. **Trust**: Professional repository practices
5. **Automation**: CI/CD ensures standards are maintained
6. **Documentation**: Comprehensive guides for contributors
7. **Safety**: Security policy and vulnerability reporting
8. **Versioning**: Changelog tracks all changes

---

**Last Updated**: December 5, 2025
