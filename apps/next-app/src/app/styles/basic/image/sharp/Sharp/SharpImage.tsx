import type sharp from "sharp";
import { sharpImageUrl } from "../actions";

// Extract ALL Sharp types automatically, zero manual definitions
type SharpMethodOptions = {
  // Extract method parameters automatically
  [K in keyof sharp.Sharp]?: sharp.Sharp[K] extends (...args: any[]) => any
    ? Parameters<sharp.Sharp[K]> extends [infer First, ...any[]]
      ? First
      : never
    : never;
} & Parameters<typeof sharp>[1] & {
    // Extract Sharp constructor options automatically // Extract Sharp's static/enum types automatically
    format?: keyof sharp.FormatEnum;
    // Any other Sharp namespace properties will be automatically included
  };

interface SharpImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  // fully type-safe with all Sharp methods automatically included
  sharpOptions?: Partial<SharpMethodOptions>;
}

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
