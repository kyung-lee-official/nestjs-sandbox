export interface SharpImageProps {
  src: string; // Path relative to /public, e.g., /images/photo.jpg
  alt: string;
  width?: number; // Optional max width (for layout)
  height?: number;
  quality?: number; // Image quality (1-100)
  className?: string;
  priority?: boolean; // Disable lazy loading if true
  sizes?: string; // For sizes attribute, e.g., "100vw"
}
