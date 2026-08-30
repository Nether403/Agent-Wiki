import fs from "fs";
import path from "path";
import { parseComponentAST } from "./ast-parser";
import { classifyComponentDials } from "./dial-classifier";
import { transformTailwindV4 } from "./codemods/tailwind-v4-transform";
import { transformMotionReact } from "./codemods/motion-react-transform";
import { injectAttributionHeader } from "./attribution";

export interface HarvesterResult {
  filePath: string;
  name: string;
  category: string;
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  tags: string[];
  dependencies: string[];
  registryDependencies: string[];
  transformedCode: string;
}

export function harvestFile(
  filePath: string,
  options: {
    origin?: string;
    author?: string;
    license?: string;
  } = {}
): HarvesterResult {
  let content = fs.readFileSync(filePath, "utf-8");

  // 1. Apply codemods
  content = transformTailwindV4(content);
  content = transformMotionReact(content);

  // 2. Add attribution header if needed
  content = injectAttributionHeader(content, {
    license: options.license || "MIT",
    origin: options.origin || "Upstream Open-Source Registry",
    author: options.author || "Community Contributor",
  });

  // 3. Parse AST
  const astMeta = parseComponentAST(filePath, content);

  // 4. Classify dials & categories
  const dialResult = classifyComponentDials(astMeta, content);

  return {
    filePath,
    name: astMeta.name,
    category: dialResult.category,
    dials: dialResult.dials,
    tags: dialResult.tags,
    dependencies: astMeta.dependencies,
    registryDependencies: astMeta.registryDependencies,
    transformedCode: content,
  };
}

export function harvestDirectory(dirPath: string): HarvesterResult[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const results: HarvesterResult[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".git", "dist", ".next"].includes(entry.name)) {
        results.push(...harvestDirectory(fullPath));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      results.push(harvestFile(fullPath));
    }
  }

  return results;
}

export * from "./ast-parser";
export * from "./dial-classifier";
