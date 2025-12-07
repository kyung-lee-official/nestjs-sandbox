"use client";

import { useEffect, useRef, useState } from "react";

const Content = () => {
	const [counter1, setCounter1] = useState(0);
	const [counter2, setCounter2] = useState(0);
	const refCounter = useRef(0);

	useEffect(() => {
		const interval = setInterval(() => {
			refCounter.current = refCounter.current + 1;
			setCounter1(counter1 + 1);
			setCounter2((state) => {
				return state + 1;
			});
			console.log("refCounter", refCounter.current);
			console.log("counter1", counter1);
			console.log("counter2", counter2);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col p-10 gap-6">
			<h1 className="text-xl">useRef vs useState</h1>
			<h2>Compare UI values and the console values.</h2>
			<a
				href="https://stackoverflow.com/questions/66429202/what-are-production-use-cases-for-the-useref-usememo-usecallback-hooks/66626493#66626493"
				className="underline"
			>
				What are production use cases for the useRef, useMemo,
				useCallback hooks?
			</a>
			<div className="grid grid-cols-2 w-fit gap-2">
				<div>counter 1: </div> <div>{counter1}</div>
				<div>counter 2: </div> <div>{counter2}</div>
				<div>refCounter: </div> <div>{refCounter.current}</div>
			</div>
		</div>
	);
};

export default Content;
