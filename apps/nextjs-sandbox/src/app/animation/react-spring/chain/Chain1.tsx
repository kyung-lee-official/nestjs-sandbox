"use client";

import {
	useSpringRef,
	useChain,
	animated,
	useSpring,
	useTransition,
} from "@react-spring/web";

const data = ["hi", "there!"];

/**
 * @deprecated
 */
const Chain1 = () => {
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
		config: { duration: 500 },
	});

	useChain([springRef, transRef]);

	return (
		<div
			className="flex flex-col items-center min-w-96 p-4 gap-2
				bg-neutral-200
				rounded-md"
		>
			<a
				href="https://www.react-spring.dev/docs/components/use-chain"
				className="underline"
			>
				useChain
			</a>
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

export default Chain1;
