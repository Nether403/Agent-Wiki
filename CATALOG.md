# Catalog truth

Do not invent component counts, rule counts, or MCP tool lists. Read these files.

| What | File | Who writes it |
| :--- | :--- | :--- |
| Component count and category histogram | [`catalog-stats.json`](./catalog-stats.json) | Registry compiler (`pnpm build:registry`) |
| MCP tool names (live vs retired) | [`catalog-contract.json`](./catalog-contract.json) | Humans. CI fails if `packages/mcp-server` drifts |
| Phase 4 compile-seed slugs | [`catalog-seed.json`](./catalog-seed.json) | Humans. CI runs `tsc --noEmit` on these primitives |
| Anti-slop rules `SLOP-001`–`SLOP-050` | [`packages/audit-linter/src/rules.ts`](./packages/audit-linter/src/rules.ts) | Humans |
| Scoring / findings | [`packages/audit-linter/src/evaluate.ts`](./packages/audit-linter/src/evaluate.ts) | Humans. MCP, CLI, harvester, and eval-harness must call this |
| Component source | [`packages/registry/src`](./packages/registry/src) | Curated TSX only (`lib/` and `tokens/` are not catalog items) |
| Agent contract | [`SKILL.md`](./SKILL.md) | Humans. `pnpm sync:rules` copies it to Cursor/Claude/Codex |

## Commands

```bash
pnpm build:registry      # regenerates catalog-stats.json, /r/*.json, /raw, llms.txt
pnpm assert:catalog      # counts, SLOP ids, MCP registerTool names, seed slugs, stale doc phrases
pnpm inventory:health    # grade histogram over packages/registry/src (does not fail CI)
pnpm test:eval           # slop lint on real files; compile/axe scores are not claimed
pnpm test:origin         # CLI --registry / DESIGN_WIKI_REGISTRY_URL skip local files when HTTP
pnpm test:compile-seed   # real tsc --noEmit on catalog-seed.json primitives
pnpm mcp                 # stdio MCP from this repo (package is private; not on npm yet)
```

## Registry origin (Phase 3)

CLI `add` / `list` / `search` resolve a registry origin in this order:

1. `--registry` (`https://…`, `file://…`, or a directory containing `/r/*.json`)
2. `DESIGN_WIKI_REGISTRY_URL`
3. Compiled local catalog (`apps/docs/public/r` or `packages/registry/dist/r`)
4. `http://localhost:3000`

An explicit `http(s)` origin does **not** read local files, so a hosted `/r/` can be tested from inside this monorepo.

MCP install tools (`get_installation_commands`, `get_installation_schema`, `get_install_recipe`) use the tool `baseUrl` argument, then `DESIGN_WIKI_REGISTRY_URL`, then `http://localhost:3000`. Preferred install remains `npx design-wiki add <slug>`.

`pnpm --filter @design-wiki/mcp build` copies compiled `registry.json` into `packages/mcp-server/catalog/` (gitignored) so stdio can load the catalog without the Next app.

## What is not product

- `research/` — harvest notes, zips, and the old Python 21-rule gate
- `graphify-out/` — local graph snapshot (gitignored except `GRAPH_REPORT.md`)
- Root `components/ui/` — CLI install dump (gitignored)
- Cloudflare Worker URLs — prototype in `packages/mcp-server/src/worker.ts`
- Playbooks under `skills/` — not MCP tools

## Phase 3–4 track

Current status lives at the top of [`design-agent-wiki-roadmap.md`](./design-agent-wiki-roadmap.md).

1. **Phase 3**: stdio MCP with the 14 tools in `catalog-contract.json`. Registry origin + build-time catalog snapshot are in. Remaining: publish `@design-wiki/mcp` to npm; keep Worker experimental.
2. **Phase 4**: `pnpm test:compile-seed` is a real `tsc --noEmit` sandbox on the seed in `catalog-seed.json`. Remaining: Playwright + axe on that seed, then keep/merge/drop the inventory (`pnpm inventory:health`) instead of more harvests. Do not treat `pnpm test:a11y` as WCAG AA.
