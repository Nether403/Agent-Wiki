# @design-wiki/mcp

Stdio Model Context Protocol server for the Machine-First Design Agent Wiki.

Canonical tool list: [`catalog-contract.json`](../../catalog-contract.json). Counts: [`catalog-stats.json`](../../catalog-stats.json). See [`CATALOG.md`](../../CATALOG.md).

The Cloudflare Worker in `src/worker.ts` is a **prototype**. There is no public `mcp.design-wiki.dev` endpoint. Use local stdio until a hosted catalog exists.

## Connect

```bash
# Claude Code
claude mcp add design-wiki npx @design-wiki/mcp
```

```json
{
  "mcpServers": {
    "design-wiki": {
      "command": "npx",
      "args": ["@design-wiki/mcp"]
    }
  }
}
```

## Tools (14)

Aliases are listed beside the primary name.

| Tool | What it actually does |
| :--- | :--- |
| `search_library` / `search_components` | Filtered catalog search, 15KB payload budget |
| `fetch_raw_markup` / `fetch_raw_markdown` / `get_component_markup` | YAML frontmatter + TSX source |
| `get_installation_schema` / `get_installation_commands` / `get_install_recipe` | CLI recipe and peer deps |
| `get_dependency_graph` | Registry dependency walk |
| `audit_code_slop` | Canonical 50-rule pack in `@design-wiki/audit-linter` |
| `audit_and_fix_slop` | Regex remapper, then **re-scored** health. Does not assume 100/100 |
| `semantic_search_components` | Keyword + dial scoring. Not an embedding index |
| `compose_layout_tree` | Page-archetype scaffold from registry slugs |
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
