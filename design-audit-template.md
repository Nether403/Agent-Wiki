# DESIGN-AUDIT.md — UI/UX & Code Quality Assessment

This is an evidence-based audit scorecard designed for AI coding agents (such as Cursor, Claude Code, and Codex) to benchmark an existing user interface, locate engineering and design regression patterns ("AI Slop"), and map out a systematic refactor or redesign.

**Audit Target:** `[Insert Page / Module Path, e.g., src/app/dashboard/page.tsx]`  
**Date Evaluated:** `[YYYY-MM-DD]`  
**Evaluator:** `[Agent Name / Manual Audit]`  

---

## 📊 EXECUTIVE METRIC

### Overall Score: **-- / 100**

| Core Dimension | Scored Points | Maximum Points | Status |
| :--- | :---: | :---: | :---: |
| [1. Layout, Grid, & Breakpoints](#1-layout-grid--breakpoints) | 0 | 25 | **TBD** |
| [2. Typography, Contrast, & Accessibility](#2-typography-contrast--accessibility) | 0 | 25 | **TBD** |
| [3. Motion, Transitions, & Performance](#3-motion-transitions--performance) | 0 | 25 | **TBD** |
| [4. Code Quality & Registry Alignment](#4-code-quality--registry-alignment) | 0 | 25 | **TBD** |

*Note: Any score below **70/100** requires an immediate, automated redesign protocol using the workspace component registry guidelines.*

---

## 🔍 DETAILED AUDIT CHECKLIST

Each item carries an assigned point value. For each failure, deduct the item's points and log the exact `file:line` evidence.

### 1. Layout, Grid, & Breakpoints (Max: 25 pts)
Focuses on macrostructures, responsive scaling, and spacing alignment.

- [ ] **[5 pts] No Horizontal Scroll Overflow**: Page does not overflow horizontally at any viewport width (tested from 320px up to 1920px).
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Strict Token Spacing**: No arbitrary, non-token pixel value escapes in styles (e.g., avoids `p-[17px]` or `mt-[13px]`). Spacing strictly adheres to Tailwind system spacing grids (divisible by 4px).
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] No Repetitive Centered Card Grids**: Avoids the "vibe-coded default" of 3-column layouts with identically shaped, centered informational cards containing a top-centered icon, brief title, and short paragraph.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Consistent Breakpoint Adaptability**: Employs responsive column grids with proportional wrapping, ensuring typography scales down proportionally on mobile viewports.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Visual Hierarchy & Focus Elements**: One dominant, intentional section focus block (e.g., asymmetric layout rules or structured content line rules). Space feels balanced, with sections clearly delimited.
  * *Evidence:* `[Pass / Fail - file:line, details]`

### 2. Typography, Contrast, & Accessibility (Max: 25 pts)
Ensures standard-compliant visual contrast, font discipline, and assistive tech support.

- [ ] **[5 pts] WCAG Contrast Compliance**: All body copy and headings maintain a minimum of 4.5:1 contrast ratio against backdrops (checked in both Light and Dark mode).
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Accessibility Primitives**: Interactive elements have unique `aria-*` tags. Inline SVGs must contain a resolving `<title>` with `role="img"` and proper `aria-labelledby` linkages.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Font Weight Discipline**: No more than three active font weights or font families. Retains high editorial spacing and line-heights without font-weight sprawl.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Screen Reader & Focus Navigation**: All CTA anchors and buttons are keyboard focus-navigable, with distinct `:focus-visible` ring outlines.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Zero Banned Contrast Defeating Patterns**: No pale gray text overlays on white surfaces, or low-contrast sublabels.
  * *Evidence:* `[Pass / Fail - file:line, details]`

### 3. Motion, Transitions, & Performance (Max: 25 pts)
Checks animation choreography, hardware strain, and user comfort.

- [ ] **[5 pts] Respects `prefers-reduced-motion`**: All heavy transitions, WebGL shaders, or complex spring animations degrade gracefully into static, fully functional layout equivalents if a user prefers reduced motion.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] No Blanket `transition-all` Overuse**: Rejecting generic `transition-all duration-300` on parent nodes or complex wrappers. Transitions are applied selectively to specific mutable styles (e.g., `transition-colors duration-200`).
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] GPU-Accelerated Mechanics**: Transitions are driven by transforms, opacity, and scale (`transform`, `opacity`) instead of trigger-heavy properties that force browser page repaints (`height`, `width`, `margin`).
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Coordinated Spring Choreography**: Motion patterns feature responsive spring metrics or GSAP-based orchestrated staggered entrances instead of standard linear ease timers.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] No Layout Shifts**: Content does not shift, flash, or jump as assets stream in, widgets initialize, or dynamic fonts are loaded.
  * *Evidence:* `[Pass / Fail - file:line, details]`

