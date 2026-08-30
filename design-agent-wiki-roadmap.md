# 🗓️ Agile Delivery Roadmap: Machine-First Design Agent Wiki

This roadmap outlines the tactical, 14-week milestone-driven plan to architect, build, evaluate, and launch the **Machine-First Design Agent Wiki**. Transitioning from an undefined multi-month timeline, this plan is structured into four vertical-sliced agile phases designed to deliver an operational MVP in 3 weeks and a scalable, automated system in 14 weeks.

---

## 1. Roadmap Timeline & Phase Overview

```
Sprint / Week:   W1   W2   W3   W4   W5   W6   W7   W8   W9  W10  W11  W12  W13  W14
Phase 1: Core   [═══════════]                                                           (Weeks 1-3)
Phase 2: Ingest           [═════════════════════]                                       (Weeks 4-7)
Phase 3: MCP & Tools                            [═════════════]                         (Weeks 8-10)
Phase 4: Eval & Launch                                        [═════════════════════]   (Weeks 11-14)
```

| Phase | Duration | Core Focus | Key Milestone Deliverable |
| :--- | :---: | :--- | :--- |
| **Phase 1: Core Architecture & Seed MVP** | Weeks 1–3 | Monorepo, Fumadocs Docs, Static `/r/` Compiler, 25 Seed Items | **Working Seed Registry MVP**: Agents can fetch and install 25 curated components. |
| **Phase 2: Ingestion Engine & Codemods** | Weeks 4–7 | AST Analysis, Tailwind v4 Normalizer, Automated Dials, 75+ Items | **Automated Ingestion Pipeline**: Foreign repos parsed and converted to zero-slop components. |
| **Phase 3: Agentic Interfaces & MCP** | Weeks 8–10 | `@design-wiki/mcp` Server (Stdio & HTTP), CLI, Portable Skills | **Agent Integration**: Claude Code & Cursor query and install components via MCP tools. |
| **Phase 4: Zero-Draft Eval & Launch** | Weeks 11–14 | Headless Sandbox E2E Eval, Axe-core A11y Suite, 150+ Items, CDN | **Production Release**: >90% Zero-Draft Fidelity verified; public registry launch. |

---

## 2. Phase 1: Core Architecture & Seed Registry MVP (Weeks 1–3)

### Goal:
Establish the monorepo foundation, deploy the dual-exposure documentation platform (Next.js + Fumadocs), configure the static registry compiler, and hand-curate an initial seed catalog of 25 zero-slop components.

### Sprint 1 (Week 1): Monorepo Scaffold & Dual-Exposure Document Engine
*   **Task 1.1: Monorepo & Tooling Setup**
    *   *Scope*: Initialize `pnpm` workspace with Turborepo (`apps/docs`, `packages/registry`, `packages/audit-linter`).
    *   *Files Touched*: `pnpm-workspace.yaml`, `package.json`, `turbo.json`.
    *   *Acceptance Criteria*: Fast workspace linking, clean `pnpm install`, unified lint/build pipeline.
*   **Task 1.2: Next.js 15 & Fumadocs Documentation Engine**
    *   *Scope*: Scaffold `apps/docs` with Next.js 15 App Router, React 19, Tailwind CSS v4, and Fumadocs v14.
    *   *Files Touched*: `apps/docs/package.json`, `apps/docs/app/docs/layout.tsx`, `apps/docs/source.config.ts`.
    *   *Acceptance Criteria*: Statically exports documentation pages with custom Fumadocs layout.
*   **Task 1.3: Machine Endpoint Routing (`/llms.txt` & `/raw/`)**
    *   *Scope*: Implement `app/llms.txt/route.ts` using Fumadocs Loader API and `app/raw/[...slug]/route.ts` to stream clean markdown without navigation chrome.
    *   *Files Touched*: `apps/docs/app/llms.txt/route.ts`, `apps/docs/app/raw/[...slug]/route.ts`.
    *   *Acceptance Criteria*: Plain HTTP GET returns concise text under 15KB per route.

