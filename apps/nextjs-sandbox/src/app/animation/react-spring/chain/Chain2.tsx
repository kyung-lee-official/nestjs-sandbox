"use client";

import {
  animated,
  useChain,
  useSpring,
  useSpringRef,
  useTransition,
} from "@react-spring/web";

const data = ["hi", "there!"];

/**
 * @deprecated
 */
const Chain2 = () => {
  const springRef = useSpringRef();
  const springs = useSpring({
    ref: springRef,
    from: { size: "60%" },
    to: { size: "80%" },
    config: { duration: 500 },
  });

  const transRef = useSpringRef();
  const transitions = useTransition(data, {
    ref: transRef,
    from: { scale: 0 },
    enter: { scale: 1 },
    leave: { scale: 0 },
    config: { duration: 1000 },
  });

  useChain([springRef, transRef], [0, 0.5], 1000);

  return (
    <div
      className="flex flex-col items-center min-w-96 p-4 gap-2
				bg-neutral-200
				rounded-md"
    >
      <a
        href="https://www.react-spring.dev/docs/components/use-chain#timesteps-explained"
        className="underline"
      >
        useChain with timesteps
      </a>
      <code>useChain([springRef, transRef], [0, 0.5], 1000);</code>
      <div>
        The <code>[0, 0.5]</code> are timesteps, between 0 and 1.
      </div>
      <div>
        <code>1000</code> is the timeframe (ms, default is 1000ms).
      </div>
      <div>
        The time delay will be timesteps * timeframe, in this case 0ms and 500ms
        respectively.
      </div>

      {/* <animated.div
				className={"bg-cyan-300"}
				style={{
					width: springs.size,
				}}
			>
				{transitions((style, item) => (
					<animated.div
						className={"bg-cyan-200"}
						style={{
							width: "120px",
							height: "120px",
							...style,
						}}
					>
						{item}
					</animated.div>
				))}
			</animated.div> */}
    </div>
  );
};

export default Chain2;
