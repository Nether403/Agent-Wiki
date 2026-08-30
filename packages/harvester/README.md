# 🌾 @design-wiki/harvester

The automated ingestion engine and AST static analyzer for the **Machine-First Design Agent Wiki**.

Connects to seven curated upstream repositories (HeroUI v3, SmoothUI, Aceternity UI, Canvas UI, Evil-Buttons, diagram-design, Tailark) and any local staging directory, parses TypeScript AST structures, scores structural complexity, and generates clean, machine-readable YAML frontmatter contracts.

---

## 🚀 Features

* **AST Parsing & Dependency Extraction**: Statically extracts third-party packages (`motion`, `lucide-react`, `three`, `@radix-ui/*`, `@ark-ui/react`), props interfaces, and local shadcn dependencies using the TypeScript Compiler API.
* **Radix/Ark Primitive Auto-Binding**: When a component imports from `@radix-ui/react-*` or `@ark-ui/react`, those package names are automatically injected into `registryDependencies` and `peerDependencies` to ensure clean downstream installation without manual override.
* **Three.js, WebGL & Media Auto-Cross-Referencing**: When scanning creative canvas or WebGL shader files, automatically injects `three` into `dependencies`, adds `@types/three` to `devDependencies`, and cross-references taxonomy tags (`webgl`, `threejs`, `canvas`).
* **`defaultDials` Preset Support**: Each entry in `KNOWN_REPOSITORIES` defines a `defaultDials` preset (`{ design_variance, motion_intensity, visual_density }`). When parsing a component from a known library, the repo-level preset is merged into the component's dial calibration before per-component scoring overrides are applied, ensuring consistent library-wide taste profiles.
* **`prefers-reduced-motion` Detection**: The parser scans for `prefers-reduced-motion` media query usage in TSX source (`window.matchMedia`). Components that handle this fallback correctly automatically receive `reduced_motion_supported: true` in their accessibility contract and the `motion-safe` tag in their taxonomy output.
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
