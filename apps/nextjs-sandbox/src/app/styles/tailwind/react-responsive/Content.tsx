"use client";

import { useMediaQuery } from "react-responsive";

const Content = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return (
    <div
      className={`flex justify-center items-center w-fit h-96 p-10 m-auto
            ${isDesktopOrLaptop ? "bg-slate-400" : "bg-red-500"}`}
    >
      Tailwind works perfectly with react-responsive
    </div>
  );
};

export default Content;
