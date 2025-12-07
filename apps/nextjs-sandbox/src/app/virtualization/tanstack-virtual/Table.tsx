"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Title } from "./Title";

const NUM_ROWS = 400;
const NUM_COLS = 15;

export const Table = () => {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: NUM_ROWS,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 40,
	});

	return (
		<div className="p-4">
			<div className="mb-2 font-bold">
				Virtualized Table ({NUM_ROWS} rows × {NUM_COLS} columns)
			</div>
			<div
				ref={parentRef}
				className="h-[400px] overflow-y-auto border rounded bg-neutral-100"
			>
				<div
					className="relative w-full"
					style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
				>
					{/* Table header */}
					<div className="sticky top-0 z-10 flex bg-neutral-200 border-b border-gray-300">
						{Array.from({ length: NUM_COLS }).map((_, colIdx) => (
							<div
								key={colIdx}
								className="flex-1 px-2 py-2 font-semibold text-xs border-r border-gray-300 last:border-r-0"
							>
								Col {colIdx + 1}
							</div>
						))}
					</div>
					{/* Virtualized rows */}
					{rowVirtualizer.getVirtualItems().map((virtualRow) => (
						<div
							key={virtualRow.key}
							className="absolute left-0 w-full flex border-b border-gray-200 bg-white"
							style={{
								top: virtualRow.size,
								height: `${virtualRow.size}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							{Array.from({ length: NUM_COLS }).map(
								(_, colIdx) => (
									<div
										key={colIdx}
										className="flex-1 px-2 py-1 text-xs border-r border-gray-100 last:border-r-0 truncate"
									>
										Row {virtualRow.index + 1}, Col{" "}
										{colIdx + 1}
										<Title
											id={Math.min(
												Math.max(
													1,
													(virtualRow.index *
														colIdx) %
														100
												),
												100
											)}
										/>
									</div>
								)
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
