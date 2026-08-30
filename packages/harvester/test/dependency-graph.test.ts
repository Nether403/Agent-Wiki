import { DependencyGraph, buildDependencyGraph } from "../src/dependency-graph";
import { parseComponentAST } from "../src/ast-parser";

async function testDependencyGraphEngine() {
  console.log("\n🕸️ =======================================================");
  console.log("🕸️ HARVESTER: DYNAMIC DEPENDENCY GRAPH TEST SUITE");
  console.log("🕸️ =======================================================\n");

  const graph = new DependencyGraph();

  // Register mock components with known dependency chains
  graph.addComponent({
    name: "button",
    title: "Button",
    category: "ui:primitive",
    description: "Button primitive",
    filePath: "src/primitives/button.tsx",
    exports: ["Button"],
    interfaces: ["ButtonProps"],
    imports: ["clsx", "tailwind-merge"],
    dependencies: ["clsx", "tailwind-merge"],
    devDependencies: [],
    registryDependencies: [],
    tags: ["primitive"],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    linesCount: 45,
    complexityScore: 10,
    complexity: "low",
  });

  graph.addComponent({
    name: "badge",
    title: "Badge",
    category: "ui:primitive",
    description: "Badge primitive",
    filePath: "src/primitives/badge.tsx",
    exports: ["Badge"],
    interfaces: ["BadgeProps"],
    imports: ["clsx"],
    dependencies: ["clsx"],
    devDependencies: [],
    registryDependencies: [],
    tags: ["primitive"],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    linesCount: 30,
    complexityScore: 5,
    complexity: "low",
  });

  graph.addComponent({
    name: "switch",
    title: "Switch",
    category: "ui:primitive",
    description: "Switch primitive",
    filePath: "src/primitives/switch.tsx",
    exports: ["Switch"],
    interfaces: ["SwitchProps"],
    imports: ["@radix-ui/react-switch", "clsx"],
    dependencies: ["@radix-ui/react-switch", "clsx"],
    devDependencies: [],
    registryDependencies: [],
    tags: ["primitive"],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    linesCount: 40,
    complexityScore: 8,
    complexity: "low",
  });

  graph.addComponent({
    name: "pricing-table",
    title: "Pricing Table",
    category: "ui:block",
    description: "Pricing table block depending on button, switch, badge",
    filePath: "src/blocks/pricing-table.tsx",
    exports: ["PricingTable"],
    interfaces: ["PricingTableProps"],
    imports: ["@/components/ui/button", "@/components/ui/switch", "@/components/ui/badge", "lucide-react"],
    dependencies: ["lucide-react"],
    devDependencies: [],
    registryDependencies: ["button", "switch", "badge"],
    tags: ["block", "pricing"],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: true,
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    linesCount: 150,
    complexityScore: 50,
    complexity: "medium",
  });

  // Test 1: Topological install order
  console.log("Test 1: Verifying topological installation ordering...");
  const closure = graph.getTransitiveClosure("pricing-table");
  console.log("   - Install Sequence:", closure.installSequence);
  console.log("   - Registry Dependencies:", closure.registryDependencies);
  console.log("   - NPM Dependencies:", closure.npmDependencies);

  if (
    !closure.installSequence.includes("button") ||
    !closure.installSequence.includes("switch") ||
    !closure.installSequence.includes("badge") ||
    closure.installSequence[closure.installSequence.length - 1] !== "pricing-table"
  ) {
    throw new Error("❌ Topological sort failed: pricing-table must be installed after its dependencies.");
  }
  console.log("✅ Test 1 Passed: Topological install order is correct.");

  // Test 2: Circular dependency detection
  console.log("\nTest 2: Verifying circular dependency detection...");
  const report1 = graph.generateReport();
  if (report1.hasCircularDependency) {
    throw new Error("❌ False positive in circular dependency check.");
  }
  console.log("   ✓ Clean DAG verified: 0 circular dependencies.");

  // Introduce intentional cycle to test detector
  const cyclicGraph = new DependencyGraph();
  cyclicGraph.addComponent({
    name: "node-a",
    title: "Node A",
    category: "ui:primitive",
    description: "A",
    filePath: "a.tsx",
    exports: [],
    interfaces: [],
    imports: [],
    dependencies: [],
    devDependencies: [],
    registryDependencies: ["node-b"],
    tags: [],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    linesCount: 10,
    complexityScore: 1,
    complexity: "low",
  });
  cyclicGraph.addComponent({
    name: "node-b",
    title: "Node B",
    category: "ui:primitive",
    description: "B",
    filePath: "b.tsx",
    exports: [],
    interfaces: [],
    imports: [],
    dependencies: [],
    devDependencies: [],
    registryDependencies: ["node-a"],
    tags: [],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    linesCount: 10,
    complexityScore: 1,
    complexity: "low",
  });

  const cyclicReport = cyclicGraph.generateReport();
  if (!cyclicReport.hasCircularDependency || cyclicReport.circularChains.length === 0) {
    throw new Error("❌ Cycle detection failed: intentional cycle was not detected.");
  }
  console.log("   ✓ Cycle detected successfully:", cyclicReport.circularChains[0].join(" -> "));
  console.log("✅ Test 2 Passed: Circular dependency detection verified.");

  // Test 3: Mermaid Export
  console.log("\nTest 3: Testing Mermaid topology export...");
  const mermaid = graph.exportMermaid();
  if (!mermaid.includes("graph TD") || !mermaid.includes("pricing-table -->|uses| button")) {
    throw new Error("❌ Mermaid export failed.");
  }
  console.log("   ✓ Mermaid export valid.");
  console.log("✅ Test 3 Passed: Mermaid topology generated.");

  console.log("\n🎉 ALL DEPENDENCY GRAPH TESTS PASSED (100% Maturity)!\n");
}

testDependencyGraphEngine().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
