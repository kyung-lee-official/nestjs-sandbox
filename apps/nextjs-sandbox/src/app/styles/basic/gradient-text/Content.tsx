"use client";

import { useState } from "react";

const Content = () => {
  const [dark, setDark] = useState(false);
  return (
    <div
      className={`flex flex-col gap-20 justify-center items-center
			w-full h-screen
			font-bold text-6xl
			${dark ? "bg-gray-300" : "bg-gray-800"}
			transition duration-500 ease-in-out`}
    >
      <div
        className="bg-gradient-to-r from-cyan-500 to-blue-500
				bg-clip-text text-transparent [filter:drop-shadow(-30px_-25px_50px_rgba(6,182,212,1))_drop-shadow(30px_25px_50px_rgba(59,130,246,1))]"
      >
        GradientText
      </div>
      <button
        className="text-2xl
				p-2
				border-2 solid rounded-2xl"
        onClick={() => setDark(!dark)}
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default Content;
