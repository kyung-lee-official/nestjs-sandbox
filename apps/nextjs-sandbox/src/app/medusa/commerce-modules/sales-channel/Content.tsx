"use client";

import Link from "next/link";

export const Content = () => {
	return (
		<div className="flex flex-col m-6">
			<h1>Sales Channel Module</h1>
			<Link
				href="/medusa/commerce-modules/sales-channel/sales-channel-creation-flows"
				className="underline decoration-dotted"
			>
				Sales Channel Creation Flows
			</Link>
		</div>
	);
};
