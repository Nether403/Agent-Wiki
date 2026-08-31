# AI-Assisted Web Design: Curated GitHub Gem Catalogue

**Prepared by:** Manus AI  
**Research date:** 30 August 2026  
**Scope:** Agent skills, UI component systems, visual/reference-to-code tools, interaction libraries, design-system infrastructure, visual assets, and quality gates for AI-assisted web design.

## Executive assessment

The strongest AI-assisted web-design stack is **not** a single UI generator. It combines a design-direction skill, a code-owned component foundation, a token system, and automated visual/accessibility review. Agent skills provide repeatable design judgement and process; component libraries constrain implementation; and testing tools keep fast AI output from quietly creating regressions. Anthropic’s skill model frames skills as reusable folders of instructions, scripts, and resources, while Vercel, Anthropic, and independent authors supply specialised web-design playbooks. [1] [2] [3] [4]

> **Recommended starting stack for a React/Next.js product:** an aesthetic-direction skill (Anthropic Frontend Design or UI UX Pro Max), **shadcn/ui** plus **Radix**, **Style Dictionary** for durable tokens, then **Storybook**, **Playwright**, **axe-core**, and **Lighthouse** as release gates. This gives an AI agent useful freedom within explicit system constraints. [2] [4] [7] [8] [9] [10] [11]

The catalogue below reflects wide research across eight independent tracks. A concurrent metadata review covered 60 repositories; 56 resolved to valid public projects and were screened for adoption, activity, explicit licensing, documentation, and direct relevance. **Stars and last-push signals are only screening indicators**, not proof of suitability, security, accessibility, or future maintenance.

