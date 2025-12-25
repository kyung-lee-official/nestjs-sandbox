"use client";

import { SharpImage } from "./Sharp";

export default function Content({ url }: { url: string }) {
  return (
    <div className="mt-8">
      <h2 className="mb-2 text-xl">Client-Side Environment</h2>
      <div className="flex w-50 items-start gap-5">
        <SharpImage src={url} alt="sharp processed image" />
      </div>
    </div>
  );
}
