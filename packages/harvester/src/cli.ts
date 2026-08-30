#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import {
  KNOWN_REPOSITORIES,
  harvestDirectory,
  harvestRepository,
  harvestFile,
  generateYamlFrontmatter,
  buildDependencyGraph,
} from "./index";

function printUsage() {
  console.log(`
🌾 Machine-First Design Agent Wiki: Ingestion Harvester CLI

Usage:
  pnpm harvest <command> [options]

Commands:
  repo <repo-name>      Clone and harvest a known repository (e.g. heroui, smoothui, aceternity, tailark)
  dir <directory-path>  Harvest all components in a local directory
  file <file-path>      Harvest, analyze, and review a single component file
  graph [dir-or-slug]   Generate dynamic DAG dependency graph and install ordering
  list                  List all configured upstream repositories

Options:
  --out <dir>           Output directory for harvested metadata (default: ./staging/harvested)
  --allow-slop          Do not block components flagged with slop violations

Examples:
  pnpm harvest repo heroui
  pnpm harvest dir ./packages/registry/src/primitives
  pnpm harvest file ./packages/registry/src/motion/floating-dock.tsx
  pnpm harvest graph ./packages/registry/src
`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(0);
  }

  const command = args[0];
  const target = args[1];

  if (command === "list") {
    console.log("\n📚 Configured Repositories for Harvesting:");
    for (const [id, repo] of Object.entries(KNOWN_REPOSITORIES)) {
      console.log(`  - [${id}] ${repo.name}`);
      console.log(`      Category: ${repo.defaultCategory} | Tags: ${repo.defaultTags.join(", ")}`);
      console.log(`      URL: ${repo.url}`);
    }
    process.exit(0);
  }

  if (command === "repo") {
    if (!target) {
      console.error("❌ Error: Missing repository identifier. Example: pnpm harvest repo smoothui");
      process.exit(1);
    }
    console.log(`\n🚀 Commencing Harvester Pipeline for Repository: ${target}`);
    const harvestResult = harvestRepository(target);

    console.log(`\n📊 Harvest Summary for [${harvestResult.config.name}]:`);
    console.log(`   - Staged Path:   ${harvestResult.stagedDir}`);
    console.log(`   - Total Scanned: ${harvestResult.results.length}`);
    console.log(`   - Passed Review: ${harvestResult.passedCount}`);
    console.log(`   - Slop Blocked:  ${harvestResult.blockedCount}`);

    const outDir = path.resolve(process.cwd(), "staging/harvested");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${harvestResult.config.id}-catalog.json`);
    fs.writeFileSync(outPath, JSON.stringify(harvestResult, null, 2));
    console.log(`📁 Ingestion catalog saved to: ${outPath}`);
    process.exit(0);
  }

  if (command === "ingest") {
    const repoKey = target || "kokonutui";
    console.log(`\n🌾 Running End-to-End Ingestion for ${repoKey}...`);
    try {
      const scriptPath = path.resolve(process.cwd(), "ast-parse-ingest.js");
      const rootScript = fs.existsSync(scriptPath) ? scriptPath : path.resolve(__dirname, "../../../ast-parse-ingest.js");
      execSync(`node "${rootScript}" ${repoKey}`, { stdio: "inherit" });
      process.exit(0);
    } catch (err: any) {
      console.error(`❌ Ingest failed:`, err.message);
      process.exit(1);
    }
  }

  if (command === "dir") {
    const baseDir = process.env.INIT_CWD || process.cwd();
    const scanDir = target
      ? path.isAbsolute(target)
        ? target
        : fs.existsSync(path.resolve(baseDir, target))
        ? path.resolve(baseDir, target)
        : path.resolve(process.cwd(), target)
      : process.cwd();
    console.log(`\n🔍 Scanning local directory: ${scanDir}`);
    const results = harvestDirectory(scanDir);

    console.log(`\n📊 Harvest Scan Complete:`);
    console.log(`   - Total Files Analyzed: ${results.length}`);
    const passed = results.filter((r) => !r.slopReport.blocked).length;
    const blocked = results.filter((r) => r.slopReport.blocked).length;
    console.log(`   - Passed Review:        ${passed}`);
    console.log(`   - Slop Blocked:         ${blocked}`);

    results.forEach((r) => {
      console.log(
        `  └─ [${r.category}] "${r.name}" -> Dials: Var ${r.dials.design_variance}, Mot ${r.dials.motion_intensity}, Den ${r.dials.visual_density} | Complexity: ${r.metadata.complexity} | Health: ${r.slopReport.healthScore}/100`
      );
    });
    process.exit(0);
  }

  if (command === "file") {
    if (!target) {
      console.error("❌ Error: Missing file path.");
      process.exit(1);
    }
    const baseDir = process.env.INIT_CWD || process.cwd();
    const filePath = path.isAbsolute(target)
      ? target
      : fs.existsSync(path.resolve(baseDir, target))
      ? path.resolve(baseDir, target)
      : path.resolve(process.cwd(), target);

    console.log(`\n🔬 Auditing single component file: ${filePath}`);
    const result = harvestFile(filePath);

    console.log(`\n📋 Analysis Result:`);
    console.log(`   - Component:    ${result.name}`);
    console.log(`   - Category:     ${result.category}`);
    console.log(`   - Complexity:   ${result.metadata.complexity.toUpperCase()} (Score: ${result.metadata.complexityScore})`);
    console.log(`   - Tags:         ${result.tags.join(", ")}`);
    console.log(`   - Dependencies: ${result.dependencies.join(", ") || "none"}`);
    console.log(`   - DevDeps:      ${result.devDependencies.join(", ") || "none"}`);
    console.log(`   - Dials:        Variance: ${result.dials.design_variance}, Motion: ${result.dials.motion_intensity}, Density: ${result.dials.visual_density}`);
    console.log(`   - Health Score: ${result.slopReport.healthScore}/100 (${result.slopReport.rating})`);
    console.log(`   - Slop Status:  ${result.slopReport.blocked ? "❌ BLOCKED" : "✅ PASSED"}`);
    if (result.slopReport.violations.length > 0) {
      console.log(`\n⚠️ Violations:`);
      result.slopReport.violations.forEach((v) => {
        console.log(`   - [Line ${v.lineNum}] [${v.severity}] ${v.name}: ${v.recommendation}`);
      });
    }
    console.log(`\n💡 LLM Craft Critique:\n   ${result.llmReview.critique}`);
    console.log(`\n📄 Generated YAML Frontmatter Contract:\n${generateYamlFrontmatter(result.metadata, result.dials)}`);
    process.exit(0);
  }

  if (command === "graph") {
    const baseDir = process.env.INIT_CWD || process.cwd();
    const scanDir = target
      ? path.isAbsolute(target)
        ? target
        : fs.existsSync(path.resolve(baseDir, target))
        ? path.resolve(baseDir, target)
        : path.resolve(process.cwd(), target)
      : path.resolve(process.cwd(), "packages/registry/src");

    console.log(`\n🕸️ Generating Dynamic DAG Dependency Graph from: ${scanDir}`);
    const graph = buildDependencyGraph(scanDir);
    const report = graph.generateReport();

    console.log(`\n📊 Dependency Graph Metrics:`);
    console.log(`   - Total Components:     ${report.totalComponents}`);
    console.log(`   - Total Dependencies:   ${report.totalNpmDependencies.length} (${report.totalNpmDependencies.join(", ")})`);
    console.log(`   - Circular Dependencies: ${report.hasCircularDependency ? "❌ FOUND" : "✅ NONE (Pure DAG)"}`);

    if (report.hasCircularDependency) {
      console.log(`   ⚠️ Circular Chains:`);
      report.circularChains.forEach((chain) => console.log(`      - ${chain.join(" -> ")}`));
    }

    console.log(`\n📥 Topological Install Sequence:`);
    report.topologicalInstallOrder.forEach((slug, idx) => {
      const node = report.nodes[slug];
      const depsStr = node?.registryDependencies.length > 0 ? ` (depends on: ${node.registryDependencies.join(", ")})` : "";
      console.log(`   ${idx + 1}. [${node?.category || "ui"}] ${slug}${depsStr}`);
    });

    console.log(`\n🎨 Mermaid Dependency Topology:\n`);
    console.log(graph.exportMermaid());
    process.exit(0);
  }

  printUsage();
}

main();
