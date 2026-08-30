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

## 🛠️ Available MCP Tools (19 Tools)

All tools are engineered with strict **Tripwire Security Guardrails** and deliver deterministic payloads strictly **< 15KB** (15,360 bytes) via our built-in `enforceTokenBudget` optimizer, ensuring lightning-fast responses without agent context flooding.

### 1. `search_library` / `search_components`
Searches the 192 component catalog across all 10 taxonomy categories with multi-dimensional taste dial filtering.
* **Parameters**:
  - `query` (string, optional)
  - `category` (`ui:ai-native` | `ui:workflow` | `ui:primitive` | `ui:motion` | `ui:creative` | `ui:editorial` | `ui:block` | `ui:media` | `ui:utility`, optional)
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
Lints user or agent-generated React/Tailwind code against the 50 Anti-Slop Rules, catching arbitrary pixel offsets (`p-[17px]`), chained type assertions (`as any as`), unshaded backgrounds (`bg-white`), AI writing clichés, blanket transitions, and accessibility gaps.
* **Parameters**:
  - `code` (string, required): TSX/JSX code to analyze

### 6. `audit_and_fix_slop`
Automatically remediates slop TSX source code into zero-slop 100/100 TSX, normalizing non-token pixels, removing chained casts, adding focus rings, injecting SPDX headers, and applying calibrated themes.
* **Parameters**:
  - `code` (string, required): The slop TSX code to refactor
  - `theme` (`default` | `neo-tokyo` | `midnight` | `minimal`, optional, default: `default`)

### 7. `semantic_search_components`
Calibrated natural language vector search matching user prompt descriptions directly to verified components.

### 8. `compose_layout_tree`
Generates full-page multi-component composition layouts with topological dependency graphs.

### 9. `recommend_stack`
Synthesizes full architecture framework and library recommendations tailored to product requirements.

### 10. `verify_accessibility_contrast`
Mathematical WCAG 2.1 AA and AAA contrast ratio calculator for foreground and background color combinations.

### 11. `generate_color_palette`
Generates semantic Tailwind CSS v4 `@theme` palette blocks adhering to token contracts.

### 12. `validate_theme_contrast_matrix`
Validates an entire design token color matrix (background, foreground, card, primary, muted) against AA compliance.

### 13. `recommend_responsive_blueprint`
Emits mobile-first breakpoint classes and semantic HTML landmark structure for landing, dashboard, and analytics views.

### 14. `diff_against_zero_slop`
Compares arbitrary React code to the closest zero-slop component and emits step-by-step AST migration diffs.

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
