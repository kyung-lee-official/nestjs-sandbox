"use client";

import { useReducer } from "react";
import { fooReducer } from "./Reducers";
import Link from "next/link";

export const Content = () => {
	const [fooState, fooDispatch] = useReducer(fooReducer, { a: 0, b: 0 });

	return (
		<div className="flex flex-col p-10 gap-6">
			<h1 className="text-xl">useReducer</h1>
			<h2>
				the reducer function should not return undefined, see reducer
				code for details.
			</h2>
			<p>
				note that the file where reducer is located should be ts instead
				of tsx
			</p>
			<Link
				href="https://react.dev/reference/react/useReducer"
				className="underline"
			>
				useReducer
			</Link>
			fooState: {JSON.stringify(fooState)}
			<button
				onClick={() => {
					fooDispatch({ type: "add", payload: "a" });
				}}
			>
				add a
			</button>
			<button
				onClick={() => {
					fooDispatch({ type: "add", payload: "b" });
				}}
			>
				add b
			</button>
			<button
				onClick={() => {
					fooDispatch({ type: "subtract" });
				}}
			>
				subtract both
			</button>
		</div>
	);
};
