# 🏛️ Machine-First Design Agent Wiki

> **A deterministic, pre-tested, zero-slop UI component registry and Model Context Protocol (MCP) ecosystem engineered specifically for AI developer agents.**

[![CI / Quality Gate](https://img.shields.io/badge/Slop%20Audit-100%2F100%20(S--Grade)-emerald?style=flat-square)](./COMPLETED-DESIGN-AUDIT.md)
[![A11y CI](https://img.shields.io/badge/A11y%20WCAG%202.1%20AA-30%2F30%20PASS-green?style=flat-square)](./scripts/test-a11y-linter.ts)
[![MCP Protocol](https://img.shields.io/badge/MCP%20Server-Compliant%20v1.0-blue?style=flat-square)](./packages/mcp-server)
[![React 19 & Tailwind v4](https://img.shields.io/badge/Stack-React%2019%20%7C%20Tailwind%20v4-violet?style=flat-square)](./apps/docs)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](./LICENSE)

---

## 📖 Executive Summary

Modern frontend engineering is undergoing a tectonic shift: **AI coding agents (Claude Code, Cursor, Codex, v0) are becoming the primary assemblers of code primitives**, while human engineers focus on visual curation, high-level architecture, and quality assurance.

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
                                                (ast-parser.ts + git cloner)
                                                              │
                                                [2. Dial Scorer & Slop Gate]
                                                (21 anti-slop rules + LLM review)
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
                └──────────────────────────────┘                              │  - @design-wiki/mcp Server   │
                                                                              │  - /SKILL.md (agent rules)   │
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
│       ├── content/docs/            # MDX architectural guides and setup manuals
│       └── public/                  # Static build artifacts served by the docs app
│           ├── r/                   # Compiled shadcn JSON schemas and registry.json index
│           ├── raw/components/      # Machine-first markdown with YAML frontmatter and TSX source
│           ├── SKILL.md             # Public endpoint for remote LLM agent skill discovery
│           ├── llms.txt             # Flat agent discovery index
│           └── llms-full.txt        # Full-context machine manifest with embedded source
├── packages/
│   ├── harvester/                   # Ingestion engine, shallow git cloner, AST analyzer, slop blocker
│   │   ├── src/ast-parser.ts        # TypeScript Compiler API AST extractor & 8-library repo manifests
│   │   ├── src/dial-classifier.ts   # Taste-dial scoring heuristics & 21-rule slop review
│   │   ├── src/codemods/            # Tailwind v4 & React 19 / motion/react transformers
│   │   ├── src/attribution.ts       # Open-source SPDX license header injector
│   │   └── src/cli.ts               # Standalone Harvester CLI (pnpm harvest ingest <repo>)
│   ├── registry/                    # 30 seed zero-slop components & dynamic registry compiler
│   │   ├── src/                     # TSX source files (primitives, motion, creative, editorial, blocks, media, utility)
│   │   ├── compiler/build-registry.ts # Dynamic component sweeper and /r/ JSON compiler
│   │   └── schema.json              # Component JSON Schema extending shadcn registry-item
│   ├── mcp-server/                  # Model Context Protocol (MCP) service for developer agents
│   │   ├── src/server.ts            # search_library, fetch_raw_markup, get_installation_schema (<15KB budget)
│   │   ├── src/index.ts             # Stdio transport entrypoint
│   │   └── test/agent-sandbox.test.ts # Autonomous end-to-end sandbox verification test
│   ├── cli/                         # Native installer CLI (npx design-wiki add <slug>)
│   │   ├── src/commands/add.ts      # Path map resolver, recursive downloader & peer installer
│   │   ├── src/commands/list.ts     # Component catalog browser with taste dials
│   │   ├── src/commands/audit.ts    # Standalone anti-slop audit scanner
│   │   └── src/index.ts             # Executable CLI router with --cwd & --path support
│   └── audit-linter/                # 21-rule AST + regex anti-slop verification & taste auditing
│       ├── src/rules.ts             # Rule definitions (SLOP-001 through SLOP-021) & scanCssAntiPatterns
│       ├── src/dial-classifier.ts   # Standalone dial classifier with defaultDials preset support
etch_raw_markup, get_installation_schema (<15KB)
│   │   ├── src/index.ts             # Stdio transport entrypoint
│   │   └── test/agent-sandbox.test.ts # Autonomous end-to-end sandbox verification test
│   ├── cli/                         # Native installer CLI (npx design-wiki add <slug>)
│   │   ├── src/commands/add.ts      # Path map resolver, recursive downloader & peer installer
│   │   ├── src/commands/list.ts     # Component catalog browser with taste dials
│   │   ├── src/commands/audit.ts    # Standalone anti-slop audit scanner
│   │   └── src/index.ts             # Executable CLI router
│   └── audit-linter/                # 21-rule AST + regex anti-slop verification & taste auditing
│       ├── src/rules.ts             # Rule definitions (SLOP-001 through SLOP-021) & scanCssAntiPatterns
│       ├── src/dial-classifier.ts   # Standalone dial classifier with defaultDials preset support
│       ├── src/llm-review.ts        # Automated LLM taste audit & 1-10 dial calibration engine
│       └── src/cli.ts               # verify-audit & taste review CLI (pnpm review:taste)
├── scripts/
│   ├── sync-rulepacks.ts            # IDE rulepack synchronizer: SKILL.md → .cursorrules, .windsurfrules, copilot, codex
│   └── test-a11y-linter.ts          # WCAG 2.1 AA CI linter: checks all 29 registry components
├── SKILL.md                         # Agent execution contract, 4-phase loop, active taste dials
├── .cursorrules                     # Cursor IDE agent instructions (auto-synced from SKILL.md)
├── .windsurfrules                   # Windsurf IDE agent instructions (auto-synced from SKILL.md)
├── .github/copilot-instructions.md  # GitHub Copilot agent instructions (auto-synced from SKILL.md)
├── .codex-plugin/rules.json         # OpenAI Codex ruleset (auto-synced from SKILL.md)
├── registry-item-schema.json        # Canonical JSON schema for registry items
└── pnpm-workspace.yaml              # Workspace package configuration
```

---

## 🏷️ Standardized Taxonomy Framework

All components are classified into a canonical taxonomy framework:

| Category | Description | Representative Upstream Libraries |
| :--- | :--- | :--- |
| `ui:primitive` | Accessible, headless, battle-tested UI controls (buttons, dialogs, dropdowns, inputs, tabs). | HeroUI v3, Radix UI, Ark UI, beUI |
| `ui:motion` | Micro-interactions, spring physics, and animated transitions built with `motion/react`. | SmoothUI, KokonutUI, Aceternity UI, Evil-Buttons |
| `ui:creative` | Interactive HTML5 Canvas simulations, WebGL shaders, Three.js scenes with graceful CSS fallbacks. | Canvas UI, ThreeUI, React Bits |
| `ui:editorial` | Clean, static, typography-disciplined analytical cards and SVG diagrams free of decorative clutter. | diagram-design |
| `ui:block` | Complete multi-component sections, bento grids, navigation headers, and marketing hero wrappers. | Tailark, Kairo UI, Shadcn blocks |
| `ui:utility` | Fast micro-assets, status indicators, and specialized dot matrix loaders. | Dot Matrix, icons0 |
| `ui:media` | Timeline-based motion wrappers, audio visualizers, and video compositions. | Remocn |

### Curated Library Mapping Matrix

All incoming components from our 7 primary curated libraries are pre-classified with standardized technical tags and preset taste dials:

| Library | Category | Technical Tags | Preset Dials (Var / Mot / Den) |
| :--- | :--- | :--- | :--- |
| **Aceternity UI** | `ui:motion` | `framer-motion`, `tailwind-v4`, `micro-interaction` | Var: 6 · Mot: 8 · Den: 4 |
| **Canvas UI** | `ui:creative` | `threejs`, `webgl`, `framer-motion`, `interactive` | Var: 9 · Mot: 9 · Den: 3 |
| **diagram-design** | `ui:editorial` | `svg`, `zero-dependency`, `static`, `analytical` | Var: 5 · Mot: 1 · Den: 9 |
| **HeroUI v3** | `ui:primitive` | `react`, `tailwind-v4`, `headless`, `accessible` | Var: 3 · Mot: 3 · Den: 6 |
| **Evil-Buttons** | `ui:motion` | `playful`, `framer-motion`, `sound-physics` | Var: 8 · Mot: 7 · Den: 5 |
| **SmoothUI** | `ui:motion` | `framer-motion`, `shadcn-compatible`, `spring-physics` | Var: 4 · Mot: 6 · Den: 5 |
| **Tailark** | `ui:block` | `tailwind-v4`, `marketing`, `bento-grid` | Var: 5 · Mot: 4 · Den: 6 |

---

## 🎛️ The Taste-Dial Matrix

AI coding agents calibrate interface generation using three quantifiable **1–10 Taste Dials**:

```
Dial Axis            Low (1 - 3)                    Medium (4 - 7)                   High (8 - 10)
───────────────────────────────────────────────────────────────────────────────────────────────────
DESIGN_VARIANCE      Rigid, centered grid;          Subtle asymmetrical offsets;     Avant-garde editorial;
                     conservative padding           editorial line dividers          brutalist overlaps
───────────────────────────────────────────────────────────────────────────────────────────────────
MOTION_INTENSITY     CSS hover transitions;         Spring-based layout animations;  GPU WebGL shaders;
                     static cards                   staggered entrances              canvas mouse trackers
───────────────────────────────────────────────────────────────────────────────────────────────────
VISUAL_DENSITY       Generous whitespace;           Balanced SaaS presentation;      Dense analytical tables;
                     py-24 sections                 comfortable rhythm               compact multi-pane UI
```

---

## 🔌 Model Context Protocol (MCP) Server

AI developer agents connect to the registry via the `@design-wiki/mcp` server.

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

### Core MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `search_library` / `search_components` | `query`, `category`, `tag`, `minMotionIntensity`, `maxVisualDensity`, `minDesignVariance` | Searches the catalog with multi-dimensional filtering across 29+ zero-slop components (< 15KB payload). |
| `fetch_raw_markup` / `fetch_raw_markdown` | `name` (slug) | Returns complete raw Markdown with structured YAML frontmatter contract, taxonomy, complexity, taste dials, accessibility, and verified TSX source. *(Alias: `get_component_markup`)* |
| `get_installation_schema` / `get_installation_commands` | `name` (slug), `packageManager` (`pnpm`, `npm`, `bun`, `yarn`), `baseUrl` | Returns exact CLI commands (`npx design-wiki add <slug>`, `npx shadcn@latest add ...`), peer npm install strings, import snippets, and instructions. *(Alias: `get_install_recipe`)* |
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

# Automated taste audit & 1-10 dial calibration on a specific component
pnpm review:taste packages/registry/src/creative/canvas-fluid-wave.tsx
```

### 4. Run Automated Accessibility CI Linter
Validates WCAG 2.1 AA compliance, keyboard navigability, WAI-ARIA contracts, and motion fallbacks across all 30 registry components:
```bash
pnpm test:a11y
```

### 5. Sync IDE Rulepacks from SKILL.md
Distributes the canonical agent rules from `SKILL.md` into all supported IDE configurations:
```bash
pnpm sync:rules
# Synchronizes: .cursorrules, .windsurfrules, .github/copilot-instructions.md, .codex-plugin/rules.json
# Also publishes: apps/docs/public/SKILL.md (remote endpoint for LLM agents)
```

### 6. Use the Native Installer CLI (`design-wiki`)
Install zero-slop components directly into your local Next.js / Vite UI directories:
```bash
# Add a component (resolves components.json, tsconfig path maps, and missing peer dependencies)
npx design-wiki add canvas-fluid-wave

# Install into a specific directory or sandbox with recursive dependency resolution
npx design-wiki add pricing-table --cwd staging/sandbox-nextjs

# List all 30 verified zero-slop components with dials & tags
npx design-wiki list

# Search components by keyword or category
npx design-wiki search dock

# Audit a local folder for AI slop anti-patterns (p-[17px], emojis, etc.)
npx design-wiki audit ./components/ui
```

### 7. Run Autonomous Agent Sandbox Trial & MCP Tests
Simulates an AI agent executing the 4-phase loop (**Discover → Inspect → Install → Audit**) with zero human intervention:
```bash
# Run MCP sandbox integration test
pnpm --filter @design-wiki/mcp test:sandbox

# Run end-to-end Agent Sandbox trial (Pricing table discovery & installation in Next.js sandbox)
pnpm tsx scripts/run-agent-sandbox.ts
```

### 8. Harvest Upstream Repositories & Ingest Components
Run the end-to-end ingestion engine to clone, parse AST, score taste dials, inject YAML frontmatter, and rebuild the registry:
```bash
# End-to-end ingestion pipeline (e.g. KokonutUI)
node ast-parse-ingest.js kokonutui
# Or via harvester CLI
pnpm harvest ingest kokonutui

# Harvest a specific repository
pnpm harvest repo smoothui

# Harvest a local directory
pnpm harvest dir ./packages/registry/src/motion

# Audit a single file
pnpm harvest file ./packages/registry/src/creative/canvas-fluid-wave.tsx

# List available upstream catalog targets
pnpm harvest list
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
