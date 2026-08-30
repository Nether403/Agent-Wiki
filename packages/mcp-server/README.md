# 🔌 @design-wiki/mcp

The official Model Context Protocol (MCP) server for the **Machine-First Design Agent Wiki**.

Allows AI developer agents (Claude Code, Cursor, Codex, Windsurf, v0) to discover, inspect, install, and audit zero-slop UI components through standardized tool calls over Stdio or HTTP/SSE transports.

---

## 🚀 Connecting to Your Agent

### Claude Code (`.claude/mcp.json`)
```bash
claude mcp add design-wiki npx @design-wiki/mcp
```

### Cursor (`.cursor/mcp.json`)
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

### Windsurf (`.windsurf/mcp.json`)
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

### OpenAI Codex (`.codex/config.json`)
```json
{
  "plugins": [
    {
      "name": "design-wiki",
      "command": "npx",
      "args": ["@design-wiki/mcp"],
      "transport": "stdio"
    }
  ]
}
```

---

## 🛠️ Available MCP Tools

All tools are engineered to deliver deterministic payloads strictly **< 15KB**, ensuring lightning-fast responses within AI agent context windows.

### 1. `search_library` / `search_components`
Searches the 29 component catalog across all 7 taxonomy categories with multi-dimensional taste dial filtering.

* **Parameters**:
  - `query` (string, optional)
  - `category` (`ui:primitive` | `ui:motion` | `ui:creative` | `ui:editorial` | `ui:block` | `ui:media` | `ui:utility`, optional)
  - `tag` (string, optional)
  - `minMotionIntensity` (number 1–10, optional)
  - `maxVisualDensity` (number 1–10, optional)
  - `minDesignVariance` (number 1–10, optional)

### 2. `fetch_raw_markup` / `fetch_raw_markdown` *(Alias: `get_component_markup`)*
Returns complete raw Markdown or structured TSX markup including:
- Structured YAML frontmatter contract (ID, name, category, taste dials, complexity, tags)
- Accessibility criteria (WCAG 2.1 AA, keyboard navigable)
- CLI recipes (`npx design-wiki add <slug>`)
- Verified, copy-pasteable TSX production source code block
* **Parameters**:
  - `name` (string, required): Component slug (e.g. `canvas-fluid-wave`, `floating-dock`, `evil-button`, `timeline-player`)

### 3. `get_installation_schema` / `get_installation_commands` *(Alias: `get_install_recipe`)*
Returns exact terminal commands, shadcn v3 registry schemas, peer dependency installations, import syntax, and step-by-step setup instructions.
* **Parameters**:
  - `name` (string, required): Component slug
  - `packageManager` (`pnpm` | `npm` | `bun` | `yarn`, optional, default: `pnpm`)
  - `baseUrl` (string, optional, default: `http://localhost:3000`)

### 4. `audit_code_slop`
Lints user or agent-generated React/Tailwind code against the 21 Anti-Slop Rules, catching arbitrary pixel offsets (`p-[17px]`), chained type assertions (`as any as`), unshaded backgrounds (`bg-white`), blanket transitions, and accessibility gaps.
* **Parameters**:
  - `code` (string, required): TSX/JSX code to analyze

---

## 🧪 Testing the Server

Run the autonomous agent sandbox test suite:

```bash
pnpm test:sandbox
```

---

## 📄 License

MIT © Design Agent Wiki Contributors
