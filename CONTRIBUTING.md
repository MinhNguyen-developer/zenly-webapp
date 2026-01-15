# 🤝 Contributing to Zenly Friend Tracker

Thank you for considering contributing to Zenly Friend Tracker! This document provides guidelines and information about contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Any conduct that could be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- PostgreSQL 14+ (or Docker)
- Git
- Code editor (VS Code recommended)

### Fork & Clone

```bash
# Fork the repository on GitHub, then:

# Clone your fork
git clone https://github.com/YOUR_USERNAME/zenly-webapp.git
cd zenly-webapp

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/zenly-webapp.git
```

---

## 💻 Development Setup

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd webapp
npm install
```

### 2. Setup Environment

```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd webapp
cp .env.example .env
# Edit .env with your API URL
```

### 3. Setup Database

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run start:dev

# Terminal 2 - Frontend
cd webapp
npm run dev
```

---

## 🎯 How to Contribute

### Types of Contributions

We welcome many types of contributions:

- 🐛 **Bug fixes** - Fix issues and improve stability
- ✨ **New features** - Add new functionality
- 📝 **Documentation** - Improve or add documentation
- 🎨 **UI/UX improvements** - Enhance user experience
- ⚡ **Performance** - Optimize code and queries
- 🧪 **Tests** - Add or improve test coverage
- 🔧 **Refactoring** - Improve code quality

### Finding Issues

- Check [GitHub Issues](https://github.com/yourusername/zenly-webapp/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on an issue to get assigned

### Proposing New Features

1. Check if the feature already exists or is planned
2. Open an issue describing the feature
3. Discuss with maintainers
4. Wait for approval before starting work

---

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Add proper type annotations
- Avoid `any` type when possible

```typescript
// Good ✅
interface User {
  id: string;
  username: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad ❌
function getUser(id: any): Promise<any> {
  // ...
}
```

### Code Style

**Backend (NestJS):**
- Follow NestJS conventions
- Use dependency injection
- Create DTOs for validation
- Use decorators properly
- Keep controllers thin

```typescript
// Good ✅
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
```

**Frontend (React):**
- Use functional components
- Use hooks (useState, useEffect, custom hooks)
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow React best practices

```typescript
// Good ✅
interface UserCardProps {
  user: User;
  onClick: (user: User) => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div onClick={() => onClick(user)}>
      {user.name}
    </div>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile`, `FriendsList`)
- **Functions**: camelCase (`getUserById`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FRIENDS`)
- **Interfaces**: PascalCase with `I` prefix optional (`User`, `IUser`)
- **Types**: PascalCase (`UserType`, `LocationData`)

### File Structure

```
# Component files
UserProfile.tsx       # Component
UserProfile.test.tsx  # Tests
UserProfile.css       # Styles (if needed)

# Service files
users.service.ts      # Service
users.service.spec.ts # Tests
```

---

## 📦 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes

### Examples

```bash
# Good ✅
feat(friends): add friend request notifications
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
refactor(location): simplify location update logic

# Bad ❌
updated stuff
fixed bug
changes
```

### Commit Best Practices

- Write clear, descriptive messages
- Keep commits atomic (one logical change per commit)
- Reference issue numbers when applicable
- Use present tense ("add feature" not "added feature")

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Ensure code follows style guidelines
2. ✅ All tests pass
3. ✅ Add tests for new features
4. ✅ Update documentation
5. ✅ Lint your code
6. ✅ No console.logs or debug code
7. ✅ Rebase on latest main branch

### Creating a Pull Request

```bash
# 1. Create a feature branch
git checkout -b feature/amazing-feature

# 2. Make your changes
# ... edit files ...

# 3. Commit your changes
git add .
git commit -m "feat(feature): add amazing feature"

# 4. Push to your fork
git push origin feature/amazing-feature

# 5. Open a Pull Request on GitHub
```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added tests
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, maintainers will merge
4. Your contribution will be in the next release!

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test
npm run test:watch
npm run test:cov
npm run test:e2e

# Frontend tests (when configured)
cd webapp
npm test
```

### Writing Tests

**Backend Example:**
```typescript
describe('UsersService', () => {
  it('should find a user by id', async () => {
    const user = await usersService.findOne('user-id');
    expect(user).toBeDefined();
    expect(user.id).toBe('user-id');
  });
});
```

**Frontend Example:**
```typescript
describe('UserCard', () => {
  it('renders user name', () => {
    const user = { id: '1', name: 'John' };
    render(<UserCard user={user} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Test Coverage

- Aim for 80%+ coverage
- Test edge cases
- Test error handling
- Test user interactions

---

## 📖 Documentation

### What to Document

- **New Features**: Add usage examples
- **API Changes**: Update API docs
- **Breaking Changes**: Document migration path
- **Complex Code**: Add inline comments
- **Configuration**: Update .env.example

### Documentation Style

```typescript
/**
 * Finds a user by their unique ID
 * 
 * @param id - The user's unique identifier
 * @returns Promise resolving to User object
 * @throws NotFoundException if user not found
 * 
 * @example
 * ```typescript
 * const user = await findUser('123');
 * console.log(user.name);
 * ```
 */
async findUser(id: string): Promise<User> {
  // Implementation
}
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug is already reported
2. Try the latest version
3. Gather information about the bug

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome 120]
- Node: [e.g., 20.10.0]
- Version: [e.g., 1.0.0]

## Screenshots
Add screenshots if helpful

## Additional Context
Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Any alternative solutions?

## Additional Context
Mockups, examples, etc.
```

---

## 🎨 UI/UX Guidelines

### Design Principles

- **Simplicity**: Keep interfaces clean
- **Consistency**: Follow existing patterns
- **Accessibility**: Support keyboard navigation
- **Responsive**: Work on all screen sizes
- **Performance**: Smooth animations

### Component Design

- Use Tailwind CSS classes
- Follow Radix UI patterns
- Support dark/light themes
- Add loading states
- Handle empty states
- Show clear error messages

---

## 🔐 Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email: security@example.com
2. Include detailed description
3. Wait for maintainer response
4. Coordinate disclosure

### Security Best Practices

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries
- Implement rate limiting
- Follow OWASP guidelines

---

## 📊 Project Stats & Goals

### Current Stats
- Lines of Code: 10,000+
- Test Coverage: 60%+
- Contributors: Welcome!

### Goals
- Increase test coverage to 80%
- Add more features
- Improve documentation
- Build community

---

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

---

## 📞 Getting Help

### Questions?

- GitHub Discussions
- Discord: [coming soon]
- Email: support@example.com

### Stuck?

- Check existing documentation
- Ask in discussions
- Reach out to maintainers

---

## 📅 Release Cycle

- **Patch releases**: Bug fixes (weekly)
- **Minor releases**: New features (monthly)
- **Major releases**: Breaking changes (quarterly)

---

## 🙏 Thank You!

Your contributions make this project better! We appreciate:
- Code contributions
- Bug reports
- Feature ideas
- Documentation improvements
- Community support

**Happy coding! 🚀**

---

## 📚 Resources

- [README.md](./README.md) - Project overview
- [API Documentation](./server/API_DOCS.md) - API reference
- [Docker Guide](./DOCKER_DEPLOYMENT.md) - Deployment
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://react.dev/)

---

<div align="center">

**Together we build amazing things! 💪**

</div>

