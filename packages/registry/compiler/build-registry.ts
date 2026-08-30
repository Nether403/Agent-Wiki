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
  accordion: {
    title: "Accordion",
    description: "Accessible collapsible disclosure panels with smooth height transitions and keyboard arrow navigation.",
    category: "ui:primitive",
    tags: ["radix-primitives", "accordion", "disclosure", "headless", "a11y"],
    dials: { design_variance: 2, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  separator: {
    title: "Separator",
    description: "Semantic horizontal or vertical divider with decorative and accessible separator roles.",
    category: "ui:primitive",
    tags: ["radix-primitives", "separator", "divider", "layout"],
    dials: { design_variance: 1, motion_intensity: 1, visual_density: 7 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://radix-ui.com", license_type: "MIT", author: "Radix UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  skeleton: {
    title: "Skeleton",
    description: "Subtle pulse skeleton loader with zero cumulative layout shift and reduced motion support.",
    category: "ui:primitive",
    tags: ["skeleton", "placeholder", "loading", "tailwind-v4"],
    dials: { design_variance: 1, motion_intensity: 2, visual_density: 7 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://ui.shadcn.com", license_type: "MIT", author: "Shadcn & Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "command-menu": {
    title: "Command Menu",
    description: "Keyboard-first command palette dialog with fuzzy filtering, category grouping, and shortcut badges.",
    category: "ui:primitive",
    tags: ["cmdk", "command-palette", "keyboard-first", "modal", "a11y"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "dialog", fallback_provided: true },
    license: { source_repository: "https://github.com/pacocoursey/cmdk", license_type: "MIT", author: "Paco Coursey", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "shimmer-button": {
    title: "Shimmer Button",
    description: "Polished call-to-action button featuring smooth rotating radial conic shimmer and micro-spring scale.",
    category: "ui:motion",
    tags: ["magic-ui", "shimmer", "button", "micro-interaction", "cta"],
    dials: { design_variance: 6, motion_intensity: 5, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["button"],
  },
  "spotlight-card": {
    title: "Spotlight Card",
    description: "Interactive radial cursor spotlight tracking card with smooth proximity illumination.",
    category: "ui:motion",
    tags: ["aceternity", "spotlight", "card", "mouse-tracking", "micro-interaction"],
    dials: { design_variance: 5, motion_intensity: 5, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Manu Arora", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: ["card"],
  },
  marquee: {
    title: "Marquee",
    description: "Infinite content stream marquee with pause-on-hover, velocity controls, and reduced-motion disablement.",
    category: "ui:motion",
    tags: ["magic-ui", "marquee", "animation", "ticker", "loop"],
    dials: { design_variance: 5, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "glow-border": {
    title: "Glow Border",
    description: "Rotating chromatic gradient glow border wrapper for cards, hero callouts, and featured sections.",
    category: "ui:creative",
    tags: ["magic-ui", "glow", "conic-gradient", "creative", "border"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "radial-gradient-mask": {
    title: "Radial Gradient Mask",
    description: "Interactive radial reveal mask on dotted matrix backdrop with pointer position tracking.",
    category: "ui:creative",
    tags: ["aceternity", "mask", "shader-simulation", "creative", "interactive"],
    dials: { design_variance: 7, motion_intensity: 3, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Manu Arora", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "code-block": {
    title: "Code Block",
    description: "Editorial syntax display card with line numbering, language badge, and instant copy feedback.",
    category: "ui:editorial",
    tags: ["code", "syntax", "editorial", "developer-tool", "copy"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "callout-card": {
    title: "Callout Card",
    description: "High-contrast editorial callout with semantic state themes (info, warning, success, danger).",
    category: "ui:editorial",
    tags: ["callout", "alert", "editorial", "semantic"],
    dials: { design_variance: 3, motion_intensity: 1, visual_density: 7 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "note", fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "feature-section": {
    title: "Feature Section",
    description: "Asymmetrical 4-column SaaS architectural feature grid with badge pill and structured cards.",
    category: "ui:block",
    tags: ["feature", "marketing", "saas", "bento-grid", "layout-block"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tailark.com", license_type: "MIT", author: "Tailark Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "navbar-sticky": {
    title: "Navbar Sticky",
    description: "Sticky responsive top navigation bar with blur backdrop, link routing, and mobile drawer.",
    category: "ui:block",
    tags: ["navbar", "navigation", "header", "layout-block", "responsive"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "banner", fallback_provided: true },
    license: { source_repository: "https://tailark.com", license_type: "MIT", author: "Tailark Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: ["button"],
  },
  "audio-visualizer": {
    title: "Audio Visualizer",
    description: "Acoustic frequency waveform visualizer with playback state toggles and live audio synthesis.",
    category: "ui:media",
    tags: ["audio", "waveform", "visualizer", "media", "player"],
    dials: { design_variance: 6, motion_intensity: 7, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/remocn/remocn", license_type: "MIT", author: "Remocn Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "keyboard-shortcut": {
    title: "Keyboard Shortcut",
    description: "Accessible platform-adaptive keyboard key combo pill with monospace token styling.",
    category: "ui:utility",
    tags: ["kbd", "shortcut", "keyboard", "utility", "accessibility"],
    dials: { design_variance: 2, motion_intensity: 1, visual_density: 8 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-prompt-bar-expanded": {
    title: "Expanded AI Prompt Bar",
    description: "Multimodal prompt bar with voice recording button, attachment tray, model selector dropdown, token counter, and slash-command trigger.",
    category: "ui:ai-native",
    tags: ["ai-native", "prompt-bar", "multimodal", "kokonut-ui", "cult-ui"],
    dials: { design_variance: 6, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://kokonutui.com", license_type: "MIT", author: "Kokonut UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-streaming-message": {
    title: "AI Streaming Message",
    description: "Markdown streaming message container with flicker-free token rendering, copy button, feedback thumbs, and animated cursor stream.",
    category: "ui:ai-native",
    tags: ["ai-native", "streaming", "chat", "cursor", "cult-ui"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://cult-ui.com", license_type: "MIT", author: "Cult UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-reasoning-accordion": {
    title: "AI Reasoning Chain-of-Thought Accordion",
    description: "Collapsible thinking process card showing step-by-step agent chain-of-thought, elapsed time counter, and tool execution status badges.",
    category: "ui:ai-native",
    tags: ["ai-native", "reasoning", "chain-of-thought", "accordion", "cult-ui"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://cult-ui.com", license_type: "MIT", author: "Cult UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-tool-call-card": {
    title: "AI MCP Tool Call Inspector",
    description: "Visual inspector for MCP and agent tool executions, showing input parameters, live loading spinner, JSON inspector, and retry/error triggers.",
    category: "ui:ai-native",
    tags: ["ai-native", "mcp-tool", "tool-call", "agent", "cult-ui"],
    dials: { design_variance: 6, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://cult-ui.com", license_type: "MIT", author: "Cult UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-artifact-sandbox-iframe": {
    title: "AI Artifact Live Sandbox Frame",
    description: "Split-screen live preview canvas with responsive device switcher, code/preview toggle, and version history diff slider.",
    category: "ui:ai-native",
    tags: ["ai-native", "artifact-sandbox", "preview", "iframe", "21st-dev"],
    dials: { design_variance: 7, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://21st.dev", license_type: "MIT", author: "21st.dev Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-human-in-the-loop-diff": {
    title: "AI Human-in-the-Loop Diff Drawer",
    description: "Interactive confirmation drawer displaying code diffs with Approve, Modify Prompt, and Reject feedback controls.",
    category: "ui:ai-native",
    tags: ["ai-native", "hitl", "diff-viewer", "review", "origin-ui"],
    dials: { design_variance: 6, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://originui.com", license_type: "MIT", author: "Origin UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-prompt-template-library": {
    title: "AI Prompt Template Library Carousel",
    description: "Categorized card carousel of pre-tested agent prompts with one-click injection into active input.",
    category: "ui:ai-native",
    tags: ["ai-native", "prompts", "template-library", "carousel", "cult-ui"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://cult-ui.com", license_type: "MIT", author: "Cult UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "otp-pin-input": {
    title: "OTP PIN One-Time Input",
    description: "Accessible 6-digit PIN/OTP input with auto-focus advance, backspace regression, paste-handling, and masked character support.",
    category: "ui:primitive",
    tags: ["form", "otp", "pin-input", "accessible", "origin-ui"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://originui.com", license_type: "MIT", author: "Origin UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "password-strength-meter": {
    title: "Password Strength Entropy Meter",
    description: "Real-time zxcvbn-style entropy scoring bar with visual requirement checklist.",
    category: "ui:primitive",
    tags: ["form", "password-strength", "security", "origin-ui"],
    dials: { design_variance: 3, motion_intensity: 2, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://originui.com", license_type: "MIT", author: "Origin UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "multi-tag-input": {
    title: "Multi-Tag Keyboard Input",
    description: "Keyboard-navigable badge input with tag creation, backspace deletion, autocomplete suggestions, and duplicate prevention.",
    category: "ui:primitive",
    tags: ["form", "tags", "multi-input", "autocomplete", "shark-ui"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://shark.vini.one", license_type: "MIT", author: "Shark UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "dual-range-slider": {
    title: "Dual Range Slider",
    description: "Multi-thumb range slider with floating value tooltips, min/max bounds clamping, and step markers.",
    category: "ui:primitive",
    tags: ["form", "slider", "range", "accessible", "heroui"],
    dials: { design_variance: 3, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://heroui.com", license_type: "MIT", author: "HeroUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "file-upload-dropzone": {
    title: "File Upload Dropzone",
    description: "Drag-and-drop zone with MIME validation, file size limits, thumbnail generation, upload progress bars, and abort buttons.",
    category: "ui:primitive",
    tags: ["form", "file-upload", "drag-drop", "reui"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://reui.io", license_type: "MIT", author: "ReUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "tree-view-explorer": {
    title: "Tree View File Explorer",
    description: "Accessible hierarchical file/folder tree view with expand/collapse animations, keyboard navigation, and custom node icons.",
    category: "ui:primitive",
    tags: ["tree-view", "file-explorer", "hierarchy", "shark-ui"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://shark.vini.one", license_type: "MIT", author: "Shark UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "color-picker-popover": {
    title: "Color Picker Popover",
    description: "Color picker with HEX/RGBA/HSL mode switching, preset palette swatches, eyedropper tool, and alpha slider.",
    category: "ui:primitive",
    tags: ["form", "color-picker", "popover", "eyedropper", "shark-ui"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://shark.vini.one", license_type: "MIT", author: "Shark UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "rich-date-range-picker": {
    title: "Rich Date Range Calendar Picker",
    description: "Dual-month calendar popover with preset quick-picks (Today, Last 7 Days, Month to Date) and disabled range bounds.",
    category: "ui:primitive",
    tags: ["form", "calendar", "date-range", "heroui"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://heroui.com", license_type: "MIT", author: "HeroUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "combobox-virtualized": {
    title: "Virtualized Search Combobox",
    description: "High-performance search combobox handling 10,000+ items via virtualization, with keyboard navigation and async loading states.",
    category: "ui:primitive",
    tags: ["combobox", "virtualized", "large-list", "shark-ui"],
    dials: { design_variance: 3, motion_intensity: 2, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://shark.vini.one", license_type: "MIT", author: "Shark UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "interactive-area-chart": {
    title: "Interactive Area Chart",
    description: "Responsive SVG area chart with linear gradient fill, brush timeline zoom, and interactive cursor tooltip.",
    category: "ui:editorial",
    tags: ["chart", "area-chart", "data-viz", "tremor-raw"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tremor.so", license_type: "MIT", author: "Tremor Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "donut-metric-card": {
    title: "Donut Metric Breakdown Card",
    description: "Donut chart featuring centered key metric, category percentage breakdown, and hover slice detachment.",
    category: "ui:editorial",
    tags: ["chart", "donut-chart", "metric-card", "tremor-raw"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tremor.so", license_type: "MIT", author: "Tremor Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "cohort-retention-heatmap": {
    title: "Cohort Retention Heatmap Matrix",
    description: "Matrix grid displaying user cohort retention percentages over time with conditional color intensity scaling.",
    category: "ui:editorial",
    tags: ["chart", "cohort", "heatmap", "matrix", "tremor-raw"],
    dials: { design_variance: 5, motion_intensity: 2, visual_density: 9 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tremor.so", license_type: "MIT", author: "Tremor Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "sankey-flow-diagram": {
    title: "Sankey Flow Stream Diagram",
    description: "Node-to-node stream flow diagram illustrating distribution, funnel loss, and channel routing.",
    category: "ui:editorial",
    tags: ["diagram", "sankey", "flow-chart", "data-viz", "diagram-design"],
    dials: { design_variance: 6, motion_intensity: 2, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/cathrynlavery/diagram-design", license_type: "MIT", author: "cathrynlavery", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "gantt-roadmap-chart": {
    title: "Gantt Project Roadmap Chart",
    description: "Timeline schedule view with milestone bars, category grouping, and progress percentage markers.",
    category: "ui:editorial",
    tags: ["chart", "gantt", "roadmap", "timeline", "diagram-design"],
    dials: { design_variance: 6, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/cathrynlavery/diagram-design", license_type: "MIT", author: "cathrynlavery", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "swot-analysis-matrix": {
    title: "SWOT Strategic Analysis Matrix",
    description: "2x2 grid layout for Strengths, Weaknesses, Opportunities, and Threats with distinct visual accents.",
    category: "ui:editorial",
    tags: ["diagram", "swot", "matrix", "strategic", "diagram-design"],
    dials: { design_variance: 5, motion_intensity: 2, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/cathrynlavery/diagram-design", license_type: "MIT", author: "cathrynlavery", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "text-morph-transition": {
    title: "Text Morph Layout Transition",
    description: "Smooth letter-by-letter layout morphing between arbitrary words/phrases.",
    category: "ui:motion",
    tags: ["motion", "text-morph", "morphing", "motion-primitives"],
    dials: { design_variance: 6, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://motion-primitives.com", license_type: "MIT", author: "Ibelick", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "image-mouse-trail": {
    title: "Image Pointer Mouse Trail",
    description: "Interactive pointer trail displaying trailing layered images with velocity-sensitive rotation and fade-out.",
    category: "ui:motion",
    tags: ["motion", "mouse-trail", "interactive", "react-bits"],
    dials: { design_variance: 8, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "orbiting-circles": {
    title: "Orbiting Planetary Circles",
    description: "Nested rotating orbits carrying technology/brand icons with configurable speed and direction.",
    category: "ui:motion",
    tags: ["motion", "orbiting-circles", "magic-ui", "planetary"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "animated-beam-pipeline": {
    title: "Animated Beam Decision Pipeline",
    description: "SVG curved beam animation connecting distinct nodes with glowing laser pulses indicating data flow.",
    category: "ui:motion",
    tags: ["motion", "animated-beam", "pipeline", "laser", "magic-ui"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "swipeable-action-row": {
    title: "Swipeable Mobile Action Row",
    description: "Mobile-first list item supporting horizontal swipe gestures to reveal delete, archive, and pin action triggers.",
    category: "ui:motion",
    tags: ["motion", "gesture", "swipeable", "mobile", "smooth-ui"],
    dials: { design_variance: 5, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://smoothui.dev", license_type: "MIT", author: "SmoothUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "squishy-physics-button": {
    title: "Squishy Physics Bounce Button",
    description: "Velocity-reactive button with squishy spring physics, elastic rebound, and optional Web Audio synthesis click sounds.",
    category: "ui:motion",
    tags: ["motion", "physics", "spring", "evil-buttons"],
    dials: { design_variance: 8, motion_intensity: 8, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://evil-buttons.dev", license_type: "MIT", author: "Evil Buttons Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "scratch-to-reveal-card": {
    title: "Scratch-to-Reveal Reward Card",
    description: "Canvas scratch-off surface revealing hidden discount codes or rewards beneath user gestures.",
    category: "ui:motion",
    tags: ["motion", "scratch-card", "canvas", "gamification", "magic-ui"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "dock-magnification": {
    title: "macOS Dock Magnification",
    description: "macOS-style dock with mouse proximity magnification and smooth spring icon popups.",
    category: "ui:motion",
    tags: ["motion", "dock", "magnification", "macos", "magic-ui"],
    dials: { design_variance: 7, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://magicui.design", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ballpit-physics-canvas": {
    title: "Interactive Ballpit Physics Canvas",
    description: "Interactive 2D bouncing ball physics simulation responding to gravity and boundary collisions.",
    category: "ui:creative",
    tags: ["creative", "physics", "canvas", "ballpit", "react-bits"],
    dials: { design_variance: 9, motion_intensity: 9, visual_density: 3 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "iridescence-shader-plane": {
    title: "Iridescence Chromatic Shader Plane",
    description: "WebGL fragment shader rendering chromatic oil-slick iridescence with configurable noise frequency.",
    category: "ui:creative",
    tags: ["creative", "webgl", "shader", "iridescence", "react-bits"],
    dials: { design_variance: 9, motion_intensity: 8, visual_density: 3 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "hyperspeed-tunnel": {
    title: "Hyperspeed Warp Tunnel",
    description: "Three.js/Canvas starfield/light-trail warp speed effect with adjustable speed and neon lighting.",
    category: "ui:creative",
    tags: ["creative", "starfield", "warp-speed", "tunnel", "react-bits"],
    dials: { design_variance: 9, motion_intensity: 9, visual_density: 3 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "crt-terminal-scanlines": {
    title: "CRT Terminal Scanline Display",
    description: "Retro CRT monitor emulator with animated horizontal scanlines, phosphor glow, screen curvature, and text flicker.",
    category: "ui:creative",
    tags: ["creative", "retro", "crt", "scanlines", "terminal", "cult-ui"],
    dials: { design_variance: 8, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://cult-ui.com", license_type: "MIT", author: "Cult UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "audio-reactive-3d-sphere": {
    title: "Audio Reactive 3D Wireframe Sphere",
    description: "3D vertex-displaced wireframe sphere reacting in real time to synthesized audio frequency data.",
    category: "ui:creative",
    tags: ["creative", "3d", "audio-reactive", "wireframe", "three-ui"],
    dials: { design_variance: 9, motion_intensity: 9, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://21st.dev", license_type: "MIT", author: "Dot Matrix Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "grid-distort-interactive": {
    title: "Interactive Grid Distort Mesh",
    description: "Interactive grid mesh that warps and ripples under mouse cursor velocity with spring decay.",
    category: "ui:creative",
    tags: ["creative", "interactive", "mesh", "distortion", "react-bits"],
    dials: { design_variance: 8, motion_intensity: 8, visual_density: 4 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "hero-parallax-scroll": {
    title: "Hero 3D Parallax Scroll Showcase",
    description: "Multi-row 3D perspective image grid that shifts and rotates as the user scrolls down the page.",
    category: "ui:block",
    tags: ["block", "hero", "parallax", "3d-perspective", "aceternity"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Manu Arora", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "google-gemini-glow-hero": {
    title: "Google Gemini Laser Glow Hero",
    description: "Dark-mode hero section with layered animated SVG laser paths and responsive central CTA.",
    category: "ui:block",
    tags: ["block", "hero", "laser-glow", "dark-mode", "aceternity"],
    dials: { design_variance: 7, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Manu Arora", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "interactive-roi-calculator": {
    title: "Interactive ROI & Savings Calculator",
    description: "Marketing block with interactive price sliders, team size selectors, and dynamic cost savings calculations.",
    category: "ui:block",
    tags: ["block", "roi-calculator", "marketing", "pricing", "tailark"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tailark.com", license_type: "MIT", author: "Tailark Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "device-mockup-showcase": {
    title: "Device Mockup Showcase Frame",
    description: "Pixel-perfect Safari browser and iPhone device frames with screenshot scroll-into-view animations.",
    category: "ui:block",
    tags: ["block", "device-mockup", "safari", "iphone", "daisyui"],
    dials: { design_variance: 6, motion_intensity: 4, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://daisyui.com", license_type: "MIT", author: "Pouya Saadeghi", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "testimonial-masonry-marquee": {
    title: "Testimonial Masonry Marquee Grid",
    description: "Masonry grid of verified user review cards with avatar verification and star ratings.",
    category: "ui:block",
    tags: ["block", "testimonials", "masonry", "reviews", "tailark"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://tailark.com", license_type: "MIT", author: "Tailark Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "app-shell-sidebar-layout": {
    title: "SaaS App Shell Sidebar Layout",
    description: "Production-ready SaaS dashboard shell with collapsible multi-tier sidebar, breadcrumbs, search bar, and user profile popover.",
    category: "ui:block",
    tags: ["block", "app-shell", "sidebar", "dashboard", "layout", "reui"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://reui.io", license_type: "MIT", author: "ReUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "agent-node-graph": {
    title: "Agent Node Graph",
    description: "Dynamic visual canvas representing multi-agent orchestration, pipeline steps, and tool executions.",
    category: "ui:workflow",
    tags: ["workflow", "canvas", "agent", "xyflow", "dag", "interactive"],
    dials: { design_variance: 6, motion_intensity: 5, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/xyflow/xyflow", license_type: "MIT", author: "XY Flow Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "decision-node-canvas": {
    title: "Decision Node Canvas",
    description: "Interactive DAG flow with condition nodes, zooming/panning, and branch evaluation.",
    category: "ui:workflow",
    tags: ["workflow", "canvas", "decision-tree", "dag", "xyflow"],
    dials: { design_variance: 6, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/xyflow/xyflow", license_type: "MIT", author: "XY Flow Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "data-pipeline-canvas": {
    title: "Data Pipeline Canvas",
    description: "Real-time streaming data pipeline editor with custom input/output sockets and latency metrics.",
    category: "ui:workflow",
    tags: ["workflow", "canvas", "pipeline", "streaming", "data"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/xyflow/xyflow", license_type: "MIT", author: "XY Flow Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "embedded-whiteboard": {
    title: "Embedded Whiteboard",
    description: "Lightweight vector annotation whiteboard with high-DPI scaling and accessible text transcript fallback.",
    category: "ui:workflow",
    tags: ["workflow", "whiteboard", "canvas", "sketch", "excalidraw"],
    dials: { design_variance: 7, motion_intensity: 2, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/excalidraw/excalidraw", license_type: "MIT", author: "Excalidraw Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "meteors-background": {
    title: "Meteors Background",
    description: "Pure CSS/Tailwind animated shooting star and meteor backdrop with reduced-motion support.",
    category: "ui:creative",
    tags: ["creative", "background", "meteors", "magic-ui", "animation"],
    dials: { design_variance: 7, motion_intensity: 6, visual_density: 4 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/magicuidesign/magicui", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "retro-grid": {
    title: "Retro Grid",
    description: "Isometric 3D scrolling grid with linear top-to-bottom opacity fade and perspective horizon.",
    category: "ui:creative",
    tags: ["creative", "grid", "retro", "magic-ui", "3d"],
    dials: { design_variance: 7, motion_intensity: 5, visual_density: 4 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/magicuidesign/magicui", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "animated-beam": {
    title: "Animated Beam",
    description: "SVG animated glowing curve connecting multiple nodes with continuous gradient travel.",
    category: "ui:motion",
    tags: ["motion", "beam", "svg", "curve", "magic-ui"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/magicuidesign/magicui", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "mesh-gradient-shader": {
    title: "Mesh Gradient Shader",
    description: "Zero-dependency WebGL organic gradient canvas with static CSS fallback and reduced-motion bypass.",
    category: "ui:creative",
    tags: ["creative", "webgl", "shader", "gradient", "paper-shaders"],
    dials: { design_variance: 8, motion_intensity: 6, visual_density: 4 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/paper-design/shaders", license_type: "Apache-2.0", author: "Paper Design", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "grain-noise-shader": {
    title: "Grain Noise Shader",
    description: "Ultra-low-overhead SVG simplex noise backdrop for texture and editorial polish.",
    category: "ui:creative",
    tags: ["creative", "noise", "shader", "svg", "paper-shaders"],
    dials: { design_variance: 6, motion_intensity: 2, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/paper-design/shaders", license_type: "Apache-2.0", author: "Paper Design", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "interactive-hover-button": {
    title: "Interactive Hover Button",
    description: "Magnetic particle expansion button with smooth spring scale and focus-visible indicators.",
    category: "ui:motion",
    tags: ["motion", "button", "interactive", "hover", "animata"],
    dials: { design_variance: 5, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/codse/animata", license_type: "MIT", author: "Animata Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "smooth-scroll-provider": {
    title: "Smooth Scroll Provider",
    description: "Context wrapper managing Lenis smooth-scrolling with accessibility-respecting reduced-motion bypass.",
    category: "ui:motion",
    tags: ["motion", "scroll", "lenis", "smooth-scroll", "context"],
    dials: { design_variance: 4, motion_intensity: 5, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/darkroomengineering/lenis", license_type: "MIT", author: "Darkroom Engineering", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "parallax-scroll-container": {
    title: "Parallax Scroll Container",
    description: "Zero-lag scroll-anchored viewport container with reduced-motion fallback.",
    category: "ui:motion",
    tags: ["motion", "parallax", "scroll", "viewport"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/darkroomengineering/lenis", license_type: "MIT", author: "Darkroom Engineering", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "spring-orchestrator": {
    title: "Spring Orchestrator",
    description: "Coordinated stagger animation manager with spring physics presets and reduced-motion safety.",
    category: "ui:motion",
    tags: ["motion", "spring", "orchestration", "stagger"],
    dials: { design_variance: 5, motion_intensity: 5, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/motiondivision/motion", license_type: "MIT", author: "Motion Division", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "kpi-stat-card-group": {
    title: "KPI Stat Card Group",
    description: "Multi-metric comparison cards with inline delta percentages, target thresholds, and mini sparklines.",
    category: "ui:block",
    tags: ["block", "kpi", "dashboard", "analytics", "tremor"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/tremorlabs/tremor", license_type: "Apache-2.0", author: "Tremor Labs", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "data-table-server-faceted": {
    title: "Data Table Server Faceted",
    description: "Enterprise data table with column pinning, multi-facet filtering, and keyboard navigation.",
    category: "ui:block",
    tags: ["block", "table", "data-grid", "faceted", "primer"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 9 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "table", fallback_provided: true },
    license: { source_repository: "https://github.com/primer/react", license_type: "MIT", author: "GitHub Primer Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "audit-timeline-stream": {
    title: "Audit Timeline Stream",
    description: "Dense audit log with JSON diff expandable rows and actor attribution avatars.",
    category: "ui:block",
    tags: ["block", "timeline", "audit", "stream", "primer"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 8 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/primer/react", license_type: "MIT", author: "GitHub Primer Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "color-picker-primitive": {
    title: "Color Picker Primitive",
    description: "Accessible headless color picker with hex/rgb input, palette swatches, and clipboard copy.",
    category: "ui:primitive",
    tags: ["primitive", "color-picker", "form", "headless", "ark-ui"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/chakra-ui/ark", license_type: "MIT", author: "Chakra Systems", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "date-range-picker-popover": {
    title: "Date Range Picker Popover",
    description: "Accessible date range selection popover with calendar grid and keyboard navigation.",
    category: "ui:primitive",
    tags: ["primitive", "calendar", "date-picker", "popover", "ariakit"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "dialog", fallback_provided: true },
    license: { source_repository: "https://github.com/ariakit/ariakit", license_type: "MIT", author: "Ariakit Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "number-ticker": {
    title: "Number Ticker",
    description: "Accessible spring-animated number counter for statistics, metrics, and KPI indicators.",
    category: "ui:motion",
    tags: ["motion", "counter", "ticker", "spring", "magicui"],
    dials: { design_variance: 5, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "status", fallback_provided: true },
    license: { source_repository: "https://github.com/magicuidesign/magicui", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "sparkles-text": {
    title: "Sparkles Text",
    description: "Dynamic SVG sparkle highlights superimposed on bold typographic headlines.",
    category: "ui:motion",
    tags: ["motion", "typography", "sparkles", "headline", "magicui"],
    dials: { design_variance: 7, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "presentation", fallback_provided: true },
    license: { source_repository: "https://github.com/magicuidesign/magicui", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "border-beam": {
    title: "Border Beam",
    description: "Animated border glow highlight tracing container boundaries with gradient light.",
    category: "ui:motion",
    tags: ["motion", "border", "glow", "visual-effects", "magicui"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "presentation", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/magicuidesign/magicui", license_type: "MIT", author: "Magic UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "particle-burst-button": {
    title: "Particle Burst Button",
    description: "Tactile action button triggering a physics-driven radial particle burst on success or click.",
    category: "ui:motion",
    tags: ["motion", "button", "particles", "delight", "feedback"],
    dials: { design_variance: 6, motion_intensity: 8, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "button", fallback_provided: true },
    license: { source_repository: "https://github.com/design-agent-wiki", license_type: "MIT", author: "Machine-First Design Agent Wiki", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "comparative-bar-list": {
    title: "Comparative Bar List",
    description: "Analytical proportional bar list displaying categorical metrics with value formatting.",
    category: "ui:editorial",
    tags: ["editorial", "metrics", "bar-chart", "analytical", "tremor"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 8 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/tremorlabs/tremor", license_type: "Apache-2.0", author: "Tremor Labs", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "tracker-status-strip": {
    title: "Tracker Status Strip",
    description: "Segmented uptime and agent activity status strip with colored state blocks and tooltips.",
    category: "ui:editorial",
    tags: ["editorial", "status", "uptime", "kpi", "tremor"],
    dials: { design_variance: 3, motion_intensity: 2, visual_density: 8 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/tremorlabs/tremor", license_type: "Apache-2.0", author: "Tremor Labs", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "agent-inspector-drawer": {
    title: "Agent Inspector Drawer",
    description: "Slide-out inspection drawer for agent execution steps, tool call parameters, and runtime payloads.",
    category: "ui:workflow",
    tags: ["workflow", "drawer", "inspector", "agent-ui", "debug"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "dialog", fallback_provided: true },
    license: { source_repository: "https://github.com/design-agent-wiki", license_type: "MIT", author: "Machine-First Design Agent Wiki", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "workflow-minimap-controls": {
    title: "Workflow Minimap Controls",
    description: "Floating viewport toolbar with zoom in/out, fit-view, and canvas reset controls.",
    category: "ui:workflow",
    tags: ["workflow", "minimap", "zoom", "canvas", "xyflow"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "toolbar", fallback_provided: true },
    license: { source_repository: "https://github.com/xyflow/xyflow", license_type: "MIT", author: "webkid / xyflow", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "toast-notification-center": {
    title: "Toast Notification Center",
    description: "Accessible WAI-ARIA live region toast stacker with swipe-to-dismiss, action buttons, progress timer, and zero layout shift.",
    category: "ui:primitive",
    tags: ["toast", "notification", "alert", "live-region", "a11y", "react-hot-toast", "gui-challenges"],
    dials: { design_variance: 3, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "status", fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/timolins/react-hot-toast", license_type: "MIT", author: "Timo Lins & Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "segmented-control-slider": {
    title: "Segmented Control Slider",
    description: "Accessible segmented control switch with sliding spring indicator, arrow-key roving focus, and ARIA radiogroup roles.",
    category: "ui:primitive",
    tags: ["segmented-control", "switch", "radiogroup", "roving-focus", "gui-challenges", "primer"],
    dials: { design_variance: 4, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "radiogroup", fallback_provided: true },
    license: { source_repository: "https://github.com/argyleink/gui-challenges", license_type: "Apache-2.0", author: "Adam Argyle & Chrome Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "circular-value-slider": {
    title: "Circular Value Slider",
    description: "Accessible SVG circular dial with drag interaction, keyboard step increment, precision readout, and dynamic arc calculation.",
    category: "ui:primitive",
    tags: ["circular-slider", "dial", "radial", "gauge", "touch", "gui-challenges", "cloudscape"],
    dials: { design_variance: 6, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "slider", fallback_provided: true },
    license: { source_repository: "https://github.com/argyleink/gui-challenges", license_type: "Apache-2.0", author: "Adam Argyle & Chrome Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "resource-inventory-list": {
    title: "Resource Inventory List",
    description: "High-density e-commerce / admin resource table with bulk checkbox selection, status badges, contextual filter chips, and pagination.",
    category: "ui:editorial",
    tags: ["table", "inventory", "ecommerce", "admin", "polaris", "antd", "b2b"],
    dials: { design_variance: 3, motion_intensity: 2, visual_density: 9 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "table", fallback_provided: true },
    license: { source_repository: "https://github.com/Shopify/polaris", license_type: "MIT", author: "Shopify Polaris Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "pricing-tier-feature-matrix": {
    title: "Pricing Tier Feature Matrix",
    description: "Multi-tier plan comparator with monthly/annual billing cycle toggle, feature breakdown list with tooltips, and highlighted tier callout.",
    category: "ui:block",
    tags: ["pricing", "billing", "matrix", "saas", "landing", "launch-ui", "page-ui"],
    dials: { design_variance: 6, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/launch-ui/launch-ui", license_type: "MIT", author: "Launch UI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "faceted-filter-bar": {
    title: "Faceted Filter Bar",
    description: "Multi-select filter chips with active tag count, clear all action, popover dropdowns, and keyboard navigation.",
    category: "ui:primitive",
    tags: ["filter", "facets", "toolbar", "chips", "reui", "shark-ui", "cloudscape"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "toolbar", fallback_provided: true },
    license: { source_repository: "https://github.com/keenthemes/reui", license_type: "MIT", author: "ReUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "spatial-canvas-hud": {
    title: "Spatial Canvas HUD",
    description: "Floating viewport HUD overlay with zoom level slider, pan reset, snapping grid toggle, and layer management.",
    category: "ui:workflow",
    tags: ["canvas", "hud", "viewport", "zoom", "tldraw", "xyflow", "spatial"],
    dials: { design_variance: 7, motion_intensity: 4, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/tldraw/tldraw", license_type: "Apache-2.0", author: "tldraw team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "halftone-matrix-card": {
    title: "Halftone Matrix Card",
    description: "Interactive canvas halftone dither card reacting to mouse position with customizable dot pitch and reduced-motion fallback.",
    category: "ui:creative",
    tags: ["canvas", "dither", "halftone", "shaders", "matrix", "paper-shaders", "react-bits"],
    dials: { design_variance: 8, motion_intensity: 7, visual_density: 5 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://github.com/paper-design/shaders", license_type: "Apache-2.0", author: "Paper Design Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "progress-wizard-stepper": {
    title: "Progress Wizard Stepper",
    description: "Accessible multi-step workflow stepper with status icons (completed, active, upcoming, error), step descriptions, and form navigation.",
    category: "ui:primitive",
    tags: ["stepper", "wizard", "progress", "navigation", "primer", "cloudscape", "heroui"],
    dials: { design_variance: 4, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "navigation", fallback_provided: true },
    license: { source_repository: "https://github.com/primer/react", license_type: "MIT", author: "GitHub Primer Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "bento-spotlight-card": {
    title: "Bento Spotlight Card",
    description: "Bento card featuring radial spotlight glow following pointer coordinates, border beam accent, and subtle hover scale.",
    category: "ui:block",
    tags: ["bento", "spotlight", "glow", "card", "landing", "aceternity", "magicui"],
    dials: { design_variance: 6, motion_intensity: 5, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/aceternity/ui", license_type: "MIT", author: "Manu Arora & Community", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "voice-call-session-hud": {
    title: "Voice Call Session HUD",
    description: "Real-time AI voice agent call overlay with live audio reactive ring, turn-taking status indicators, interrupt controls, and transcript drawer.",
    category: "ui:ai-native",
    tags: ["voice-agent", "webrtc", "audio-hud", "ai-native", "turn-taking", "interruption"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ai-prompt-diff-comparator": {
    title: "AI Prompt Diff Comparator",
    description: "Word-level side-by-side prompt version comparator with visual diff highlighting, chunk merge controls, and token cost breakdown.",
    category: "ui:ai-native",
    tags: ["prompt-engineering", "diff-viewer", "token-cost", "ai-native", "merge-controls"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "context-window-budget-pruner": {
    title: "Context Window Budget Pruner",
    description: "Interactive context window token pruner and compressor allowing selective pruning across system prompts, tools, and chat memory.",
    category: "ui:ai-native",
    tags: ["token-budget", "context-window", "compression", "ai-native", "memory-pruner"],
    dials: { design_variance: 5, motion_intensity: 3, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "light-rays-ambient-shader": {
    title: "Light Rays Ambient Shader",
    description: "GPU-accelerated volumetric light rays and caustic ambient backdrop with cursor tracking and reduced-motion fallback.",
    category: "ui:creative",
    tags: ["canvas", "webgl", "volumetric", "light-rays", "shaders", "creative"],
    dials: { design_variance: 8, motion_intensity: 7, visual_density: 3 },
    a11y: { keyboard_navigable: false, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://paper.design", license_type: "Apache-2.0", author: "Paper Shaders Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "ascii-dithering-canvas-converter": {
    title: "ASCII Dithering Canvas Converter",
    description: "Canvas WebGL shader converting text, imagery, or live video into retro ASCII characters and Floyd-Steinberg dithering.",
    category: "ui:creative",
    tags: ["ascii", "dithering", "canvas", "matrix", "creative", "floyd-steinberg"],
    dials: { design_variance: 8, motion_intensity: 6, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "React Bits Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "publication-citation-modal": {
    title: "Publication Citation Modal",
    description: "Accessible academic citation modal supporting BibTeX, APA, IEEE, MLA, and RIS formats with instant copy and file download.",
    category: "ui:editorial",
    tags: ["academic", "citation", "bibtex", "modal", "editorial", "research"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "dialog", fallback_provided: true },
    license: { source_repository: "https://hugoblox.com", license_type: "MIT", author: "HugoBlox Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "interactive-glossary-hover-card": {
    title: "Interactive Glossary Hover Card",
    description: "Inline technical term lookup card with accessible popover definition, related taxonomy tags, and keyboard navigable drawer.",
    category: "ui:editorial",
    tags: ["glossary", "hover-card", "popover", "editorial", "documentation", "a11y"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 7 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://design-wiki.dev", license_type: "MIT", author: "Design Wiki Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "spatial-lasso-selection-tool": {
    title: "Spatial Lasso Selection Tool",
    description: "Spatial canvas freeform lasso selection tool with multi-node bounding-box alignment actions, grouping, and export controls.",
    category: "ui:workflow",
    tags: ["canvas", "spatial", "lasso", "selection", "workflow", "excalidraw"],
    dials: { design_variance: 6, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "toolbar", fallback_provided: true },
    license: { source_repository: "https://excalidraw.com", license_type: "MIT", author: "Excalidraw Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "interactive-teleprompter-deck": {
    title: "Interactive Teleprompter Deck",
    description: "Smooth speech-paced scrolling teleprompter with adjustable WPM speed slider, font scale controller, and mirror mode toggle.",
    category: "ui:media",
    tags: ["video", "teleprompter", "speech", "media", "remocn", "player"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://remocn.dev", license_type: "MIT", author: "Remocn Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "view-transition-page-morph": {
    title: "View Transition Page Morph",
    description: "React 19 / Next.js View Transition coordinator primitive supporting seamless element morphs and layout transitions with cross-browser fallback.",
    category: "ui:motion",
    tags: ["view-transition", "react-19", "page-morph", "motion/react", "spring-physics"],
    dials: { design_variance: 6, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://beui.dev", license_type: "MIT", author: "beUI Team", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "safari-browser-mockup": {
    title: "Safari Browser Mockup",
    description: "Responsive macOS Safari browser window wrapper with dark/light chrome, search URL omnibox, and viewport slot.",
    category: "ui:block",
    tags: ["mockup", "browser", "safari", "window", "launch-ui", "magic-ui", "showcase"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://launch-ui.com", license_type: "MIT", author: "Launch UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "mobile-app-frame-mockup": {
    title: "Mobile App Frame Mockup",
    description: "Smartphone chassis container with dynamic island, glass highlight, status bar, and mobile viewport slot.",
    category: "ui:block",
    tags: ["mobile", "mockup", "iphone", "smartphone", "launch-ui", "showcase", "viewport"],
    dials: { design_variance: 4, motion_intensity: 2, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://launch-ui.com", license_type: "MIT", author: "Launch UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "two-by-two-prioritization-matrix": {
    title: "2×2 Prioritization Matrix",
    description: "Interactive 2x2 quadrant matrix (Impact vs Effort, Urgency vs Importance) with interactive pins and threshold lines.",
    category: "ui:editorial",
    tags: ["diagram", "matrix", "prioritization", "2x2", "impact-effort", "diagram-design"],
    dials: { design_variance: 6, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://github.com/cathrynlavery/diagram-design", license_type: "MIT", author: "Cathryn Lavery", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "strategy-canvas-value-curve": {
    title: "Strategy Canvas Value Curve",
    description: "Blue Ocean Strategy value curve comparison diagram plotting competitor performance against industry factors.",
    category: "ui:editorial",
    tags: ["diagram", "strategy", "value-curve", "blue-ocean", "comparison", "diagram-design"],
    dials: { design_variance: 6, motion_intensity: 3, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://github.com/cathrynlavery/diagram-design", license_type: "MIT", author: "Cathryn Lavery", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "multi-step-agent-loader": {
    title: "Multi-Step Agent Loader",
    description: "Stepped progression card for long-running AI workflows with live step verification states and latency timers.",
    category: "ui:ai-native",
    tags: ["ai", "loader", "stepper", "agent", "kokonutui", "aceternity", "progress"],
    dials: { design_variance: 5, motion_intensity: 4, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "status", screen_reader_ready: true, fallback_provided: true },
    license: { source_repository: "https://kokonutui.com", license_type: "MIT", author: "KokonutUI & Aceternity", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "laser-flow-border-card": {
    title: "Laser Flow Border Card",
    description: "Card with continuous directional laser pulse border animation using SVG and CSS conic gradients with reduced-motion fallback.",
    category: "ui:creative",
    tags: ["creative", "laser", "border", "card", "cult-ui", "glow", "conic-gradient"],
    dials: { design_variance: 7, motion_intensity: 6, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://cult-ui.com", license_type: "MIT", author: "Cult UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "true-focus-text": {
    title: "True Focus Text",
    description: "Kinetic typography effect where words snap into crisp focus sequentially or via cursor hover.",
    category: "ui:motion",
    tags: ["motion", "text", "focus", "kinetic", "react-bits", "typography", "blur"],
    dials: { design_variance: 6, motion_intensity: 5, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true, reduced_motion_supported: true },
    license: { source_repository: "https://reactbits.dev", license_type: "MIT", author: "DavidHDev", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "dynamic-island-telemetry": {
    title: "Dynamic Island Telemetry",
    description: "Morphing floating status pill that expands from a compact badge into a full agent token and latency HUD.",
    category: "ui:motion",
    tags: ["motion", "telemetry", "dynamic-island", "smoothui", "hud", "status-pill"],
    dials: { design_variance: 7, motion_intensity: 5, visual_density: 6 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, wai_aria_role: "region", fallback_provided: true },
    license: { source_repository: "https://smoothui.dev", license_type: "MIT", author: "SmoothUI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["lucide-react", "clsx", "tailwind-merge"],
    registryDependencies: [],
  },
  "lamp-section-header": {
    title: "Lamp Section Header",
    description: "Conical spotlight lamp header effect with gradient light beam pouring down over titles and subtitles.",
    category: "ui:block",
    tags: ["hero", "header", "lamp", "spotlight", "aceternity", "glow", "gradient"],
    dials: { design_variance: 8, motion_intensity: 5, visual_density: 5 },
    a11y: { keyboard_navigable: true, wai_aria_compliant: true, fallback_provided: true },
    license: { source_repository: "https://ui.aceternity.com", license_type: "MIT", author: "Aceternity UI", attribution_required: true, redistribution_mode: "full_source" },
    dependencies: ["clsx", "tailwind-merge"],
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

function safeWriteFileSync(filePath: string, content: string, retries = 5, delayMs = 30): void {
  for (let i = 0; i < retries; i++) {
    try {
      fs.writeFileSync(filePath, content, "utf-8");
      return;
    } catch (err: unknown) {
      if (i === retries - 1) throw err;
      const end = Date.now() + delayMs;
      while (Date.now() < end) {}
    }
  }
}

    // Serialize individual item JSON (with escaped JSX/TSX source strings)
    const itemJson = JSON.stringify(registryItem, null, 2);
    safeWriteFileSync(path.join(distRDir, `${slug}.json`), itemJson);
    safeWriteFileSync(path.join(docsRDir, `${slug}.json`), itemJson);

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

    safeWriteFileSync(path.join(docsRawComponentsDir, `${slug}.md`), markdownDoc);

    console.log(`  ✓ Compiled [${registryItem.category}]: ${slug}.json + ${slug}.md (Complexity: ${registryItem.complexity}, Deps: ${registryItem.dependencies.length})`);
  }

  // Write master registry.json
  const registryJson = JSON.stringify(allRegistryItems, null, 2);
  safeWriteFileSync(path.join(distRDir, "registry.json"), registryJson);
  safeWriteFileSync(path.join(docsRDir, "registry.json"), registryJson);

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

  safeWriteFileSync(path.join(docsPublicDir, "llms.txt"), llmsTxt);

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

  safeWriteFileSync(path.join(docsPublicDir, "llms-full.txt"), llmsFullTxt);

  console.log(`\n🎉 Registry Build Complete! Compiled ${allRegistryItems.length} components.`);
  console.log(`📁 Artifacts generated:`);
  console.log(`   - ${distRDir}/registry.json`);
  console.log(`   - ${docsRDir}/registry.json`);
  console.log(`   - ${docsPublicDir}/llms.txt`);
  console.log(`   - ${docsPublicDir}/llms-full.txt`);
}

main();
