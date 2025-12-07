"use client";

import { animated, useSpring } from "@react-spring/web";

/**
 * @deprecated
 */
const Spring5 = () => {
	const [props, api] = useSpring(
		() => ({
			from: { x: 0 },
		}),
		[]
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
				style={props}
			>
				Async Animations (Array Value Animation)
			</animated.a> */}
			<button
				onClick={() => {
					api.start({
						to: [
							{ x: -10 },
							{ x: 10 },
							{ x: -10 },
							{ x: 10 },
							{ x: -10 },
							{ x: 10 },
							{ x: -10 },
							{ x: 10 },
							{ x: 0 },
						],
						config: {
							duration: 50,
						},
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

export default Spring5;
