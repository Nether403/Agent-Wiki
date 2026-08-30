# 🔌 @design-wiki/mcp

The official Model Context Protocol (MCP) server for the **Machine-First Design Agent Wiki**.

Allows AI developer agents (Claude Code, Cursor, Codex, Windsurf, Hermes, OpenClaw, Antigravity) to discover, inspect, install, auto-remediate, and audit zero-slop UI components through standardized tool calls over Stdio or HTTP/SSE transports.

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

### Remote Cloudflare Worker Edge MCP (Universal / Browser / v0)
- **HTTP POST endpoint**: `https://mcp.design-wiki.dev/mcp`
- **SSE Stream endpoint**: `https://mcp.design-wiki.dev/sse`
- **Health Check probe**: `https://mcp.design-wiki.dev/health`

---

## 🛠️ Available MCP Tools

All tools are engineered with strict **Tripwire Security Guardrails** and deliver deterministic payloads strictly **< 15KB** (15,360 bytes) via our built-in `enforceTokenBudget` optimizer, ensuring lightning-fast responses without agent context flooding.

### 1. `search_library` / `search_components`
Searches the 112 component catalog across all 8 taxonomy categories with multi-dimensional taste dial filtering.
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
  - `name` (string, required): Component slug (e.g. `floating-dock`, `ai-prompt-input`, `architecture-topology-diagram`)

### 3. `get_installation_schema` / `get_installation_commands` *(Alias: `get_install_recipe`)*
Returns exact terminal commands, shadcn v3 registry schemas, peer dependency installations, import syntax, and step-by-step setup instructions.
* **Parameters**:
  - `name` (string, required): Component slug
  - `packageManager` (`pnpm` | `npm` | `bun` | `yarn`, optional, default: `pnpm`)
  - `baseUrl` (string, optional, default: `http://localhost:3000`)

### 4. `get_dependency_graph`
Returns the dynamic DAG dependency topology, topological installation sequence, and required npm peer packages for any component or the full registry.
* **Parameters**:
  - `name` (string, optional): Component slug (omit for full registry DAG)
  - `includeMermaid` (boolean, optional, default: `false`)

### 5. `audit_code_slop`
Lints user or agent-generated React/Tailwind code against the 30 Anti-Slop Rules, catching arbitrary pixel offsets (`p-[17px]`), chained type assertions (`as any as`), unshaded backgrounds (`bg-white`), AI writing clichés, blanket transitions, and accessibility gaps.
* **Parameters**:
  - `code` (string, required): TSX/JSX code to analyze

### 6. `audit_and_fix_slop`
Automatically remediates slop TSX source code into zero-slop 100/100 TSX, normalizing non-token pixels, removing chained casts, adding focus rings, injecting SPDX headers, and applying calibrated themes.
* **Parameters**:
  - `code` (string, required): The slop TSX code to refactor
  - `theme` (`default` | `neo-tokyo` | `midnight` | `minimal`, optional, default: `default`)

---

## 🛡️ Tripwire Security Sandbox

The `@design-wiki/mcp` server includes an active security layer:
1. **Prompt Injection Interception**: Scans incoming tool arguments and neutralizes prompt extraction and injection attacks.
2. **Malicious AST Payload Scanning**: Blocks dangerous sinks (`eval()`, dynamic `Function()`, `child_process`, `dangerouslySetInnerHTML` with untrusted variables).
3. **15KB Token Budget Guarantee**: Strips and compresses tool outputs to prevent agent context degradation.

---

## 🧪 Testing & Verification

```bash
# Run MCP sandbox integration test
pnpm test:sandbox

# Run Cloudflare Worker edge deployment test suite
pnpm --filter @design-wiki/mcp test:worker
```

---

## 📄 License

MIT © Design Agent Wiki Contributors
