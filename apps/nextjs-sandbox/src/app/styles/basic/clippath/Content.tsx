"use client";

import { useRef } from "react";

const Content = () => {
  return (
    <div
      className="relative
			m-4"
    >
      Note that clip-path doesn&apos;t dig a hole in this case, instead, it
      creates a circle. And it doesn&apos;t support inverted circle.
      <div
        className="w-56 h-32
				bg-red-500"
      ></div>
      <div
        className="absolute top-0 w-56 h-32
				bg-black/50"
        style={{
          clipPath: "circle(10% at 50% 50%)",
        }}
      ></div>
    </div>
  );
};

export default Content;
