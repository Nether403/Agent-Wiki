# Phase 4 compile seed fixture

`pnpm test:compile-seed` copies the slugs in `/catalog-seed.json` into `.generated/` (gitignored), rewrites `../lib/utils` imports, and runs `tsc --noEmit`.

This proves those primitives typecheck in a small React 19 fixture. It does not run Playwright, axe-core, or claim WCAG AA.
