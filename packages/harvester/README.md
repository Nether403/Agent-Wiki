# 🌾 @design-wiki/harvester

The automated ingestion engine, AST static analyzer, and DAG dependency solver for the **Machine-First Design Agent Wiki**.

Connects to remote UI registries, GitHub repositories (HeroUI v3, SmoothUI, Aceternity UI, KokonutUI, Canvas UI, Evil-Buttons, diagram-design, Tailark), and local directories, parses TypeScript AST structures, generates Directed Acyclic Graphs (DAG), and outputs machine-readable JSON/YAML contracts.

---

## 🚀 Features

* **Universal Multi-Registry Ingestion**: Ingests remote shadcn-compatible JSON schemas (`pnpm harvest ingest <url>`), applies AST codemods, validates against the 30 Anti-Slop Rules, and compiles components into the registry.
* **DAG Dependency Graph & Topological Sorting**: Builds full dependency topologies, detects circular dependencies, calculates installation sequences, and exports Mermaid diagram flowcharts.
* **AST Parsing & Dependency Extraction**: Statically extracts third-party packages (`motion`, `lucide-react`, `three`, `@radix-ui/*`, `@ark-ui/react`), props interfaces, and local shadcn dependencies using the TypeScript Compiler API.
* **Radix/Ark Primitive Auto-Binding**: Automatically maps upstream primitives to `registryDependencies` and `peerDependencies` for zero-configuration installation.
* **`prefers-reduced-motion` Detection**: Automatically analyzes motion hooks and media queries to inject accessibility contracts (`reduced_motion_supported: true`).
* **Taste Dial Scoring Heuristics**: Automatically calculates 1–10 dials for Design Variance, Motion Intensity, and Visual Density.
* **Legal Attribution**: Injects immutable SPDX license headers and repository source links (`@origin`, `@license`, `@curated-by`).

---

## 🛠️ CLI Usage

```bash
# Full end-to-end remote registry or repository ingestion
pnpm harvest ingest kokonutui
# or via remote URL
pnpm harvest ingest https://kokonutui.com/r/ai-input-search.json

# Generate DAG dependency graph and topological install order
pnpm harvest graph packages/registry/src

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
import {
  parseComponentAst,
  buildDependencyGraph,
  generateYamlFrontmatter,
  harvestDirectory,
} from "@design-wiki/harvester";

// 1. Build DAG Dependency Graph
const graph = buildDependencyGraph("./packages/registry/src");
const report = graph.generateReport();
console.log("Topological Install Order:", report.topologicalInstallOrder);
console.log("Mermaid Topology:\n", graph.exportMermaid());

// 2. Parse Single Component AST
const sourceCode = `...`;
const parsed = parseComponentAst("canvas-fluid-wave.tsx", sourceCode);
console.log("Complexity:", parsed.complexity);
console.log("Dependencies:", parsed.dependencies);
```

---

## 📄 License

MIT © Design Agent Wiki Contributors
