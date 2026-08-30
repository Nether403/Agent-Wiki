import fs from "fs";
import path from "path";
import {
  parseComponentAST,
  cloneRepository,
  KNOWN_REPOSITORIES,
  RepositoryConfig,
  ComponentParsedMetadata,
  TaxonomyCategory,
} from "./ast-parser";
import {
  classifyComponentDials,
  reviewComponentSlop,
  evaluateLLMReview,
  DialScoreResult,
  SlopReviewReport,
  LLMReviewResult,
} from "./dial-classifier";
import { transformTailwindV4 } from "./codemods/tailwind-v4-transform";
import { transformMotionReact } from "./codemods/motion-react-transform";
import { injectAttributionHeader } from "./attribution";

export interface HarvesterResult {
  filePath: string;
  name: string;
  category: TaxonomyCategory;
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
  tags: string[];
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  transformedCode: string;
  slopReport: SlopReviewReport;
  llmReview: LLMReviewResult;
  metadata: ComponentParsedMetadata;
}

export function harvestFile(
  filePath: string,
  options: {
    origin?: string;
    author?: string;
    license?: string;
    repoConfig?: RepositoryConfig;
    blockSlop?: boolean;
  } = {}
): HarvesterResult {
  let content = fs.readFileSync(filePath, "utf-8");

  // 1. Apply automated codemods
  content = transformTailwindV4(content);
  content = transformMotionReact(content);

  // 2. Add attribution header if needed
  content = injectAttributionHeader(content, {
    license: options.license || options.repoConfig?.license || "MIT",
    origin: options.origin || options.repoConfig?.name || "Upstream Open-Source Registry",
    author: options.author || options.repoConfig?.author || "Community Contributor",
  });

  // 3. Parse AST using TypeScript Compiler API
  const astMeta = parseComponentAST(filePath, content, options.repoConfig);

  // 4. Classify dials & categories
  const dialResult = classifyComponentDials(astMeta, content);

  // 5. Automated anti-slop review
  const slopReport = reviewComponentSlop(content, astMeta);
  const llmReview = evaluateLLMReview(content, astMeta);

  if (options.blockSlop && slopReport.blocked) {
    console.warn(`⚠️ [SLOP BLOCKED] ${astMeta.name} blocked: ${slopReport.summary}`);
  }

  return {
    filePath,
    name: astMeta.name,
    category: dialResult.category,
    dials: dialResult.dials,
    tags: dialResult.tags,
    dependencies: astMeta.dependencies,
    devDependencies: astMeta.devDependencies,
    registryDependencies: astMeta.registryDependencies,
    transformedCode: content,
    slopReport,
    llmReview,
    metadata: astMeta,
  };
}

export function harvestDirectory(
  dirPath: string,
  options: {
    repoConfig?: RepositoryConfig;
    blockSlop?: boolean;
  } = {}
): HarvesterResult[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const results: HarvesterResult[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".git", "dist", ".next", "out", "build"].includes(entry.name)) {
        results.push(...harvestDirectory(fullPath, options));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
      results.push(harvestFile(fullPath, options));
    }
  }

  return results;
}

/**
 * High-level orchestration function to harvest a target repository
 */
export function harvestRepository(
  repoKeyOrConfig: string | RepositoryConfig,
  stagingBaseDir: string = path.resolve(process.cwd(), "staging/clones"),
  options: { blockSlop?: boolean } = { blockSlop: true }
): {
  config: RepositoryConfig;
  stagedDir: string;
  results: HarvesterResult[];
  passedCount: number;
  blockedCount: number;
} {
  const config =
    typeof repoKeyOrConfig === "string"
      ? KNOWN_REPOSITORIES[repoKeyOrConfig.toLowerCase()] || {
          id: repoKeyOrConfig.toLowerCase(),
          name: repoKeyOrConfig,
          url: repoKeyOrConfig,
          defaultCategory: "ui:primitive" as TaxonomyCategory,
          defaultTags: ["tailwind-v4"],
          license: "MIT",
          author: "Community Contributor",
          description: "Harvested component repository",
        }
      : repoKeyOrConfig;

  const stagedDir = cloneRepository(config, stagingBaseDir);
  const scanTarget = config.subpath ? path.join(stagedDir, config.subpath) : stagedDir;

  const scanDir = fs.existsSync(scanTarget) ? scanTarget : stagedDir;
  const results = harvestDirectory(scanDir, { repoConfig: config, blockSlop: options.blockSlop });

  const passed = results.filter((r) => !r.slopReport.blocked);
  const blocked = results.filter((r) => r.slopReport.blocked);

  return {
    config,
    stagedDir,
    results,
    passedCount: passed.length,
    blockedCount: blocked.length,
  };
}

export * from "./ast-parser";
export * from "./dial-classifier";
export * from "./attribution";
export * from "./llm-enricher";
export * from "./codemods/tailwind-v4-transform";
export * from "./codemods/motion-react-transform";

