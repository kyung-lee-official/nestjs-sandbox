import { sharpImageUrl } from "./actions";
import type { SharpImageProps } from "./types";

/**
 * Server-side Sharp image processing component
 * Usage: <SharpImage src="image.jpg" alt="desc" sharpOptions={{ resize: { width: 400 }, tint: { r: 255, g: 200, b: 100 } }} />
 */
export async function SharpImage({
  src,
  alt,
  sharpOptions,
  ...imgProps
}: SharpImageProps) {
  try {
    const processedSrc = await sharpImageUrl(src, sharpOptions || {});

    if (!processedSrc) {
      return <div style={{ color: "red" }}>Failed to process image</div>;
    }

    return <img src={processedSrc} alt={alt} {...imgProps} />;
  } catch {
    return <div style={{ color: "red" }}>Error processing image</div>;
  }
}

export default SharpImage;
