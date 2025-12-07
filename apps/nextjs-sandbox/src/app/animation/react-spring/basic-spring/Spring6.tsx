"use client";

import { animated, useSpring } from "@react-spring/web";

/**
 * @deprecated
 */
const Spring6 = () => {
	const [props, api] = useSpring(() => ({
		from: { x: 0 },
	}));
	const interpolate = props.x.to(
		[0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
		[-10, 10, -10, 10, -10, 10, -10, 0]
	);
	return (
		<div
			className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
		>
			{/* <animated.a
				href={
					"https://www.react-spring.dev/docs/advanced/async-animations"
				}
				className={"underline"}
				style={{ x: interpolate }}
			>
				Async Animations with Interpolation
			</animated.a> */}

			<button
				onClick={() => {
					api.start({
						from: { x: 0 },
						to: { x: 1 },
					});
				}}
				className="px-2 py-1
				text-white
				bg-blue-500
				rounded-md"
			>
				Flicker
			</button>
		</div>
	);
};

export default Spring6;
