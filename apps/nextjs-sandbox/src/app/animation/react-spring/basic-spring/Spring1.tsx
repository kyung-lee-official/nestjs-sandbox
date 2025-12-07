"use client";

import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";

/**
 * @deprecated
 */
const Spring1 = () => {
	const [props, api] = useSpring(
		() => ({
			from: { opacity: 0 },
			to: { opacity: 1 },
			config: { duration: 2000 },
		}),
		[]
	);
	return (
		<div
			className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
		>
			<Link
				href={"https://www.react-spring.dev/docs/components/use-spring"}
				className={"underline"}
			>
				Basic useSpring
			</Link>
			{/* <animated.div style={props}>text</animated.div> */}
		</div>
	);
};

export default Spring1;
