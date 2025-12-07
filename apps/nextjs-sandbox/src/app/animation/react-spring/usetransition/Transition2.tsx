"use client";

import { animated, useTransition } from "@react-spring/web";
import { useState } from "react";

/**
 * @deprecated
 */
const Transition2 = () => {
	const [data, setData] = useState<number>(0);

	const transition = useTransition(data, {
		from: { opacity: 0, transform: "translate3d(50%,0,0)" },
		enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
		leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
		exitBeforeEnter: true,
		config: {
			duration: 200,
		},
	});

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
				useTransition with a config object & useState()
			</a>
			{/* {transition((style, item) => {
				return (
					<animated.div style={style} className="text-5xl">
						{item}
					</animated.div>
				);
			})} */}
			<button
				className="px-2 py-1
				text-white
				bg-blue-500
				rounded-md"
				onClick={() => {
					setData((index) => {
						return (index + 1) % 3;
					});
				}}
			>
				Next
			</button>
		</div>
	);
};

export default Transition2;
