"use client";

import { CircularProgress } from "./CircularProgress";

const Content = () => {
  return (
    <div className="w-96 p-10">
      <CircularProgress size={30} progress={50} />
    </div>
  );
};

export default Content;
