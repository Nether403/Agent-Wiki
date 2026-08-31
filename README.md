# 🏛️ Machine-First Design Agent Wiki

> **A deterministic, pre-tested, zero-slop UI component registry and Model Context Protocol (MCP) ecosystem engineered specifically for AI developer agents.**

[![Anti-Slop Rules](https://img.shields.io/badge/Anti--Slop%20Rulepack-50%20canonical-blue?style=flat-square)](./packages/audit-linter)
[![Catalog](https://img.shields.io/badge/Catalog-see%20catalog--stats.json-blue?style=flat-square)](./catalog-stats.json)
[![MCP Protocol](https://img.shields.io/badge/MCP-stdio%20Phase%203-blueviolet?style=flat-square)](./packages/mcp-server)
[![Agent Ecosystem](https://img.shields.io/badge/Agents-11%20rulepacks-indigo?style=flat-square)](./scripts/test-agent-ecosystem.ts)
[![React 19 & Tailwind v4](https://img.shields.io/badge/Stack-React%2019%20%7C%20Tailwind%20v4-violet?style=flat-square)](./apps/docs)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](./LICENSE)

Counts, rules, and MCP tools have **one** source of truth: [`CATALOG.md`](./CATALOG.md). Do not copy numbers into docs by hand.

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
                                  │ (HeroUI, Magic UI, XY Flow, Tremor, Paper, KokonutUI)  │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                                [1. Ingestion Harvester]
                                                (ast-parser.ts + dependency-graph.ts)
                                                              │
                                                [2. Dial Scorer & Slop Gate]
                                                (50 anti-slop rules + taste-dial-audit.ts)
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
                └──────────────────────────────┘                              │  - @design-wiki/mcp (stdio)  │
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
│           ├── llms.txt             # Flat agent discovery index (count = catalog-stats.json)
│           └── llms-full.txt        # Full-context machine manifest with embedded source
├── packages/
│   ├── harvester/                   # Ingestion engine, remote JSON fetcher, AST analyzer, DAG dependency graph
│   │   ├── src/ast-parser.ts        # TypeScript Compiler API AST extractor & 25+ library repo manifests
│   │   ├── src/dependency-graph.ts  # Directed Acyclic Graph (DAG) analyzer, cycle detector & Mermaid generator
│   │   ├── src/dial-classifier.ts   # Taste-dial scoring heuristics & 50-rule slop review
│   │   ├── src/codemods/            # Tailwind v4 & React 19 / motion/react transformers
│   │   ├── src/attribution.ts       # Open-source SPDX license header injector
│   │   └── src/cli.ts               # Standalone Harvester CLI (pnpm harvest graph / ingest)
│   ├── registry/                    # Canonical TSX catalog & dynamic registry compiler
│   │   ├── src/                     # TSX sources (ai-native, workflow, primitives, motion, creative, editorial, blocks, media, utility)
│   │   ├── compiler/build-registry.ts # Dynamic component sweeper and /r/ JSON compiler
│   │   └── schema.json              # Component JSON Schema extending shadcn registry-item
│   ├── mcp-server/                  # Model Context Protocol (MCP) service for developer agents
│   │   ├── src/server.ts            # Stdio MCP server (tools in catalog-contract.json, 15KB budget)
│   │   ├── src/security.ts          # Tripwire Security Sandbox (malicious AST scanner, prompt injection defense)
│   │   ├── src/worker.ts            # Cloudflare Worker prototype (not a public endpoint)
│   │   ├── src/embedded-catalog.ts  # 0ms disk dependency embedded snapshot catalog
│   │   ├── src/index.ts             # Stdio transport entrypoint
│   │   ├── test/agent-sandbox.test.ts # Autonomous end-to-end sandbox verification test
│   │   └── test/worker.test.ts      # Cloudflare Worker deployment verification test
│   ├── cli/                         # Native installer & unslop CLI (npx design-wiki add / unslop / compose)
│   │   ├── src/commands/add.ts      # Path map resolver, recursive downloader & peer installer
│   │   ├── src/commands/unslop.ts   # Automated AST/regex refactoring & aesthetic themer
│   │   ├── src/commands/compose.ts  # Full page layout synthesis engine
│   │   ├── src/commands/list.ts     # Component catalog browser with taste dials
│   │   ├── src/commands/audit.ts    # Standalone anti-slop audit scanner
│   │   └── src/index.ts             # Executable CLI router with --theme, --dry-run & --cwd support
│   └── audit-linter/                # 50-rule AST + regex anti-slop verification & unslop refactoring engine
│       ├── src/rules.ts             # 50 Rule definitions (SLOP-001 through SLOP-050)
│       ├── src/evaluate.ts          # Canonical scoring used by MCP, CLI, harvester, eval
│       ├── src/unslop.ts            # Regex remapper; re-scores before/after (no fake 100/100)
│       ├── src/taste-dial-audit.ts  # 1-10 Dial consistency auditor (Variance, Motion, Density)
│       ├── src/dial-classifier.ts   # Standalone dial classifier with defaultDials preset support
│       ├── src/llm-review.ts        # Automated LLM taste audit engine
│       └── src/cli.ts               # verify-audit & taste review CLI (pnpm review:taste)
├── catalog-contract.json            # Human-edited MCP tool contract (live vs retired)
├── catalog-stats.json               # Generated counts (do not hand-edit)
├── CATALOG.md                       # Pointer to counts, rules, and Phase 3–4 track
├── research/                        # Phase 2 harvest notes (not product, not CI)
├── scripts/
│   ├── assert-catalog-truth.ts      # CI gate: counts, SLOP ids, MCP tools, stale phrases
│   ├── inventory-health.ts          # Informational grade histogram for Phase 4 curation
│   ├── sync-rulepacks.ts            # Multi-agent rules synchronizer across 11 ecosystem platforms
│   ├── test-agent-ecosystem.ts      # Automated compatibility test across 11 agent targets
│   └── test-a11y-linter.ts          # Registry a11y metadata + source heuristics (not rendered axe)
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

Component counts are generated at compile time into [`catalog-stats.json`](./catalog-stats.json). Do not hand-edit them. Taxonomy domains:

| Category | Description | Representative Upstream Libraries |
| :--- | :--- | :--- |
| `ui:ai-native` | Agent conversation interfaces, reasoning accordions, streaming tokens, prompt bars, and artifact sandbox frames. | Design Wiki, 21st-dev |
| `ui:workflow` | Interactive node graph canvases, minimap controls, DAG execution inspectors, and whiteboard sketchpads. | XY Flow, Excalidraw, Design Wiki |
| `ui:primitive` | Accessible, headless UI controls, rich date-range pickers, roving tablists, and virtualized comboboxes. | Radix UI, Ark UI, Ariakit, Primer React |
| `ui:editorial` | Strategic blueprints (Cathryn Lavery taxonomy), comparative bar lists, status trackers, and analytical scoreboards. | diagram-design, Tremor, Design Wiki |
| `ui:motion` | Micro-interactions, number tickers, border beams, sparkles text, particle bursts, and spring physics. | Magic UI, SmoothUI, Motion Primitives |
| `ui:creative` | WebGL shaders, Three.js viewports, AI voice orbs, fluid waves, and generative canvas textures. | Paper Shaders, Canvas UI, ThreeUI, Cult UI |
| `ui:block` | Asymmetrical SaaS hero mockups, feature cyclers, competitor matrix grids, and customer stories. | Launch UI, Page UI, Tailark, Kairo UI |
| `ui:media` | Programmatic kinetic title cards, karaoke captions, split video comparators, and audio waveforms. | Remocn, Remotion, Design Wiki |
| `ui:utility` | Animated icon packs, copy buttons, scroll progress bars, and theme dropdowns. | icons0, ReUI, Design Wiki |

---

## 🔌 Model Context Protocol (MCP) Server

AI developer agents connect via the `@design-wiki/mcp` **stdio** server from this repo (`pnpm mcp`). The package is private and is not on npm yet. The Cloudflare Worker is a prototype and is not a public production endpoint. Registry origin: `--registry` or `DESIGN_WIKI_REGISTRY_URL` (see [`CATALOG.md`](./CATALOG.md)).

### Configuration

#### Local checkout
```bash
pnpm mcp
```

```json
{
  "mcpServers": {
    "design-wiki": {
      "command": "pnpm",
      "args": ["mcp"]
    }
  }
}
```

#### Remote Cloudflare Worker (prototype, not a public production endpoint)
The Worker in `packages/mcp-server/src/worker.ts` is experimental. Use local stdio until a deployed edge catalog exists.

### Core MCP Tools

Canonical list: [`catalog-contract.json`](./catalog-contract.json) (`mcpTools`). Aliases are listed beside the primary name.

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `search_library` / `search_components` | `query`, `category`, `tag`, `tier`, dial filters | Unqualified browse = `catalog-core.json`. Keyword search covers the full inventory, core first. |
| `fetch_raw_markup` / `fetch_raw_markdown` / `get_component_markup` | `name` | YAML frontmatter + verified TSX source. |
| `get_installation_schema` / `get_installation_commands` / `get_install_recipe` | `name`, `packageManager`, `baseUrl` | CLI install recipe and peer deps. |
| `get_dependency_graph` | `name?`, `includeMermaid?` | Registry dependency walk for one slug or the full catalog. |
| `audit_code_slop` | `code` | Canonical 50-rule pack in `@design-wiki/audit-linter`. |
| `audit_and_fix_slop` | `code`, `theme` | Regex remapper + re-scored health. Does not assume 100/100. |
| `semantic_search_components` | `naturalLanguageQuery`, `targetDialProfile` | Keyword + dial scoring. Not an embedding index. |
| `compose_layout_tree` | `pageType`, `targetDials` | Page-archetype scaffold. `settings` / `auth-flow` use core slugs only. |
| `verify_accessibility_contrast` | `foregroundHex`, `backgroundHex` | WCAG contrast math (4.5:1 / 3.0:1 / 7.0:1). |

---

## 🛡️ Anti-Slop 50-Rule Specification

Every component ingested or generated is validated against our 50 Anti-Slop Rules:

| Rule ID | Category | Severity | Detection | Target Violation |
| :--- | :--- | :---: | :---: | :--- |
| **SLOP-001** | Styling / Color | Medium | Regex | Hardcoded indigo button or palette (`bg-indigo-600`, `#4f46e5`) |
| **SLOP-002** | Styling / Color | Medium | Regex | Generic purple-to-blue linear gradients (`from-purple-500 to-blue-500`) |
| **SLOP-003** | Styling / Surface | Low | Regex | Blanket unanchored glassmorphism (`bg-white/10 backdrop-blur-md`) |
| **SLOP-004** | TypeScript | **High** | AST | Chained type assertions (`as unknown as`, `as any as`) |
| **SLOP-005** | TypeScript | **High** | AST | Conditional empty object spreads (`...(cond ? { a } : {})`) |
| **SLOP-006** | Motion | Low | Regex | Blanket `transition-all duration-300` across structural wrappers |
| **SLOP-007** | Layout / Spacing | Low | Regex | Non-token arbitrary pixel units (`p-[17px]`, `m-[13px]`, `gap-[15px]`) |
| **SLOP-008** | Iconography | Medium | Regex | Decorative emojis inside buttons/cards instead of SVG vector icons |
| **SLOP-009** | Code Completeness | **High** | Regex | Truncated code comments (`// TODO: implement logic`, mock placeholders) |
| **SLOP-010** | Accessibility | **High** | AST | Interactive elements without accessible text or `aria-label` |
| **SLOP-011** | Accessibility | Medium | AST | Inline SVGs without `role="img"` or accessible `<title>` |
| **SLOP-012** | Accessibility | **High** | AST | Focus outline suppression (`outline-none` without `:focus-visible:ring-2`) |
| **SLOP-013** | Performance | Medium | AST | Layout-triggering transitions (`transition-[height]`) |
| **SLOP-014** | Performance | Medium | AST | Canvas render loop missing `prefers-reduced-motion` media check |
| **SLOP-015** | Performance | Medium | AST | HTML5 Canvas missing static fallback provision |
| **SLOP-016** | Motion | Low | AST | Missing `LayoutGroup` or `AnimatePresence` keys |
| **SLOP-017** | TypeScript | Medium | AST | Implicit `any` props on component exports |
| **SLOP-018** | Styling / Layout | Medium | Regex | Repetitive centered card layouts |
| **SLOP-019** | Architecture | **High** | AST | Deep relative imports bypassing standard aliases |
| **SLOP-020** | Legal / IP | **High** | Regex | Missing mandatory upstream license attribution headers |
| **SLOP-021** | Styling / Surface | Medium | Regex | Raw unshaded backgrounds (`bg-white`, `bg-black`, `bg-[#fff]`) without dark variants |
| **SLOP-022** | AI Prose | Medium | Regex | AI writing clichés (*"In today's fast-paced world"*, *"Unleash the power"*) |
| **SLOP-023** | TypeScript | **High** | AST | Oxlint contract hygiene: rejects loose `any` signatures |
| **SLOP-024** | Accessibility | **High** | AST | Strict WCAG 2.1 AA contrast ratio validation (< 4.5:1 ratio) |
| **SLOP-025** | Memory / Leak | **High** | AST | Uncancelled timers (`setInterval`) & event listeners in `useEffect` |
| **SLOP-026** | Styling / Color | Medium | Regex | Arbitrary hex color escapes in classes (`text-[#6366f1]`) |
| **SLOP-027** | React Hygiene | Medium | AST | Unbounded list rendering without stable `key` props |
| **SLOP-028** | Motion Physics | Low | AST | Missing spring fallback damping parameters |
| **SLOP-029** | SVG Scalability | Low | AST | Hardcoded SVG dimensions without scalable `viewBox` |
| **SLOP-030** | Legal / SPDX | **High** | Regex | Clean SPDX & origin header verification (`@origin`, `@license`, `@curated-by`) |
| **SLOP-031** | Runtime Resilience | Medium | AST | Missing static fallback UI or ErrorBoundary for complex Canvas/WebGL views |
| **SLOP-032** | Memory / Heap | **High** | AST | Unbounded object allocation inside `requestAnimationFrame` render loops |
| **SLOP-033** | Accessibility | **High** | AST | Missing Escape key overlay dismissal listener on custom dialogs/modals |
| **SLOP-034** | Architecture | Medium | AST | Redundant nested identical React context providers |
| **SLOP-035** | Performance | Medium | AST | Un-memoized heavy array sort or filter directly in JSX render return |
| **SLOP-036** | Copy / Validity | Medium | Regex | Hallucinated static marketing metrics ('99.9% Faster') without dynamic props |
| **SLOP-037** | Interaction | **High** | AST | Dummy `onSubmit` form handler without validation or loading states |
| **SLOP-038** | Mobile / Layout | Medium | Regex | Mobile viewport height cutoff (`h-screen` instead of `min-h-[100dvh]`) |
| **SLOP-039** | Accessibility | **High** | AST | Global focus outline suppression stripping tab accessibility |
| **SLOP-040** | Semantics | Medium | AST | Non-semantic div soup navigation lacking `<nav>` or `<header>` landmark |
| **SLOP-041** | Mobile / Layout | Medium | Regex | Dynamic viewport unit omission (`h-screen` lacking `dvh`/`svh` fallback) |
| **SLOP-042** | Styling / Hierarchy | Low | Regex | Unbounded arbitrary high z-index clashes (`z-[9999]`, `z-[99999]`) |
| **SLOP-043** | Accessibility | **High** | AST | Dynamic AI message streaming container lacking `aria-live` or `role="status"` |
| **SLOP-044** | Performance | **High** | AST | Uncleaned window resize or animation listener leak in `useEffect` |
| **SLOP-045** | Layout | Medium | Regex | Hardcoded large min-width on mobile containers (`min-w-[800px]`) |
| **SLOP-046** | Semantics / A11y | **High** | AST | Nested interactive control trap (button inside anchor or button) |
| **SLOP-047** | Copy / Validity | Medium | Regex | Hardcoded non-provable SLA statistics ('100% Guaranteed', 'Zero Downtime') |
| **SLOP-048** | DOM Health | Low | AST | Excessive redundant wrapper nesting (> 6 adjacent divs) |
| **SLOP-049** | Web Vitals | Medium | AST | External image lacking lazy loading or decoding attributes |
| **SLOP-050** | Typography | Low | Regex | Custom font-family override lacking generic system fallbacks |

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
Scans registry sources against the canonical 50-rule pack and the 1-10 Taste Dial consistency auditor:
```bash
# Full catalog taste dial calibration & consistency verification
pnpm review:taste
```

### 4. Run Automated Accessibility CI Linter
Checks registry a11y metadata contracts and a few source heuristics (not a rendered WCAG suite):
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

### 6. Run Autonomous Sandbox & Security Tests
```bash
# Run MCP sandbox integration & Tripwire security test
pnpm test:sandbox

# Run Cloudflare Worker edge deployment test suite (JSON-RPC & SSE)
pnpm --filter @design-wiki/mcp test:worker

# Run all test suites
pnpm test
```

### 7. Use the Native Installer & Unslop CLI (`design-wiki`)
Install zero-slop components directly or auto-remediate messy vibe-coded code:
```bash
# Add a component by slug (resolves components.json, path maps, and peer deps)
npx design-wiki add floating-dock

# Auto-remediate slop code into high-craft TSX with aesthetic theming
npx design-wiki unslop ./components/ui/hero.tsx --theme neo-tokyo

# Preview unslop changes without writing to disk
npx design-wiki unslop ./components/ui --theme midnight --dry-run

# List catalog components with dials & tags
npx design-wiki list

# Search components by keyword or category
npx design-wiki search dock

# Audit a local folder for AI slop anti-patterns
npx design-wiki audit ./components/ui
```

### 8. Start the Documentation Web Showcase
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the human interface, live component previews, and documentation.

---

## 🤖 The 4-Phase Agent Execution Loop

When an AI coding agent pair-programs in this repository, it follows the mandatory contract defined in [`SKILL.md`](./SKILL.md) and [`.cursorrules`](./.cursorrules):

```
[Phase 1: Discover] ──► Query search_components or /llms.txt (<15KB payload)
         │
         ▼
[Phase 2: Inspect]  ──► Query fetch_raw_markup for un-truncated TSX source
         │
         ▼
[Phase 3: Install]  ──► Query get_installation_schema & run npx design-wiki add
         │
         ▼
[Phase 4: Audit]    ──► Run audit_code_slop / audit_and_fix_slop (Require 85+ score)
         │
         ▼
[Delivery Receipt]  ──► Return structured Integration Receipt to user
```

### Sample Agent Integration Receipt
```markdown
### 📋 Integration Receipt
* **Installed Components**: `['floating-dock', 'ai-prompt-input']`
* **Added Dependencies**: `motion`, `lucide-react`, `clsx`, `tailwind-merge`
* **Taste Profile**: Variance `6`, Motion `7`, Density `4`
* **A11y Status**: keyboard navigation + WAI-ARIA metadata on those slugs (rendered axe is Phase 4)
* **Anti-Slop Audit**: canonical linter score (example: 100/100 when the installed source is clean)
```

---

## 📄 License & Attribution

All curated components in this registry maintain their original open-source licenses (MIT, Apache-2.0, BSD-3-Clause) with immutable legal attribution headers. See individual component schemas or `/r/[name].json` for upstream author credits.
