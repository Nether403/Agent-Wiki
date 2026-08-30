import ts from "typescript";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export type TaxonomyCategory =
  | "ui:primitive"
  | "ui:motion"
  | "ui:creative"
  | "ui:editorial"
  | "ui:block"
  | "ui:media"
  | "ui:utility";

export interface RepositoryConfig {
  id: string;
  name: string;
  url: string;
  branch?: string;
  subpath?: string;
  defaultCategory: TaxonomyCategory;
  defaultTags: string[];
  license: string;
  author: string;
  description: string;
}

/**
 * Standardized repository manifest for curated UI component libraries
 */
export const KNOWN_REPOSITORIES: Record<string, RepositoryConfig> = {
  heroui: {
    id: "heroui",
    name: "HeroUI (formerly NextUI)",
    url: "https://github.com/heroui-inc/heroui.git",
    subpath: "packages/components",
    defaultCategory: "ui:primitive",
    defaultTags: ["tailwind-v4", "accessible", "headless", "react"],
    license: "MIT",
    author: "HeroUI Team",
    description: "Accessible, robust UI primitives optimized for standard SaaS forms and navigation.",
  },
  smoothui: {
    id: "smoothui",
    name: "SmoothUI",
    url: "https://github.com/eduardconstantin/smoothui.git",
    subpath: "components/ui",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "spring-physics", "micro-interactions"],
    license: "MIT",
    author: "SmoothUI Team",
    description: "Spring physics micro-interactions and animated transitions with Framer Motion.",
  },
  aceternity: {
    id: "aceternity",
    name: "Aceternity UI",
    url: "https://github.com/aceternity/ui.git",
    subpath: "components/ui",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "framer-motion", "tailwind-v4", "landing-page"],
    license: "MIT",
    author: "Manu Arora & Community",
    description: "High-end landing page components built on Motion and Tailwind CSS.",
  },
  canvasui: {
    id: "canvasui",
    name: "Canvas UI",
    url: "https://github.com/canvas-ui/canvas-ui.git",
    subpath: "components/canvas",
    defaultCategory: "ui:creative",
    defaultTags: ["webgl", "canvas", "threejs", "shader-simulation"],
    license: "MIT",
    author: "Canvas UI Team",
    description: "GPU-driven HTML5 Canvas and WebGL interactive shaders with graceful fallbacks.",
  },
  "diagram-design": {
    id: "diagram-design",
    name: "diagram-design",
    url: "https://github.com/diagram-design/diagram.git",
    subpath: "components",
    defaultCategory: "ui:editorial",
    defaultTags: ["svg", "editorial", "analytical", "zero-dependency"],
    license: "MIT",
    author: "diagram-design Team",
    description: "Pure, static and analytical visual blocks free of generic decorative clutter.",
  },
  "evil-buttons": {
    id: "evil-buttons",
    name: "Evil-Buttons",
    url: "https://github.com/evil-buttons/evil-buttons.git",
    subpath: "components",
    defaultCategory: "ui:motion",
    defaultTags: ["playful", "framer-motion", "sound-physics", "interactive"],
    license: "MIT",
    author: "Evil-Buttons Team",
    description: "Playful, tactile physics-based button interactions.",
  },
  tailark: {
    id: "tailark",
    name: "Tailark",
    url: "https://github.com/tailark/tailark.git",
    subpath: "components/blocks",
    defaultCategory: "ui:block",
    defaultTags: ["bento-grid", "layout-block", "marketing", "tailwind-v4"],
    license: "MIT",
    author: "Tailark Team",
    description: "Multi-component bento grid layouts and SaaS marketing sections.",
  },
  kokonutui: {
    id: "kokonutui",
    name: "KokonutUI",
    url: "https://github.com/kokonut-dev/kokonutui.git",
    subpath: "components/ui",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "spring-physics", "dialog", "modal"],
    license: "MIT",
    author: "KokonutUI Team",
    description: "Modern animated dialogs, buttons, and layout transitions.",
  },
  "dot-matrix": {
    id: "dot-matrix",
    name: "Dot Matrix",
    url: "https://github.com/dotmatrix/loaders.git",
    subpath: "components/loaders",
    defaultCategory: "ui:utility",
    defaultTags: ["dot-matrix", "loader", "status", "utility"],
    license: "MIT",
    author: "Dot Matrix Team",
    description: "Specialized SVG and Canvas dot matrix loaders and animated matrices.",
  },
  reui: {
    id: "reui",
    name: "ReUI",
    url: "https://github.com/reui/reui.git",
    subpath: "components/ui",
    defaultCategory: "ui:primitive",
    defaultTags: ["radix-primitives", "headless", "animated-icons"],
    license: "MIT",
    author: "ReUI Team",
    description: "Large design-forward platform offering robust primitives and animated icons.",
  },
  beui: {
    id: "beui",
    name: "beUI",
    url: "https://github.com/beui/beui.git",
    subpath: "components/ui",
    defaultCategory: "ui:primitive",
    defaultTags: ["tailwind-v4", "view-transition", "react-19"],
    license: "MIT",
    author: "beUI Team",
    description: "React 19 and Tailwind 4 optimized primitives using View Transition API.",
  },
};

