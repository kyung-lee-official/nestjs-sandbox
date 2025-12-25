// app/api/sharp/route.ts (Next.js 13+ App Router)

import { promises as fs } from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const dynamic = "force-dynamic"; // Optional: disable caching if needed

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src");
  const width = searchParams.get("w") ? Number(searchParams.get("w")) : null;
  const quality = searchParams.get("q") ? Number(searchParams.get("q")) : 80;
  const format = searchParams.get("f") as "webp" | "avif" | "jpeg" | undefined;

  if (!src) {
    return new NextResponse("Missing src", { status: 400 });
  }

  let imageBuffer: Buffer;

  try {
    // Check if src is an external URL
    if (src.startsWith("http://") || src.startsWith("https://")) {
      // Fetch external image
      const response = await fetch(src);
      if (!response.ok) {
        return new NextResponse("External image not found", { status: 404 });
      }
      const arrayBuffer = await response.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      // Handle local images (from /public folder)
      const filePath = path.join(process.cwd(), "public", src);
      imageBuffer = await fs.readFile(filePath);
    }
  } catch (err) {
    return new NextResponse("Image not found", { status: 404 });
  }

  let processor = sharp(imageBuffer);

  if (width) {
    processor = processor.resize(width, null, { withoutEnlargement: true });
  }

  // Auto-format: prefer avif > webp > original
  const outputFormat =
    format ||
    (await processor
      .metadata()
      .then((meta) => (meta.format === "jpeg" ? "webp" : meta.format)));

  processor = processor.toFormat(outputFormat as any, { quality });

  const optimizedBuffer = await processor.toBuffer();
  const mime = `image/${outputFormat === "jpeg" ? "jpeg" : outputFormat}`;

  return new NextResponse(new Uint8Array(optimizedBuffer), {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
