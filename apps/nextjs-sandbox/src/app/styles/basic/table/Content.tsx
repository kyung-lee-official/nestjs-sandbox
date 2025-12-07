"use client";

import { Table, Tbody, Thead } from "./table/Table";

export const Content = () => {
	const mockData = [
		{ id: 1, user: "John Doe" },
		{ id: 2, user: "Jane Smith" },
		{ id: 3, user: "Alice Johnson" },
		{ id: 4, user: "Bob Brown" },
		{ id: 5, user: "Charlie Brown" },
		{ id: 6, user: "David Smith" },
		{ id: 7, user: "Eve Johnson" },
		{ id: 8, user: "Frank Brown" },
		{ id: 9, user: "Grace Smith" },
		{ id: 10, user: "Hank Johnson" },
		{ id: 11, user: "Ivy Brown" },
		{ id: 12, user: "Jack Smith" },
		{ id: 13, user: "Kate Johnson" },
		{ id: 14, user: "Leo Brown" },
		{ id: 15, user: "Mia Smith" },
	];

	return (
		<div
			className="w-[600px] h-[600px] p-6 m-10
			bg-neutral-950
			overflow-y-auto"
		>
			<Table>
				<Thead>
					<tr>
						<th>id</th>
						<th>name</th>
					</tr>
				</Thead>
				<Tbody>
					{mockData.map((item) => (
						<tr key={item.id}>
							<td>{item.user}</td>
							<td>{item.id}</td>
						</tr>
					))}
				</Tbody>
			</Table>
		</div>
	);
};
