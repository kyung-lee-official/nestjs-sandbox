"use client";

import { animated, useTransition } from "@react-spring/web";

const Animation = () => {
	const data = [1, 2, 3];

	const transitions = useTransition(data, {
		from: { opacity: 0, x: 100 },
		enter: { opacity: 1, x: 0 },
		leave: { opacity: 1, x: 0 },
		config: {
			duration: 1000,
		},
	});

	// return transitions((style, item) => {
	// 	return (
	// 		<animated.div style={style} className="text-3xl">
	// 			{item}
	// 		</animated.div>
	// 	);
	// });
};

/**
 * @deprecated
 */
const Transition1 = () => {
	return (
		<div
			className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
		>
			<a
				href="https://www.react-spring.dev/docs/components/use-transition#with-a-config-object"
				className="underline"
			>
				useTransition with a config object
			</a>
			{/* <Animation /> */}
		</div>
	);
};

export default Transition1;
