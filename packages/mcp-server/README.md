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

---

## 🛠️ Available MCP Tools

### 1. `search_components`
Searches the 27+ component catalog with multi-dimensional filtering.
* **Parameters**:
  - `query` (string, optional)
  - `category` (`ui:primitive` | `ui:motion` | `ui:creative` | `ui:editorial` | `ui:block` | `ui:media` | `ui:utility`, optional)
  - `tag` (string, optional)
  - `minMotionIntensity` (number 1–10, optional)
  - `maxVisualDensity` (number 1–10, optional)
  - `minDesignVariance` (number 1–10, optional)

### 2. `fetch_raw_markdown` *(Aliases: `fetch_raw_markup`, `get_component_markup`)*
Returns complete raw Markdown documentation including:
- Structured YAML frontmatter contract (ID, name, category, taste dials, complexity, tags)
- Accessibility criteria (WCAG 2.1 AA, keyboard navigable)
- CLI recipes (`npx design-wiki add <slug>`)
- Verified, copy-pasteable TSX production source code block
* **Parameters**:
  - `name` (string, required): Component slug (e.g. `canvas-fluid-wave`, `floating-dock`)

### 3. `get_installation_commands` *(Aliases: `get_installation_schema`, `get_install_recipe`)*
Returns exact terminal commands, peer dependency installations, import syntax, and step-by-step setup instructions.
* **Parameters**:
  - `name` (string, required): Component slug
  - `packageManager` (`pnpm` | `npm` | `bun` | `yarn`, optional, default: `pnpm`)
  - `baseUrl` (string, optional, default: `http://localhost:3000`)

### 4. `audit_code_slop`
Lints user or agent-generated React/Tailwind code against the 20 Anti-Slop Rules, checking arbitrary pixel values (`p-[17px]`), blanket transitions, and accessibility gaps.
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
