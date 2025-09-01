# Contributing to Boks-Boks-Boks

## Requirements

### Mandatory

1. **Your PR must be linked to an issue** - No PRs without corresponding issues
2. **Test with staging build** - Before creating a PR, run:

```bash
npm run build:staging
npm run preview
```

This uses `.env.staging` to test production builds with your local database. 

`env.staging` must be like so :

``` md
VITE_API_URL=http://localhost:8080
```

## Quick Start

1. Fork and clone the repo
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Make your changes
5. Test with staging build (see above)
6. Create PR linked to an issue

## Branch Naming

- `feat/#{linked-issue}-issue-number-description` for features
- `fix/#{linked-issue}-issue-number-description` for fixes

## Code Style

- Follow existing patterns
- Use TypeScript
- Keep commits focused