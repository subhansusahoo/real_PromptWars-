// Comprehensive contributing guide
# Contributing to HabitBreaker

Thank you for your interest in contributing to HabitBreaker! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report concerns to project maintainers

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Workflow

### Branch Naming
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Documentation: `docs/description`

### Commit Messages
- Use clear, descriptive messages
- Start with an action verb (Add, Fix, Update, etc.)
- Example: "Add panic button with AI support"

### Code Style

We follow ESLint and Prettier configurations. Run before committing:
```bash
npm run lint:fix
```

### Testing Requirements

- Write tests for new features
- Ensure all tests pass: `npm run test`
- Aim for >80% code coverage
- Update snapshots if needed

### Pull Request Process

1. Ensure code passes all tests
2. Update documentation
3. Write clear PR title and description
4. Link related issues
5. Request review from maintainers
6. Address review comments
7. Rebase and merge when approved

## Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Security enhancements
- Documentation improvements
- Accessibility improvements

### Feature Ideas
- More predefined habits
- Social features (sharing, groups)
- Mobile app version
- Additional AI models support
- Advanced analytics
- Export/import functionality

## Questions?

Create an issue with the "question" label or discuss in existing issues.

Thank you for contributing! 🎉