### Sprint 2 (Week 2): Static Registry Compiler & Registry Schema Baseline
*   **Task 2.1: JSON Schema & Validation**
    *   *Scope*: Integrate `registry-item-schema.json` with Ajv validator in `packages/registry`.
    *   *Files Touched*: `packages/registry/schema.json`, `packages/registry/src/validate.ts`.
    *   *Acceptance Criteria*: Validates components against shadcn v3 format, taste dials, and a11y fields.
*   **Task 2.2: Registry Compiler Script (`build-registry.ts`)**
    *   *Scope*: Implement script that sweeps `packages/registry/src/`, escapes source strings, resolves dependencies, and writes `/public/r/[name].json` and `/public/r/registry.json`.
    *   *Files Touched*: `packages/registry/compiler/build-registry.ts`.
    *   *Acceptance Criteria*: Generates valid static JSON files consumed via `npx shadcn add http://localhost:3000/r/[name].json`.
*   **Task 2.3: Initial 10 Primitive Seed Components**
    *   *Scope*: Handcraft 10 zero-slop UI primitives (Button, Input, Dialog, Dropdown, Tabs, Tooltip, Avatar, Badge, Card, Switch) utilizing Radix UI and Tailwind v4.
    *   *Files Touched*: `packages/registry/src/primitives/*`.
    *   *Acceptance Criteria*: Zero arbitrary units, full ARIA compliance, clean TypeScript types.

### Sprint 3 (Week 3): Motion Primitives, Blocks & Audit Linter v1.0
*   **Task 3.1: 15 Creative & Motion Seed Components**
    *   *Scope*: Curate 15 high-craft components: Floating Dock, Bento Grid, Dot Matrix Loader, Animated Tabs, Fluid Wave Canvas, and Hero Block.
    *   *Files Touched*: `packages/registry/src/motion/*`, `packages/registry/src/creative/*`, `packages/registry/src/blocks/*`.
    *   *Acceptance Criteria*: Includes graceful CSS fallbacks for canvas and prefers-reduced-motion support.
*   **Task 3.2: Port & Integrate Anti-Slop Linter (`packages/audit-linter`)**
    *   *Scope*: Port Python `verify-audit.py` to a TypeScript CLI package with AST checking capabilities and hook it into GitHub PR actions.
    *   *Files Touched*: `packages/audit-linter/src/*`, `.github/workflows/lint.yml`.
    *   *Acceptance Criteria*: Catches SLOP-001 through SLOP-008 and exits with code 1 on violations.

> [!NOTE]
> **Phase 1 Checkpoint Gate**:
> - [x] Next.js docs site builds cleanly with `pnpm build`.
> - [x] `/llms.txt` dynamically lists all 25 seed components.
> - [x] An external clean Next.js project can run `npx shadcn add <url>/r/button.json` and compile without warnings.

---

## 3. Phase 2: Ingestion Engine & Codemod Pipeline (Weeks 4–7)

### Goal:
Automate third-party repository harvesting, AST static analysis, automated Tailwind v4 / React 19 normalization, and taste-dial scoring to scale the library to 75+ components.

### Sprint 4 (Week 4): Upstream Harvester & TypeScript AST Parser
*   **Task 4.1: Repository Harvester & Sandbox Manager**
    *   *Scope*: Build automated git cloner (`packages/harvester/src/git-clone.ts`) with shallow cloning, branch pinning, and licensing whitelist verification.
    *   *Files Touched*: `packages/harvester/src/git-clone.ts`, `packages/harvester/src/license-check.ts`.
    *   *Acceptance Criteria*: Safely clones target repos (Aceternity, beUI, KokonutUI) and verifies licenses.
*   **Task 4.2: AST Static Analyzer Engine**
    *   *Scope*: Upgrade `ast-parse-ingest.js` into TypeScript AST Parser (`packages/harvester/src/ast-parser.ts`) using the TypeScript Compiler API. Extracts imports, exports, JSX hierarchy, canvas tells, and complexity metrics.
    *   *Files Touched*: `packages/harvester/src/ast-parser.ts`.
    *   *Acceptance Criteria*: Accurately extracts all dependencies, primitives, and component props interfaces.

