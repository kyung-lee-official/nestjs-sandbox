import type { SharpImageProps } from "./types";

const widths = [384, 640, 828, 1200, 1920]; // Common responsive breakpoints

export function SharpImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  className,
  priority = false,
  sizes = "100vw",
}: SharpImageProps) {
  const baseUrl = `/api/sharp?src=${encodeURIComponent(src)}`;
  const qualityParam = quality ? `&q=${quality}` : "";

  const webpSources = widths
    .map((w) => `${baseUrl}&w=${w}&f=webp${qualityParam} ${w}w`)
    .join(", ");
  const avifSources = widths
    .map((w) => `${baseUrl}&w=${w}&f=avif${qualityParam} ${w}w`)
    .join(", ");
  const fallbackSrc = `${baseUrl}&w=${widths[widths.length - 1] || 1200}${qualityParam}`;

  return (
    <picture>
      {/* AVIF (best compression) */}
      <source srcSet={avifSources} sizes={sizes} type="image/avif" />
      {/* WebP fallback */}
      <source srcSet={webpSources} sizes={sizes} type="image/webp" />
      {/* Fallback to original format (e.g., JPEG) */}
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={`h-auto w-full ${className || ""}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
