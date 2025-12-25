import { sharpImageUrl } from "./actions";

interface SharpImageServerProps {
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

export async function SharpImageServer({
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
}: SharpImageServerProps) {
  try {
    // Create processing options object
    const options = {
      resize,
      tint,
      format,
      quality,
    };

    const processedSrc = await sharpImageUrl(src, options);

    if (!processedSrc) {
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
          Failed to process image
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
  } catch (error) {
    console.error("SharpImageServer error:", error);
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
        Error processing image
      </div>
    );
  }
}
