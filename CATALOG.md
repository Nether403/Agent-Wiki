# Catalog truth

Do not invent component counts, rule counts, or MCP tool lists. Read these files.

| What | File | Who writes it |
| :--- | :--- | :--- |
| Component count and category histogram | [`catalog-stats.json`](./catalog-stats.json) | Registry compiler (`pnpm build:registry`) |
| MCP tool names (live vs retired) | [`catalog-contract.json`](./catalog-contract.json) | Humans. CI fails if `packages/mcp-server` drifts |
| Anti-slop rules `SLOP-001`–`SLOP-050` | [`packages/audit-linter/src/rules.ts`](./packages/audit-linter/src/rules.ts) | Humans |
| Scoring / findings | [`packages/audit-linter/src/evaluate.ts`](./packages/audit-linter/src/evaluate.ts) | Humans. MCP, CLI, harvester, and eval-harness must call this |
| Component source | [`packages/registry/src`](./packages/registry/src) | Curated TSX only (`lib/` and `tokens/` are not catalog items) |
| Agent contract | [`SKILL.md`](./SKILL.md) | Humans. `pnpm sync:rules` copies it to Cursor/Claude/Codex |

## Commands

```bash
pnpm build:registry      # regenerates catalog-stats.json, /r/*.json, /raw, llms.txt
pnpm assert:catalog      # counts, SLOP ids, MCP registerTool names, stale doc phrases
pnpm inventory:health    # grade histogram over packages/registry/src (does not fail CI)
pnpm test:eval           # slop lint on real files; compile/axe scores are not claimed
```

## What is not product

- `research/` — harvest notes, zips, and the old Python 21-rule gate
- `graphify-out/` — local graph snapshot (gitignored except `GRAPH_REPORT.md`)
- Root `components/ui/` — CLI install dump (gitignored)
- Cloudflare Worker URLs — prototype in `packages/mcp-server/src/worker.ts`
- Playbooks under `skills/` — not MCP tools

## Phase 3–4 track

Current status lives at the top of [`design-agent-wiki-roadmap.md`](./design-agent-wiki-roadmap.md).

1. **Phase 3**: stdio MCP with the 14 tools in `catalog-contract.json`. Next: publishable `npx @design-wiki/mcp` with a hosted `/r/` URL.
2. **Phase 4**: real `tsc --noEmit` sandbox, Playwright + axe on a seed of primitives, then keep/merge/drop the inventory (`pnpm inventory:health`) instead of more harvests.