/**
 * Clones or updates a target repository into the local staging directory
 */
export function cloneRepository(
  repo: RepositoryConfig | string,
  stagingBaseDir: string = path.resolve(process.cwd(), "staging/clones")
): string {
  const config: RepositoryConfig =
    typeof repo === "string"
      ? KNOWN_REPOSITORIES[repo.toLowerCase()] || {
          id: repo.toLowerCase(),
          name: repo,
          url: repo.startsWith("http") ? repo : `https://github.com/${repo}.git`,
          defaultCategory: "ui:primitive",
          defaultTags: ["tailwind-v4"],
          license: "MIT",
          author: "Community Contributor",
          description: "Harvested component library repository.",
        }
      : repo;

  const targetDir = path.join(stagingBaseDir, config.id);

  if (fs.existsSync(targetDir)) {
    console.log(`📦 Staged repository already exists: ${targetDir}`);
    return targetDir;
  }

  fs.mkdirSync(stagingBaseDir, { recursive: true });

  console.log(`🌐 Cloning [${config.name}] from ${config.url}...`);
  try {
    const branchFlag = config.branch ? `--branch ${config.branch}` : "";
    execSync(`git clone --depth 1 ${branchFlag} "${config.url}" "${targetDir}"`, {
      stdio: "pipe",
      timeout: 30000,
    });
    console.log(`  ✓ Cloned successfully into ${targetDir}`);
  } catch (err: any) {
    console.warn(`  ⚠️ Git clone encountered an issue or timed out: ${err.message}`);
    // If clone fails (e.g. offline/mock environment), initialize local staging folder
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`  ℹ️ Initialized local sandbox staging folder at ${targetDir}`);
  }

  return targetDir;
}

export interface ComponentParsedMetadata {
  name: string;
  title: string;
  description: string;
  filePath: string;
  category: TaxonomyCategory;
  exports: string[];
  interfaces: string[];
  imports: string[];
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  tags: string[];
  hasCanvas: boolean;
  hasWebGL: boolean;
  hasMotion: boolean;
  a11y: {
    keyboard_navigable: boolean;
    wai_aria_compliant: boolean;
    wai_aria_role?: string;
    fallback_provided: boolean;
    reduced_motion_supported?: boolean;
  };
  linesCount: number;
  complexityScore: number;
  origin?: string;
  license?: string;
  author?: string;
}

/**
 * Full static code analysis using TypeScript Compiler API
 */
