#!/usr/bin/env node

import { addComponent } from "./commands/add";
import { listComponents } from "./commands/list";
import { auditLocalPath } from "./commands/audit";
import { unslopTarget } from "./commands/unslop";
import { composePage } from "./commands/compose";
import { previewComponent } from "./commands/preview";
import { runDoctor } from "./commands/doctor";
import { deconstructCommand } from "./commands/deconstruct";
import { tokensCommand } from "./commands/tokens";
import { evalCommand } from "./commands/eval";
import { testA11yCommand } from "./commands/test-a11y";
import { syncTokensCommand } from "./commands/sync-tokens";

function printHelp() {
  console.log(`
🛡️ Machine-First Design Agent Wiki CLI (design-wiki)

Usage:
  npx design-wiki <command> [arguments] [options]

Commands:
  add <slug>          Download and install a component into local UI directory
                      (e.g., npx design-wiki add canvas-fluid-wave)
  compose <template>  Synthesize an entire zero-slop layout page with all dependencies
                      (e.g., npx design-wiki compose ai-chat-workspace)
  deconstruct <input> Deconstruct an HTML/DOM reference or Figma tree into Agent Wiki components
                      (e.g., npx design-wiki deconstruct ./mockup.html --install)
  eval [path]         Run autonomous evaluation sandbox & Zero-Draft Fidelity benchmark
                      (e.g., npx design-wiki eval --suite benchmark)
  test-a11y [dir]     Source-level a11y heuristics (not axe-core; Phase 4 remaining)
  sync-tokens         Compile and export W3C DTCG design tokens to Tailwind v4 @theme
  tokens export       Export W3C DTCG tokens to Tailwind v4, CSS, Swift, Compose, or Figma
  preview <slug>      Inspect local component contract and verify zero-slop syntax
  doctor              Run full system diagnosis across Tailwind v4, React 19, and agent rules
  list                List trusted-core components (pass --all for the full inventory)
  search <query>      Search components by name, category, or tag (core first)
  audit [path]        Scan local files for AI slop anti-patterns (arbitrary tokens, etc.)
  unslop <path>       Auto-refactor messy AI code into zero-slop accessible TSX with theme tokens

Options:
  --theme <name>      Target theme for unslop (default: 'default', 'neo-tokyo', 'midnight', 'minimal')
  --path <dir>        Custom target directory (default: components/ui or src/components/ui)
  --overwrite         Overwrite existing component files without asking
  --install-deps      Automatically execute npm/pnpm/bun add for missing peer dependencies
  --registry <url>    Registry origin: https://..., file://..., or a directory with /r/*.json
                      Default: DESIGN_WIKI_REGISTRY_URL, else compiled local catalog,
                      else http://localhost:3000
  --dry-run           Simulate file operations and dependency resolution without writing
  --core              Restrict list/search to catalog-core.json slugs
  --all               List the full inventory (experimental included)
  -h, --help          Display this help message

Examples:
  npx design-wiki add floating-dock
  npx design-wiki add button --registry https://example.com
  npx design-wiki add canvas-fluid-wave --overwrite
  npx design-wiki list
  npx design-wiki list --all
  npx design-wiki search dialog
  npx design-wiki audit ./components
  npx design-wiki unslop ./components/ui/hero.tsx --theme neo-tokyo
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  // Parse common flags
  let pathOverride: string | undefined;
  let registryUrl: string | undefined;
  let cwdOverride: string | undefined;
  let themeOverride: string | undefined;
  let overwrite = false;
  let installDeps = false;
  let dryRun = false;
  let coreOnly = false;
  let listAll = false;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--path" && args[i + 1]) {
      pathOverride = args[++i];
    } else if (args[i] === "--cwd" && args[i + 1]) {
      cwdOverride = args[++i];
    } else if (args[i] === "--theme" && args[i + 1]) {
      themeOverride = args[++i];
    } else if (args[i] === "--registry" && args[i + 1]) {
      registryUrl = args[++i];
    } else if (args[i] === "--overwrite") {
      overwrite = true;
    } else if (args[i] === "--install-deps") {
      installDeps = true;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--core") {
      coreOnly = true;
    } else if (args[i] === "--all") {
      listAll = true;
    }
  }

  if (command === "add") {
    const slug = args[1];
    if (!slug || slug.startsWith("--")) {
      console.error("❌ Error: Missing component slug to add.");
      console.error("   Example: npx design-wiki add floating-dock");
      process.exit(1);
    }

    const success = await addComponent(slug, {
      cwd: cwdOverride,
      path: pathOverride,
      registry: registryUrl,
      overwrite,
      installDeps,
      dryRun,
    });

    process.exit(success ? 0 : 1);
  }

  if (command === "compose") {
    const archetype = args[1];
    if (!archetype || archetype.startsWith("--")) {
      console.error("❌ Error: Missing page archetype to compose.");
      console.error("   Example: npx design-wiki compose ai-chat-workspace");
      console.error("   Available: 'ai-chat-workspace', 'dashboard', 'saas-landing'");
      process.exit(1);
    }

    const success = await composePage(archetype, {
      cwd: cwdOverride,
      registry: registryUrl,
      overwrite,
    });

    process.exit(success ? 0 : 1);
  }

  if (command === "preview") {
    const slug = args[1];
    if (!slug) {
      console.error("❌ Error: Missing component slug for preview.");
      process.exit(1);
    }
    const success = await previewComponent(slug, { cwd: cwdOverride });
    process.exit(success ? 0 : 1);
  }

  if (command === "doctor") {
    const success = await runDoctor({ cwd: cwdOverride });
    process.exit(success ? 0 : 1);
  }

  if (command === "list") {
    await listComponents({
      registry: registryUrl,
      tier: coreOnly ? "core" : listAll ? "all" : "core",
    });
    process.exit(0);
  }

  if (command === "search") {
    const query = args[1] || "";
    await listComponents({
      query,
      registry: registryUrl,
      tier: coreOnly ? "core" : listAll ? "all" : undefined,
    });
    process.exit(0);
  }

  if (command === "audit") {
    const target = args[1] && !args[1].startsWith("--") ? args[1] : process.cwd();
    auditLocalPath(target);
    process.exit(0);
  }

  if (command === "skills") {
    const skillsList = [
      { name: "frontend-design", role: "Anthropic official frontend aesthetics & deliberate layout design" },
      { name: "ui-ux-pro-max", role: "Design intelligence, UI/UX audits, and screenshot review loops" },
      { name: "video-to-design", role: "Video interaction deconstruction & temporal frame reverse engineering" },
      { name: "nextjs-view-transitions", role: "Next.js 15 & React 19 View Transitions API architecture" },
      { name: "microcopy-ux-tone", role: "UX microcopy, contextual empty states & anti-cliché writing" },
      { name: "vercel-composition", role: "React composition patterns, view transitions, and clean performance" },
      { name: "visual-reference-deconstruction", role: "Reverse-engineer video mockups & frames into tokens" },
      { name: "interface-craft-micro-typography", role: "Optical kerning, tabular numerals & typographic contrast" },
      { name: "anti-slop-manifesto", role: "Universal 50-rule anti-slop specification & tripwire defense" },
      { name: "enterprise-design-systems", role: "High-density B2B resource lists, multi-pane grids & facet bars" },
      { name: "spatial-canvas-ui", role: "Infinite whiteboards, node graphs & WebGL viewports" },
      { name: "tokens-studio-dtcg", role: "W3C DTCG cross-platform design token architecture" },
      { name: "content-first-architecture", role: "Academic portfolios, research showcases & diagrammatic models" },
      { name: "storybook-workshop", role: "Component state testing & isolated visual review" },
    ];
    console.log("\n📦 Available Design Agent Wiki Skill Playbooks:\n");
    skillsList.forEach((s) => {
      console.log(`  • \x1b[36m${s.name}\x1b[0m: ${s.role}`);
    });
    console.log("\n  Installed locally in \x1b[33m/skills\x1b[0m and auto-synced across 11 agent targets.\n");
    process.exit(0);
  }

  if (command === "tokens") {
    let targetFormat = "tailwind-v4";
    let outputPath: string | undefined;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === "--format" && args[i + 1]) {
        targetFormat = args[++i];
      } else if (args[i] === "--output" && args[i + 1]) {
        outputPath = args[++i];
      }
    }
    await tokensCommand({ format: targetFormat, outputPath, cwd: cwdOverride });
    process.exit(0);
  }

  if (command === "deconstruct") {
    const input = args[1];
    if (!input || input.startsWith("--")) {
      console.error("❌ Error: Missing input file or HTML snippet to deconstruct.");
      console.error("   Example: npx design-wiki deconstruct ./landing-mockup.html --install");
      process.exit(1);
    }
    let outputPath: string | undefined;
    let install = false;
    for (let i = 2; i < args.length; i++) {
      if (args[i] === "--output" && args[i + 1]) {
        outputPath = args[++i];
      } else if (args[i] === "--install") {
        install = true;
      }
    }
    await deconstructCommand(input, { cwd: cwdOverride, install, outputPath, registry: registryUrl });
    process.exit(0);
  }

  if (command === "eval") {
    const target = args[1] && !args[1].startsWith("--") ? args[1] : undefined;
    let suite: "benchmark" | "workspace" | undefined;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === "--suite" && (args[i + 1] === "benchmark" || args[i + 1] === "workspace")) {
        suite = args[++i] as "benchmark" | "workspace";
      }
    }
    await evalCommand(target, { cwd: cwdOverride, suite });
    process.exit(0);
  }

  if (command === "test-a11y") {
    const target = args[1] && !args[1].startsWith("--") ? args[1] : "components/ui";
    await testA11yCommand(target, { cwd: cwdOverride });
    process.exit(0);
  }

  if (command === "sync-tokens") {
    let format: "dtcg" | "tailwind" | "css" | undefined;
    for (let i = 1; i < args.length; i++) {
      if (args[i] === "--format" && (args[i + 1] === "dtcg" || args[i + 1] === "tailwind" || args[i + 1] === "css")) {
        format = args[++i] as "dtcg" | "tailwind" | "css";
      }
    }
    await syncTokensCommand({ cwd: cwdOverride, format, theme: themeOverride });
    process.exit(0);
  }

  if (command === "unslop") {
    const target = args[1] && !args[1].startsWith("--") ? args[1] : "./components";
    const success = unslopTarget(target, {
      theme: themeOverride,
      dryRun,
      overwrite,
    });
    process.exit(success ? 0 : 1);
  }

  console.error(`❌ Unknown command: "${command}"`);
  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
