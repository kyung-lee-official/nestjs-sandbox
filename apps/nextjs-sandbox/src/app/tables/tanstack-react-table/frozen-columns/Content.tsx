"use client";

import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

type Person = {
  id: number;
  name: string;
  age: number;
  city: string;
  job: string;
  department?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
};

const data: Person[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1} with a long name to test overflow`,
  age: 20 + (i % 30),
  city: ["New York", "Los Angeles", "Chicago", "San Francisco", "Seattle"][
    i % 5
  ],
  job: ["Engineer", "Designer", "Writer", "Manager", "Developer"][i % 5],
})) as any;

const columnHelper = createColumnHelper<Person>();

export const Content = () => {
  const columns = useMemo<ColumnDef<Person, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
        size: 160,
      }),
      columnHelper.accessor("age", {
        header: "Age",
        cell: (info) => info.getValue(),
        size: 80,
      }),
      columnHelper.accessor("city", {
        header: "City",
        cell: (info) => info.getValue(),
        size: 140,
      }),
      columnHelper.accessor("job", {
        header: "Job",
        cell: (info) => info.getValue(),
        size: 160,
      }),
      // Add more columns below for testing horizontal scroll
      columnHelper.accessor("department", {
        header: "Department",
        cell: () => "Engineering",
        size: 180,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => `person${info.row.index + 1}@example.com`,
        size: 220,
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        cell: () => "555-1234",
        size: 140,
      }),
      columnHelper.accessor("address", {
        header: "Address",
        cell: () => "123 Main St, City",
        size: 240,
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        cell: () => "Some notes here...",
        size: 200,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Calculate grid columns for CSS grid
  const gridTemplateColumns = columns
    .map((col) => (col.size ? `${col.size}px` : "1fr"))
    .join(" ");
  // console.log(gridTemplateColumns);

  // Helper for sticky/frozen columns
  const getCellClass = (colIdx: number) => {
    if (colIdx === 0) return "sticky left-0 z-20 bg-white/80 shadow-md";
    if (colIdx === 1) return "sticky left-[60px] z-10 bg-white/80 shadow-md";
    return "";
  };
  const getHeaderClass = (colIdx: number) => {
    if (colIdx === 0) return "sticky left-0 z-30 bg-neutral-100 shadow-md";
    if (colIdx === 1) return "sticky left-[60px] z-20 bg-neutral-100 shadow-md";
    return "";
  };

  return (
    <div
      className="p-10 w-full h-svh
			bg-lime-600/10"
    >
      <div className="font-bold text-xl mb-4">
        People Table (Frozen Columns)
      </div>
      <div
        className="max-w-[800px] max-h-[500px] overflow-auto
				border rounded shadow"
      >
        {/* Header */}
        {/* here min-w-max is used to prevent the header from shrinking below the minimum width of the columns */}
        <div
          className="grid sticky min-w-max
					bg-blue-400/50
					border-b top-0 z-40"
          style={{ gridTemplateColumns }}
          role="row"
        >
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header, colIdx) => (
              <div
                key={header.id}
                className={`p-3
								bg-red-400/50
								border-r last:border-r-0 ${getHeaderClass(colIdx)}`}
                role="columnheader"
                style={{ minWidth: columns![colIdx]!.size }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </div>
            )),
          )}
        </div>
        {/* Body */}
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="grid min-w-max
						border-b last:border-b-0"
            style={{ gridTemplateColumns }}
            role="row"
          >
            {row.getVisibleCells().map((cell, colIdx) => (
              <div
                key={cell.id}
                className={`p-3
								bg-cyan-400/20
								border-r last:border-r-0 ${getCellClass(colIdx)}`}
                role="cell"
                style={{ minWidth: columns![colIdx]!.size }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
