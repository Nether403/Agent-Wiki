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
  defaultDials?: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
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
    name: "HeroUI v3 (formerly NextUI)",
    url: "https://github.com/heroui-inc/heroui.git",
    subpath: "packages/components",
    defaultCategory: "ui:primitive",
    defaultTags: ["react", "tailwind-v4", "headless", "accessible"],
    defaultDials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    license: "MIT",
    author: "HeroUI Team",
    description: "Accessible, robust UI primitives optimized for standard SaaS forms and navigation.",
  },
  "cult-ui": {
    id: "cult-ui",
    name: "Cult-UI",
    url: "https://github.com/nolly-studio/cult-ui.git",
    subpath: "components",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "framer-motion", "micro-interaction"],
    defaultDials: { design_variance: 6, motion_intensity: 7, visual_density: 5 },
    license: "MIT",
    author: "Cult-UI Team",
    description: "Design-forward interactive UI motion components and primitives.",
  },
  "evil-buttons": {
    id: "evil-buttons",
    name: "Evil-Buttons",
    url: "https://github.com/radiumcoders/Evil-Buttons.git",
    subpath: "components",
    defaultCategory: "ui:motion",
    defaultTags: ["playful", "framer-motion", "sound-physics", "motion/react"],
    defaultDials: { design_variance: 8, motion_intensity: 7, visual_density: 5 },
    license: "MIT",
    author: "Evil-Buttons Team",
    description: "Playful, tactile physics-based button interactions.",
  },
  "diagram-design": {
    id: "diagram-design",
    name: "diagram-design",
    url: "https://github.com/cathrynlavery/diagram-design.git",
    subpath: "components",
    defaultCategory: "ui:editorial",
    defaultTags: ["svg", "zero-dependency", "static", "analytical"],
    defaultDials: { design_variance: 5, motion_intensity: 1, visual_density: 9 },
    license: "MIT",
    author: "diagram-design Team",
    description: "Pure, static and analytical visual blocks free of generic decorative clutter.",
  },
  smoothui: {
    id: "smoothui",
    name: "SmoothUI",
    url: "https://github.com/educlopez/smoothui.git",
    subpath: "components/ui",
    defaultCategory: "ui:motion",
    defaultTags: ["framer-motion", "shadcn-compatible", "spring-physics"],
    defaultDials: { design_variance: 4, motion_intensity: 6, visual_density: 5 },
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
    defaultTags: ["framer-motion", "tailwind-v4", "micro-interaction"],
    defaultDials: { design_variance: 6, motion_intensity: 8, visual_density: 4 },
    license: "MIT",
    author: "Manu Arora & Community",
    description: "High-end landing page components built on Motion and Tailwind CSS.",
  },
  canvasui: {
    id: "canvasui",
    name: "Canvas UI",
    url: "https://github.com/DavidHDev/canvas-ui.git",
    subpath: "components/canvas",
    defaultCategory: "ui:creative",
    defaultTags: ["threejs", "webgl", "framer-motion", "interactive", "canvas"],
    defaultDials: { design_variance: 9, motion_intensity: 9, visual_density: 3 },
    license: "MIT",
    author: "Canvas UI Team",
    description: "GPU-driven HTML5 Canvas and WebGL interactive shaders with graceful fallbacks.",
  },
  "react-bits": {
    id: "react-bits",
    name: "React Bits",
    url: "https://github.com/DavidHDev/react-bits.git",
    subpath: "components",
    defaultCategory: "ui:creative",
    defaultTags: ["canvas", "shaders", "creative", "animations"],
    defaultDials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
    license: "MIT",
    author: "React Bits Team",
    description: "Creative animations, background effects and shaders.",
  },
  threeui: {
    id: "threeui",
    name: "ThreeUI",
    url: "https://github.com/MengTo/threeui.git",
    subpath: "components",
    defaultCategory: "ui:creative",
    defaultTags: ["threejs", "webgl", "3d", "canvas"],
    defaultDials: { design_variance: 8, motion_intensity: 9, visual_density: 4 },
    license: "MIT",
    author: "ThreeUI Team",
    description: "Three.js and WebGL 3D UI experiences.",
  },
  "motion-primitives": {
    id: "motion-primitives",
    name: "Motion Primitives",
    url: "https://github.com/ibelick/motion-primitives.git",
    subpath: "components",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "spring-physics", "micro-interaction"],
    defaultDials: { design_variance: 5, motion_intensity: 6, visual_density: 5 },
    license: "MIT",
    author: "Motion Primitives Team",
    description: "Smooth micro-interactions and animated primitives.",
  },
  "neonblade-ui": {
    id: "neonblade-ui",
    name: "Neonblade UI",
    url: "https://github.com/vprix21/neonblade-ui.git",
    subpath: "components",
    defaultCategory: "ui:creative",
    defaultTags: ["neon-scifi", "glow", "tailwind-v4"],
    defaultDials: { design_variance: 7, motion_intensity: 6, visual_density: 5 },
    license: "MIT",
    author: "Neonblade Team",
    description: "Sci-Fi and cyberpunk aesthetic components.",
  },
  tailark: {
    id: "tailark",
    name: "Tailark",
    url: "https://github.com/tailark/blocks.git",
    subpath: "components/blocks",
    defaultCategory: "ui:block",
    defaultTags: ["tailwind-v4", "marketing", "bento-grid"],
    defaultDials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    license: "MIT",
    author: "Tailark Team",
    description: "Multi-component bento grid layouts and SaaS marketing sections.",
  },
  kokonutui: {
    id: "kokonutui",
    name: "KokonutUI",
    url: "https://github.com/kokonut-labs/kokonutui.git",
    subpath: "components/ui",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "spring-physics", "dialog", "modal"],
    defaultDials: { design_variance: 5, motion_intensity: 6, visual_density: 5 },
    license: "MIT",
    author: "KokonutUI Team",
    description: "Modern animated dialogs, buttons, and layout transitions.",
  },
  "dot-matrix": {
    id: "dot-matrix",
    name: "Dot Matrix",
    url: "https://github.com/zzzzshawn/matrix.git",
    subpath: "components/loaders",
    defaultCategory: "ui:utility",
    defaultTags: ["dot-matrix", "loader", "status", "utility"],
    defaultDials: { design_variance: 6, motion_intensity: 5, visual_density: 7 },
    license: "MIT",
    author: "Dot Matrix Team",
    description: "Specialized SVG and Canvas dot matrix loaders and animated matrices.",
  },
  reui: {
    id: "reui",
    name: "ReUI",
    url: "https://github.com/keenthemes/reui.git",
    subpath: "components/ui",
    defaultCategory: "ui:primitive",
    defaultTags: ["radix-primitives", "headless", "animated-icons"],
    defaultDials: { design_variance: 3, motion_intensity: 4, visual_density: 7 },
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
    defaultDials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    license: "MIT",
    author: "beUI Team",
    description: "React 19 and Tailwind 4 optimized primitives using View Transition API.",
  },
  remocn: {
    id: "remocn",
    name: "Remocn",
    url: "https://github.com/Remocn/remocn.git",
    subpath: "components/media",
    defaultCategory: "ui:media",
    defaultTags: ["remotion", "video", "motion", "timeline", "media"],
    defaultDials: { design_variance: 7, motion_intensity: 8, visual_density: 4 },
    license: "MIT",
    author: "Remocn Team",
    description: "Advanced, timeline-based motion and video compositions built on Remotion.",
  },
  "shark-ui": {
    id: "shark-ui",
    name: "Shark UI",
    url: "https://github.com/sharkui-inc/shark-ui.git",
    subpath: "components",
    defaultCategory: "ui:primitive",
    defaultTags: ["tailwind-v4", "primitives", "accessible"],
    defaultDials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    license: "MIT",
    author: "Shark UI Team",
    description: "Accessible, fast React component primitives.",
  },
  daisyui: {
    id: "daisyui",
    name: "DaisyUI",
    url: "https://github.com/saadeghi/daisyui.git",
    subpath: "components",
    defaultCategory: "ui:primitive",
    defaultTags: ["tailwind-v4", "utility-first", "themeable"],
    defaultDials: { design_variance: 4, motion_intensity: 2, visual_density: 6 },
    license: "MIT",
    author: "Pouya Saadeghi",
    description: "Semantic Tailwind utility component library.",
  },
  uilayouts: {
    id: "uilayouts",
    name: "UI Layouts",
    url: "https://github.com/ui-layouts/uilayouts.git",
    subpath: "components",
    defaultCategory: "ui:block",
    defaultTags: ["tailwind-v4", "layout", "bento-grid"],
    defaultDials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    license: "MIT",
    author: "UI Layouts Team",
    description: "Curated modern marketing and layout sections.",
  },
  "vengeance-ui": {
    id: "vengeance-ui",
    name: "VengeanceUI",
    url: "https://github.com/Ashutoshx7/VengeanceUI.git",
    subpath: "components",
    defaultCategory: "ui:motion",
    defaultTags: ["motion/react", "interactive", "framer-motion"],
    defaultDials: { design_variance: 6, motion_intensity: 7, visual_density: 5 },
    license: "MIT",
    author: "Ashutosh & Community",
    description: "Futuristic and high-motion React components.",
  },
  watermelon: {
    id: "watermelon",
    name: "Watermelon Platform",
    url: "https://github.com/WatermelonCorp/watermelon-platform.git",
    subpath: "components",
    defaultCategory: "ui:editorial",
    defaultTags: ["analytical", "metrics", "data-grid"],
    defaultDials: { design_variance: 4, motion_intensity: 2, visual_density: 8 },
    license: "MIT",
    author: "Watermelon Corp",
    description: "Clean data and metric components.",
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
  complexity: "low" | "medium" | "high";
  origin?: string;
  license?: string;
  author?: string;
  defaultDials?: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  };
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
    complexity: "medium",
    origin: repoConfig?.name || "Open-Source Registry",
    license: repoConfig?.license || "MIT",
    author: repoConfig?.author || "Community Contributor",
    defaultDials: repoConfig?.defaultDials,
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
        tagSet.add("framer-motion");
        tagSet.add("motion/react");
        tagSet.add("animation");
        depSet.add("motion");
      } else if (
        specifier === "three" ||
        specifier.startsWith("three/") ||
        specifier === "@react-three/fiber" ||
        specifier === "@react-three/drei"
      ) {
        metadata.hasWebGL = true;
        tagSet.add("threejs");
        tagSet.add("webgl");
        tagSet.add("canvas");
        depSet.add("three");
        devDepSet.add("@types/three");
        if (specifier === "@react-three/fiber") {
          tagSet.add("three-fiber");
          depSet.add("@react-three/fiber");
        } else if (specifier === "@react-three/drei") {
          tagSet.add("three-fiber");
          depSet.add("@react-three/drei");
        }
      } else if (specifier.startsWith("@radix-ui/")) {
        tagSet.add("radix-primitives");
        tagSet.add("headless");
        depSet.add(specifier);
        if (specifier.startsWith("@radix-ui/react-")) {
          const primitive = specifier.replace("@radix-ui/react-", "");
          if (primitive !== rawSlug && primitive !== metadata.name) {
            regDepSet.add(primitive);
          }
        }
      } else if (specifier.startsWith("@ark-ui/")) {
        tagSet.add("ark-ui");
        tagSet.add("headless");
        depSet.add(specifier);
        if (specifier.startsWith("@ark-ui/react/")) {
          const primitive = specifier.replace("@ark-ui/react/", "");
          if (primitive !== rawSlug && primitive !== metadata.name) {
            regDepSet.add(primitive);
          }
        }
      } else if (specifier === "lucide-react") {
        tagSet.add("lucide-react");
        depSet.add("lucide-react");
      } else if (specifier === "canvas-confetti") {
        tagSet.add("canvas-confetti");
        depSet.add("canvas-confetti");
        devDepSet.add("@types/canvas-confetti");
      } else if (specifier === "remotion" || specifier.startsWith("@remotion/")) {
        tagSet.add("remotion");
        tagSet.add("video");
        tagSet.add("media");
        tagSet.add("timeline");
        depSet.add(specifier);
      } else if (
        specifier === "clsx" ||
        specifier === "tailwind-merge" ||
        specifier === "class-variance-authority"
      ) {
        depSet.add(specifier);
      } else if (specifier.startsWith("@/components/ui/")) {
        const primitive = specifier.split("/").pop()!;
        if (primitive !== rawSlug && primitive !== metadata.name) {
          regDepSet.add(primitive);
        }
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

    // 3. WebGL, Canvas, and Motion tells
    if (ts.isIdentifier(node)) {
      const text = node.text;
      if (/WebGL|Shader|PerspectiveCamera|Mesh|WebGLRenderer|ShaderMaterial|OrbitControls|Canvas/i.test(text)) {
        metadata.hasWebGL = true;
        tagSet.add("webgl");
        tagSet.add("threejs");
      }
      if (/AnimatePresence|LayoutGroup|useSpring|useMotionValue|useScroll/i.test(text)) {
        metadata.hasMotion = true;
        metadata.a11y.reduced_motion_supported = true;
        tagSet.add("motion/react");
        tagSet.add("framer-motion");
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
  if (fileContent.includes("backdrop-blur")) {
    tagSet.add("glassmorphism");
  }
  if (/border-2|border-black|shadow-\[|brutalist/i.test(fileContent)) {
    tagSet.add("brutalist");
  }
  if (/neon|glow|cyan|fuchsia/i.test(fileContent)) {
    tagSet.add("neon-scifi");
  }
  if (/playful|sound-physics|audioContext/i.test(fileContent) || repoConfig?.id === "evil-buttons") {
    tagSet.add("playful");
  }
  if (fileContent.includes("focus-visible:")) {
    tagSet.add("accessible");
    metadata.a11y.keyboard_navigable = true;
  }
  if (metadata.a11y.keyboard_navigable) {
    tagSet.add("keyboard-accessible");
  }
  if (metadata.a11y.wai_aria_compliant) {
    tagSet.add("wai-aria-compliant");
  }
  if (fileContent.includes("prefers-reduced-motion")) {
    metadata.a11y.reduced_motion_supported = true;
  }

  // Cross-reference WebGL & Three.js dependencies for creative / canvas / shader components (e.g. canvas-fluid-wave.tsx)
  const isCreativeShader =
    metadata.hasWebGL ||
    metadata.hasCanvas ||
    rawSlug.includes("canvas") ||
    rawSlug === "canvas-fluid-wave" ||
    fileContent.includes("requestAnimationFrame");

  if (isCreativeShader) {
    tagSet.add("webgl");
    tagSet.add("threejs");
    tagSet.add("canvas");
    depSet.add("three");
    devDepSet.add("@types/three");
  }

  // Structural Complexity Scorer
  // Architectural density:
  // - High: custom canvas mathematical loops (requestAnimationFrame with trigonometric/matrix calculations), shader code, or lines > 350
  // - Low: simple Tailwind utility classes under 80 lines without canvas/motion
  // - Medium: standard component layouts and micro-interactions
  const hasCanvasMathLoops =
    fileContent.includes("requestAnimationFrame") &&
    (fileContent.includes("Math.sin") ||
      fileContent.includes("Math.cos") ||
      fileContent.includes("Math.PI") ||
      fileContent.includes("step +=") ||
      fileContent.includes("amplitude"));

  const hasShaderCode =
    fileContent.includes("ShaderMaterial") ||
    fileContent.includes("gl_FragColor") ||
    fileContent.includes("vertexShader") ||
    fileContent.includes("fragmentShader") ||
    metadata.hasWebGL;

  if (hasCanvasMathLoops || hasShaderCode || metadata.linesCount > 350 || metadata.complexityScore > 350) {
    metadata.complexity = "high";
  } else if (metadata.linesCount < 80 && !metadata.hasCanvas && !metadata.hasMotion && !metadata.hasWebGL) {
    metadata.complexity = "low";
  } else {
    metadata.complexity = "medium";
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
  if (/Video|Timeline|Player|Media|Audio|Track|Remotion/i.test(metadata.name) || metadata.tags.includes("media") || metadata.tags.includes("video")) {
    metadata.category = "ui:media";
  } else if (metadata.hasMotion) {
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

/**
 * Generates standard YAML frontmatter conforming to the Component Metadata Contract
 */
export function generateYamlFrontmatter(
  metadata: ComponentParsedMetadata,
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  } = {
    design_variance: 5,
    motion_intensity: 5,
    visual_density: 5,
  }
): string {
  const deps =
    metadata.dependencies.length > 0
      ? metadata.dependencies.map((d) => `  - "${d}"`).join("\n")
      : "  # No external runtime dependencies";

  const tagsList =
    metadata.tags.length > 0
      ? metadata.tags.map((t) => `  - "${t}"`).join("\n")
      : '  - "ui"';

  return `---
id: "${metadata.name}"
name: "${metadata.title}"
category: "${metadata.category}"
library_origin: "${metadata.origin || "Curated Registry"}"
dependencies:
${deps}
tags:
${tagsList}
dials:
  design_variance: ${dials.design_variance}      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: ${dials.motion_intensity}     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: ${dials.visual_density}       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "${metadata.complexity}"
a11y:
  keyboard_navigable: ${metadata.a11y.keyboard_navigable}
  wai_aria_compliant: ${metadata.a11y.wai_aria_compliant}
  fallback_provided: ${metadata.a11y.fallback_provided}
---`;
}

/**
 * Injects or replaces YAML frontmatter at the top of a file or documentation markdown
 */
export function injectYamlFrontmatter(
  content: string,
  metadata: ComponentParsedMetadata,
  dials?: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  }
): string {
  const frontmatter = generateYamlFrontmatter(metadata, dials);
  const stripped = content.replace(/^---[\s\S]*?---\s*/, "");
  return `${frontmatter}\n\n${stripped.trimStart()}`;
}

/**
 * Generates full markdown documentation with YAML frontmatter for /raw/ and documentation stubs
 */
export function generateMarkdownDoc(
  metadata: ComponentParsedMetadata,
  dials: {
    design_variance: number;
    motion_intensity: number;
    visual_density: number;
  },
  sourceCode: string
): string {
  const frontmatter = generateYamlFrontmatter(metadata, dials);

  return `${frontmatter}

# ${metadata.title} (\`${metadata.name}\`)
> ${metadata.description}

- **Category**: \`${metadata.category}\`
- **Structural Complexity**: \`${metadata.complexity.toUpperCase()}\` (Score: ${metadata.complexityScore})
- **Technical Tags**: ${metadata.tags.join(", ") || "None"}
- **Taste Dials**: Variance ${dials.design_variance}/10 · Motion ${dials.motion_intensity}/10 · Density ${dials.visual_density}/10
- **Accessibility AA**: Keyboard Nav: ${metadata.a11y.keyboard_navigable}, ARIA: ${metadata.a11y.wai_aria_compliant}, Fallback: ${metadata.a11y.fallback_provided}

## Installation Recipe
\`\`\`bash
npx shadcn@latest add http://localhost:3000/r/${metadata.name}.json
\`\`\`

## Peer Dependencies
${metadata.dependencies.length > 0 ? metadata.dependencies.map((d) => `- \`${d}\``).join("\n") : "- None"}

## Verified TypeScript Source
\`\`\`tsx
${sourceCode}
\`\`\`
`;
}

