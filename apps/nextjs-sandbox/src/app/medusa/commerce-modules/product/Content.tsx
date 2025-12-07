"use client";

import Link from "next/link";

export const Content = () => {
	return (
		<div className="flex flex-col m-6">
			<h1>Product Module</h1>
			<Link
				href="/medusa/commerce-modules/product/product-creation-flows"
				className="underline decoration-dotted"
			>
				Create Products
			</Link>
		</div>
	);
};
