"use client";

import { animated, useTrail } from "@react-spring/web";

/**
 * @deprecated
 */
const Trail1 = () => {
	const [trails, api] = useTrail(
		3,
		() => ({
			from: { opacity: 0, x: 40 },
			to: { opacity: 1, x: 0 },
			config: { duration: 1000 },
		}),
		[]
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
			<div>Auto start</div>
			{/* {trails.map((props, i) => {
				return (
					<animated.div key={i} style={props}>
						Hello World
					</animated.div>
				);
			})} */}
		</div>
	);
};

export default Trail1;
