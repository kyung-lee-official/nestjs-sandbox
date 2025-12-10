"use client";

import { animated, useSpring } from "@react-spring/web";

/**
 * @deprecated
 */
const Spring4 = () => {
  const [props, api] = useSpring(
    () => ({
      from: { x: 0 },
      to: { x: 360 },
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
        href={"https://www.react-spring.dev/docs/advanced/interpolation"}
        className="underline"
      >
        Interpolation (value mapping)
      </a>
      <div>This case we map x transition to a rotation</div>
      {/* <animated.a
				className={"underline"}
				style={{
					transform: props.x.to(
						(value) => `rotateZ(${0.5 * value}deg)`
					),
				}}
			>
				Text
			</animated.a> */}
    </div>
  );
};

export default Spring4;
