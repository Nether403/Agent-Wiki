import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const componentName = slug[slug.length - 1];

  const registryItemPath = path.resolve(
    process.cwd(),
    `public/r/${componentName}.json`
  );

  if (!fs.existsSync(registryItemPath)) {
    return new NextResponse(
      `# Component Not Found\n\nThe component \`${componentName}\` does not exist in the registry.`,
      {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      }
    );
  }

  try {
    const data = JSON.parse(fs.readFileSync(registryItemPath, "utf-8"));
    const file = data.files?.[0];

    const markdown = `# ${data.title} (\`${data.name}\`)
> ${data.description}

- **Taxonomy Category**: \`${data.category}\`
- **Technical Tags**: ${data.tags.join(", ")}
- **Design Dials**: Variance ${data.dials.design_variance}/10 · Motion ${data.dials.motion_intensity}/10 · Density ${data.dials.visual_density}/10
- **Accessibility AA**: Keyboard Nav: ${data.a11y.keyboard_navigable}, ARIA: ${data.a11y.wai_aria_compliant}, Fallback: ${data.a11y.fallback_provided}

## Installation Recipe
\`\`\`bash
npx shadcn@latest add http://localhost:3000/r/${data.name}.json
\`\`\`

## Peer Dependencies
${data.dependencies.length > 0 ? data.dependencies.map((d: string) => `- \`${d}\``).join("\n") : "- None"}

## Verified TypeScript Source
\`\`\`tsx
${file?.content || "// Source code unavailable"}
\`\`\`
`;

    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (err) {
    return new NextResponse(`Error processing markdown for ${componentName}`, {
      status: 500,
    });
  }
}
