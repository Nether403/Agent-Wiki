import fs from "fs";
import path from "path";

export interface TestA11yOptions {
  cwd?: string;
  fix?: boolean;
}

/**
 * Source-level accessibility heuristics (not axe-core, not a rendered DOM).
 * Phase 4 will replace this with Playwright + axe when that suite exists.
 */
export async function testA11yCommand(
  targetDir: string = "packages/registry/src",
  options: TestA11yOptions = {}
): Promise<void> {
  const baseDir = path.resolve(options.cwd || process.cwd(), targetDir);
  console.log(`♿ Source a11y heuristics on ${baseDir}`);
  console.log(`   This is not axe-core and does not prove WCAG 2.1 AA.\n`);

  if (!fs.existsSync(baseDir)) {
    console.error(`Target directory not found: ${baseDir}`);
    return;
  }

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && !["node_modules", "dist"].includes(entry.name)) walk(full);
      else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(full);
    }
  };
  walk(baseDir);

  let warnings = 0;
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const issues: string[] = [];
    if (/<button\b/i.test(content) && !/aria-label|sr-only|focus-visible:/.test(content)) {
      issues.push("button without aria-label, sr-only text, or focus-visible ring");
    }
    if (/outline-none/.test(content) && !/focus-visible:/.test(content)) {
      issues.push("outline-none without focus-visible replacement");
    }
    if (issues.length > 0) {
      warnings += issues.length;
      console.warn(`⚠️ ${path.relative(process.cwd(), file)}`);
      issues.forEach((issue) => console.warn(`   - ${issue}`));
    }
  }

  console.log(`\nScanned ${files.length} files. Heuristic warnings: ${warnings}.`);
}
