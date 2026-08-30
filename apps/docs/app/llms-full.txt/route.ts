import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  const filePath = path.resolve(process.cwd(), "public/llms-full.txt");

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  return new NextResponse("# Full LLMs specification will populate after build:registry", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
