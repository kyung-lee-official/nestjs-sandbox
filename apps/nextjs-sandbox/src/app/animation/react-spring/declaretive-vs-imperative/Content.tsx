"use client";

import dynamic from "next/dynamic";

const DynamicApiComponent = dynamic(() => import("./ApiComponent"), {
  ssr: false,
});
const DynamicStateComponent = dynamic(() => import("./StateComponent"), {
  ssr: false,
});

const Content = () => {
  return (
    <div className="flex flex-col items-center p-4 gap-8">
      <DynamicApiComponent />
      <DynamicStateComponent />
    </div>
  );
};

export default Content;
