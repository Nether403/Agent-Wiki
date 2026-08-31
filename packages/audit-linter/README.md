# @design-wiki/audit-linter

Canonical anti-slop rule pack for this monorepo. MCP, CLI, harvester, and eval-harness must import from here instead of copying regexes.

- Rules: `src/rules.ts` (`SLOP-001`–`SLOP-050`)
- Scoring: `src/evaluate.ts` (`evaluateSource`)
- Remap: `src/unslop.ts` (`unslopCode`) — re-scores before/after; 100/100 is not assumed

See [`CATALOG.md`](../../CATALOG.md).

## CLI

```bash
pnpm lint:slop packages/mcp-server/src
pnpm review:taste
```

`pnpm lint:slop` on the full harvested registry is **not** a CI gate. Many ingested files still fail `SLOP-020` (license headers). Use `pnpm inventory:health` for a histogram.

## Programmatic

```typescript
import { evaluateSource, unslopCode, RULE_COUNT } from "@design-wiki/audit-linter";

const before = evaluateSource("component.tsx", source);
const remapped = unslopCode(source, { theme: "neo-tokyo", componentName: "Hero" });
// remapped.scoreBefore / remapped.scoreAfter are measured, not hardcoded
```

## What this is not

- Not an AST engine (line/regex checks)
- Not axe-core and not a WCAG AA proof
- `src/axe-runner.ts` is source heuristics over compiled registry JSON
