# Wide Research Notes — AI-Assisted Web Design GitHub Gems

## Research scope and initial inclusion criteria

The catalogue will cover agent-skill repositories, visual/reference-to-code systems, component libraries, design systems and accessible primitives, animation/interaction tools, page-block libraries, design workflow integrations, and UI quality assurance. Recommended items must have clear documentation and a practical web-design role; the highest-confidence selections also demonstrate meaningful GitHub adoption and/or very recent maintenance.

## Verified repositories and observations

| Repository | Verified role | Quality signals observed | Source |
|---|---|---|---|
| MengTo/Skills | Portable agent skills for designers and builders using Codex, Claude, Cursor and related agents. Its flagship workflow turns video references into rich prompts, extracts interaction prompts from HTML, captures full pages, and creates daily UI-inspiration prompt packs. | MIT-licensed; 5.6k stars and 679 forks; latest visible commit two days before research. | https://github.com/MengTo/skills |
| vercel-labs/agent-skills | Official Vercel collection that includes `web-design-guidelines`, `react-best-practices`, `composition-patterns`, `react-view-transitions`, optimization and deployment skills. | 30.6k stars and 2.7k forks; repository skills directory showed activity on 28 August 2026. | https://github.com/vercel-labs/agent-skills/tree/main/skills |
| shadcn-ui/ui | Accessible, customizable component source and distribution/registry platform; intended to be extended into a project-owned component library. | MIT-licensed; 123k stars, 10k forks, and a visible commit on research day. | https://github.com/shadcn-ui/ui |
| abi/screenshot-to-code | AI application for converting screenshots, mockups, Figma designs and screen recordings into functional HTML/CSS/Tailwind/React/Vue and related outputs. | 76.3k stars and 9.3k forks; 1,455 commits; visible activity in the prior month and detailed docs for testing/evaluation/QA. | https://github.com/abi/screenshot-to-code |

## Source page observations

- The Vercel skills directory explicitly listed web design guidelines, React best practices, composition patterns, view transitions, performance optimization and deployment workflows.
- The Screenshot-to-Code README explicitly listed HTML + Tailwind, HTML + CSS, React + Tailwind, Vue + Tailwind, Bootstrap, and Ionic + Tailwind as supported targets.
- The MengTo repository describes skill folders as portable `SKILL.md` playbooks, potentially with scripts, assets and reference material, designed to be adopted by different agent clients.

## Queries logged

1. GitHub AI agent web design skills / frontend design coding agent skills / UI UX agent skills.
2. GitHub React component library design system shadcn radix / accessible UI component library React Tailwind / headless UI primitives component library.
3. GitHub screenshot to code AI frontend UI / Figma to code AI web UI / AI UI generator design to code.
4. GitHub design system accessible UI component libraries React / headless accessible component primitives React Vue / multi framework UI component library design system.

## Candidate pool to validate in later research

Agent skills: `anthropics/skills`, `anthropics/claude-code` frontend-design plugin, `julianoczkowski/designer-skills`, `plugin87/ux-ui-agent-skills`, `nextlevelbuilder/ui-ux-pro-max-skill`, `jakubkrehel/skills`.

Core components/primitives: `radix-ui/primitives`, `tailwindlabs/headlessui`, `adobe/react-spectrum`, `chakra-ui/ark`, `mui/material-ui`, `chakra-ui/chakra-ui`, `mantinedev/mantine`, `ant-design/ant-design`, `heroui-inc/heroui`, `nextui-org/nextui` (historical / refer users to HeroUI).

Design systems: `github/primer`, `carbon-design-system/carbon`, `microsoft/fluentui`, `shopify/polaris`, `atlassian/design-system`, `elastic/eui`.

Other likely areas: Magic UI, Aceternity UI, Origin UI, Motion/Framer Motion, GSAP, React Flow, Tiptap, Storybook, Ladle, Playwright, axe-core, Chromatic, Percy alternatives, Style Dictionary, Tokens Studio, Iconify, Lucide, Tabler Icons, Radix Icons, Iconoir.

These candidates still require validation before inclusion and should not yet be treated as final recommendations.

---
Last updated: 30 August 2026

## Expanded verified findings

