import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { resolveProjectPathConfig } from "../utils/paths";
import { describeResolvedRegistry, fetchComponentItem, RegistryItem } from "../utils/registry";

export interface AddOptions {
  cwd?: string;
  path?: string;
  overwrite?: boolean;
  registry?: string;
  dryRun?: boolean;
  installDeps?: boolean;
}

const DEFAULT_UTILS_TS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

/**
 * Ensures lib/utils.ts exists for cn() helper
 */
function ensureUtilsHelper(libDir: string, dryRun: boolean = false): void {
  const utilsPath = path.join(libDir, "utils.ts");
  if (!fs.existsSync(utilsPath)) {
    console.log(`  ➕ Scaffolding utility helper: ${utilsPath}`);
    if (!dryRun) {
      fs.mkdirSync(libDir, { recursive: true });
      fs.writeFileSync(utilsPath, DEFAULT_UTILS_TS, "utf-8");
    }
  }
}

/**
 * Checks local package.json to identify missing npm dependencies
 */
function getMissingDependencies(cwd: string, requiredDeps: string[]): string[] {
  const packageJsonPath = path.join(cwd, "package.json");
  if (!fs.existsSync(packageJsonPath)) return requiredDeps;

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const installed = new Set([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ]);
    return requiredDeps.filter((d) => !installed.has(d));
  } catch {
    return requiredDeps;
  }
}

/**
 * Recursively downloads and installs a component and its registry dependencies
 */
export async function addComponent(
  slug: string,
  options: AddOptions = {},
  installedSlugs: Set<string> = new Set()
): Promise<boolean> {
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  const pathConfig = resolveProjectPathConfig(cwd);
  const targetDir = options.path ? path.resolve(cwd, options.path) : pathConfig.uiDir;
  const originLabel = describeResolvedRegistry(options.registry);

  if (installedSlugs.has(slug)) return true;
  installedSlugs.add(slug);

  console.log(`\n📦 Fetching component [${slug}] from registry (${originLabel})...`);
  const item: RegistryItem | null = await fetchComponentItem(slug, options.registry);

  if (!item) {
    console.error(`❌ Component "${slug}" not found in Design Agent Wiki registry.`);
    console.error(`   Run 'npx design-wiki list' to view available component slugs.`);
    return false;
  }

  console.log(`  ✓ Resolved: ${item.title} (${item.category})`);
  console.log(`  ✓ Taste Dials: Variance ${item.dials.design_variance}/10 · Motion ${item.dials.motion_intensity}/10 · Density ${item.dials.visual_density}/10`);

  // Ensure lib/utils.ts exists
  ensureUtilsHelper(pathConfig.libDir, options.dryRun);

  // 1. Write Component Source Files
  if (item.files && item.files.length > 0) {
    for (const file of item.files) {
      const fileName = path.basename(file.target || file.path);
      const destFilePath = path.join(targetDir, fileName);

      if (fs.existsSync(destFilePath) && !options.overwrite) {
        console.warn(`  ⚠️ File already exists at: ${destFilePath}`);
        console.warn(`     Use --overwrite to replace existing file.`);
        continue;
      }

      console.log(`  📁 Writing component: ${destFilePath}`);
      if (!options.dryRun) {
        fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
        // Normalize imports to project standard if needed
        let fileContent = file.content;
        // If imported as "../lib/utils", rewrite to "@/lib/utils"
        fileContent = fileContent.replace(/from\s+["']\.\.\/lib\/utils["']/g, 'from "@/lib/utils"');
        fs.writeFileSync(destFilePath, fileContent, "utf-8");
      }
    }
  }

  // 2. Handle registryDependencies recursively
  if (item.registryDependencies && item.registryDependencies.length > 0) {
    console.log(`  🔗 Resolving internal registry dependencies: ${item.registryDependencies.join(", ")}`);
    for (const regDep of item.registryDependencies) {
      await addComponent(regDep, options, installedSlugs);
    }
  }

  // 3. Handle Peer npm Dependencies
  const allDeps = [...(item.dependencies || [])];
  if (allDeps.length > 0) {
    const missing = getMissingDependencies(cwd, allDeps);
    if (missing.length > 0) {
      const pm = pathConfig.packageManager;
      const installCmd =
        pm === "npm"
          ? `npm install ${missing.join(" ")}`
          : pm === "bun"
          ? `bun add ${missing.join(" ")}`
          : pm === "yarn"
          ? `yarn add ${missing.join(" ")}`
          : `pnpm add ${missing.join(" ")}`;

      console.log(`\n⚙️ Required peer dependencies (${missing.length} missing): ${missing.join(", ")}`);
      console.log(`   Install command: ${installCmd}`);

      if (options.installDeps) {
        console.log(`   Executing: ${installCmd}...`);
        try {
          execSync(installCmd, { cwd, stdio: "inherit" });
          console.log(`  ✓ Dependencies installed successfully.`);
        } catch (err: any) {
          console.warn(`  ⚠️ Automated install encountered an issue. Please run '${installCmd}' manually.`);
        }
      }
    } else {
      console.log(`  ✓ All peer dependencies already satisfied.`);
    }
  }

  console.log(`\n✨ Successfully added [${item.name}] into ${targetDir}`);
  console.log(`   Import in your layout: import { ${item.title.replace(/\s+/g, "")} } from "@/components/ui/${item.name}";`);
  return true;
}
