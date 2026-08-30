import fs from "fs";
import path from "path";
import {
  parseComponentAST,
  classifyComponentDials,
  TaxonomyCategory,
} from "@design-wiki/harvester";

interface RegistryDial {
  design_variance: number;
  motion_intensity: number;
  visual_density: number;
}

interface RegistryA11y {
  keyboard_navigable: boolean;
  wai_aria_compliant: boolean;
  wai_aria_role?: string;
  screen_reader_ready?: boolean;
  fallback_provided: boolean;
  reduced_motion_supported?: boolean;
}

interface RegistryLicenseOrigin {
  source_repository: string;
  license_type: string;
  author: string;
  attribution_required: boolean;
  redistribution_mode: "full_source" | "proxy_recipe" | "submodule";
}

interface RegistryItem {
  $schema?: string;
  name: string;
  type: "registry:ui" | "registry:component" | "registry:block";
  title: string;
  description: string;
  category: TaxonomyCategory;
  tags: string[];
  dials: RegistryDial;
  complexity?: "low" | "medium" | "high";
  a11y: RegistryA11y;
  license_origin: RegistryLicenseOrigin;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
    target?: string;
  }>;
}

// Hand-tuned metadata overrides for seed catalog items
const COMPONENT_METADATA_OVERRIDES: Record<
  string,
  {
    title?: string;
    description?: string;
    category?: TaxonomyCategory;
    tags?: string[];
    dials?: Partial<RegistryDial>;
    a11y?: Partial<RegistryA11y>;
    license?: Partial<RegistryLicenseOrigin>;
    dependencies?: string[];
    registryDependencies?: string[];
  }