### 4. Code Quality & Registry Alignment (Max: 25 pts)
Sanitizes "AI Slop" coding anti-patterns and verifies library reuse.

- [ ] **[5 pts] Master Component Reuse**: No duplication or manual rebuilding of complex interactive components (e.g., carousels, tabs, voice UI orbs, bento layouts). Standard imports are mapped directly to your local UI/UX Registry.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Zero Chained Type Assertions**: No TS compiler safety bypasses (such as `const data = raw as unknown as Schema`).
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Clean Object Spread Operations**: No empty object spreads for optional props configuration (e.g., avoid `...(condition ? { key } : {})`). Use typed fallback boundaries.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] No Module Mocking Abuse**: Strictly enforces real dependency injections or defined runtime boundaries instead of heavy ad-hoc test-mocking structures.
  * *Evidence:* `[Pass / Fail - file:line, details]`
- [ ] **[5 pts] Safety Comments for Code Escapes**: Every remaining non-const TypeScript assertion is explicitly preceded by a `// SAFETY:` block documenting why the invariant is checked and trusted.
  * *Evidence:* `[Pass / Fail - file:line, details]`

---

## 🚫 DETECTED SLOP PATTERNS (CRITICAL FAILS)

Check your page elements for the following standard "vibe-coded" outputs. If any are present, mark them below and trigger a **redesign** path:

*   [ ] **The "Vibe-Coded" Indigo Button**: Defaulting to indigo-600 (`#4f46e5` / `#6366f1`) for standard interactive primary states without theme-token relevance.
*   [ ] **The Purple-to-Blue Linear Gradient**: Arbitrary overlays of `bg-gradient-to-r from-purple-500 to-blue-500` behind cards, badges, headers, or buttons.
*   [ ] **The Decorative Emoji Grid**: Standard bullet point columns dressed up as cards using emojis in place of clean, current-color vector SVG icons.
*   [ ] **The Floating Glass Card**: Blanket inclusion of `bg-white/10 backdrop-blur-md` grids across standard sections where clear structural borders (`border-border`) should establish hierarchy.
*   [ ] **Empty Code Skeletons**: Code structures containing truncated logic comments, e.g., `// TODO: implement full logic` or mock API ranges.

---

## 🛠️ AGENT ACTION PLAN & INSTRUCTIONS

When an AI coding agent loads this `DESIGN-AUDIT.md` file, it must execute the following sequential refactor:

```markdown
### 📋 INTEGRATION PROTOCOL FOR AGENT REFITS

1. **Review and Benchmark**:
   - Inspect the 'Overall Score' and review individual failure lines marked under the Core Dimensions.
   
2. **Execute Stage 1: Dependency Cleanup**:
   - Install required dependencies or peer packages recorded in the failures using the workspace registry standard.
   
3. **Execute Stage 2: Token Alignments**:
   - Strip out any absolute inline offsets or color values and merge them into the centralized Tailwind v4 token config.
   - Rectify all color contrasts to hit WCAG AA minimum thresholds.
   
4. **Execute Stage 3: Section Retheming**:
   - Refactor sections sequentially. Replace hand-written components with standard registered structures (e.g., using `npx shadcn add` for `@smoothui`, `@dotmatrix`, or `@evilbuttons` primitives as recommended by your wiki catalog).
   
5. **Pre-flight & Re-audit**:
   - Build locally to verify code changes are free of compilation warnings.
   - Rerun the test suit, check layout responsive wrappers at multiple breakpoints, and fill out a new version of the scorecard.
```
