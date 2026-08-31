we must transition from a human-centric library system to a structured metadata pipeline. AI agents do not search libraries the way humans do; they require clear classification tags, explicit runtime dependencies, and precise structural markers to select the correct code templates and insert them cleanly into the local environment [46].
Here is a detailed blueprint on how to categorise and tag specific components from the diverse libraries in your notebook, followed by the technical steps to automate this ingestion and indexing pipeline.
1. The Standardised Taxonomy Framework
To prevent AI agents from writing unstyled, boilerplate layouts, we categorise the 60+ component libraries in your notebook into a unified, multi-dimensional taxonomy. This categorization is divided into Categories (defining the component's functional class) and Tags (representing its technical stack and layout style).
A. Taxonomy Categories (category)
ui:primitive: Highly accessible, robust, interactive UI controls optimized for standard SaaS forms and navigation.
Core Examples: HeroUI (Previously NextUI) [23, 39], Shark UI [32, 49], daisyUI [31, 59], and franken-ui [22].
ui:motion: Components emphasizing micro-interactions, spring animations, and smooth transitions built using Framer Motion.
Core Examples: motion-primitives [24], SmoothUI [21, 51], KokonutUI [26, 40], and Groot Studio [16, 38].
ui:creative: High-fidelity components utilizing canvas elements, interactive WebGL shaders, or GPU-driven backdrops.
Core Examples: ThreeUI [13, 53], Canvas UI [3, 9], and react-bits [10, 42].
ui:editorial: Pure, static, and highly informative visual blocks designed for analytical or editorial presentation, completely free of generic decorative clutter.
Core Examples: diagram-design [19].
ui:block: Complete, multi-component page templates, marketing sections, or structural dashboard modules.
Core Examples: Tailark [34, 52], Kairo UI [6], and Shadcn blocks [47, 48].
ui:media: Advanced, timeline-based motion and video compositions.
Core Examples: Remocn [15, 44].
ui:utility: Fast, optimized assets and utility micro-systems.
Core Examples: icons0 [64].
B. Technical and Aesthetic Tags (tags)
Tags allow the AI agent to instantly pre-configure its build stack and cross-reference dependencies before installing a component:
Core Dependencies: framer-motion, threejs, radix-primitives, ark-ui, tailwind-v4, lucide-react, canvas-confetti.
Visual Aesthetics: minimalist, brutalist, neon-scifi (e.g., NeonBlade UI [36, 41]), playful (e.g., Evil-Buttons [30, 54]), bento-grid, glassmorphism.
Accessibility Ratings: wai-aria-compliant, headless, keyboard-accessible.
2. Component Metadata Contract (YAML Frontmatter)
Each component page in the Wiki repository should be documented as an .md or .mdx file [60]. Below is a comparative look at how we format metadata for a high-end WebGL interactive component vs. a clean, highly accessible primitive.
Example A: WebGL Creative Component
---
id: "canvas-fluid-wave"
name: "Canvas Fluid Wave"
category: "ui:creative"
library_origin: "Canvas UI"
dependencies:
  - "three"
  - "motion/react"
tags:
  - "webgl"
  - "threejs"
  - "canvas"
  - "mouse-tracker"
dials:
  design_variance: 8      # High visual experimentation
  motion_intensity: 9     # Coordinated shader/mouse interaction
  visual_density: 3       # Open, decorative spatial ratio
a11y:
  keyboard_navigable: false
  fallback_provided: true # Degrades into a clean CSS gradient if WebGL fails
---
Example B: Accessible Input Primitive
---
id: "accessible-search-bar"
name: "Search Bar Input"
category: "ui:primitive"
library_origin: "Shark UI"
dependencies:
  - "@ark-ui/react"
  - "lucide-react"
tags:
  - "ark-ui"
  - "tailwind-v4"
  - "headless"
  - "wai-aria-compliant"
dials:
  design_variance: 2      # Conservative, standard layout
  motion_intensity: 2     # Micro-hover changes only
  visual_density: 7       # Grid-aligned, highly structured SaaS layout
a11y:
  keyboard_navigable: true
  wai_aria_role: "searchbox"
---
3. How to Achieve This: The Automated Ingestion Pipeline
To scale this wiki across dozens of library repositories, we do not write these metadata files manually. We construct a three-step ingestion pipeline to programmatically discover, parse, and tag incoming components [60].
[Cloned Repository Files] 
       │
       ▼
 [Step 1: AST Parser] ──► (Scans code for imports, tags, & complexity)
       │
       ▼
 [Step 2: Taste Audit] ──► (Evaluates design dials & checks for visual slop)
       │
       ▼
 [Step 3: Registry Compiler] ──► (Outputs llms.txt, raw/ markdown, & r/ registry.json)
Step 1: Abstract Syntax Tree (AST) Parsing (Static Code Analysis)
Using a Node.js parser script (compiled via the TypeScript Compiler API or standard regex scanning), we inspect the source code of the incoming component:
Extract Core Imports: Read import headers. If the file imports motion or framer-motion, auto-inject framer-motion into the metadata tag list. If it references THREE.WebGLRenderer, auto-inject webgl and threejs.
Determine Primitives: Look for Radix or Ark UI bindings (e.g. @radix-ui/react-dialog). If present, tag the component as headless and automatically append the primitive to registryDependencies in the registry index [60].
Complexity Scorer: Compute the file's architectural density. If the file contains custom canvas mathematical loops or is >350 lines, mark it as complexity: high; if it contains simple Tailwind utility classes under 80 lines, mark it as complexity: low.
Step 2: Automated Taste Auditing & Dial Assignment
To score components on our Taste Dials (Design Variance, Motion Intensity, Visual Density) and filter out visual slop [46]:
CSS Analysis: Scan classes for tells like arbitrary pixel offsets (e.g., p-[17px]), decorative emojis, or raw unshaded backgrounds.
LLM Enrichment Prompt: Pipe the code and component documentation through a lightweight, automated LLM review script. The LLM evaluates the code's visual intent against our design rules and returns a standardized JSON block mapping the specific 1-10 dial ratings.
Step 3: Registry Compilation & Formatting
The pipeline automatically compiles the extracted metadata into our dual interfaces:
Programmatic Registry (/r/): Escapes the source code into a flat string, bundles npm dependencies, and appends the file array to /public/r/[name].json for CLI installations [60].
Raw Markdown Interface (/raw/): Generates structured .md documentation files (pre-populated with YAML frontmatter) and places them under the raw paths defined in the /public/llms.txt index [60].
4. Categorisation Mapping of Your Key Libraries
Based on the library files in your notebook, here is how the central database categorizes and maps several core repositories:
Library Source
Primary Category
Primary Technical Tags
Aesthetic Dials (Variance / Motion / Density)
Aceternity UI [1]
ui:motion
framer-motion, tailwind-v4, micro-interaction
Var: 6 · Mot: 8 · Den: 4
Canvas UI [3, 9]
ui:creative
threejs, webgl, framer-motion, interactive
Var: 9 · Mot: 9 · Den: 3
diagram-design [19]
ui:editorial
svg, zero-dependency, static, analytical
Var: 5 · Mot: 1 · Den: 9
HeroUI v3 [23, 39]
ui:primitive
react, tailwind-v4, headless, accessible
Var: 3 · Mot: 3 · Den: 6
Evil-Buttons [30, 54]
ui:motion
playful, framer-motion, sound-physics
Var: 8 · Mot: 7 · Den: 5
SmoothUI [21, 51]
ui:motion
framer-motion, shadcn-compatible, spring-physics
Var: 4 · Mot: 6 · Den: 5
Tailark [34, 52]
ui:block
tailwind-v4, marketing, bento-grid
Var: 5 · Mot: 4 · Den: 6
This structured model ensures that when an AI coding agent accesses your wiki, it reads precise indexes, pre-empts dependency installation, respects accessibility constraints, and implements tasteful, modern interfaces effortlessly [46].