### Sprint 5 (Week 5): Normalization Codemods (Tailwind v4 & React 19)
*   **Task 5.1: Tailwind v4 Token Codemod**
    *   *Scope*: Build jscodeshift / AST transformer that detects legacy Tailwind v3 syntax (`bg-indigo-600`, arbitrary offsets `p-[17px]`, custom plugins) and maps them to standard Tailwind v4 CSS variables and tokens.
    *   *Files Touched*: `packages/harvester/src/codemods/tailwind-v4-transform.ts`.
    *   *Acceptance Criteria*: Eliminates arbitrary pixel hacks and maps legacy colors to system semantic tokens.
*   **Task 5.2: React 19 & `motion/react` Adapter**
    *   *Scope*: Codemod to migrate legacy `framer-motion` imports to `motion/react` and resolve React 19 forwardRef patterns.
    *   *Files Touched*: `packages/harvester/src/codemods/motion-react-transform.ts`.
    *   *Acceptance Criteria*: Clean compilation in React 19 without deprecation warnings.

### Sprint 6 (Week 6): Automated Taste-Dial Scorer & Attribution Guard
*   **Task 6.1: Heuristic Taste-Dial Scoring**
    *   *Scope*: Algorithmic scoring of `DESIGN_VARIANCE`, `MOTION_INTENSITY`, and `VISUAL_DENSITY` based on AST spacing metrics, animation hooks, and grid asymmetry.
    *   *Files Touched*: `packages/harvester/src/dial-scorer.ts`.
    *   *Acceptance Criteria*: Assigns integer ratings 1–10 with repeatable determinism.
*   **Task 6.2: Attribution & Legal Comment Injector**
    *   *Scope*: Automated injector adding SPDX license headers, original repository links, and author credits to all harvested source files.
    *   *Files Touched*: `packages/harvester/src/attribution.ts`.
    *   *Acceptance Criteria*: 100% of generated files include immutable legal attribution comments.

### Sprint 7 (Week 7): Catalog Scaling & Ingestion Batch Run
*   **Task 7.1: Batch Ingestion Run**
    *   *Scope*: Execute harvester across targeted OSS libraries (beUI, Aceternity, ReUI, KokonutUI, Dot Matrix) to import 50 additional components (scaling catalog to 75+).
    *   *Files Touched*: `packages/registry/src/**/*`.
    *   *Acceptance Criteria*: 50 new components validated, compiled into `/r/`, and verified against anti-slop rules.

> [!NOTE]
> **Phase 2 Checkpoint Gate**:
> - [x] Ingestion pipeline executes unattended on a target repo and produces compliant registry items.
> - [x] All 75+ components pass `verify-audit` with zero High-severity flags.
> - [x] Documentation site automatically updates search index and `/llms.txt`.

---

## 4. Phase 3: Agentic Interfaces, MCP Server & Tooling (Weeks 8–10)

### Goal:
Build high-speed programmatic bridges allowing AI developer agents (Claude Code, Cursor, Codex) to discover, inspect, and install components via the Model Context Protocol (MCP) and customized CLI tools.

### Sprint 8 (Week 8): `@design-wiki/mcp` Server Implementation
*   **Task 8.1: MCP Server Core (TypeScript SDK)**
    *   *Scope*: Build `@design-wiki/mcp` using `@modelcontextprotocol/sdk`. Implement Stdio transport for local agent sessions.
    *   *Files Touched*: `packages/mcp-server/src/index.ts`, `packages/mcp-server/package.json`.
    *   *Acceptance Criteria*: Runs locally via `npx @design-wiki/mcp` and connects to Claude Code and Cursor.
*   **Task 8.2: Core MCP Tools**
    *   *Scope*: Implement four dedicated tools:
        1. `search_components`: Search by tag, category, keyword, or dial range.
        2. `get_component_markup`: Return raw TSX code and peer dependencies.
        3. `get_install_recipe`: Provide CLI installation commands and alias configs.
        4. `audit_code_slop`: Scan arbitrary user code against anti-slop rules.
    *   *Files Touched*: `packages/mcp-server/src/tools/*`.
    *   *Acceptance Criteria*: Fast JSON responses under 100ms for all query operations.

