"use client";

import { useEffect, useState } from "react";
import { sharpImageUrl } from "./actions";

interface SharpImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  // Sharp processing options
  resize?: { width?: number; height?: number };
  tint?: { r: number; g: number; b: number };
  format?: "webp" | "jpeg" | "png";
  quality?: number;
}

export function SharpImage({
  src,
  alt,
  width = 300,
  height = 300,
  className,
  style,
  resize = { width: 300, height: 300 },
  tint,
  format = "webp",
  quality = 80,
}: SharpImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create processing options object
        const options = {
          resize,
          tint,
          format,
          quality,
        };

        const result = await sharpImageUrl(src, options);

        if (result) {
          setProcessedSrc(result);
        } else {
          setError("Failed to process image");
        }
      } catch (err) {
        setError("Error processing image");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    processImage();
  }, [src, resize, tint, format, quality]);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          ...style,
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ddd",
        }}
      >
        Processing...
      </div>
    );
  }

  if (error || !processedSrc) {
    return (
      <div
        className={className}
        style={{
          ...style,
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffe6e6",
          border: "1px solid #ff9999",
          color: "#cc0000",
        }}
      >
        {error || "Failed to load"}
      </div>
    );
  }

  return (
    <img
      src={processedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}