![Breadth and recent activity by category](https://private-us-east-1.manuscdn.com/sessionFile/dAAPUDsS2RKN4PPdu92mo1/sandbox/swWn3zHAhImMQSk5ed1DTX-images_1788119266470_na1fn_L2hvbWUvdWJ1bnR1L2dpdGh1Yl93ZWJfZGVzaWduX2dlbXNfY2F0ZWdvcnlfY2hhcnQ.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZEFBUFVEc1MyUktONFBQZHU5Mm1vMS9zYW5kYm94L3N3V24zekhBaEltTVFTazVlZDFEVFgtaW1hZ2VzXzE3ODgxMTkyNjY0NzBfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyZHBkR2gxWWw5M1pXSmZaR1Z6YVdkdVgyZGxiWE5mWTJGMFpXZHZjbmxmWTJoaGNuUS5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3ODk0MzA0MDB9fX1dfQ__&Key-Pair-Id=K2QY5QTL8JSY6C&Signature=MEYCIQCEppZ2lBRR3OWZvB9POx4~C7RshAdKS-lVg6v3jyzdzwIhAPA1GLK5~1EP-uBAXZlxiMtZSIunOc~boLzpTx8T5cRq)

## How to read this catalogue

| Label | Meaning | Selection guidance |
|---|---|---|
| **Foundation** | A broadly proven building block with a clear role in long-lived product work. | Prefer this tier for a production baseline. |
| **Strong fit** | A high-quality solution with a focused advantage, framework preference, or narrower scope. | Add where it solves a specific design or workflow need. |
| **Specialist / emerging** | Useful for a particular visual pattern, workflow, or experimental project. | Validate API stability, licensing, and bundle/performance impact before standardising. |

## The short list: twelve gems to adopt first

| Priority | Gem | Why it earns a place | Best use |
|---:|---|---|---|
| 1 | [Anthropic Frontend Design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | Official design skill aimed at distinctive, production-grade interfaces rather than generic AI aesthetics. | Give a coding agent a clear visual-design mandate. |
| 2 | [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design intelligence, web-design starter stack, responsive/a11y audit workflow, examples, and CI-oriented review patterns. | Full design loop: plan, build, screenshot, review, improve. |
| 3 | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Includes web-design guidelines, React best practices, composition patterns, view transitions, and performance skills. | Guardrails for React/Next.js agents. |
| 4 | [shadcn/ui](https://github.com/shadcn-ui/ui) | Customisable component source and registry approach; code lives in your project rather than behind a black-box dependency. | Establish a project-owned component system. |
| 5 | [Radix Primitives](https://github.com/radix-ui/primitives) | Accessible, unstyled primitives that make bespoke visual design safer. | Custom design systems requiring robust interactions. |
| 6 | [Style Dictionary](https://github.com/style-dictionary/style-dictionary) | Converts a central token source into platform outputs, helping an agent remain visually consistent. | Cross-platform tokens and a durable design language. |
| 7 | [Storybook](https://github.com/storybookjs/storybook) | Isolated component workshop for building, documenting, and testing states. | Make generated UI reviewable and maintainable. |
| 8 | [Playwright](https://github.com/microsoft/playwright) | Cross-browser automation and screenshot testing through a single API. | Validate flows, responsive layouts, and visual baselines. |
| 9 | [axe-core](https://github.com/dequelabs/axe-core) | Automated accessibility engine that integrates with existing test environments. | Catch common a11y failures before review. |
| 10 | [Screenshot-to-Code](https://github.com/abi/screenshot-to-code) | Converts screenshots, mockups, Figma designs, and recordings into functional frontend code. | Fast reference implementation or prototyping, not blind production copying. |
| 11 | [Magic UI](https://github.com/magicuidesign/magicui) | Open copy-paste animated components and effects for higher-fidelity marketing surfaces. | Add intentional, selective visual polish. |
| 12 | [Lucide](https://github.com/lucide-icons/lucide) | Consistent, developer-friendly icon system with broad framework support. | Avoid inconsistent or improvised iconography. |

## 1. Agent skills and design-direction playbooks

The first category controls **how an agent thinks about interface design**. The official Frontend Design plugin explicitly targets bold, deliberate aesthetics, typography, colour, motion, and context-aware implementation. [2] Vercel’s collection couples web-design guidelines with React, composition, optimisation, and transition guidance. [3] For richer visual workflows, MengTo’s skills can turn video references into prompts, extract reusable interaction descriptions from HTML, capture whole landing pages, and assemble inspiration loops. [5]

| Tier | GitHub gem | What it contributes | Use it when |
|---|---|---|---|
| **Foundation** | [Anthropic Frontend Design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | Official skill for distinctive, production-oriented frontend design. | Your agent tends to produce bland, repetitive interfaces. |
| **Foundation** | [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Web design guidelines, React best practices, composition patterns, view transitions, optimisation, deployment. | You build React/Next.js applications and want practical code guardrails. |
| **Foundation** | [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design intelligence, component/design-system guidance, audit workflow, examples, and design-review scaffolding. | You want an agent to work through a repeatable design-and-review process. |
| **Strong fit** | [MengTo/Skills](https://github.com/MengTo/Skills) | Visual-reference capture, video-to-prompt, landing-page recreation, interaction-prompt workflows, and designer-oriented agent skills. | You design from visual inspiration, screen recordings, or existing pages. |
| **Strong fit** | [plugin87 UX/UI Agent Skills](https://github.com/plugin87/ux-ui-agent-skills) | DTCG tokens, design-system coverage, accessibility emphasis, and structured UI skills. | You want a single design-architecture starter set; verify its licence before reuse. |
| **Strong fit** | [Designer Skills](https://github.com/julianoczkowski/designer-skills) | Process-oriented skills for prototyping and building with AI coding tools. | Your agent needs a design process, not simply a component list. |
| **Strong fit** | [Interface Skills](https://github.com/jakubkrehel/skills) | Interface, typography, colour, accessibility, layout, and product-writing guidance. | You want compact, modular UI quality guidance. |
| **Reference** | [Anthropic Skills](https://github.com/anthropics/skills) | Skill structure examples and patterns for self-contained instruction/resource packs. | You are authoring your own portable design skills. |
| **Discovery** | [Awesome AI Tools for UI](https://github.com/maxbogo/awesome-ai-tools-for-ui) | A curated discovery index of UI-specific skills, apps, MCPs/plugins, design tools, and learning resources. | You need a current lead list rather than a production dependency. |

## 2. Component libraries and accessible primitives

This is the most important category for keeping generated code **coherent, accessible, and maintainable**. shadcn/ui defines itself as customisable component source and a distribution platform intended to help teams build their own library. [7] Radix and React Spectrum are strong options when visual direction must be entirely bespoke but interactions cannot be improvised. [8] For faster, opinionated application delivery, choose a full library whose visual language suits the product rather than attempting to mix several broad UI systems.

| Tier | GitHub gem | Style / framework fit | Best contribution |
|---|---|---|---|
| **Foundation** | [shadcn/ui](https://github.com/shadcn-ui/ui) | React; Tailwind-friendly; source copied into your codebase. | Project-owned, accessible components and registries; excellent AI-agent target. |
| **Foundation** | [Radix Primitives](https://github.com/radix-ui/primitives) | React; unstyled/headless. | Robust accessible behaviours beneath a custom visual system. |
| **Foundation** | [Headless UI](https://github.com/tailwindlabs/headlessui) | React and Vue; Tailwind-aligned; unstyled. | Accessible building blocks with a Tailwind-first workflow. |
| **Foundation** | [React Spectrum / React Aria](https://github.com/adobe/react-spectrum) | React; accessibility-forward ecosystem. | Adaptive accessible components, hooks, and interaction infrastructure. |
| **Foundation** | [Ariakit](https://github.com/ariakit/ariakit) | React; accessible components and hooks. | Detailed ARIA-driven components for bespoke designs. |
| **Strong fit** | [Ark UI](https://github.com/chakra-ui/ark) | React, Vue, Solid, Svelte; headless. | Multi-framework accessible primitives; useful for teams beyond React. |
| **Foundation** | [MUI](https://github.com/mui/material-ui) | React; Material Design implementation. | Mature application and dashboard components with a clear visual language. |
| **Foundation** | [Ant Design](https://github.com/ant-design/ant-design) | React; enterprise-oriented system. | Data-heavy admin, internal, and B2B screens with deep component coverage. |
| **Foundation** | [Chakra UI](https://github.com/chakra-ui/chakra-ui) | React; accessible component system. | Fast SaaS and application building with composable primitives. |
| **Foundation** | [Mantine](https://github.com/mantinedev/mantine) | React; full component and hooks library. | Product teams wanting rich components, hooks, and theming. |
| **Strong fit** | [HeroUI](https://github.com/heroui-inc/heroui) | React; modern visual system; successor to NextUI. | Attractive app interfaces with accessible components and themes. |
| **Strong fit** | [PrimeReact](https://github.com/primefaces/primereact) | React; broad component catalogue. | Feature-rich data and enterprise application interfaces. |
| **Foundation** | [daisyUI](https://github.com/saadeghi/daisyui) | Tailwind CSS; semantic utility classes and themes. | Very fast themed prototypes and simpler production sites. |
| **Strong fit** | [Tremor](https://github.com/tremorlabs/tremor) | React; Tailwind; dashboard focus. | Analytics dashboards, metrics, cards, and data presentation. |
| **Strong fit** | [TailGrids](https://github.com/Tailgrids/tailgrids) | React and Tailwind. | Production-oriented components and templates for websites, dashboards, SaaS, and landing pages. |

## 3. Visual development and design-to-code

Visual/reference-to-code tools are valuable **accelerators**, not final arbiters of quality. Screenshot-to-Code supports screenshots, mockups, Figma designs and recordings, with outputs including HTML/CSS/Tailwind, React, Vue, Bootstrap, and Ionic/Tailwind. [6] Treat its output as a rapidly generated first implementation: refactor it into your tokens and components, review content and licensing, then test it semantically and accessibly.

| Tier | GitHub gem | What it does | Important constraint |
|---|---|---|---|
| **Foundation** | [Screenshot-to-Code](https://github.com/abi/screenshot-to-code) | Turns screenshots, mockups, Figma inputs, and recordings into functional frontend implementations. | Rebuild generated code around your own components and semantics before release. |
| **Strong fit** | [FigmaToCode](https://github.com/bernaferrari/FigmaToCode) | Generates editable responsive pages/apps from Figma into HTML, Tailwind, Flutter, and SwiftUI. | GPL-licensed; carefully assess licence obligations for your usage model. |
| **Strong fit** | [Builder.io](https://github.com/BuilderIO/builder) | Visual development connected to existing React, Vue, Svelte, Qwik, and related component systems. | Best where a visual-editing workflow is an explicit product or content-team need. |
| **Strong fit** | [Webstudio](https://github.com/webstudio-is/webstudio) | Open-source visual website builder and Webflow alternative with headless-CMS support. | AGPL-licensed; evaluate deployment and source-disclosure implications. |
| **Specialist** | [Chai Builder](https://github.com/chaibuilder/core) | Embeddable React-oriented website-builder SDK. | Best for adding visual page composition inside your own product. |
| **Emerging** | [OpenPage](https://github.com/buildingopen/openpage) | AI site generation and visual drag-and-drop editor with JSON-first architecture. | Early-stage; validate maintenance, feature completeness, and deployment posture. |

## 4. Landing-page blocks, visual effects, and interface polish

Landing-page libraries can speed up high-fidelity work, particularly when an agent knows the desired design direction. They should be used **selectively**: a page assembled from every available effect looks generic, hurts performance, and can dilute hierarchy. Page UI offers open React/Next.js templates and components built with Tailwind and states that it currently targets Tailwind v3; plan a compatibility check for Tailwind v4 work. [12]

| Tier | GitHub gem | What it contributes | Use it for |
|---|---|---|---|
| **Foundation** | [Magic UI](https://github.com/magicuidesign/magicui) | Copy-paste animated components and visual effects for React/Tailwind. | High-quality heroes, logos, reveals, data visualisation accents, and CTA moments. |
| **Strong fit** | [Page UI](https://github.com/PageAI-Pro/page-ui) | Themeable React/Next.js landing components, templates, demos, and a CLI. | SaaS and marketing pages; confirm its Tailwind version fit. |
| **Strong fit** | [Launch UI](https://github.com/launch-ui/launch-ui) | Copy-paste landing-page kit built around React, shadcn/ui, and Tailwind. | Launch pages that should share your shadcn conventions. |
| **Strong fit** | [Animata](https://github.com/codse/animata) | Copy-paste interaction and animation patterns. | Small, purposeful moments of delight and microinteractions. |
| **Strong fit** | [Paper Shaders](https://github.com/paper-design/shaders) | Customisable, zero-dependency canvas shaders and background effects. | Differentiated brand atmospheres; budget GPU and mobile performance. |
| **Reference** | [GUI Challenges](https://github.com/argyleink/gui-challenges) | Accessible, responsive, adaptive, cross-browser component implementations. | Learning from carefully executed interaction and CSS patterns. |

## 5. Motion, spatial design, and rich interactive UI

Motion should clarify hierarchy, response, and state—not merely decorate. Motion provides a modern animation library for React and JavaScript; React Three Fiber renders Three.js scenes declaratively in React; and tsParticles provides cross-framework effects such as particles, confetti, and firework backgrounds. [13] [14] [15] Use them sparingly, respect `prefers-reduced-motion`, and profile on lower-powered devices.

| Tier | GitHub gem | What it contributes | Fit |
|---|---|---|---|
| **Foundation** | [Motion](https://github.com/motiondivision/motion) | Modern React/JavaScript animation primitives. | Default choice for UI transitions, gestures, layout motion, and tasteful reveals. |
| **Foundation** | [GSAP](https://github.com/greensock/GSAP) | Mature JavaScript animation platform with strong timeline and scroll capabilities. | Bespoke, timeline-heavy campaigns and interactions; review commercial licensing for certain plugins/use cases. |
| **Strong fit** | [Lenis](https://github.com/darkroomengineering/lenis) | Lightweight smooth-scrolling library for JavaScript, React, and Vue. | Narrative or scroll-led websites; preserve native accessibility and input expectations. |
| **Specialist** | [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | Declarative Three.js renderer in React. | High-value 3D product scenes, portfolios, or brand experiences. |
| **Specialist** | [Drei](https://github.com/pmndrs/drei) | Helpers and abstractions for React Three Fiber. | Faster construction of R3F scenes and interactions. |
| **Strong fit** | [tsParticles](https://github.com/tsparticles/tsparticles) | Configurable animated particles, confetti, and backgrounds across frameworks. | Lightweight celebratory or atmospheric effects when used with restraint. |
| **Strong fit** | [XY Flow](https://github.com/xyflow/xyflow) | React Flow and Svelte Flow for custom node-based interfaces. | Workflow editors, agent graphs, automations, diagrams, and visual builders. |
| **Strong fit** | [Excalidraw](https://github.com/excalidraw/excalidraw) | Hand-drawn-style collaborative whiteboard. | Diagramming, ideation, annotation, and design-collaboration surfaces. |
| **Specialist** | [tldraw](https://github.com/tldraw/tldraw) | SDK for infinite-canvas React applications. | Products that need a deeply integrated canvas or spatial editing interface; inspect licensing terms carefully. |

## 6. Design systems, tokens, and visual governance

Tokens give an agent a controlled vocabulary for colour, typography, spacing, elevation, and motion. Style Dictionary is designed to define styles once and export them into output formats/platforms such as CSS, JavaScript, HTML, iOS, Android, and documentation. [9] Pair it with a component system and design-review workflow so brand decisions become enforceable rather than merely stated in prompts.

| Tier | GitHub gem | Core value | Best fit |
|---|---|---|---|
| **Foundation** | [Style Dictionary](https://github.com/style-dictionary/style-dictionary) | Token transformation and cross-platform distribution. | A canonical design-token source across web and native surfaces. |
| **Strong fit** | [Tokens Studio for Figma](https://github.com/tokens-studio/figma-plugin) | Figma design-token authoring/storage workflow. | Teams that need designer-authored tokens to connect with code. |
| **Foundation** | [Primer React](https://github.com/primer/react) | GitHub’s React implementation of the Primer design system. | Developer tools and dense product UI that benefit from its systematic language. |
| **Foundation** | [Primer CSS](https://github.com/primer/css) | GitHub’s CSS design-system implementation. | CSS/Sass-first projects or reference for system architecture. |
| **Foundation** | [Carbon](https://github.com/carbon-design-system/carbon) | IBM’s broad design system. | Enterprise products requiring a robust, documented system. |
| **Foundation** | [Fluent UI](https://github.com/microsoft/fluentui) | Microsoft’s web utilities, React components, and web components. | Microsoft-aligned or complex productivity interfaces. |
| **Strong fit** | [Cloudscape](https://github.com/cloudscape-design/components) | AWS-originated React components and design system. | Cloud/admin applications where information density and conventions matter. |

## 7. Icon and visual-asset systems

An agent should select icons from **one deliberate visual family** and reuse them consistently. Lucide is a community-maintained, consistent icon toolkit; Iconify aggregates many open icon sets through one framework; Tabler offers a large MIT-licensed SVG set; and Iconoir spans web and design-tool contexts. [16] [17] [18] [19]

| Tier | GitHub gem | Strength | Use it when |
|---|---|---|---|
| **Foundation** | [Lucide](https://github.com/lucide-icons/lucide) | Consistent developer-first SVG icon family with broad ecosystem support. | You use shadcn/ui, React, Vue, Svelte, or a neutral modern icon style. |
| **Foundation** | [Tabler Icons](https://github.com/tabler/tabler-icons) | Large, free MIT SVG set with multi-framework packages. | You need breadth while maintaining a consistent outline style. |
| **Strong fit** | [Iconify](https://github.com/iconify/iconify) | Unified access to hundreds of icon sets. | You need an uncommon brand, product, or domain-specific icon. |
| **Strong fit** | [Iconoir](https://github.com/iconoir-icons/iconoir) | Open icon system with React, Vue, Flutter, Figma, and Framer support. | The design team needs a cross-tool icon workflow. |
| **Strong fit** | [Radix Icons](https://github.com/radix-ui/icons) | Compact interface icon set aligned with Radix ecosystems. | You are already using Radix and favour its UI vocabulary. |
| **Strong fit** | [Heroicons](https://github.com/tailwindlabs/heroicons) | Tailwind Labs’ hand-crafted icon set. | You use Tailwind’s visual ecosystem and want familiar defaults. |

## 8. Visual QA, accessibility, performance, and regression control

AI-generated interfaces should be treated as production candidates only after automated and human review. Storybook describes itself as a frontend workshop for UI components/pages in isolation; axe-core is an accessibility testing engine that can integrate into regular functional test suites; and Lighthouse provides automated performance and web best-practice auditing. [10] [11] [20] These tools complement one another: none certifies a design on its own.

| Tier | GitHub gem | Quality gate it provides | Recommended role |
|---|---|---|---|
| **Foundation** | [Storybook](https://github.com/storybookjs/storybook) | Isolated development, visual documentation, and component-state testing. | Define and inspect every important UI state generated by the agent. |
| **Foundation** | [Playwright](https://github.com/microsoft/playwright) | Cross-browser end-to-end automation and screenshots. | Test responsive flows and set visual baselines in CI. |
| **Foundation** | [axe-core](https://github.com/dequelabs/axe-core) | Automated accessibility analysis. | Run on pages, components, and key workflows; manually review remaining issues. |
| **Foundation** | [Lighthouse](https://github.com/GoogleChrome/lighthouse) | Web performance, best-practice, and audit metrics. | Add performance and quality budgets before deployment. |
| **Strong fit** | [Visual Regression Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker) | Self-hosted screenshot comparison, visual-test management, and history. | Teams that need control over visual-diff data and review. |
| **Specialist** | [BackstopJS](https://github.com/garris/BackstopJS) | Screenshot comparison focused on detecting CSS visual regression. | A legacy but useful project; its most recent push is comparatively old, so prefer actively maintained alternatives for new standardisation. |

## Decision paths: choose a stack without tool sprawl

| Situation | Suggested stack | Why it works |
|---|---|---|
| **New SaaS / dashboard in React** | Anthropic Frontend Design or UI UX Pro Max → shadcn/ui + Radix → Style Dictionary → Storybook + Playwright + axe-core + Lighthouse. | Delivers a controlled system, code ownership, and measurable quality gates. |
| **Marketing site or launch page** | MengTo/Skills → Magic UI or Page UI → Motion / GSAP / Lenis as required → Playwright + Lighthouse. | Starts from a reference/design direction and adds selective rather than indiscriminate polish. |
| **Enterprise admin / data-heavy product** | Vercel Agent Skills → MUI, Ant Design, Mantine, or Carbon → Tremor for analytics → Storybook + axe-core. | Favours information density, component depth, and standardised patterns over bespoke effects. |
| **Custom branded system across multiple frameworks** | UI UX Pro Max → Radix, Ark UI, React Aria, or Ariakit → Tokens Studio + Style Dictionary → Storybook. | Separates accessible behaviour from appearance and makes the token source durable. |
| **Design reference or Figma to working prototype** | Screenshot-to-Code or FigmaToCode → refactor into shadcn/UI primitives + token system → test with axe-core and Playwright. | Speeds implementation while avoiding direct dependence on unreviewed generated markup. |
| **Canvas, agent graphs, or diagram product** | XY Flow, Excalidraw, or tldraw → Motion as needed → Playwright visual flows. | Uses established spatial interaction foundations instead of attempting canvas behaviour from scratch. |
| **Visual content editing for a site** | Builder.io, Webstudio, or Chai Builder → project-owned components + token constraints. | Appropriate when non-engineers genuinely need safe visual assembly—not simply because AI can generate code. |

## Operating principles for AI-assisted design

**Constrain before generating.** Give the agent a design brief, target audience, content hierarchy, token set, component rules, accessibility expectations, and examples of what to avoid. A strong skill and a limited component vocabulary will produce more distinctive, maintainable results than repeatedly prompting a blank canvas.

**Use generated code as a draft, not evidence of correctness.** Screenshot- and Figma-derived code can approximate a visual target but does not automatically convey semantic structure, keyboard interactions, content legitimacy, licensing, responsive intent, or business logic. Preserve the visual idea, then reconstruct it using your own primitives and tokens. [6]

**Build a visual feedback loop.** A productive loop is: define tokens and component constraints; ask the agent to make one coherent page; render at representative viewport widths; review in Storybook; run Playwright screenshot tests, axe-core, and Lighthouse; then fix the smallest set of high-impact issues. This sequencing is more effective than continually layering additional effects or libraries onto an unstable base. [9] [10] [11] [20]

**Check licences, release activity, and bundle cost before adoption.** This catalogue surfaces both permissive projects and products with stronger reciprocal or nonstandard terms. In particular, assess GPL/AGPL visual tools and any repository without an explicit SPDX licence before incorporating code. Also review license terms for add-on plugins, Figma assets, premium content, hosted services, and generated/captured reference materials.

## Research method and limitations

This report used broad GitHub discovery, direct review of project documentation, and a concurrent public-metadata screen performed on **30 August 2026**. The screen considered explicit license metadata, repository activity, stars/forks, archive status, scope, and documentation. The companion files include the exact public metadata and transparent screening output.

The resulting recommendation labels are editorial judgements, not endorsements or security assessments. Repository information and star counts change continuously; open-source licensing may differ by package, asset, plugin, or generated output. **Confirm current licences, compatibility, active release support, and security posture in the exact version you intend to use.**

## References

[1] [Anthropic, *Skills*](https://github.com/anthropics/skills)  
[2] [Anthropic, *Frontend Design Plugin*](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)  
[3] [Vercel, *Agent Skills*](https://github.com/vercel-labs/agent-skills/tree/main/skills)  
[4] [Next Level Builder, *UI UX Pro Max Skill*](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)  
[5] [Meng To, *Skills*](https://github.com/MengTo/Skills)  
[6] [abi, *Screenshot-to-Code*](https://github.com/abi/screenshot-to-code)  
[7] [shadcn, *shadcn/ui*](https://github.com/shadcn-ui/ui)  
[8] [Radix UI, *Primitives*](https://github.com/radix-ui/primitives)  
[9] [Style Dictionary, *Style Dictionary*](https://github.com/style-dictionary/style-dictionary)  
[10] [Storybook, *Storybook*](https://github.com/storybookjs/storybook)  
[11] [Deque, *axe-core*](https://github.com/dequelabs/axe-core)  
[12] [PageAI-Pro, *Page UI*](https://github.com/PageAI-Pro/page-ui)  
[13] [Motion Division, *Motion*](https://github.com/motiondivision/motion)  
[14] [pmndrs, *React Three Fiber*](https://github.com/pmndrs/react-three-fiber)  
[15] [tsParticles, *tsParticles*](https://github.com/tsparticles/tsparticles)  
[16] [Lucide, *Lucide Icons*](https://github.com/lucide-icons/lucide)  
[17] [Tabler, *Tabler Icons*](https://github.com/tabler/tabler-icons)  
[18] [Iconify, *Iconify*](https://github.com/iconify/iconify)  
[19] [Iconoir, *Iconoir*](https://github.com/iconoir-icons/iconoir)  
[20] [Google Chrome, *Lighthouse*](https://github.com/GoogleChrome/lighthouse)  
[21] [GitHub Docs, *REST API: Get a repository*](https://docs.github.com/en/rest/repos/repos#get-a-repository)

---

### Supporting research files

- `github_web_design_gems_category_chart.png` — category coverage and activity chart.
- `github_web_design_gems_screening.md` — transparent metadata-screening table.
- `github_web_design_gems_metadata.json` — raw public metadata for the initial 60-repository candidate sweep.
- `github_web_design_gems_corrected.json` — validation of corrected repository paths and supplementary candidates.

> This research was powered by the open-source projects listed above. If one of these gems helps your work, consider starring the repository and supporting its maintainers.