### Sprint 9 (Week 9): Remote MCP Deployment & Streaming Endpoints
*   **Task 9.1: Streamable HTTP/SSE Server**
    *   *Scope*: Deploy remote MCP endpoint on Cloudflare Workers / Node.js with Server-Sent Events (SSE) support for cloud agents.
    *   *Files Touched*: `packages/mcp-server/src/server-http.ts`, `wrangler.toml`.
    *   *Acceptance Criteria*: Passes MCP protocol conformance tests over remote HTTPS.
*   **Task 9.2: Edge In-Memory Search Index**
    *   *Scope*: Implement fast in-memory search (MiniSearch or BM25) caching component metadata for sub-50ms search latency.
    *   *Files Touched*: `packages/mcp-server/src/search-index.ts`.
    *   *Acceptance Criteria*: Keyword and fuzzy matching with instantaneous results.

### Sprint 10 (Week 10): Portable Agent Skillpacks & Custom CLI
*   **Task 10.1: Universal Agent Skill Pack**
    *   *Scope*: Package `SKILL.md` into portable formats for downstream developer projects: `.cursor/rules/design-wiki.mdc`, Claude Code skill bundle, and Codex instructions.
    *   *Files Touched*: `skills/design-system-agent/*`.
    *   *Acceptance Criteria*: Agents automatically discover and adhere to taste dials and discovery loops.
*   **Task 10.2: Custom CLI Installer Wrapper (`npx design-wiki add`)**
    *   *Scope*: Build a lightweight CLI wrapper wrapping shadcn CLI with automated alias resolution and dial preset injection.
    *   *Files Touched*: `packages/cli/src/*`.
    *   *Acceptance Criteria*: `npx design-wiki add floating-dock` installs the component and configures Tailwind tokens.

> [!NOTE]
> **Phase 3 Checkpoint Gate**:
> - [x] Claude Code and Cursor agents can configure the MCP server in their settings.
> - [x] An agent given a natural language prompt ("add an accessible modal dialog") successfully queries MCP, installs the component, and wires it into the app.
> - [x] Native installer CLI `npx design-wiki add <slug>` operational with automatic path map resolution and recursive dependency scaffolding.
> - [x] Automated taste audit engine and calibrated 1–10 dial review pipeline active with layout stability guardrails.


---

## 5. Phase 4: Zero-Draft Evaluation Sandbox, A11y & Production Launch (Weeks 11–14)

### Goal:
Deploy the automated headless evaluation sandbox to mathematically prove >90% Zero-Draft Fidelity, run comprehensive accessibility audits, scale the library to 150+ components, and launch publicly.

### Sprint 11 (Week 11): Headless Evaluation Sandbox Harness
*   **Task 11.1: Automated Evaluation Runner**
    *   *Scope*: Build headless runner that spins up isolated Next.js 15 test sandboxes, prompts LLM agents to construct pages using the wiki, and verifies build output.
    *   *Files Touched*: `packages/eval-harness/src/*`.
    *   *Acceptance Criteria*: Runs unattended benchmark suites across 50 test prompts.
*   **Task 11.2: Zero-Draft Fidelity Scoring Dashboard**
    *   *Scope*: Track metrics: First-run compilation (`tsc --noEmit`), build success (`pnpm build`), slop score, and token payload size.
    *   *Files Touched*: `packages/eval-harness/src/reporter.ts`.
    *   *Acceptance Criteria*: Dashboard displays benchmark pass rate; verifies target >90%.

### Sprint 12 (Week 12): Automated Accessibility & Keyboard Navigation Suite
*   **Task 12.1: Axe-Core Automated Scans**
    *   *Scope*: Implement Playwright test runner with Axe-core evaluating all catalog components in light and dark mode.
    *   *Files Touched*: `packages/registry/tests/a11y.spec.ts`.
    *   *Acceptance Criteria*: 100% compliance with WCAG 2.1 AA contrast and element rules.
