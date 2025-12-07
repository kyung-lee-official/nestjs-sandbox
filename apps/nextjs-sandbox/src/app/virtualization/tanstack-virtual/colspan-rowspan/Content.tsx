"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef, // Import ColumnDef for explicit typing
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { makeData, Product } from "../data"; // Import your data and type

// Use createColumnHelper for type-safe column definitions
const columnHelper = createColumnHelper<Product>();

export function Content() {
  const [data] = useState<Product[]>(() => makeData(10000)); // Type the data state

  const columns = useMemo<ColumnDef<Product, any>[]>(
    // Explicitly type columns
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        size: 60, // Set size for layouting with CSS Grid
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Product Name",
        size: 200,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        size: 150,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        size: 100,
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
        size: 80,
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        size: 100,
        cell: () => (
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            onClick={() => alert("Action!")}
          >
            View
          </button>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  // Virtualization setup
  const tableContainerRef = useRef<HTMLDivElement>(null); // Type the ref

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(
      (index: number) => {
        // Type the index
        const row = rows[index];
        // Assuming summary rows are slightly taller for demonstration
        return row!.original.type === "categorySummary" ? 60 : 40;
      },
      [rows],
    ),
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]!.start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1]!.end
      : 0;

  // Calculate the grid template columns string dynamically based on column sizes
  const gridTemplateColumns = useMemo(() => {
    return columns.map((col) => `${col.size || 0}px`).join(" ");
  }, [columns]);

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Products Table with ColSpan & Virtualization
      </h1>
      <p className="mb-4 text-gray-600">
        Showing {rows.length.toLocaleString()} rows.
      </p>

      <div
        ref={tableContainerRef}
        className="relative overflow-y-auto h-[600px]
				bg-white
				border border-gray-300
				rounded-lg shadow-md"
      >
        <table className="w-full border-collapse">
          {/* Header */}
          <thead
            className="sticky top-0
						bg-gray-100
						z-10 shadow-sm"
          >
            {table.getHeaderGroups().map((headerGroup) => {
              // console.log(headerGroup);
              return (
                <tr
                  key={headerGroup.id}
                  className="grid" // Use grid for header row
                  style={{ gridTemplateColumns }} // Apply dynamic column widths
                >
                  {headerGroup.headers.map((header) => {
                    // console.log(header);
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="p-3 text-left font-semibold text-gray-700 border-b border-gray-200"
                        // Tailwind does not directly support colSpan on grid items,
                        // but since the header is not virtualized in this specific approach,
                        // we can rely on standard table header colSpan here.
                        // For more complex header colSpan with absolute positioning,
                        // you might need `grid-column: span X;`
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>

          {/* Body */}
          <tbody
            className="block relative" // block for scrollable area, relative for virtual rows
            style={{ height: totalSize }} // Set total height for scrollbar
          >
            {/* Render virtualized rows */}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const isSummaryRow =
                (row!.original as Product).type === "categorySummary"; // Type assertion

              return (
                <tr
                  key={row!.id}
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  className={`absolute w-full border-b border-gray-200 ${
                    isSummaryRow
                      ? "bg-blue-50 text-blue-800 font-medium"
                      : "bg-white"
                  }`}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, // Positioning
                    height: virtualRow.size, // Apply virtualizer height
                    display: "grid", // Use grid for body rows
                    gridTemplateColumns, // Apply dynamic column widths
                  }}
                >
                  {isSummaryRow ? (
                    <td
                      // `col-span-full` works if you apply grid to the parent `tr`
                      className="col-span-full text-center py-3 flex items-center justify-center"
                    >
                      {(row!.original as Product).summaryText}
                    </td>
                  ) : (
                    row!.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-3 border-r border-gray-100 last:border-r-0 flex items-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
