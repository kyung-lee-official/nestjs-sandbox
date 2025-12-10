"use client";

import { animated, useTrail } from "@react-spring/web";

/**
 * @deprecated
 */
const Trail2 = () => {
  const [trails, api] = useTrail(
    3,
    () => ({
      opacity: 0,
      x: 40,
      config: { duration: 1000 },
    }),
    [],
  );

  return (
    <div
      className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
    >
      <a
        href="https://www.react-spring.dev/docs/components/use-trail"
        className="underline"
      >
        useTrail (stagger) with a function & deps
      </a>
      <div>Manual start</div>
      {/* {trails.map((props, i) => {
				return (
					<animated.div key={i} style={props}>
						Hello World
					</animated.div>
				);
			})} */}
      <button
        onClick={() => {
          api.start({
            opacity: 1,
            x: 0,
          });
        }}
        className="px-2 py-1
				text-white
				bg-blue-500
				rounded-md"
      >
        Start
      </button>
    </div>
  );
};

export default Trail2;
