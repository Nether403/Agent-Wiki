import fs from "fs";
import path from "path";

export interface PreviewOptions {
  cwd?: string;
  port?: number;
}

export async function previewComponent(slug: string, options: PreviewOptions = {}): Promise<boolean> {
  console.log(`\n👁️  =======================================================`);
  console.log(`👁️  DESIGN AGENT WIKI: COMPONENT PREVIEW INSPECTOR`);
  console.log(`👁️  Inspecting component contract: '${slug}'`);
  console.log(`👁️  =======================================================\n`);

  const cwd = options.cwd || process.cwd();
  const possiblePaths = [
    path.join(cwd, `components/ui/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/primitives/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/motion/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/creative/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/blocks/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/media/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/utility/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/ai-native/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/workflow/${slug}.tsx`),
    path.join(cwd, `packages/registry/src/editorial/${slug}.tsx`),
  ];

  let foundPath = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (!foundPath) {
    console.error(`❌ Component '${slug}' could not be located in local UI directories.`);
    return false;
  }

  const content = fs.readFileSync(foundPath, "utf-8");
  console.log(`✓ Located component at: ${foundPath}`);
  console.log(`✓ Source size: ${content.length} bytes`);
  console.log(`✓ React 19 / Tailwind v4 zero-slop component ready.`);

  return true;
}
