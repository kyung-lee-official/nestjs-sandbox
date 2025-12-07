"use client";

import { useEffect, useState } from "react";

export const Content = () => {
	const [state1, setState1] = useState(0);
	const [state2, setState2] = useState(0);

	const handleClick = (e: any) => {
		console.log("state1", state1);
		setState1(state1 + 1);
		setState2((state2) => {
			console.log("state2", state2);
			return state2 + 1;
		});
	};

	useEffect(() => {
		window.addEventListener("click", handleClick);
		return () => {
			window.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div className="p-4">
			click anywhere, check the console
			<div>setState1: {state1}</div>
			<div>setState2 (functional update): {state2}</div>
		</div>
	);
};
