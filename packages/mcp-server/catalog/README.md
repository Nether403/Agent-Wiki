# MCP catalog snapshot

`registry.json` is copied here during `pnpm --filter @design-wiki/mcp build` from the compiled docs registry (`apps/docs/public/r/registry.json`).

It is gitignored. Do not commit the blob. Stdio MCP reads this file so the server can run without the Next app walking relative paths.

`@design-wiki/mcp` is private and is not published to npm yet. From this repo:

```bash
pnpm build:registry
pnpm mcp
```
