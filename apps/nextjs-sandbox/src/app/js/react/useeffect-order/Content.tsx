"use client";

import { useEffect } from "react";
import Child from "./Child";

const Content = () => {
  useEffect(() => {
    console.log("First useEffect");
  }, []);
  return (
    <div
      className="flex flex-col items-center w-fit p-8
			text-pink-700
			bg-pink-200"
    >
      <div>Check the console</div>
      <Child />
    </div>
  );
};

export default Content;
