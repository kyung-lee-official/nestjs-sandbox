"use client";

import { SharpImage } from "./Sharp";

export default function Content({ url }: { url: string }) {
  return (
    <div>
      <div style={{ display: "flex", gap: "20px", alignItems: "start" }}>
        <div>
          <p>Sharp Processed (Client-side)</p>
          <SharpImage
            src={url}
            alt="client processed"
            clientSide
            resize={{ width: 250, height: 250 }}
            tint={{ r: 200, g: 255, b: 200 }}
            format="webp"
            quality={85}
          />
        </div>
      </div>
    </div>
  );
}
