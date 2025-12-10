"use client";
import dynamic from "next/dynamic";

const DynamicContent = dynamic(() => import("./Content"), {
  ssr: false,
});

export default DynamicContent;
