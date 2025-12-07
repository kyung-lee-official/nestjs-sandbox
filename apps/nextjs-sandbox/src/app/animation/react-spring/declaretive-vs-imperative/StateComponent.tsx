"use client";

import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { Container } from "./Container";

/**
 * @deprecated
 */
const StateComponent = () => {
	const [forward, setForward] = useState(false);

	const springs = useSpring({
		x: forward ? 100 : 0,
	});

	const handleClick = () => {
		setForward((s) => !s);
	};

	return (
		<Container>
			{/* <animated.div
				onClick={handleClick}
				className={"w-20 h-20 bg-red-500 rounded-2xl"}
				style={{
					...springs,
				}}
			/> */}
			<span>Render ID - {Math.random()}</span>
		</Container>
	);
};

export default StateComponent;
