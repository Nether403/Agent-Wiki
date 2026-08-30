# Contributing to Machine-First Design Agent Wiki

Welcome to the **Machine-First Design Agent Wiki** contributor guidelines. We are curating the world's most rigorous, high-performance, and slop-free component catalog optimized for both human engineers and autonomous AI coding agents (Claude Code, Cursor, Windsurf, Copilot, Antigravity).

---

## 💎 The Zero-AI-Slop Standard

Unlike generic template aggregators, every component in this registry must pass our automated **21-Rule Anti-Slop Guardrail** and be calibrated against the **Taste Dial Matrix**.

### 🚫 The Banned Patterns (Zero Tolerance)
Before submitting a component, ensure your code has **zero** occurrences of:
1. **The Vibe-Coded Indigo Button (`SLOP-001`)**: No `#4f46e5`, `#6366f1`, or `bg-indigo-600` defaults. Use semantic tokens (`bg-primary`, `bg-card`).
2. **The Purple-to-Blue Linear Gradient (`SLOP-002`)**: No `from-purple-500 to-blue-500` card dressings. Use solid card surfaces with crisp `border-border`.
3. **Blanket Glassmorphism (`SLOP-003`)**: No raw `bg-white/10 backdrop-blur-md` without structural borders and solid fallbacks.
4. **Chained Type Assertions (`SLOP-004`)**: Never bypass TypeScript with `as unknown as Type` or `as any as Props`. Define explicit types and interfaces.
5. **Conditional Empty Object Spreads (`SLOP-005`)**: No `...(cond ? { val } : {})`.
6. **Blanket `transition-all duration-300` (`SLOP-006`)**: Target specific mutating properties (e.g. `transition-colors duration-200`).
7. **Arbitrary Pixel Sizing / Spacing (`SLOP-007`)**: No `p-[17px]`, `m-[13px]`, `gap-[15px]`. Use native Tailwind v4 tokens (`p-4`, `gap-3`).
8. **Decorative Emojis (`SLOP-008`)**: Do not use emojis inside cards/buttons. Use typed vector icons from `lucide-react`.
9. **Truncated TODO Placeholders (`SLOP-009`)**: Deliver 100% complete, functional code blocks with zero `// TODO: implement`.
10. **Missing Accessibility Roles / Focus Rings (`SLOP-010`, `SLOP-011`, `SLOP-012`)**: Every button must have accessible labels (`aria-label`), SVGs must have `role="img"`, and focus states must have `:focus-visible:ring-2`.
11. **Raw Unshaded Backgrounds (`SLOP-021`)**: Never use raw `bg-white` or `bg-black` without dark mode tokens (`dark:bg-...`, `bg-card`, `bg-background`).

---

## 🎛️ The Taste Dial Matrix (1-10)

Every component must declare its calibration coordinates:

| Dial | Scale (1-10) | Low (1-3) | Medium (4-7) | High (8-10) |
| :--- | :--- | :--- | :--- | :--- |
| **DESIGN_VARIANCE** | Alignment & Layout Rhythm | Rigid standard forms, central columns, conservative tables | Subtle offsets, asymmetrical section headers | Bold typography, overlapping cards, brutalist lines |
| **MOTION_INTENSITY** | Animation & Physics | Static CSS hover & transitions | Spring micro-interactions, layout transitions | Canvas/WebGL shaders, GPU particle fields |
| **VISUAL_DENSITY** | Information & Whitespace | Extreme breathing room (`py-24`) | Balanced SaaS dashboard layout | Compressed tables, dense metrics grids |

---

## 🛠️ Step-by-Step Contribution Workflow

### 1. Add Component Source
Place your component in the appropriate taxonomy folder inside `packages/registry/src/`:
- `packages/registry/src/primitives/` (Accessible core UI elements: buttons, dialogs, inputs, tabs)
- `packages/registry/src/motion/` (Physics micro-interactions, spring dialogs, docks)
- `packages/registry/src/creative/` (WebGL, Canvas, 3D shaders, gradient masks)
- `packages/registry/src/editorial/` (Data stats, analytical tables, diagram cards)
- `packages/registry/src/blocks/` (Bento grids, hero sections, pricing tables, navbars)
- `packages/registry/src/media/` (Video players, audio visualizers, timeline controllers)
- `packages/registry/src/utility/` (Loaders, keycombo badges, icon morphers)

### 2. Add Mandatory License Attribution Header
At the top of your component file:
```tsx
"use client";
/**
 * @origin Upstream Library Name (https://github.com/org/repo)
 * @license MIT
 * @author Author Name
 */
import * as React from "react";
// ...
```

### 3. Run the Automated Harvester & Ingestion Engine
```bash
# Ingest and enrich a single component file
pnpm harvest file ./packages/registry/src/motion/my-component.tsx

# Or harvest an entire directory
pnpm harvest dir ./packages/registry/src/motion
```

### 4. Run the Anti-Slop Linter & Taste Dial Audit
```bash
# Test single component with LLM design critique
pnpm --filter @design-wiki/audit-linter review ./packages/registry/src/motion/my-component.tsx

# Run full repository CI/CD guardrail
python verify-audit.py
pnpm review:taste
```

**Quality Requirement**: Health score must be **85+** (Grade S/A) with **zero** High-severity flags.

### 5. Compile the Master Registry
```bash
pnpm build:registry
```
Verify that:
- `apps/docs/public/r/my-component.json` is generated and valid.
- `apps/docs/public/raw/components/my-component.md` is generated with YAML frontmatter.
- `apps/docs/public/llms.txt` includes your component entry.

### 6. Verify via Agent Sandbox
```bash
# Test local CLI installation
node packages/cli/dist/index.js add my-component --dry-run

# Run full autonomous agent test suite
pnpm test
```

---

## 📋 Pull Request Submission Checklist

- [ ] Component is located in `packages/registry/src/<category>/<slug>.tsx`.
- [ ] Mandatory license and attribution comment header included.
- [ ] Uses Tailwind CSS v4 variables and semantic tokens.
- [ ] No arbitrary spacing hacks (`p-[17px]`) or hardcoded colors (`#4f46e5`).
- [ ] Full keyboard navigation and WAI-ARIA accessibility implemented.
- [ ] `pnpm review:taste` reports 100% dial consistency.
- [ ] `python verify-audit.py` passes with Health Score >= 85 and 0 High flags.
- [ ] `pnpm build` completes with 0 errors across all monorepo workspaces.