export function parseComponentAST(
  filePath: string,
  fileContent: string,
  originRepo?: string | RepositoryConfig
): ComponentParsedMetadata {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const rawSlug = path.basename(filePath, path.extname(filePath));
  const repoConfig =
    typeof originRepo === "string"
      ? KNOWN_REPOSITORIES[originRepo.toLowerCase()]
      : originRepo;

  const metadata: ComponentParsedMetadata = {
    name: rawSlug,
    title: rawSlug
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" "),
    description: repoConfig?.description || "Curated production-grade component.",
    filePath,
    category: repoConfig?.defaultCategory || "ui:primitive",
    exports: [],
    interfaces: [],
    imports: [],
    dependencies: [],
    devDependencies: [],
    registryDependencies: [],
    tags: repoConfig?.defaultTags ? [...repoConfig.defaultTags] : [],
    hasCanvas: false,
    hasWebGL: false,
    hasMotion: false,
    a11y: {
      keyboard_navigable: false,
      wai_aria_compliant: true,
      fallback_provided: true,
      reduced_motion_supported: false,
    },
    linesCount: fileContent.split("\n").length,
    complexityScore: 0,
    origin: repoConfig?.name || "Open-Source Registry",
    license: repoConfig?.license || "MIT",
    author: repoConfig?.author || "Community Contributor",
  };

  const depSet = new Set<string>();
  const devDepSet = new Set<string>();
  const regDepSet = new Set<string>();
  const tagSet = new Set<string>(metadata.tags);

  function visit(node: ts.Node) {
    metadata.complexityScore++;

    // 1. Imports and Dependencies
    if (ts.isImportDeclaration(node)) {
      const specifier = (node.moduleSpecifier as ts.StringLiteral).text;
      metadata.imports.push(specifier);

      if (
        specifier === "motion/react" ||
        specifier === "framer-motion" ||
        specifier === "motion"
      ) {
        metadata.hasMotion = true;
        tagSet.add("motion/react");
        depSet.add("motion");
      } else if (specifier === "three" || specifier.startsWith("three/")) {
        metadata.hasWebGL = true;
        tagSet.add("threejs");
        tagSet.add("webgl");
        depSet.add("three");
        devDepSet.add("@types/three");
      } else if (specifier.startsWith("@radix-ui/")) {
        tagSet.add("radix-primitives");
        tagSet.add("headless");
        depSet.add(specifier);
      } else if (specifier.startsWith("@ark-ui/")) {
        tagSet.add("ark-ui");
        tagSet.add("headless");
        depSet.add(specifier);
      } else if (specifier === "lucide-react") {
        tagSet.add("lucide-react");
        depSet.add("lucide-react");
      } else if (
        specifier === "clsx" ||
        specifier === "tailwind-merge" ||
        specifier === "class-variance-authority"
      ) {
        depSet.add(specifier);
      } else if (specifier.startsWith("@/components/ui/")) {
        const primitive = specifier.split("/").pop()!;
        regDepSet.add(primitive);
      }
    }

    // 2. Identify Exports and Interfaces
    if (ts.isFunctionDeclaration(node) && node.modifiers) {
      const isExported = node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported && node.name) {
        metadata.exports.push(node.name.text);
      }
    } else if (ts.isVariableStatement(node) && node.modifiers) {
      const isExported = node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported) {
        node.declarationList.declarations.forEach((decl) => {
          if (decl.name && ts.isIdentifier(decl.name)) {
            metadata.exports.push(decl.name.text);
          }
        });
      }
    } else if (ts.isInterfaceDeclaration(node)) {
      if (node.name) {
        metadata.interfaces.push(node.name.text);
      }
    } else if (ts.isTypeAliasDeclaration(node)) {
      if (node.name) {
        metadata.interfaces.push(node.name.text);
      }
    }

    // 3. WebGL and Canvas tells
    if (ts.isIdentifier(node)) {
      const text = node.text;
      if (/WebGL|Shader|PerspectiveCamera|Mesh|WebGLRenderer|ShaderMaterial/i.test(text)) {
        metadata.hasWebGL = true;
        tagSet.add("webgl");
      }
      if (/AnimatePresence|LayoutGroup|useSpring|useMotionValue|useScroll/i.test(text)) {
        metadata.hasMotion = true;
        metadata.a11y.reduced_motion_supported = true;
        tagSet.add("motion/react");
      }
    }

    // 4. JSX Elements and Accessibility markers
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tagName = node.tagName.getText(sourceFile);
      if (tagName === "canvas") {
        metadata.hasCanvas = true;
        tagSet.add("canvas");
      }

      // Trace interactive controls
      if (
        tagName === "button" ||
        tagName === "input" ||
        tagName === "a" ||
        tagName === "select" ||
        tagName.endsWith("Trigger") ||
        tagName.endsWith("Button")
      ) {
        metadata.a11y.keyboard_navigable = true;
      }

      // Check attributes for ARIA & roles
      node.attributes.properties.forEach((attr) => {
        if (ts.isJsxAttribute(attr) && attr.name) {
          const attrName = attr.name.getText(sourceFile);
          if (attrName === "role" && attr.initializer && ts.isStringLiteral(attr.initializer)) {
            metadata.a11y.wai_aria_role = attr.initializer.text;
          }
          if (attrName.startsWith("aria-")) {
            metadata.a11y.wai_aria_compliant = true;
          }
          if (attrName === "onKeyDown" || attrName === "onKeyUp") {
            metadata.a11y.keyboard_navigable = true;
          }
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Derive preferred name
  if (metadata.exports.length > 0) {
    const mainExport = metadata.exports[0];
    metadata.title = mainExport
      .replace(/([A-Z])/g, " $1")
      .trim();
  }

  // Derive tags from common classes and structures
  if (fileContent.includes("grid-cols") && (fileContent.includes("col-span") || fileContent.includes("gap-"))) {
    tagSet.add("bento-grid");
  }
  if (fileContent.includes("border-border") || fileContent.includes("bg-card")) {
    tagSet.add("tailwind-v4");
  }
  if (fileContent.includes("focus-visible:")) {
    tagSet.add("accessible");
    metadata.a11y.keyboard_navigable = true;
  }
  if (fileContent.includes("prefers-reduced-motion")) {
    metadata.a11y.reduced_motion_supported = true;
  }

  metadata.dependencies = Array.from(depSet);
  metadata.devDependencies = Array.from(devDepSet);
  metadata.registryDependencies = Array.from(regDepSet);
  metadata.tags = Array.from(tagSet);

  // Apply Taxonomy categorization
  applyTaxonomy(metadata, repoConfig);

  return metadata;
}

/**
 * Maps the component into the standardized taxonomy framework
 */
export function applyTaxonomy(
  metadata: ComponentParsedMetadata,
  repoConfig?: RepositoryConfig
): void {
  // If repository has an explicit category, respect it unless component structure overrides
  if (metadata.hasWebGL || metadata.hasCanvas) {
    metadata.category = "ui:creative";
    return;
  }

  if (repoConfig?.defaultCategory) {
    metadata.category = repoConfig.defaultCategory;
    return;
  }

  // Structural heuristics
  if (metadata.hasMotion) {
    metadata.category = "ui:motion";
  } else if (/Grid|Bento|Hero|Section|Pricing|Layout|Navbar|Sidebar/i.test(metadata.name) || metadata.linesCount > 160) {
    metadata.category = "ui:block";
  } else if (/Diagram|Metric|Stat|Table|Analytics|Chart/i.test(metadata.name)) {
    metadata.category = "ui:editorial";
  } else if (/Loader|Icon|Spinner|Pill|Matrix/i.test(metadata.name) || metadata.linesCount < 50) {
    metadata.category = "ui:utility";
  } else {
    metadata.category = "ui:primitive";
  }
}
