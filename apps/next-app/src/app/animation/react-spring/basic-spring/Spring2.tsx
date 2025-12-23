"use client";

import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";

/**
 * @deprecated
 */
const Spring2 = () => {
  const [props, api] = useSpring(() => {
    return {
      transform: "translate3d(0px,0,0)",
    };
  });
  const [toggle, setToggle] = useState(false);

  return (
    <div
      className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
    >
      {/* <animated.div style={props}>
				<h1>Basic useSpring & api.start()</h1>
			</animated.div> */}
      <button
        onClick={() => {
          setToggle(!toggle);
          if (toggle) {
            api.start({
              transform: "translate3d(50px,0,0)",
            });
          } else {
            api.start({
              transform: "translate3d(0px,0,0)",
            });
          }
        }}
        className="px-2 py-1
				text-white
				bg-blue-500
				rounded-md"
      >
        Toggle
      </button>
    </div>
  );
};

export default Spring2;
