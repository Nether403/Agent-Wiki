# 🌾 @design-wiki/harvester

The automated ingestion engine and AST static analyzer for the **Machine-First Design Agent Wiki**.

Connects to upstream repositories (HeroUI, SmoothUI, Aceternity, Canvas UI, Evil-Buttons, diagram-design, Tailark, Remocn, etc.), parses TypeScript AST structures, auto-cross-references WebGL/Three.js and Remotion dependencies, scores structural complexity, and generates clean, machine-readable YAML frontmatter contracts.

---

## 🚀 Features

* **AST Parsing & Dependency Extraction**: Statically extracts third-party packages (`motion`, `lucide-react`, `three`, `remotion`, `@radix-ui/*`), props interfaces, and local shadcn dependencies using the TypeScript Compiler API.
* **Three.js, WebGL & Media Auto-Cross-Referencing**: When scanning creative canvas or video shader files, automatically injects `three` or `remotion` into `dependencies` and cross-references taxonomy tags (`webgl`, `threejs`, `remotion`, `timeline`, `canvas`).
* **Structural Complexity Scoring**: Evaluates mathematical oscillation loops (`requestAnimationFrame`), shader setups, and lines of code to classify components into `low`, `medium`, or `high` complexity.
* **YAML Frontmatter Injection**: Injects standardized metadata and taste dial contracts into generated component documentation.
* **Normalization Codemods**: Transforms legacy Tailwind v3 values and imports to Tailwind v4 and React 19 / `motion/react`.
* **Legal Attribution**: Injects immutable SPDX license headers and repository source links.

---

## 🛠️ CLI Usage

```bash
# Harvest a specific upstream repository
pnpm harvest repo smoothui

# Harvest a directory of local components
pnpm harvest dir ./packages/registry/src/creative

# Parse and inspect a single component
pnpm harvest file ./packages/registry/src/creative/canvas-fluid-wave.tsx

# List all supported upstream targets
pnpm harvest list
```

---

## 📦 Programmatic Usage

```typescript
import { parseComponentAst, generateYamlFrontmatter, injectYamlFrontmatter } from "@design-wiki/harvester";

const sourceCode = `...`;
const parsed = parseComponentAst("canvas-fluid-wave.tsx", sourceCode);

console.log("Complexity:", parsed.complexity); // "low" | "medium" | "high"
console.log("Dependencies:", parsed.dependencies);
console.log("Tags:", parsed.tags);

const frontmatter = generateYamlFrontmatter({
  id: "canvas-fluid-wave",
  name: "Canvas Fluid Wave",
  category: "ui:creative",
  parsed,
});
```

---

## 📄 License

MIT © Design Agent Wiki Contributors
