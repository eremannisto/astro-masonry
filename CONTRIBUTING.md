# Contributing

## Setup

```bash
pnpm install                 # Install dependencies
pnpm exec playwright install # Install Playwright browsers
```

## Development

```bash
pnpm run build  # Build the package
pnpm run lint   # Lint code
pnpm run check  # Check code
pnpm run format # Format code
```

## Testing

```bash
pnpm test # Run e2e tests
```

## Publishing

```bash
# Switch to main and make sure it's up to date
git checkout main
git fetch origin
git pull origin main

# Run all tests
pnpm test

# Bump version number and create
# and push a version tag
git tag v1.x.x
git push origin v1.x.x

# Publish to npm
pnpm publish --access public
```

The `prepublishOnly` script runs `pnpm build` automatically before publishing.
