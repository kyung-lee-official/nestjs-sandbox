import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config `pageExtensions` to include markdown and MDX files */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /* config options here */
  reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // MDX options here
  },
});

export default withNextIntl(withMDX(nextConfig));
