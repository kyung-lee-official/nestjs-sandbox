"use client";

import WithUseTransition from "./WithUseTransition";
import WithoutUseTransition from "./WithoutUseTransition";

const Content = () => {
	return (
		<div className="flex flex-col p-4 gap-4">
			<a
				href="https://react.dev/reference/react/useTransition"
				className="underline"
			>
				useTransition
			</a>
			<h1 className="text-3xl">
				Example 1 of 2: Updating the current tab in a transition
			</h1>
			<p>
				In this example, the “Posts” tab is{" "}
				<b>artificially slowed down</b> so that it takes at least a
				second to render.
			</p>
			<p>
				Click “Posts” and then immediately click “Contact”. Notice that
				this interrupts the slow render of “Posts”. The “Contact” tab
				shows immediately. Because this state update is marked as a
				transition, a slow re-render did not freeze the user interface.
			</p>
			<h2 className="text-2xl">With useTransition</h2>
			<WithUseTransition />
			<h2 className="text-2xl">Without useTransition</h2>
			<WithoutUseTransition />
		</div>
	);
};

export default Content;
