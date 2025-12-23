"use client";

import { motion } from "motion/react";
import React, { useState } from "react";

const Content = () => {
  const [pos, setPos] = useState<"l" | "r">("l");

  return (
    <div>
      <div className="flex justify-center items-center m-6">
        <h1 className="text-xl">
          Note: the animated elements must <strong>ALL</strong> have property
          `layout`
        </h1>
      </div>
      <motion.div
        layout
        style={{
          justifyContent: pos === "l" ? "flex-start" : "flex-end",
        }}
        className="flex w-full bg-gray-200 cursor-pointer"
        onClick={() => {
          if (pos === "l") {
            setPos("r");
          } else {
            setPos("l");
          }
        }}
      >
        <motion.div
          layout
          className="flex justify-center items-center w-10 h-10 
					text-red-50 text-xl
					bg-red-500"
          transition={{
            duration: 1,
          }}
        >
          {pos}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Content;
