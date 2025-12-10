"use client";

import T1 from "./T1";
import T2 from "./T2";

const Transition3 = () => {
  return (
    <div
      className="flex justify-between min-w-96 p-4 gap-4
			bg-neutral-200
			rounded-md"
    >
      <T1 />
      <T2 />
    </div>
  );
};

export default Transition3;