| Repository | Verified role | Quality signals observed | Source |
|---|---|---|---|
| anthropics/skills | Reference implementation and examples of self-contained agent skill folders consisting of instructions, scripts, and resources. It explicitly includes design as a creative use case and is valuable as the baseline skill structure to adapt for web design. | 173k stars and 20.5k forks; visible repository activity in August 2026. Its current metadata does not declare a license, so reuse must be checked at file level. | https://github.com/anthropics/skills |
| nextlevelbuilder/ui-ux-pro-max-skill | Design-intelligence skill for professional UI/UX across platforms. The repository showed a web-design starter stack with design plans/reviews, screenshot and heuristic audits, responsiveness and WCAG AA focus, agent commands, and a CI design gate. | MIT; 123k stars and 13.2k forks; visible commit three days before research; code, docs, CLI, gallery, examples, and tests are present. | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| style-dictionary/style-dictionary | Cross-platform design-token build system. It uses a central token definition and produces styles for targets including CSS, JS, HTML, Android, iOS and documentation. | Apache-2.0; 4.8k stars, 628 forks, 41k dependents and 175 contributors were visible; recent release activity. | https://github.com/style-dictionary/style-dictionary |
| PageAI-Pro/page-ui | MIT-licensed React/Next.js landing-page components, templates and examples built with Tailwind CSS and inspired by shadcn/ui. It provides a CLI install path. | 1.7k stars; latest listed component sync was July 2026; explicit current Tailwind v3 constraint requires consideration for v4 projects. | https://github.com/PageAI-Pro/page-ui |
| maxbogo/awesome-ai-tools-for-ui | An actively maintained discovery index that catalogues UI-specific agent skills, apps, MCPs/plugins, design tools, and resources. It is helpful for discovery rather than a foundation dependency. | 846 stars; recent update in July 2026; 30 commits. | https://github.com/maxbogo/awesome-ai-tools-for-ui |

## Corrected public-metadata validation

- **saadeghi/daisyui** is the correct repository (42.2k stars; MIT; activity on 24 August 2026), whereas the `daisyui/daisyui` candidate redirects to its docs/staging repository and should not be listed as the main library.
- **darkroomengineering/lenis** is the correct Lenis repository (15.6k stars; MIT; activity on 27 August 2026).
- GitHub's Primer is better represented by **primer/react** (React implementation; 3.9k stars; MIT) and **primer/css** (CSS implementation; 13k stars; MIT), rather than an umbrella `github/primer` repository.
- **Visual-Regression-Tracker/Visual-Regression-Tracker** is publicly available (709 stars; Apache-2.0; activity on 23 August 2026).
- **ariakit/ariakit** is an accessible React toolkit (8.6k stars; active on research day); it has no SPDX license field in GitHub API output, so use needs a manual licensing review.
- Repositories without a reliable public API match (`aceternity/aceternity-ui`, former `studio-freight/lenis`, and `github/primer`) will be excluded or corrected to valid sources.

## Metadata collection

A concurrent metadata sweep of 60 initially shortlisted repositories yielded 56 valid public matches. The resulting structured data is stored in `/home/ubuntu/github_web_design_gems_metadata.json`, with corrected entries in `/home/ubuntu/github_web_design_gems_corrected.json`. Data was collected 30 August 2026, so star figures are time-sensitive and should be reported as approximate, not as enduring measures.


## UI quality-assurance findings

| Repository | Verified role | Quality signals observed | Source |
|---|---|---|---|
| storybookjs/storybook | Framework-agnostic frontend workshop for building, documenting, and testing UI components and pages in isolation. It is especially useful for showing an AI agent the intended variants, states and responsive behavior of a component library. | MIT; 91k stars, 10.4k forks, 2,201 tags and visible AI-tool/agent-evaluation work in the repository; active around the research date. | https://github.com/storybookjs/storybook |
| dequelabs/axe-core | Automated accessibility engine designed to integrate with existing functional tests across modern browsers, test environments and frameworks. It should be used as a mandatory review stage after AI-generated UI, rather than treated as a complete accessibility verdict. | MPL-2.0; 7.5k stars, 923 forks and 5,527 commits were visible; maintained on an active `develop` branch. | https://github.com/dequelabs/axe-core |

## Practical interpretation

An effective AI-assisted web-design workflow should not stop once the first interface renders. Agent skills determine design direction and build constraints; a code-owned component system and design tokens enforce consistency; Storybook makes UI states reviewable; automated browser testing, accessibility analysis and performance auditing guard the final output. The sources above substantiate the key pieces of that workflow.

