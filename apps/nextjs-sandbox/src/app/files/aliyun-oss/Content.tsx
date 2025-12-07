"use client";

import { List } from "./List";
import { Upload } from "./Upload";

const Content = () => {
	return (
		<main className="p-12">
			<div
				className="w-160 space-y-4
				bg-neutral-100
				border border-neutral-300 rounded-lg"
			>
				<Upload />
				<List />
			</div>
		</main>
	);
};

export default Content;