*   **Task 12.2: Keyboard Navigation & Focus Trap Verification**
    *   *Scope*: Automated testing of Tab / Shift+Tab cycling, Escape key dismissal, and visible focus rings.
    *   *Files Touched*: `packages/registry/tests/keyboard-nav.spec.ts`.
    *   *Acceptance Criteria*: Zero trap errors; all interactive controls focusable.

### Sprint 13 (Week 13): Production Infrastructure & Catalog Expansion (150+ Items)
*   **Task 13.1: Catalog Scaling to 150+ Components**
    *   *Scope*: Ingest remaining target components from creative, editorial, and utility libraries (React Bits, Canvas UI shaders, Tailark blocks).
    *   *Files Touched*: `packages/registry/src/**/*`.
    *   *Acceptance Criteria*: Catalog reaches 150+ verified, zero-slop components.
*   **Task 13.2: Edge CDN & Production Deployment**
    *   *Scope*: Configure production domain (`wiki.yourdomain.dev`), Cloudflare edge caching, immutable headers on `/r/*.json`, and GitHub Actions CD.
    *   *Files Touched*: `.github/workflows/deploy.yml`, `apps/docs/next.config.mjs`.
    *   *Acceptance Criteria*: Global latency < 100ms; 99.9% uptime on registry endpoints.

### Sprint 14 (Week 14): Documentation, Developer Onboarding & Public Launch
*   **Task 14.1: Public Onboarding & Video Walkthroughs**
    *   *Scope*: Publish "Zero to Hero" agent setup guides for Claude Code, Cursor, Windsurf, and v0.
    *   *Files Touched*: `apps/docs/content/docs/getting-started/*`.
    *   *Acceptance Criteria*: Clear, step-by-step instructions tested with external users.
*   **Task 14.2: Open Source Community & Contribution Guidelines**
    *   *Scope*: Author `CONTRIBUTING.md`, issue templates, and automated PR checks for external component submissions.
    *   *Files Touched*: `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`.
    *   *Acceptance Criteria*: External contributors can submit components and receive automated anti-slop audit feedback.
*   **Task 14.3: 🚀 Public Launch & Announcement**
    *   *Scope*: Launch live website, announce on developer channels, and release `@design-wiki/mcp` to npm.

> [!NOTE]
> **Phase 4 Checkpoint Gate (Scaled Ingestion & Aesthetic Hardening)**:
> - [x] Harvester engine maps blueprint repos (Aceternity UI, Canvas UI, diagram-design, HeroUI, Evil-Buttons, SmoothUI, Tailark, Remocn) with AST peer dependency auto-resolution.
> - [x] Canonical 7-category taxonomy strictly enforced (`ui:primitive`, `ui:motion`, `ui:creative`, `ui:editorial`, `ui:block`, `ui:media`, `ui:utility`) with 29 compiled reference components.
> - [x] Automated taste audit active with 21 Anti-Slop Rules (including SLOP-021 raw unshaded backgrounds) and 100/100 Health Score across all registry sources.
> - [x] MCP tools `search_library` / `search_components`, `fetch_raw_markup`, and `get_installation_schema` validated in sandbox with context payloads strictly `< 15KB`.

---

## 6. Definition of Done (DoD) & Sprint Gate Policy

Every component and feature delivered within this roadmap must clear the following **Definition of Done** before being marked complete:

1.  **Code Conformance**: Passes `verify-audit` with zero High-severity anti-slop flags.
2.  **Schema Validity**: Conforms 100% to `registry-item-schema.json`.
3.  **Compilation Purity**: Zero TypeScript errors (`tsc --noEmit`) under strict mode.
4.  **A11y Standard**: Zero WCAG AA contrast or ARIA violations via Axe-core.
5.  **Graceful Fallbacks**: Every WebGL/Canvas component provides a functional CSS or static fallback.
6.  **Dual Exposure**: Available as human MDX documentation, `/raw/` markdown, `/r/[name].json`, and indexed in `/llms.txt`.
7.  **Legal Attribution**: Complete upstream license comment embedded in source header.
