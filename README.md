# 🏛️ Machine-First Design Agent Wiki

> **A deterministic, pre-tested, zero-slop UI component registry and Model Context Protocol (MCP) ecosystem engineered specifically for AI developer agents.**

[![CI / Quality Gate](https://img.shields.io/badge/Slop%20Audit-100%2F100%20(S--Grade)-emerald?style=flat-square)](./COMPLETED-DESIGN-AUDIT.md)
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
                                  │     (HeroUI, SmoothUI, Aceternity, Canvas UI, ReUI)    │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                               [1. Ingestion Harvester]
                                               (ast-parser.ts + cloner)
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
│       └── public/r/                # Compiled static shadcn JSON schemas and registry.json
├── packages/
│   ├── harvester/                   # Ingestion engine, shallow git cloner, AST analyzer, slop blocker
│   │   ├── src/ast-parser.ts        # TypeScript Compiler API AST extractor & repo manifests
│   │   ├── src/dial-classifier.ts   # Taste-dial scoring heuristics & 21-rule slop review
│   │   ├── src/codemods/            # Tailwind v4 & React 19 / motion/react transformers
│   │   ├── src/attribution.ts       # Open-source SPDX license header injector
│   │   └── src/cli.ts               # Standalone Harvester CLI (pnpm harvest)
│   ├── registry/                    # 29+ seed zero-slop components & dynamic registry compiler
│   │   ├── src/                     # TSX source files (primitives, motion, creative, editorial, blocks, media, utility)
│   │   ├── compiler/build-registry.ts # Dynamic component sweeper and /r/ JSON compiler
│   │   └── schema.json              # Component JSON Schema extending shadcn registry-item
│   ├── mcp-server/                  # Model Context Protocol (MCP) service for developer agents
│   │   ├── src/server.ts            # search_library, fetch_raw_markup, get_installation_schema (<15KB)
│   │   ├── src/index.ts             # Stdio transport entrypoint
│   │   └── test/agent-sandbox.test.ts # Autonomous end-to-end sandbox verification test
│   ├── cli/                         # Native installer CLI (npx design-wiki add <slug>)
│   │   ├── src/commands/add.ts      # Path map resolver, recursive downloader & peer installer
│   │   ├── src/commands/list.ts     # Component catalog browser with taste dials
│   │   ├── src/commands/audit.ts    # Standalone anti-slop audit scanner
│   │   └── src/index.ts             # Executable CLI router
│   └── audit-linter/                # 21-rule AST + regex anti-slop verification & taste auditing
│       ├── src/rules.ts             # Rule definitions (SLOP-001 through SLOP-021) & scanCssAntiPatterns
│       ├── src/llm-review.ts        # Automated LLM taste audit & 1-10 dial calibration engine
│       └── src/cli.ts               # verify-audit & taste review CLI (pnpm review:taste)
├── skills/
│   └── design-system-agent/         # Portable agent skillpacks for Claude Code, Cursor, and Codex
│       ├── SKILL.md                 # Agent execution contract and 4-phase loop
│       ├── .cursorrules             # Cursor agent instructions and dial configurations
│       └── claude-code-config.json  # Claude Code MCP integration manifest
├── registry-item-schema.json        # Canonical JSON schema for registry items
├── verify-audit.py                  # Python audit runner fallback
└── pnpm-workspace.yaml              # Workspace package configuration
```

---

## 🏷️ Standardized Taxonomy Framework

All components are classified into a canonical taxonomy framework:

| Category | Description | Representative Upstream Libraries |
| :--- | :--- | :--- |
| `ui:primitive` | Accessible, headless, battle-tested UI controls (buttons, dialogs, dropdowns, inputs, tabs). | HeroUI, Radix UI, Ark UI, ReUI, beUI |
| `ui:motion` | Micro-interactions, spring physics, and animated transitions built with `motion/react`. | SmoothUI, KokonutUI, Aceternity UI, Evil-Buttons |
| `ui:creative` | Interactive HTML5 Canvas simulations, WebGL shaders, Three.js scenes with graceful CSS fallbacks. | Canvas UI, ThreeUI, React Bits |
| `ui:editorial` | Clean, static, typography-disciplined analytical cards and SVG diagrams free of decorative clutter. | diagram-design |
| `ui:block` | Complete multi-component sections, bento grids, navigation headers, and marketing hero wrappers. | Tailark, Kairo UI, Shadcn blocks |
| `ui:utility` | Fast micro-assets, status indicators, and specialized dot matrix loaders. | Dot Matrix, icons0 |
| `ui:media` | Timeline-based motion wrappers, audio visualizers, and video compositions. | Remocn |

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
Scans all workspace components against the 20-rule linter and generates `COMPLETED-DESIGN-AUDIT.md`:
```bash
# Workspace wide 20-rule anti-slop audit
pnpm lint:slop

# Automated taste audit & 1-10 dial calibration on a specific component
pnpm review:taste packages/registry/src/creative/canvas-fluid-wave.tsx
```

### 4. Use the Native Installer CLI (`design-wiki`)
Install zero-slop components directly into your local Next.js / Vite UI directories:
```bash
# Add a component (resolves components.json, tsconfig path maps, and missing peer dependencies)
npx design-wiki add canvas-fluid-wave

# List all 27 verified zero-slop components with dials & tags
npx design-wiki list

# Search components by keyword or category
npx design-wiki search dock

# Audit a local folder for AI slop anti-patterns (p-[17px], emojis, etc.)
npx design-wiki audit ./components/ui
```

### 5. Run Autonomous Agent Sandbox Test
Simulates an AI agent executing the 4-phase loop (**Discover &rarr; Inspect &rarr; Install &rarr; Audit**) with zero human intervention:
```bash
pnpm test:sandbox
```

### 6. Harvest Upstream Repositories
Run the ingestion engine to shallow-clone, parse AST, and evaluate upstream libraries:
```bash
# Harvest a specific repository
pnpm harvest repo smoothui

# Harvest a local directory
pnpm harvest dir ./packages/registry/src/motion

# Audit a single file
pnpm harvest file ./packages/registry/src/creative/canvas-fluid-wave.tsx

# List available upstream catalog targets
pnpm harvest list
```

### 7. Start the Documentation Web Showcase
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the human interface, live component previews, and documentation.


---

## 🤖 The 4-Phase Agent Execution Loop

When an AI coding agent pair-programs in this repository, it follows the mandatory contract defined in [`skills/design-system-agent/SKILL.md`](./skills/design-system-agent/SKILL.md) and [`.cursorrules`](./.cursorrules):

```
[Phase 1: Discover] ──► Query search_components or /llms.txt
         │
         ▼
[Phase 2: Inspect]  ──► Query fetch_raw_markup for un-truncated TSX source
         │
         ▼
[Phase 3: Install]  ──► Query get_installation_schema & run npx shadcn add
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
* **Taste Profile**: Variance `6`, Motion `7`, Density `5`
* **A11y Status**: WCAG 2.1 AA verified; keyboard navigation + focus-visible confirmed
* **Anti-Slop Audit**: 0 flags detected (Score: 100/100)
```

---

## 📄 License & Attribution

All curated components in this registry maintain their original open-source licenses (MIT, Apache-2.0, BSD-3-Clause) with immutable legal attribution headers. See individual component schemas or `/r/[name].json` for upstream author credits.
