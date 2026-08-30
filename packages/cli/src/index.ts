#!/usr/bin/env node

import { addComponent } from "./commands/add";
import { listComponents } from "./commands/list";
import { auditLocalPath } from "./commands/audit";
import { unslopTarget } from "./commands/unslop";

function printHelp() {
  console.log(`
🛡️ Machine-First Design Agent Wiki CLI (design-wiki)

Usage:
  npx design-wiki <command> [arguments] [options]

Commands:
  add <slug>          Download and install a component into local UI directory
                      (e.g., npx design-wiki add canvas-fluid-wave)
  list                List all curated zero-slop components and taste dials
  search <query>      Search components by name, category, or tag
  audit [path]        Scan local files for AI slop anti-patterns (arbitrary tokens, etc.)
  unslop <path>       Auto-refactor messy AI code into zero-slop accessible TSX with theme tokens

Options:
  --theme <name>      Target theme for unslop (default: 'default', 'neo-tokyo', 'midnight', 'minimal')
  --path <dir>        Custom target directory (default: components/ui or src/components/ui)
  --overwrite         Overwrite existing component files without asking
  --install-deps      Automatically execute npm/pnpm/bun add for missing peer dependencies
  --registry <url>    Base URL of registry endpoints (default: http://localhost:3000)
  --dry-run           Simulate file operations and dependency resolution without writing
  -h, --help          Display this help message

Examples:
  npx design-wiki add floating-dock
  npx design-wiki add canvas-fluid-wave --overwrite
  npx design-wiki list
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

  if (command === "list") {
    await listComponents({ registry: registryUrl });
    process.exit(0);
  }

  if (command === "search") {
    const query = args[1] || "";
    await listComponents({ query, registry: registryUrl });
    process.exit(0);
  }

  if (command === "audit") {
    const target = args[1] && !args[1].startsWith("--") ? args[1] : process.cwd();
    auditLocalPath(target);
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
