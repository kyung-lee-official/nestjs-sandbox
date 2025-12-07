"use client";

import { animated, useSpringValue } from "@react-spring/web";

/**
 * @deprecated
 */
const Spring7 = () => {
	const springValue = useSpringValue(0, {
		config: {
			mass: 2,
			friction: 5,
			tension: 80,
		},
	});

	const handleClick = () => springValue.start(15);

	return (
		<div
			className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
		>
			{/* <animated.a
				href={
					"https://www.react-spring.dev/docs/components/use-spring-value"
				}
				className={"underline"}
				style={{ x: springValue }}
			>
				useSpringValue
			</animated.a> */}

			<button
				onClick={handleClick}
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

export default Spring7;
