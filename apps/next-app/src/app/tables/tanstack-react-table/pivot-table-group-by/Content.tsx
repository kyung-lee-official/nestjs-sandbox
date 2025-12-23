"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

// Type definitions
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  age: number;
  salary: number;
}

interface PivotRow {
  group: string;
  count?: number;
  avgAge?: number;
  avgSalary?: number;
}

const rawData: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Developer",
    department: "Engineering",
    age: 30,
    salary: 85000,
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Designer",
    department: "Creative",
    age: 25,
    salary: 65000,
  },
  {
    id: 3,
    name: "Bob Johnson",
    role: "Manager",
    department: "Management",
    age: 40,
    salary: 100000,
  },
  {
    id: 4,
    name: "Alice Brown",
    role: "Developer",
    department: "Engineering",
    age: 28,
    salary: 82000,
  },
  {
    id: 5,
    name: "Charlie Davis",
    role: "Designer",
    department: "Creative",
    age: 27,
    salary: 60000,
  },
  {
    id: 6,
    name: "Eve Wilson",
    role: "Developer",
    department: "Engineering",
    age: 32,
    salary: 88000,
  },
  {
    id: 7,
    name: "Frank Lee",
    role: "Analyst",
    department: "Analytics",
    age: 29,
    salary: 72000,
  },
  {
    id: 8,
    name: "Grace Kim",
    role: "Manager",
    department: "Management",
    age: 38,
    salary: 95000,
  },
  {
    id: 9,
    name: "Hannah Clark",
    role: "Designer",
    department: "Creative",
    age: 26,
    salary: 62000,
  },
  {
    id: 10,
    name: "Ian Taylor",
    role: "Analyst",
    department: "Engineering",
    age: 31,
    salary: 75000,
  },
];

// Column helper
const columnHelper = createColumnHelper<PivotRow>();

// Available group-by fields and metrics
const groupByOptions = ["role", "department"] as const;
const metricOptions = ["count", "avgAge", "avgSalary"] as const;
export const Content = () => {
  const [groupBy, setGroupBy] =
    useState<(typeof groupByOptions)[number]>("role");
  const [selectedMetrics, setSelectedMetrics] = useState<
    (typeof metricOptions)[number][]
  >(["count", "avgAge"]);

  // Compute pivot data
  const pivotData = useMemo(() => {
    const grouped = rawData.reduce(
      (acc, curr) => {
        const key = curr[groupBy];
        if (!acc[key]) {
          acc[key] = { count: 0, totalAge: 0, totalSalary: 0 };
        }
        acc[key].count += 1;
        acc[key].totalAge += curr.age;
        acc[key].totalSalary += curr.salary;
        return acc;
      },
      {} as Record<
        string,
        { count: number; totalAge: number; totalSalary: number }
      >,
    );

    return Object.entries(grouped).map(([group, data]) => ({
      group,
      ...(selectedMetrics.includes("count") && { count: data.count }),
      ...(selectedMetrics.includes("avgAge") && {
        avgAge: data.totalAge / data.count,
      }),
      ...(selectedMetrics.includes("avgSalary") && {
        avgSalary: data.totalSalary / data.count,
      }),
    }));
  }, [groupBy, selectedMetrics]);

  // Dynamic columns based on selected metrics
  const columns = useMemo(() => {
    const cols: any = [
      columnHelper.accessor("group", {
        header: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
        cell: (info) => info.getValue(),
      }),
    ];
    if (selectedMetrics.includes("count")) {
      cols.push(
        columnHelper.accessor("count", {
          header: "Count",
          cell: (info) => info.getValue(),
        }),
      );
    }
    if (selectedMetrics.includes("avgAge")) {
      cols.push(
        columnHelper.accessor("avgAge", {
          header: "Average Age",
          cell: (info) => info.getValue()?.toFixed(1),
        }),
      );
    }
    if (selectedMetrics.includes("avgSalary")) {
      cols.push(
        columnHelper.accessor("avgSalary", {
          header: "Average Salary",
          cell: (info) => info.getValue()?.toFixed(0),
        }),
      );
    }
    return cols;
  }, [groupBy, selectedMetrics]);

  // Set up TanStack Table
  const table = useReactTable({
    data: pivotData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handle metric selection
  const toggleMetric = (metric: (typeof metricOptions)[number]) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric],
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Pivot Table: Employee Analysis
      </h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group By:
          </label>
          <select
            value={groupBy}
            onChange={(e) =>
              setGroupBy(e.target.value as (typeof groupByOptions)[number])
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {groupByOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metrics:
          </label>
          <div className="flex gap-2">
            {metricOptions.map((metric) => (
              <label key={metric} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric)}
                  onChange={() => toggleMetric(metric)}
                  className="mr-1"
                />
                <span className="text-sm">
                  {metric === "count"
                    ? "Count"
                    : metric === "avgAge"
                      ? "Avg Age"
                      : "Avg Salary"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 p-3 text-left font-semibold"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
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
                <td key={cell.id} className="border border-gray-300 p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
