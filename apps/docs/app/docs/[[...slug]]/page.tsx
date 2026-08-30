import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const docSlug = slug ? slug.join("/") : "index";

  const contentDir = path.resolve(process.cwd(), "content/docs");
  const possiblePaths = [
    path.join(contentDir, `${docSlug}.mdx`),
    path.join(contentDir, `${docSlug}.md`),
    path.join(contentDir, docSlug, "index.mdx"),
  ];

  let rawContent = "";
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      rawContent = fs.readFileSync(p, "utf-8");
      break;
    }
  }

  if (!rawContent) {
    notFound();
  }

  // Strip frontmatter for standard presentation
  const stripped = rawContent.replace(/^---[\s\S]*?---/, "").trim();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {stripped}
        </div>
      </div>
    </div>
  );
}
