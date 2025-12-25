# Development Guide

This document provides guidelines for developers working on `@f88/promidas-utils`.

## Prerequisites

- **Node.js**: 20.x or later
- **npm**: 10.x or later

## Setup

1. Clone the repository:

```bash
git clone https://github.com/F88/promidas-utils.git
cd promidas-utils
```

1. Install dependencies:

```bash
npm install
```

## Development Workflow

### Available Scripts

- `npm run build` - Build the project (TypeScript compilation)
- `npm run typecheck` - Run TypeScript type checking without emitting files
- `npm test` - Run all tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run docs:dev` - Start VitePress documentation development server
- `npm run docs:build` - Build documentation for production

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm test -- --watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view detailed coverage information.

### Type Checking

Type check the entire project:

```bash
npm run typecheck
```

This checks both source code and test files using `tsconfig.dev.json`.

### Code Quality

Before committing, ensure your code passes all checks:

```bash
npm run typecheck
npm run format:check
npm run lint
npm test
```

## Project Structure

```text
promidas-utils/
├── lib/                    # Source code
│   ├── token/             # Token management utilities
│   │   ├── constants.ts
│   │   ├── index.ts
│   │   ├── token-manager.ts
│   │   ├── types.ts
│   │   └── storages/
│   ├── store/             # Store state utilities
│   │   ├── index.ts
│   │   ├── store-state.ts
│   │   └── types.ts
│   └── version.ts         # Auto-generated during build (do not edit manually)
├── test/                  # Test files
│   ├── token/
│   ├── store/
│   └── helpers/
├── docs/                  # VitePress documentation
├── scripts/               # Build and utility scripts
└── dist/                  # Build output (gitignored)
```

## Testing Guidelines

- All tests use [Vitest](https://vitest.dev/)
- Test files follow the pattern `*.test.ts`
- Organize tests using `describe` blocks for logical structure
- Aim for 100% code coverage
- Include edge cases and error scenarios
- Mock external dependencies appropriately

Example test structure:

```typescript
describe('MyClass', () => {
    describe('methodName()', () => {
        it('should handle normal case', () => {
            // Test implementation
        });

        it('should handle edge case', () => {
            // Test implementation
        });

        it('should throw error for invalid input', () => {
            // Test implementation
        });
    });
});
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with configuration in `prettier.config.mjs`
- **Linting**: ESLint with TypeScript support
- **Imports**:
    - Use destructured imports when possible
    - Use `import type` for type-only imports
    - Always include `.js` extension for relative imports

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
type(scope): subject

body (optional)

footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Building

Build the project:

```bash
npm run build
```

The build process:

1. Generates version information (`lib/version.ts`)
2. Compiles TypeScript to JavaScript
3. Generates type definitions (`.d.ts` files)
4. Outputs to `dist/` directory

## Documentation

Documentation is built with [VitePress](https://vitepress.dev/).

Start the development server:

```bash
npm run docs:dev
```

Build for production:

```bash
npm run docs:build
```

Documentation structure:

- `docs/index.md` - Homepage
- `docs/installation.md` - Installation guide
- `docs/api.md` - API overview
- `docs/api/token.md` - Token API reference
- `docs/api/store.md` - Store API reference

## Release Process

See [RELEASE.md](RELEASE.md) for the complete release workflow.

Quick overview:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run all checks (typecheck, format:check, lint, test)
4. Commit and tag
5. Push with tags
6. GitHub Actions will publish to GitHub Packages

## Troubleshooting

### TypeScript errors after dependency update

Clear build cache and rebuild:

```bash
rm -rf dist node_modules
npm install
npm run build
```

### Tests failing intermittently

Ensure test isolation:

- Use `beforeEach`/`afterEach` for setup/cleanup
- Restore global mocks after tests
- Avoid test interdependencies

### Coverage not at 100%

Run coverage with detailed output:

```bash
npm run test:coverage
```

Open `coverage/index.html` to identify uncovered lines.

## Contributing

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all checks pass
4. Create a pull request
5. Wait for review and CI checks

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [VitePress Documentation](https://vitepress.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
