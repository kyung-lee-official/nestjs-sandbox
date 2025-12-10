"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export const Content = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="p-60">
      <div className="fixed top-10">In view: {isInView ? "true" : "false"}</div>
      <div
        className="w-60 h-60
				bg-cyan-300"
      ></div>
      <div
        className="w-60 h-60
				bg-lime-300"
      ></div>
      <div
        className="w-60 h-60
				bg-emerald-300"
      ></div>
      <div
        className="w-60 h-60
				bg-amber-300"
      ></div>
      <motion.div
        ref={ref}
        className="flex justify-center items-center w-60 h-32
				text-red-600
				bg-red-300
				border-dashed border-red-500 border-4"
      ></motion.div>
      <div
        className="w-60 h-60
				bg-cyan-300"
      ></div>
      <div
        className="w-60 h-60
				bg-lime-300"
      ></div>
      <div
        className="w-60 h-60
				bg-emerald-300"
      ></div>
      <div
        className="w-60 h-60
				bg-amber-300"
      ></div>
    </div>
  );
};
