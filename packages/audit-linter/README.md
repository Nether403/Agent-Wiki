# 🛡️ @design-wiki/audit-linter

The anti-slop verification and taste-auditing engine for the **Machine-First Design Agent Wiki**.

Evaluates TypeScript, React, and Tailwind CSS code against 21 anti-slop rules, scans arbitrary CSS pixel hacks (`p-[17px]`), computes calibrated 1–10 taste dials (`Design Variance`, `Motion Intensity`, `Visual Density`), and enforces layout-stability guardrails.

---

## 🚀 Features

* **21 Anti-Slop Rules**: Targets hardcoded indigo, purple-to-blue gradients, blanket glassmorphism, chained type assertions (`as any as`), emojis, unshaded flat backgrounds (`bg-white`), and accessibility issues.
* **CSS Anti-Pattern Scanner (`scanCssAntiPatterns`)**: Detects un-tokenized arbitrary pixel values (`p-[17px]`, `m-[13px]`, `gap-[15px]`, `w-[279px]`) and recommends standard Tailwind CSS tokens.
* **Automated Taste Review & LLM Gating**: Computes health scores (0–100) and assigns calibrated 1–10 ratings for Design Variance, Motion Intensity, and Visual Density.
* **Layout Stability Guardrails**:
  - **Procedural Shaders**: Permitted high motion (8–10) only when guarded by `prefers-reduced-motion` and visual CSS fallbacks.
  - **Controlled Glassmorphism**: Blanket blur is penalized unless framed with structural border tokens (`border-border`) and solid card fallbacks.
  - **Token Spacing Rhythm**: Flagged when arbitrary pixel units threaten responsive layout stability.
  - **Shaded & Tokenized Surfaces**: Raw unshaded backgrounds are blocked under `SLOP-021` to enforce semantic token discipline.

---

## 🛠️ CLI Usage

```bash
# Run the 21-rule linter across all registry components
pnpm lint:slop

# Or run the CLI directly:
tsx src/cli.ts audit packages/registry/src

# Run the automated taste audit & 1-10 dial calibration on a file:
tsx src/cli.ts review packages/registry/src/creative/canvas-fluid-wave.tsx

# Generate full Markdown scorecard:
tsx src/cli.ts audit packages/registry/src --report COMPLETED-DESIGN-AUDIT.md
```

---

## 📦 Programmatic Usage

```typescript
import { auditCode, scanCssAntiPatterns, runLlmTasteReview } from "@design-wiki/audit-linter";

// 1. Audit arbitrary code string
const result = auditCode(codeString, "component.tsx");
console.log(`Health Score: ${result.healthScore}/100`);

// 2. Scan CSS for arbitrary pixel hacks
const cssAntiPatterns = scanCssAntiPatterns(codeString);
for (const match of cssAntiPatterns) {
  console.warn(`Line ${match.line}: ${match.matchedText} -> Suggested: ${match.suggestedToken}`);
}

// 3. Run full taste review with dials & guardrails
const review = runLlmTasteReview(codeString, "canvas-fluid-wave.tsx");
console.log("Taste Dials:", review.dials);
console.log("Passed Guardrails:", review.guardrails);
```

---

## 📄 License

MIT © Design Agent Wiki Contributors
