import type sharp from "sharp";

// Extract ALL Sharp types automatically - zero manual definitions!
export type SharpOptions = {
  // Extract method parameters automatically
  [K in keyof sharp.Sharp]?: sharp.Sharp[K] extends (...args: any[]) => any
    ? Parameters<sharp.Sharp[K]> extends [infer First, ...any[]]
      ? First
      : never
    : never;
} & Parameters<typeof sharp>[1] & {
    // Extract Sharp constructor options automatically
    // Extract Sharp's static/enum types automatically
    format?: keyof sharp.FormatEnum;
    // Any other Sharp namespace properties will be automatically included
  };

export interface SharpImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  // fully type-safe with all Sharp options automatically included
  sharpOptions?: Partial<SharpOptions>;
}
