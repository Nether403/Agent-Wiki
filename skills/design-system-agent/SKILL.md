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
1. Parse `/public/llms.txt` or call MCP `search_library` / `search_components` to look up available components, categories, and tags (< 15KB payloads).
2. If using MCP, query `@design-wiki/mcp`:
   - `search_library({ query: "modal", category: "ui:motion" })`
   - `fetch_raw_markup({ name: "spring-dialog" })` (returns full YAML frontmatter contract & TSX block)
   - `get_installation_schema({ name: "spring-dialog", packageManager: "pnpm" })`

### Phase 2: Install
If the component is registered but missing from the local workspace:
1. Run the native Design Wiki installer CLI (automatically resolves `components.json`, `tsconfig.json` path aliases, and scaffolds missing `lib/utils.ts`):
   ```bash
   npx design-wiki add <component-name>
   # or via shadcn v3:
   npx shadcn@latest add http://localhost:3000/r/<component-name>.json
   ```
2. Automatically verify that peer npm dependencies (e.g. `motion`, `three`, `remotion`, `lucide-react`, `@radix-ui/*`) are installed.
3. Resolve typescript import path aliases (`@/components/ui/<component-name>`).

### Phase 3: Implement & Constrain
*   **ContrastAA Pass**: Ensure all text elements meet WCAG AA contrast rules (minimum 4.5:1 for normal text).
*   **A11y Checks**:
    *   All SVGs must have an accessible title and role: `<svg role="img" aria-label="description">`.
    *   Ensure all buttons and links are focus-navigable and have distinct `:focus-visible:ring-2` styles.
*   **Motion Fallbacks**: If you use canvas or high-end WebGL shaders, you must build robust fallbacks (`prefers-reduced-motion` and a static CSS fallback).
*   **Controlled Glassmorphism**: Never use raw `bg-white/10 backdrop-blur` without crisp structural border tokens (`border-border`) and solid card fallbacks.

### Phase 4: Audit & Taste Review (The Anti-Slop Gate)
Audit your code against the 21 Anti-Slop Rules and calibrated taste dials before declaring your task complete:
1. Call MCP `audit_code_slop({ code: "<your-tsx-code>" })` or run:
   ```bash
   pnpm review:taste <path-to-file>
   ```
2. Enforce strict design hygiene:
   - No hardcoded indigo (`#4f46e5`, `bg-indigo-600`) &rarr; use semantic tokens (`bg-primary`).
   - No purple-to-blue linear gradients (`from-purple-500 to-blue-500`) &rarr; use solid card surfaces.
   - No blanket glassmorphism (`bg-white/10 backdrop-blur-md`) without `border-border`.
   - No chained type assertions (`as any as`, `as unknown as`).
   - No conditional empty object spreads (`...(cond ? { a } : {})`).
   - No blanket `transition-all duration-300` &rarr; target specific mutable styles (`transition-colors`).
   - No arbitrary sizing hacks (`p-[17px]`, `m-[13px]`, `gap-[15px]`) &rarr; map to system tokens (`p-4`).
   - No raw unshaded backgrounds (`bg-white`, `bg-black`, `bg-[#fff]`) &rarr; use semantic tokens (`bg-card`, `bg-background`) with dark variants (`SLOP-021`).
   - No decorative emojis inside buttons or cards &rarr; use Lucide SVG icons.
3. Verify that the health score is 85+ with 0 High-severity flags.

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
