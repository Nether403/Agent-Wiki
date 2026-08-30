# 🗺️ Comprehensive Project Plan: Machine-First Design Agent Wiki

This document defines the production engineering plan, architectural blueprints, curation strategies, and integration protocols for the **Machine-First Design Agent Wiki**. Engineered specifically for AI coding agents (Claude Code, Cursor, Codex, v0), this platform delivers contextual UI patterns, accessible layouts, and dependency trees directly into model context windows while enforcing rigorous "anti-slop" design guardrails.

---

## 1. Executive Summary & Core Value Proposition

Modern frontend engineering is undergoing a tectonic shift: **developer agents are becoming the primary consumers and assemblers of code primitives**, while human engineers focus on visual curation, high-level architecture, and quality assurance.

Traditional component libraries (such as MUI, Chakra, or standard documentation sites) were designed for human visual browsing—relying on heavy DOM payloads, extensive explanatory prose, and visual trial-and-error. When an AI agent is forced to build interfaces from generic training weights or unstructured documentation, it inevitably produces **"AI Slop"**:
*   Hallucinated component props and nonexistent imports.
*   Chained type assertions (`as any as ComponentProps`).
*   Arbitrary, non-token spacing overrides (`p-[17px]`, `mt-[13px]`).
*   Banned visual clichés (the indigo-600 button, the purple-to-blue linear gradient, decorative emoji grids, and blanket glassmorphism).
*   Catastrophic accessibility failures (unlabeled icons, missing ARIA bindings, unhandled keyboard navigation).

The **Machine-First Design Agent Wiki** flips this paradigm. By providing deterministic, pre-tested, zero-slop component registries exposed through ultra-lean flat files and the Model Context Protocol (MCP), agents operate in a finite, grounded token space.

### Core Key Performance Indicators (KPIs):
| Metric | Benchmark Target | Verification Method |
| :--- | :--- | :--- |
| **Zero-Draft Fidelity** | **>90%** first-run compilation | Headless Docker sandbox running agent code with `tsc --noEmit` & Vite/Next build |
| **Slop Conformance** | **0** high-severity slop flags | Automated AST & regex linter (`verify-audit`) in CI |
| **Context Payload Size** | **<15 KB** per component | Byte inspection on `/r/[name].json` and `/raw/` endpoints |
| **CLI Resolution Speed** | **<1.5 seconds** per install | Benchmark queries against remote CDN edge nodes |
| **Accessibility Coverage** | **100% WCAG 2.1 AA** | Automated Axe-core and Playwright keyboard navigation suite |

---

## 2. Technical System Architecture

The system operates on a **Double-Exposure Architecture**: human designers interact with an aesthetic Fumadocs frontend, while AI agents consume ultra-lean, machine-optimized endpoints.

```
                                 ┌────────────────────────────────────────────────────────┐
                                 │                   Curated Repositories                 │
                                 │       (Aceternity, ReUI, beUI, Canvas UI, Kokonut)     │
                                 └───────────────────────────┬────────────────────────────┘
                                                             │
                                              [1. Ingestion Harvester]
                                                             │
                                              [2. AST Parser & Codemod Engine]
                                                             │
                                              [3. Taste-Dial & A11y Classifier]
                                                             │
                                              [4. Static Registry Compiler]
                                                             │
                              ┌──────────────────────────────┴──────────────────────────────┐
                              ▼                                                             ▼
               ┌──────────────────────────────┐                              ┌──────────────────────────────┐
               │       Human Interface        │                              │      Machine Interface       │
               │   (Next.js 15 + Fumadocs)    │                              │  - /llms.txt & /llms-full.txt│
               │ - Interactive Sandpack Demos │                              │  - /raw/components/*.md      │
               │ - Tailwind v4 Theme Switcher │                              │  - /r/[name].json (shadcn v3)│
               │ - Taste Dial Playground      │                              │  - /r/registry.json Index    │
               └──────────────────────────────┘                              │  - @design-wiki/mcp Server   │
                                                                             └──────────────────────────────┘
```

### 2.1 Workspace & Monorepo Topology
To ensure isolation, high maintainability, and clean dependency management, the project is structured as a `pnpm` monorepo orchestrated with Turborepo:

