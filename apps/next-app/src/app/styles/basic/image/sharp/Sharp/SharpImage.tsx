import { SharpImage as SharpImageClient } from "./SharpImageClient";
import { SharpImageServer } from "./SharpImageServer";

interface SharpImageUnifiedProps {
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
  // Component behavior
  clientSide?: boolean;
}

/**
 * Sharp Image Component - Replaces <img> tag with Sharp processing
 *
 * Usage:
 * - Server-side (default): <SharpImage src="..." alt="..." />
 * - Client-side: <SharpImage src="..." alt="..." clientSide />
 *
 * Features:
 * - Automatic image processing with Sharp
 * - Configurable resize, tint, format, and quality
 * - Loading states (client-side only)
 * - Error handling
 */
export function SharpImage(props: SharpImageUnifiedProps) {
  const { clientSide = false, ...otherProps } = props;

  if (clientSide) {
    return <SharpImageClient {...otherProps} />;
  }

  // TypeScript doesn't know this is a server component, so we need to cast
  const ServerComponent = SharpImageServer as any;
  return <ServerComponent {...otherProps} />;
}
