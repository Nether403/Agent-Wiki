# MCP catalog snapshot

`registry.json` is copied here during `pnpm --filter @design-wiki/mcp build` from the compiled docs registry (`apps/docs/public/r/registry.json`).

`pnpm --filter @design-wiki/mcp build` also copies `catalog-core.json` into this folder (gitignored) so stdio can default browse to the trusted core.

`@design-wiki/mcp` is private and is not published to npm yet. From this repo:

```bash
pnpm build:registry
pnpm mcp
```
