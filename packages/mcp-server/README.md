# @design-wiki/mcp

Stdio Model Context Protocol server for the Machine-First Design Agent Wiki.

Canonical tool list: [`catalog-contract.json`](../../catalog-contract.json). Counts: [`catalog-stats.json`](../../catalog-stats.json). See [`CATALOG.md`](../../CATALOG.md).

This package is **private** and is not published to npm yet. Do not expect `npx @design-wiki/mcp` to resolve from the registry.

The Cloudflare Worker in `src/worker.ts` is a **prototype**. There is no public `mcp.design-wiki.dev` endpoint.

## Connect (local checkout)

```bash
pnpm build:registry   # compiles /r and is copied into packages/mcp-server/catalog at MCP build
pnpm mcp              # tsx packages/mcp-server/src/index.ts
```

```json
{
  "mcpServers": {
    "design-wiki": {
      "command": "pnpm",
      "args": ["mcp"],
      "env": {
        "DESIGN_WIKI_REGISTRY_URL": "http://localhost:3000"
      }
    }
  }
}
```

`DESIGN_WIKI_REGISTRY_URL` is optional. When set, install-tool shadcn URLs use that host instead of `http://localhost:3000`. Catalog search/fetch still read the build-time snapshot or workspace `/r` files.

`pnpm --filter @design-wiki/mcp build` copies compiled `apps/docs/public/r/registry.json` → `packages/mcp-server/catalog/registry.json` (gitignored) so stdio does not depend on Next walking relative paths.

## Tools (14)

Aliases are listed beside the primary name.

| Tool | What it actually does |
| :--- | :--- |
| `search_library` / `search_components` | Unqualified browse = `catalog-core.json`. Keyword search covers the full inventory, core first, 15KB budget |
| `fetch_raw_markup` / `fetch_raw_markdown` / `get_component_markup` | YAML frontmatter + TSX source |
| `get_installation_schema` / `get_installation_commands` / `get_install_recipe` | CLI recipe and peer deps |
| `get_dependency_graph` | Registry dependency walk |
| `audit_code_slop` | Canonical 50-rule pack in `@design-wiki/audit-linter` |
| `audit_and_fix_slop` | Regex remapper, then **re-scored** health. Does not assume 100/100 |
| `semantic_search_components` | Keyword + dial scoring with a core boost. Not an embedding index |
| `compose_layout_tree` | Page-archetype scaffold. `settings` / `auth-flow` use core slugs only |
| `verify_accessibility_contrast` | WCAG contrast math on two hex colors |

Retired names (do not register, do not document as live) are listed in `catalog-contract.json` → `retiredMcpTools`.

## Security

Incoming arguments are scanned for prompt-injection strings and a small set of dangerous code sinks. Tool payloads are trimmed to 15KB.

## Tests

```bash
pnpm test:sandbox
pnpm --filter @design-wiki/mcp test:worker
```

## License

MIT
