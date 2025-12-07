"use client";

import { useMemo } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

const data = [
	{ id: 1, name: "John Doe", age: 30, role: "Developer" },
	{ id: 2, name: "Jane Smith", age: 25, role: "Designer" },
	{ id: 3, name: "Bob Johnson", age: 35, role: "Manager" },
];

const columnHelper = createColumnHelper();

const columns: any = [
	columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("age", {
		header: "Age",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("role", {
		header: "Role",
		cell: (info) => info.getValue(),
	}),
];

export function Content() {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="p-4">
			<table className="w-full border-collapse border border-gray-300">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="bg-gray-100">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="border border-gray-300 p-2 text-left"
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="hover:bg-gray-50">
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="border border-gray-300 p-2"
								>
									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
