"use server";

import sharp, { type SharpOptions } from "sharp";

export async function sharpImageUrl(
  imageUrl: string,
  options: SharpOptions = {},
) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Fetch failed");

    const buffer = Buffer.from(await response.arrayBuffer());

    // Start with sharp instance
    let sharpInstance = sharp(buffer);

    // Apply resize if specified
    if (options.resize) {
      sharpInstance = sharpInstance.resize(
        options.resize.width,
        options.resize.height,
      );
    } else {
      // Default resize
      sharpInstance = sharpInstance.resize(300, 300);
    }

    // Apply tint if specified
    if (options.tint) {
      sharpInstance = sharpInstance.tint(options.tint);
    } else {
      // Default tint (warm sepia-like)
      sharpInstance = sharpInstance.tint({ r: 255, g: 240, b: 200 });
    }

    // Apply format
    const format = options.format || "webp";
    const quality = options.quality || 80;

    const processedBuffer = await sharpInstance
      .toFormat(format, { quality })
      .toBuffer();

    // Convert to Base64 to send back to the client
    const base64Image = processedBuffer.toString("base64");
    return `data:image/${format};base64,${base64Image}`;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
