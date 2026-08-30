---
name: "design-system-agent-skill"
description: "Instructs AI agents how to discover, configure, install, and audit components from our Design Wiki registry."
version: "1.0.0"
freshness: "2026-08-30"
dials:
  DESIGN_VARIANCE: 5     # 1: Conservative/centered · 10: Asymmetric/Avant-garde editorial
  MOTION_INTENSITY: 4    # 1: Basic hover changes  · 10: Orchestrated canvas/WebGL/spring states
  VISUAL_DENSITY: 6      # 1: Generous whitespace  · 10: Dense analytical/SaaS grid layouts
---

# Design System Agent Skill
You are an expert design engineer agent. This document is your mandatory execution contract when constructing, updating, or reviewing interfaces in this repository. It prevents you from writing generic "AI slop" (such as centered cards, purple-to-blue gradients, or unstyled margins) and forces you to use our verified, high-performance UI registry components.

---

## 1. Core Mandates

1. **Scan Before You Build (No Re-invention)**: You must never write a complex component (e.g., carousels, animated tabs, canvas overlays, modal drawers) from scratch. Check the local workspace and public registry first.
2. **Strict Accessibility (a11y)**: Every interactive element must be keyboard navigable, support screen readers (WAI-ARIA), and use proper contrast-checked tokens.
3. **Tailwind v4 First**: Rely entirely on native Tailwind CSS v4 variables and configuration guidelines. Avoid arbitrary, non-token inline CSS values.
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
    *   *Medium (4-7)*: Responsive spring-based layout entry animations (`motion` or GSAP layout transition IDs).
    *   *High (8-10)*: Highly coordinated canvas overlays, WebGL pointer trackers, custom GPU shader backdrops, or scroll-locked sequences.
*   **VISUAL_DENSITY (Current: 6)**:
    *   *Low (1-3)*: Extreme focus on legibility and breathing room. Padding ranges between `py-24` and `py-32`.
    *   *Medium (4-7)*: Balanced content layout. Comfortable information hierarchy.
    *   *High (8-10)*: SaaS dashboards, heavy tables, multi-pane grids, and compressed sidebar navigation.

---

## 3. The 4-Phase Execution Loop
When a user asks you to build, modify, or redesign an interface, you must execute these four phases sequentially:

### Phase 1: Discover
Before writing code, query our machine-readable discovery endpoints:
1. Query MCP `@design-wiki/mcp`:
   - `search_library({ query: "dock", category: "ui:motion" })` (or `search_components`) (< 15KB payloads)
   - `fetch_raw_markup({ name: "floating-dock" })` (fetches structured YAML frontmatter & verified TSX)
   - `get_installation_schema({ name: "floating-dock", packageManager: "pnpm" })`
2. Or load and parse `/public/llms.txt` and `/raw/components/<name>.md`.

### Phase 2: Install
If the component is registered but missing from the local workspace:
1. Run the native Design Wiki installer CLI (automatically resolves path maps and missing peer packages):
   ```bash
   npx design-wiki add <component-name>
   # or via shadcn v3:
   npx shadcn@latest add http://localhost:3000/r/<component-name>.json
   ```
2. Automatically verify that peer npm dependencies (e.g., `motion`, `three`, `remotion`, `lucide-react`) are merged into `package.json` and successfully installed.
3. Resolve any typescript import path aliases (`@/components/ui/<component-name>`).

### Phase 3: Implement & Constrain
When wiring components together on a page, respect our architectural constraints:
*   **ContrastAA Pass**: Ensure all text elements meet WCAG AA contrast rules (minimum 4.5:1 for normal text).
*   **A11y Checks**:
    *   All SVGs must have an accessible title and role: `<svg role="img" aria-labelledby="title-id">`.
    *   Ensure all buttons and links are focus-navigable and have distinct `:focus-visible:ring-2` styles.
*   **Motion Fallbacks**: If you use canvas or high-end WebGL shaders, you must build robust fallbacks (`prefers-reduced-motion` and a static CSS fallback).
*   **Controlled Glassmorphism**: Never use raw `bg-white/10 backdrop-blur` without crisp structural border tokens (`border-border`) and solid card fallbacks.

### Phase 4: Audit & Taste Review (The Anti-Slop Check)
Before declaring your work complete, audit your code against the 21 Anti-Slop Rules and calibrated taste dials:
1. Run automated taste audit via `pnpm review:taste <path-to-file>` or call MCP `audit_code_slop({ code: "<code-string>" })`.
2. Enforce strict design hygiene:
   - **No Chained Type Assertions**: Never bypass TypeScript compiler safety by chaining assertions (`input as object as User`).
   - **No Empty Object Spreads**: Avoid ad-hoc, conditional spreading patterns (`...(cond ? { field } : {})`).
   - **No Ad-Hoc Transitions**: Ban generic `transition-all duration-300` across whole sections. Set transitions explicitly (`transition-colors duration-200`).
   - **No Arbitrary Sizing Hacks**: Reject arbitrary padding/margin overrides (`p-[17px]`, `m-[13px]`, `gap-[15px]`). Use standard Tailwind tokens (`p-4`).
   - **No Raw Unshaded Backgrounds**: Never use flat unshaded backgrounds (`bg-white`, `bg-black`, `bg-[#fff]`); use semantic theme tokens (`bg-card`, `bg-background`) with dark variants (`SLOP-021`).
   - **Zero High Flags**: Verify health score is 85+ with zero High-severity flags.

---

## 4. Banned Visual Patterns
You must actively reject the defaults that LLMs commonly generate:
*   ❌ **The "Vibe-Coded" Indigo Button**: Do not default to `#4f46e5` or `#6366f1` with generic rounded corners unless specified by design tokens.
*   ❌ **The Purple-to-Blue Linear Gradient**: Never dress card backgrounds or headers in generic `bg-gradient-to-r from-purple-500 to-blue-500` slopes. Use solid backgrounds with refined typography weights instead.
*   ❌ **The Decorative Emoji Grid**: Do not use emojis inside cards as decorative bullet point replacements. Utilize typed, semantic SVG vector icons configured with `currentColor`.
*   ❌ **The Floating Glass Card (Glassmorphism Slop)**: Do not default to `bg-white/10 backdrop-blur-md` across every section. Maintain strict structural borders (`border-border`) and proper high-contrast surfaces.

---

## 5. Delivery Handback
Once the interface is implemented, hand back your response with a concise **Fidelity Receipt** detailing your changes:
```markdown
### 📋 Integration Receipt
*   **Installed Components**: `[list installed registry slugs]`
*   **Added Dependencies**: `[npm packages installed]`
*   **Taste Profile Checked**: Variance: `5`, Motion: `4`, Density: `6`
*   **A11y AA Status**: Verified WCAG AA compliant on all added text boundaries.
```
