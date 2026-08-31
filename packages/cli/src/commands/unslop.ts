import fs from "fs";
import path from "path";
import { unslopCode as sharedUnslop } from "@design-wiki/audit-linter";

export interface UnslopCliOptions {
  theme?: string;
  dryRun?: boolean;
  overwrite?: boolean;
}

export function unslopTarget(targetPath: string, options: UnslopCliOptions = {}): boolean {
  const resolved = path.resolve(targetPath);
  const theme = options.theme || "default";

  console.log(`\n🧹 Unslop engine (@design-wiki/audit-linter)`);
  console.log(`   Target: ${resolved}`);
  console.log(`   Theme: ${theme}\n`);

  if (!fs.existsSync(resolved)) {
    console.error(`❌ Error: Target "${resolved}" does not exist.`);
    return false;
  }

  const stat = fs.statSync(resolved);
  const files: string[] = [];

  if (stat.isFile()) {
    files.push(resolved);
  } else {
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !["node_modules", ".next", "dist", ".git"].includes(e.name)) {
          walk(path.join(dir, e.name));
        } else if (e.isFile() && /\.(tsx|ts|jsx|js)$/.test(e.name)) {
          files.push(path.join(dir, e.name));
        }
      }
    };
    walk(resolved);
  }

  let totalChanges = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const compName = path.basename(file, path.extname(file));
    const result = sharedUnslop(content, {
      theme: theme as "default" | "neo-tokyo" | "midnight" | "minimal",
      componentName: compName,
    });

    if (result.changesApplied.length === 0) {
      console.log(`  ✓ [${path.relative(process.cwd(), file)}] No remaps (score ${result.scoreAfter}/100)`);
      continue;
    }

    console.log(`\n✨ Refactored: ${path.relative(process.cwd(), file)}`);
    console.log(`   Score: ${result.scoreBefore}/100 → ${result.scoreAfter}/100`);
    result.changesApplied.forEach((c) => console.log(`     - ${c}`));

    if (!options.dryRun) {
      fs.writeFileSync(file, result.code, "utf-8");
      console.log(`   Saved.`);
    } else {
      console.log(`   [Dry Run]: No files modified.`);
    }

    totalChanges += result.changesApplied.length;
  }

  console.log(`\nUnslop finished. ${totalChanges} remaps applied.\n`);
  return true;
}
