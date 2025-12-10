"use client";

import { useState } from "react";
import { defaultVal } from "./Context";
import ProviderA from "./ProviderA";
import ProviderB from "./ProviderB";

const Content = () => {
  const [num, setNum] = useState(defaultVal);
  return (
    <div className="flex flex-col p-10 gap-4">
      <p>
        As Contexts only work with client side React, which means this works
        fine with Vite.js or Next.js client components but not with Next.js
        server components.
      </p>
      <p className="text-green-500">
        In Client side, you can create a state in the common parent component,
        and pass it to multiple context providers. Because the parent component
        is Client Side Component, this works fine.
      </p>
      <p className="text-red-500">
        But if the common parent component is a Server Side Component, You
        can&apos;t even create the state.
      </p>
      <ProviderA num={num} setNum={setNum} />
      <ProviderB num={num} setNum={setNum} />
    </div>
  );
};

export default Content;
