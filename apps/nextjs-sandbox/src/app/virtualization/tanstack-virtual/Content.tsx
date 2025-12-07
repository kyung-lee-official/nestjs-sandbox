"use client";

import { List } from "./List";
import { Table } from "./Table";

export const Content = () => {
	return (
		<div className="p-10 space-y-2">
			<List />
			<Table />
		</div>
	);
};