```
design-agent-wiki/
├── apps/
│   └── docs/                      # Next.js 15 App Router + Fumadocs v14 + Tailwind v4
│       ├── content/docs/          # Curated component MDX documentation
│       ├── app/
│       │   ├── (home)/            # Human landing page and interactive showcase
│       │   ├── docs/              # Fumadocs documentation shell
│       │   ├── llms.txt/route.ts  # Machine discovery index generator
│       │   ├── raw/[...slug]/     # Clean markdown stream generator
│       │   └── r/[name]/route.ts  # Programmatic JSON component proxy
│       └── public/r/              # Pre-compiled static registry endpoints
├── packages/
│   ├── registry/                  # Master component source files & schema definitions
│   │   ├── src/                   # Raw TSX/JSX component source files
│   │   ├── schema.json            # JSON Schema extending shadcn registry-item
│   │   └── compiler/              # build-registry.ts (generates static /r/ artifacts)
│   ├── harvester/                 # Ingestion engine (AST parser, codemods, crawler)
│   │   ├── src/ast-parser.ts      # TypeScript Compiler API AST extractor
│   │   ├── src/codemods/          # Tailwind v4 converter & React 19 adapter
│   │   └── src/dial-classifier.ts # Taste-dial assignment heuristics & LLM judge
│   ├── mcp-server/                # Model Context Protocol service
│   │   ├── src/index.ts           # MCP Stdio & Streamable HTTP entrypoints
│   │   └── src/tools/             # search_components, get_component, audit_slop
│   └── audit-linter/              # Anti-slop verification package
│       ├── src/rules/             # 20+ AST & regex anti-slop rules
│       └── src/cli.ts             # verify-audit CLI and GitHub Action wrapper
├── skills/
│   └── design-system-agent/       # Portable SKILL.md, .cursorrules, Claude Code pack
└── pnpm-workspace.yaml
```

