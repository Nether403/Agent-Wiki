# 🛡️ @design-wiki/audit-linter

The anti-slop verification, automated unslop refactoring, and taste-auditing engine for the **Machine-First Design Agent Wiki**.

Evaluates TypeScript, React, and Tailwind CSS code against 50 anti-slop rules, scans arbitrary CSS pixel hacks (`p-[17px]`), computes calibrated 1–10 taste dials (`Design Variance`, `Motion Intensity`, `Visual Density`), and provides an automated AST `unslop` engine for auto-remediating vibe-coded components.

---

## 🚀 Features

* **50 Anti-Slop Rules (SLOP-001 to SLOP-050)**: Targets hardcoded indigo, purple-to-blue gradients, blanket glassmorphism, chained type assertions (`as any as`), unshaded flat backgrounds (`bg-white`), AI writing clichés, timer leaks in `useEffect`, unconstrained `any`, missing focus rings, contrast violations, dynamic mobile viewport units (`100dvh`), uncleaned listeners, and streaming `aria-live` containers.
* **Automated `unslop` Refactoring Engine**: Transforms messy, vibe-coded components into clean TSX conforming to semantic tokens, dark-mode styling, and 4 distinct design themes (`default`, `neo-tokyo`, `midnight`, `minimal`).
* **CSS Anti-Pattern Scanner (`scanCssAntiPatterns`)**: Detects un-tokenized arbitrary pixel values (`p-[17px]`, `m-[13px]`, `gap-[15px]`) and normalizes them to standard Tailwind CSS tokens.
* **Automated Taste Review & LLM Gating**: Computes health scores (0–100) and assigns calibrated 1–10 ratings for Design Variance, Motion Intensity, and Visual Density.
* **Layout Stability Guardrails**:
  - **Procedural Shaders**: Permitted high motion (8–10) only when guarded by `prefers-reduced-motion` and visual CSS fallbacks.
  - **Controlled Glassmorphism**: Blanket blur is penalized unless framed with structural border tokens (`border-border`) and solid card fallbacks.
  - **Token Spacing Rhythm**: Flagged when arbitrary pixel units threaten responsive layout stability.
  - **Shaded & Tokenized Surfaces**: Raw unshaded backgrounds are blocked under `SLOP-021` to enforce semantic token discipline.

---

## 🛠️ CLI Usage

```bash
# Run the 50-rule linter across all registry components
pnpm lint:slop

# Full catalog taste dial calibration & consistency verification
pnpm review:taste

# Run unslop refactoring directly via CLI
tsx src/unslop.ts ./components/ui/hero.tsx --theme neo-tokyo
```

---

## 📦 Programmatic Usage

```typescript
import {
  auditCode,
  scanCssAntiPatterns,
  unslopCode,
  unslopFile,
  runLlmTasteReview,
  classifyComponentDials,
} from "@design-wiki/audit-linter";

// 1. Audit arbitrary code string against 30 rules
const auditResult = auditCode(codeString, "component.tsx");
console.log(`Health Score: ${auditResult.healthScore}/100`);
console.log("Violations:", auditResult.violations);

// 2. Auto-remediate slop code to 100/100 zero-slop TSX
const remediated = unslopCode(codeString, {
  theme: "neo-tokyo",
  componentName: "MyHeroComponent",
  author: "Design Agent",
});
console.log("Remediated Source Code:\n", remediated.remediatedCode);
console.log("Changes Applied:", remediated.changesApplied);

// 3. Scan CSS for arbitrary pixel hacks
const cssAntiPatterns = scanCssAntiPatterns(codeString);
for (const match of cssAntiPatterns) {
  console.warn(`Line ${match.line}: ${match.matchedText} -> Suggested: ${match.suggestedToken}`);
}

// 4. Classify taste dials with optional defaultDials preset
const dials = classifyComponentDials(codeString, "canvas-fluid-wave.tsx", {
  defaultDials: { design_variance: 9, motion_intensity: 9, visual_density: 3 },
});
console.log("Taste Dials:", dials);
```

---

## 📄 License

MIT © Design Agent Wiki Contributors