> = {
  button: {
    title: "Button",
    description: "Polymorphic button with accessible variants, focus rings, and zero arbitrary spacing.",
    category: "ui:primitive",
    tags: ["react", "tailwind-v4", "headless", "accessible", "radix-primitive", "button"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true },
    license: { source_repository: "https://github.com/heroui-inc/heroui", license_type: "MIT", author: "HeroUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  input: {
    title: "Input",
    description: "Accessible text input with floating state, error boundaries, and focus-visible ring.",
    category: "ui:primitive",
    tags: ["react", "tailwind-v4", "headless", "accessible", "form", "input"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "textbox", fallback_provided: true },
    license: { source_repository: "https://github.com/heroui-inc/heroui", license_type: "MIT", author: "HeroUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  dialog: {
    title: "Dialog",
    description: "Headless accessible modal dialog with focus trap, backdrop escape, and screen-reader roles.",
    category: "ui:primitive",
    tags: ["radix-primitives", "headless", "modal", "dialog", "a11y"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "dialog", fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["@radix-ui/react-dialog", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "dropdown-menu": {
    title: "Dropdown Menu",
    description: "Keyboard-navigable dropdown with arrow key navigation, sub-menus, and ARIA menu attributes.",
    category: "ui:primitive",
    tags: ["radix-primitives", "menu", "navigation", "headless"],
    dials: { design_variance: 3, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "menu", fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["@radix-ui/react-dropdown-menu", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  tabs: {
    title: "Tabs",
    description: "Accessible tabbed interface with keyboard arrow navigation and active state styling.",
    category: "ui:primitive",
    tags: ["radix-primitives", "tabs", "navigation", "headless"],
    dials: { design_variance: 3, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "tablist", fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["@radix-ui/react-tabs", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  tooltip: {
    title: "Tooltip",
    description: "Micro-tooltip with delay timers and instant focus visibility for assistive tech.",
    category: "ui:primitive",
    tags: ["radix-primitives", "tooltip", "micro-interaction", "a11y"],
    dials: { design_variance: 2, motion_intensity: 2, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "tooltip", fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["@radix-ui/react-tooltip", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  badge: {
    title: "Badge",
    description: "Contrast-checked status indicator using semantic design tokens.",
    category: "ui:primitive",
    tags: ["tailwind-v4", "status", "indicator", "badge"],
    dials: { design_variance: 2, motion_intensity: 1, visual_density: 8 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://ui.shadcn.com", license_type: "MIT", author: "Shadcn & Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  card: {
    title: "Card",
    description: "Structural surface card with crisp border-border and no glassmorphism slop.",
    category: "ui:primitive",
    tags: ["tailwind-v4", "layout", "surface", "card"],
    dials: { design_variance: 3, motion_intensity: 1, visual_density: 6 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://ui.shadcn.com", license_type: "MIT", author: "Shadcn & Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  switch: {
    title: "Switch",
    description: "Accessible toggle switch with smooth spring thumb and keyboard space/enter toggling.",
    category: "ui:primitive",
    tags: ["radix-primitives", "toggle", "form", "headless"],
    dials: { design_variance: 2, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "switch", fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["@radix-ui/react-switch", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  avatar: {
    title: "Avatar",
    description: "Fallback-aware image avatar with initials display and smooth loading states.",
    category: "ui:primitive",
    tags: ["radix-primitives", "avatar", "image", "headless"],
    dials: { design_variance: 2, motion_intensity: 1, visual_density: 6 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["@radix-ui/react-avatar", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "floating-dock": {
    title: "Floating Dock",
    description: "macOS-style interactive dock with mouse proximity magnification and spring physics.",
    category: "ui:motion",
    tags: ["framer-motion", "tailwind-v4", "micro-interaction", "spring-physics", "dock", "macos-style"],
    dials: { design_variance: 6, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "toolbar", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Manu Arora", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "animated-tabs": {
    title: "Animated Tabs",
    description: "Smooth spring-bound tab slider with layout ID preservation and zero layout shift.",
    category: "ui:motion",
    tags: ["framer-motion", "shadcn-compatible", "spring-physics", "tabs", "layoutId"],
    dials: { design_variance: 4, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "tablist", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://smoothui.dev", license_type: "MIT", author: "SmoothUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "spring-dialog": {
    title: "Spring Dialog",
    description: "Scale-and-fade physics modal with AnimatePresence and keyboard escape handling.",
    category: "ui:motion",
    tags: ["motion/react", "animate-presence", "modal", "spring-physics"],
    dials: { design_variance: 5, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "dialog", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://kokonutui.com", license_type: "MIT", author: "KokonutUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "magnetic-button": {
    title: "Magnetic Button",
    description: "Physics-based cursor magnetic attraction button for high-taste calls to action.",
    category: "ui:motion",
    tags: ["framer-motion", "shadcn-compatible", "spring-physics", "magnetic-physics", "button", "interactive"],
    dials: { design_variance: 4, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://smoothui.dev", license_type: "MIT", author: "SmoothUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
  },
  "fluid-cursor": {
    title: "Fluid Cursor",
    description: "Smooth trailing cursor follower with graceful coarse-pointer (mobile) disablement.",
    category: "ui:motion",
    tags: ["motion/react", "cursor-follower", "smooth-spring"],
    dials: { design_variance: 8, motion_intensity: 8, visual_density: 3 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://groot.studio", license_type: "MIT", author: "Groot Studio", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "canvas-fluid-wave": {
    title: "Canvas Fluid Wave",
    description: "Interactive HTML5 Canvas fluid simulation with mouse interaction, WebGL / Three.js bridge compatibility, and CSS gradient fallback.",
    category: "ui:creative",
    tags: ["threejs", "webgl", "framer-motion", "interactive", "canvas", "a11y-fallback", "tailwind-v4"],
    dials: { design_variance: 9, motion_intensity: 9, visual_density: 3 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://canvas-ui.dev", license_type: "MIT", author: "Canvas UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["three", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "dot-matrix-loader": {
    title: "Dot Matrix Loader",
    description: "Animated dot matrix with wave oscillation, customizable matrix rows, and accessible status role.",
    category: "ui:creative",
    tags: ["dot-matrix", "canvas-pattern", "loader", "status"],
    dials: { design_variance: 6, motion_intensity: 5, visual_density: 7 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "status", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://dotmatrix.dev", license_type: "MIT", author: "Dot Matrix Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "noise-texture-card": {
    title: "Noise Texture Card",
    description: "High-craft noise-dithered backdrop with crisp typography overlay and zero AI slop.",
    category: "ui:creative",
    tags: ["svg-noise", "editorial", "texture", "brutalist"],
    dials: { design_variance: 7, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "particle-field": {
    title: "Particle Field",
    description: "GPU-friendly interactive particle web with prefers-reduced-motion fallback.",
    category: "ui:creative",
    tags: ["canvas", "particles", "physics", "reduced-motion"],
    dials: { design_variance: 8, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://threeui.dev", license_type: "MIT", author: "ThreeUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "diagram-card": {
    title: "Diagram Card",
    description: "Precision SVG diagramming card with minimal vector lines and zero decorative emojis.",
    category: "ui:editorial",
    tags: ["svg", "zero-dependency", "static", "analytical", "diagram"],
    dials: { design_variance: 5, motion_intensity: 1, visual_density: 9 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://diagram.com", license_type: "MIT", author: "diagram-design team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "data-stat-grid": {
    title: "Data Stat Grid",
    description: "Asymmetrical metric showcase for SaaS analytics with high visual density and clean type.",
    category: "ui:editorial",
    tags: ["svg", "zero-dependency", "static", "analytical", "metrics", "grid"],
    dials: { design_variance: 5, motion_intensity: 1, visual_density: 9 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://diagram.com", license_type: "MIT", author: "diagram-design team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "minimal-table": {
    title: "Minimal Table",
    description: "Clean tabular data display with accessible headers, captions, and responsive overflow.",
    category: "ui:editorial",
    tags: ["svg", "zero-dependency", "static", "analytical", "table", "data-grid"],
    dials: { design_variance: 5, motion_intensity: 1, visual_density: 9 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "table", fallback_provided: true },
    license: { source_repository: "https://diagram.com", license_type: "MIT", author: "diagram-design team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "bento-grid": {
    title: "Bento Grid",
    description: "Multi-pane asymmetrical layout grid with responsive column spans and structural borders.",
    category: "ui:block",
    tags: ["tailwind-v4", "marketing", "bento-grid", "asymmetry"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tailark.com", license_type: "MIT", author: "Tailark Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "hero-section": {
    title: "Hero Section",
    description: "Editorial SaaS hero section featuring typography discipline, badge pill, and active CTA.",
    category: "ui:block",
    tags: ["hero", "marketing", "typography", "block"],
    dials: { design_variance: 5, motion_intensity: 2, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://kairoui.com", license_type: "MIT", author: "Kairo UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
  },
  "pricing-table": {
    title: "Pricing Table",
    description: "Multi-tier pricing matrix with monthly/annual toggle and clear feature checkmarks.",
    category: "ui:block",
    tags: ["tailwind-v4", "marketing", "bento-grid", "pricing", "saas"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tailark.com", license_type: "MIT", author: "Tailark Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
  },
  "dot-loader": {
    title: "Dot Loader",
    description: "Minimalist dot pulsation loader for button states or inline progress indicators.",
    category: "ui:utility",
    tags: ["loader", "spinner", "utility", "minimalist"],
    dials: { design_variance: 2, motion_intensity: 4, visual_density: 8 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "status", fallback_provided: true },
    license: { source_repository: "https://icons0.dev", license_type: "MIT", author: "icons0 Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "icon-morph": {
    title: "Icon Morph",
    description: "Clean animated SVG state toggler (play/pause/check) with accessible title.",
    category: "ui:utility",
    tags: ["icon", "svg", "morph", "a11y"],
    dials: { design_variance: 3, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "img", fallback_provided: true },
    license: { source_repository: "https://reui.dev", license_type: "MIT", author: "ReUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "evil-button": {
    title: "Evil Button",
    description: "Playful tactile spring-physics button with synthesized audio feedback and chaotic variants.",
    category: "ui:motion",
    tags: ["playful", "framer-motion", "sound-physics", "interactive", "motion/react", "button", "spring-physics"],
    dials: { design_variance: 8, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/evil-buttons/evil-buttons", license_type: "MIT", author: "Evil-Buttons Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "timeline-player": {
    title: "Timeline Player",
    description: "Precision timeline-based motion and video composition controller with frame scrubbing and timecode.",
    category: "ui:media",
    tags: ["remotion", "video", "motion", "timeline", "media", "player", "tailwind-v4"],
    dials: { design_variance: 7, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/remocn/remocn", license_type: "MIT", author: "Remocn Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
};

/**
 * Traverses candidate directories to collect all component files
 */
function sweepComponentFiles(targetDirs: string[]): Array<{ filePath: string; relativeSubpath: string }> {
  const fileList: Array<{ filePath: string; relativeSubpath: string }> = [];

  for (const baseDir of targetDirs) {
    if (!fs.existsSync(baseDir)) continue;

    function walk(currentDir: string) {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          if (!["node_modules", ".git", "dist", ".next", "out", "build"].includes(entry.name)) {
            walk(fullPath);
          }
        } else if (
          /\.(tsx|ts|jsx|js)$/.test(entry.name) &&
          !entry.name.endsWith(".d.ts") &&
          entry.name !== "utils.ts"
        ) {
          fileList.push({
            filePath: fullPath,
            relativeSubpath: path.relative(baseDir, fullPath).replace(/\\/g, "/"),
          });
        }
      }
    }

    walk(baseDir);
  }

  return fileList;
}

/**
 * Validates item integrity against registry-item schema expectations
 */
function validateRegistryItem(item: RegistryItem): boolean {
  if (!item.name || !item.type || !item.title || !item.category || !item.files || item.files.length === 0) {
    return false;
  }
  if (!item.dials || typeof item.dials.design_variance !== "number") {
    return false;
  }
  if (!item.a11y || typeof item.a11y.keyboard_navigable !== "boolean") {
    return false;
  }
  return true;
}

function main() {
  console.log("🚀 Starting Design Agent Wiki Registry Compilation & Dynamic Sweeper...");

  const rootDir = path.resolve(__dirname, "..");
  const srcDir = path.join(rootDir, "src");
  const monorepoRoot = path.resolve(rootDir, "../..");
  const distRDir = path.join(rootDir, "dist", "r");
  const docsPublicDir = path.resolve(monorepoRoot, "apps/docs/public");
  const docsRDir = path.resolve(docsPublicDir, "r");
  const docsRawComponentsDir = path.resolve(docsPublicDir, "raw", "components");

  // Additional component candidate paths
  const candidateDirs = [
    srcDir,
    path.join(monorepoRoot, "components"),
    path.join(monorepoRoot, "apps/docs/components"),
  ];

  [distRDir, docsRDir, docsPublicDir, docsRawComponentsDir].forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });

  const discoveredFiles = sweepComponentFiles(candidateDirs);
  console.log(`📂 Swept directories: found ${discoveredFiles.length} candidate component files.`);

  const allRegistryItems: RegistryItem[] = [];
  const processedSlugs = new Set<string>();

  for (const { filePath, relativeSubpath } of discoveredFiles) {
    const slug = path.basename(filePath, path.extname(filePath));
    if (processedSlugs.has(slug)) continue;
    processedSlugs.add(slug);

    const fileContent = fs.readFileSync(filePath, "utf-8");

    // 1. Dynamic AST Parsing via Harvester
    const astMeta = parseComponentAST(filePath, fileContent);
    const dialClassification = classifyComponentDials(astMeta, fileContent);

    // 2. Fetch or build metadata overrides
    const override = COMPONENT_METADATA_OVERRIDES[slug];

    const category = override?.category || dialClassification.category;
    const itemType =
      category === "ui:block"
        ? "registry:block"
        : category === "ui:primitive"
        ? "registry:ui"
        : "registry:component";

    // 3. Map Dependencies & Peer Dependencies accurately
    const dependenciesSet = new Set<string>(astMeta.dependencies);
    if (override?.dependencies) {
      override.dependencies.forEach((d) => dependenciesSet.add(d));
    }

    // Auto-map peer dependencies based on AST imports
    if (fileContent.includes("motion") || fileContent.includes("framer-motion")) {
      dependenciesSet.add("motion");
    }
    if (fileContent.includes("lucide-react")) {
      dependenciesSet.add("lucide-react");
    }
    if (fileContent.includes("three")) {
      dependenciesSet.add("three");
    }
    if (fileContent.includes("clsx")) {
      dependenciesSet.add("clsx");
    }
    if (fileContent.includes("tailwind-merge")) {
      dependenciesSet.add("tailwind-merge");
    }
    if (fileContent.includes("class-variance-authority") || fileContent.includes("cva(")) {
      dependenciesSet.add("class-variance-authority");
    }

    // Auto-map registryDependencies
    const registryDependenciesSet = new Set<string>(astMeta.registryDependencies);
    if (override?.registryDependencies) {
      override.registryDependencies.forEach((rd) => registryDependenciesSet.add(rd));
    }

    // Combine tags
    const combinedTags = Array.from(
      new Set([...dialClassification.tags, ...(override?.tags || []), ...(astMeta.tags || [])])
    );

    const dials: RegistryDial = {
      design_variance: override?.dials?.design_variance ?? dialClassification.dials.design_variance,
      motion_intensity: override?.dials?.motion_intensity ?? dialClassification.dials.motion_intensity,
      visual_density: override?.dials?.visual_density ?? dialClassification.dials.visual_density,
    };

    const a11y: RegistryA11y = {
      keyboard_navigable: override?.a11y?.keyboard_navigable ?? astMeta.a11y.keyboard_navigable,
      wai_aria_compliant: override?.a11y?.wai_aria_compliant ?? astMeta.a11y.wai_aria_compliant,
      wai_aria_role: override?.a11y?.wai_aria_role ?? astMeta.a11y.wai_aria_role,
      fallback_provided: override?.a11y?.fallback_provided ?? astMeta.a11y.fallback_provided,
      reduced_motion_supported: override?.a11y?.reduced_motion_supported ?? astMeta.a11y.reduced_motion_supported,
    };

    const license: RegistryLicenseOrigin = {
      source_repository: override?.license?.source_repository || "https://github.com/design-agent-wiki",
      license_type: override?.license?.license_type || astMeta.license || "MIT",
      author: override?.license?.author || astMeta.author || "Community Contributor",
      attribution_required: override?.license?.attribution_required ?? true,
      redistribution_mode: override?.license?.redistribution_mode || "full_source",
    };

    const complexity = astMeta.complexity || (fileContent.length > 3500 ? "high" : fileContent.length < 1500 ? "low" : "medium");

    const registryItem: RegistryItem = {
      $schema: "https://design-wiki.dev/schemas/registry-item.json",
      name: slug,
      type: itemType,
      title: override?.title || astMeta.title,
      description: override?.description || astMeta.description,
      category,
      tags: combinedTags,
      dials,
      complexity,
      a11y,
      license_origin: license,
      dependencies: Array.from(dependenciesSet),
      devDependencies: astMeta.devDependencies.length > 0 ? astMeta.devDependencies : undefined,
      registryDependencies: Array.from(registryDependenciesSet),
      files: [
        {
          path: `registry/${relativeSubpath}`,
          content: fileContent,
          type: itemType,
          target: `components/ui/${path.basename(filePath)}`,
        },
      ],
    };

    if (!validateRegistryItem(registryItem)) {
      console.error(`❌ Validation failed for registry item: ${slug}`);
      continue;
    }

    allRegistryItems.push(registryItem);

    // Serialize individual item JSON (with escaped JSX/TSX source strings)
    const itemJson = JSON.stringify(registryItem, null, 2);
    fs.writeFileSync(path.join(distRDir, `${slug}.json`), itemJson);
    fs.writeFileSync(path.join(docsRDir, `${slug}.json`), itemJson);

    // Generate and write markdown representation with standard YAML frontmatter contract
    const depsYaml =
      registryItem.dependencies.length > 0
        ? registryItem.dependencies.map((d) => `  - "${d}"`).join("\n")
        : "  # No external runtime dependencies";
    const tagsYaml =
      registryItem.tags.length > 0
        ? registryItem.tags.map((t) => `  - "${t}"`).join("\n")
        : '  - "ui"';

    const markdownDoc = `---
id: "${registryItem.name}"
name: "${registryItem.title}"
category: "${registryItem.category}"
library_origin: "${registryItem.license_origin.source_repository}"
dependencies:
${depsYaml}
tags:
${tagsYaml}
dials:
  design_variance: ${registryItem.dials.design_variance}      # 1: Conservative · 10: Asymmetric editorial
  motion_intensity: ${registryItem.dials.motion_intensity}     # 1: Basic hover · 10: Canvas/WebGL springs
  visual_density: ${registryItem.dials.visual_density}       # 1: Generous whitespace · 10: Dense analytical UI
complexity: "${registryItem.complexity}"
a11y:
  keyboard_navigable: ${registryItem.a11y.keyboard_navigable}
  wai_aria_compliant: ${registryItem.a11y.wai_aria_compliant}
  fallback_provided: ${registryItem.a11y.fallback_provided}
---

# ${registryItem.title} (\`${registryItem.name}\`)
> ${registryItem.description}

- **Taxonomy Category**: \`${registryItem.category}\`
- **Structural Complexity**: \`${registryItem.complexity?.toUpperCase()}\`
- **Technical Tags**: ${registryItem.tags.join(", ")}
- **Design Dials**: Variance ${registryItem.dials.design_variance}/10 · Motion ${registryItem.dials.motion_intensity}/10 · Density ${registryItem.dials.visual_density}/10
- **Accessibility AA**: Keyboard Nav: ${registryItem.a11y.keyboard_navigable}, ARIA: ${registryItem.a11y.wai_aria_compliant}, Fallback: ${registryItem.a11y.fallback_provided}

## Installation Recipe
\`\`\`bash
# Native Design Wiki CLI
npx design-wiki add ${registryItem.name}

# Or via shadcn v3
npx shadcn@latest add http://localhost:3000/r/${registryItem.name}.json
\`\`\`

## Peer Dependencies
${registryItem.dependencies.length > 0 ? registryItem.dependencies.map((d) => `- \`${d}\``).join("\n") : "- None"}

## Verified TypeScript Source
\`\`\`tsx
${fileContent}
\`\`\`
`;

    fs.writeFileSync(path.join(docsRawComponentsDir, `${slug}.md`), markdownDoc);

    console.log(`  ✓ Compiled [${registryItem.category}]: ${slug}.json + ${slug}.md (Complexity: ${registryItem.complexity}, Deps: ${registryItem.dependencies.length})`);
  }

  // Write master registry.json
  const registryJson = JSON.stringify(allRegistryItems, null, 2);
  fs.writeFileSync(path.join(distRDir, "registry.json"), registryJson);
  fs.writeFileSync(path.join(docsRDir, "registry.json"), registryJson);

  // Generate /llms.txt
  let llmsTxt = `# Machine-First Design Agent Wiki\n> Curated High-Performance UI Registries & Anti-Slop Safeguards\n\n`;
  llmsTxt += `## System Architecture & Endpoints\n`;
  llmsTxt += `- Registry Index: /r/registry.json\n`;
  llmsTxt += `- Component Items: /r/[name].json\n`;
  llmsTxt += `- Raw Markdown Docs: /raw/components/[slug]\n`;
  llmsTxt += `- MCP Server: npx @design-wiki/mcp\n\n`;
  llmsTxt += `## Available Registry Components (${allRegistryItems.length} verified zero-slop items)\n\n`;

  const grouped: Record<string, RegistryItem[]> = {};
  allRegistryItems.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  for (const [cat, items] of Object.entries(grouped)) {
    llmsTxt += `### Category: ${cat}\n`;
    items.forEach((item) => {
      llmsTxt += `- [${item.name}](/r/${item.name}.json): ${item.description} (Variance: ${item.dials.design_variance}, Motion: ${item.dials.motion_intensity}, Density: ${item.dials.visual_density})\n`;
      llmsTxt += `  - Tags: ${item.tags.join(", ")}\n`;
      llmsTxt += `  - Dependencies: ${item.dependencies.join(", ") || "None"}\n`;
      llmsTxt += `  - Install: npx shadcn@latest add http://localhost:3000/r/${item.name}.json\n`;
    });
    llmsTxt += `\n`;
  }

  fs.writeFileSync(path.join(docsPublicDir, "llms.txt"), llmsTxt);

  // Generate full LLM context index (/llms-full.txt)
  let llmsFullTxt = llmsTxt + `\n## Component Specifications & Source Contracts\n\n`;
  allRegistryItems.forEach((item) => {
    llmsFullTxt += `### ${item.title} (\`${item.name}\`)\n`;
    llmsFullTxt += `- **Category**: \`${item.category}\`\n`;
    llmsFullTxt += `- **Dependencies**: ${item.dependencies.join(", ") || "None"}\n`;
    llmsFullTxt += `- **Registry Dependencies**: ${item.registryDependencies.join(", ") || "None"}\n`;
    llmsFullTxt += `- **Taste Dials**: Variance ${item.dials.design_variance}/10, Motion ${item.dials.motion_intensity}/10, Density ${item.dials.visual_density}/10\n`;
    llmsFullTxt += `- **A11y**: Keyboard Nav: ${item.a11y.keyboard_navigable}, ARIA: ${item.a11y.wai_aria_compliant}, Fallback: ${item.a11y.fallback_provided}\n\n`;
    llmsFullTxt += "```tsx\n" + item.files[0].content + "\n```\n\n---\n\n";
  });

  fs.writeFileSync(path.join(docsPublicDir, "llms-full.txt"), llmsFullTxt);

  console.log(`\n🎉 Registry Build Complete! Compiled ${allRegistryItems.length} components.`);
  console.log(`📁 Artifacts generated:`);
  console.log(`   - ${distRDir}/registry.json`);
  console.log(`   - ${docsRDir}/registry.json`);
  console.log(`   - ${docsPublicDir}/llms.txt`);
  console.log(`   - ${docsPublicDir}/llms-full.txt`);
}

main();
