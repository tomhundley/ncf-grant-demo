# Contributing to Ministry Grant Tracker

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows a simple code of conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)
- Git

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/ncf-grant-demo.git
   cd ncf-grant-demo
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/tomhundley/ncf-grant-demo.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up database** (see [Development Guide](docs/DEVELOPMENT.md))

6. **Start development servers**
   ```bash
   npm run dev
   ```

---

## Development Process

### Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch (if used) |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation updates |

### Creating a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Backend changes** - Start with schema/types, then resolvers
2. **Frontend changes** - Update queries/mutations, then components
3. **Write tests** (when test infrastructure is added)
4. **Update documentation** as needed

---

## Submitting Changes

### Before Submitting

- [ ] Code compiles without errors (`npm run build`)
- [ ] Linting passes (`npm run lint` in client)
- [ ] All existing functionality still works
- [ ] Documentation is updated (if applicable)
- [ ] Commit messages follow conventions

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why

3. **Address feedback** - Respond to review comments promptly

---

## Coding Standards

### TypeScript

- Use strict mode (`strict: true` in tsconfig)
- Explicit return types on functions
- No `any` types (use `unknown` if needed)
- Use interfaces for object shapes

```typescript
// Good
interface CreateMinistryInput {
  name: string;
  category: MinistryCategory;
  ein?: string;
}

async function createMinistry(input: CreateMinistryInput): Promise<Ministry> {
  // ...
}

// Avoid
async function createMinistry(input: any) {
  // ...
}
```

### GraphQL

- Use descriptive field names
- Add descriptions to all types and fields
- Use input types for mutations
- Follow naming conventions:
  - Types: `PascalCase`
  - Fields: `camelCase`
  - Enums: `SCREAMING_SNAKE_CASE`

```graphql
"""
A charitable organization that can receive grants.
"""
type Ministry {
  "Unique identifier"
  id: Int!
  "Organization name"
  name: String!
}
```

### React

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and small
- Use TypeScript for props

```typescript
interface GrantStatusBadgeProps {
  status: GrantStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function GrantStatusBadge({ status, size = 'md' }: GrantStatusBadgeProps) {
  // ...
}
```

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Route page components
├── graphql/        # Query and mutation definitions
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configuration
└── types/          # TypeScript type definitions
```

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependencies |

### Examples

```bash
# Feature
feat(grants): add grant rejection with reason

# Bug fix
fix(api): correct balance calculation in fundGrant

# Documentation
docs(readme): add deployment instructions

# Refactoring
refactor(resolvers): extract common pagination logic
```

### Guidelines

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- First line under 72 characters
- Reference issues in footer: `Fixes #123`

---

## Pull Request Process

### PR Title Format

Same as commit messages:
```
feat(component): add ministry filter dropdown
```

### PR Description Template

```markdown
## Description

Brief description of what this PR does.

## Changes

- List of specific changes
- Another change

## Related Issues

Fixes #123
Related to #456

## Testing

How to test these changes:
1. Step one
2. Step two

## Screenshots (if applicable)

Before/after screenshots for UI changes.

## Checklist

- [ ] Code compiles without errors
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Self-review completed
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Address feedback** with new commits
4. **Squash and merge** when approved

---

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

Thank you for contributing!