### 2.2 The Human Documentation Layer (`apps/docs`)
*   **Framework**: Next.js 15 (App Router) utilizing React 19 and Fumadocs v14+.
*   **Performance**: Statically exported (`output: 'export'` or edge-cached ISR) with zero server-side latency.
*   **Interactive Playgrounds**: Sandpack-driven live previews allowing designers to toggle Tailwind v4 themes and simulate different Taste Dial levels (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`).

### 2.3 The Machine Interfaces Layer
*   **`/llms.txt` and `/llms-full.txt`**: Standardized, compact manifest summarizing available categories, component slugs, taste dials, and installation commands. Generated dynamically at build time via Fumadocs Loader API.
*   **`/raw/components/[slug].md`**: Serves clean, token-efficient Markdown representations of component usage, strict TypeScript interfaces, dependency requirements, and a11y recipes without navigation or layout chrome.
*   **`/r/[name].json`**: Programmatic endpoint adhering to the shadcn v3 registry schema. Includes escaped file contents, peer npm dependencies, registry dependencies, Tailwind v4 theme variables, and taste dial metadata for instantaneous injection.
*   **`/r/registry.json`**: Master index of all registered items for rapid agent discovery and fuzzy matching.

### 2.4 The Model Context Protocol (MCP) Server (`packages/mcp-server`)
AI developer agents connect to the wiki through the official `@design-wiki/mcp` server:
*   **Transport Modes**:
    *   **Local Stdio**: Packaged as `npx @design-wiki/mcp`, enabling instant, zero-latency integration with local Claude Code and Cursor sessions.
    *   **Streamable HTTP (SSE)**: Deployed on Cloudflare Workers / Node.js for remote agent integrations (e.g. web-hosted agents or CI pipelines).
*   **MCP Tools Defined**:
    1.  `search_components`: Queries catalog by keywords, categories (`ui:primitive`, `ui:creative`, etc.), technical tags (`webgl`, `framer-motion`), or target taste dials.
    2.  `get_component_markup`: Returns the escaped TSX source code, peer dependencies, and styling recipes for a specific component.
    3.  `get_install_recipe`: Returns the exact CLI commands (`npx shadcn add ...`) and `package.json` updates needed.
    4.  `audit_code_slop`: Analyzes submitted code snippets against our anti-slop checklist and returns a detailed remediation receipt.

---

## 3. Taxonomy, Data Schemas & Taste-Dial Matrix

To ensure deterministic agent behavior, all registry components are indexed using a standardized taxonomy and strict JSON Schema.

### 3.1 Taxonomy Categories
1.  `ui:primitive`: Accessible, headless, battle-tested UI controls (buttons, dialogs, dropdowns, inputs) based on Radix UI, Ark UI, or HeroUI.
2.  `ui:motion`: Micro-interactions, spring physics, and animated transitions built with `motion/react` (SmoothUI, KokonutUI, motion-primitives).
3.  `ui:creative`: High-fidelity interactive WebGL shaders, Three.js canvases, and GPU-driven backdrops (Canvas UI, React Bits, ThreeUI).
4.  `ui:editorial`: Clean, structured typography, analytical data blocks, and brutalist/minimalist layouts (diagram-design).
5.  `ui:block`: Complete, multi-component page sections, bento grids, navigation headers, and hero wrappers (Tailark, Kairo UI, Shadcn blocks).
6.  `ui:media`: Timeline-based video wrappers, audio visualizations, and dynamic media compositions (Remocn).
7.  `ui:utility`: Micro-systems, specialized SVG icon loaders, and animated matrices (Dot Matrix, icons0).

### 3.2 The Taste-Dials Matrix
Agents calibrate interface output using three quantifiable 1–10 dials:

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

### 3.3 Component Registry JSON Schema
All items conform to `registry-item-schema.json` (extending `https://ui.shadcn.com/schema/registry-item.json`):
```json
{
  "name": "canvas-fluid-wave",
  "type": "registry:component",
  "title": "Canvas Fluid Wave",
  "description": "Interactive WebGL fluid shader with GPU mouse tracking and fallback.",
  "category": "ui:creative",
  "tags": ["webgl", "threejs", "canvas", "interactive"],
  "dials": {
    "design_variance": 8,
    "motion_intensity": 9,
    "visual_density": 3
  },
  "a11y": {
    "keyboard_navigable": false,
    "wai_aria_compliant": true,
    "fallback_provided": true,
    "reduced_motion_supported": true
  },
  "license_origin": {
    "source_repository": "https://github.com/example/canvas-ui",
    "license_type": "MIT",
    "author": "Canvas UI Team",
    "attribution_required": true,
    "redistribution_mode": "full_source"
  },
  "dependencies": ["three", "motion/react"],
  "devDependencies": ["@types/three"],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/ui/canvas-fluid-wave.tsx",
      "type": "registry:component",
      "content": "export const FluidWave = () => { /* escaped source */ };"
    }
  ]
}
```

---

## 4. Automated Ingestion & Normalization Pipeline

The wiki cannot rely on manual curation to keep pace with 60+ upstream open-source registries. The automated pipeline ingests, normalizes, and packages components in a 5-step pipeline:

```
[Upstream Repos] ──► [1. Harvester] ──► [2. AST Parser] ──► [3. Codemods] ──► [4. Dial Scorer] ──► [5. Compiler]
```

### Step 1: Harvester & Sandbox Isolation
*   Clones vetted upstream repositories into an isolated sandbox (`/staging/clones/`).
*   Verifies license terms (MIT, Apache-2.0, BSD-3, Commons Clause) against our legal registry policy.

### Step 2: AST Static Analysis (`packages/harvester/src/ast-parser.ts`)
*   Uses the TypeScript Compiler API (`ts.createSourceFile`) to parse components into an Abstract Syntax Tree:
    *   **Imports & Dependencies**: Identifies third-party npm packages (`motion/react`, `three`, `lucide-react`) and internal imports (`@/components/ui/button`).
    *   **Exports & Props**: Extracts component function signatures, TypeScript interfaces, and default props.
    *   **Graphics & Shader Tells**: Flags identifiers like `WebGLRenderer`, `ShaderMaterial`, and `<canvas>` elements.
    *   **Complexity Metrics**: Calculates AST node depth, lines of code, and cyclomatic complexity.

### Step 3: Normalization & Automated Codemods
*   **Tailwind v4 Converter**: Scans for legacy Tailwind v3 syntax (e.g. `tailwind.config.js` color extensions) and maps them to Tailwind v4 CSS theme variables (`@theme { --color-primary: ... }`). Removes arbitrary non-token overrides (converting `p-[17px]` to `p-4`).
*   **React 19 & `motion/react` Adapter**: Replaces legacy `import { motion } from "framer-motion"` with `import { motion } from "motion/react"` and updates deprecated React hook signatures.
*   **Import Path Rewriter**: Normalizes relative imports to standard shadcn alias conventions (`@/components/ui/...`).

### Step 4: Taste-Dial Scoring & Anti-Slop Audit
*   **Deterministic AST Scoring**:
    *   `visual_density` calculated via ratio of high-spacing utility classes (`py-20+`) vs compact classes (`p-2`).
    *   `motion_intensity` computed via presence of spring configs, layout IDs, canvas animation loops, or CSS hover transitions.
    *   `design_variance` scored based on asymmetry, brutalist border rules, and bento grid structures.
*   **Lightweight LLM Verification (Optional/Assisted)**: Feeds component documentation and AST summaries to a lightweight model (Claude 3.5 Haiku or Gemini Flash) to validate dial ratings and verify absence of subtle visual slop.

### Step 5: Static Registry Compilation (`packages/registry/compiler/build-registry.ts`)
*   Validates generated items against `registry-item-schema.json`.
*   Escapes file contents into JSON strings.
*   Outputs static JSON artifacts to `apps/docs/public/r/[name].json` and updates `apps/docs/public/r/registry.json`.
*   Generates corresponding Markdown documentation stubs with YAML frontmatter for `/raw/` and `/llms.txt`.

---

## 5. Anti-Slop Governance & Zero-Draft Fidelity Verification

To guarantee that AI agents can utilize this registry autonomously without human debugging, the project deploys a two-tier verification harness.

### 5.1 Expanded 20-Rule Anti-Slop Linter (`packages/audit-linter`)
The initial 8-rule regex linter (`verify-audit.py`) is upgraded to a 20-rule AST + regex hybrid engine:

| Rule ID | Rule Category | Severity | Detection Mechanism | Target Violation |
| :--- | :--- | :---: | :--- | :--- |
| **SLOP-001** | Styling / Color | Medium | Regex | Hardcoded indigo shades (`bg-indigo-600`, `#4f46e5`) |
| **SLOP-002** | Styling / Color | Medium | Regex | Cliché purple-to-blue linear gradients (`from-purple-500 to-blue-500`) |
| **SLOP-003** | Styling / Surface | Low | Regex | Blanket glassmorphism (`bg-white/10 backdrop-blur-md`) |
| **SLOP-004** | TypeScript | **High** | AST | Chained type assertions (`as unknown as`, `as any as`) |
| **SLOP-005** | TypeScript | **High** | AST | Conditional empty object spreads (`...(cond ? { a } : {})`) |
| **SLOP-006** | Motion | Low | Regex | Blanket `transition-all duration-300` on structural wrappers |
| **SLOP-007** | Layout / Spacing | Low | Regex | Non-token arbitrary pixel units (`p-[17px]`, `m-[13px]`) |
| **SLOP-008** | Iconography | Medium | Regex | Decorative emojis inside buttons/cards instead of SVG icons |
| **SLOP-009** | Code Completeness | **High** | Regex | Truncated code comments (`// TODO: implement logic`, placeholder mocks) |
| **SLOP-010** | Accessibility | **High** | AST | Interactive elements (`<button>`, `<a>`) without accessible text or `aria-label` |
| **SLOP-011** | Accessibility | Medium | AST | Inline SVGs without `role="img"` or `<title>` element |
| **SLOP-012** | Accessibility | **High** | AST | Focus outline suppression (`outline-none`, `focus:ring-0` without replacement) |
| **SLOP-013** | Performance | Medium | AST | Layout-triggering transitions (`transition-[height]`, `transition-[width]`) |
| **SLOP-014** | Performance | Medium | AST | Missing `prefers-reduced-motion` media queries on heavy canvas loops |
| **SLOP-015** | Architecture | **High** | AST | Hardcoded external HTTP image assets without fallback dimensions |
| **SLOP-016** | Motion | Low | AST | Missing `LayoutGroup` or `AnimatePresence` keys during layout morphing |
| **SLOP-017** | TypeScript | Medium | AST | Implicit `any` props on exported component function interfaces |
| **SLOP-018** | Styling / Layout | Medium | Regex | Repetitive centered card layouts (identical 3-col centered icons/text) |
| **SLOP-019** | Architecture | **High** | AST | Circular or unregistered relative imports bypassing standard aliases |
| **SLOP-020** | Legal / IP | **High** | Regex | Missing mandatory upstream license attribution headers |

### 5.2 The "Zero-Draft Fidelity" Headless Evaluation Harness
To mathematically validate the **>90% Zero-Draft Fidelity** metric:
1.  **Isolated Sandboxes**: The CI test runner uses Docker or temporary directories to spin up clean, blank Next.js 15 and Vite React workspaces.
2.  **Autonomous Agent Dispatch**: Prompts representing typical user briefs ("Build a modern SaaS pricing section using high visual density and spring motion") are dispatched to AI developer agents (Claude Code, Cursor CLI, OpenAI Codex).
3.  **Registry Injection**: The agent reads `/llms.txt`, selects registry items, installs them via `npx shadcn add`, and wires up the page.
4.  **Automated Gates**:
    *   `Step 1: TypeScript Check` (`tsc --noEmit`) — Zero type errors.
    *   `Step 2: Build Verification` (`pnpm build`) — Zero compile or bundling failures.
    *   `Step 3: Anti-Slop Audit` (`verify-audit`) — Health score ≥ 90/100.
    *   `Step 4: A11y Run` (Headless Playwright + Axe-core) — Zero critical WCAG AA violations.
5.  **Benchmark Dashboard**: A nightly automated dashboard tracks pass rates across all catalog components, preventing regression.

---

## 6. Licensing, Attribution & Legal IP Compliance

Aggregating components from disparate open-source ecosystems introduces intellectual property considerations. The project adheres to a strict legal compliance framework:

### 6.1 License Tiers
| Tier | License Type | Target Repositories | Redistribution Strategy |
| :--- | :--- | :--- | :--- |
| **Tier 1: Permissive** | MIT, Apache-2.0, BSD-3 | beUI, ReUI, Kairo UI, KokonutUI, Dot Matrix | **Full Source Redistribution**: Full component TSX code hosted in registry with upstream copyright header preserved. |
| **Tier 2: Restricted** | MIT + Commons Clause | Canvas UI | **Proxy Recipe / Deep Link**: Registry provides component metadata, dependency schema, and an automated CLI fetch recipe pointing to the official upstream repo. Does not resell or re-license. |
| **Tier 3: Proprietary/Paid** | Commercial / Pro Tiers | Aceternity Pro, ReUI Pro | **Specification Only**: Provides structural interfaces and adapter recipes. Prompts the agent to check if the user has an active license key. |

### 6.2 Standardized Attribution Header
Every component source file compiled into `/r/` includes an immutable legal comment:
```tsx
/**
 * @license MIT
 * @origin [Library Name] ([Repository URL])
 * @author [Author Name]
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */
```

---

## 7. Operational, CI/CD & Deployment Topology

### 7.1 Deployment Infrastructure
*   **Documentation & Static Registry**: Deployed to Cloudflare Pages or Vercel Edge Network.
    *   Custom Domain: `wiki.yourdomain.dev`
    *   Edge Cache: Static caching (`Cache-Control: public, max-age=31536000, immutable`) on all `/r/*.json` and static bundles.
    *   Dynamic Stale-While-Revalidate on `/llms.txt` and `/raw/` endpoints.
*   **MCP Service**: Distributed as an npm package (`@design-wiki/mcp`) for local stdio, with an optional Cloudflare Worker deployment for cloud agent streaming.

### 7.2 GitHub Actions Workflows
1.  **`audit-guardrails.yml`**:
    *   Runs `verify-audit.py` across `packages/registry/src` with 21 anti-slop rules, arbitrary pixel checks (`p-[17px]`), and WCAG contrast validation.
    *   Executes `pnpm lint:slop` and verifies registry compilation with `pnpm build:registry`.
    *   Runs `@design-wiki/mcp` sandbox test and autonomous agent trial runner (`scripts/run-agent-sandbox.ts`).
2.  **`pull-request-gate.yml`**:
    *   Runs `verify-audit` across modified components (fails on any High severity violation).
    *   Validates all updated registry JSON files against `registry-item-schema.json`.
    *   Executes `tsc --noEmit` and component unit tests.
3.  **`build-and-deploy-registry.yml`** (On merge to `main`):
    *   Executes `build-registry.ts` to re-compile all `/public/r/*` artifacts.
    *   Rebuilds Next.js Fumadocs static documentation.
    *   Deploys static site to CDN.
    *   Publishes updated `@design-wiki/mcp` package to npm if server source changed.
4.  **`nightly-fidelity-benchmark.yml`**:
    *   Spins up headless evaluation sandboxes to test random sample components with AI coding agents, reporting pass-rate metrics to the repository status board.

---

## 8. Risk Management Matrix

| Risk ID | Risk Description | Severity | Likelihood | Mitigation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| **RSK-01** | Upstream Breaking Changes (Tailwind v3 vs v4) | High | High | Automated AST codemods in ingestion pipeline normalize all components into native Tailwind v4 tokens before publication. |
| **RSK-02** | Upstream Licensing Disputes | High | Low | Clear multi-tier license classification (full source vs proxy recipe) with mandatory attribution headers and automated license scanning. |
| **RSK-03** | Agent Context Window Overflow | Medium | Medium | Strict 15KB per-component payload limits; lean `/raw/` markdown without prose clutter; compact `/llms.txt` index. |
| **RSK-04** | WebGL / Canvas Hardware Incompatibilities | High | Medium | Mandatory fallback contract: every `ui:creative` component must supply a graceful CSS or static visual fallback. |
| **RSK-05** | Registry Dependency Conflicts | Medium | High | Ingestion parser identifies shared peer dependencies (e.g. Radix, Lucide) and registers them explicitly in `registryDependencies`. |
