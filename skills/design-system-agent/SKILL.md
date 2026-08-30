---
name: "design-system-agent"
description: "Instructs AI coding agents (Claude Code, Cursor, Codex, v0) how to discover, configure, install, and audit components from our Machine-First Design Wiki registry."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 5     # 1: Conservative/centered · 10: Asymmetric/Avant-garde editorial
  MOTION_INTENSITY: 4    # 1: Basic hover changes  · 10: Orchestrated canvas/WebGL/spring states
  VISUAL_DENSITY: 6      # 1: Generous whitespace  · 10: Dense analytical/SaaS grid layouts
---

# Design System Agent Skill: Machine-First Registry Integration

You are an expert design engineer agent. This document is your mandatory execution contract when constructing, updating, or reviewing interfaces in this workspace. It prevents you from writing generic "AI slop" (such as hardcoded indigo-600 buttons, purple-to-blue gradients, or unstyled margins) and forces you to use our verified, high-performance UI registry components.

---

## 1. Core Mandates

1. **Scan Before You Build (No Re-invention)**: You must never write a complex component (e.g. carousels, animated tabs, canvas overlays, modal drawers, bento grids) from scratch. Check the local workspace and public registry first.
2. **Strict Accessibility (a11y)**: Every interactive element must be keyboard navigable, support screen readers (WAI-ARIA), and use proper contrast-checked tokens.
3. **Tailwind v4 First**: Rely entirely on native Tailwind CSS v4 variables and configuration guidelines. Avoid arbitrary, non-token inline CSS values (`p-[17px]`).
4. **No Code Skeletons or Placeholders**: Write fully realized, copy-pasteable, error-free code blocks. Never insert `// TODO: add logic` or truncate component payloads.

---

## 2. Active Dials (Calibration Matrix)

Read the repository's configuration (or infer from the user's brief) to adjust the following style variables:

*   **DESIGN_VARIANCE (Current: 5)**:
    *   *Low (1-3)*: Rigid alignment, central columns, conventional grids. Use for settings pages or docs.
    *   *Medium (4-7)*: Subtle offsets, asymmetrical section headers, editorial line rules. Best for standard SaaS landing pages.
    *   *High (8-10)*: Bold typography sizes, overlapping cards, brutalist lines, and experimental masonry grids.
*   **MOTION_INTENSITY (Current: 4)**:
    *   *Low (1-3)*: Interactive state transitions limited to standard CSS `transition-colors` on hover and active.
    *   *Medium (4-7)*: Responsive spring-based layout entry animations (`motion/react` or GSAP layout transition IDs).
    *   *High (8-10)*: Highly coordinated canvas overlays, WebGL pointer trackers, custom GPU shader backdrops, or scroll-locked sequences.
*   **VISUAL_DENSITY (Current: 6)**:
    *   *Low (1-3)*: Extreme focus on legibility and breathing room. Padding ranges between `py-24` and `py-32`.
    *   *Medium (4-7)*: Balanced content layout. Comfortable information hierarchy.
    *   *High (8-10)*: SaaS dashboards, heavy tables, multi-pane grids, and compressed sidebar navigation.

---

## 3. The 4-Phase Execution Loop

### Phase 1: Discover
Before writing code, query our machine-readable discovery endpoints:
1. Parse `/public/llms.txt` or call MCP `search_components` to look up available components, categories, and tags.
2. If using MCP, query `@design-wiki/mcp`:
   - `search_components({ query: "modal" })`
   - `fetch_raw_markup({ name: "spring-dialog" })`
   - `get_installation_schema({ name: "spring-dialog" })`

### Phase 2: Install
If the component is registered but missing from the local workspace:
1. Fetch the schema via MCP `get_installation_schema({ name: "<component-name>" })` or execute the programmatic CLI:
   ```bash
   npx shadcn@latest add http://localhost:3000/r/<component-name>.json
   ```
2. Automatically verify that peer npm dependencies (e.g. `motion`, `lucide-react`, `@radix-ui/*`) are installed.
3. Resolve any typescript import path aliases (`@/components/ui/`).

### Phase 3: Implement & Constrain
*   **ContrastAA Pass**: Ensure all text elements meet WCAG AA contrast rules (minimum 4.5:1 for normal text).
*   **A11y Checks**:
    *   All SVGs must have an accessible title and role: `<svg role="img" aria-label="description">`.
    *   Ensure all buttons and links are focus-navigable and have distinct `:focus-visible` styles.
*   **Motion Fallbacks**: If you use canvas or high-end WebGL shaders, you must build robust fallbacks (`prefers-reduced-motion`).

### Phase 4: Audit (The Anti-Slop Check)
Audit your code against the 20 Anti-Slop Rules before declaring your task complete:
1. No hardcoded indigo (`#4f46e5`, `bg-indigo-600`).
2. No purple-to-blue linear gradients (`from-purple-500 to-blue-500`).
3. No blanket glassmorphism (`bg-white/10 backdrop-blur-md`).
4. No chained type assertions (`as any as`).
5. No conditional empty object spreads (`...(cond ? { a } : {})`).
6. No blanket `transition-all duration-300`.
7. No arbitrary sizing hacks (`p-[17px]`).
8. No decorative emojis inside buttons or cards.

---

## 4. Delivery Handback
Once the interface is implemented, hand back your response with a concise **Fidelity Receipt**:
```markdown
### 📋 Integration Receipt
*   **Installed Components**: `[list installed registry slugs]`
*   **Added Dependencies**: `[npm packages installed]`
*   **Taste Profile Checked**: Variance: `5`, Motion: `4`, Density: `6`
*   **A11y AA Status**: Verified WCAG AA compliant on all added text boundaries.
*   **Anti-Slop Audit**: 0 flags detected.
```
