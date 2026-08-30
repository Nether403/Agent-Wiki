# 🏛️ Machine-First Design Agent Wiki

> **A deterministic, pre-tested, zero-slop UI component registry and Model Context Protocol (MCP) ecosystem engineered specifically for AI developer agents.**

[![CI / Quality Gate](https://img.shields.io/badge/Slop%20Audit-100%2F100%20(S--Grade)-emerald?style=flat-square)](./verify-audit.py)
[![A11y CI](https://img.shields.io/badge/A11y%20WCAG%202.1%20AA-45%2F45%20PASS-green?style=flat-square)](./scripts/test-a11y-linter.ts)
[![Taste Dials](https://img.shields.io/badge/Taste%20Dials-100%2F100%20Consistent-blue?style=flat-square)](./packages/audit-linter)
[![MCP Protocol](https://img.shields.io/badge/MCP%20Server-Cloudflare%20Worker%20%2B%20Stdio-blueviolet?style=flat-square)](./packages/mcp-server)
[![Agent Ecosystem](https://img.shields.io/badge/Agents-11%20Platforms%20Verified-indigo?style=flat-square)](./scripts/test-agent-ecosystem.ts)
[![React 19 & Tailwind v4](https://img.shields.io/badge/Stack-React%2019%20%7C%20Tailwind%20v4-violet?style=flat-square)](./apps/docs)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](./LICENSE)

---

## 📖 Executive Summary

Modern frontend engineering is undergoing a tectonic shift: **AI coding agents (Claude Code, Cursor, Codex, OpenClaw, Hermes, Antigravity) are becoming the primary assemblers of code primitives**, while human engineers focus on visual curation, high-level architecture, and quality assurance.

Traditional component libraries were designed for human visual browsing—relying on heavy DOM payloads, extensive explanatory prose, and visual trial-and-error. When an AI agent is forced to build interfaces from generic training weights or unstructured documentation, it inevitably produces **"AI Slop"**:
* ❌ Hallucinated component props and nonexistent imports.
* ❌ Chained type assertions (`as unknown as`, `as any as ComponentProps`).
* ❌ Arbitrary, non-token spacing overrides (`p-[17px]`, `mt-[13px]`).
* ❌ Banned visual clichés (the `indigo-600` button, the purple-to-blue linear gradient, decorative emoji grids, and blanket glassmorphism).
* ❌ Accessibility failures (missing ARIA roles, unlabeled icon buttons, suppressed focus rings).

The **Machine-First Design Agent Wiki** flips this paradigm. By providing deterministic, pre-tested component registries exposed through ultra-lean flat files and the **Model Context Protocol (MCP)**, agents operate in a finite, grounded token space with **zero human intervention**.

---

## 🏛️ System Architecture

The platform runs on a **Double-Exposure Architecture**:

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │                   Curated Repositories                 │
                                  │ (HeroUI v3, SmoothUI, Aceternity, KokonutUI, Tailark)  │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                                [1. Ingestion Harvester]
                                                (ast-parser.ts + dependency-graph.ts)
                                                              │
                                                [2. Dial Scorer & Slop Gate]
                                                (21 anti-slop rules + taste-dial-audit.ts)
                                                              │
                                                [3. Static Registry Compiler]
                                                (build-registry.ts dynamic sweeper)
                                                              │
                                ┌──────────────────────────────┴──────────────────────────────┐
                                ▼                                                             ▼
                ┌──────────────────────────────┐                              ┌──────────────────────────────┐
                │       Human Interface        │                              │      Machine Interface       │
                │   (Next.js 15 + Tailwind v4) │                              │  - /llms.txt & /llms-full.txt│
                │ - Interactive Component Demos│                              │  - /raw/components/*.md      │
                │ - Taste Dial Playground      │                              │  - /r/[name].json (shadcn v3)│
                │ - Architecture Documentation │                              │  - /r/registry.json Master   │
                └──────────────────────────────┘                              │  - @design-wiki/mcp (Worker) │
                                                                              │  - /SKILL.md (11 rulepacks)  │
                                                                              └──────────────────────────────┘
```

---

## 📂 Monorepo Topology

The repository is structured as an integrated `pnpm` monorepo orchestrated with Turborepo:

```
Agent Wiki/
├── apps/
│   └── docs/                        # Next.js 15 App Router + Tailwind v4 human docs & static /r/ host
│       ├── app/                     # Web routes, /llms.txt, /r/[name]/route.ts, /raw/
│       ├── content/docs/            # MDX architectural guides, category manuals, and setup docs
│       └── public/                  # Static build artifacts served by the docs app
│           ├── r/                   # Compiled shadcn JSON schemas and registry.json index
│           ├── raw/components/      # Machine-first markdown with YAML frontmatter and TSX source
│           ├── SKILL.md             # Public endpoint for remote LLM agent skill discovery
│           ├── llms.txt             # Flat agent discovery index
│           └── llms-full.txt        # Full-context machine manifest with embedded source
├── packages/
│   ├── harvester/                   # Ingestion engine, shallow git cloner, AST analyzer, DAG dependency graph
│   │   ├── src/ast-parser.ts        # TypeScript Compiler API AST extractor & 8-library repo manifests
│   │   ├── src/dependency-graph.ts  # Directed Acyclic Graph (DAG) analyzer, cycle detector & Mermaid generator
│   │   ├── src/dial-classifier.ts   # Taste-dial scoring heuristics & 21-rule slop review
│   │   ├── src/codemods/            # Tailwind v4 & React 19 / motion/react transformers
│   │   ├── src/attribution.ts       # Open-source SPDX license header injector
│   │   └── src/cli.ts               # Standalone Harvester CLI (pnpm harvest graph / ingest)
│   ├── registry/                    # 45 curated zero-slop components & dynamic registry compiler
│   │   ├── src/                     # TSX sources (primitives, motion, creative, editorial, blocks, media, utility)
│   │   ├── compiler/build-registry.ts # Dynamic component sweeper and /r/ JSON compiler
│   │   └── schema.json              # Component JSON Schema extending shadcn registry-item
│   ├── mcp-server/                  # Model Context Protocol (MCP) service for developer agents
│   │   ├── src/server.ts            # Core MCP server, get_dependency_graph, audit_code_slop (<15KB budget)
│   │   ├── src/worker.ts            # Cloudflare Worker edge deployment (JSON-RPC & SSE streaming)
│   │   ├── src/embedded-catalog.ts  # 0ms disk dependency embedded snapshot catalog
│   │   ├── src/index.ts             # Stdio transport entrypoint
│   │   ├── test/agent-sandbox.test.ts # Autonomous end-to-end sandbox verification test
│   │   └── test/worker.test.ts      # Cloudflare Worker deployment verification test
│   ├── cli/                         # Native installer CLI (npx design-wiki add <slug>)
│   │   ├── src/commands/add.ts      # Path map resolver, recursive downloader & peer installer
│   │   ├── src/commands/list.ts     # Component catalog browser with taste dials
│   │   ├── src/commands/audit.ts    # Standalone anti-slop audit scanner
│   │   └── src/index.ts             # Executable CLI router with --cwd & --path support
│   └── audit-linter/                # 21-rule AST + regex anti-slop verification & taste dial auditor
│       ├── src/rules.ts             # Rule definitions (SLOP-001 through SLOP-021) & scanCssAntiPatterns
│       ├── src/taste-dial-audit.ts  # 1-10 Dial consistency auditor (Variance, Motion, Density)
│       ├── src/dial-classifier.ts   # Standalone dial classifier with defaultDials preset support
│       ├── src/llm-review.ts        # Automated LLM taste audit engine
│       └── src/cli.ts               # verify-audit & taste review CLI (pnpm review:taste)
├── scripts/
│   ├── sync-rulepacks.ts            # Multi-agent rules synchronizer across 11 ecosystem platforms
│   ├── test-agent-ecosystem.ts      # Automated compatibility test across 11 agent targets
│   └── test-a11y-linter.ts          # WCAG 2.1 AA CI linter: checks all 45 registry components
├── SKILL.md                         # Canonical agent execution contract, 4-phase loop, active taste dials
├── .cursorrules                     # Cursor IDE agent instructions (auto-synced from SKILL.md)
├── .cursor/rules/design-wiki.mdc    # Cursor Rules v2 format (auto-synced from SKILL.md)
├── .windsurfrules                   # Windsurf IDE agent instructions (auto-synced from SKILL.md)
├── .github/copilot-instructions.md  # GitHub Copilot agent instructions (auto-synced from SKILL.md)
├── AGENTS.md                        # Universal agent standard instructions (auto-synced from SKILL.md)
├── CLAUDE.md                        # Claude Code workspace instructions (auto-synced from SKILL.md)
├── .codex-plugin/rules.json         # OpenAI Codex ruleset (auto-synced from SKILL.md)
├── .openclaw/instructions.md        # OpenClaw agent rules (auto-synced from SKILL.md)
├── .hermes/instructions.md          # Hermes agent rules (auto-synced from SKILL.md)
├── registry-item-schema.json        # Canonical JSON schema for registry items
└── pnpm-workspace.yaml              # Workspace package configuration
```

---

## 🏷️ Standardized Taxonomy Framework

All **45 curated components** are classified into a canonical taxonomy framework:

| Category | Description | Representative Upstream Libraries | Total Items |
| :--- | :--- | :--- | :---: |
| `ui:primitive` | Accessible, headless, battle-tested UI controls (buttons, dialogs, dropdowns, inputs, tabs, accordions, skeletons, command menus). | Radix UI, Ark UI, HeroUI v3, cmdk, Shadcn | **13** |
| `ui:motion` | Micro-interactions, spring physics, and animated transitions built with `motion/react` and GPU transforms. | SmoothUI, KokonutUI, Aceternity UI, Evil-Buttons, Magic UI | **10** |
| `ui:creative` | Interactive HTML5 Canvas simulations, WebGL shaders, Three.js scenes, and generative background surfaces. | Canvas UI, ThreeUI, Aceternity, Magic UI | **6** |
| `ui:editorial` | Clean, static, typography-disciplined analytical cards, code blocks, callouts, and SVG diagrams. | diagram-design, Design Wiki | **5** |
| `ui:block` | Complete multi-component sections, bento grids, navigation headers, and SaaS feature blueprints. | Tailark, Kairo UI, Shadcn blocks | **5** |
| `ui:media` | Timeline-based motion wrappers, video frame scrubbers, and synthesized audio visualizers. | Remocn, Design Wiki | **2** |
| `ui:utility` | Fast micro-assets, status indicators, dot loaders, SVG morphs, and keyboard shortcuts. | icons0, ReUI, Design Wiki | **4** |

---

## 🔌 Model Context Protocol (MCP) Server

AI developer agents connect to the registry via the `@design-wiki/mcp` server (deployable as a local stdio process or a globally distributed Cloudflare Worker).

### Configuration

#### Claude Code (`.claude/mcp.json`)
```bash
claude mcp add design-wiki npx @design-wiki/mcp
```

#### Cursor (`.cursor/mcp.json`)
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

#### Remote Cloudflare Worker Edge MCP (Universal / Browser / v0)
- **HTTP POST endpoint**: `https://mcp.design-wiki.dev/mcp`
- **SSE Stream endpoint**: `https://mcp.design-wiki.dev/sse`
- **Health Check probe**: `https://mcp.design-wiki.dev/health`

### Core MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `search_library` / `search_components` | `query`, `category`, `tag`, `minMotionIntensity`, `maxVisualDensity`, `minDesignVariance` | Searches the catalog with multi-dimensional filtering across all 45 zero-slop components (< 15KB payload). |
| `fetch_raw_markup` / `fetch_raw_markdown` | `name` (slug) | Returns complete raw Markdown with structured YAML frontmatter contract, taxonomy, complexity, taste dials, accessibility, and verified TSX source. *(Alias: `get_component_markup`)* |
| `get_installation_schema` / `get_installation_commands` | `name` (slug), `packageManager` (`pnpm`, `npm`, `bun`, `yarn`), `baseUrl` | Returns exact CLI commands (`npx design-wiki add <slug>`, `npx shadcn@latest add ...`), peer npm install strings, import snippets, and instructions. *(Alias: `get_install_recipe`)* |
| `get_dependency_graph` | `name` (slug, optional), `includeMermaid` (boolean, optional) | Returns the dynamic DAG dependency topology, topological installation sequence, and required npm peer packages for any component or the full registry. |
| `audit_code_slop` | `code` (string) | Scans arbitrary React/Tailwind code against 21 anti-slop rules, checking arbitrary pixel escapes (`p-[17px]`), chained type assertions (`as any as`), unshaded backgrounds (`bg-white`), and returns a health score (0–100). |

---

## 🛡️ Anti-Slop 21-Rule Specification

Every component ingested or generated is validated against our 21 Anti-Slop Rules:

| Rule ID | Category | Severity | Detection | Target Violation |
| :--- | :--- | :---: | :---: | :--- |
| **SLOP-001** | Styling / Color | Medium | Regex | Hardcoded indigo shades (`bg-indigo-600`, `#4f46e5`) |
| **SLOP-002** | Styling / Color | Medium | Regex | Cliché purple-to-blue linear gradients (`from-purple-500 to-blue-500`) |
| **SLOP-003** | Styling / Surface | Low | Regex | Blanket glassmorphism (`bg-white/10 backdrop-blur-md`) |
| **SLOP-004** | TypeScript | **High** | AST | Chained type assertions (`as unknown as`, `as any as`) |
| **SLOP-005** | TypeScript | **High** | AST | Conditional empty object spreads (`...(cond ? { a } : {})`) |
| **SLOP-006** | Motion | Low | Regex | Blanket `transition-all duration-300` on structural wrappers |
| **SLOP-007** | Layout / Spacing | Low | Regex | Non-token arbitrary pixel units (`p-[17px]`, `m-[13px]`) |
| **SLOP-008** | Iconography | Medium | Regex | Decorative emojis inside buttons/cards instead of SVG icons |
| **SLOP-009** | Code Completeness | **High** | Regex | Truncated code comments (`// TODO: implement logic`, mock placeholders) |
| **SLOP-010** | Accessibility | **High** | AST | Interactive elements without accessible text or `aria-label` |
| **SLOP-011** | Accessibility | Medium | AST | Inline SVGs without `role="img"` or accessible title |
| **SLOP-012** | Accessibility | **High** | AST | Focus outline suppression (`outline-none` without replacement ring) |
| **SLOP-013** | Performance | Medium | AST | Layout-triggering transitions (`transition-[height]`, `transition-[width]`) |
| **SLOP-014** | Performance | Medium | AST | Canvas render loop missing `prefers-reduced-motion` media check |
| **SLOP-015** | Architecture | **High** | AST | Hardcoded external HTTP images without fallback dimensions |
| **SLOP-016** | Motion | Low | AST | Missing `LayoutGroup` or stable `key` during layout morphing |
| **SLOP-017** | TypeScript | Medium | AST | Implicit `any` props on component function export signatures |
| **SLOP-018** | Styling / Layout | Medium | Regex | Repetitive centered card layouts (identical 3-col centered cards) |
| **SLOP-019** | Architecture | **High** | AST | Deep relative imports bypassing standard aliases (`../../../../`) |
| **SLOP-020** | Legal / IP | **High** | Regex | Missing mandatory upstream license attribution headers |
| **SLOP-021** | Styling / Surface | Medium | Regex | Raw unshaded backgrounds (`bg-white`, `bg-black`, `bg-[#fff]`) without dark-mode or semantic tokens |

---

## ⚡ Quickstart & Development Guide

### Prerequisites
- **Node.js**: `v20+` (tested on `v26.7.0`)
- **pnpm**: `v10+` (tested on `v11.3.0`)
- **Git**: Installed and accessible on PATH

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build Component Registries & Schemas
Sweeps component sources, maps peer dependencies from AST, escapes source strings, and compiles `/r/[name].json`, `/r/registry.json`, `llms.txt`, and `llms-full.txt`:
```bash
pnpm build:registry
```

### 3. Run Anti-Slop Audit & Taste Review
Scans all workspace components against the 21-rule linter and generates `COMPLETED-DESIGN-AUDIT.md`:
```bash
# Workspace wide 21-rule anti-slop audit
pnpm lint:slop

### 3. Run Anti-Slop Audit & Taste Review
Scans all workspace components against the 21-rule linter and executes the 1-10 Taste Dial consistency auditor:
```bash
# Workspace wide 21-rule anti-slop audit (Python CI script)
python verify-audit.py

# Full catalog taste dial calibration & consistency verification
pnpm review:taste
```

### 4. Run Automated Accessibility CI Linter
Validates WCAG 2.1 AA compliance, keyboard navigability, WAI-ARIA contracts, and motion fallbacks across all 45 registry components:
```bash
pnpm test:a11y
```

### 5. Validate Multi-Agent Ecosystem Rulepacks
Distributes and tests the canonical agent rules across 11 agent platforms:
```bash
# Synchronize all 11 agent rulepack targets from SKILL.md
pnpm sync:rules

# Run automated validation test suite across all 11 platforms
pnpm test:agents
```

### 6. Dynamic DAG Dependency Resolution & Cycle Detection
Generates topological installation sequences and Mermaid flowcharts for the component catalog:
```bash
# Generate dynamic DAG dependency topology for full catalog
pnpm harvest graph packages/registry/src

# Generate dependency graph for a specific component
pnpm harvest graph pricing-table
```

### 7. Run Cloudflare Worker Edge & MCP Sandbox Tests
```bash
# Run MCP sandbox integration test
pnpm test:sandbox

# Run Cloudflare Worker edge deployment test suite (JSON-RPC & SSE)
pnpm --filter @design-wiki/mcp test:worker

# Run all test suites
pnpm test
```

### 8. Use the Native Installer CLI (`design-wiki`)
Install zero-slop components directly into your local Next.js / Vite UI directories:
```bash
# Add a component (resolves components.json, tsconfig path maps, and missing peer dependencies)
npx design-wiki add canvas-fluid-wave

# Install into a specific directory or sandbox with recursive dependency resolution
npx design-wiki add pricing-table --cwd staging/sandbox-nextjs

# List all 45 verified zero-slop components with dials & tags
npx design-wiki list

# Search components by keyword or category
npx design-wiki search dock

# Audit a local folder for AI slop anti-patterns (p-[17px], emojis, etc.)
npx design-wiki audit ./components/ui
```

### 9. Start the Documentation Web Showcase
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the human interface, live component previews, and documentation.


---

## 🤖 The 4-Phase Agent Execution Loop

When an AI coding agent pair-programs in this repository, it follows the mandatory contract defined in [`SKILL.md`](./SKILL.md) and [`.cursorrules`](./.cursorrules):

```
[Phase 1: Discover] ──► Query search_components or /llms.txt
         │
         ▼
[Phase 2: Inspect]  ──► Query fetch_raw_markup for un-truncated TSX source
         │
         ▼
[Phase 3: Install]  ──► Query get_installation_schema & run npx design-wiki add
         │
         ▼
[Phase 4: Audit]    ──► Run audit_code_slop (Require 85+ score & 0 High flags)
         │
         ▼
[Delivery Receipt]  ──► Return structured Integration Receipt to user
```

### Sample Agent Integration Receipt
```markdown
### 📋 Integration Receipt
* **Installed Components**: `['floating-dock', 'bento-grid']`
* **Added Dependencies**: `motion`, `lucide-react`, `clsx`, `tailwind-merge`
* **Taste Profile**: Variance `6`, Motion `8`, Density `4`
* **A11y Status**: WCAG 2.1 AA verified; keyboard navigation + WAI-ARIA toolbar + focus-visible confirmed
* **Anti-Slop Audit**: 0 flags detected (Score: 100/100)
```

---

## 📄 License & Attribution

All curated components in this registry maintain their original open-source licenses (MIT, Apache-2.0, BSD-3-Clause) with immutable legal attribution headers. See individual component schemas or `/r/[name].json` for upstream author credits.
