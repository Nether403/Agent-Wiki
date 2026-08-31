---
name: ai-design-eval-harness
description: "Zero-Draft evaluation framework, benchmark scoring methodology, synthetic persona validation, and continuous quality monitoring for AI coding agents."
risk: safe
source: "https://github.com/agent-wiki/eval-harness"
date_added: "2026-08-31"
---

# AI Design Evaluation Harness Skill

This skill describes the intended Phase 4 evaluation loop. Today the harness lints with `@design-wiki/audit-linter` and leaves compile/axe scores null until a real sandbox exists.

---

## 1. Zero-Draft Fidelity Metrics

| Metric | Target SLA | Measurement Method |
| :--- | :--- | :--- |
| **First-Run Compilation** | ≥ 95% | `tsc --noEmit` & Vite/Next.js production build in fresh sandbox |
| **Anti-Slop Health Score** | ≥ 90 / 100 | Automated 50-rule AST and regex audit (`verify-audit`) |
| **A11y Pass Rate** | 100% WCAG 2.1 AA | Automated Axe-Core CI suite evaluating light and dark modes |
| **Payload Compactness** | < 15KB | Byte budget inspection on all MCP and `/raw/` endpoints |
| **CLI Resolution Speed** | < 1.5s | Cold-cache package installation benchmark |

---

## 2. Multi-Persona Synthetic Review

When evaluating generated interfaces, simulate 3 distinct expert personas:

1. **Accessibility Auditor Persona**:
   - Validates color contrast ratios (≥ 4.5:1 text, ≥ 3.0:1 graphics).
   - Enforces keyboard navigation, focus visible rings, and ARIA attributes.
   - Checks `prefers-reduced-motion` fallbacks on all canvas/motion elements.

2. **Visual Design Director Persona**:
   - Evaluates typography discipline, hierarchical spacing rhythm, and subtle border accents.
   - Rejects visual slop (indigo buttons, generic purple gradients, emoji bullet points).
   - Validates taste dials calibration (Variance, Motion, Density).

3. **Performance & Systems Architect Persona**:
   - Audits DOM depth (< 32 nodes deep), memoization of array transformations, and bundle size.
   - Verifies cleanup of `setInterval`, `addEventListener`, and `requestAnimationFrame` loops.
   - Rejects non-token arbitrary styles and layout-triggering CSS properties.

---

## 3. Evaluation Sandbox Execution Protocol

```bash
# Execute headless evaluation harness
pnpm --filter @design-wiki/eval-harness test:benchmark
```
