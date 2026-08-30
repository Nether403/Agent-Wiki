import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const cleanName = name.replace(/\.json$/, "");

  const itemPath = path.resolve(process.cwd(), `public/r/${cleanName}.json`);

  if (!fs.existsSync(itemPath)) {
    return NextResponse.json(
      { error: `Component "${cleanName}" not found in registry.` },
      { status: 404 }
    );
  }

  try {
    const fileContent = fs.readFileSync(itemPath, "utf-8");
    const json = JSON.parse(fileContent);

    return NextResponse.json(json, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read component artifact." },
      { status: 500 }
    );
  }
}
