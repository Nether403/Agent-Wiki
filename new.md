Component Libraries & Ecosystem Enhancement for Agent Wiki

---

## Executive Summary

The **Machine-First Design Agent Wiki** provides a deterministic, pre-tested, zero-slop component registry and Model Context Protocol (MCP) server for AI coding agents. Currently, the wiki hosts **45 curated components** across 7 categories (`ui:primitive`, `ui:motion`, `ui:creative`, `ui:editorial`, `ui:block`, `ui:media`, `ui:utility`), governed by **21 Anti-Slop Rules** and **3 Taste Dials** (Design Variance, Motion Intensity, Visual Density).

Reviewing [Component libraries.txt](file:///d:/Concept%20projectcs/Agent%20Wiki/Component%20libraries.txt) alongside the broader 2025–2026 frontend ecosystem reveals significant expansion opportunities. Integrating these resources will transform the Agent Wiki from a foundational design library into an **end-to-end Agentic UI Operating System**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                            CURRENT AGENT WIKI CATALOG (45 Items)                         │
│  13 Primitives │ 10 Motion │ 6 Creative │ 5 Editorial │ 5 Blocks │ 2 Media │ 4 Utility   │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ + INGESTION EXPANSION
                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     TARGET MULTI-REGISTRY AGENTIC ECOSYSTEM (100+ Items)                 │
│                                                                                          │
│  1. AI-Native & Agentic Primitives    (Prompt inputs, chat bubbles, artifact canvas,     │
│                                        streaming diffs, subagent thought DAGs)           │
│  2. Editorial Diagram Systems         (cathrynlavery 39-diagram taxonomy, node maps,     │
│                                        decision trees, Venn matrices, timeline ladders)  │
│  3. Motion & Micro-Interactions       (ibelick motion-primitives, morphing dialogs,      │
│                                        odometer counters, progressive blur, ripples)     │
│  4. Procedural 3D, WebGL & HUDs       (ThreeUI R3F viewports, NeonBlade HUDs, dot-matrix │
│                                        displays, liquid metal shaders, text scramblers)  │
│  5. Enterprise Data & Application     (ReUI Data Grid, Kanban, Event Calendar, 638       │
│                                        animated SVG icons, micro sparklines)             │
│  6. Programmatic Video & Timeline     (Remocn kinetic titles, karaoke captions,          │
│                                        interactive video frame comparators)              │
│  7. High-Craft Marketing Blocks       (VengeanceUI aggressive heroes, feature cyclers,   │
│                                        competitor matrices, customer quote masonry)      │
│  8. Anti-Slop & Governance Engine     (SLOP-022 to SLOP-030, Unslop auto-themer,         │
│                                        Tripwire security sandbox, Oxlint lint rules)     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Deep Analysis of `Component libraries.txt`

The libraries in `Component libraries.txt` fall into four functional tiers:

| Tier | Representative Repositories / URLs | Core Strengths & Architectural Niche |
| :--- | :--- | :--- |
| **Tier 1: Major Community Registries & Aggregators** | `21st.dev`, `shadcnblocks.com`, `shadcnspace.com`, `ui-layouts.com`, `tailark.com`, `heroui.com`, `daisyui.com` | Mass distribution, `npx shadcn` compatible JSON schemas, broad marketing sections, standard Tailwind CSS patterns. |
| **Tier 2: Specialized Motion, Physics & Creative UI** | `ibelick/motion-primitives`, `DavidHDev/react-bits`, `educlopez/smoothui`, `Ashutoshx7/VengeanceUI`, `kokonut-labs/kokonutui`, `fancycomponents.dev`, `nolly-studio/cult-ui` | High-taste physics, spring dynamics, typography micro-interactions, layout morphs (`layoutId`), cursor light spotlights, tactile buttons. |
| **Tier 3: 3D, Canvas, Shaders & Programmatic Media** | `MengTo/threeui`, `DavidHDev/canvas-ui`, `Remocn/remocn`, `vprix21/neonblade-ui`, `zzzzshawn/matrix`, `radiumcoders/Evil-Buttons` | R3F 3D viewports, HTML-in-Canvas, WebGL fragment shaders, Remotion video timelines, cyberpunk HUDs, dot-matrix displays, audio synthesis. |
| **Tier 4: Enterprise Data, Diagrams & Anti-Slop Governance** | `keenthemes/reui`, `cathrynlavery/diagram-design`, `marcoripa96/i0`, `HugoBlox/kit`, `Leonxlnx/taste-skill`, `aahil62/unslop`, `dmmulroy/anti-slop`, `petergyang/no-ai-slop`, `tripwire.sh` | Enterprise data tables, calendar & Kanban primitives, 39 zero-build SVG diagrams, 638 animated icons, Oxlint anti-slop rules, automated retheming, copy/writing linter. |

---

## 2. High-Value Component Domains for Wiki Integration

### Domain 1: AI-Native & Agentic Interface Primitives
AI coding agents need standard building blocks to assemble modern AI chat and autonomous workspace applications without reinventing the wheel.

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                 AI Artifact Canvas                                   │
│ ┌──────────────────────────────────────────────────┬───────────────────────────────┐ │
│ │ 🤖 Agent Thought Stream (Thought for 3.2s)       │ 🖥️ Live React / HTML Sandbox  │ │
│ │  ├─ 🔍 Step 1: Query MCP get_dependency_graph    │                               │ │
│ │  ├─ ⚡ Step 2: Validate 21 anti-slop rules        │                               │ │
│ │  └─ 🚀 Step 3: Emit TypeScript JSX               │                               │ │
│ ├──────────────────────────────────────────────────┤                               │ │
│ │ 📝 Split Diff Code Viewer [Inline / Split]       │                               │ │
│ └──────────────────────────────────────────────────┴───────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 💬 [Model: Claude 3.7 Sonnet ▼] [🌐 Web] [📎 Attach]  Ask follow-up... [🎙️] [⏎]  │ │
│ └──────────────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

#### Proposed Components:
1. **`ai-prompt-input`** *(Origin: KokonutUI / Cult UI)*
   - Dynamic auto-expanding textarea with model selector dropdown pill (`Claude 3.7`, `GPT-4o`, `Gemini 2.5 Pro`).
   - Web search toggle switch, file attachment drag-and-drop zone, token counter badge, and stop/send button.
   - Full keyboard shortcuts (`Enter` to send, `Shift + Enter` for newline).
2. **`ai-message-thread` & `ai-reasoning-foldout`** *(Origin: Hallmark / 21st.dev)*
   - Accessible message bubbles with streaming typewriter cursor.
   - Collapsible thinking/reasoning foldout accordion (`"Thought for 4.8 seconds"`), displaying model cognitive steps.
   - Interactive action toolbar: Copy markdown, Fork conversation branch, Retry, Thumbs up/down, Code block extraction.
3. **`ai-artifact-canvas`** *(Origin: Cult UI / Agent Wiki)*
   - Split-pane live sandbox container with tabbed Code / Preview / Diff views.
   - Full-screen expand toggle, error boundary overlay, and copy/download capabilities.
4. **`ai-voice-orb` & `voice-waveform`** *(Origin: KokonutUI / Remocn)*
   - Canvas-based pulsing 3D glowing sphere with 3 visual states: *Idle*, *Listening* (reacting to microphone input), and *Synthesizing* (audio frequency response).
5. **`agent-step-pipeline`** *(Origin: Tripwire / Design Wiki)*
   - DAG flowchart component showing autonomous subagent execution sequences, tool execution pills, runtime logs, and token spend telemetry.

---

### Domain 2: Editorial Diagram Design System
*Source: `cathrynlavery/diagram-design` (39 zero-dependency editorial SVG diagrams)*

AI coding agents often generate low-quality box diagrams or fragile Mermaid charts. Integrating a structured SVG diagram suite solves this.

#### Proposed Components:
1. **`architecture-topology-diagram`**: Multi-tier cloud/microservice topology with curved directional paths, status indicators, and component badges.
2. **`decision-tree-node-graph`**: Branching decision diamond diagram with true/false pathways, edge labels, and terminal states.
3. **`venn-comparison-matrix`**: 2-circle and 3-circle mathematical Venn diagrams with typography discipline, responsive SVG scaling, and semantic hover tooltips.
4. **`pyramid-hierarchy-chart`**: Multi-tier hierarchical pyramid (e.g., Testing Pyramid, Data Value Hierarchy) with layer descriptions.
5. **`strategic-quadrant-matrix`**: 2x2 matrix (e.g., Effort vs. Impact, Velocity vs. Cost) with plotted coordinate badges.
6. **`timeline-roadmap-track`**: Horizontal and vertical step-ladder milestone roadmap with completed, active, and pending indicators.

---

### Domain 3: Next-Gen Motion & Micro-Interactions
*Sources: `ibelick/motion-primitives`, `smoothui.dev`, `fancycomponents.dev`, `beui.dev`*

Expands the `ui:motion` category with tactile, GPU-accelerated micro-interactions.

#### Proposed Components:
1. **`morphing-dialog` / `expandable-card`** *(ibelick)*: Smooth shared-element expansion from a compact grid card to a full modal using `motion/react` `layoutId` without cumulative layout shift.
2. **`sliding-number` / `counter-odometer`** *(ibelick / smoothui)*: Physics-driven rolling digit reels for animated KPI statistics, pricing tiers, and token counters.
3. **`border-trail`** *(ibelick)*: Subtly animated light particle that glides continuously along rounded card borders.
4. **`progressive-blur`** *(ibelick / beui)*: Multi-stop CSS gradient mask blur that smoothly fades out background imagery at container boundaries.
5. **`view-transition-theme-toggle`** *(beui)*: Smooth circular ripple animation on dark/light mode toggle using native `document.startViewTransition`.
6. **`text-shimmer-wave`** *(ibelick / react-bits)*: Linear gradient wave passing over text, audited for WCAG 2.1 AA contrast compliance.

---

### Domain 4: Procedural 3D, WebGL & Retro-Tech Displays
*Sources: `threeui.com`, `canvas-ui.dev`, `neonbladeui.neuronrush.com`, `zzzzshawn/matrix`*

Expands the `ui:creative` category with rich canvas and WebGL components that maintain strict accessibility fallbacks.

#### Proposed Components:
1. **`threejs-model-viewport`** *(ThreeUI / MengTo)*: Lightweight Three.js / React Three Fiber component for rendering 3D GLTF/GLB models with orbit controls, inertia dampening, auto-rotation, and static image fallbacks.
2. **`matrix-code-stream` / `ascii-rain`** *(NeonBlade UI / Dot Matrix)*: Cyberpunk cascading character rain rendered on HTML5 Canvas with customizable glyph sets, frame-rate throttling, and reduced-motion fallback.
3. **`dot-matrix-scoreboard` / `digital-ticker`** *(Dot Matrix / zzzzshawn)*: Multi-character 5x7 LED dot-matrix display for stock prices, build numbers, countdown timers, and system metrics.
4. **`liquid-metal-shader`** *(Canvas UI / Cult UI)*: WebGL fragment shader simulating chromatic liquid metal distortion on cursor hover.
5. **`text-scrambler` / `hacker-decrypt`** *(NeonBlade / Fancy Components)*: Dynamic character scrambling and decoding effect on element hover or viewport intersection.

---

### Domain 5: Enterprise Data Grids & Application Primitives
*Sources: `keenthemes/reui`, `daisyui`, `franken-ui`, official `shadcn/ui` Charts*

Adds high-density application primitives for data-intensive administrative tools and SaaS dashboards.

#### Proposed Components:
1. **`reui-data-grid`** *(ReUI / Keenthemes)*: Enterprise-grade table supporting column pinning, multi-column sorting, fuzzy filtering, pagination, row selection, and CSV export.
2. **`draggable-kanban-board`** *(ReUI)*: Multi-column task board with smooth card drag-and-drop, swimlanes, and keyboard-accessible column movement.
3. **`event-calendar-view`** *(ReUI)*: Month/Week/Day scheduler grid with interactive event badges and time slot selection.
4. **`reui-animated-icons-pack`** *(ReUI / i0)*: 638 hand-crafted animated SVG vector icons (Duotone, Filled, Outline) with hover state morphing.
5. **`inline-sparkline-chart`** *(shadcn/ui Charts / ReUI)*: Lightweight inline SVG area/bar sparkline for metric cards and dense table rows.

---

### Domain 6: Programmatic Video & Audio Media Scrubbers
*Sources: `remocn.dev`, `Remocn/remocn`*

Expands the `ui:media` category with Remotion-ready programmatic video components.

#### Proposed Components:
1. **`kinetic-title-card`** *(Remocn)*: Programmatic video title overlay with spring-in typography, frame-based interpolation, and background mesh gradient.
2. **`karaoke-caption-stream`** *(Remocn)*: Real-time word-by-word synchronized caption overlay with audio timecode markers.
3. **`split-video-comparator`** *(Remocn / React Bits)*: Interactive split-pane curtain slider comparing two video sources or before/after render passes.

---

### Domain 7: High-Craft SaaS Architecture Blocks
*Sources: `Ashutoshx7/VengeanceUI`, `tailark.com`, `shadcnblocks.com`, `ui-layouts.com`*

Expands the `ui:block` category with production-ready landing page sections.

#### Proposed Components:
1. **`saas-hero-browser-mockup`** *(VengeanceUI / Tailark)*: High-impact hero section with a perspective-tilted browser mockup, interactive badge pills, and floating metric callouts.
2. **`interactive-feature-cycler`** *(UI-Layouts / Tailark)*: Multi-tab feature showcase with auto-advancing progress bars and coordinated graphic state switches.
3. **`competitor-comparison-matrix`** *(Shadcn Blocks)*: Detailed comparison grid with sticky feature categories, checkmarks, cross icons, and highlighted pricing columns.
4. **`customer-story-masonry`** *(Tailark / Kairo UI)*: Asymmetrical masonry grid showcasing customer quotes, company logos, and verified metric badges.

---

## 3. Tooling, Governance & Anti-Slop Enhancements

### 1. Extending the Anti-Slop Rulepack (from 21 to 30 Rules)
Integrate heuristics from `petergyang/no-ai-slop`, `dmmulroy/anti-slop`, and `aahil62/unslop`:

| Rule ID | Category | Severity | Detection | Rule Target & Description |
| :--- | :--- | :---: | :---: | :--- |
| **SLOP-022** | Copy / Writing | Medium | Regex | **AI Writing Clichés** (Bans tropes like *"In today's fast-paced world"*, *"Unleash the power of"*, *"It's not just X, it's Y"*, *"The future is here"* — from `no-ai-slop`). |
| **SLOP-023** | TypeScript | **High** | AST | **Oxlint Contract Hygiene** (Rejects loose `Record<string, any>`, missing component return type definitions, and untyped callback parameters — from `anti-slop`). |
| **SLOP-024** | Accessibility | **High** | Color Math | **Strict WCAG 2.1 AA Contrast Ratio** (Calculates foreground/background text contrast across Tailwind classes, flagging ratios below 4.5:1). |
| **SLOP-025** | Performance | **High** | AST | **Uncancelled Timer / Listener Leaks** (Flags `setInterval`, `requestAnimationFrame`, or `addEventListener` inside `useEffect` lacking cleanup functions). |
| **SLOP-026** | Styling | Medium | AST | **Arbitrary Color Token Escapes** (Flags hardcoded hex/RGB colors like `#0f172a` when semantic theme tokens like `bg-background` or `text-foreground` should be used). |
| **SLOP-027** | Architecture | Medium | AST | **Unbounded List Rendering** (Flags `.map()` rendering over dynamic arrays lacking unique `key` props or virtualization on large datasets). |
| **SLOP-028** | Motion | Low | AST | **Missing Spring Fallback Damping** (Flags Framer Motion springs with excessive stiffness or zero damping that cause visual stuttering). |
| **SLOP-029** | Icons | Low | AST | **Hardcoded SVG Dimensions** (Flags raw inline SVGs lacking scalable `viewBox` and `currentColor` inheritance). |
| **SLOP-030** | Legal / IP | **High** | AST | **Clean SPDX & Origin Header Verification** (Requires machine-readable `@origin`, `@license`, and `@curated-by` frontmatter on every ingested component). |

---

### 2. Automated `unslop` Retheming & Refactoring Engine
*Inspired by `aahil62/unslop`*

Add an automated command to the native CLI (`packages/cli`):

```bash
npx design-wiki unslop ./components/ui/hero.tsx --theme neo-tokyo
```

**How the Pipeline Works:**
1. **Scan AST**: Identifies banned gradients, hardcoded indigo buttons, decorative emojis, and arbitrary spacing (`p-[17px]`).
2. **Auto-Remap**:
   - Replaces `bg-indigo-600` with `bg-primary` and `hover:bg-primary/90`.
   - Replaces emojis (`🚀`, `✨`) with accessible Lucide SVG vector icons (`<Rocket className="h-4 w-4" />`).
   - Normalizes non-token spacing (`gap-[15px]` → `gap-4`).
3. **Inject Missing A11y Attributes**: Adds `aria-label`, `role="img"`, and `focus-visible:ring-2` tokens automatically.

---

### 3. Agent Tripwire Security & Integrity Sandboxing
*Inspired by `tripwire.sh`*

Implement a security middleware layer in `@design-wiki/mcp` and `packages/harvester`:
- **Malicious Payload Scanner**: Scans third-party component code for obfuscated `eval()`, external tracking pixels, unvetted CDN scripts, and telemetry collectors.
- **Payload Token Budget Enforcer**: Ensures all MCP responses remain strictly under the **15KB context budget** with zero truncation.
- **Prompt Injection Defense**: Validates incoming natural-language search queries against prompt extraction attempts before returning registry markup.

---

## 4. Architectural & Pipeline Enhancements

### 1. Universal Multi-Registry Harvester CLI
Enhance `packages/harvester` to support automated ingestion from any standard remote registry:

```bash
# Ingest directly from 21st.dev, KokonutUI, Cult UI, or ReUI registries
pnpm harvest ingest https://kokonutui.com/r/ai-input-search.json
pnpm harvest ingest https://cult-ui.com/r/text-scramble.json
```

**Automated Ingestion Lifecycle:**
```
[1. Fetch Remote JSON] ──► [2. AST Codemod: Tailwind v4 + React 19]
                                     │
                                     ▼
[4. Slop Gate (SLOP 1-30)] ◄── [3. Auto-Calculate 1-10 Taste Dials]
         │
         ▼
[5. Inject SPDX Header] ──► [6. Compile to packages/registry/src/]
```

### 2. Live Cloudflare Worker Edge MCP Upgrades
- Add **Server-Sent Events (SSE) streaming** for incremental component delivery.
- Add an **`audit_and_fix_slop`** MCP tool allowing agents to send raw code and receive an auto-corrected, zero-slop TSX payload in a single round-trip.

---

## 5. Prioritized Implementation Roadmap

| Phase | Milestone Name | Key Deliverables & Components | Target Catalog Size |
| :---: | :--- | :--- | :---: |
| **Phase 1** | **AI-Native & Editorial Diagrams** | Ingest `ai-prompt-input`, `ai-message-thread`, `ai-artifact-canvas`, `voice-waveform`, and the first 10 `diagram-design` SVG blueprints (`architecture-topology`, `decision-tree`, `venn-matrix`). | **55 Components** |
| **Phase 2** | **Motion & Enterprise Primitives** | Ingest `morphing-dialog`, `sliding-number`, `border-trail`, `reui-data-grid`, `kanban-board`, and the ReUI animated SVG icons pack. | **70 Components** |
| **Phase 3** | **3D WebGL, Shaders & Media** | Ingest ThreeUI `threejs-model-viewport`, `matrix-code-stream`, `dot-matrix-scoreboard`, Remocn `kinetic-title-card`, and `split-video-comparator`. | **85 Components** |
| **Phase 4** | **Anti-Slop 2.0 & Unslop CLI** | Expand rulepack to **SLOP-001 through SLOP-030**, release `design-wiki unslop` auto-fixer CLI, and deploy Tripwire security sandbox to Edge MCP. | **100+ Components** |

---

## Summary of Recommendations

To make the Agent Wiki the benchmark registry for AI coding models:
1. **Add AI-Native components**: Modern agents frequently build chat interfaces, reasoning streams, and live code canvases.
2. **Standardize SVG diagrams**: Incorporating `cathrynlavery/diagram-design` gives agents clean, dependency-free visual representations that replace fragile box drawings.
3. **Integrate enterprise data grids & 638 animated icons** from `reui.io` to support deep application development beyond simple landing pages.
4. **Expand anti-slop rules to 30 specifications**, adding writing/copy linting, strict color math, and an automated `unslop` auto-fixing CLI.