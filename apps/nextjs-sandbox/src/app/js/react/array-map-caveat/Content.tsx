"use client";

import { useState } from "react";

export const Content = () => {
	const [users, setUsers] = useState([
		{ id: 1, name: "John" },
		{ id: 2, name: "Jane" },
		{ id: 3, name: "Doe" },
	]);

	return (
		<div>
			{[...users]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((u, i) => (
					<li key={u.id}>{u.name}</li>
				))}
		</div>
	);
};
