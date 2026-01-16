# Contributing

This document provides contribution guidelines for this project.

External contributors do not have write access to this repository, so contributions follow a **fork-based workflow**.

**Package Distribution:** This package is published to [npmjs.com](https://www.npmjs.com/package/promidas-utils) (`promidas-utils`).

For development environment setup and daily development workflow, see [DEVELOPMENT.md](./DEVELOPMENT.md).

For release procedures (maintainers only), see [RELEASE.md](./RELEASE.md).

## Quick Start (Fork Workflow)

1. Fork the repository on GitHub.

1. Clone your fork:

```bash
git clone https://github.com/<your-username>/promidas-utils.git
cd promidas-utils
```

1. Add the upstream remote:

```bash
git remote add upstream https://github.com/F88/promidas-utils.git
```

1. Create a feature branch:

```bash
git checkout -b feat/your-change
```

1. Install dependencies:

```bash
npm install
```

## Development Commands

- Run tests:

```bash
npm test
```

- Run tests in watch mode:

```bash
npm run test:watch
```

- Run tests with coverage:

```bash
npm run test:coverage
```

- Typecheck / format / lint:

```bash
npm run typecheck
npm run format:check
npm run lint
```

## Issues

Issues are welcome for bug reports, feature requests, and documentation improvements.

### Before You Open an Issue

- Search existing issues and pull requests to avoid duplicates.
- Include links to related issues/PRs if you find them.

### Bug Reports (Include)

- What happened vs what you expected
- Minimal reproduction steps (code snippet if possible)
- Environment: OS, Node.js version, npm version
- Package version (or commit SHA)
- Logs / stack traces (redact secrets)

### Feature Requests (Include)

- The problem you are trying to solve
- Proposed API / behavior (example usage)
- Alternatives considered
- Compatibility concerns (breaking changes, runtime environment)

### Security

If you believe you have found a security vulnerability, please avoid opening a public issue.
If GitHub Security Advisories are enabled for this repository, please report it there.

## Opening a Pull Request

- Keep changes focused and add/update tests when applicable.
- Run the standard checks locally:

```bash
npm run typecheck
npm run format:check
npm run lint
npm test
```

- Push your branch to your fork and open a PR to `F88/promidas-utils`.
- Reference related issues in the PR description (e.g. `Fixes #123` or `Refs #123`).
