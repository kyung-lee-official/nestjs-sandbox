import { Title } from "../Title";

const NUM_ROWS = 400;
const NUM_COLS = 15;

export const NoVirtTable = () => {
	return (
		<div className="p-4">
			<div className="mb-2 font-bold">
				Plain Table ({NUM_ROWS} rows × {NUM_COLS} columns)
			</div>
			<div className="overflow-x-auto border rounded bg-neutral-100 max-h-[400px] overflow-y-auto">
				<table className="min-w-full border-collapse">
					<thead className="sticky top-0 z-10 bg-neutral-200 border-b border-gray-300">
						<tr>
							{Array.from({ length: NUM_COLS }).map(
								(_, colIdx) => (
									<th
										key={colIdx}
										className="px-2 py-2 font-semibold text-xs border-r border-gray-300 last:border-r-0 text-left"
									>
										Col {colIdx + 1}
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: NUM_ROWS }).map((_, rowIdx) => (
							<tr
								key={rowIdx}
								className="bg-white border-b border-gray-200"
							>
								{Array.from({ length: NUM_COLS }).map(
									(_, colIdx) => (
										<td
											key={colIdx}
											className="px-2 py-1 text-xs border-r border-gray-100 last:border-r-0 truncate"
										>
											Row {rowIdx + 1}, Col {colIdx + 1}
											<Title
												id={Math.min(
													Math.max(
														1,
														(rowIdx * colIdx) % 100
													),
													100
												)}
											/>
										</td>
									)
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
