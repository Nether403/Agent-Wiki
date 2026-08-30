import fs from "fs";
import path from "path";

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
  category:
    | "ui:primitive"
    | "ui:motion"
    | "ui:creative"
    | "ui:editorial"
    | "ui:block"
    | "ui:media"
    | "ui:utility";
  tags: string[];
  dials: RegistryDial;
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

// Map component slug to curated metadata
const COMPONENT_METADATA: Record<
  string,
  {
    title: string;
    description: string;
    category: RegistryItem["category"];
    tags: string[];
    dials: RegistryDial;
    a11y: RegistryA11y;
    license: RegistryLicenseOrigin;
    dependencies: string[];
    registryDependencies: string[];
  }
> = {
  button: {
    title: "Button",
    description: "Polymorphic button with accessible variants, focus rings, and zero arbitrary spacing.",
    category: "ui:primitive",
    tags: ["tailwind-v4", "accessible", "radix-primitive", "button"],
    dials: { design_variance: 2, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true },
    license: { source_repository: "https://ui.shadcn.com", license_type: "MIT", author: "Shadcn & Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  input: {
    title: "Input",
    description: "Accessible text input with floating state, error boundaries, and focus-visible ring.",
    category: "ui:primitive",
    tags: ["tailwind-v4", "form", "accessible", "input"],
    dials: { design_variance: 2, motion_intensity: 1, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "textbox", fallback_provided: true },
    license: { source_repository: "https://ui.shadcn.com", license_type: "MIT", author: "Shadcn & Community", attribution_required: true, redistribution_mode: "full_source" },
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
    tags: ["motion/react", "spring-physics", "dock", "macos-style"],
    dials: { design_variance: 6, motion_intensity: 7, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "toolbar", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Manu Arora", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "animated-tabs": {
    title: "Animated Tabs",
    description: "Smooth spring-bound tab slider with layout ID preservation and zero layout shift.",
    category: "ui:motion",
    tags: ["motion/react", "spring-physics", "tabs", "layoutId"],
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
    tags: ["motion/react", "magnetic-physics", "button", "interactive"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
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
    description: "Interactive HTML5 Canvas fluid simulation with mouse interaction and CSS gradient fallback.",
    category: "ui:creative",
    tags: ["canvas", "shader-simulation", "interactive", "a11y-fallback"],
    dials: { design_variance: 8, motion_intensity: 9, visual_density: 3 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://canvas-ui.dev", license_type: "MIT", author: "Canvas UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "dot-matrix-loader": {
    title: "Dot Matrix Loader",
    description: "Animated dot matrix with wave oscillation, customizable matrix rows, and accessible status role.",
    category: "ui:creative",
    tags: ["dot-matrix", "canvas-pattern", "loader", "status"],
    dials: { design_variance: 6, motion_intensity: 5, visual_density: 7 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "status", fallback_provided: true },
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
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
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
    tags: ["editorial", "svg", "analytical", "diagram"],
    dials: { design_variance: 5, motion_intensity: 1, visual_density: 8 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://diagram.com", license_type: "MIT", author: "diagram-design team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "data-stat-grid": {
    title: "Data Stat Grid",
    description: "Asymmetrical metric showcase for SaaS analytics with high visual density and clean type.",
    category: "ui:editorial",
    tags: ["analytical", "metrics", "grid", "saas-dashboard"],
    dials: { design_variance: 4, motion_intensity: 1, visual_density: 9 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://diagram.com", license_type: "MIT", author: "diagram-design team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "minimal-table": {
    title: "Minimal Table",
    description: "Clean tabular data display with accessible headers, captions, and responsive overflow.",
    category: "ui:editorial",
    tags: ["table", "data-grid", "accessible", "editorial"],
    dials: { design_variance: 3, motion_intensity: 1, visual_density: 9 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "table", fallback_provided: true },
    license: { source_repository: "https://diagram.com", license_type: "MIT", author: "diagram-design team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "bento-grid": {
    title: "Bento Grid",
    description: "Multi-pane asymmetrical layout grid with responsive column spans and structural borders.",
    category: "ui:block",
    tags: ["bento-grid", "layout-block", "asymmetry", "marketing"],
    dials: { design_variance: 7, motion_intensity: 3, visual_density: 6 },
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
    tags: ["pricing", "saas", "marketing", "interactive-toggle"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 7 },
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
};

function main() {
  console.log("🚀 Starting Design Agent Wiki Registry Compilation...");

  const rootDir = path.resolve(__dirname, "..");
  const srcDir = path.join(rootDir, "src");
  const distRDir = path.join(rootDir, "dist", "r");
  const monorepoRoot = path.resolve(rootDir, "../..");
  const docsPublicDir = path.resolve(monorepoRoot, "apps/docs/public");
  const docsRDir = path.resolve(docsPublicDir, "r");

  [distRDir, docsRDir, docsPublicDir].forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });

  const categories = ["primitives", "motion", "creative", "editorial", "blocks", "utility"];
  const allRegistryItems: RegistryItem[] = [];

  for (const cat of categories) {
    const catDir = path.join(srcDir, cat);
    if (!fs.existsSync(catDir)) continue;

    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

    for (const file of files) {
      const slug = path.basename(file, path.extname(file));
      const filePath = path.join(catDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const meta = COMPONENT_METADATA[slug];
      if (!meta) {
        console.warn(`⚠️ Warning: No explicit metadata configured for slug "${slug}".`);
        continue;
      }

      const itemType =
        meta.category === "ui:block"
          ? "registry:block"
          : meta.category === "ui:primitive"
          ? "registry:ui"
          : "registry:component";

      const registryItem: RegistryItem = {
        $schema: "https://design-wiki.dev/schemas/registry-item.json",
        name: slug,
        type: itemType,
        title: meta.title,
        description: meta.description,
        category: meta.category,
        tags: meta.tags,
        dials: meta.dials,
        a11y: meta.a11y,
        license_origin: meta.license,
        dependencies: meta.dependencies,
        registryDependencies: meta.registryDependencies,
        files: [
          {
            path: `registry/${cat}/${file}`,
            content: content,
            type: itemType,
            target: `components/ui/${file}`,
          },
        ],
      };

      allRegistryItems.push(registryItem);

      // Write individual item JSON
      const itemJson = JSON.stringify(registryItem, null, 2);
      fs.writeFileSync(path.join(distRDir, `${slug}.json`), itemJson);
      fs.writeFileSync(path.join(docsRDir, `${slug}.json`), itemJson);

      console.log(`  ✓ Compiled [${meta.category}]: ${slug}.json`);
    }
  }

  // Write master registry.json
  const registryJson = JSON.stringify(allRegistryItems, null, 2);
  fs.writeFileSync(path.join(distRDir, "registry.json"), registryJson);
  fs.writeFileSync(path.join(docsRDir, "registry.json"), registryJson);

  // Generate /llms.txt and /llms-full.txt
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

  for (const [category, items] of Object.entries(grouped)) {
    llmsTxt += `### Category: ${category}\n`;
    items.forEach((item) => {
      llmsTxt += `- [${item.name}](/r/${item.name}.json): ${item.description} (Variance: ${item.dials.design_variance}, Motion: ${item.dials.motion_intensity}, Density: ${item.dials.visual_density})\n`;
      llmsTxt += `  - Tags: ${item.tags.join(", ")}\n`;
      llmsTxt += `  - Install: npx shadcn@latest add http://localhost:3000/r/${item.name}.json\n`;
    });
    llmsTxt += `\n`;
  }

  fs.writeFileSync(path.join(docsPublicDir, "llms.txt"), llmsTxt);

  // Full LLM context file
  let llmsFullTxt = llmsTxt + `\n## Component Specifications & Source Contracts\n\n`;
  allRegistryItems.forEach((item) => {
    llmsFullTxt += `### ${item.title} (\`${item.name}\`)\n`;
    llmsFullTxt += `- **Category**: \`${item.category}\`\n`;
    llmsFullTxt += `- **Dependencies**: ${item.dependencies.join(", ") || "None"}\n`;
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
